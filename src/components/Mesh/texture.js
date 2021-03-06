import { loadToCanvas } from "./tiles.js";
import {
  textureUrl,
  textureSize,
  textureTileSize,
  textureZoom,
} from "../common/config.js";

import { CanvasTexture } from "three";

export default async function getTexture(position) {
  const { lon, lat } = position;
  const canvas = await loadToCanvas({
    lon,
    lat,
    zoom: textureZoom,
    tileSize: textureTileSize,
    size: textureSize,
    url: textureUrl,
  });
  return new CanvasTexture(canvas);
}
