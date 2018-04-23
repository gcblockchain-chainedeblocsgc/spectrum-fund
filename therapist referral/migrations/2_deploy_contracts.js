//var ConvertLib = artifacts.require("ConvertLib");
var Adoption = artifacts.require("Adoption");


module.exports = function(deployer) {
  //deployer.deploy(ConvertLib);
  //deployer.link(ConvertLib,Adoption);
  deployer.deploy(Adoption);
};
