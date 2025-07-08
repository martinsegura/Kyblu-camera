import { createWalletClient, createPublicClient, custom, http } from "viem";
import { base } from "viem/chains";
import { sdk } from "@farcaster/miniapp-sdk";

const feedback = document.getElementById("feedback")!;

export const publicClient = createPublicClient({
  chain: base,
  transport: http(),
});

export async function getWalletClient() {
   let provider;
  try {
    provider = await sdk.wallet.getEthereumProvider();
  } catch {
    throw new Error("No se detectó wallet de Farcaster. ¿Estás dentro de una Mini App?");
  }

  const accounts = await provider.request({ method: "eth_requestAccounts" });
  if (!accounts || accounts.length === 0) {
    throw new Error("No hay cuentas disponibles de Farcaster");
  }

  return createWalletClient({
    chain: base,
    transport: custom(provider),
    account: accounts[0] as `0x${string}`,
  });
  // try {
  //   if (!window.ethereum) {
  //     throw new Error("No se detectó una wallet como MetaMask");
  //   }

  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });

  //   if (!accounts || accounts.length === 0) {
    //     throw new Error("El usuario no concedió acceso a la wallet");
    //   }
    
    //   return createWalletClient({    
      //     chain: base,
      //     transport: custom(window.ethereum),
      //     account: accounts[0] as `0x${string}`,
      //   });
      // } catch (error) {
        //   feedback.textContent = error instanceof Error ? error.message : "Error desconocido al conectar wallet";
        //   console.error("Error en getWalletClient:", error);
        //   throw error; 
        // }
  } 

export async function connectWallet() {
  try {
    const walletClient = await getWalletClient();
    feedback.textContent = "Wallet conectada correctamente";
    return walletClient;
  } catch (error) {
    feedback.textContent = "No se pudo conectar la wallet";
    console.error("Error en connectWallet:", error);
    return null; 
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