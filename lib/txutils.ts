import Web3 from "web3";

function watchTransaction(web3: Web3, txHash: any): Promise<any> {
  console.log("🚀 watching tx.hash", txHash);
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


export { watchTransaction };

