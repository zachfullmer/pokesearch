<script setup lang="ts">
import IconGear from "~/assets/icons/gear.svg";

// DATA
///////

const checkboxAltText = `Broken string matching will match any name that contains the search string, even if there are characters in between. For example, "venat" will match "venonat".`;
const route = useRoute();
const searchString = useState("searchString", () => "");
const useBrokenStringMatching = useState("useBrokenStringMatching", () => true);
const showSettingsMenu = ref(false);
// elements
const searchBarEl: Ref<HTMLInputElement | undefined> = ref();

// EVENT HANDLERS
/////////////////

function onKeypress(event: KeyboardEvent) {
  if (event.code == "Slash" && !(document.activeElement == searchBarEl.value)) {
    event.preventDefault();
    if (searchBarEl.value) {
      searchBarEl.value.focus();
    }
  }
}

// HOOKS
////////

onMounted(() => {
  // global shortcut key that focuses the search bar if it's onscreen
  document.addEventListener("keypress", onKeypress);
});

onBeforeUnmount(() => {
  document.removeEventListener("keypress", onKeypress);
});
</script>

<template>
  <div class="page-container">
    <div class="nav-bar">
      <div class="nav-bar-decoration"></div>
      <div class="nav-bar-items">
        <span class="title">PokéSearch</span>
        <div v-if="route.name == 'pokemon'" class="search-controls">
          <input
            ref="searchBarEl"
            placeholder="search pokemon"
            v-model="searchString"
            class="search-bar"
          />
          <input
            type="checkbox"
            id="brokenStringMatching"
            v-model="useBrokenStringMatching"
          />
          <label for="brokenStringMatching" :title="checkboxAltText"
            >Broken string matching</label
          >
        </div>
        <IconGear class="settings-icon-button" @click="showSettingsMenu = !showSettingsMenu" />
      </div>
      <SettingsMenu :show="showSettingsMenu" />
    </div>
    <div class="page">
      <div class="content-pane">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow-x: hidden;
}

/* Nav Bar */

.nav-bar {
  --border-width: 0.5em;

  position: relative;
  flex: 0 0 auto;
  width: 100%;
  height: 3em;
  color: var(--bg1);
  background: var(--accent);
  border-bottom: solid var(--border-width) var(--fg1);
}

.nav-bar-decoration {
  position: relative;
  left: calc(50% - var(--border-width));
  top: calc(100% + var(--border-width) / 2);
  width: 1.5em;
  height: 1.5em;
  transform: translate(-50%, -50%);
  background: var(--bg1);
  border: solid calc(var(--border-width) / 2) var(--fg1);
  border-radius: 0.75em;
  box-sizing: border-box;
}

/* Nav Bar contents */

.nav-bar-items {
  position: absolute;
  display: flex;
  align-items: center;
  top: 0;
  width: 100%;
  height: 100%;
}

.title {
  flex: 2 0 auto;
  font-size: larger;
  margin: 0 1em;
}

.search-controls {
  flex: 1 0 auto;
  display: flex;
  align-items: center;
}

.search-bar {
  margin-right: 1em;
}

.settings-icon-button {
  flex: 0 0 auto;
  width: 2em;
  height: 2em;
  margin: 0 1em;
  cursor: pointer;
}
.settings-icon-button:hover {
  color: var(--bg2);
}
.settings-icon-button:active {
  color: var(--bg3);
}

/* Page contents */

.page {
  display: flex;
  justify-content: center;
  flex: 1 0 auto;
  height: 0;
  overflow-y: auto;
}

.content-pane {
  width: var(--content-width);
  max-width: var(--content-width);
  margin-top: 2em;
}
</style>
