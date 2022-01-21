/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Vault2, Vault2Interface } from "../Vault2";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Burned",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "Minted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600d81526020017f5661756c742057726170706572000000000000000000000000000000000000008152506040518060400160405280600581526020017f5641554c54000000000000000000000000000000000000000000000000000000815250816003908051906020019062000096929190620000b8565b508060049080519060200190620000af929190620000b8565b505050620001cd565b828054620000c69062000168565b90600052602060002090601f016020900481019282620000ea576000855562000136565b82601f106200010557805160ff191683800117855562000136565b8280016001018555821562000136579182015b828111156200013557825182559160200191906001019062000118565b5b50905062000145919062000149565b5090565b5b80821115620001645760008160009055506001016200014a565b5090565b600060028204905060018216806200018157607f821691505b602082108114156200019857620001976200019e565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b611d9f80620001dd6000396000f3fe6080604052600436106100c25760003560e01c806342966c681161007f578063a0712d6811610059578063a0712d6814610290578063a457c2d7146102ac578063a9059cbb146102e9578063dd62ed3e14610326576100c2565b806342966c68146101ff57806370a082311461022857806395d89b4114610265576100c2565b806306fdde03146100c7578063095ea7b3146100f257806318160ddd1461012f57806323b872dd1461015a578063313ce5671461019757806339509351146101c2575b600080fd5b3480156100d357600080fd5b506100dc610363565b6040516100e99190611589565b60405180910390f35b3480156100fe57600080fd5b50610119600480360381019061011491906112a4565b6103f5565b604051610126919061156e565b60405180910390f35b34801561013b57600080fd5b50610144610413565b604051610151919061174b565b60405180910390f35b34801561016657600080fd5b50610181600480360381019061017c9190611255565b61041d565b60405161018e919061156e565b60405180910390f35b3480156101a357600080fd5b506101ac610515565b6040516101b99190611766565b60405180910390f35b3480156101ce57600080fd5b506101e960048036038101906101e491906112a4565b61051e565b6040516101f6919061156e565b60405180910390f35b34801561020b57600080fd5b50610226600480360381019061022191906112e0565b6105ca565b005b34801561023457600080fd5b5061024f600480360381019061024a91906111f0565b6106fe565b60405161025c919061174b565b60405180910390f35b34801561027157600080fd5b5061027a610746565b6040516102879190611589565b60405180910390f35b6102aa60048036038101906102a591906112e0565b6107d8565b005b3480156102b857600080fd5b506102d360048036038101906102ce91906112a4565b6108a1565b6040516102e0919061156e565b60405180910390f35b3480156102f557600080fd5b50610310600480360381019061030b91906112a4565b61098c565b60405161031d919061156e565b60405180910390f35b34801561033257600080fd5b5061034d60048036038101906103489190611219565b6109aa565b60405161035a919061174b565b60405180910390f35b606060038054610372906118ba565b80601f016020809104026020016040519081016040528092919081815260200182805461039e906118ba565b80156103eb5780601f106103c0576101008083540402835291602001916103eb565b820191906000526020600020905b8154815290600101906020018083116103ce57829003601f168201915b5050505050905090565b6000610409610402610a31565b8484610a39565b6001905092915050565b6000600254905090565b600061042a848484610c04565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000610475610a31565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050828110156104f5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ec9061166b565b60405180910390fd5b61050985610501610a31565b858403610a39565b60019150509392505050565b60006012905090565b60006105c061052b610a31565b848460016000610539610a31565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020546105bb91906117a8565b610a39565b6001905092915050565b6000811161060d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106049061164b565b60405180910390fd5b6106173382610e85565b60003373ffffffffffffffffffffffffffffffffffffffff168260405161063d90611559565b60006040518083038185875af1925050503d806000811461067a576040519150601f19603f3d011682016040523d82523d6000602084013e61067f565b606091505b50509050806106c3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106ba9061162b565b60405180910390fd5b7fd83c63197e8e676d80ab0122beba9a9d20f3828839e9a1d6fe81d242e9cd7e6e826040516106f2919061174b565b60405180910390a15050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b606060048054610755906118ba565b80601f0160208091040260200160405190810160405280929190818152602001828054610781906118ba565b80156107ce5780601f106107a3576101008083540402835291602001916107ce565b820191906000526020600020905b8154815290600101906020018083116107b157829003601f168201915b5050505050905090565b6000811161081b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108129061164b565b60405180910390fd5b80341461085d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610854906116eb565b60405180910390fd5b610867333461105c565b7f176b02bb2d12439ff7a20b59f402cca16c76f50508b13ef3166a600eb719354a81604051610896919061174b565b60405180910390a150565b600080600160006108b0610a31565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561096d576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109649061170b565b60405180910390fd5b610981610978610a31565b85858403610a39565b600191505092915050565b60006109a0610999610a31565b8484610c04565b6001905092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610aa9576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610aa0906116cb565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610b19576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b10906115eb565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610bf7919061174b565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610c74576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c6b906116ab565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ce4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cdb906115ab565b60405180910390fd5b610cef8383836111bc565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610d75576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d6c9061160b565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e0891906117a8565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610e6c919061174b565b60405180910390a3610e7f8484846111c1565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610ef5576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610eec9061168b565b60405180910390fd5b610f01826000836111bc565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610f87576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f7e906115cb565b60405180910390fd5b8181036000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160026000828254610fde91906117fe565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051611043919061174b565b60405180910390a3611057836000846111c1565b505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156110cc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110c39061172b565b60405180910390fd5b6110d8600083836111bc565b80600260008282546110ea91906117a8565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825461113f91906117a8565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516111a4919061174b565b60405180910390a36111b8600083836111c1565b5050565b505050565b505050565b6000813590506111d581611d3b565b92915050565b6000813590506111ea81611d52565b92915050565b60006020828403121561120257600080fd5b6000611210848285016111c6565b91505092915050565b6000806040838503121561122c57600080fd5b600061123a858286016111c6565b925050602061124b858286016111c6565b9150509250929050565b60008060006060848603121561126a57600080fd5b6000611278868287016111c6565b9350506020611289868287016111c6565b925050604061129a868287016111db565b9150509250925092565b600080604083850312156112b757600080fd5b60006112c5858286016111c6565b92505060206112d6858286016111db565b9150509250929050565b6000602082840312156112f257600080fd5b6000611300848285016111db565b91505092915050565b61131281611844565b82525050565b600061132382611781565b61132d8185611797565b935061133d818560208601611887565b6113468161194a565b840191505092915050565b600061135e602383611797565b91506113698261195b565b604082019050919050565b6000611381602283611797565b915061138c826119aa565b604082019050919050565b60006113a4602283611797565b91506113af826119f9565b604082019050919050565b60006113c7602683611797565b91506113d282611a48565b604082019050919050565b60006113ea601483611797565b91506113f582611a97565b602082019050919050565b600061140d602983611797565b915061141882611ac0565b604082019050919050565b6000611430602883611797565b915061143b82611b0f565b604082019050919050565b6000611453602183611797565b915061145e82611b5e565b604082019050919050565b6000611476602583611797565b915061148182611bad565b604082019050919050565b600061149960008361178c565b91506114a482611bfc565b600082019050919050565b60006114bc602483611797565b91506114c782611bff565b604082019050919050565b60006114df604583611797565b91506114ea82611c4e565b606082019050919050565b6000611502602583611797565b915061150d82611cc3565b604082019050919050565b6000611525601f83611797565b915061153082611d12565b602082019050919050565b61154481611870565b82525050565b6115538161187a565b82525050565b60006115648261148c565b9150819050919050565b60006020820190506115836000830184611309565b92915050565b600060208201905081810360008301526115a38184611318565b905092915050565b600060208201905081810360008301526115c481611351565b9050919050565b600060208201905081810360008301526115e481611374565b9050919050565b6000602082019050818103600083015261160481611397565b9050919050565b60006020820190508181036000830152611624816113ba565b9050919050565b60006020820190508181036000830152611644816113dd565b9050919050565b6000602082019050818103600083015261166481611400565b9050919050565b6000602082019050818103600083015261168481611423565b9050919050565b600060208201905081810360008301526116a481611446565b9050919050565b600060208201905081810360008301526116c481611469565b9050919050565b600060208201905081810360008301526116e4816114af565b9050919050565b60006020820190508181036000830152611704816114d2565b9050919050565b60006020820190508181036000830152611724816114f5565b9050919050565b6000602082019050818103600083015261174481611518565b9050919050565b6000602082019050611760600083018461153b565b92915050565b600060208201905061177b600083018461154a565b92915050565b600081519050919050565b600081905092915050565b600082825260208201905092915050565b60006117b382611870565b91506117be83611870565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156117f3576117f26118ec565b5b828201905092915050565b600061180982611870565b915061181483611870565b925082821015611827576118266118ec565b5b828203905092915050565b600061183d82611850565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b838110156118a557808201518184015260208101905061188a565b838111156118b4576000848401525b50505050565b600060028204905060018216806118d257607f821691505b602082108114156118e6576118e561191b565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008201527f6365000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f4661696c656420746f2073656e64204574686572000000000000000000000000600082015250565b7f496e76616c696420616d6f756e742c2073686f756c642062652067726561746560008201527f72207468616e20302e0000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b50565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f496e76616c696420616d6f756e742c2069742073686f756c6420657175616c2060008201527f74686520616d6f756e74206f662077656920696e20746865207472616e73616360208201527f74696f6e2e000000000000000000000000000000000000000000000000000000604082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b611d4481611832565b8114611d4f57600080fd5b50565b611d5b81611870565b8114611d6657600080fd5b5056fea2646970667358221220320e5497b0cfd01f2063047dba8b1ba5f9b8bb811da2b2ad6400855ddb36807c64736f6c63430008040033";

type Vault2ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: Vault2ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Vault2__factory extends ContractFactory {
  constructor(...args: Vault2ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Vault2";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Vault2> {
    return super.deploy(overrides || {}) as Promise<Vault2>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Vault2 {
    return super.attach(address) as Vault2;
  }
  connect(signer: Signer): Vault2__factory {
    return super.connect(signer) as Vault2__factory;
  }
  static readonly contractName: "Vault2";
  public readonly contractName: "Vault2";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Vault2Interface {
    return new utils.Interface(_abi) as Vault2Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Vault2 {
    return new Contract(address, _abi, signerOrProvider) as Vault2;
  }
}
