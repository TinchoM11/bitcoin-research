import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";

const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;

const importWallet = (privateKey: string) => {
  const keyPair = ECPair.fromWIF(privateKey, TESTNET);

  // Recover Bech32 Segwit Bitcoin Address
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: MAINNET,
  });

  console.log("Segwit Bitcoin Address From Imported: ", address);

  // Recover Legacy Bitcoin Address
  const { address: legacyAddress } = bitcoin.payments.p2pkh({
    pubkey: keyPair.publicKey,
    network: MAINNET,
  });

  console.log("Legacy Bitcoin Address From Imported: ", legacyAddress);
};

importWallet("cR2RdgV7w1kNGV2gMvYe5............."); // 
