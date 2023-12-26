import axios from "axios";

const getTxReceipt = async (txHash: string) => {
    // Remove /testnet to use mainnet
  const response = await axios.get(`https://blockstream.info/testnet/api/tx/${txHash}`);
  const status = response.data.status.confirmed;
  console.log(
    `Transaction ${txHash} is ${status ? "confirmed" : "unconfirmed"}`
  );
};

getTxReceipt(
  "f3d656e52ada0092c915178d6747ffafc7c46dca9078628bcec55040b1486414"
);
