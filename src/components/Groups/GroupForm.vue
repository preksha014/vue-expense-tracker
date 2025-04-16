<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 class="text-lg font-bold mb-4">{{ isEditing ? 'Edit Group' : 'Add Group' }}</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="mb-6">
            <label class="block mb-1">Group Name:</label>
            <input 
              type="text" 
              v-model="form.name" 
              class="border p-2 w-full" 
              placeholder="Enter group name"
              required
            >
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              type="button"
              @click="$emit('close')"
              class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useGroupStore } from '../../stores/groupStore'
  
  const props = defineProps({
    group: {
      type: Object,
      default: () => ({
        name: ''
      })
    }
  })
  
  const emit = defineEmits(['save', 'close'])
  const groupStore = useGroupStore()
  
  const form = ref({
    name: ''
  })
  
  const isEditing = computed(() => {
    return props.group && props.group.name
  })
  
  function handleSubmit() {
    // Validate form
    if (!form.value.name) {
      alert('Group name is required!')
      return
    }
    
    // Check if group exists (for new groups)
    if (!isEditing.value && groupStore.groupExists(form.value.name)) {
      alert('Group name already exists!')
      return
    }
    
    emit('save', { name: form.value.name })
  }
  
  onMounted(() => {
    // Initialize form with provided group data if editing
    if (props.group) {
      form.value = { ...props.group }
    }
  })
  </script>