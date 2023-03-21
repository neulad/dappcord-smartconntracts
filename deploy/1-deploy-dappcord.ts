import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import * as hre from "hardhat";
import { ethers } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const deployer = (await ethers.getSigners())[0];
  const { deploy, log } = hre.deployments;

  const DappcordFactory = await ethers.getContractFactory("Dappcord");
  const gasPrice = await deployer.getGasPrice();
  const estGas = await ethers.provider.estimateGas(
    DappcordFactory.getDeployTransaction()
  );
  console.log(
    ethers.utils.formatEther(await ethers.provider.getBalance(deployer.address))
  );
  console.log(ethers.utils.formatEther(estGas.mul(gasPrice)));
  await deploy("Dappcord", {
    from: deployer.address,
    log: true,
  });
};

export default func;
func.tags = ["all", "dappcord"];
