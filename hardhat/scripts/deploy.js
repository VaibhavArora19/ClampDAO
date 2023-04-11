const { ethers } = require("hardhat");

const main = async () => {

  // const clampTokenFactory = await ethers.getContractFactory("ClampToken");

  // const ClampTokenContract = await clampTokenFactory.deploy();

  // await ClampTokenContract.deployed();

  // const ClampTokenAddress = ClampTokenContract.address;

  // console.log(`Clamp Token is deployed at address: ${ClampTokenAddress}`);

  const ClampDAOFactory = await ethers.getContractFactory("ClampDAO");

  const ClampDAOContract = await ClampDAOFactory.deploy("0x160aBDf4b5C93969E6211B3DF8682dB7223a7d72");

  await ClampDAOContract.deployed();

  console.log(`Clamp DAO contract is deployed at address: ${ClampDAOContract.address}`)
}

main();

// Clamp Token -> 0x160aBDf4b5C93969E6211B3DF8682dB7223a7d72
// Clamp DAO -> 0x3F9E74ec09D08BC56bF75B75275b9b90Cac23BB5