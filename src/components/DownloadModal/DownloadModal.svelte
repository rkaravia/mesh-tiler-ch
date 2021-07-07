<script>
  import CloseIcon from "../icons/Close.svelte";
  import DownloadIcon from "../icons/Download.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let action;

  function close() {
    dispatch("close");
  }
</script>

<style>
  @media screen and (min-width: 801px) {
    .download-modal {
      width: 600px;
      border: 1px solid #333;
    }
  }

  .download-modal__content {
    position: relative;
    padding: 16px;
    background: #fff;
  }

  h2 {
    margin-top: 0;
  }

  .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
    display: block;
    width: 34px;
    height: 34px;
    border: 1px solid #aaa;
    border-radius: 100%;
    background-color: #fff;
    text-align: center;
  }

  .close-button:hover {
    background-color: #ddd;
    text-decoration: none;
  }

  .download-button {
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid #aaa;
    padding-right: 12px;
    cursor: pointer;
  }

  .download-button:hover {
    background-color: #ddd;
  }

  .icon {
    width: 32px;
    height: 32px;
  }
</style>

<div class="download-modal">
  <div class="download-modal__content">
    <a href class="close-button" on:click|preventDefault={close}>
      <CloseIcon />
    </a>
    <h2>Download</h2>
    <h3>Format</h3>
    <p>
      You can download the mesh in the GLB format, which is the binary version
      of
      <a href="https://en.wikipedia.org/wiki/GlTF" target="_blank">GLTF</a>.
    </p>
    <p>The GLB file contains the geometry and the texture of the mesh.</p>

    <h3>Attribution</h3>
    <p>
      Please note that the attribution "©&nbsp;Swisstopo" has to be used in any
      derivative work, see
      <a
        href="https://www.swisstopo.admin.ch/en/home/meta/conditions/geodata/ogd.html"
        target="_blank"
      >
        Swisstopo OGD terms of use for more details.
      </a>
    </p>

    <button class="download-button" on:click={action}>
      <div class="icon">
        <DownloadIcon />
      </div>
      Download Mesh
    </button>
  </div>
</div>
