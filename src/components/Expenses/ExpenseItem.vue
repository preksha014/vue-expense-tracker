<template>
  <div class="flex justify-between p-2">
    <div>
      <h3 class="font-medium">{{ expense.name }}</h3>
      <p class="text-sm text-gray-500">
        ₹ {{ expense.amount }} | {{ formatDate(expense.date) }} | {{ expense.group }}
      </p>
    </div>
    <div v-show="route.name != 'Dashboard'" class="flex items-center space-x-2">
      <button @click="$emit('edit')" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
        Edit
      </button>
      <button @click="$emit('delete')" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
        Delete
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import moment from 'moment'
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps({
  expense: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

function formatDate(date) {
  return moment(date).format('YYYY-MM-DD')
}
</script>