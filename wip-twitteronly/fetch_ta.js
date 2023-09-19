const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const Twitter = require('twitter-v2');
const sleep = require('util').promisify(setTimeout);

const OUTPUT_FILE = 'twitter_ta.json';
const TWITTER_HANDLES = ['CryptoDonAlt', 'ByzGeneral', 'CryptoCred', 'QuantMeta', 'AltcoinSherpa', 'inmortalcrypto', 'permabearXBT', 'SmallCapScience', 'castillotrading', 'MuroCrypto', 'Crypto_Chase', 'damskotrades', 'Ninjascalp', 'MacroCRG', 'TheCrowtrades'];

process.env.TWITTER_BEARER_TOKEN = '';

const TWITTER_API_CREDENTIALS = {
  bearer_token: process.env.TWITTER_BEARER_TOKEN
};

const twitterClient = new Twitter(TWITTER_API_CREDENTIALS);

const sinceDate = moment().subtract(3, 'days').toISOString();

async function getTwitterId(handle) {
  const userInfo = await twitterClient.get(`users/by/username/${handle}`);
  return userInfo.data.id;
}

async function fetchTwitterActivity(twitterId) {
  const { data } = await twitterClient.get(`users/${twitterId}/tweets?start_time=${sinceDate}&tweet.fields=public_metrics&max_results=100`);
  return data;
}

(async () => {
  const consolidatedActivity = {};

  for (const handle of TWITTER_HANDLES) {
    try {
      const twitterId = await getTwitterId(handle);
      const tweets = await fetchTwitterActivity(twitterId);
      consolidatedActivity[handle] = tweets;
    } catch (error) {
      if (error.code === 429) {
        console.log('Rate limit reached. Waiting for 15 minutes.');
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(consolidatedActivity, null, 2));
        await sleep(15 * 60 * 1000); // Wait for 15 minutes
        continue; // Retry
      } else {
        console.error(`An error occurred: ${error}`);
      }
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(consolidatedActivity, null, 2));
  console.log(`Activity data written to ${OUTPUT_FILE}`);
})();