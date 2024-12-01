const express = require('express');
const { Connection, PublicKey } = require('@solana/web3.js');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

// Create a connection to the Solana devnet cluster using Ankr RPC endpoint
const connection = new Connection('https://rpc.ankr.com/solana_devnet');

// Helper function to fetch transaction details with retries
async function fetchTransactionWithRetry(signature, retries = 5, delay = 1000) {
  try {
    const transaction = await connection.getParsedTransaction(signature);
    return transaction;
  } catch (error) {
    if (retries === 0) throw error;
    console.warn(`Retrying transaction fetch for ${signature} after ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    return fetchTransactionWithRetry(signature, retries - 1, delay * 2);
  }
}

// Helper function to fetch all signatures with pagination
async function fetchAllSignatures(publicKey, before = null, limit = 1000) {
  let allSignatures = [];
  let options = { limit };
  if (before) options.before = before;

  while (true) {
    const signatures = await connection.getSignaturesForAddress(publicKey, options);
    if (signatures.length === 0) break;
    allSignatures = allSignatures.concat(signatures);
    if (signatures.length < limit) break;
    options.before = signatures[signatures.length - 1].signature;
  }

  return allSignatures;
}

// Endpoint to fetch transaction history for a given wallet address
app.get('/api/transactions/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const publicKey = new PublicKey(address);

    // Fetch all signatures for the address with pagination
    const signatures = await fetchAllSignatures(publicKey);

    // Fetch transaction details for each signature with retries
    const transactions = await Promise.all(
      signatures.map(async (signatureInfo) => {
        const transaction = await fetchTransactionWithRetry(signatureInfo.signature);
        return transaction;
      })
    );

    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});