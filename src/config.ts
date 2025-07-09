import { createWalletClient, createPublicClient, custom, http } from "viem";
import { base } from "viem/chains";
import { sdk } from "@farcaster/miniapp-sdk";

declare global {
  interface Window {
    farcaster?: {
      wallet?: any;
    };
  }
}

const feedback = document.getElementById("feedback")!;

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

function isInFarcasterMiniApp(): boolean {
  try {
    return (
      typeof window !== 'undefined' &&
      !!window.farcaster &&
      !!sdk?.wallet?.getEthereumProvider
    );
  } catch {
    return false;
  }
}

export async function getWalletClient() {
  if (isInFarcasterMiniApp()) {
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      const accounts = await provider!.request({ 
        method: "eth_requestAccounts" 
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No hay cuentas disponibles de Farcaster");
      }

      return createWalletClient({
        chain: base,
        transport: custom(provider!),
        account: accounts[0] as `0x${string}`,
      });
    } catch (error) {
      console.error("Error con Farcaster:", error);
    }
  }

  if (!window.ethereum) {
    throw new Error("No se detectó ninguna wallet (MetaMask/Farcaster)");
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

export async function connectWallet() {
  try {
    const walletClient = await getWalletClient();
    feedback.textContent = "Wallet conectada correctamente";
    return walletClient;
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error en connectWallet:", error);
    return null;
  }
}

export function isWalletAvailable() {
  return isInFarcasterMiniApp() || !!window.ethereum;
}

export async function isWalletConnected() {
  if (isInFarcasterMiniApp()) {
    try {
      const provider = await sdk.wallet.getEthereumProvider();
      const accounts = await provider!.request({ method: 'eth_accounts' });
      return accounts.length > 0;
    } catch {
      return false;
    }
  }

  if (window.ethereum) {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    return accounts.length > 0;
  }

  return false;
}