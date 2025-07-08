import {mintCoin} from "./mint";
import { connectWallet, isWalletConnected } from './config';
import { sdk } from '@farcaster/miniapp-sdk';

document.addEventListener('DOMContentLoaded', async () => {
  try {
    await sdk.actions.ready(); 

  } catch (error) {
    console.error("Error al inicializar SDK:", error);
  }
});

const canvas = document.getElementById('canvas-id');
const ctx = canvas.getContext('2d');
const video = document.querySelector('video');
var constraints = {video: { facingMode: "user" }, audio: false};
let width = 180;
let height = 320;
const upscale = 3;
canvas.width = width;
canvas.height = height;
let palette = [ 
  [0, 0, 0],
  [55, 55, 55],
  [172, 172, 172],
  [255, 255, 255]
];

let r = 2;
let g = 2;
let b = 2;


window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                               window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  const switchButton = document.getElementById("switch-button");

  
  const aspectButton = document.getElementById("aspect-button");
  const saveButton = document.getElementById("save-button");
  const discardButton = document.getElementById("discard-button");
  const pauseButton = document.getElementById("pause-button");
  const feedback = document.getElementById("feedback");
  const spinner = document.getElementById("spinner");
document.addEventListener('DOMContentLoaded', () => {

    
  pauseButton.addEventListener('click', pauseVideo);

  // saveButton.addEventListener('click', prepareCoin);
  discardButton.addEventListener('click', playVideo);


});


const getMedia = () => {
  const constraints = {
    video: {
      facingMode: { ideal: "user" }
    },
    audio: false
  };

  navigator.mediaDevices.getUserMedia(constraints)
    .then((mediaStream) => {
      video.srcObject = mediaStream;
      video.setAttribute("playsinline", "true");
      video.onloadedmetadata = () => {
        video.play().catch(err => console.error("Error al hacer play:", err));
      };
    })
    .catch((err) => {
      console.error("Error al acceder a la cámara:", err.name, err.message);
    });
};

getMedia();

video.addEventListener('play', () => {
  const step = () => {
    return setInterval(() => {
      let [drawingHeight, drawingWidth] = scaleImage(video);
      let xOffset = canvas.width / 2 - drawingWidth / 2;
      let yOffset = canvas.height / 2 - drawingHeight / 2;
      ctx.drawImage(video, xOffset, yOffset, drawingWidth, drawingHeight);
      colourOrderedDithering( palette , ctx, width, height);
    }, 0);
  }
  requestAnimationFrame(step);
});

const scaleImage = (image) => {
  let newHeight, newWidth
  if (image.videoWidth > image.videoHeight) {
    newHeight = height;
    newWidth = (image.videoWidth * height) / image.videoHeight;
  } else {
    newWidth = width;
    newHeight = (image.videoHeight * width) / image.videoWidth;
  }
  return [newHeight, newWidth];
}


const colourOrderedDithering = (colourPalette) => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  

  var thresholdPaletteEightByEight = [ 
    [ 0, 32,  8, 40,  2, 34, 10, 42],   
    [48, 16, 56, 24, 50, 18, 58, 26],  
    [12, 44,  4, 36, 14, 46,  6, 38],   
    [60, 28, 52, 20, 62, 30, 54, 22],   
    [ 3, 35, 11, 43,  1, 33,  9, 41],   
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47,  7, 39, 13, 45,  5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21] ];

  const distanceColours = (colour, colourToMatch) => {
    return Math.sqrt(Math.pow((colour[0] - colourToMatch[0]), r) + Math.pow((colour[1] - colourToMatch[1]), g) + Math.pow((colour[2] - colourToMatch[2]), b));
  }

  for( let i = 0; i < data.length; i += 4) {
 
    let x = ((i / 4) % canvas.width) % thresholdPaletteEightByEight.length;
    let y = (Math.floor((i / 4) / canvas.width)) % thresholdPaletteEightByEight.length;

    let preCalculatedThreshold = (thresholdPaletteEightByEight[y][x] * 1/64) - 0.8
    let redPixel   = data[i]     + (255/colourPalette.length) * preCalculatedThreshold;
    let bluePixel  = data[i + 1] + (255/colourPalette.length) * preCalculatedThreshold;
    let greenPixel = data[i + 2] + (255/colourPalette.length) * preCalculatedThreshold;
    let fullPixel  = [redPixel, bluePixel, greenPixel];

    let shortestMatch = Number.MAX_VALUE;
    let paletteIndex = 0;

    for( let j = 0; j < colourPalette.length; j++) {
      let closestMatch = distanceColours(fullPixel, colourPalette[j]);
      if (closestMatch < shortestMatch) {
        shortestMatch = closestMatch;
        paletteIndex = j;
      }
    }

    data[i]     = colourPalette[paletteIndex][0];
    data[i + 1] = colourPalette[paletteIndex][1];
    data[i + 2] = colourPalette[paletteIndex][2];

  }
  ctx.putImageData(imageData, 0, 0);
}

