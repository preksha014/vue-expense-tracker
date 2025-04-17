<template>
  <form @submit.prevent="handleSubmit">
    <InputField
      id="name"
      v-model="formData.name"
      label="Group Name"
      :error="v$.name.$error ? v$.name.$errors[0].$message : ''"
    />
    
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
import InputField from '../Shared/InputField.vue'

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

const v$ = useVuelidate(rules, formData)

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