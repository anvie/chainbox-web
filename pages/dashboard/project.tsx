import type { NextPage } from "next";
// import useSWR from "swr";
import Head from "next/head";
import Navbar from "../../components/Navbar";
import React, { useEffect, useState } from "react";
import Footer from "../../components/Footer";
import Web3 from "web3";
import { Contract } from "web3-eth-contract";
import { AbiItem } from "web3-utils";
import detectEthereumProvider from "@metamask/detect-provider";
import { useRouter } from "next/router";
import fw from "../../lib/FetchWrapper";
import { userAccess } from "../../lib/UserAccess";
import { toHeaderCase } from "js-convert-case";
import DeployBox from "../../components/DeployBox";
import contractAbiChainbox from "../../lib/ChainboxProxy-abi-chainbox.json";
import contractAbiRinkeby from "../../lib/ChainboxProxy-abi-rinkeby.json";
import contractAbiPolygon from "../../lib/ChainboxProxy-abi-polygon.json";
import contractAbiEthereum from "../../lib/ChainboxProxy-abi-ethereum.json";

import { chainIdToNetworkName, isNetworkSupported } from "../../lib/chainutils";
import getConfig from "next/config";
import imageLoader from "../../imageLoader";
import Image from "next/image";
import { formatError } from "../../lib/Utils";

const { publicRuntimeConfig } = getConfig();

const CONTRACT_ABIS: any = {
  chainbox: contractAbiChainbox,
  rinkeby: contractAbiRinkeby,
  polygon: contractAbiPolygon,
  ethereum: contractAbiEthereum,
};

