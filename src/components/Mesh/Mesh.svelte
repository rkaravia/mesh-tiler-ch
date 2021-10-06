<script>
  import CloseIcon from "../icons/Close.svelte";
  import DownloadIcon from "../icons/Download.svelte";
  import downloadMesh from "./download.js";
  import getMesh from "./mesh.js";
  import Renderer from "./renderer.js";
  import { swisstopoAttribution } from "../common/config.js";
  import getRandomPlace from "../common/places.js";
  import position from "../common/position.js";

  import { createEventDispatcher, onMount } from "svelte";
  const dispatch = createEventDispatcher();

  let container;
  let width = 640;
  let height = 480;

  let mesh = null;
  let isMeshLoading = false;

  $: renderer = new Renderer(container);

  $: renderer.updateSize(width, height);

  position.subscribe((newPosition) => {
    mesh = null;
    if (newPosition) {
      isMeshLoading = true;
      getMesh(newPosition).then((newMesh) => {
        renderer.updateMesh(newMesh);
        isMeshLoading = false;
        mesh = newMesh;
      });
    }
  });

  function clear() {
    position.set(undefined);
    return false;
  }

  function download() {
    dispatch("download", {
      doDownload: () => {
        downloadMesh(mesh);
      },
    });
  }

  function randomLocation() {
    position.set(getRandomPlace());
  }
</script>

<style>
  .mesh {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mesh__canvas {
    height: 100% !important;
  }

  .hidden {
    display: none;
  }

  .round-button {
    position: absolute;
    display: block;
    width: 34px;
    height: 34px;
    border: 1px solid #aaa;
    border-radius: 100%;
    background-color: #fff;
    text-align: center;
  }

  .round-button:hover {
    background-color: #ddd;
    text-decoration: none;
  }

  .clear-button {
    top: 8px;
    right: 8px;
  }

  .download-button {
    top: 48px;
    right: 8px;
  }

  .attribution {
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.7);
    padding: 0 5px;
    font-size: 11px;
    line-height: 1.5;
  }
</style>

<div class="mesh" bind:clientWidth={width} bind:clientHeight={height}>
  <canvas bind:this={container} class="mesh__canvas" class:hidden={!mesh} />
  {#if isMeshLoading}
    Loading...
  {:else if mesh}
    <a href class="round-button clear-button" on:click|preventDefault={clear}>
      <CloseIcon />
    </a>
    <a
      href
      class="round-button download-button"
      on:click|preventDefault={download}
    >
      <DownloadIcon />
    </a>
    <div class="attribution">
      Code: © Roman Karavia
      <a href="https://github.com/rkaravia/mesh-tiler-ch" target="_blank">
        Open Source
      </a>
      | Data:
      {@html swisstopoAttribution}
    </div>
  {:else}
    <span>
      Click on the map to choose a location or
      <a href on:click|preventDefault={randomLocation}>go to a random place</a>
    </span>
  {/if}
</div>
