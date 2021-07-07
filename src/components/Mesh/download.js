import gltfJsUtils from "gltf-js-utils/dist/gltfutils.min.js";
import fileSaver from "file-saver";

const { GLTFAsset, Scene, Material, Texture, Mesh, Vertex, Node } = gltfJsUtils;

export default async function download({
  textureCanvas,
  positions,
  uvs,
  normals,
  triangles,
}) {
  const asset = new GLTFAsset();
  const scene = new Scene();
  asset.addScene(scene);

  const node = new Node();
  scene.addNode(node);

  const material = new Material();
  const image = new Image();
  await new Promise(async (resolve) => {
    image.onload = resolve;
    image.src = URL.createObjectURL(
      await new Promise((resolve) => textureCanvas.toBlob(resolve))
    );
  });
  const texture = new Texture(image);
  material.pbrMetallicRoughness.baseColorTexture = texture;

  node.mesh = new Mesh();
  node.mesh.material = [material];

  const vertices = [];

  for (let i = 0; i < positions.length / 3; i += 1) {
    const vertex = new Vertex();
    vertex.x = positions[3 * i + 0];
    vertex.y = positions[3 * i + 2];
    vertex.z = -positions[3 * i + 1];
    vertex.u = uvs[2 * i + 0];
    vertex.v = 1 - uvs[2 * i + 1];
    vertex.normalX = normals[3 * i + 0];
    vertex.normalY = normals[3 * i + 2];
    vertex.normalZ = -normals[3 * i + 1];
    vertices.push(vertex);
  }

  for (let i = 0; i < triangles.length / 3; i += 1) {
    node.mesh.addFace(
      vertices[triangles[3 * i + 0]],
      vertices[triangles[3 * i + 1]],
      vertices[triangles[3 * i + 2]],
      0,
      0
    );
  }

  const glbArrayBuffer = await gltfJsUtils.exportGLB(asset);

  fileSaver.saveAs(new Blob([glbArrayBuffer]), "mesh.glb");
}