const decomposeImage = (image, width) => {
  const newImageArray = new Array;
  const groupPixelsArray = new Array;
  const imageValues = image.length;
  for( let i = 0; i < imageValues; i += 4) {
    const pixel = Array.from(image.slice(i, i + 4));
    groupPixelsArray.push(pixel);
  }
  for( let i = 0; i < groupPixelsArray.length; i += width) {
    newImageArray.push(groupPixelsArray.slice(i, ((i + 1) * width)));
  }
  return newImageArray;
}

const nearestNeighbourInterpolation = (image) => {
  const matrix = decomposeImage(image.data, image.width);
  let newSizeHeightMatrix = matrix.length * upscale;
  let newSizeWidthMatrix = matrix[0].length * upscale;
  let ratioHeightMatrix = matrix.length/newSizeHeightMatrix;
  let ratioWidthMatrix = matrix[0].length/newSizeWidthMatrix;
  let rowPositions = new Array;
  let columnPositions = new Array;
  for(  let i = 1; i < newSizeWidthMatrix + 1; i++) {
    columnPositions.push(i);
  }
  for(  let i = 1; i < newSizeHeightMatrix + 1; i++) {
    rowPositions.push(i);
  }
  rowPositions    = rowPositions.map(e => Math.ceil(e * ratioHeightMatrix));
  columnPositions = columnPositions.map(e => Math.ceil(e * ratioWidthMatrix));
  const rows = new Array;
  for(  let j = 0; j < matrix.length; j++) {
    const newArray = new Array;
    for( let k = 0; k < columnPositions.length; k += upscale) {
      if (((k/upscale) + 1) === columnPositions[k]) {
        for( let l = 0; l < upscale; l++) {
          newArray.push(matrix[j][(k/upscale)]);
        }
      }
    }
    rows.push(newArray);
  }
  const finalArray = new Array;
  for( let m = 0; m < rows.length; m++) {
    for( let l = 0; l < upscale; l++) {
      finalArray.push(rows[m]);
    }
  }
  return finalArray.flat().flat();

}

const pauseVideo = () => {
  
  video.pause();
  toggleButton("pause");
}

const playVideo = () => {
  video.play();
  toggleButton("play");
}

saveButton.addEventListener('click', async () => {
  if (await isWalletConnected()) {
    prepareCoin();
  } else {
    const walletClient = await connectWallet();
    if (walletClient) {
      await prepareCoin(); // Ejecuta mint después de conectar
    } else {
      overlay.classList.remove("hidden");
      feedback.innerHTML = "Wallet not sync";
      feedback.classList.remove("hide-element");
      setTimeout(() => {
        resetUIFail()
      }, 2000);
    }
  }
});

async function prepareCoin(){

  const buttons = document.querySelectorAll(".palette-button");
  const overlay = document.getElementById("overlay");


  saveButton.disabled = true;
  discardButton.disabled = true;
  buttons.forEach(b => b.disabled = true);
  
  overlay.classList.remove("hidden");
  feedback.innerHTML = "Preparing mint";
  feedback.classList.remove("hide-element");

  
  const title = 'Kyblu Shot #'+Math.floor(Math.random() * (55555 - 0 + 1)) + 0;
  let file = await savePhoto();
  mintCoin(title, file).then(result => {
    if (result === true) {
      setTimeout(() => {
        resetUI();
      }, 2000);

    } else {
      setTimeout(() => {
        resetUIFail()
      }, 2000);
    }
});
}

async function savePhoto() {
  console.log("Inicio el guardado");

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixelPerfectPicture = nearestNeighbourInterpolation(imageData);
  const clampedArray = new Uint8ClampedArray(pixelPerfectPicture);

  ctx.canvas.width = width * upscale;
  ctx.canvas.height = height * upscale;
  ctx.putImageData(
    new ImageData(clampedArray, width * upscale, height * upscale),
    0,
    0
  );

  const blob = await canvasToBlob(canvas, "image/png");

  if (!blob) {
    throw new Error("No se pudo generar el Blob desde el canvas");
  }

  const file = new File([blob], "canvas.png", { type: "image/png" });

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  return file;
}

function canvasToBlob(canvas, type = 'image/png', quality = 1) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(b => {
      if (b) resolve(b)
      else reject(new Error('Hubo un error al crear el Blob'))
    }, type, quality);
  });
}

const hideButton = (buttonName) => {
  return buttonName.classList.add("hide-element");
}

const showButton = (buttonName) => {
  return buttonName.classList.remove("hide-element");
}

const toggleButton = (current) => {
  const pauseButton = document.getElementById("pause-button");
  const saveButton = document.getElementById("save-button");
  const discardButton = document.getElementById("discard-button");
  const switchButton = document.getElementById("switch-button");
  if (current === "pause") {
      hideButton(pauseButton);
      hideButton(switchButton);
      showButton(saveButton);
      showButton(discardButton);
  } else {
      hideButton(saveButton);
      hideButton(discardButton);
      showButton(pauseButton);
      showButton(switchButton);
  }
}

