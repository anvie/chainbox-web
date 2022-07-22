


export function ethRpcError(error: any) {
  console.log("🚀 ~ file: ErrorHandler.ts ~ line 5 ~ ethRpcError ~ error", error)
  switch (error.code) {
    case -32603: {
      if (error.message.includes("ender doesn't have enough funds")) {
        return "Insufficient funds";
      } else if (error.message.includes("Public mint not open yet")) {
        return "Public mint not open yet";
      } else if (
        error.message.includes("the tx doesn't have the correct nonce.")
      ) {
        return "Invalid nonce";
      } else if (error.message.includes("User denied")) {
        return "User denied transaction";
      } else if (error.message.includes("invalid nonce")) {
        return "Invalid nonce, or whitelist already used";
      } else if (error.message.includes("transaction: revert")) {
        const ret = error.message.match(
          /processing transaction: revert (.*?)"/
        );
        if (ret && ret.length > 1) {
          return ret[1];
        }
      }
      return error.message;
    }
    case -32602: {
      return error.message;
    }
    case 4001: {
      return "Transaction aborted";
    }
    default:
      return "Unknown error";
  }
}



