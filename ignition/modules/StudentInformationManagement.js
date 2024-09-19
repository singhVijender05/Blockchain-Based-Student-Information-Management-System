const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");


module.exports = buildModule("TockenModule", (m) => {

  const studentcontract = m.contract("StudentInformationManagement");

  return { studentcontract };
});