<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Expenses</h1>
        <button 
          @click="openExpenseModal" 
          class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Add Expense
        </button>
      </div>
      
      <!-- Filters -->
      <div class="bg-white p-4 shadow mb-6">
        <h2 class="font-bold mb-3">Filters</h2>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block mb-2">Search:</label>
            <input 
              type="text" 
              v-model="searchQuery" 
              class="border p-2 w-full" 
              placeholder="Search expenses..."
              @input="filterExpenses"
            >
          </div>
          <div>
            <label class="block mb-2">Group:</label>
            <select 
              v-model="groupFilter" 
              class="border p-2 w-full"
              @change="filterExpenses"
            >
              <option value="">All Groups</option>
              <option 
                v-for="group in groupStore.groups" 
                :key="group.name" 
                :value="group.name"
              >
                {{ group.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block mb-2">Month:</label>
            <input 
              type="month" 
              v-model="monthFilter" 
              class="border p-2 w-full"
              @change="filterExpenses"
            >
          </div>
        </div>
      </div>
      
      <!-- Expenses List -->
      <div class="bg-white p-4 shadow">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">Expense List</h2>
          <p><span class="font-medium">Total:</span> ₹ {{ totalAmount }}</p>
        </div>
        
        <expense-list 
          :expenses="filteredExpenses" 
          @edit="editExpense" 
          @delete="confirmDeleteExpense"
        />
        
        <p v-if="filteredExpenses.length === 0" class="text-center py-4 text-gray-500">
          No expenses found.
        </p>
      </div>
      
      <!-- Expense Modal -->
      <expense-form 
        v-if="showExpenseModal"
        :expense="editingExpense" 
        :groups="groupStore.groups"
        @save="saveExpense"
        @close="closeExpenseModal"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useExpenseStore } from '../stores/expenseStore'
  import { useGroupStore } from '../stores/groupStore'
  import ExpenseList from '../components/Expenses/ExpenseList.vue'
  import ExpenseForm from '../components/Expenses/ExpenseForm.vue'
  import moment from 'moment'
  
  const expenseStore = useExpenseStore()
  const groupStore = useGroupStore()
  
  const searchQuery = ref('')
  const groupFilter = ref('')
  const monthFilter = ref('')
  const filteredExpenses = ref([])
  const showExpenseModal = ref(false)
  const editingExpense = ref(null)
  const editingIndex = ref(-1)
  
  // Computed
  const totalAmount = computed(() => {
    return filteredExpenses.value.reduce((sum, expense) => sum + expense.amount, 0)
  })
  
  // Methods
  function filterExpenses() {
    filteredExpenses.value = expenseStore.expenses.filter(expense => {
      const matchesSearch = !searchQuery.value || 
        expense.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      
      const matchesGroup = !groupFilter.value || expense.group === groupFilter.value
      
      const matchesMonth = !monthFilter.value || 
        moment(expense.date).format('YYYY-MM') === monthFilter.value
      
      return matchesSearch && matchesGroup && matchesMonth
    })
  }
  
  function openExpenseModal() {
    editingExpense.value = {
      name: '',
      amount: '',
      date: moment().format('YYYY-MM-DD'),
      group: ''
    }
    editingIndex.value = -1
    showExpenseModal.value = true
  }
  
  function closeExpenseModal() {
    showExpenseModal.value = false
    editingExpense.value = null
  }
  
  function editExpense(index) {
    const expense = {...filteredExpenses.value[index]}
    // Find the real index in the full expenses array
    const realIndex = expenseStore.expenses.findIndex(e => 
      e.name === expense.name && 
      e.amount === expense.amount && 
      e.date === expense.date && 
      e.group === expense.group
    )
    
    editingExpense.value = expense
    editingIndex.value = realIndex
    showExpenseModal.value = true
  }
  
  function saveExpense(expense) {
    if (editingIndex.value >= 0) {
      expenseStore.updateExpense(editingIndex.value, expense)
    } else {
      expenseStore.addExpense(expense)
    }
    
    closeExpenseModal()
    filterExpenses()
  }
  
  function confirmDeleteExpense(index) {
    if (confirm('Are you sure you want to delete this expense?')) {
      const expense = filteredExpenses.value[index]
      const realIndex = expenseStore.expenses.findIndex(e => 
        e.name === expense.name && 
        e.amount === expense.amount && 
        e.date === expense.date && 
        e.group === expense.group
      )
      
      expenseStore.deleteExpense(realIndex)
      filterExpenses()
    }
  }
  
  onMounted(() => {
    filterExpenses()
  })
  </script>