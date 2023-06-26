<!-- eslint-disable vue/no-side-effects-in-computed-properties -->
<script setup>
import { ref, shallowRef, computed, watch, nextTick, onMounted } from "vue";
import Chart from "chart.js/auto";
import { uid } from "uid";

import { useWeightsStore } from "../store/weights.js";

import { Delete } from "@element-plus/icons-vue";

const weights = useWeightsStore();

const weightChartEl = ref(null);

const weightChart = shallowRef(null);

const weightInput = ref(60.0);

const currentWeight = computed(() => {
  return weights.weights.sort((a, b) => b.date - a.date)[0] || { weight: 0 };
});

onMounted(() => {
  if (weights.weights.length > 0) {
    renderCharts(weights.weights);
  }
  return;
});

function renderCharts(weights) {
  weightChart.value = new Chart(weightChartEl.value.getContext("2d"), {
    type: "line",
    data: {
      labels: weights
        .sort((a, b) => a.date - b.date)
        .map((weight) => new Date(weight.date).toLocaleDateString()),
      datasets: [
        {
          label: "Weight",
          data: weights
            .sort((a, b) => a.data - b.data)
            .map((weight) => weight.weight),
          backgroundColor: "rgba(255, 105, 180, 0.2)",
          borderColor: "rgba(255, 105, 180)",
          borderWidth: 1,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function addWeight() {
  const newWeight = {
    id: uid(9),
    weight: weightInput.value,
    date: new Date().getTime(),
  };
  weights.addWeightItem(newWeight);
}

watch(
  () => weights.weights,
  (newWeights) => {
    const weights = [...newWeights];

    if (weightChart.value) {
      weightChart.value.data.labels = weights
        .sort((a, b) => a.date - b.date)
        .map((weight) => new Date(weight.date).toLocaleDateString())
        .slice(-7);

      weightChart.value.data.datasets[0].data = weights
        .sort((a, b) => a.date - b.date)
        .map((weight) => weight.weight)
        .slice(-7);

      weightChart.value.update();
      return;
    }

    nextTick(() => {
      renderCharts(weights);
    });
  },
  {
    deep: true,
  }
);
</script>

<template>
  <main>
    <h1>Weight Tracker</h1>
    <div class="current">
      <span>{{ currentWeight.weight }}</span>
      <small>Current weight (kg)</small>
    </div>

    <form @submit.prevent="addWeight">
      <input type="number" step="0.1" v-model="weightInput" />
      <input type="submit" value="Add Weight" />
    </form>

    <div v-if="weights.weights && weights.weights.length > 0">
      <h2>Last 7 days</h2>
      <div class="canvas-box">
        <canvas ref="weightChartEl"></canvas>
      </div>

      <div class="weight-history">
        <h2>Weight History</h2>
        <ul>
          <li v-for="weight in weights.weights" :key="weight.id">
            <span>{{ weight.weight }}kg</span>
            <small>{{ new Date(weight.date).toLocaleDateString() }}</small>
            <el-button
              @click="weights.deleteWeightItem(weight.id)"
              type="danger"
              :icon="Delete"
              circle
            />
          </li>
        </ul>
      </div>
    </div>
  </main>
</template>

<style lang="sass" scoped>
main
  padding: 1.5rem

h1
  font-size: 2em
  text-align: center
  margin-bottom: 2rem

h2
  margin: 0 auto
  margin-bottom: 1rem
  color: #888
  font-weight: 400

.current
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  width: 200px
  height: 200px

  text-align: center
  background-color: white
  border-radius: 999px
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
  border: 5px solid hwb(330 41% 0%)

  margin: 0 auto 2rem

.current
  span
    display: block
    font-size: 2em
    font-weight: bold
    margin-bottom: 0.5rem

.current
  small
    color: #888
    font-style: italic

form
  display: flex
  margin-bottom: 2rem
  border: 1px solid #aaa
  border-radius: 0.5rem
  overflow: hidden
  transition: 200ms linear
  flex-wrap: wrap

form:focus-within,
form:hover
  border-color: hotpink
  border-width: 2px

form
  input[type='number']
    appearance: none
    outline: none
    border: none
    background-color: white
    flex: 1 0 400px
    padding: 1rem 1.5rem
    font-size: 1.25rem

form
  input[type='submit']
    flex: 1 0 40px
    appearance: none
    outline: none
    border: none
    cursor: pointer
    background-color: hotpink
    padding: 1rem 0.5rem
    color: white
    font-size: 1.2rem
    font-weight: 700
    transition: 200ms linear
    border-left: 3px solid transparent

form
  input[type='submit']
    &:hover
      background-color: white
      color: hotpink
      border-left-color: hotpink

.canvas-box
  margin: 0 auto
  width: 100%
  min-height: 35vh
  max-width: 720px
  background-color: white
  padding: 1rem
  border-radius: 0.5rem
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1)
  margin-bottom: 2rem

.weight-history
  ul
    list-style: none
    padding: 0
    margin: 0

.weight-history
  ul
    li
      display: flex
      justify-content: space-between
      align-items: center
      padding: 0.5rem
      cursor: pointer

.weight-history
  ul
    li
      &:nth-child(even)
        background-color: #dfdfdf

.weight-history
  ul
    li
      &:hover
        background-color: #f8f8f8

.weight-history
  ul
    li:last-of-type
         border-bottom: none

.weight-history
  ul
    li
      span
        display: block
        font-size: 1.25rem
        font-weight: 700
        margin-right: 1rem

.weight-history
  ul
    li
      small
        color: #888
        font-style: italic
</style>
