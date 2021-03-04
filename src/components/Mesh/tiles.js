import StaticMap from "@rkaravia/static-map";
import { project } from "swissgrid";
import { terrainSize } from "../common/config";

// Available resolutions
// Source: https://api3.geo.admin.ch/services/sdiservices.html#wmts
const RESOLUTIONS = [
  4000,
  3750,
  3500,
  3250,
  3000,
  2750,
  2500,
  2250,
  2000,
  1750,
  1500,
  1250,
  1000,
  750,
  650,
  500,
  250,
  100,
  50,
  20,
  10,
  5,
  2.5,
  2,
  1.5,
  1,
  0.5,
  0.25,
  0.1,
];

function lonLatToPixel({ lon, lat, zoom }) {
  const left = 2420000;
  const top = 1350000;
  const [E, N] = project([lon, lat]);
  return [E - left, top - N].map((coord) => {
    return Math.round(coord / RESOLUTIONS[zoom]);
  });
}

function lonLatToPixel2({ lon, lat, zoom }) {
  return project([lon, lat]).map((coord) => {
    return Math.round(coord / RESOLUTIONS[zoom]);
  });
}

export function loadToCanvas({ lon, lat, zoom, tileSize, size, url }) {
  // const { lon, lat, zoom, tileSize, size, url } = options;
  const staticMap = new StaticMap([url], { size: tileSize, lonLatToPixel });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return new Promise((resolve) => {
    staticMap.getMap(canvas, lon, lat, zoom, () => {
      resolve(canvas);
    });
  });
}

export async function loadImageData(options) {
  const canvas = await loadToCanvas(options);
  const { size } = options;
  const context = canvas.getContext("2d");
  const { data } = context.getImageData(0, 0, size, size);
  return data;
}

export function loadSwissAlti3D({ lon, lat, size }) {
  const zoom = 23;
  const tileSize = 500;
  const url =
    "https://data.geo.admin.ch/ch.swisstopo.swissalti3d/swissalti3d_2019_{x}-{y}/swissalti3d_2019_{x}-{y}_2_2056_5728.tif";
  const staticMap = new StaticMap([url], {
    size: tileSize,
    lonLatToPixel: lonLatToPixel2,
    tileLoader: async (url, callback) => {
      const blob = await fetch(url).then((response) => response.blob());
      const pyramid = await GeoTIFF.fromBlob(blob);
      const image = await pyramid.getImage(0);
      const data = await image.readRasters();
      console.log(data);
      callback(data);
    },
  });

  const gridSize = terrainSize + 1;
  const terrain = new Float32Array(gridSize * gridSize);

  const canvas = {
    width: size,
    height: size,
    getContext() {
      return {
        drawImage(image, x, y, width, height) {
          const data = image[0];
          const xFrom = Math.max(0, x);
          const xTo = Math.min(x + width, terrainSize);
          const yFrom = Math.max(0, y);
          const yTo = Math.min(y + height, terrainSize);
          console.log({ xFrom, xTo, yFrom, yTo });
          for (let j = yFrom; j < yTo; j += 1) {
            // console.log(j);
            for (let i = xFrom; i < xTo; i += 1) {
              const yData = j - y;
              const value = data[(tileSize - 1 - yData) * tileSize + i - x];
              terrain[(terrainSize - 1 - j) * gridSize + i] =
                value < 0 ? 4000 : value;
            }
          }
          console.log({ image, x, y, width, height });
        },
      };
    },
  };
  return new Promise((resolve) => {
    staticMap.getMap(canvas, lon, lat, zoom, () => {
      resolve(terrain);
    });
  });
}

export function loadToCanvasOld(options) {
  const { lon, lat, zoom, tileSize, size, url } = options;
  const staticMap = new StaticMap([url], { size: tileSize });
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return new Promise((resolve) => {
    staticMap.getMap(canvas, lon, lat, zoom, () => {
      resolve(canvas);
    });
  });
}

export async function loadImageDataOld(options) {
  const canvas = await loadToCanvasOld(options);
  const { size } = options;
  const context = canvas.getContext("2d");
  const { data } = context.getImageData(0, 0, size, size);
  return data;
}
