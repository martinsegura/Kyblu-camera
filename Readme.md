# ![Kyblucam-icon 48x](https://github.com/user-attachments/assets/80d239f4-0006-461c-98cc-aed28f16cc69)  Kyblu Camera 




#### Kyblu camera is a pixel camera that is used from Farcaster, you can make pixel art photos to mint them directly in Zora from the app.

---

### Where the sponsor's tech?

In [src/mint.ts](https://github.com/martinsegura/Kyblu-camera/blob/main/src/mint.ts) is the whole implementation of the **Zora SDK**
I only needed to use *CreateCoin()* since the app only facilitates minting.

In [src/config.ts](https://github.com/martinsegura/Kyblu-camera/blob/main/src/config.ts) the whole implementation of the connection with the wallet to work with **Farcaster**.

[src/index.js](https://github.com/martinsegura/Kyblu-camera/blob/main/src/index.js) contains the camera functions and the call to **create the coins** and *sdk.actions.ready()* from **Farcaster**.

---
### Next features

- Create a cast when you mint a new Kyblu Shot
- Exclusive pallettes when you hold differents tokens

---
### Kyblu's Shots

#### 🔸[Try Kyblu Camera on Farcaster](https://farcaster.xyz/miniapps/WfvN8I9gM7lo/kyblu-cam)

![fotos](https://github.com/user-attachments/assets/d86ad746-71cf-456f-bc16-8260f354f068)





