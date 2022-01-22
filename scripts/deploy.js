async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Vault1 = await ethers.getContractFactory("Vault1");
  const vault1 = await Vault1.deploy();

 const Vault2 = await ethers.getContractFactory("Vault2");
 const vault2 = await Vault2.deploy();


  console.log("vault1 address:", vault1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });