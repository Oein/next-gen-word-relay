import {
  connect,
  disconnect,
  getWordsCollection,
} from "../../common-backend/src/db";

const FILE = "./kor.json";
const lang = 0;

await connect();

let json = await Bun.file(FILE).json();

const set = new Set();
json = json.filter((word: [string, string[]]) => {
  if (set.has(word[0])) {
    console.log("Duplicate word:", word[0]);
    return false;
  }
  set.add(word[0]);
  return true;
});

const collection = getWordsCollection();

console.log("Inserting words...");
const got = await collection.insertMany(
  json.map((word: [string, string[]]) => {
    return {
      word: word[0],
      lang,
      tags: word[1],
    };
  })
);
console.log("Inserted", got.insertedCount, "words");

await disconnect();
