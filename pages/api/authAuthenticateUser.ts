// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import getConfig from "next/config";

const db = require("../../lib/db");

const { serverRuntimeConfig } = getConfig();

import { generateCode } from "../../lib/auth";

import { web3 } from "../../lib/Web3Utils";

const messageFormat = "Please sign this message to ensure you have access to your RSVPs."

type Data = {
  error?: string | null;
  result?: object;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    body: { signature, address },
    method,
  } = req;
  if (method !== "POST") {
    res.status(405).end();
    return;
  }

  if (!address) {
    res.json({ error: "No address" });
    return;
  }

  if (signature) {

    const message = messageFormat + "\n\n" + address;
    const rcvAddr = await web3.eth.accounts.recover(message, signature);

    if (rcvAddr.toLowerCase() !== address.toLowerCase()) {
      res.json({ error: "Invalid signature" });
      return;
    }

    const token = jwt.sign({ address }, serverRuntimeConfig.jwtSecretUser, {
      expiresIn: "7d",
    });

    res.json({ result: { address, token } });
    return;
  }

  res.json({ result: { code: generateCode() } });
}

