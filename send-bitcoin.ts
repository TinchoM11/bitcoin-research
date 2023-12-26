import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "tiny-secp256k1";
import axios from "axios";

const ECPair = ECPairFactory(ecc);
const TESTNET = bitcoin.networks.testnet;
const MAINNET = bitcoin.networks.bitcoin;
async function transferBitcoin(
  privateKeyWIF: string,
  toAddress: string,
  amount: number
): Promise<string> {
 // Creates an instance of the ECPair from the private key
  const keyPair = ECPair.fromWIF(privateKeyWIF, TESTNET);

  // Recover Bech32 Segwit Bitcoin Address
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: keyPair.publicKey,
    network: MAINNET,
  });
  console.log("Dirección de origen:", address);
  let fromAddress = "bc1qvzadkvkdg9579ay9racdjr3t67s06pu8ajjq0c"; // I have balances, just to test i hardcode here
  // Obtener UTXOs (Transacciones no gastadas)
  const utxos = await getUnspentOutputs(fromAddress);
  console.log("UTXOs:", utxos);
  
  // Crear un borrador de transacción parcialmente firmado (Psbt)
  const psbt = new bitcoin.Psbt();
  
  // Agregar las entradas (inputs) a la transacción
  utxos.forEach((utxo) => {
    console.log("utxo:", utxo);
    psbt.addInput({
      hash: utxo.txid,
      index: utxo.vout,
      sequence: 0xffffffff, // Can variate depending on the use case
      witnessUtxo: {
        script: Buffer.from(utxo.scriptPubKey, "hex"),
        value: utxo.value,
      },
    });
  });

  // Add the outputs (outputs) to the transaction
    psbt.addOutput({
      address: toAddress,
      value: amount,
    });

    // Sign the transaction
    utxos.forEach((utxo, index) => {
      psbt.signInput(index, keyPair);
      psbt.finalizeInput(index);
    });

    // Get the hex transaction
    const hexTransaction = psbt.extractTransaction().toHex();

    return hexTransaction;
  return "string2";
}

// Function to get the unspent outputs (UTXOs) for an address
async function getUnspentOutputs(address: string): Promise<any[]> {
  console.log("address getting utxos:", address);
  const response = await axios.get(
    `https://blockstream.info/api/address/${address}/utxo`
  );
  const utxos = response.data;
  return utxos;
}

// Ejemplo de uso
const privateKeyWIF = "cR2RdgV7w1kNGV..........."; // 
const toAddress = "bc1q2nndvuj3e6evgtytyd5ett804hq0ct4nxl3mkw"; //Replace with destination address
const amount = 100000; // Satoshis to send

transferBitcoin(privateKeyWIF, toAddress, amount)
  .then((hexTransaction) => console.log("Transaction Hex:", hexTransaction))
  .catch((error) => console.error("Error:", error));
