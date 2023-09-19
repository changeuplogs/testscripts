const fs = require('fs');

// Read the original JSON file
const rawData = fs.readFileSync('twitter_ta.json');
const data = JSON.parse(rawData);

// Function to simplify tweet data
const simplifyTweet = (tweet, author) => ({
  text: tweet.text,
  author: `@${author}`,
  engagement: tweet.public_metrics.like_count + tweet.public_metrics.bookmark_count * 5 + tweet.public_metrics.reply_count * 2
});

// Initialize simplified data object
const simplifiedData = [];

// Iterate through each repository
for (const [account, tweets] of Object.entries(data)) {
  if (Object.entries(tweets)) {
    const simplifiedTweets = tweets.map(tweet => simplifyTweet(tweet, account));
    simplifiedData.push(...simplifiedTweets);
  }
}


// Write the simplified data to a new JSON file
fs.writeFileSync('simplified_tweets.json', JSON.stringify(simplifiedData, null, 2));
