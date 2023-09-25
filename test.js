const chai = require('chai');
const { MongoClient } = require('mongodb');

const { expect } = chai;

// MongoDB connection URI
const mongoURI = 'mongodb://localhost:27017/your-database-name';

describe('MongoDB Tests', () => {
  let db;
  let client;

  before(async () => {
    // Connect to the MongoDB instance before running tests
    client = await MongoClient.connect(mongoURI, { useNewUrlParser: true });
    db = client.db();
  });

  after(async () => {
    // Close the MongoDB connection after tests
    await client.close();
  });

  it('should insert a document into the collection', async () => {
    const collection = db.collection('your-collection-name');
    const document = { key: 'value' };
    const result = await collection.insertOne(document);
    expect(result.insertedCount).to.equal(1);
  });

  it('should find a document in the collection', async () => {
    const collection = db.collection('your-collection-name');
    const document = await collection.findOne({ key: 'value' });
    expect(document).to.exist;
  });
});
