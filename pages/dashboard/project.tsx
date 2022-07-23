import type { NextPage } from "next";
// import useSWR from "swr";
import Head from "next/head";
import styles from "../../styles/Home.module.sass";
import Navbar from "../../components/Navbar";
import React, { FC, useCallback, useEffect, useState } from "react";
import Footer from "../../components/Footer";
import EligibilityChecker from "../../components/EligibilityChecker";
import ConnectButton from "../../components/ConnectButton";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import { ethRpcError } from "../../lib/ErrorHandler";
import detectEthereumProvider from "@metamask/detect-provider";
import { Loading } from "../../components/Loading";
import { Router, useRouter } from "next/router";
import fw from "../../lib/FetchWrapper";
import { userAccess } from "../../lib/UserAccess";
import { shortenAddress, shortenHash } from "../../lib/Utils";
import ProjectsPage from "../../components/ProjectsPage";
import Button from "../../components/Button";
import Link from "next/link";
import { toPascalCase, toHeaderCase } from "js-convert-case";
import { formatError } from "../../lib/Utils";
import SmallButton from "../../components/SmallButton";

const Home: NextPage = () => {
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [inDeploy, setInDeploy] = useState(false);

  const links = [{ href: "/dashboard#projects", label: "Projects" }];

  const onAccountsChanged = (accs: any) => {
    console.log("onAccountsChanged", accs);
    if (accs.length === 0) {
      setAccount(null);
      return;
    }
    if (currentAccount !== accs[0]) {
      // clear up user access local storage
      userAccess.clear();
    }
    setAccount(accs[0]);
  };
  const onNetworkChanged = async (network: any) => {
    console.log(
      "🚀 ~ file: index.tsx ~ line 74 ~ onNetworkChanged ~ network",
      network
    );
    if (network) {
      checkNetwork();
    }
  };

  const checkNetwork = () => {
    const chainId = parseInt((window.ethereum as any)?.chainId, 16);
    if (isNaN(chainId)) {
      return;
    }
    console.log("onNetworkChanged", chainId);
    // setNetworkSupported(isSupportedNetwork(chainId));
  };

  useEffect(() => {
    const ethereum: any = window.ethereum;
    if (ethereum?.on) {
      ethereum.on("accountsChanged", onAccountsChanged);
      ethereum.on("networkChanged", onNetworkChanged);
    }

    if (userAccess.accessValue) {
      setCurrentAccount(userAccess.accessValue.ethAddress);
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
  }, []);

  const fetchProject = async () => {
    console.log("in fetchProject");
    if (currentAccount) {
      const path = router.asPath.trim();
      const projectId = path.split("#")[1];
      console.log(
        "🚀 ~ file: project.tsx ~ line 89 ~ fetchProject ~ projectId",
        projectId
      );
      if (projectId) {
        fw.get(`/v1/project/${projectId}`)
          .then((res: any) => {
            if (res.result) {
              setProject(res.result.project);
              setDeployments(res.result.deployments);
            }
          })
          .catch((err: any) => {
            console.error("[ERROR]", err);
          });
      }
    }
  };

  useEffect(() => {
    if (currentAccount) {
      fetchProject();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAccount]);

  const setAccount = async (acc: string | null) => {
    if (acc === null) {
      return;
    }
    setCurrentAccount(acc);

    // // get token
    // const message = genMessageToSign(acc);
    // const signature = await web3!.eth.personal.sign(message, acc, "")

    // fw.post("/v1/authenticate", {
    //   address: acc,
    //   signature
    // }).then(({error, result}) => {
    //   if (error) {
    //     console.log("error", error);
    //     setErrorInfo(error.message);
    //   }
    //   userAccess.authenticate(acc!, result.token);
    // })
  };

  // const downloadAbi = useCallback(async () => {
  //   if (currentAccount && project) {
  //     // Router.push(`/project/${project.id}/abi`);
  //   }
  // }, [currentAccount, project]);

  // const abiUrl = useCallback(() => {
  //   if (project) {
  //     return `${process.env.BASE_URL_PROJECT_DATA_DIR}/${
  //       project.meta.generated
  //     }/${toPascalCase(project.meta.generated)}-${project._id}-ABI.json`;
  //   }
  //   return "";
  // }, [project]);

  const doDeploy = async (network: string): Promise<void> => {
    setInDeploy(true);

    return new Promise((resolve, reject) => {
      fw.post(`/v1/deploy`, {
        projectId: project._id,
        network: network.toLowerCase(),
      })
        .then((resp) => {
          if (resp.error || resp.errors) {
            console.error("[ERROR]", resp.error || resp.errors);
            alert(formatError(resp.error || resp.errors));
            setInDeploy(false);
            reject(resp.error || resp.errors);
          }
          console.log(
            "🚀 ~ file: ProjectItem.tsx ~ line 32 ~ fw.post ~ resp",
            resp
          );
          setInDeploy(false);
          resolve();
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: ProjectItem.tsx ~ line 57 ~ doDeploy ~ err",
            err
          );
          reject(err);
        });
    });
  };

  return (
    <div className={`pt-16 md:pt-0 flex flex-col items-center`}>
      <Head>
        <title>Chainbox</title>
        <meta
          name="description"
          content="Chainbox is a tool to simplify the process of creating a Web3 project"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="blur-dot-yellow" />

      <Navbar links={links} noDasboard={true} />

      <div id="modal-root"></div>

      <main className={`flex flex-col w-2/3 justify-center items-center`}>
        {project && (
          <div>
            <h1>Project: {project.name}</h1>
            <div className="mt-5">
              <p>{project.description}</p>

              <div>Status: {project.deployed ? "DEPLOYED" : "DRAFT"}</div>
              <div>Capped: {project.meta.capped.toString()}</div>
              <div>Max supply: {project.meta.maxSupply.toString()}</div>
              <div>ID: {project._id}</div>
            </div>
            <div className="mt-10">
              {!project.deployed && (
                <div className="flex flex-col space-y-5">
                  <DeployBox
                    item={deployments.find(
                      (deployment) => deployment.network === "chainbox"
                    )}
                    doDeploy={doDeploy}
                    network="chainbox"
                    disabled={inDeploy}
                  />
                  <DeployBox
                    item={deployments.find(
                      (deployment) => deployment.network === "rinkeby"
                    )}
                    doDeploy={doDeploy}
                    network="rinkeby"
                    disabled={inDeploy}
                  />
                  <DeployBox
                    item={deployments.find(
                      (deployment) => deployment.network === "rinkeby"
                    )}
                    doDeploy={doDeploy}
                    network="ethereum"
                    disabled={inDeploy}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Home;

interface DeployBoxProps {
  item: any;
  network: string;
  disabled: boolean;
  doDeploy: (network: string) => Promise<void>;
}

const DeployBox: FC<DeployBoxProps> = ({
  item,
  doDeploy,
  network,
  disabled,
}) => {
  const [loading, setLoading] = useState(false);
  const isDeployed = item != null;
  let _disabled = disabled || isDeployed;
  const _caption = isDeployed ? "Deployed" : "Deploy";
  return (
    <div className="border p-2 text-center w-96">
      <div className="mb-2">{toHeaderCase(network)}</div>
      {item && (
        <div className="text-sm">
          <div>Contract address: {item.contractAddress}</div>
          <div>TX: {shortenHash(item.txHash)}</div>
          <div>
            <Link
              href={`${process.env.BASE_URL_PROJECT_DATA_DIR}/${item.abiFile}`}
            >
              <a className="p-2 text-sm underline hover:text-blue-300" target="_blank">
                Download ABI
              </a>
            </Link>
          </div>
        </div>
      )}
      {!isDeployed && (
        <SmallButton
          caption={_caption}
          color="bg-orange-600"
          onClick={() => {
            setLoading(true);
            doDeploy(network).finally(() => {
              setLoading(false);
            });
          }}
          loading={loading}
          disabled={_disabled}
        />
      )}
    </div>
  );
};

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
