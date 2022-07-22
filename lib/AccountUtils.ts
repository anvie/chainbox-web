import { Eligible } from "../models/Eligible";
import { EligibleAddress } from "../models/EligibleAddress";

const db = require("../lib/db");

const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.WebsocketProvider(process.env.NETWORK_PROVIDER, {
    reconnect: {
      auto: true,
      delay: 5000, // ms
      maxAttempts: 5,
      onTimeout: false,
    },
  })
);

interface CheckResult {
  eligible: boolean;
  balance: number;
}

async function checkAddress(address: string): Promise<CheckResult> {
  const balanceWei = await web3.eth.getBalance(address);
  const balance = parseFloat(web3.utils.fromWei(balanceWei, "ether"));
  const eligible = balance >= 0.01;
  return Promise.resolve({
    eligible,
    balance,
  });
}

const getAccountEligibilty = async (address: string, chainCheck: boolean) => {
  const addressLower = address.toLowerCase();
  const doc = await Eligible.findOne({ address: addressLower });
  if (!doc) {
    const eligibleByAddress = await EligibleAddress.findOne({
      address: addressLower,
    });
    if (!eligibleByAddress) {
      return { eligible: false, claimed: false, discount: false };
    }
    let eligible = eligibleByAddress.eligible;
    if (chainCheck) {
      eligible = (await checkAddress(address)).eligible;
    }
    return {
      // eligible: eligibleByAddress.eligible,
      eligible: eligible || eligibleByAddress.eligible,
      claimed: eligibleByAddress.claimed,
      discount: eligibleByAddress.discount || false,
    };
  }
  // const { eligible } = await checkAddress(address);
  let eligible = doc.eligible;
  if (chainCheck) {
    eligible = (await checkAddress(address)).eligible;
  }

  // 500 pertama whitelist layak mendapatkan diskon
  // diquery menggunakan timestamp user ke 500 (check menggunakan mongo shell)
  const discount = doc.timestamp <= 1647198632021;
  return { eligible: eligible || doc.eligible, claimed: doc.claimed, discount };
};

// async function checkAddress(
//   ctx: Context,
//   address: string
// ): Promise<CheckResult> {
//   const balanceWei = await ctx.web3.eth.getBalance(address);
//   const balance = parseFloat(ctx.web3.utils.fromWei(balanceWei, "ether"));
//   const eligible = balance >= 0.05;
//   return Promise.resolve({
//     eligible,
//     balance,
//   });
// }


export { getAccountEligibilty };

