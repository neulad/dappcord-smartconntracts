import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL || "",
      accounts: [process.env.PRIVATE_KEY || ""],
      chainId: 5,
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
  },
};

export default config;
