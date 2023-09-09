const NETWORK_CONFIG = {
  eth: {
    rpc: "https://goerli.infura.io/v3/65de9f0218ba466880107a2edca5f5a2",
  },
  opt: {
    rpc: "https://optimism-goerli.infura.io/v3/65de9f0218ba466880107a2edca5f5a2",
  },
  base: {
    rpc: "https://goerli.base.org",
  },
  zora: {
    rpc: "https://rpc.zora.energy",
  },
};

export const getRpcUrl = (chain: "opt" | "base" | "zora" | "eth"): any => {
  return NETWORK_CONFIG[chain].rpc;
};
