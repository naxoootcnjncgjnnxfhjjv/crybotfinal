/**
 * verifyTonContract.js
 *
 * This module provides a function to verify whether a given TON contract
 * (identified by its user‑friendly address) matches one of a set of known
 * code hashes that have been audited and published via the TON Contract
 * Verifier.  If the contract’s code hash matches one of the known hashes,
 * the function resolves with an object indicating that the contract is
 * verified and includes the matching hash.  Otherwise it resolves with an
 * object indicating that the contract is not verified and returns the
 * computed code hash for reference.
 *
 * Usage example:
 *
 *   const verifyTonContract = require('./verifyTonContract');
 *   (async () => {
 *     const result = await verifyTonContract('EQChtGxrxo1H74kGde0GNsSKWYG_rhGMKNco-opmWQ1B-3Vg');
 *     if (result.verified) {
 *       console.log(`Verified contract with hash ${result.codeHash}`);
 *     } else {
 *       console.log(`Unverified contract, code hash = ${result.codeHash}`);
 *     }
 *   })();
 */

// Import node-fetch for making HTTP requests.  In a Node 18+ environment
// fetch() is available natively; otherwise install `node-fetch` and
// uncomment the following line:
// const fetch = require('node-fetch');

const { Cell } = require('@ton/core');

// List of known verified code hashes published via orbs.com on the TON
// Contract Verifier.  If the computed code hash for a contract matches
// one of these values, the contract can be considered officially
// verified.  See the Verifier UI for the latest list of hashes.
const KNOWN_VERIFIED_HASHES = [
  'edaMyPS3LRFd28UVd7qP6YK1Y/JWrW4+hT+ydMO8TRY=',
  '0fjyUVE88fJa2IgWpNjjz6O9TC8ftFoSwb+DI1HvFM8=',
  '1fWcZGowOI0gTHZyTPhTX2s3iBnMSdqsNqJYCWNj0A4=',
];

/**
 * Fetches the raw account state for a given address from toncenter.com and
 * computes the code hash of the contract.  Returns an object describing
 * whether the contract is verified and the calculated hash value.
 *
 * Note: this function relies on the `@ton/core` library to decode the
 * contract’s Bag‑of‑Cells (BOC) and compute its hash.  Ensure that your
 * project has @ton/core installed (`npm install @ton/core`).  The
 * toncenter.com endpoint used here does not require an API key for
 * read‑only queries but throttling limits may apply.  If you have a
 * toncenter API key, you can append `&api_key=YOUR_KEY` to the request URL.
 *
 * @param {string} address User‑friendly TON address to verify.
 * @returns {Promise<{verified: boolean, codeHash: string, knownHash: string|null}>}
 */
async function verifyTonContract(address) {
  if (!address || typeof address !== 'string') {
    throw new Error('verifyTonContract: address must be a non‑empty string');
  }
  // Query toncenter for extended information to retrieve the raw code BOC.
  const url = `https://toncenter.com/api/v2/getExtendedAddressInformation?address=${encodeURIComponent(address)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error from toncenter: ${response.status} ${response.statusText}`);
  }
  const json = await response.json();
  if (!json.ok) {
    throw new Error(`TON API responded with error: ${JSON.stringify(json.error || json)}`);
  }
  const accountState = json.result?.account_state;
  if (!accountState || !accountState.code) {
    // If there is no code, the contract hasn’t been deployed yet.
    return { verified: false, codeHash: null, knownHash: null };
  }
  // Decode the BOC and compute its hash.
  const boc = Buffer.from(accountState.code, 'base64');
  const cells = Cell.fromBoc(boc);
  if (cells.length === 0) {
    throw new Error('Failed to decode code BOC');
  }
  const codeCell = cells[0];
  const hashBuffer = codeCell.hash();
  const codeHash = Buffer.from(hashBuffer).toString('base64');
  const verified = KNOWN_VERIFIED_HASHES.includes(codeHash);
  return {
    verified,
    codeHash,
    knownHash: verified ? codeHash : null,
  };
}

module.exports = verifyTonContract;