const palettes = {
  "Black & White": {
    colors: [
      [0, 0, 0],
      [55, 55, 55],
      [172, 172, 172],
      [255, 255, 255],
    ],
    r: 2,
    g: 2,
    b: 2
  },
  "Pinkyblu": {
    colors: [ [0,0,0],
    [255, 177, 191],
    [191, 159, 255],
    [33, 89, 255],
    [255, 255, 255]
    ],
    r: 2,
    g: 3,
    b: 2,
  },
  "Gameboy Classic": {
    colors: [
    [15, 56, 15],
    [48, 98, 48],
    [139, 172, 15],
    [155, 188, 15]
    ],
    r: 2,
    g: 2,
    b: 2,
  },
  "Blueanemone": {
    colors: [
    [0,0,255],
    [23,0,138],
    [17,0,61],
    [0,0,0],
    [255,255,255],
    [184,184,135],
    [105,99,65],
    ],
    r:2, 
    g:1, 
    b:2,
  },
  "1bit":{
    colors:[
      [0, 0, 0],
      [255, 255, 255],
    ],
    r:0,
    g:2,
    b:2,
  },
};

function renderPalettesWithIDs(paletteMap, onSelect) {
  const container = document.getElementById("palette-selector");
  container.innerHTML = "";

  Object.entries(paletteMap).forEach(([paletteId, paletteData]) => {
    const { colors, r, g, b } = paletteData; // ⬅️ extraemos los nuevos datos

    const button = document.createElement("button");
    button.classList.add("palette-button");
    button.id = paletteId;

    const preview = document.createElement("div");
    preview.classList.add("palette-preview");

    const cols = Math.ceil(Math.sqrt(colors.length));
    const rows = Math.ceil(colors.length / cols);
    preview.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    preview.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    colors.forEach(([r, g, b]) => {
      const cell = document.createElement("div");
      cell.style.background = `rgb(${r}, ${g}, ${b})`;
      cell.style.width = "100%";
      cell.style.height = "100%";
      preview.appendChild(cell);
    });

    button.appendChild(preview);

    button.addEventListener("click", () => {
      // También podrías pasar los extras como argumento si querés usarlos
      onSelect(colors, paletteId, { r, g, b });
    });

    container.appendChild(button);
  });
}

renderPalettesWithIDs(palettes, (selectedPalette, id) => {
  palette = selectedPalette; 
  r = palettes[id].r;
  g = palettes[id].g;
  b = palettes[id].b;
});



function resetUI() {
  playVideo();
  aspectButton.classList.remove("hide-element");
  pauseButton.classList.remove("hide-element");
  switchButton.classList.remove("hide-element");

  saveButton.classList.add("hide-element");
  discardButton.classList.add("hide-element");
  
  const buttons = document.querySelectorAll(".palette-button");
  const overlay = document.getElementById("overlay");


  spinner.classList.add("hide-element");
  feedback.classList.add("hide-element");
  overlay.classList.add("hidden");
  buttons.forEach(b => b.disabled = false);
}

function resetUIFail(){
  saveButton.disabled = false;
  discardButton.disabled = false;

  const buttons = document.querySelectorAll(".palette-button");
  const overlay = document.getElementById("overlay");


  spinner.classList.add("hide-element");
  feedback.classList.add("hide-element");
  overlay.classList.add("hidden");
  buttons.forEach(b => b.disabled = false);
}

pauseButton.addEventListener("click", () => {
  aspectButton.classList.add("hide-element");

  discardButton.classList.remove("hide-element");
});

discardButton.addEventListener("click", () => {
  resetUI();
});

saveButton.addEventListener("click", () => {
  spinner.classList.remove("hide-element");
  feedback.classList.remove("hide-element");
});



let mode = "portrait"; 

function updateCanvasMode() {
  if (mode === "square") {
    width = 320;
    height = 320;
    canvas.width = 320;
    canvas.height = 320;

    aspectButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2-icon lucide-maximize-2"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>';
    canvas.classList.add("display");
    canvas.classList.remove("position");
    canvas.style.width = "100vw";
    canvas.style.height = "100vw";
  } else if (mode === "portrait") {
    width = 180;
    height = 320
    canvas.width = 180;
    canvas.height = 320;

    aspectButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize-icon lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>';

    canvas.classList.remove("display");
    canvas.classList.add("position");
    canvas.style.height = "100vh";
    canvas.style.width = `${(9 / 16) * 100}vh`;
  }
}


document.getElementById("aspect-button").addEventListener("click", () => {
  mode = mode === "square" ? "portrait" : "square";
  updateCanvasMode();
});


updateCanvasMode();

let currentFacingMode = "user";
let currentStream = null;

async function startCamera(facingMode) {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: facingMode }
    });
    video.srcObject = stream;
    currentStream = stream;
  } catch (err) {
    console.error("Error al acceder a la cámara:", err);
  }
}

switchButton.addEventListener("click", () => {
  currentFacingMode = currentFacingMode === "user" ? "environment" : "user";
  startCamera(currentFacingMode);
});

startCamera(currentFacingMode);
