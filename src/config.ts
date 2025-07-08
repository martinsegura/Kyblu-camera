import { createWalletClient, createPublicClient, custom, http } from "viem";
import { base } from "viem/chains";

const feedback = document.getElementById("feedback")!;

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});
export async function getWalletClient() {
  try {
    if (!window.ethereum) {
      throw new Error("No se detectó una wallet como MetaMask");
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
      throw new Error("El usuario no concedió acceso a la wallet");
    }

    return createWalletClient({
      chain: base,
      transport: custom(window.ethereum),
      account: accounts[0] as `0x${string}`,
    });
  } catch (error) {
    feedback.textContent = error instanceof Error ? error.message : "Error desconocido al conectar wallet";
    console.error("Error en getWalletClient:", error);
    throw error; 
  }
}
export function isWalletAvailable() {
  return !!window.ethereum;
}
export async function isWalletConnected() {
  if (!window.ethereum) return false;
  const accounts = await window.ethereum.request({ method: 'eth_accounts' });
  return accounts.length > 0;
}
interface FarcasterSession {
  isConnected: boolean;
  address?: string;
  fid?: number;
}
let farcasterSession: FarcasterSession = { isConnected: false };
export async function initializeFarcaster() {
  try {
    // @ts-ignore - Temporal hasta que instalemos el SDK
    const { isConnected, address, fid } = await window.farcaster?.connect() || {};
    
    if (isConnected) {
      farcasterSession = { isConnected: true, address, fid };
      feedback.textContent = "Modo Farcaster activado";
      return true;
    }
    return false;
  } catch (error) {
    console.log("Farcaster no disponible:", error);
    return false;
  }
}
export async function connectWallet() {
  if (await initializeFarcaster()) {
    return {
      type: 'farcaster',
      address: farcasterSession.address!
    };
  }

  try {
    const walletClient = await getWalletClient();
    feedback.textContent = "Wallet conectada correctamente";
    return {
      type: 'ethereum',
      client: walletClient
    };
  } catch (error) {
    feedback.textContent = "No se pudo conectar la wallet";
    console.error("Error en connectWallet:", error);
    return null; 
  }
}

export function isFarcasterConnected() {
  return farcasterSession.isConnected;
}
