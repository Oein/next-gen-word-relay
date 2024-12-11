<script lang="ts">
  import { onMount } from "svelte";
  import { log } from "../lib/log";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { svAccessKey, svURL } from "$lib/ackey";

  let servers: {
    status: string;
    name: string;
    url: string;
    online: number;
    max: number;
  }[] = [];

  const handleServerClick = (idx: number) => {
    if (idx < 0 || idx >= servers.length) return;
    if (servers[idx].status !== "online") return;

    // Get Access Key to channel
    fetch(
      import.meta.env.VITE_GLOBAL_API +
        "/channel-manager/access-key?idx=" +
        idx.toString(),
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status == false) {
          // Show error message
          log("Error:", data.error);
          if (data.error == "Not authenticated") {
            // Redirect to login page
            log("Redirecting to login page");
            goto("/auth/login");
          }
          return;
        }
        log("Access Key:", data);

        const svWSURL = data.sv;
        const ak = data.ak;

        svURL.set(svWSURL);
        svAccessKey.set(ak);

        goto("/ingame");
      });
  };

  onMount(() => {
    if (!browser) return;

    let timeout: number = -1;
    const fetchNew = () => {
      fetch(
        import.meta.env.VITE_GLOBAL_API + "/channel-manager/available-servers"
      )
        .then((res) => res.json())
        .then((data) => {
          servers = data;
          timeout = setTimeout(fetchNew, 10000);
        });
    };

    fetchNew();

    return () => {
      clearTimeout(timeout);
      timeout = -1;
    };
  });
</script>

<div>
  <h2>Avaliable Servers</h2>
  {#each servers as server, i}
    <button
      style="display: flex; cursor: pointer;"
      on:click={() => handleServerClick(i)}
    >
      <h3>{server.name}</h3>
      <p>{server.status}</p>
      <p>
        {server.online}/{server.max}
      </p>
    </button>
  {/each}
</div>
