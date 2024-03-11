export const VelocoreRouterAbi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IGauge",
        name: "gauge",
        type: "address"
      },
      {
        indexed: true,
        internalType: "contract IBribe",
        name: "bribe",
        type: "address"
      }
    ],
    name: "BribeAttached",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IGauge",
        name: "gauge",
        type: "address"
      },
      {
        indexed: true,
        internalType: "contract IBribe",
        name: "bribe",
        type: "address"
      }
    ],
    name: "BribeKilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IConverter",
        name: "pool",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "Token[]",
        name: "tokenRef",
        type: "bytes32[]"
      },
      {
        indexed: false,
        internalType: "int128[]",
        name: "delta",
        type: "int128[]"
      }
    ],
    name: "Convert",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address"
          },
          {
            internalType: "enum IVault.FacetCutAction",
            name: "action",
            type: "uint8"
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]"
          }
        ],
        indexed: false,
        internalType: "struct IVault.FacetCut[]",
        name: "_diamondCut",
        type: "tuple[]"
      },
      {
        indexed: false,
        internalType: "address",
        name: "_init",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "_calldata",
        type: "bytes"
      }
    ],
    name: "DiamondCut",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IGauge",
        name: "pool",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "Token[]",
        name: "tokenRef",
        type: "bytes32[]"
      },
      {
        indexed: false,
        internalType: "int128[]",
        name: "delta",
        type: "int128[]"
      }
    ],
    name: "Gauge",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IGauge",
        name: "gauge",
        type: "address"
      },
      {
        indexed: false,
        internalType: "bool",
        name: "killed",
        type: "bool"
      }
    ],
    name: "GaugeKilled",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract ISwap",
        name: "pool",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "Token[]",
        name: "tokenRef",
        type: "bytes32[]"
      },
      {
        indexed: false,
        internalType: "int128[]",
        name: "delta",
        type: "int128[]"
      }
    ],
    name: "Swap",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address"
      },
      {
        indexed: false,
        internalType: "Token[]",
        name: "tokenRef",
        type: "bytes32[]"
      },
      {
        indexed: false,
        internalType: "int128[]",
        name: "delta",
        type: "int128[]"
      }
    ],
    name: "UserBalance",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "contract IGauge",
        name: "pool",
        type: "address"
      },
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        indexed: false,
        internalType: "int256",
        name: "voteDelta",
        type: "int256"
      }
    ],
    name: "Vote",
    type: "event"
  },
  {
    inputs: [
      {
        internalType: "contract IFacet",
        name: "implementation",
        type: "address"
      }
    ],
    name: "admin_addFacet",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "t",
        type: "bool"
      }
    ],
    name: "admin_pause",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IAuthorizer",
        name: "auth_",
        type: "address"
      }
    ],
    name: "admin_setAuthorizer",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "implementation",
        type: "address"
      },
      {
        internalType: "bytes4[]",
        name: "sigs",
        type: "bytes4[]"
      }
    ],
    name: "admin_setFunctions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "treasury",
        type: "address"
      }
    ],
    name: "admin_setTreasury",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "i",
        type: "uint256"
      }
    ],
    name: "allPairs",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "allPairsLength",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IGauge",
        name: "gauge",
        type: "address"
      },
      {
        internalType: "contract IBribe",
        name: "bribe",
        type: "address"
      }
    ],
    name: "attachBribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "ballotToken",
    outputs: [
      {
        internalType: "Token",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [],
    name: "emissionToken",
    outputs: [
      {
        internalType: "Token",
        name: "",
        type: "bytes32"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "Token[]",
        name: "tokenRef",
        type: "bytes32[]"
      },
      {
        internalType: "int128[]",
        name: "deposit",
        type: "int128[]"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "poolId",
            type: "bytes32"
          },
          {
            internalType: "bytes32[]",
            name: "tokenInformations",
            type: "bytes32[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        internalType: "struct VelocoreOperation[]",
        name: "ops",
        type: "tuple[]"
      }
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "method",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m1",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a1",
        type: "int128"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "execute1",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "method",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m1",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a1",
        type: "int128"
      },
      {
        internalType: "address",
        name: "t2",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m2",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a2",
        type: "int128"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "execute2",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "method",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m1",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a1",
        type: "int128"
      },
      {
        internalType: "address",
        name: "t2",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m2",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a2",
        type: "int128"
      },
      {
        internalType: "address",
        name: "t3",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m3",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a3",
        type: "int128"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "execute3",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "_functionSelector",
        type: "bytes4"
      }
    ],
    name: "facetAddress",
    outputs: [
      {
        internalType: "address",
        name: "facetAddress_",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "facetAddresses",
    outputs: [
      {
        internalType: "address[]",
        name: "facetAddresses_",
        type: "address[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_facet",
        type: "address"
      }
    ],
    name: "facetFunctionSelectors",
    outputs: [
      {
        internalType: "bytes4[]",
        name: "facetFunctionSelectors_",
        type: "bytes4[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "facets",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "facetAddress",
            type: "address"
          },
          {
            internalType: "bytes4[]",
            name: "functionSelectors",
            type: "bytes4[]"
          }
        ],
        internalType: "struct IVault.Facet[]",
        name: "facets_",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      }
    ],
    name: "getAmountsIn",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      }
    ],
    name: "getAmountsOut",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "t0",
        type: "address"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      }
    ],
    name: "getPair",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IGauge",
        name: "gauge",
        type: "address"
      },
      {
        internalType: "contract IBribe",
        name: "bribe",
        type: "address"
      }
    ],
    name: "killBribe",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "contract IGauge",
        name: "gauge",
        type: "address"
      },
      {
        internalType: "bool",
        name: "t",
        type: "bool"
      }
    ],
    name: "killGauge",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "Token",
        name: "",
        type: "bytes32"
      },
      {
        internalType: "uint128",
        name: "",
        type: "uint128"
      },
      {
        internalType: "uint128",
        name: "",
        type: "uint128"
      }
    ],
    name: "notifyInitialSupply",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address"
      },
      {
        internalType: "Token[]",
        name: "tokenRef",
        type: "bytes32[]"
      },
      {
        internalType: "int128[]",
        name: "deposit",
        type: "int128[]"
      },
      {
        components: [
          {
            internalType: "bytes32",
            name: "poolId",
            type: "bytes32"
          },
          {
            internalType: "bytes32[]",
            name: "tokenInformations",
            type: "bytes32[]"
          },
          {
            internalType: "bytes",
            name: "data",
            type: "bytes"
          }
        ],
        internalType: "struct VelocoreOperation[]",
        name: "ops",
        type: "tuple[]"
      }
    ],
    name: "query",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "method",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m1",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a1",
        type: "int128"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "query1",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "method",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m1",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a1",
        type: "int128"
      },
      {
        internalType: "address",
        name: "t2",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m2",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a2",
        type: "int128"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "query2",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "method",
        type: "uint8"
      },
      {
        internalType: "address",
        name: "t1",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m1",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a1",
        type: "int128"
      },
      {
        internalType: "address",
        name: "t2",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m2",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a2",
        type: "int128"
      },
      {
        internalType: "address",
        name: "t3",
        type: "address"
      },
      {
        internalType: "uint8",
        name: "m3",
        type: "uint8"
      },
      {
        internalType: "int128",
        name: "a3",
        type: "int128"
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes"
      }
    ],
    name: "query3",
    outputs: [
      {
        internalType: "int128[]",
        name: "",
        type: "int128[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "swapETHForExactTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "swapExactETHForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "swapExactTokensForETH",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountOutMin",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "swapExactTokensForTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountInMax",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "swapTokensForExactETH",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256"
      },
      {
        internalType: "uint256",
        name: "amountInMax",
        type: "uint256"
      },
      {
        internalType: "address[]",
        name: "path",
        type: "address[]"
      },
      {
        internalType: "address",
        name: "to",
        type: "address"
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256"
      }
    ],
    name: "swapTokensForExactTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]"
      }
    ],
    stateMutability: "nonpayable",
    type: "function"
  }
]
