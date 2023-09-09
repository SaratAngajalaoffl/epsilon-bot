import { ethers } from "ethers";

export const percentOf = (
  number: ethers.BigNumber,
  percent: number,
  denominator: number = 100,
): ethers.BigNumber => {
  while (percent < 0) {
    percent *= 10;
    denominator *= 10;
  }

  return number.mul(percent).div(denominator);
};

export const generateKeysFromPassword = (password: string) => {
  var privateKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password)); // v5
  var wallet = new ethers.Wallet(privateKey);
  return {
    address: wallet.address,
    privateKey: privateKey,
  };
};
