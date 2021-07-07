import getGeometry from "./geometry.js";
import getTexture from "./texture.js";

export default async function getMesh(position) {
  const [
    { geometry, positions, uvs, triangles, normals },
    textureCanvas,
  ] = await Promise.all([getGeometry(position), getTexture(position)]);
  return { geometry, positions, uvs, triangles, normals, textureCanvas };
}
