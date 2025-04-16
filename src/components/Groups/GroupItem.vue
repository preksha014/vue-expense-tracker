<template>
    <div class="flex justify-between p-2">
      <div>
        <h3 class="font-medium">{{ group.name }}</h3>
        <p class="text-sm text-gray-500">
          Created: {{ formatDateTime(group.createdAt) }} | Updated: {{ formatDateTime(group.updatedAt) }}
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <button 
          @click="$emit('edit')" 
          class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button 
          @click="$emit('delete')" 
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue'
  import moment from 'moment'
  
  defineProps({
    group: {
      type: Object,
      required: true
    }
  })
  
  defineEmits(['edit', 'delete'])
  
  function formatDateTime(dateTime) {
    return moment(dateTime).format('YYYY-MM-DD, h:mm A')
  }
  </script>