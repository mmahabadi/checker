const { Client } = require('pg')
const { log } = require('../helpers/log')
const { makeHash } = require('../helpers/crypto')

let client = null;
const connect = async () => {
  if(!client) {
    if(!process.env.PG_CONNECTION_URL) throw new Error("No DB!");

    log("Connecting to db...")
    client = new Client({
      connectionString: process.env.PG_CONNECTION_URL,
      idle_in_transaction_session_timeout: 400,
    });
    try {
      await client.connect();
      log("Connected!")
    } catch (e) {
      log("Connection failed");
      throw new Error("NO DB!");
    }
  }
  return client;
}

const fetchSentMessages = async () => {
  try {
    await connect();

    log("Fetching messages...")
    const res = await client.query('SELECT * FROM sent_messages');

    log("Fetched messages: ", res.rows);

    return res?.rows;
  } catch (e) {
    log("Error fetchSentMessages", e.message);
    return [];
  }
}

const fetchSentMessageByHash = async (message) => {
  try {
    await connect();

    log("Fetching message by hash: ", makeHash(message))
    const res = await client.query('SELECT * FROM sent_messages WHERE hash = $1 ORDER BY id DESC LIMIT 1', [makeHash(message)])
    return res?.rows[0];
  } catch (e) {
    log("Error fetchSentMessageByHash", e.message);
    return null;
  }
}

const insertMessage = async (message, channel) => {
  try {
    await connect();

    log("Inserting message: ", makeHash(message), " in ", channel)
    await client.query('INSERT INTO sent_messages (hash, hits, message, channel) VALUES ($1, $2, $3, $4)', [makeHash(message), 0, message, channel]);
  } catch (e) {
    log("error insertMessage", e.message);
  }
}

const increaseMessageHit = async (message, newHits, channel) => {
  try {
    await connect();

    log("Increasing hit for: ", makeHash(message), ' in: ', channel)
    await client.query('UPDATE sent_messages SET hits = $1 WHERE hash = $2 AND channel = $3', [newHits, makeHash(message), channel]);
  } catch (e) {
    log("error increaseMessageHit", e.message);
  }
}

const disconnect = () => {
  if (client) {
    log("Disconnecting DB...")
    client.end();
    client = null;
    log("DB Disconnected!")
  }
}

module.exports = {
  client,
  connect,
  fetchSentMessages,
  fetchSentMessageByHash,
  insertMessage,
  increaseMessageHit,
  disconnect
}