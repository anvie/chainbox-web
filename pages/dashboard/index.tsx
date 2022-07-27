import type { NextPage } from "next";

import Head from "next/head";
import Navbar from "../../components/Navbar";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import ConnectButton from "../../components/ConnectButton";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";
import fw from "../../lib/FetchWrapper";
import { userAccess } from "../../lib/UserAccess";
import ProjectsPage from "../../components/ProjectsPage";
import ProfilePage from "../../components/ProfilePage";
import { isNetworkSupported, supportedNetworks } from "../../lib/chainutils";
import { ethRpcError } from "../../lib/ErrorHandler";

const messageFormat =
  "Please sign this message to ensure you have right access to your wallet.";

const genMessageToSign = (address: string): string => {
  const nonce = Math.floor(new Date().getTime() / (60 * 1000));
  return messageFormat + "\n\naddress: " + address + "\n\nnonce: " + nonce;
};

const Home: NextPage = () => {
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [userAuthenticated, setUserAuthenticated] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [networkSupported, setNetworkSupported] = useState(true);
  const [noMetamask, setNoMetamask] = useState(false);
  const [page, setPage] = useState(0);
  const [inSigning, setInSigning] = useState(false);

  const onAccountsChanged = (accs: any) => {
    console.log("onAccountsChanged", accs);
    console.log(
      "🚀 ~ file: index.tsx ~ line 41 ~ onAccountsChanged ~ accs",
      accs
    );
    if (accs.length === 0) {
      setCurrentAccount(null);
      // setAccount(null);
      return;
    }
    if (currentAccount !== accs[0]) {
      // clear up user access local storage
      userAccess.clear();
    }
    setAccount(accs[0]);
  };
  const onNetworkChanged = async (network: any) => {
    if (network) {
      checkNetwork();
    }
  };

  const checkNetwork = () => {
    const chainId = parseInt((window.ethereum as any)?.chainId, 16);
    console.log(
      "🚀 ~ file: index.tsx ~ line 67 ~ checkNetwork ~ chainId",
      chainId
    );
    if (isNaN(chainId)) {
      return;
    }
    console.log("onNetworkChanged", chainId);
    setNetworkSupported(isNetworkSupported(chainId));
  };

  useEffect(() => {
    const ethereum: any = window.ethereum;
    if (ethereum?.on) {
      ethereum.on("accountsChanged", onAccountsChanged);
      ethereum.on("networkChanged", onNetworkChanged);
    }

    if (userAccess.accessValue) {
      setCurrentAccount(userAccess.accessValue.ethAddress);
      setUserAuthenticated(true);
    }

    checkNetwork();

    return () => {
      const ethereum: any = window.ethereum;
      if (ethereum?.removeListener) {
        ethereum.removeListener("accountsChanged", onAccountsChanged);
        ethereum.removeListener("networkChanged", onNetworkChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3]);

  useEffect(() => {
    async function fetchData() {
      console.log("detectEthereumProvider...");
      try {
        const provider: any = await detectEthereumProvider();
        if (!provider) {
          setErrorInfo(
            "You have no Metamask installed, please install Metamask first"
          );
          setNoMetamask(true);
          return;
        }
        console.log(
          "🚀 ~ file: index.tsx ~ line 142 ~ fetchData ~ provider",
          provider
        );
        const _web3 = new Web3(provider);
        setWeb3(_web3);
        console.log("web3 loaded");
      } catch (err) {
        console.log("web3 not loaded");
        console.log("ERROR:", err);
        setErrorInfo("Cannot load Web3");
      }
    }
    fetchData();
  }, []);

  const links = [{ href: "/dashboard#projects", label: "Projects" }];

  // if (currentAccount){
  //   links.push({ href: "/dashboard#profile", label: `Connected: ${shortenAddress(currentAccount)}` });
  // }

  useEffect(() => {
    if (currentAccount) {
      const path = router.asPath.trim();
      console.log(path);
      if (path.match(/#projects$/gi)) {
        setPage(0);
      }
      if (path.match(/#profile$/gi)) {
        setPage(1);
      }
    }
  }, [router, currentAccount]);

  const setAccount = async (acc: string | null) => {
    console.log("🚀 ~ file: index.tsx ~ line 141 ~ setAccount ~ acc", acc);

    if (acc === null) {
      return;
    }

    setErrorInfo(null);

    // get token

    setUserAuthenticated(false);
    setInSigning(true);
    setUserInfo("Please check your Metamask for signing request.");

    const message = genMessageToSign(acc);
    web3!.eth.personal
      .sign(message, acc, "", (error: any, signature: string) => {
        if (error){
          console.log(
            "🚀 ~ file: index.tsx ~ line 155 ~ web3.eth.personal.sign ~ error",
            error
          );
          setErrorInfo(error.message);
          return
        }
        console.log(
          "🚀 ~ file: index.tsx ~ line 155 ~ web3.eth.personal.sign ~ signature",
          signature
        );

        fw.post("/v1/authenticate", {
          address: acc,
          signature,
        })
          .then(({ error, result }) => {
            if (error) {
              console.log("error", error);
              setErrorInfo(error.message);
            }
            setCurrentAccount(acc);
            userAccess.authenticate(acc!, result.token);
            setUserAuthenticated(true);
          })
          .finally(() => {
            setUserInfo(null);
          });
      })
      .catch((err: any) => {
        setErrorInfo(ethRpcError(err));
      })
      .finally(() => {
        setInSigning(false);
      });
  };

  return (
    <div className={`pt-16 md:pt-0 items-center justify-center flex flex-col`}>
      <Head>
        <title>Chainbox</title>
        <meta
          name="description"
          content="Chainbox is a tool to simplify the process of creating a Web3 project"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar links={links} noDasboard={currentAccount != null} />

      <div id="modal-root"></div>

      <main className={`flex flex-col w-2/3 justify-center items-center`}>
        {!networkSupported && (
          <div className="p-5 bg-orange-500 rounded-xl mb-10">
            <div>
              Network not supported, please change to supported network:
            </div>
            <div>{supportedNetworks.join(", ")}</div>
          </div>
        )}

        {userInfo && (
          <div className="p-5 bg-blue-500 text-white rounded-xl mb-10">
            {userInfo}
          </div>
        )}

        {errorInfo && (
          <div className="p-5 bg-red-500 text-white rounded-xl mb-10">
            ERROR: {errorInfo}
          </div>
        )}

        {/* {!currentAccount && <Loading className="p-10" />} */}

        {!noMetamask && !inSigning && (
          <div>
            <ConnectButton
              setAccount={setAccount}
              noConnectedInfo={true}
              currentAddress={currentAccount}
              onError={(err) => {
                setErrorInfo(
                  "No Metamask detected, make sure you have Metamask installed on your browser"
                );
                setNoMetamask(true);
              }}
            />
          </div>
        )}

        {page == 0 && userAuthenticated && networkSupported && <ProjectsPage />}
        {page == 1 && userAuthenticated && networkSupported && <ProfilePage />}
      </main>

      <Footer />
    </div>
  );
};

export default Home;

function watchTransaction(web3: Web3, txHash: any): Promise<any> {
  console.log("🚀 tx.hash", txHash);
  return new Promise<any>((resolve, reject) => {
    web3.eth
      .getTransactionReceipt(txHash)
      .then((receipt: any) => {
        console.log(
          "🚀 ~ file: MintDialog.tsx ~ line 165 ~ web3.eth.getTransactionReceipt ~ receipt",
          receipt
        );

        if (!receipt || !receipt.status) {
          console.log("no receipt");
          resolve(null);
          return;
        }

        if (receipt.blockNumber > 0) {
          // onMintSuccess(tx);
          // setInCreating(false);
          resolve(receipt);
        }
      })
      .catch((err: any) => {
        console.error(err);
        console.log("Cannot watch transaction");
        reject(err);
      });
  });
}
