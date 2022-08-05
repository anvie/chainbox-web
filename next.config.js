/** @type {import('next').NextConfig} */

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const nextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    loader: "custom",
  },
  serverRuntimeConfig: {
    jwtSecret: process.env.JWT_SECRET
  },
  publicRuntimeConfig: {
    proxyContractAddresses: {
      'chainbox': '0xDe599c4cd9e2F055ac7281410c8209e22e214E96', // v3
      'rinkeby': '0x757b3F16eF32D97fDEea8bA442823eD4c76926A6',
      'ethereum': '0x5adf2C010e960d475679FA9Bb178B3FD4CbE4d1c',
      'polygon': '0x757b3F16eF32D97fDEea8bA442823eD4c76926A6',
      'bsc': '0x0000000000000000000000000000000000000000',
    }
  },
  env: {
    API_BASE_URL: process.env.API_BASE_URL,
    BASE_URL_PROJECT_DATA_DIR: process.env.BASE_URL_PROJECT_DATA_DIR,
    CHAINBOX_PROXY_CONTRACT: process.env.CHAINBOX_PROXY_CONTRACT,
  },
  
};

module.exports = nextConfig;

