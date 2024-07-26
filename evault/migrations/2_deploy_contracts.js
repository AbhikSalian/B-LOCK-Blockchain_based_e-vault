const EVault = artifacts.require("EVault");
const UserRegistry = artifacts.require("UserRegistry");

module.exports = function(deployer) {
  deployer.deploy(EVault, { gas: 800000000 });
  deployer.deploy(UserRegistry, { gas: 800000000 });
};
