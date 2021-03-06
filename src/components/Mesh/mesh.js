import getGeometry from "./geometry.js";
import getTexture from "./texture.js";

export default async function getMesh(position) {
  const [geometry, texture] = await Promise.all([
    getGeometry(position),
    getTexture(position),
  ]);
  return { geometry, texture };
}
