import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useWeightsStore = defineStore('weights', () => {
  const weights = ref([]);

  if (localStorage.getItem('weights')) {
    weights.value = JSON.parse(localStorage.getItem('weights'));
  }

  const addWeightItem = (data) => {
    weights.value.push(data);
  };

  const deleteWeightItem = (id) => {
    weights.value = weights.value.filter((el) => el.id !== id);
  };

  watch(
    () => weights,
    (state) => {
      localStorage.setItem('weights', JSON.stringify(state._value));
    },
    { deep: true },
  );

  return {
    weights,
    addWeightItem,
    deleteWeightItem,
  };
});
