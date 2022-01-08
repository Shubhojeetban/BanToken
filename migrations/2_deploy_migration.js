const BanToken = artifacts.require("BanToken");

module.exports = function (deployer) {
  deployer.deploy(BanToken);
};
