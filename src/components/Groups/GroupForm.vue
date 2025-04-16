<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-6">
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <span v-if="v$.name.$error" class="text-red-500 text-sm mt-1">
        {{ v$.name.$errors[0].$message }}
      </span>
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
</template>

<script setup>
import { defineProps, defineEmits, ref, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { useGroupStore } from '../../stores/groupStore'

const props = defineProps({
  group: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['save', 'close'])
const groupStore = useGroupStore()

const formData = ref({
  name: ''
})

// Setup validation rules
const rules = computed(() => {
  return {
    name: { required }
  }
})

const v$ = useVuelidate(rules, formData.value)

// Check if we're editing an existing group
const isEditing = computed(() => {
  return props.group.id !== undefined || 
         (props.group.name && props.group.name.trim() !== '')
})

onMounted(() => {
  // Initialize form with group data if editing
  formData.value = { ...props.group }
})

async function handleSubmit() {
  // Run validation
  const result = await v$.value.$validate()
  if (!result) {
    return
  }
  
  // Check if group exists (for new groups)
  if (!isEditing.value && groupStore.groupExists(formData.value.name)) {
    v$.value.name.$errors.push({ $message: 'Group name already exists!' })
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