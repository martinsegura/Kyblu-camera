import { createMetadataBuilder,  createZoraUploaderForCreator, DeployCurrency, } from "@zoralabs/coins-sdk";
import { setApiKey } from "@zoralabs/coins-sdk";
import { createCoin } from "@zoralabs/coins-sdk";
import { publicClient, walletClient } from "./config";
setApiKey("zora_api_17391ddb71ba589feb1361f82de0ab0109c38588357d25ae8c9eae44b4a1d2ca");

const feedback = document.getElementById("feedback");

export async function mintCoin(title: string, file: File): Promise<boolean> {
  feedback.textContent = "Preparing transaction";
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
    
    feedback.textContent = "Waiting confirmation";
    const result = await createCoin(coinParams, walletClient, publicClient);
    if(result.hash){
      feedback.textContent = "Creating";
    }

    if(result.address){
      feedback.textContent = "Created";
    }
    return true;
  } catch (error) {
    feedback.textContent = "Error";
    return false;
  }
  
};
