// import { createWalletClient, createPublicClient, custom, http } from "viem";
// import { base } from "viem/chains";

// export const publicClient = createPublicClient({
//   chain: base,
//   transport: http(),
// });
// // función para obtener el walletClient con cuenta conectada
// export async function getWalletClient() {
//   if (!window.ethereum) {
//     throw new Error("No se detectó una wallet como MetaMask");
//   }

// if (typeof window.ethereum === "undefined") {
//   feedback.textContent = "Wallet no detectada";
//   return false;
// }

// const [address] = await window.ethereum.request({
//   method: "eth_requestAccounts",
// });

//   return createWalletClient({
//     chain: base,
//     transport: custom(window.ethereum),
//     account: accounts[0] as `0x${string}`,
//   });
// }

/////////////////////////////////
// import { createWalletClient, createPublicClient, custom, http } from "viem";
// import { base } from "viem/chains";

// export const publicClient = createPublicClient({
//   chain: base,
//   transport: http(),
// });

// // función para obtener el walletClient con cuenta conectada
// export async function getWalletClient() {
//   if (!window.ethereum) {
//     throw new Error("No se detectó una wallet como MetaMask");
//   }

//   const accounts = await window.ethereum.request({
//     method: "eth_requestAccounts",
//   });

//   return createWalletClient({
//     chain: base,
//     transport: custom(window.ethereum),
//     account: accounts[0] as `0x${string}`,
//   });
// }

// export const walletClient = createWalletClient({
//   chain: base,
//   transport: custom((window as any).ethereum),
// });

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