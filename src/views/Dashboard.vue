<template>
    <div>
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>
    
      <!-- Summary Section -->
      <div class="bg-white p-4 shadow mb-6 place-items-center">
        <h2 class="text-xl font-bold mb-5">Summary</h2>
        <p class="mb-2">
          <span class="text-blue-500 font-semibold">Total Expense: </span>
          <span>₹ {{ expenseStore.totalExpense }}</span>
        </p>
        <p class="mb-2">
          <span class="text-blue-500 font-semibold">Highest Expense: </span>
          <span>{{ expenseStore.highestExpense.name }} - ₹ {{ expenseStore.highestExpense.amount }}</span>
        </p>
        <div class="bg-white p-4 shadow mb-6">
          <div class="grid grid-cols-2 gap-16 mt-3">
            <div>
              <label for="monthFilter" class="block font-semibold mt-2">Select Month:</label>
              <input 
                type="month" 
                id="monthFilter" 
                v-model="monthFilter"
                class="border p-2 w-full mb-2 mt-2"
              >
              <p class="mb-2">
                <span class="text-blue-500 font-semibold">Monthly Expense: </span>
                <span>₹ {{ monthlyExpense }}</span>
              </p>
            </div>
            <div>
              <label for="groupFilter" class="block font-semibold mt-2">Select Group:</label>
              <select 
                v-model="groupFilter"
                class="border p-2 w-full mb-3 mt-2"
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
              <p class="mb-2">
                <span class="text-blue-500 font-semibold">Group Expense: </span>
                <span>₹ {{ groupExpense }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Recent Expenses List -->
      <div class="bg-white p-4 shadow mb-6">
        <h2 class="text-xl font-bold mb-4">Recent Expenses</h2>
        <ExpenseList :expenses="filteredExpenses.slice(0, 5)" />
        <router-link 
          to="/expenses" 
          class="inline-block mt-4 text-blue-500 hover:text-blue-700"
        >
          View All Expenses
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue'
  import { useExpenseStore } from '../stores/expenseStore'
  import { useGroupStore } from '../stores/groupStore'
  import ExpenseList from '../components/Expenses/ExpenseList.vue'
  import moment from 'moment'
  
  const expenseStore = useExpenseStore()
  const groupStore = useGroupStore()
  
  const searchQuery = ref('')
  const monthFilter = ref('')
  const groupFilter = ref('')
  const filteredExpenses = ref([...expenseStore.expenses])
  
  const monthlyExpense = computed(() => {
    if (!monthFilter.value) return 0
    
    return expenseStore.expenses
      .filter(e => moment(e.date).format("YYYY-MM") === monthFilter.value)
      .reduce((sum, e) => sum + e.amount, 0)
  })
  
  const groupExpense = computed(() => {
    if (!groupFilter.value) return 0
    
    return expenseStore.expenses
      .filter(e => e.group === groupFilter.value)
      .reduce((sum, e) => sum + e.amount, 0)
  })
  
  function searchExpenses() {
    filteredExpenses.value = expenseStore.searchExpenses(searchQuery.value)
  }
  
  // Update filtered expenses when filters change
  watch([monthFilter, groupFilter], () => {
    filteredExpenses.value = expenseStore.expenses.filter(e => 
      (!monthFilter.value || moment(e.date).format("YYYY-MM") === monthFilter.value) && 
      (!groupFilter.value || e.group === groupFilter.value)
    )
  })
  </script>