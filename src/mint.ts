import { createMetadataBuilder,  createZoraUploaderForCreator, DeployCurrency, } from "@zoralabs/coins-sdk";
import { setApiKey } from "@zoralabs/coins-sdk";
import { createCoin } from "@zoralabs/coins-sdk";
import { publicClient, getWalletClient} from "./config";
import { sdk } from '@farcaster/miniapp-sdk';

await sdk.actions.ready();
setApiKey("zora_api_17391ddb71ba589feb1361f82de0ab0109c38588357d25ae8c9eae44b4a1d2ca");

const feedback = document.getElementById("feedback")!;

export async function mintCoin(title: string, file: File): Promise<boolean> {
  feedback.textContent = "Preparing transaction";
 
    const address = (await getWalletClient()).account.address;

  

  const { createMetadataParameters } = await createMetadataBuilder()
    .withName(title)
    .withSymbol(title.slice(0,4).toUpperCase())
    .withDescription("")
    .withImage(file)
    .upload(createZoraUploaderForCreator(address as `0x${string}`));

  const coinParams = {
    ...createMetadataParameters,
    payoutRecipient: address as `0x${string}`,
    platformReferrer: "0x5c67C59c850afB2fB2aaCe4C3E03A222b992266C" as `0x${string}`,
    chainId: (await getWalletClient()).chain.id,
    currency: DeployCurrency.ETH,
  };


  try {
    
    feedback.textContent = "Waiting confirmation";
    const walletClient = await getWalletClient();
    const result = await createCoin(coinParams, walletClient, publicClient);
    if(result.hash){
      feedback.textContent = "Creating";
    }

    if(result.address){
      feedback.textContent = "Created";
    }
    return true;
  } catch (error) {
    console.log(error);
    feedback.textContent = "Error";
    return false;
  }
  
};

// // import { createMetadataBuilder,  createZoraUploaderForCreator, DeployCurrency, } from "@zoralabs/coins-sdk";
// // import { setApiKey } from "@zoralabs/coins-sdk";
// // import { createCoin } from "@zoralabs/coins-sdk";
// // import { publicClient, getWalletClient} from "./config";
// import {
//   createMetadataBuilder,
//   createZoraUploaderForCreator,
//   DeployCurrency,
//   createCoin,
//   setApiKey,
// } from "@zoralabs/coins-sdk";

// import { createWalletClient, custom } from "viem";
// import { parseAccount } from "viem/accounts";
// import { base } from "viem/chains";
// import { publicClient } from "./config";

// setApiKey("zora_api_17391ddb71ba589feb1361f82de0ab0109c38588357d25ae8c9eae44b4a1d2ca");

// const feedback = document.getElementById("feedback")!;

// // try{
// //   const address = (await getWalletClient()).account.address;
// // }catch(error){
// //   feedback.textContent = "Wallet not found";
// //   return false;
// // }
// export async function mintCoin(title: string, file: File): Promise<boolean> {
//   feedback.textContent = "Preparando transacción";

//   try {
//     // ✅ Paso 1: chequeamos que exista la wallet
//     if (typeof window.ethereum === "undefined") {
//       feedback.textContent = "No se detectó wallet Web3";
//       return false;
//     }

//     // ✅ Paso 2: solicitamos la cuenta
//     const [address] = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     });

//     const account = parseAccount(address); // 👈 Viem necesita esto

//     // ✅ Paso 3: creamos el walletClient con account explícito
//     const walletClient = createWalletClient({
//       chain: base,
//       transport: custom(window.ethereum),
//       account, // 👈 MUY IMPORTANTE
//     });

//     // ✅ Paso 4: subimos metadata
//     const { createMetadataParameters } = await createMetadataBuilder()
//       .withName(title)
//       .withSymbol(title.slice(0, 4).toUpperCase())
//       .withDescription("")
//       .withImage(file)
//       .upload(createZoraUploaderForCreator(address as `0x${string}`));

//     const coinParams = {
//       ...createMetadataParameters,
//       payoutRecipient: address as `0x${string}`,
//       platformReferrer: "0x5c67C59c850afB2fB2aaCe4C3E03A222b992266C" as `0x${string}`,
//       chainId: walletClient.chain.id,
//       currency: DeployCurrency.ETH,
//     };

//     feedback.textContent = "Esperando confirmación";

//     // ✅ Paso 5: pasamos también el `account` explícitamente a createCoin
//     const result = await createCoin(
//       coinParams,
//       {
//         ...walletClient,
//         account, // 👈 esto soluciona el AccountNotFoundError
//       },
//       publicClient
//     );

//     if (result.hash) feedback.textContent = "Creando";
//     if (result.address) feedback.textContent = "Creado";

//     return true;
//   } catch (error) {
//     console.error("Error al mintear:", error);
//     feedback.textContent = "Error";
//     return false;
//   }
// }