<script setup lang="ts">
// DATA
///////

const props = defineProps<{
  show: boolean;
}>();

const useMetricUnits = useState("useMetricUnits", () => true);
</script>

<template>
  <div :class="{ 'settings-menu': true, show }">
    <div>
      <div class="settings-row">
        <label for="useMetricUnits">Use metric units</label>
        <input type="checkbox" id="useMetricUnits" v-model="useMetricUnits" />
      </div>
    </div>
    <!-- <table>
      <tbody>
        <tr>
          <td>
          </td>
          <td>
          </td>
        </tr>
      </tbody>
    </table> -->
  </div>
</template>

<style scoped>
.settings-menu {
  display: none;
  position: absolute;
  top: 100%;
  right: 0%;
  width: 200px;
  min-height: 100px;
  padding: 1em 0;
  overflow-y: auto;
  color: var(--fg1);
  background: var(--bg1);
  border: solid 1px var(--fg1);
}

.settings-menu.show {
  display: block;
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>
