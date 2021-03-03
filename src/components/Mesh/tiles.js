import StaticMap from "@rkaravia/static-map";
import { project } from "swissgrid";

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

export function loadToCanvas(options) {
  const { lon, lat, zoom, tileSize, size, url } = options;
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
