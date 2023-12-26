import axios from "axios";
import bitcore from "bitcore-lib";

let walletAddress = "bc1qjmups43lx66hsxce9erpucljgxwlg5ckmsmeer";
let walletPK = "cUnUvvaS..................." // Private key of the sender

let receiverAddress = "bc1q7qlzk5cst7acfexyuu6q6ydtd9pncq4xce3kyl"; // 

const sendBitcoin = async (
  fromAddress: string,
  toAddress: string,
  privateKeyWIF: string,
  amount: number
) => {
  // Connect to a Node
  const network = "BTCTEST";

  // Get UTXOs for the fromAddress
  const utxos = await axios.get(
    `https://api.blockcypher.com/v1/btc/test3/addrs/${fromAddress}?unspentOnly=true`
  );
    console.log("UTXOs:", utxos.data);
};

sendBitcoin(walletAddress, receiverAddress, walletPK, 0.0001);
