<script lang="ts">
  import { log } from "$lib/log";
  import { onMount } from "svelte";

  onMount(() => {
    log("Game mounted");
    setInterval(() => {
      log("Game tick\nNEWLINE");
    }, 1000);
  });
</script>

GAME UI
