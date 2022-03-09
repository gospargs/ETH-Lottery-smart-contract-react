import Web3 from "web3";
window.ethereum.request({ method: "eth_requestAccounts" });
const web3 = new Web3(window.ethereum); // Metamask injects web3 on the web3 global variable
export default web3; // any file can now import a setup version of web3
