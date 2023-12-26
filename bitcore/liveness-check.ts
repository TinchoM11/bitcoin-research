import axios from "axios";

async function getLatestBlocksInfo(): Promise<any> {
  try {
    const response = await axios.get("https://blockstream.info/api/blocks/tip");
    return response.data;
  } catch (error) {
    console.error("Error getting latest block information:", error);
    throw error;
  }
}

// Ejemplo de uso
async function isBitcoinAlive() {
  try {
    const latestBlocksInfo = await getLatestBlocksInfo();
    console.log("Latest blocks info:", latestBlocksInfo);
    const lastBlockTimestamp = latestBlocksInfo[0].timestamp;
    const previousBlockTimestamp = latestBlocksInfo[1].timestamp;
    const timeDifference = lastBlockTimestamp - previousBlockTimestamp;
    console.log("Time difference between blocks:", timeDifference);
    if (timeDifference > 60 * 20) { // 20 minutes
      console.log("There is a problem with the network");
    }
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}

isBitcoinAlive();
