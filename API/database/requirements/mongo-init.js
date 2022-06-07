const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");

  try {
    await client.connect();
    const db = await client.db("shac-database");
    await db.createCollection("admin");
    await db.createCollection("user");
    await db.createCollection("student-record");
    await db.createCollection("degree-program");
    await db.createCollection("semester");
    await db.createCollection("course");
    await db.createCollection("ge-electives");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

main().catch(console.error);