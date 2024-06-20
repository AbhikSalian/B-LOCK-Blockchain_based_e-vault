const DocumentManager = artifacts.require("DocumentManager");

module.exports = function(deployer) {
    deployer.deploy(DocumentManager);
};
