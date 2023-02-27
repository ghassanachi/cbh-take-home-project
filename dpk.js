const crypto = require("crypto");

const TRIVIAL_PARTITION_KEY = "0";
const MAX_PARTITION_KEY_LENGTH = 256;

/**
 * Generate the 'sha3-512' hash of the data that is provided;
 * @param data {string}
 * @returns {string} 'sha3-512' hash of the data
 */
function generateHash(data) {
  return crypto.createHash("sha3-512").update(data).digest("hex");
}

/**
 * Generate deterministic partition key based on event information.
 * @param event {object | string | null | undefined | boolean | number }
 * @returns {string} partition key for the event
 */
function deterministicPartitionKey(event) {
  // [INT] If event is not passed or falsy, then return the TRIVIAL_PARTITION_KEY
  if (!event) return TRIVIAL_PARTITION_KEY;

  // [INT] If partitionKey is not present or not passed, then return the hash of the JSON serialized data
  if (!event.partitionKey) return generateHash(JSON.stringify(event));

  // [INT] If partitionKey is not serializable by JSON.stringify (ie: function) then throw an error
  if (typeof event.partitionKey === "function") throw new Error("partitionKey cannot be a function");

  // [INT] If event partitionKey is not a string, then JSON serialize it;
  const partitionKey = typeof event.partitionKey === "string" ? event.partitionKey : JSON.stringify(event.partitionKey);

  // [INT] If event partitionKey is too long then generate a hash of it
  return partitionKey.length > MAX_PARTITION_KEY_LENGTH ? generateHash(partitionKey) : partitionKey;
}

// [INT]: Another personal preference here, I like to re-export my functions
// since a number of tooling (Like GitHub Search) rely on syntax for their context
// and this patterns helps a little with this. However, most of the time I use ES modules
// instead of CommonJS, and there it is less of a problem
module.exports = {
  deterministicPartitionKey,
};
