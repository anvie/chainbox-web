
export const supportedNetworks:string[] = [
  "Ethereum",
  "Polygon",
  "BSC",
  "Rinkeby"
]

export function isNetworkSupported(chainId: number): boolean {
  // if (process.env.NODE_ENV === "development") {
  //   return true;
  // }
  return (
    chainId === 1 || // Ethereum Mainnet
    chainId === 4 || // Rinkeby Mainnet
    chainId === 137 || // Polygon Mainnet
    chainId === 1919); // Chainbox (testnet)
}

export function chainIdToNetworkName(chainId: number): string {
  switch (chainId) {
    case 1:
      return "Ethereum";
    case 4:
      return "Rinkeby";
    case 137:
      return "Polygon";
    case 56:
      return "BSC";
    case 1919:
      return "Chainbox";
    default:
      return "Unknown";
  }
}