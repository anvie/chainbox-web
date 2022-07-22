import detectEthereumProvider from "@metamask/detect-provider";
const Web3 = require("web3");

import { FC, useState } from "react";
import LoadingCircle from "./LoadingCircle";

import { UserContext } from "../lib/UserContext";

let web3Provider;
let web3;
// let accounts:Array<string>;

async function connectWallet(): Promise<Array<string>> {
  if (window.ethereum) {
    const eth: any = window.ethereum;
    await eth.enable();
  }
  web3Provider = await detectEthereumProvider();
  if (!web3Provider) {
    throw new Error("No web3 provider detected");
  }
  web3 = new Web3(web3Provider);

  const accounts = await web3.eth.getAccounts();
  return accounts;
}

interface Props {
  setAccount: (account: string) => void;
  onError: (err: any) => void;
  noConnectedInfo: boolean;
  currentAddress: string | null;
}

const ConnectButton: FC<Props> = ({
  setAccount,
  noConnectedInfo,
  currentAddress,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const onConnectButtonClick = async () => {
    setLoading(true);
    try {
      const accounts = await connectWallet();
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (err) {
      console.log(err);
      onError(err);
    } finally {
      setLoading(false);
    }
  };

  return currentAddress ? (
    !noConnectedInfo ? (
      <div className="w-auto text-white p-2 font-semibold text-center">
        <div>Connected wallet:</div> <div>{currentAddress}</div>
      </div>
    ) : null
  ) : (
    <div
      onClick={onConnectButtonClick}
      className={`flex pt-2 pb-2 pr-6 pl-5 space-x-2 rounded-xl w-56 items-center  ${
        loading
          ? "bg-gray-700"
          : "bg-violet-600 hover:bg-violet-500 cursor-pointer"
      } text-center justify-center`}
    >
      {loading ? (
        <LoadingCircle />
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13 9H7"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M22.0002 10.97V13.03C22.0002 13.58 21.5602 14.03 21.0002 14.05H19.0402C17.9602 14.05 16.9702 13.26 16.8802 12.18C16.8202 11.55 17.0602 10.96 17.4802 10.55C17.8502 10.17 18.3602 9.95001 18.9202 9.95001H21.0002C21.5602 9.97001 22.0002 10.42 22.0002 10.97Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.48 10.55C17.06 10.96 16.82 11.55 16.88 12.18C16.97 13.26 17.96 14.05 19.04 14.05H21V15.5C21 18.5 19 20.5 16 20.5H7C4 20.5 2 18.5 2 15.5V8.5C2 5.78 3.64 3.88 6.19 3.56C6.45 3.52 6.72 3.5 7 3.5H16C16.26 3.5 16.51 3.50999 16.75 3.54999C19.33 3.84999 21 5.76 21 8.5V9.95001H18.92C18.36 9.95001 17.85 10.17 17.48 10.55Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}

      <div>{loading ? "Connecting..." : "Connect Wallet"}</div>
    </div>
  );
};

export default ConnectButton;

