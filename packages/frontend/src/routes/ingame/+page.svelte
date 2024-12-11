<script lang="ts">
  import { onMount } from "svelte";
  import Game from "./Game.svelte";
  import { browser } from "$app/environment";
  import { svAccessKey, svURL as svURLWritable } from "$lib/ackey";
  import { log } from "$lib/log";
  import ioInstance from "$lib/io";
  import { goto } from "$app/navigation";

  let showUI = false;

  let svURL: null | string = null;
  let svAK: null | string = null;

  svAccessKey.subscribe((value) => {
    svAK = value;
  });
  svURLWritable.subscribe((value) => {
    svURL = value;
  });

  onMount(() => {
    if (!browser) return;
    if (svURL == null) return;
    if (svAK == null) return;
    if (svURL == "" || svAK == "") {
      log("No access key or server URL");
      goto("/");
      return;
    }

    log("Accessing to the server");

    ioInstance.connect(svURL, svAK);

    const destroy = ioInstance.eventListener("connect", () => {
      log("Connected to the server");
      showUI = true;
    });

    return () => {
      destroy();
    };
  });
</script>

{#if showUI}
  <Game />
{:else}
  <div>Loading UI</div>
{/if}
