<script>
  import DownloadModal from "./components/DownloadModal/DownloadModal.svelte";
  import Map from "./components/Map/Map.svelte";
  import Mesh from "./components/Mesh/Mesh.svelte";

  let downloadModalAction;

  function handleDownload(event) {
    downloadModalAction = event.detail.doDownload;
  }
</script>

<style>
  .container {
    position: relative;
    margin: 0 auto;
    max-width: 800px;
    height: 100%;
  }

  .row {
    position: relative;
    z-index: 0;
    height: 50%;
    padding: 4px;
  }

  .modal {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="container">
  <div class="row">
    <Map />
  </div>
  <div class="row">
    <Mesh on:download={handleDownload} />
  </div>
  {#if downloadModalAction}
    <div class="modal">
      <DownloadModal
        action={downloadModalAction}
        on:close={() => (downloadModalAction = null)}
      />
    </div>
  {/if}
</div>
