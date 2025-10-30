<script setup lang="ts">

// DATA
///////

const route = useRoute();
const searchString = useState("searchString", () => "");
const useBrokenStringMatching = useState("useBrokenStringMatching", () => true);
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
      <span class="title">PokéSearch</span>
      <div class="spacer"></div>
      <div v-if="route.name == 'pokemon'" class="search-controls">
        <input
          ref="searchBarEl"
          placeholder="search pokemon"
          v-model="searchString"
        />
        <input type="checkbox" v-model="useBrokenStringMatching" />
        <label>Broken string matching</label>
      </div>
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

.nav-bar {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  width: 100%;
  height: 3em;
  padding: 0 2em;
  background: darkred;
}

.title {
  flex: 2 0 auto;
  font-size: larger;
}

.search-controls {
  flex: 1 0 auto;
}

.page {
  flex: 1 0 auto;
  height: 0;
  overflow-y: auto;
}

.content-pane {
  margin: 2em auto;
  max-width: 1000px;
}
</style>
