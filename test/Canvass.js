const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Canvass Tests', () => {

    /**
     * Fixture to deploy and snapshot Canvass Contract state
     */
    const deployCanvass = async () => {
        const signers         = await ethers.getSigners();
        const owner           = signers[0];
        const otherSigners    = signers.splice(1);
        const ContractFactory = await ethers.getContractFactory('Canvass');
        const CanvassContract = await ContractFactory.deploy();

        return {owner, otherSigners, CanvassContract};
    }

    describe('Deployment', async () => {

        it('Owner should match deployer address', async () => {
            const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
            const CanvassOwner = await CanvassContract.whoOwnsThis();
            expect(owner.address).to.equal(CanvassOwner);
        })

    });

    describe('Governance tests', async () => {

      it('Owner should be able to add admin', async () => {
        const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
        await expect(CanvassContract.connect(owner).addAdmin(otherSigners[0].address))
                .not.to.be.reverted;
      })

      it('Contract should recognize previous address as admin', async () => {
          const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
          await CanvassContract.connect(owner).addAdmin(otherSigners[0].address);
          const TokenAdminStatus = await CanvassContract.connect(otherSigners[0]).isSignerAdmin();
          expect(TokenAdminStatus).to.be.true;
      })

      it('Admin addition should emit adminModified event', async () => {
          const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
          await expect(CanvassContract.connect(owner).addAdmin(otherSigners[0].address))
                  .to.emit(CanvassContract, 'adminModified');
      })

      it('Admin should be able to add admin', async () => {
          const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
          await CanvassContract.connect(owner).addAdmin(otherSigners[0].address)
          await CanvassContract.connect(otherSigners[0]).addAdmin(otherSigners[1].address)
          const TokenAdminStatus = await CanvassContract.connect(otherSigners[1]).isSignerAdmin();
          expect(TokenAdminStatus).to.be.true;
      })

      it('Admin should be able to remove admin', async () => {
          const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
          await CanvassContract.connect(owner).addAdmin(otherSigners[0].address)
          await CanvassContract.connect(otherSigners[0]).addAdmin(otherSigners[1].address)
          await CanvassContract.connect(otherSigners[0]).removeAdmin(otherSigners[1].address)
          const TokenAdminStatus = await CanvassContract.connect(otherSigners[1]).isSignerAdmin();
          expect(TokenAdminStatus).to.be.false;
      })

      it('Admin shouldnt be able to remove self', async () => {
          const {owner, otherSigners, CanvassContract} = await loadFixture(deployCanvass);
          await CanvassContract.connect(owner).addAdmin(otherSigners[0].address)
          await expect(CanvassContract.connect(otherSigners[0]).removeAdmin(otherSigners[0].address))
                  .to.be.revertedWith('Self Reflection not permitted');
      })

    });

})