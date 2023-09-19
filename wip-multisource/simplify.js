const fs = require('fs');

// Read the original JSON file
const rawData = fs.readFileSync('tryghost_activity.json');
const data = JSON.parse(rawData);

// Function to simplify and flatten GitHub activity data
const simplifyAndFlattenActivity = (repo, type, activity) => {
  const baseInfo = {
    repo,
    type
  };
  switch (type) {
    case 'commits':
      return {
        ...baseInfo,
        message: activity.commit.message,
        comment_count: activity.commit.comment_count
      };
    case 'pulls':
      return {
        ...baseInfo,
        title: activity.title,
        body: activity.body
      }
    case 'issues':
      return {
        ...baseInfo,
        title: activity.title,
        body: activity.body,
        reactions_count: activity.reactions.total_count
      };
    default:
      return {
        ...baseInfo,
        title: activity.title || activity.name || '',
        body: activity.body || ''
      };
  }
};

// Function to simplify tweet data
const simplifyTweet = (tweet) => ({
  text: tweet.text,
  engagement: tweet.public_metrics.like_count + tweet.public_metrics.bookmark_count * 5 + tweet.public_metrics.reply_count * 2
});

// Initialize simplified data object
const simplifiedData = { repos: [], tweets: [] };

// Iterate through each repository
for (const [repo, repoData] of Object.entries(data)) {
  for (const [type, activities] of Object.entries(repoData)) {
    if (Array.isArray(activities)) {
      const simplifiedActivities = activities.map(activity => simplifyAndFlattenActivity(repo, type, activity));
      simplifiedData.repos.push(...simplifiedActivities);
    } else {
      console.warn(`Skipping ${type} in ${repo} because it's not an array.`);
    }
  }
}

// Simplify tweets
if (data.tweets) {
  simplifiedData.tweets = data.tweets.map(simplifyTweet);
}

// Write the simplified data to a new JSON file
fs.writeFileSync('simplified_tryghost_activity.json', JSON.stringify(simplifiedData, null, 2));
