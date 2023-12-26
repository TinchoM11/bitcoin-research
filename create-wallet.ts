import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;

// Generates a Bech32 Segwit Bitcoin Address
const createBitcoinAddress = () => {
  const keyPair = ECPair.makeRandom({ network: TESTNET }); // We can use MAINNET here as well
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: MAINNET,
  });

  console.log("Segwit Bitcoin Address: ", address);
  console.log("Segwit Bitcoin Private Key: ", keyPair.toWIF());

  return { address, keyPair };
};

createBitcoinAddress();

// Example Response MAINNET
// Segwit Bitcoin Address:  bc1q2nndvuj3e6evgtytyd5ett804hq0ct4nxl3mkw
// Segwit Bitcoin Private Key:  L2jRatiPwvc8K2EeuYY9TYU7DNyhhuccVm...............

const createLegacyBitcoinAddress = () => {
  const keyPair = ECPair.makeRandom({ network: MAINNET });
  const { address } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: MAINNET,
  });

  console.log("Legacy Bitcoin Address: ", address);
  console.log("Legacy Bitcoin Private Key: ", keyPair.toWIF());

  return { address, keyPair };
};

//createLegacyBitcoinAddress();
