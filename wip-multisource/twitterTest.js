const Twitter = require('twitter-v2');

const twitterClient = new Twitter({
  bearer_token: 'AAAAAAAAAAAAAAAAAAAAAMQqoQEAAAAAGwcxrJngopo3xC0FrQYi%2FaJaqoU%3DJWuTKNEhqFLolpH4NsKzaGGtVAmAleBPsPPQApGnKgFJPN6hVz',
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
