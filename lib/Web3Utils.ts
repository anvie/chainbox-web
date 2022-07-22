const Web3 = require("web3");

if (!process.env.NETWORK_PROVIDER) {
  throw new Error("Please set NETWORK_PROVIDER environment variable");
}
// const web3 = new Web3(process.env.NETWORK_PROVIDER);

const provider = new Web3.providers.HttpProvider(process.env.NETWORK_PROVIDER);

// const provider = new Web3.providers.WebsocketProvider(process.env.NETWORK_PROVIDER, {
//   reconnect: {
//     auto: true,
//     delay: 5000, // ms
//     maxAttempts: 5,
//     onTimeout: false,
//   },
// })

const web3 = new Web3(provider);

export { web3 };

