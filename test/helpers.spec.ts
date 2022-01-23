import { ContractReceipt } from "ethers";

export const getGasWei = (txReceipt: ContractReceipt) => txReceipt.effectiveGasPrice.mul(txReceipt.gasUsed);
