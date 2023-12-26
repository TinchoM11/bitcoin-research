import axios from "axios";
import * as bitcore from "bitcore-lib";
const TESTNET = true;

const sendBitcoin = async (receiverAddress: string, amountToSend: number) => {
  try {
    const privateKey = "6756e6564d3c74...................."; // Private key of the sender
    const sourceAddress = "mvWqrftxCJa5eSKp229gkZbMf2XXrfZe9p"; // Address of the sender
    // We can also get the public key from the private key, just for testing I passing it directly

    // Convert address to bitcore address object so it can be used with the library
    const bitcoreAddress = new bitcore.Address(
      sourceAddress,
      bitcore.Networks.testnet
    );
    const satoshiToSend = amountToSend * 100000000;
    let fee = 0;
    let inputCount = 0;
    let outputCount = 2; // 1 output for the receiver, 1 for the change

    const recommendedFee = await axios.get(
      "https://mempool.space/api/v1/fees/recommended"
    );
    console.log("Recommended Fee:", recommendedFee.data);

    const transaction = new bitcore.Transaction();
    let totalAmountAvailable = 0; // We are going to calculate the total amount available to spend after we get the UTXOs

    let inputs = [];
    const resp = await axios({
      method: "GET",
      url: `https://blockstream.info/testnet/api/address/${sourceAddress}/utxo`,
    });
    const utxos = resp.data;

    // UTXOs are unspent transaction outputs
    // To build a transaction, you need to know the UTXOs for the address you are sending from
    // And with that, you can calculate the total amount available to spend
    for (const utxo of utxos) {
      let input: any = {};
      input.satoshis = utxo.value;
      input.script =
        bitcore.Script.buildPublicKeyHashOut(bitcoreAddress).toHex();
      input.address = sourceAddress;
      input.txId = utxo.txid;
      input.outputIndex = utxo.vout;
      totalAmountAvailable += utxo.value;
      inputCount += 1;
      // @ts-ignore
      inputs.push(input);
    }
    console.log("Inputs:", inputs);

    /**
     * In a bitcoin transaction, the inputs contribute 180 bytes each to the transaction,
     * while the output contributes 34 bytes each to the transaction. Then there is an extra 10 bytes you add or subtract
     * from the transaction as well.
     * */
    const transactionSize =
      inputCount * 180 + outputCount * 34 + 10 - inputCount;

    fee = (transactionSize * recommendedFee.data.hourFee) / 3; // satoshi per byte
    if (TESTNET) {
      fee = transactionSize * 1; // 1 sat/byte is fine for testnet
      if (fee < 667) {
        fee = 667; // 0.00000667 BTC/kB
      }
    }
    if (totalAmountAvailable - satoshiToSend - fee < 0) {
      throw new Error("Balance is too low for this transaction");
    }

    // *** WE CONSTRUCT THE TRANSACTION OBJECT NOW ***
    //Set transaction input
    transaction.from(inputs);

    // set the recieving address and the amount to send
    transaction.to(receiverAddress, satoshiToSend);

    // Set change address - Address to receive the left over funds after transfer
    transaction.change(sourceAddress);

    // Set fee manually (optional)
    transaction.fee(Math.round(fee));

    // Sign transaction with your private key
    transaction.sign(privateKey);

    // serialize Transactions
    const serializedTransaction = transaction.serialize();

    // Send transaction
    const result = await axios({
      method: "POST",
      url: `https://blockstream.info/testnet/api/tx`,
      data: serializedTransaction,
    });
    console.log("Transaction Result:", result.data);
    return result.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

sendBitcoin("mnjMpsca7Ndz7NMagNbhmXsZ9t7qcsXyd3", 0.0001);
