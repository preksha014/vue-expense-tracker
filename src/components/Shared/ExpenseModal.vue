<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ isEditing ? 'Edit Expense' : 'Add Expense' }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
            <input
              id="amount"
              v-model="formData.amount"
              type="number"
              step="0.01"
              class="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
  
          <div class="mb-4">
            <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              id="date"
              v-model="formData.date"
              type="date"
              class="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>
  
          <div class="mb-6">
            <label for="group" class="block text-sm font-medium text-gray-700 mb-1">Group</label>
            <select
              id="group"
              v-model="formData.group"
              class="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="" disabled>Select a group</option>
              <option v-for="group in groups" :key="group.name" :value="group.name">
                {{ group.name }}
              </option>
            </select>
          </div>
  
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits, ref, computed, onMounted } from 'vue'
  
  const props = defineProps({
    expense: {
      type: Object,
      required: true
    },
    groups: {
      type: Array,
      required: true
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  
  const formData = ref({
    name: '',
    amount: '',
    date: '',
    group: ''
  })
  
  // Check if we're editing an existing expense
  const isEditing = computed(() => {
    // Check if the expense has either an id or existing values
    return props.expense.id !== undefined || 
           (props.expense.name && props.expense.amount && props.expense.date);
  })
  
  onMounted(() => {
    // Initialize form with expense data if editing
    formData.value = { ...props.expense }
  })
  
  function handleSubmit() {
    // Validate form data
    if (!formData.value.name || !formData.value.amount || !formData.value.date || !formData.value.group) {
      return
    }
  
    // Create a new object to avoid reactivity issues
    const expenseData = {
      id: props.expense.id,
      name: formData.value.name,
      amount: Number(formData.value.amount),
      date: formData.value.date,
      group: formData.value.group
    }
  
    emit('save', expenseData)
  }
  </script>