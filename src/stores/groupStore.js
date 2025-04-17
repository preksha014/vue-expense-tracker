import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import moment from 'moment'
import { useExpenseStore } from './expenseStore'

export const useGroupStore = defineStore('group', () => {
  // State
  const groups = ref(JSON.parse(localStorage.getItem('groups')) || [])
  
  // Getters
  const groupList = computed(() => groups.value)
  
  const groupExpenses = computed(() => (groupName) => {
    const expenseStore = useExpenseStore()
    if (!groupName) return 0
    
    return expenseStore.expenses
      .filter(e => e.group === groupName)
      .reduce((sum, e) => sum + e.amount, 0)
  })
  
  // Actions
  function addGroup(name) {
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    groups.value.push({ 
      name, 
      createdAt: now, 
      updatedAt: now 
    })
    saveToLocalStorage()
  }
  
  function updateGroup(index, newName) {
    const now = moment().format("YYYY-MM-DD HH:mm:ss")
    const oldName = groups.value[index].name
    groups.value[index].name = newName
    groups.value[index].updatedAt = now
    saveToLocalStorage()
    
    // Update the group name in all related expenses
    const expenseStore = useExpenseStore()
    expenseStore.updateExpenseGroup(oldName, newName)
  }
  
  function deleteGroup(index) {
    const groupName = groups.value[index].name
    groups.value.splice(index, 1)
    
    // Remove expenses with this group
    const expenseStore = useExpenseStore()
    const updatedExpenses = expenseStore.expenses.filter(e => e.group !== groupName)
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses))
    
    saveToLocalStorage()
  }
  
  function groupExists(name) {
    return groups.value.some(g => g.name.toLowerCase() === name.toLowerCase())
  }
  
  function saveToLocalStorage() {
    localStorage.setItem('groups', JSON.stringify(groups.value))
  }
  
  return { 
    groups, 
    groupList, 
    groupExpenses,
    addGroup,
    updateGroup,
    deleteGroup,
    groupExists
  }
})