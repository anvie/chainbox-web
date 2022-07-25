// import useSWR from "swr";
import { toHeaderCase, toPascalCase } from "js-convert-case";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import { formatError, shortenHash } from "../lib/Utils";
import { Loading } from "./Loading";
import SmallButton from "./SmallButton";
import fw from "../lib/FetchWrapper";
import Web3 from "web3";
import { userAccess } from "../lib/UserAccess";
import { getPrice, getPriceHuman } from "../lib/pricing";
import { watchTransaction } from "../lib/txutils";
import { ethRpcError } from "../lib/ErrorHandler";

const explorerUrl = (network: string) => {
  if (network === "chainbox") {
    return "https://scan.chainbox.id";
  } else if (network === "rinkeby") {
    return "https://rinkeby.etherscan.io";
  } else if (network === "mainnet") {
    return "https://etherscan.io";
  } else if (network === "polygon") {
    return "https://polygonscan.com";
  } else if (network === "bsc") {
    return "https://bscscan.com";
  } else {
    return "???";
  }
};

interface DeployBoxProps {
  item: any;
  network: string;
  networkId: string;
  disabled: boolean;
  project: any;
  web3: Web3;
  contract: Contract;
  currentConnectedNetwork: string;
  gasPrices: any;
  // doDeploy: (network: string) => Promise<any>;
}

