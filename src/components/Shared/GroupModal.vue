<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">{{ isEditing ? 'Edit Group' : 'Add Group' }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
  
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full p-2 border border-gray-300 rounded"
              required
            />
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
    group: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  
  const formData = ref({
    name: ''
  })
  
  // Check if we're editing an existing group
  const isEditing = computed(() => {
    // Check if the group has either an id or a non-empty name
    return props.group.id !== undefined || 
           (props.group.name && props.group.name.trim() !== '');
  })
  
  onMounted(() => {
    // Initialize form with group data if editing
    formData.value = { ...props.group }
  })
  
  function handleSubmit() {
    // Validate form data
    if (!formData.value.name) {
      return
    }
  
    // Create a new object to avoid reactivity issues
    const groupData = {
      id: props.group.id, // Will be undefined for new groups
      name: formData.value.name
    }
  
    emit('save', groupData)
  }
  </script>