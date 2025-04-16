<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
      <h2 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit Expense' : 'Add Expense' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="mb-4">
          <label class="block mb-1">Expense Name:</label>
          <input type="text" v-model="form.name" class="border p-2 w-full" placeholder="Enter expense name" required>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Amount:</label>
          <input type="number" v-model.number="form.amount" class="border p-2 w-full" placeholder="Enter amount"
            min="0.01" step="0.01" required>
        </div>

        <div class="mb-4">
          <label class="block mb-1">Date:</label>
          <input type="date" v-model="form.date" class="border p-2 w-full" required>
        </div>

        <div class="mb-6">
          <label class="block mb-1">Group:</label>
          <select v-model="form.group" class="border p-2 w-full" required>
            <option value="" disabled>Select a group</option>
            <option v-for="group in groups" :key="group.name" :value="group.name">
              {{ group.name }}
            </option>
          </select>
        </div>

        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')"
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import moment from 'moment'

const props = defineProps({
  expense: {
    type: Object,
    default: () => ({
      name: '',
      amount: '',
      date: moment().format('YYYY-MM-DD'),
      group: ''
    })
  },
  groups: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['save', 'close'])

const form = ref({
  name: '',
  amount: '',
  date: '',
  group: ''
})

const isEditing = computed(() => {
  return props.expense &&
    (props.expense.name || props.expense.amount || props.expense.date || props.expense.group)
})

function handleSubmit() {
  // Validate form
  if (!form.value.name || !form.value.amount || !form.value.date || !form.value.group) {
    alert('All fields are required!')
    return
  }

  // Prepare expense object
  const expense = {
    name: form.value.name,
    amount: parseFloat(form.value.amount),
    date: form.value.date,
    group: form.value.group
  }

  emit('save', expense)
}

onMounted(() => {
  // Initialize form with provided expense data if editing
  if (props.expense) {
    form.value = { ...props.expense }
  }
})
</script>