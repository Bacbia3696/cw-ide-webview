import { Bech32Address } from "@keplr-wallet/cosmos";
import { ChainInfoWithExplorer } from "./stores/chain";

/**
 * A list of Cosmos chain infos. If we need to add / remove any chains, just directly update this variable.
 */
export const EmbedChainInfos: ChainInfoWithExplorer[] = [
  {
    rpc: "https://testnet-rpc.orai.io",
    rest: "https://testnet-lcd.orai.io",
    chainId: "Oraichain-testnet",
    chainName: "Oraichain Testnet",
    stakeCurrency: {
      coinDenom: "ORAI",
      coinMinimalDenom: "orai",
      coinDecimals: 6,
      coinGeckoId: "oraichain-token",
      coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
    },
    bip44: {
      coinType: 118
    },
    bech32Config: Bech32Address.defaultBech32Config("orai"),
    currencies: [
      {
        coinDenom: "ORAI",
        coinMinimalDenom: "orai",
        coinDecimals: 6,
        coinGeckoId: "oraichain-token",
        coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ORAI",
        coinMinimalDenom: "orai",
        coinDecimals: 6,
        coinGeckoId: "oraichain-token",
        coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
      }
    ],
    gasPriceStep: {
      low: 0,
      average: 0.0025,
      high: 0.004
    },
    features: ["stargate", "ibc-transfer", "cosmwasm"],
    explorerUrlToTx: "https://testnet.scan.orai.io/txs/${txHash}",
    cosmwasmVersion: "1.0.0",
    faucet: "https://testnet-faucet.web.app/"
  },
  {
    rpc: "https://rpc.orai.io",
    rest: "https://lcd.orai.io",
    chainId: "Oraichain",
    chainName: "Oraichain",
    stakeCurrency: {
      coinDenom: "ORAI",
      coinMinimalDenom: "orai",
      coinDecimals: 6,
      coinGeckoId: "oraichain-token",
      coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
    },
    walletUrl: "https://api.wallet.orai.io",
    bip44: {
      coinType: 118
    },
    bech32Config: Bech32Address.defaultBech32Config("orai"),
    currencies: [
      {
        coinDenom: "ORAI",
        coinMinimalDenom: "orai",
        coinDecimals: 6,
        coinGeckoId: "oraichain-token",
        coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
      },
      {
        coinDenom: "ORAI",
        coinMinimalDenom: "orai",
        coinDecimals: 6,
        coinGeckoId: "oraichain-token",
        coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "ORAI",
        coinMinimalDenom: "orai",
        coinDecimals: 6,
        coinGeckoId: "oraichain-token",
        coinImageUrl: window.location.origin + "/public/assets/tokens/orai.png"
      }
    ],
    gasPriceStep: {
      low: 0,
      average: 0.0025,
      high: 0.004
    },
    features: ["stargate", "ibc-transfer", "cosmwasm"],
    explorerUrlToTx: "https://scan.orai.io/txs/${txHash}",
    cosmwasmVersion: "0.13.2"
  },
  // {
  //   rpc: "https://rpc.malaga-420.cosmwasm.com",
  //   rest: "https://api.malaga-420.cosmwasm.com",
  //   chainId: "malaga-420",
  //   chainName: "Malaga",
  //   stakeCurrency: {
  //     coinDenom: "Málaga",
  //     coinMinimalDenom: "umlg",
  //     coinDecimals: 6,
  //     coinImageUrl: ""
  //   },
  //   bip44: {
  //     coinType: 118
  //   },
  //   bech32Config: {
  //     bech32PrefixAccAddr: "wasm",
  //     bech32PrefixAccPub: "wasmpub",
  //     bech32PrefixConsAddr: "wasmvalcons",
  //     bech32PrefixConsPub: "wasmvalconspub",
  //     bech32PrefixValAddr: "wasmvaloper",
  //     bech32PrefixValPub: "wasmvaloperpub"
  //   },
  //   currencies: [
  //     {
  //       coinDenom: "Málaga",
  //       coinMinimalDenom: "umlg",
  //       coinDecimals: 6,
  //       coinImageUrl: ""
  //     }
  //   ],
  //   feeCurrencies: [
  //     {
  //       coinDenom: "Málaga",
  //       coinMinimalDenom: "umlg",
  //       coinDecimals: 6,
  //       coinImageUrl: ""
  //     }
  //   ],
  //   gasPriceStep: {
  //     low: 0,
  //     average: 0.025,
  //     high: 0.004
  //   },
  //   features: ["stargate", "ibc-transfer", "cosmwasm"],
  //   cosmwasmVersion: "1.0.0"
  // },
  {
    rpc: "https://rpc-test.osmosis.zone",
    rest: "https://lcd-test.osmosis.zone",
    chainId: "osmo-test-4",
    chainName: "Osmosis Testnet",
    stakeCurrency: {
      coinDenom: "OSMO",
      coinMinimalDenom: "uosmo",
      coinDecimals: 6,
      coinImageUrl: ""
    },
    bip44: {
      coinType: 118
    },
    bech32Config: {
      bech32PrefixAccAddr: "osmo",
      bech32PrefixAccPub: "osmopub",
      bech32PrefixConsAddr: "osmovalcons",
      bech32PrefixConsPub: "osmovalconspub",
      bech32PrefixValAddr: "osmosvaloper",
      bech32PrefixValPub: "osmovaloperpub"
    },
    currencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinImageUrl: ""
      }
    ],
    feeCurrencies: [
      {
        coinDenom: "OSMO",
        coinMinimalDenom: "uosmo",
        coinDecimals: 6,
        coinImageUrl: ""
      }
    ],
    gasPriceStep: {
      low: 0,
      average: 0.025,
      high: 0.004
    },
    features: ["stargate", "ibc-transfer", "cosmwasm"],
    cosmwasmVersion: "1.0.0",
    faucet: "https://faucet.osmosis.zone/"
  },
  // {
  //   rpc: "https://rpc.osmosis.zone",
  //   rest: "https://lcd.osmosis.zone",
  //   chainId: "osmosis-1",
  //   chainName: "Osmosis Mainnet",
  //   stakeCurrency: {
  //     coinDenom: "OSMO",
  //     coinMinimalDenom: "uosmo",
  //     coinDecimals: 6,
  //     coinImageUrl: ""
  //   },
  //   bip44: {
  //     coinType: 118
  //   },
  //   bech32Config: {
  //     bech32PrefixAccAddr: "osmo",
  //     bech32PrefixAccPub: "osmopub",
  //     bech32PrefixConsAddr: "osmovalcons",
  //     bech32PrefixConsPub: "osmovalconspub",
  //     bech32PrefixValAddr: "osmosvaloper",
  //     bech32PrefixValPub: "osmovaloperpub"
  //   },
  //   currencies: [
  //     {
  //       coinDenom: "OSMO",
  //       coinMinimalDenom: "uosmo",
  //       coinDecimals: 6,
  //       coinImageUrl: ""
  //     }
  //   ],
  //   feeCurrencies: [
  //     {
  //       coinDenom: "OSMO",
  //       coinMinimalDenom: "uosmo",
  //       coinDecimals: 6,
  //       coinImageUrl: ""
  //     }
  //   ],
  //   gasPriceStep: {
  //     low: 0,
  //     average: 0.025,
  //     high: 0.004
  //   },
  //   features: ["stargate", "ibc-transfer", "cosmwasm"],
  //   cosmwasmVersion: "1.0.0",
  //   explorerUrlToTx: "https://www.mintscan.io/osmosis/txs/${txHash}",
  // },
  // {
  //   rpc: "https://rpc.one.theta-devnet.polypore.xyz",
  //   rest: "https://rest.one.theta-devnet.polypore.xyz",
  //   chainId: "theta-testnet-001",
  //   chainName: "CosmosHub Testnet",
  //   stakeCurrency: {
  //     coinDenom: "ATOM",
  //     coinMinimalDenom: "uatom",
  //     coinDecimals: 6,
  //     coinImageUrl: ""
  //   },
  //   bip44: {
  //     coinType: 118
  //   },
  //   bech32Config: {
  //     bech32PrefixAccAddr: "atom",
  //     bech32PrefixAccPub: "atompub",
  //     bech32PrefixConsAddr: "atomvalcons",
  //     bech32PrefixConsPub: "atomvalconspub",
  //     bech32PrefixValAddr: "atomsvaloper",
  //     bech32PrefixValPub: "atomvaloperpub"
  //   },
  //   currencies: [
  //     {
  //       coinDenom: "ATOM",
  //       coinMinimalDenom: "uatom",
  //       coinDecimals: 6,
  //       coinImageUrl: ""
  //     }
  //   ],
  //   feeCurrencies: [
  //     {
  //       coinDenom: "ATOM",
  //       coinMinimalDenom: "uatom",
  //       coinDecimals: 6,
  //       coinImageUrl: ""
  //     }
  //   ],
  //   gasPriceStep: {
  //     low: 0,
  //     average: 0.025,
  //     high: 0.004
  //   },
  //   features: ["stargate", "ibc-transfer", "cosmwasm"],
  //   cosmwasmVersion: "1.0.0",
  //   explorerUrlToTx: "https://explorer.theta-testnet.polypore.xyz/transactions/{txhash}"
  // },
];
