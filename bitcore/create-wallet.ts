import { networks } from "bitcoinjs-lib";
// @ts-ignore
import { testnet, mainnet } from "bitcore-lib/lib/networks";
import * as bitcore from "bitcore-lib";
import dotenv from "dotenv";
import { add } from "date-fns";
dotenv.config();

/****
LEGACY ADDRESS CREATION
****/

const createWallet = () => {
  // Creates a Legacy Address on Testnet
  const privateKey = new bitcore.PrivateKey(); // Remove testnet to create a Mainnet address
  const address = privateKey.toAddress();

  console.log("------ Legacy Address ------");
  console.log("Private Key:", privateKey.toString());
  console.log("Address:", address.toString());
};

//createWallet();

// Import a Wallet using bitcore-lib
const importWallet = (privateKey: string) => {
  // Create a Private Key Object
  const pk = new bitcore.PrivateKey(privateKey, testnet);
  console.log("pk:", pk);
  const address = pk.toAddress();

  console.log("------ Imported Wallet ------");
  console.log("Private Key:", privateKey);
  console.log("Address:", address.toString());
};

// Validate a Legacy Address
const validateLegacyAddress = (address: string) => {
  try {
    const isValid = new bitcore.Address(address);
    console.log("------ Validate Legacy Address ------");
    console.log("Is Valid:", isValid);
  } catch (error) {
    console.log("------ Validate Legacy Address ------");
    console.log("Is Valid:", false);
  }
};

validateLegacyAddress("1NwZ74wJvqFMmLzAuoyc9EkhRnsr28n7ZD");
