import axios from "axios";

const getBitcoinBalance = async (address: string) => {
  const response = await axios.get(
    `https://blockchain.info/rawaddr/${address}`
  );
  console.log(response.data.final_balance / 100000000); // Bitcoin is divisible by 100 million (1 satoshi)
};

//getBitcoinBalance("bc1qvzadkvkdg9579ay9racdjr3t67s06pu8ajjq0c");

const getTestnetBalance = async (address: string) => {
  const response = await axios.get(
    `https://api.blockchair.com/bitcoin/testnet/dashboards/address/${address}`
  );
  console.log(response.data); // Bitcoin is divisible by 100 million (1 satoshi)
};

getTestnetBalance("bc1qf0k4t4gulsv3ls03kjyj5n5u8l6hhgsgg3jqrj");