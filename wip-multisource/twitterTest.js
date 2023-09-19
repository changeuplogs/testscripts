const Twitter = require('twitter-v2');

const twitterClient = new Twitter({
  bearer_token: '',
});

async function getTwitterId() {
  try {
    const userInfo = await twitterClient.get(`users/by/username/Uniswap`);
    console.log(userInfo.data.id);
  } catch (error) {
    console.error('Error fetching Twitter ID:', error);
  }
}

getTwitterId();
