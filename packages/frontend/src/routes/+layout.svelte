<script lang="ts">
  import "./global.css";

  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { log, logsWritable } from "../lib/log";
  import ioInstance from "$lib/io";

  let logs: [string, string][] = [];
  let logBind: HTMLDivElement;
  logsWritable.subscribe((value) => {
    logs = value;
  });

  onMount(() => {
    log("Layout mounted");

    if (browser) {
      log("Browser Layout mounted");
    }

    return () => {
      logsWritable.set([]);
      log("Layout unmounted");
      ioInstance.disconnect();
    };
  });

  $: logBind?.scrollIntoView({ behavior: "smooth" });
</script>

<div
  style="position: fixed; left: 0px; bottom: 0px; background: #192226; color: #fff; font-family: monospace; padding: 5px 10px; width: 500px; height: 200px; overflow: auto; display: flex; flex-direction: column;"
>
  {#each logs as log, i}
    <div style="display: flex;">
      {#if i === logs.length - 1}
        <div style="width: fit-content;" bind:this={logBind}>
          {log[0]}
        </div>
      {:else}
        <div style="width: fit-content;">
          {log[0]}
        </div>
      {/if}

      <div style="flex-grow: 1">
        <pre style="margin: 0px; padding: 0px">{log[1]}</pre>
      </div>
    </div>
  {/each}
</div>
<slot />
