
export function isNetworkSupported(chainId: number): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }
  return (
    chainId === 1 || // Ethereum Mainnet
    chainId === 4 || // Rinkeby Mainnet
    chainId === 1919); // Chainbox (testnet)
}

