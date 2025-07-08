import { createWalletClient, createPublicClient, custom, http } from "viem";
import { base } from "viem/chains";

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

// función para obtener el walletClient con cuenta conectada
export async function getWalletClient() {
  if (!window.ethereum) {
    throw new Error("No se detectó una wallet como MetaMask");
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts",
  });

  return createWalletClient({
    chain: base,
    transport: custom(window.ethereum),
    account: accounts[0] as `0x${string}`,
  });
}

export const walletClient = createWalletClient({
  chain: base,
  transport: custom((window as any).ethereum),
});