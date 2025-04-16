<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        class="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter expense name"
      />
      <span v-if="v$.name.$error" class="text-red-500 text-sm mt-1">
        {{ v$.name.$errors[0].$message }}
      </span>
    </div>

    <div class="mb-4">
      <label for="amount" class="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
      <input
        id="amount"
        v-model.number="formData.amount"
        type="number"
        step="0.01"
        min="0.01"
        class="w-full p-2 border border-gray-300 rounded"
        placeholder="Enter amount"
      />
      <span v-if="v$.amount.$error" class="text-red-500 text-sm mt-1">
        {{ v$.amount.$errors[0].$message }}
      </span>
    </div>

    <div class="mb-4">
      <label for="date" class="block text-sm font-medium text-gray-700 mb-1">Date</label>
      <input
        id="date"
        v-model="formData.date"
        type="date"
        class="w-full p-2 border border-gray-300 rounded"
      />
      <span v-if="v$.date.$error" class="text-red-500 text-sm mt-1">
        {{ v$.date.$errors[0].$message }}
      </span>
    </div>

    <div class="mb-6">
      <label for="group" class="block text-sm font-medium text-gray-700 mb-1">Group</label>
      <select
        id="group"
        v-model="formData.group"
        class="w-full p-2 border border-gray-300 rounded"
      >
        <option value="" disabled>Select a group</option>
        <option v-for="group in groups" :key="group.name" :value="group.name">
          {{ group.name }}
        </option>
      </select>
      <span v-if="v$.group.$error" class="text-red-500 text-sm mt-1">
        {{ v$.group.$errors[0].$message }}
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
import { required, decimal, minValue } from '@vuelidate/validators'
import moment from 'moment'

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
  date: moment().format('YYYY-MM-DD'),
  group: ''
})

// Setup validation rules
const rules = computed(() => {
  return {
    name: { required },
    amount: { required, decimal, minValue: minValue(0.01) }, // Ensure amount is positive
    date: { required },
    group: { required }
  }
})

const v$ = useVuelidate(rules, formData)

// Check if we're editing an existing expense
const isEditing = computed(() => {
  return props.expense.id !== undefined || 
         (props.expense.name && props.expense.amount && props.expense.date);
})

onMounted(() => {
  // Initialize form with expense data if editing
  if (props.expense) {
    formData.value = { ...props.expense }
    
    // Ensure date is in the correct format if it exists
    if (!formData.value.date) {
      formData.value.date = moment().format('YYYY-MM-DD')
    }
  }
})

async function handleSubmit() {
  // Trigger validation
  const isValid = await v$.value.$validate()

  if (!isValid) {
    // Optionally, log or show an error to the user
    console.error('Form validation failed:', v$.value.$errors)
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