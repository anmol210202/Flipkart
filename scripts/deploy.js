async function main() {

  const [deployer] = await ethers.getSigners();

  console.log(
  "Deploying contracts with the account:",
  deployer.address
  );

  // console.log("Account balance:", (await deployer.getBalance()).toString());

  const FlipCoin = await ethers.getContractFactory("FlipCoin");
  const contract = await FlipCoin.deploy(100000000,50 );

  console.log("Contract deployed at:", contract.address);
}

main()
.then(() => process.exit(0))
.catch(error => {
  console.error(error);
  process.exit(1);
});