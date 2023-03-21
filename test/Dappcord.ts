import { Dappcord } from "../typechain-types";
import { expect } from "chai";
import * as hre from "hardhat";
import { deployments, ethers } from "hardhat";

describe("Dappcord", function () {
  let dappcord: Dappcord;
  let deployer: string;

  beforeEach(async function () {
    await deployments.fixture("all");

    ({ deployer } = await hre.getNamedAccounts());
    dappcord = await ethers.getContract("Dappcord");
  });

  describe("constructor", function () {
    it("sets the name", async function () {
      expect(await dappcord.name()).to.be.equal("Dappcord");
    });

    it("sets correct symbols", async function () {
      expect(await dappcord.symbol()).to.be.equal("DPC");
    });

    it("sets correcct owner", async function () {
      expect(await dappcord.owner()).to.be.equal(deployer);
    });
  });

  describe("mint", function () {
    beforeEach(async function () {
      await dappcord.createChannel("name", 999);
    });

    it("fails because entrance fee not met", async function () {
      await expect(dappcord.mint(0)).to.be.revertedWith(
        "Dappcord: Value is lower than required in the chanel"
      );
    });

    it("fails because channel doesn't exist", async function () {
      await expect(dappcord.mint(1)).to.be.revertedWith(
        "Dappcord: Channel doesn't  exit"
      );
    });

    it("increases token counter", async function () {
      await dappcord.mint(0, { value: 999 });
      expect(await dappcord.tokenCounter()).to.be.equal(1);
    });

    it("adds to the list of participants", async function () {
      await dappcord.mint(0, { value: 999 });
      expect(await dappcord.getIfParticipant(0, 1)).to.be.true;
    });

    it("increases balance by one", async function () {
      await dappcord.mint(0, { value: 999 });
      expect(await dappcord.balanceOf(deployer)).to.be.equal(1);
    });

    it("assigns token to  the user", async function () {
      await dappcord.mint(0, { value: 999 });
      expect(await dappcord.ownerOf(1)).to.be.equal(deployer);
    });
  });

  describe("createChannel", function () {
    beforeEach(async function () {
      await dappcord.createChannel("name", 999);
    });

    it("creates channel", async function () {
      const channel = await dappcord.getChannel(0);
      expect(channel.name).to.be.equal("name");
      expect(channel.price).to.be.equal(999);
    });
  });

  describe("withdraw", function () {
    beforeEach(async function () {
      await dappcord.createChannel("name", 999);
      await dappcord.mint(0, { value: 999 });
    });

    it("fails because not the  owner", async function () {
      const hacker = (await ethers.getSigners())[1];
      await expect(dappcord.connect(hacker).withdraw(0)).to.be.revertedWith(
        "Dappcord: Withdrawer must be the owner"
      );
    });

    it("withdraws the locked funds", async function () {
      const initialBalance = await ethers.provider.getBalance(deployer);
      const txRec = await dappcord.withdraw(0);
      const txRes = await txRec.wait();
      const fee = txRes.effectiveGasPrice.mul(txRes.gasUsed);
      const finalBalance = await ethers.provider.getBalance(deployer);

      expect(finalBalance.add(fee)).to.be.equal(initialBalance.add(999));
    });
  });
});
