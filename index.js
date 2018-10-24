#!/usr/bin/env node

const KuzzleSDK = require("kuzzle-sdk");
const axios = require("axios");
const faker = require("faker");
const program = require("commander");
const version = require("./package.json").version;

const main = async () => {
  program
    .version(version)
    .option("-h, --host <name>", "Kuzzle hostname (default: localhost)")
    .option("-p, --port <port>", "Kuzzle port (default: 7512)", parseInt)
    .option(
      "-i, --index <name>",
      "The name of the index to create (default: testindex)"
    )
    .option(
      "-c, --collection <name>",
      "The name of the collection to create (default: testcollection)"
    )
    .option(
      "-n, --items <number>",
      "The number of items to be added as fixtures (default: 100)",
      parseInt
    )
    .option(
      "-m, --mapping <path>",
      "The path to a file containing the mapping for the collection"
    )
    .parse(process.argv);

  const host = program.host || "localhost";
  const port = program.port || 7512;
  const collection = program.collection || "testcollection";
  const index = program.index || "testindex";
  const items = program.items || 100;
  const mappingPath = program.mapping || null;

  console.log("Resetting database...");
  await axios.default.post(`http://${host}:${port}/admin/_resetDatabase`);

  const kuzzle = new KuzzleSDK.Kuzzle("websocket", {
    host: host,
    port: port
  });

  await kuzzle.connect();

  console.log("Creating Index...");
  await kuzzle.index.create(index);

  let mapping = null;

  if (mappingPath) {
    console.log("Loading Mapping...");
    mapping = require(mappingPath);
  }

  console.log("Creating Collection...");
  await kuzzle.collection.create(index, collection, mapping);

  console.log("Creating Documents...");
  for (let i = 0; i < items; i++) {
    await kuzzle.document.create(index, collection, null, {
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