const DeployBox: FC<DeployBoxProps> = ({
  item,
  network,
  networkId,
  disabled,
  project,
  web3,
  contract,
  currentConnectedNetwork,
  gasPrices,
  // doDeploy,
}) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [_item, setItem] = useState<any>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);
  const [inDeployment, setInDeployment] = useState(false);
  const [caption, setCaption] = useState("Deploy");
  const [isDisabled, setIsDisabled] = useState(false);
  const [inDownloadSji, setInDownloadSji] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setItem(item);
      if (project.meta.deployment && project.meta.deployment[networkId]) {
        if (project.meta.deployment[networkId]?.status === "in progress") {
          setInDeployment(true);
        }
        if (project.meta.deployment[networkId]?.status) {
          setCaption(project.meta.deployment[networkId]?.status);
          setIsDisabled(true);
        }
      }
      setLoaded(true);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const isDeployed = item != null;
  // let _disabled = disabled || isDeployed;

  // let _caption = isDeployed ? "Deployed" : "Deploy";

  useEffect(() => {
    let iVal: NodeJS.Timer | null = null;
    if (inDeployment) {
      // _disabled = true;
      setCaption("deploying...");
      setIsDisabled(true);

      iVal = setInterval(() => {
        fw.get(`/v1/project-status/${project._id}?network=${network}`).then(
          (data) => {
            if (data && data.result) {
              setCaption("Deployed");
              setItem(data.result);
              if (iVal) {
                clearInterval(iVal);
                iVal = null;
              }
            }
          }
        );
      }, 5000);
    } else {
      // _disabled = false;
      setCaption(`Deploy`);
      setIsDisabled(false);
    }

    return () => {
      if (iVal) {
        clearInterval(iVal);
        iVal = null;
      }
    };
  }, [inDeployment]);

  const _doDeploy = async (): Promise<any> => {
    if (isDisabled) {
      return;
    }

    // check is network currently user connected is the same as the network the project is going to deployed on
    if (currentConnectedNetwork.toLowerCase() !== networkId) {
      console.log(
        "🚀 ~ file: DeployBox.tsx ~ line 98 ~ const_doDeploy= ~ networkId",
        networkId
      );
      console.log(
        "🚀 ~ file: DeployBox.tsx ~ line 98 ~ const_doDeploy= ~ currentConnectedNetwork",
        currentConnectedNetwork
      );
      setErrorInfo(
        `You are not connected to ${toHeaderCase(
          network
        )} network. Please switch your network.`
      );
      return;
    }

    setLoading(true);
    setInDeployment(true);
    setErrorInfo(null);

    const { ethAddress } = userAccess.accessValue;
    const price = getPrice(networkId);

    if (contract && web3 && ethAddress) {
      console.log("ethAddress:", ethAddress);
      console.log("price:", price);
      const sendData: any = {
        from: ethAddress,
        value: price,
        gasLimit: web3.utils.toHex(610000),
        nonce: web3.utils.toHex(
          await web3.eth.getTransactionCount(ethAddress, "pending")
        ),
      };

      // if (process.env.NODE_ENV === "production") {
      // sendData["maxFeePerGas"] = web3.utils.toHex(
      //   web3.utils.toWei((qty < 2 ? 55 : 30 * qty).toString(), "gwei")
      // );
      // sendData["maxPriorityFeePerGas"] = web3.utils.toHex(
      //   web3.utils.toWei("90", "gwei")
      // );
      // }

      // setWaitMetamask(true);

      contract.methods
        .deployPayment(web3.utils.toBN(project._id))
        .send(sendData)
        .then((_tx: any) => {
          console.log(_tx);
          // registerPendingTx(_tx.transactionHash, ethAddress, qty);
          watchTransaction(web3, _tx);
          // onClose();
        })
        .catch((err: any) => {
          setErrorInfo(ethRpcError(err));
          setTimeout(() => setErrorInfo(null), 2000);
          setInDeployment(false);
          // alert(ethRpcError(err))
        })
        .finally(() => {
          // setWaitMetamask(false);
          // setEnableMintButton(true);
          setLoading(false);
        });
    }

    // return new Promise((resolve, reject) => {
    //   setLoading(true);
    //   fw.post(`/v1/deploy`, {
    //     projectId: project._id,
    //     network: network.toLowerCase(),
    //   })
    //     .then((resp:any) => {
    //       if (resp.error || resp.errors) {
    //         console.error("[ERROR]", resp.error || resp.errors);
    //         alert(formatError(resp.error || resp.errors));
    //         // setInDeploy(false);
    //         reject(resp.error || resp.errors);
    //       }
    //       // setInDeploy(false);
    //       setItem(resp.result);
    //       resolve(resp.result);
    //     })
    //     .catch((err) => {
    //       reject(err);
    //     }).finally(() => {
    //       setLoading(false);
    //     });
    // });
  };

  const downloadSji = async () => {
    if (inDownloadSji) {
      return;
    }
    setInDownloadSji(true);
    fw.get(`/generate-contract-sji?projectId=${project._id}`)
      .then((resp: any) => {
        console.log("🚀 ~ file: project.tsx ~ line 316 ~ .then ~ resp", resp);
        if (resp.error || resp.errors) {
          console.error("[ERROR]", resp.error || resp.errors);
          alert(formatError(resp.error || resp.errors));
          return;
        }
        const { file } = resp.result;
        window.open(
          `${process.env.BASE_URL_PROJECT_DATA_DIR}/${project.meta.generated}/${file}`,
          "_blank"
        );
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: project.tsx ~ line 329 ~ downloadSji ~ err",
          err
        );
        alert("Error during generating standard json input file");
      })
      .finally(() => {
        setInDownloadSji(false);
      });
  };

  const style: any = { minWidth: "400px" };

  return (
    <div
      className="border p-2 text-center w-96 text-white bg-gray-700 rounded-md"
      style={style}
    >
      <div className="mb-2">
        <span>{toHeaderCase(network)}</span>
        {["rinkeby", "chainbox"].includes(network) && (
          <span>&nbsp;[testnet]</span>
        )}
      </div>
      {_item && (
        <div className="text-sm">
          <div>
            <div>Contract address:</div>
            <div>
              <Link
                href={`${explorerUrl(network)}/address/${
                  _item.contractAddress
                }`}
              >
                <a target="_blank" className="link hover:text-blue-300">
                  {_item.contractAddress}
                </a>
              </Link>
            </div>
          </div>
          <div>
            TX:&nbsp;
            <Link href={`${explorerUrl(network)}/tx/${_item.txHash}`}>
              <a target="_balnk" className="link hover:text-blue-300">
                {shortenHash(_item.txHash)}
              </a>
            </Link>
          </div>

          <div>
            <Link
              href={`${process.env.BASE_URL_PROJECT_DATA_DIR}/${project.meta.generated}/${_item.abiFile}`}
            >
              <a
                className="p-2 link text-sm underline hover:text-blue-300"
                target="_blank"
              >
                Download ABI
              </a>
            </Link>

            <span
              className="p-2 link text-sm underline hover:text-blue-300"
              onClick={downloadSji}
            >
              Download SJI
            </span>
          </div>
        </div>
      )}
      {errorInfo && (
        <div className="p-2 bg-red-500 text-white mb-2">{errorInfo}</div>
      )}
      {!loaded && <Loading />}
      {loaded && !isDeployed && !_item && (
        <div>
          {gasPrices && (
            <div className=" text-gray-400 text-sm pt-2 pb-2 mb-2">
              <div>
                Deployment price:{" "}
                <span className="font-semibold">
                  {getPriceHuman(networkId)}
                </span>
              </div>
              <div>Current avg gas price: {gasPrices[networkId]} Gwei</div>
            </div>
          )}
          <SmallButton
            caption={caption}
            color="bg-orange-600"
            onClick={_doDeploy}
            loading={loading}
            disabled={isDisabled}
          />
        </div>
      )}
    </div>
  );
};

export default DeployBox;
