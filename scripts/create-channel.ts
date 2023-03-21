import { ethers } from "hardhat";
import { Dappcord } from "../typechain-types";

async function main() {
  const dappcord = await ethers.getContract<Dappcord>("Dappcord");

  await dappcord.createChannel("Angels", 1000);
}

main()
  .then(() => {
    console.log(`🦧 Successfully created the channel!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(`⚠️ Error took place: ${err.message}`);
    process.exit(1);
  });
