// import { createCoin} from "@zoralabs/coins-sdk";
// import { publicClient, walletClient } from "./config";

// export const mintCoin = async (uri, ipfsPhoto, title) => {
//   const [address] = await walletClient.requestAddresses();

//   // 👇 Esto es clave para evitar el error
//   walletClient.account = address as `0x${string}`;

//   const coinParams = {
//     name: title,
//     symbol: title.slice(0,4).toUpperCase(),
//     uri: `https://gateway.lighthouse.storage/ipfs/${uri}`,
//     payoutRecipient: address as `0x${string}`,
//     platformReferrer: "0x5c67C59c850afB2fB2aaCe4C3E03A222b992266C" as `0x${string}`,
//     chainId: walletClient.chain.id,
//     image: `https://gateway.lighthouse.storage/ipfs/${ipfsPhoto}`,
//     animation_url:
//       `https://gateway.lighthouse.storage/ipfs/${ipfsPhoto}`,
//     content: {
//       uri: `https://gateway.lighthouse.storage/ipfs/${ipfsPhoto}`,
//       mime: "image/png",
//     },

//   };

import { createMetadataBuilder,  createZoraUploaderForCreator, DeployCurrency, } from "@zoralabs/coins-sdk";
import { setApiKey } from "@zoralabs/coins-sdk";
import { createCoin } from "@zoralabs/coins-sdk";
import { publicClient, walletClient } from "./config";
setApiKey("zora_api_17391ddb71ba589feb1361f82de0ab0109c38588357d25ae8c9eae44b4a1d2ca");

export async function mintCoin(title: string, file: File) {
  const [address] = await walletClient.requestAddresses();
  walletClient.account = address as `0x${string}`;

  const { createMetadataParameters } = await createMetadataBuilder()
    .withName(title)
    .withSymbol(title.slice(0,4).toUpperCase())
    .withDescription("")
    .withImage(file)
    .upload(createZoraUploaderForCreator(address as Address));

  const coinParams = {
    ...createMetadataParameters,
    payoutRecipient: address as `0x${string}`,
    platformReferrer: "0x5c67C59c850afB2fB2aaCe4C3E03A222b992266C" as `0x${string}`,
    chainId: walletClient.chain.id,
    currency: DeployCurrency.ETH,
  };

  try {
    const result = await createCoin(coinParams, walletClient, publicClient);
    console.log("✅ Transaction hash:", result.hash);
    console.log("🪙 Coin address:", result.address);
    console.log("📦 Deployment details:", result.deployment);
    alert("Coin creada:\n" + result.address);
  } catch (error) {
    console.error("❌ Error creando coin:", error);
    alert("Error al crear la coin");
  }
  
};
