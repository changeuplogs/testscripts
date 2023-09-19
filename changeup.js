require('dotenv').config();
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');

const GITHUB_API_BASE_URL = 'https://api.github.com';
const REPO_NAME = 'mapbox-gl-js';
const OWNER_NAME = 'mapbox';
const OUTPUT_FILE = `outputs/${REPO_NAME}_activity.json`;
const DAYS = 7;

const PERSONAL_ACCESS_TOKEN = process.env.GITHUB_TOKEN || '';

const sinceDate = moment().subtract(DAYS, 'days').toISOString();

const axiosInstance = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Authorization': PERSONAL_ACCESS_TOKEN ? `token ${PERSONAL_ACCESS_TOKEN}` : '',
    'User-Agent': 'axios'
  }
});

async function fetchGitHubActivity(repoName) {
  const types = ['commits', 'pulls', /*'issues',*/ 'releases', 'milestones'/*, 'contributors'*/];
  const activity = {};
  for (const type of types) {
    try {
      const response = await axiosInstance.get(`/repos/${OWNER_NAME}/${repoName}/${type}?since=${sinceDate}`);
      activity[type] = response.data;
    } catch (error) {
      console.error(`Error fetching ${type} for ${repoName}:`, error);
    }
  }
  return activity;
}

(async () => {
  const activity = await fetchGitHubActivity(REPO_NAME);
  const simplifiedData = { repos: [] };

  for (const [type, activities] of Object.entries(activity)) {
    if (Array.isArray(activities)) {
      const simplifiedActivities = activities.map(activity => ({
        repo: REPO_NAME,
        type,
        title: activity.title || activity.name || '',
        body: activity.body || '',
        message: activity.commit ? activity.commit.message : '',
        comment_count: activity.commit ? activity.commit.comment_count : 0,
        reactions_count: activity.reactions ? activity.reactions.total_count : 0
      }));
      simplifiedData.repos.push(...simplifiedActivities);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(simplifiedData, null, 2));
  console.log(`Activity data written to ${OUTPUT_FILE}`);
})();