import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'

export const useExpenseStore = defineStore('expense', () => {
  // State
  const expenses = ref(JSON.parse(localStorage.getItem('expenses')) || [])
  
  // Getters
  const totalExpense = computed(() => {
    return expenses.value.reduce((sum, e) => sum + e.amount, 0)
  })
  
  const highestExpense = computed(() => {
    if (!expenses.value.length) return { name: 'None', amount: 0 }
    return expenses.value.reduce((max, e) => e.amount > max.amount ? e : max, expenses.value[0])
  })
  
  const filteredExpenses = computed(() => (monthFilter, groupFilter) => {
    return expenses.value.filter(e => 
      (!monthFilter || moment(e.date).format("YYYY-MM") === monthFilter) && 
      (!groupFilter || e.group === groupFilter)
    )
  })
  
  // Actions
  function addExpense(expense) {
    expenses.value.push(expense)
    saveToLocalStorage()
  }
  
  function updateExpense(index, expense) {
    expenses.value[index] = expense
    saveToLocalStorage()
  }
  
  function deleteExpense(index) {
    expenses.value.splice(index, 1)
    saveToLocalStorage()
  }
  
  function searchExpenses(query) {
    if (!query) return expenses.value
    return expenses.value.filter(e => e.name.toLowerCase().includes(query.toLowerCase()))
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('expenses', JSON.stringify(expenses.value))
  }
  
  return { 
    expenses, 
    totalExpense, 
    highestExpense, 
    filteredExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    searchExpenses
  }
})