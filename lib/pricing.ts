
import Web3 from "web3";

export function getPrice(networkId: string): string{
  switch (networkId) {
    case "chainbox":
      return Web3.utils.toWei("0.1", "ether");
    case "rinkeby":
      return Web3.utils.toWei("0.1", "ether");
    case "mainnet": // Ethereum
      return Web3.utils.toWei("0.15", "ether");
    case "polygon":
      return Web3.utils.toWei("0.2", "ether");
    case "bsc":
      return Web3.utils.toWei("0.1", "ether");
  }
  throw new Error("Unknown network id: " + networkId);
}
