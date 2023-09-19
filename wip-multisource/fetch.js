const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const Twitter = require('twitter-v2');

const GITHUB_API_BASE_URL = 'https://api.github.com';
const ORG_NAME = 'tryghost';
const OUTPUT_FILE = `${ORG_NAME}_activity.json`;
const TWITTER_HANDLE = '';
const DAYS = 30;

process.env.TWITTER_BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAAMQqoQEAAAAAGwcxrJngopo3xC0FrQYi%2FaJaqoU%3DJWuTKNEhqFLolpH4NsKzaGGtVAmAleBPsPPQApGnKgFJPN6hVz';
process.env.GITHUB_TOKEN = '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';


const PERSONAL_ACCESS_TOKEN = process.env.GITHUB_TOKEN || '';
const TWITTER_API_CREDENTIALS = {
  bearer_token: process.env.TWITTER_BEARER_TOKEN
};

const twitterClient = new Twitter(TWITTER_API_CREDENTIALS);

const sinceDate = moment().subtract(DAYS, 'days').toISOString();

const axiosInstance = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Authorization': PERSONAL_ACCESS_TOKEN ? `token ${PERSONAL_ACCESS_TOKEN}` : '',
    'User-Agent': 'axios'
  }
});

async function fetchRepos() {
  const repos = [];
  let page = 1;
  while (true) {
    const response = await axiosInstance.get(`/orgs/${ORG_NAME}/repos?page=${page}&per_page=100`);
    if (response.data.length === 0) break;
    repos.push(...response.data.map(repo => repo.name));
    page++;
  }
  return repos;
}

async function fetchGitHubActivity(repoName) {
  const types = ['commits', 'pulls', 'issues', 'releases', 'milestones', 'contributors'];
  const activity = {};
  for (const type of types) {
    try {
      const response = await axiosInstance.get(`/repos/${ORG_NAME}/${repoName}/${type}?since=${sinceDate}`);
      activity[type] = response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        activity[type] = 'Not Available';
      } else {
        console.error(`Error fetching ${type} for ${repoName}:`, error);
      }
    }
  }
  return activity;
}

async function getTwitterId() {
  const userInfo = await twitterClient.get(`users/by/username/${TWITTER_HANDLE}`);
  return userInfo.data.id;
}

async function fetchTwitterActivity(twitterId) {
  const { data } = await twitterClient.get(`users/${twitterId}/tweets?start_time=${sinceDate}&tweet.fields=public_metrics&max_results=100`);
  return data;
}

(async () => {
  const repos = await fetchRepos();
  const consolidatedActivity = {};

  for (const repo of repos) {
    const activity = await fetchGitHubActivity(repo);
    consolidatedActivity[repo] = activity;
  }

  if (TWITTER_HANDLE) {
    const twitterId = await getTwitterId();

    const tweets = await fetchTwitterActivity(twitterId);
    consolidatedActivity['tweets'] = tweets;
  } 

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(consolidatedActivity, null, 2));
  console.log(`Activity data written to ${OUTPUT_FILE}`);
})();