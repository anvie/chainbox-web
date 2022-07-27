import Web3 from "web3";
import { getSymbolFromNetworkId } from "./chainutils";

// Settings your pricing for each network here:
export function getPrice(networkId: string): string {
  switch (networkId) {
    case "chainbox":
      return Web3.utils.toWei("0.1", "ether");
    case "rinkeby":
      return Web3.utils.toWei("0.1", "ether");
    case "ethereum": // Ethereum
      return Web3.utils.toWei("0.15", "ether");
    case "polygon":
      return Web3.utils.toWei("0.5", "ether");
    case "bsc":
      return Web3.utils.toWei("0.1", "ether");
  }
  throw new Error("Unknown network id: " + networkId);
}

export function getPriceHuman(networkId: string): string {
  const price = getPrice(networkId);
  return Web3.utils.fromWei(price, "ether") + ` ${getSymbolFromNetworkId(networkId)}`;
}

