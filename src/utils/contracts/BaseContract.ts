import { ethers } from "ethers";
import { getRpcUrl } from "../config";

export class BaseContract {
  contract: ethers.Contract;
  wallet: ethers.Signer;

  rpc: string;
  chainId: number;

  constructor(
    chainId: number,
    address: string,
    pk: string,
    abi: ethers.ContractInterface,
  ) {
    this.chainId = chainId;
    this.rpc = getRpcUrl("eth");

    const provider = new ethers.providers.JsonRpcProvider(this.rpc);
    this.wallet = new ethers.Wallet(pk, provider);

    this.contract = new ethers.Contract(address, abi, this.wallet);
  }
}
