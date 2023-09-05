const { expect } = require("chai");
const { assert } = require("chai")
const {hre, ethers} = require("hardhat");

describe("erc1555", function () {
  it("deployer should be declared the owner of the contract", async function () {
    const [deployer] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    // console.log(await erc1155.owner());
    expect(await erc1155.owner()).to.equal(await deployer.getAddress());
  });

  it("minting", async function () {
    const [deployer] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.mint(await deployer.getAddress(), 1, 100, "0xffff")

    // console.log(await erc1155.owner());
    expect(await erc1155.balanceOf(await deployer.getAddress(), 1)).to.equal(100);
  });
  
  it("mint batch", async function () {
    const [deployer, npc1] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.mintBatch(await npc1.getAddress(), [2, 3], [100, 200], "0xffff")

    console.log(await erc1155.balanceOfBatch([await npc1.getAddress(), await npc1.getAddress()], [2, 3]))
    // console.log(await erc1155.owner());
    // expect(await erc1155.balanceOfBatch([await npc1.getAddress(), await npc1.getAddress()], [2, 3])).to.equal([100, 200]);
  });

  it("set approve", async function () {
    const [deployer, npc1] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.setApprovalForAll(await npc1.getAddress(), true)

    assert.equal(await erc1155.isApprovedForAll(await deployer.getAddress(), npc1.getAddress()), true)
  });

  it("safe transfer from", async function () {
    const [deployer, npc1] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.setApprovalForAll(await npc1.getAddress(), true)

    await erc1155.mint(await deployer.getAddress(), 1, 100, "0xffff")

    await erc1155.safeTransferFrom(await deployer.getAddress(), npc1.getAddress(), 1, 20, "0xffff")

    expect(await erc1155.balanceOf(await deployer.getAddress(), 1)).to.equal(80);
    expect(await erc1155.balanceOf(await npc1.getAddress(), 1)).to.equal(20);
  });

  it("burn", async function () {
    const [deployer, npc1] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.mint(await deployer.getAddress(), 1, 100, "0xffff")

    await erc1155.burn(await deployer.getAddress(), 1, 20)

    expect(await erc1155.balanceOf(await deployer.getAddress(), 1)).to.equal(80);
  });

  it("burn batch", async function () {
    const [deployer, npc1] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.mintBatch(await npc1.getAddress(), [2, 3], [100, 200], "0xffff")

    await erc1155.connect(npc1).burnBatch(await npc1.getAddress(), [2, 3], [50, 50])

    console.log(await erc1155.balanceOf(await npc1.getAddress(), 2))
    console.log(await erc1155.balanceOf(await npc1.getAddress(), 3))
    
  });

  it("transfer ownership", async function () {
    const [deployer, npc1] = await ethers.getSigners();

    const erc1155 = await ethers.deployContract("erc1155");

    await erc1155.transferOwnership(await npc1.getAddress());

    assert.equal(await erc1155.owner(), npc1.address)

  })


});