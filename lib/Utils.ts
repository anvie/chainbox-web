

// shorten ethereum address
export const shortenAddress = (address: string) => {
  return address.substring(0, 6) + "..." + address.substring(38);
}


