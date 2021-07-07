<script>
  import "./hash.js";
  import position from "../common/position.js";

  import L from "leaflet";
  import SwissLayer from "leaflet-tilelayer-swiss";
  import { onMount } from "svelte";

  let container;

  let centerMap = true;
  let marker;

  onMount(() => {
    const map = initMap();

    map.on("click", ({ latlng }) => {
      if (!marker) {
        centerMap = false;
        position.set(toLonLat(latlng));
      }
    });

    position.subscribe((newPosition) => {
      if (marker) {
        marker.remove();
      }
      if (newPosition) {
        const { lat, lon } = newPosition;

        marker = new L.Marker([lat, lon], {
          draggable: true,
        })
          .addTo(map)
          .on("dragend", ({ target }) => {
            centerMap = false;
            position.set(toLonLat(target.getLatLng()));
          });

        if (centerMap) {
          map.setView([lat, lon], 18);
        }
        centerMap = true;
      } else {
        marker = null;
      }
    });
  });

  function initMap() {
    const map = new L.Map(container, {
      attributionControl: false,
      crs: L.CRS.EPSG2056,
    });

    L.control
      .attribution({
        prefix: false,
      })
      .addTo(map);

    new SwissLayer().addTo(map);

    return map;
  }

  function toLonLat({ lat, lng }) {
    return {
      lon: lng,
      lat: lat,
    };
  }
</script>

<style>
  .map {
    height: 100%;
  }
</style>

<div class="map" bind:this={container} />
