// import useSWR from "swr";
import { toHeaderCase } from "js-convert-case";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Contract } from "web3-eth-contract";
import { formatError, shortenHash } from "../lib/Utils";
import { Loading } from "./Loading";
import SmallButton from "./SmallButton";
import fw from "../lib/FetchWrapper";
import Web3 from "web3";
import { userAccess } from "../lib/UserAccess";
import { getPrice } from "../lib/pricing";
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
  // doDeploy,
}) => {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [_item, setItem] = useState<any>(null);
  const [errorInfo, setErrorInfo] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setItem(item);
      setLoaded(true);
    }, 1000);
  }, [item]);


  const isDeployed = item != null;
  let _disabled = disabled || isDeployed;
  const _caption = isDeployed ? "Deployed" : "Deploy";

  const _doDeploy = async (network: string): Promise<any> => {
    // setInDeploy(true);
    if (_disabled) {
      return;
    }

    setLoading(true);
    setErrorInfo(null);

    const {ethAddress} = userAccess.accessValue
    const price = getPrice(networkId);

    if (contract && web3 && ethAddress) {
      console.log("ethAddress:", ethAddress);
      console.log("price:", price);
      const sendData: any = {
        from: ethAddress,
        value: web3.utils.toBN(price),
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


  return (
    <div className="border p-2 text-center w-96">
      <div className="mb-2">{toHeaderCase(network)}</div>
      {_item && (
        <div className="text-sm">
          <div>
            <div>Contract address:</div> 
            <div>
              <Link href={`${explorerUrl(network)}/address/${_item.contractAddress}`}>
                <a target="_blank" className="link hover:text-blue-300">{_item.contractAddress}</a>
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
          </div>
        </div>
      )}
      {errorInfo && (<div className="p-2 bg-red-500 text-white mb-2">{errorInfo}</div>)}
      {!loaded && <Loading />}
      {!isDeployed && !_item && (
        <SmallButton
          caption={_caption}
          color="bg-orange-600"
          onClick={_doDeploy}
          loading={loading}
          disabled={_disabled}
        />
      )}
    </div>
  );
}

export default DeployBox;

