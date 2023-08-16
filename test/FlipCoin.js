const { expect } = require("chai");
const hre = require("hardhat");
// const { Utils } = require("alchemy-sdk");


describe("FlipCoin contract", function () {
  // global vars
  let Token;
  let flipCoin;
  let owner;
  let addr1;
  let addr2;
  let tokenCap = 100000000;
  let tokenBlockReward = 50;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    Token = await ethers.getContractFactory("FlipCoin");
    [owner, addr1, addr2] = await hre.ethers.getSigners();

    flipCoin = await Token.deploy(tokenCap, tokenBlockReward);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await flipCoin.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await flipCoin.balanceOf(owner.address);
      expect(await flipCoin.totalSupply()).to.equal(ownerBalance);
    });

    it("Should set the max capped supply to the argument provided during deployment", async function () {
      const cap = await flipCoin.cap();
    //   console.log("cap: ", cap);
    //   console.log("tokenCap: ", tokenCap);
    //   console.log(hre.ethers.utils.formatEther(cap));
    expect(cap).to.equal(BigInt(tokenCap) * BigInt(10 ** 18)); // Adjust for token decimals
    //   expect(Number(hre.ethers.utils.formatEther(cap))).to.equal(tokenCap);
    });

    it("Should set the blockReward to the argument provided during deployment", async function () {
      const blockReward = await flipCoin.blockReward();
    //   expect(Number(hre.ethers.utils.formatEther(blockReward))).to.equal(
    //     tokenBlockReward
    //   );
    it("Should set the blockReward to the argument provided during deployment", async function () {
        const blockReward = await flipCoin.blockReward();
        expect(blockReward).to.equal(BigInt(tokenBlockReward) * BigInt(10 ** 18)); // Adjust for token decimals
      });
      
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 50 tokens from owner to addr1
      await flipCoin.transfer(addr1.address, 50);
      const addr1Balance = await flipCoin.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(50);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await flipCoin.connect(addr1).transfer(addr2.address, 50);
      const addr2Balance = await flipCoin.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });

    it("Should fail if sender doesn't have enough tokens", async function () {
      const initialOwnerBalance = await flipCoin.balanceOf(owner.address);
      // Try to send 1 token from addr1 (0 tokens) to owner (1000000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(
        flipCoin.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("ERC20: transfer amount exceeds balance");

      // Owner balance shouldn't have changed.
      expect(await flipCoin.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
    });

    // it("Should update balances after transfers", async function () {
    //   const initialOwnerBalance = await flipCoin.balanceOf(owner.address);

    //   // Transfer 100 tokens from owner to addr1.
    //   await flipCoin.transfer(addr1.address, 100);

    //   // Transfer another 50 tokens from owner to addr2.
    //   await flipCoin.transfer(addr2.address, 50);

    //   // Check balances.
    //   const finalOwnerBalance = await flipCoin.balanceOf(owner.address);
    //   expect(finalOwnerBalance).to.equal(initialOwnerBalance.sub(150));

    //   const addr1Balance = await flipCoin.balanceOf(addr1.address);
    //   expect(addr1Balance).to.equal(100);

    //   const addr2Balance = await flipCoin.balanceOf(addr2.address);
    //   expect(addr2Balance).to.equal(50);
    // });

    it("Should update balances after transfers", async function () {
        const initialOwnerBalance = await flipCoin.balanceOf(owner.address);
      
        // Transfer 100 tokens from owner to addr1.
        await flipCoin.transfer(addr1.address, 100);
      
        // Transfer another 50 tokens from owner to addr2.
        await flipCoin.transfer(addr2.address, 50);
      
        // Check balances.
        const finalOwnerBalance = await flipCoin.balanceOf(owner.address);
        expect(finalOwnerBalance.toString()).to.equal(
          (BigInt(initialOwnerBalance.toString()) - BigInt(150)).toString()
        );
      
        const addr1Balance = await flipCoin.balanceOf(addr1.address);
        expect(addr1Balance.toString()).to.equal("100");
      
        const addr2Balance = await flipCoin.balanceOf(addr2.address);
        expect(addr2Balance.toString()).to.equal("50");
      });
      
  });
});
