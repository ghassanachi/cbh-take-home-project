const crypto = require("crypto");
const { deterministicPartitionKey } = require("./dpk");

describe("deterministicPartitionKey", () => {
  it("Returns the literal '0' when given no or falsy input", () => {
    const trivialKeyNone = deterministicPartitionKey();
    expect(trivialKeyNone).toBe("0");

    [false, undefined, null].forEach((falsy) => {
      const trivialKeyBool = deterministicPartitionKey(falsy);
      expect(trivialKeyBool).toBe("0");
    });
  });

  it("Returns the event 'partitionKey' if it is a string and smaller or equal to  256 chars", () => {
    ["a".repeat(20), "b".repeat(256)].forEach((partitionKey) => {
      const partitionKeyResult = deterministicPartitionKey({ partitionKey });
      expect(partitionKeyResult).toBe(partitionKey);
    });
  });

  it("Returns a 'sha3-512' hash of the event 'partitionKey' if it is a string and longer than 256 chars", () => {
    ["c".repeat(257), "d".repeat(512)].forEach((partitionKey) => {
      const resultHash = crypto
        .createHash("sha3-512")
        .update(partitionKey)
        .digest("hex");
      const partitionKeyResult = deterministicPartitionKey({ partitionKey });
      expect(partitionKeyResult).toBe(resultHash);
    });
  });

  it("Returns a 'sha3-512' hash of the JSON serialized event if partitionKey is absent or falsy", () => {
    [undefined, false, null, "absent"].forEach((partitionKey) => {
      let event = { data: "payload" };
      if (partitionKey !== "absent") {
        event = { ...event, partitionKey };
      }
      const resultHash = crypto
        .createHash("sha3-512")
        .update(JSON.stringify(event))
        .digest("hex");
      const partitionKeyResult = deterministicPartitionKey(event);
      expect(partitionKeyResult).toBe(resultHash);
    });
  });

  it("Returns the JSON serialized event partitionKey if it is provided and truthy but not a string", () => {
    [1234, { data: "Clipboard Health" }].forEach((partitionKey) => {
      const partitionKeyResult = deterministicPartitionKey({ partitionKey });
      expect(partitionKeyResult).toBe(JSON.stringify(partitionKey));
    });
  });

  it("Throw an error if the provided partitionKey is a function", () => {
    // [INT] NOTE: Old version crashes at runtime with this test since `JSON.strinfify(() => {})` returns undefined.
    // New version throws an error instead
    expect(() => {
      deterministicPartitionKey({ partitionKey: () => {} });
    }).toThrow();
  });
});
