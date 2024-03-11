export const settings = {
  mainnet: {
    bridge: {
      address: "0x32400084C286CF3E17e7B677ea9583e60a000324"
    },
    networks: {
      zksync: {
        rpc: "https://mainnet.era.zksync.io",
        explorerLink: "https://explorer.zksync.io/tx/",
        chainId: 324
      },
      ethereum: {
        rpc: "https://mainnet.infura.io/v3/c7abbeca8edc486c8b9682db085fe3a8",
        explorerLink: "https://etherscan.io/tx/",
        chainId: 1
      },
      arbitrumOne: {
        name: "ArbitrumOneMainnet",
        rpc: "https://arb-mainnet.g.alchemy.com/v2/_R6zN545J3IrhD7MeG6E3XKZyZAxBbfW",
        explorerLink: "https://arbiscan.io/tx/",
        chainId: 42161,
        networkCode: 4,
        bridge: "0x5e809A85Aa182A9921EDD10a4163745bb3e36284"
      },
      scrollMainnet: {
        name: "ScrollMainnet",
        rpc: "https://rpc.scroll.io",
        explorerLink: "https://scrollscan.com/tx/",
        chainId: 534352,
        networkCode: 6,
        bridge: "0x5e809A85Aa182A9921EDD10a4163745bb3e36284"
      },
      sepolia: {
        name: "Sepolia",
        rpc: "https://ethereum-sepolia.publicnode.com",
        chainId: 11155111
      },
      scrollSepolia: {
        name: "ScrollSepolia",
        rpc: "https://scroll-sepolia.blockpi.network/v1/rpc/public",
        chainId: 534351
      },
      goerli: {
        name: "EthereumGoerli",
        rpc: "https://eth-goerli.g.alchemy.com/v2/9SJxEDr4JS4Yq8dWH6b1XcXTUWXrMu4J",
        chainId: 5,
        networkCode: 5001,
        bridge: "0x5e809A85Aa182A9921EDD10a4163745bb3e36284"
      },
      arbitrumGoerli: {
        name: "ArbitrumGoerli",
        rpc: "https://endpoints.omniatech.io/v1/arbitrum/goerli/public",
        chainId: 421613,
        networkCode: 5004,
        bridge: "0x5e809A85Aa182A9921EDD10a4163745bb3e36284"
      }
    },
    swap: {
      syncswap: {
        zksync: {
          router: "0x2da10A1e27bF85cEdD8FFb1AbBe97e53391C0295",
          poolFactory: "0xf2DAd89f2788a8CD54625C60b55cD3d2D0ACa7Cb"
        },
        scrollMainnet: {
          router: "0x80e38291e06339d10AAB483C65695D004dBD5C69",
          poolFactory: "0x37BAc764494c8db4e54BDE72f6965beA9fa0AC2d"
        }
      },
      mute: {
        router: {
          address: "0x8B791913eB07C32779a16750e3868aA8495F5964"
        }
      },
      sushiSwap: {
        apiUrl: "https://production.sushi.com/swap/v3.2",
        address: "0xCA6Fe749878841b96F620Ec79638B13dAaD3D320"
      },
      xyFinance: {
        apiUrl: "https://open-api.xy.finance/v1"
      },
      velocore: {
        address: "0xf5E67261CB357eDb6C7719fEFAFaaB280cB5E2A6"
      },
      spaceFinance: {
        address: "0xbE7D1FD1f6748bbDefC4fbaCafBb11C6Fc506d1d"
      },
      mav: {
        pool: "0x41c8cf74c27554a8972d3bf3d2bd4a14d8b604ab",
        router: "0x39E098A153Ad69834a9Dac32f0FCa92066aD03f4"
      },
      izumi: {
        zksync: {
          swap: "0x943ac2310D9BC703d6AB5e5e76876e212100f894",
          quoter: "0x30C089574551516e5F1169C32C6D429C92bf3CD7"
        },
        scrollMainnet: {
          swap: "0x2db0AFD0045F3518c77eC6591a542e326Befd3D7",
          quoter: "0x3EF68D3f7664b2805D4E88381b64868a56f88bC4"
        }
      },
      wowmax: {
        zksync: {
          swap: ""
        },
        scrollMainnet: {
          swap: "0x2C33ff94b51D43028bDb98429619744481488075",
        },
        apiUrl: "https://api-gateway.wowmax.exchange/chains/{chainId}/swap"
      }
    },
    supply: {
      nexon: {
        address: "0x1BbD33384869b30A323e15868Ce46013C82B86FB"
      }
    },
    tokens: {
      zksync: {
        eth: {
          address: "0x0000000000000000000000000000000000000000",
          xyAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" // XY finance uses this one for ETH
        },
        weth: {
          address: "0x5AEa5775959fBC2557Cc8789bC1bf90A239D9a91"
        },
        usdc: {
          address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4"
        }
      },
      scrollMainnet: {
        eth: {
          address: "0x0000000000000000000000000000000000000000",
          xyAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee" // SushiSwap finance uses this one for ETH
        },
        weth: {
          address: "0x5300000000000000000000000000000000000004"
        },
        usdc: {
          address: "0x06eFdBFf2a14a7c8E15944D1F4A48F9F95F663A4"
        }
      }
    }
  },
  directSwap: {
    zksync: {
      syncSwap: "Syncswap ETH/USDC",
      muteSwap: "Mute Swap ETH/USDC",
      swapVelocore: "Velocore Swap ETH/USDC",
      izumiSwap: "IZUMI Swap ETH/USDC",
      mavSwap: "MAV Swap ETH/USDC",
      // xySwap: 'XY Finance swap ETH/USDC', // Not working bc of min amount
      // symbiosisSwap: 'Symbiosis Swap ETH/USDC', // Only working in cross-chain
      // swapSpaceFi: 'SpaceFi Swap ETH/USDC'  
    },
    scrollMainnet: {
      syncSwap: "Syncswap ETH/USDC",
      sushiSwap: "Sushiswap ETH/USDC",
      izumiSwap: "IZUMI Swap ETH/USDC",
      wowmaxSwap: "WowMax Swap ETH/USDC"
    }
  },
  reverseSwap: {
    zksync: {
      syncSwapReverse: "Syncswap USDC/ETH",
      muteSwapReverse: "Mute Swap USDC/ETH",
      izumiSwapReverse: "IZUMI Swap USDC/ETH",
    // swapVelocoreReverse: "Velocore Swap USDC/ETH",
    // mavSwapReverse: "MAV Swap USDC/ETH",
    // symbiosisSwapReverse: 'Symbiosis Swap USDC/ETH', // Only working in cross-chain
    // swapSpaceFiReverse: 'SpaceFi Swap USDC/ETH'
    },

    scrollMainnet: {
      syncSwapReverse: "Syncswap USDC/ETH",
      sushiSwapReverse: "Sushiswap USDC/ETH",
      izumiSwapReverse: "IZUMI Swap USDC/ETH",
      wowmaxSwapReverse: "WowMax Swap USDC/ETH"
    }
  },
  otherOperations: {
    bridge: "Bridge",
    supply: "Nexon finance supply ETH"
  }
}
export const network = "mainnet" // change for 'mainnet' for production
