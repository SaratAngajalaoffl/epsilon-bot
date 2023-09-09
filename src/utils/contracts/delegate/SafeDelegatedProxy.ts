import { ethers } from "ethers";

import { BaseContract } from "../BaseContract";
import defaultAbi from "./artifacts/abi.json";

export class SafeDelegatedContract extends BaseContract {
  constructor(abi: ethers.ContractInterface = defaultAbi) {
    const chainId: number = 1;
    const address: string = process.env["SAFE_PROXY_ADDRESS"] ?? "";
    const privateKey: string = process.env["BOT_PRIVATE_KEY"] ?? "";

    super(chainId, address, privateKey, abi);
  }

  public async setMaxContractAllowance(
    safeWalletAddress: string,
    amount: ethers.BigNumber,
  ) {
    const method = "setMaxContractAllowance";

    const peanutForwarderContract =
      process.env["PEANUT_FORWARDER_CONTRACT"] ?? "";

    const gasPrice = (await this.wallet.getFeeData()).maxFeePerGas;

    if (!this.contract.estimateGas[method] || !gasPrice) {
      throw new Error("ERR_CHCK_1");
    }

    const gasLimit = await this.contract.estimateGas[method](
      safeWalletAddress,
      peanutForwarderContract,
      amount,
      this.contract.address,
      {
        gasPrice,
      },
    );

    const tx = await this.contract[method](
      safeWalletAddress,
      peanutForwarderContract,
      amount,
      this.contract.address,
      {
        gasLimit,
        gasPrice,
      },
    );

    await tx.wait();
  }

  public async createPeanutLink(
    safeWalletAddress: string,
    amount: ethers.BigNumber,
    key: string,
  ) {
    const method = "createPeanutLink";

    const peanutForwarderContract =
      process.env["PEANUT_FORWARDER_CONTRACT"] ?? "";

    const gasPrice = (await this.wallet.getFeeData()).maxFeePerGas;

    if (!this.contract.estimateGas[method] || !gasPrice) {
      throw new Error("ERR_CHCK_1");
    }

    const gasLimit = await this.contract.estimateGas[method](
      safeWalletAddress,
      peanutForwarderContract,
      amount,
      key,
      {
        gasPrice,
      },
    );

    const tx = await this.contract[method](
      safeWalletAddress,
      peanutForwarderContract,
      amount,
      key,
      {
        gasLimit,
        gasPrice,
      },
    );

    return await tx.wait();
  }
}
