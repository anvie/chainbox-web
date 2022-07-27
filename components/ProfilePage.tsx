import styles from "../styles/Sections.module.sass";
import Image from "next/image";
import Button from "./Button";
import { useEffect, useState } from "react";
import AddProjectDialog from "./AddProjectDialog";
import fw from "../lib/FetchWrapper";
import ProjectItem, { ItemProps } from "./ProjectItem";
import { userAccess } from "../lib/UserAccess";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import { chainIdToNetworkName, getSymbol, getSymbolFromNetworkId } from "../lib/chainutils";

const ProfilePage = () => {
  const currentAccount = userAccess.accessValue?.ethAddress;
  const [balance, setBalance] = useState("");
  const [networkId, setNetworkId] = useState("");

  useEffect(() => {
    detectEthereumProvider().then((provider: any) => {
      if (!provider) {
        return;
      }
      console.log(
        "🚀 ~ file: index.tsx ~ line 142 ~ fetchData ~ provider",
        provider
      );
      const _web3 = new Web3(provider);
      if (currentAccount){
        _web3.eth.getBalance(currentAccount).then((balance: any) => {
          setBalance(_web3.utils.fromWei(balance, "ether"));
        });

        checkNetwork(_web3);
      }

    });
  });

  const checkNetwork = (web3: Web3) => {
    web3.eth.getChainId().then((chainId: any) => {
      if (isNaN(chainId)) {
        return;
      }
      console.log("onNetworkChanged", chainId);
      setNetworkId(chainIdToNetworkName(chainId));
    });
  };

  return currentAccount ? (
    <div id="home" className="w-auto">
      <div className="pb-10 w-auto flex flex-col justify-center items-left">
        <div className="flex justify-center items-center">
          <h1>Profile</h1>
        </div>
        <div className="ml-10">{currentAccount}</div>
        <div className="ml-10">
          Balance: <span className="font-semibold">{balance} {getSymbolFromNetworkId(networkId.toLowerCase())}</span>
        </div>
        <div className="ml-10">
          Network: <span className="font-semibold text-green-500">{networkId}</span>
        </div>
      </div>
    </div>
  ) : (
    <div />
  );
};

export default ProfilePage;
