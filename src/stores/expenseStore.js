import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'

export const useExpenseStore = defineStore('expense', () => {
  // States
  const expenses = ref(JSON.parse(localStorage.getItem('expenses')) || [])
  
  // Getters
  const totalExpense = computed(() => {
    return expenses.value.reduce((sum, e) => sum + parseFloat(e.amount), 0)
  })
  
  const highestExpense = computed(() => {
    if (!expenses.value.length) return { name: 'None', amount: 0 }
    return expenses.value.reduce((max, e) => 
      parseFloat(e.amount) > parseFloat(max.amount) ? e : max, expenses.value[0])
  })
  
  const currentMonthExpense = computed(() => {
    const currentMonth = moment().format("YYYY-MM")
    return expenses.value
      .filter(expense => moment(expense.date).format("YYYY-MM") === currentMonth)
      .reduce((total, expense) => total + parseFloat(expense.amount), 0)
  })
  
  const recentExpenses = computed(() => {
    return [...expenses.value]
      .sort((a, b) => moment(b.date).valueOf() - moment(a.date).valueOf())
      .slice(0, 5)
  })
  
  // Actions
  function addExpense(expense) {
    // Ensure amount is a number
    expense.amount = parseFloat(expense.amount)
    expenses.value.push(expense)
    saveToLocalStorage()
  }
  
  function updateExpense(index, expense) {
    // Ensure amount is a number
    expense.amount = parseFloat(expense.amount)
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
    currentMonthExpense,
    recentExpenses,
    addExpense,
    updateExpense,
    deleteExpense,
    searchExpenses
  }
})