const Home: NextPage = () => {
  const router = useRouter();

  const [currentAccount, setCurrentAccount] = useState<string | null>(null);
  const [project, setProject] = useState<any | null>(null);
  const [deployments, setDeployments] = useState<any[]>([]);
  const [inDeploy, setInDeploy] = useState(false);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [noMetamask, setNoMetamask] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [networkSupported, setNetworkSupported] = useState(true);
  const [contract, setContract] = useState<Contract | null>(null);
  const [contractLoaded, setContractLoaded] = useState(false);
  const [networkId, setNetworkId] = useState<string | null>(null);
  const [image, setImage] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [gasPrices, setGasPrices] = useState<any>(null);

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
    setNetworkId(chainIdToNetworkName(chainId));
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

  useEffect(() => {
    if (web3 && networkSupported && networkId) {
      const networkIdLower = networkId.toLowerCase();
      // const contractAddress = process.env.CHAINBOX_PROXY_CONTRACT;
      // if (!contractAddress) {
      //   throw Error("CHAINBOX_PROXY_CONTRACT is not defined");
      // }
      const contractAddress =
        publicRuntimeConfig.proxyContractAddresses[networkIdLower];
      console.log("SC address:", contractAddress);

      if (contractAddress === "0x0000000000000000000000000000000000000000") {
        console.log(
          "[WARN] Contract address is not defined for network " + networkIdLower
        );
        return;
      }

      setContract(
        new web3.eth.Contract(
          CONTRACT_ABIS[networkIdLower].abi as unknown as AbiItem,
          contractAddress
        )
      );
      console.log("contract loaded");
      setContractLoaded(true);
    }
  }, [web3, networkSupported, networkId]);

  useEffect(() => {
    // get gas prices
    fw.get("/v1/gas-prices")
      .then((res: any) => {
        console.log("🚀 ~ file: project.tsx ~ line 224 ~ fw.get ~ res", res);
        if (res.result) {
          setGasPrices(res.result.gasPrices);
        }
      })
      .catch((err: any) => {
        console.error("[ERROR]", err);
      });
  }, []);

  // const doDeploy = async (network: string): Promise<any> => {
  //   setInDeploy(true);

  //   return new Promise((resolve, reject) => {
  //     fw.post(`/v1/deploy`, {
  //       projectId: project._id,
  //       network: network.toLowerCase(),
  //     })
  //       .then((resp) => {
  //         if (resp.error || resp.errors) {
  //           console.error("[ERROR]", resp.error || resp.errors);
  //           alert(formatError(resp.error || resp.errors));
  //           setInDeploy(false);
  //           reject(resp.error || resp.errors);
  //         }
  //         console.log(
  //           "🚀 ~ file: ProjectItem.tsx ~ line 32 ~ fw.post ~ resp",
  //           resp
  //         );
  //         setInDeploy(false);
  //         resolve(resp.result);
  //       })
  //       .catch((err) => {
  //         console.log(
  //           "🚀 ~ file: ProjectItem.tsx ~ line 57 ~ doDeploy ~ err",
  //           err
  //         );
  //         reject(err);
  //       });
  //   });
  // };

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      console.log(
        "🚀 ~ file: project.tsx ~ line 252 ~ uploadToClient ~ img",
        img
      );
      setImage(img);
    }
  };

  const uploadImage = async (event: any) => {
    if (!project) {
      return;
    }
    const body = new FormData();
    body.append("image", image);
    const resp = await fw.postRaw(`/v1/project/${project._id}/upload`, body);
    console.log("🚀 ~ file: project.tsx ~ line 251 ~ uploadImage ~ resp", resp);

    if (resp.result) {
      setImageUrl(resp.result.filename);
    }
  };

  const downloadSrc = async () => {
    fw.get(`/download-contract-src?projectId=${project._id}`)
      .then((resp: any) => {
        console.log("🚀 ~ file: DeployBox.tsx ~ line 221 ~ .then ~ resp", resp);
        if (resp.error || resp.errors) {
          console.error("[ERROR]", resp.error || resp.errors);
          alert(formatError(resp.error || resp.errors));
          return;
        }
        const { zipFileName } = resp.result;
        window.open(
          `${process.env.BASE_URL_PROJECT_DATA_DIR}/${project.meta.generated}/${zipFileName}`,
          "_blank"
        );
      })
      .catch((err) => {
        console.log("🚀 ~ file: DeployBox.tsx ~ line 230 ~ .then ~ err", err);
        alert("Error during downloading contract source");
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

      {/* <div className="blur-dot-yellow" /> */}

      <Navbar links={links} noDasboard={true} />

      <div id="modal-root"></div>

      <main className={`flex flex-col w-full p-5 items-center`}>
        {project && (
          <div className="items-start w-2/3">
            <div>Project</div>
            <h1>{project.name}</h1>
          </div>
        )}
        {project && (
          <div className="w-2/3 flex flex-col md:flex-row">
            <div className="w-full">
              <div className="mt-5">
                <div className="mb-5">
                  <p>{project.description}</p>
                </div>

                {/* <div>Status: {project.deployed ? "DEPLOYED" : "DRAFT"}</div> */}
                <div>
                  Type: {project.kind === "ERC-721" && "NFT"} ({project.kind})
                </div>
                <div>Capped: {project.meta.capped.toString()}</div>
                {project.meta.capped && (
                  <div>Max supply: {project.meta.maxSupply.toString()}</div>
                )}
                <div>ID: {project._id}</div>

                <div
                  className="mt-5 p-2 text-white cursor-pointer text-sm hover:text-blue-200 bg-cyan-500 w-60 text-center rounded-md"
                  onClick={downloadSrc}
                >
                  Download contract source
                </div>
              </div>
              <div className="mt-10">
                <div className="mb-5">
                  Current connected network:{" "}
                  <span className="font-semibold text-green-500">
                    {toHeaderCase(networkId || "Unknown")}
                  </span>
                  <div className="text-sm">
                    [SC:{" "}
                    {networkId &&
                      contract &&
                      publicRuntimeConfig.proxyContractAddresses &&
                      publicRuntimeConfig.proxyContractAddresses[
                        networkId.toLowerCase()
                      ]}
                    ]
                  </div>
                </div>
              </div>
            </div>

            <div className="w-2/3 pl-10 justify-end flex flex-col pb-2">
              {/* IMAGE ------------------------------ */}

              {imageUrl ? (
                <Image
                  src={`https://meta.chainbox.id/${project._id}/${imageUrl}`}
                  alt="Project image"
                  loader={({ src }) => src}
                  width="200px"
                  height="300px"
                />
              ) : (
                <Image
                  src={
                    `https://meta.chainbox.id/${project._id}/` +
                    (project.meta.image ? project.meta.image : "default.png")
                  }
                  alt="Project image"
                  loader={({ src }) => src}
                  width="200px"
                  height="300px"
                />
              )}

              <form
                method="post"
                action={process.env.API_BASE_URL + "/v1/upload"}
                encType="multipart/form-data"
                onSubmit={(e: any) => {
                  e.preventDefault();
                }}
              >
                <input type="file" name="image" onChange={uploadToClient} />
                <button
                  type="submit"
                  name="upload"
                  className="border rounded-md hover:shadow-sm p-2 mt-2"
                  onClick={uploadImage}
                >
                  upload default image
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="w-2/3">
          {project && !project.deployed && web3 && contract && networkId && (
            <div>
              <div className="border"></div>
              <div className="mb-5 mt-5">Deployments:</div>
              <div className="flex flex-col space-y-5">
                <DeployBox
                  project={project}
                  web3={web3}
                  contract={contract}
                  item={deployments.find(
                    (deployment) => deployment.network === "chainbox"
                  )}
                  network="chainbox"
                  networkId="chainbox"
                  disabled={inDeploy}
                  currentConnectedNetwork={networkId}
                  gasPrices={gasPrices}
                />
                <DeployBox
                  project={project}
                  web3={web3}
                  contract={contract}
                  item={deployments.find(
                    (deployment) => deployment.network === "rinkeby"
                  )}
                  network="rinkeby"
                  networkId="rinkeby"
                  disabled={inDeploy}
                  currentConnectedNetwork={networkId}
                  gasPrices={gasPrices}
                />
                <DeployBox
                  project={project}
                  web3={web3}
                  contract={contract}
                  item={deployments.find(
                    (deployment) => deployment.network === "ethereum"
                  )}
                  network="ethereum"
                  networkId="ethereum"
                  disabled={inDeploy}
                  currentConnectedNetwork={networkId}
                  gasPrices={gasPrices}
                />
                <DeployBox
                  project={project}
                  web3={web3}
                  contract={contract}
                  item={deployments.find(
                    (deployment) => deployment.network === "polygon"
                  )}
                  network="polygon"
                  networkId="polygon"
                  disabled={inDeploy}
                  currentConnectedNetwork={networkId}
                  gasPrices={gasPrices}
                />
                <DeployBox
                  project={project}
                  web3={web3}
                  contract={contract}
                  item={deployments.find(
                    (deployment) => deployment.network === "bsc"
                  )}
                  network="bsc"
                  networkId="bsc"
                  disabled={inDeploy}
                  currentConnectedNetwork={networkId}
                  gasPrices={gasPrices}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
