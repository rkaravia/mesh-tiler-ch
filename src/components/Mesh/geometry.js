import Martini from "@mapbox/martini";
import { loadSwissAlti3D } from "./tiles.js";
import {
  terrainSize,
  meshMaxError,
  terrainTileSize,
  terrainZoom,
  terrainUrl,
} from "../common/config.js";

import { BufferAttribute, BufferGeometry } from "three";

const gridSize = terrainSize + 1;

export default async function getGeometry({ lon, lat }) {
  const terrain = await loadSwissAlti3D({
    lon,
    lat,
    zoom: terrainZoom,
    tileSize: terrainTileSize,
    size: terrainSize,
    url: terrainUrl,
  });
  backfillTerrain(terrain);
  return geometryData(terrain);
}

// Adapted from https://github.com/mapbox/martini/blob/1ca5ca075a169231feb3357c513de774425ff1de/test/util.js
// ISC License, Copyright (c) 2019, Mapbox
function backfillTerrain(terrain) {
  // backfill right and bottom borders
  for (let x = 0; x < gridSize - 1; x++) {
    terrain[gridSize * (gridSize - 1) + x] =
      terrain[gridSize * (gridSize - 2) + x];
  }
  for (let y = 0; y < gridSize; y++) {
    terrain[gridSize * y + gridSize - 1] = terrain[gridSize * y + gridSize - 2];
  }
}

// Adapted from https://observablehq.com/@mourner/martin-real-time-rtin-terrain-mesh
function geometryData(terrain) {
  const martini = new Martini(gridSize);
  const tile = martini.createTile(terrain);
  const { vertices, triangles } = tile.getMesh(meshMaxError);
  const noVertices = vertices.length / 2;

  let minTerrain = Infinity;
  for (let i = 0; i < terrain.length; i++) {
    minTerrain = Math.min(terrain[i], minTerrain);
  }

  const metersPerPixel = 2; // TODO move to config?

  const positions = new Float32Array(noVertices * 3);
  const uvs = new Float32Array(noVertices * 2);

  for (let i = 0; i < noVertices; i++) {
    const x = vertices[2 * i];
    const y = vertices[2 * i + 1];

    positions[3 * i + 0] = x / terrainSize - 0.5;
    positions[3 * i + 1] = 0.5 - y / terrainSize;
    positions[3 * i + 2] =
      (terrain[y * gridSize + x] - minTerrain) / metersPerPixel / terrainSize;

    uvs[2 * i + 0] = x / terrainSize;
    uvs[2 * i + 1] = 1 - y / terrainSize;
  }

  const geometry = new BufferGeometry();

  geometry.setAttribute("position", new BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new BufferAttribute(uvs, 2));
  geometry.setIndex(new BufferAttribute(triangles, 1));
  geometry.computeVertexNormals();

  const normals = geometry.getAttribute("normal").array;

  return { geometry, positions, uvs, triangles, normals };
}
