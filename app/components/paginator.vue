<script setup lang="ts">
import IconChevronLeft from "~/assets/icons/chevron_left.svg";
import IconChevronRight from "~/assets/icons/chevron_right.svg";

// DATA
///////

const props = defineProps<{
  minPage: number;
  maxPage: number;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", page: number): void;
}>();

const model = defineModel({ default: 1 });
model.value = Math.max(props.minPage, Math.min(model.value, props.maxPage));

// METHODS
//////////

function decrementPage() {
  model.value = Math.max(model.value - 1, props.minPage);
}

function incrementPage() {
  model.value = Math.min(model.value + 1, props.maxPage);
}

// EVENT HANDLERS
/////////////////

function onPageInputChanged(event: Event) {
  const inputElement = event.target as HTMLInputElement;
  const pageInt = Math.round(Number(inputElement.value));
  inputElement.value = "" + model.value;
  if (isNaN(pageInt)) {
    return;
  }
  emit(
    "update:modelValue",
    Math.max(props.minPage, Math.min(pageInt, props.maxPage - 1))
  );
}
</script>

<template>
  <div class="page-nav-bar">
    <ModularButton :disabled="model <= minPage" @click="decrementPage">
      <div>
        <IconChevronLeft />
      </div>
      <span>Prev</span>
    </ModularButton>
    <input class="page-input" :value="model" @change="onPageInputChanged" />
    <ModularButton :disabled="model >= maxPage - 1" @click="incrementPage">
      <span>Next</span>
      <div>
        <IconChevronRight />
      </div>
    </ModularButton>
  </div>
</template>

<style scoped>
.page-nav-bar {
  display: flex;
  justify-content: space-around;
  padding: 1em;
}

.page-input {
  width: 5ch;
  text-align: center;
}
</style>
