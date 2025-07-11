# ![Kyblucam-icon 48x](https://github.com/user-attachments/assets/80d239f4-0006-461c-98cc-aed28f16cc69)  Kyblu Camera 

#### Kyblu camera is a pixel camera that is used from Farcaster, you can make pixel art photos to mint them directly in Zora from the app. Built with vanilla JavaScript, TypeScript, HTML, and CSS, powered by Vite

#### 🔸[Try Kyblu Camera on Farcaster](https://farcaster.xyz/miniapps/WfvN8I9gM7lo/kyblu-cam)
---

### Inspiration

Kyblu Camera is inspired by the [Game Boy Camera](https://www.youtube.com/watch?v=8Hnggc_FbSA) and Instagram filters. During the last time Zora has positioned itself as the favorite onchain social and it makes a lot of sense to think about facilitating creative filters to expand the ways of content creation on the dapp, on the other hand Farcaster has also had a great growth and the possibility of using Mini Apps with the integrated wallet facilitates a lot the decentralized use of content creation, making it very easy to create a mint on Zora from your smartphone through an application that allows you to give a unique and artistic touch to your moment.
<p align="center">
<img  width="512" height="910" alt="Sprite-0011" src="https://github.com/user-attachments/assets/0a382365-9087-42ee-8c32-c81dea627525" />
</p>

---

### Getting Started
1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```
2. Start the development server:
```bash
npm run dev
```


---
### Where the sponsor's tech?

In [src/mint.ts](https://github.com/martinsegura/Kyblu-camera/blob/main/src/mint.ts) is the whole implementation of the **Zora SDK**
I only needed to use *CreateCoin()* since the app only facilitates minting.

In [src/config.ts](https://github.com/martinsegura/Kyblu-camera/blob/main/src/config.ts) the whole implementation of the connection with the wallet to work with **Farcaster**.

[src/index.js](https://github.com/martinsegura/Kyblu-camera/blob/main/src/index.js) contains the camera functions and the call to **create the coins** and *sdk.actions.ready()* from **Farcaster**.

---

### Features

- Take square (1:1) or portrait (9:16) photos
- Flip camera
- Select differents palettes
- Discard photo
- Mint direcly in Zora

Watch the project introduction [here](https://youtu.be/WQ0VKMZlDOg)

---
### Next features

- Create a cast when you mint a new Kyblu Shot
- Exclusive pallettes when you hold differents tokens
- Kyblu channel in Farcaster


---
### Kyblu's Shots

#### 🔸[Try Kyblu Camera on Farcaster](https://farcaster.xyz/miniapps/WfvN8I9gM7lo/kyblu-cam)

![fotos](https://github.com/user-attachments/assets/d86ad746-71cf-456f-bc16-8260f354f068)





