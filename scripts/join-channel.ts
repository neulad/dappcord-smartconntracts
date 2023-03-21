import { ethers } from "hardhat";
import { Dappcord } from "../typechain-types";

async function main() {
  const dappcord = await ethers.getContract<Dappcord>("Dappcord");

  await dappcord.mint(0, { value: 1000 });
}

main()
  .then(() => {
    console.log(`🦓 Successfully joined!`);
    process.exit(0);
  })
  .catch((err) => {
    console.error(`⚠️ Errror occured: ${err.message}`);
    process.exit(1);
  });
