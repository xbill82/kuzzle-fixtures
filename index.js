const KuzzleSDK = require("kuzzle-sdk");
const axios = require("axios");
const faker = require("faker");

const main = async () => {
  console.log("Resetting database...");
  await axios.default.post("http://localhost:7512/admin/_resetDatabase");

  const kuzzle = new KuzzleSDK.Kuzzle("websocket", {
    host: "localhost",
    port: 7512
  });

  await kuzzle.connect();

  console.log("Creating Index...");
  await kuzzle.index.create("testindex");

  console.log("Creating Collection...");
  await kuzzle.collection.create("testindex", "testcollection", {
    properties: {
      firstName: {
        type: "text",
        fields: {
          keyword: {
            type: "keyword",
            ignore_above: 256
          }
        }
      },
      job: {
        type: "text",
        fields: {
          keyword: {
            type: "keyword",
            ignore_above: 256
          }
        }
      },
      lastName: {
        type: "keyword",
        fields: {
          keyword: {
            type: "keyword",
            ignore_above: 256
          }
        }
      }
    }
  });

  console.log("Creating Documents...");
  for (let i = 0; i < 1000; i++) {
    await kuzzle.document.create("testindex", "testcollection", null, {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      job: faker.name.jobTitle()
    });
  }

  return;
};

module.exports = main().then(() => {
  console.log("Done.");
  process.exit();
});
