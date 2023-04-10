const { ethers } = require("hardhat");

const main = async () => {

  const clampTokenFactory = await ethers.getContractFactory("ClampToken");

  const ClampTokenContract = await clampTokenFactory.deploy();

  await ClampTokenContract.deployed();

  const ClampTokenAddress = ClampTokenContract.address;

  console.log(`Clamp Token is deployed at address: ${ClampTokenAddress}`);

  const ClampDAOFactory = await ethers.getContractFactory("ClampDAO");

  const ClampDAOContract = await ClampDAOFactory.deploy(ClampTokenAddress);

  await ClampDAOContract.deployed();

  console.log(`Clamp DAO contract is deployed at address: ${ClampDAOContract.address}`)
}

main();

// Clamp Token -> 0x160aBDf4b5C93969E6211B3DF8682dB7223a7d72
// Clamp DAO -> 0x17B7288c2E2E90c6658df0ca1f84fCAD11807b77