const EVault = artifacts.require("EVault");

module.exports = function (deployer) {
  deployer.deploy(EVault, { gas: 8000000 });
};
