// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const db = require("../../lib/db");

import { Eligible } from "../../models/Eligible";
import { EligibleAddress } from "../../models/EligibleAddress";
import { getAccountEligibilty } from "../../lib/AccountUtils";

type Data = {
  error?: string | null;
  eligible: boolean | null;
  claimed?: boolean | null;
  discount?: boolean;
};


export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {
    query: { address },
    method,
  } = req;
  if (method !== "GET") {
    res.status(405).end();
    return;
  }
  if (!address) {
    res.status(400).json({ eligible: false, error: "Invalid address" });
    return;
  }

  const addressLower = (address as string).toLowerCase();
  console.log(
    "🚀 ~ file: isEligible.ts ~ line 31 ~ addressLower",
    addressLower
  );

  getAccountEligibilty(addressLower, false).then(({eligible, claimed, discount}) => {
    res.json({ eligible, claimed, discount, error: null });
  }).catch((err: any) => {
    console.log("🚀 ~ file: isEligible.ts ~ line 42 ~ getAccountEligibilty ~ err", err)
    res
      .status(200)
      .json({ eligible: false, error: "Cannot get eligibility from db" });
  });

  // Eligible.findOne({ address: addressLower })
  //   .then((doc: any) => {
  //     if (!doc) {

  //       // coba check dari EligibleAddress
  //       EligibleAddress.findOne({ address: addressLower })
  //         .then((doc: any) => {
  //           if (!doc) {
  //             return res.json({ eligible: false, claimed: false });
  //           } else {
  //             return res.json({ eligible: doc.eligible, claimed: doc.claimed });
  //           }
  //         })
  //         .catch((err: any) => {
  //           console.log("🚀 ~ file: isEligible.ts ~ line 49 ~ err", err);
  //           return res.json({
  //             eligible: false,
  //             error: "Cannot get address from db code 2",
  //           });
  //         });

  //       return; //res.json({ eligible: false, error: null });
  //     }
  //     console.log("🚀 ~ file: isEligible.ts ~ line 31 ~ .then ~ doc", doc);
  //     res.json({ eligible: doc.eligible, claimed: doc.claimed, error: null });
  //   })
  //   .catch((err: any) => {
  //     res
  //       .status(200)
  //       .json({ eligible: false, error: "Cannot get address from db" });
  //   });
}

