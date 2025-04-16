<template>
    <div>
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Groups</h1>
        <button 
          @click="openGroupModal" 
          class="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600"
        >
          Add Group
        </button>
      </div>
      
      <!-- Groups List -->
      <div class="bg-white p-4 shadow">
        <h2 class="text-xl font-bold mb-4">Group List</h2>
        <group-list 
          :groups="groupStore.groups" 
          @edit="editGroup" 
          @delete="confirmDeleteGroup"
        />
        
        <p v-if="groupStore.groups.length === 0" class="text-center py-4 text-gray-500">
          No groups found. Create a group to get started.
        </p>
      </div>
      
      <!-- Group Modal -->
      <group-form 
        v-if="showGroupModal"
        :group="editingGroup" 
        @save="saveGroup"
        @close="closeGroupModal"
      />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useGroupStore } from '../stores/groupStore'
  import GroupList from '../components/Groups/GroupList.vue'
  import GroupForm from '../components/Groups/GroupForm.vue'
  
  const groupStore = useGroupStore()
  
  const showGroupModal = ref(false)
  const editingGroup = ref(null)
  const editingIndex = ref(-1)
  
  // Methods
  function openGroupModal() {
    editingGroup.value = { name: '' }
    editingIndex.value = -1
    showGroupModal.value = true
  }
  
  function closeGroupModal() {
    showGroupModal.value = false
    editingGroup.value = null
  }
  
  function editGroup(index) {
    editingGroup.value = { name: groupStore.groups[index].name }
    editingIndex.value = index
    showGroupModal.value = true
  }
  
  function saveGroup(group) {
    if (editingIndex.value >= 0) {
      groupStore.updateGroup(editingIndex.value, group.name)
    } else {
      groupStore.addGroup(group.name)
    }
    
    closeGroupModal()
  }
  
  function confirmDeleteGroup(index) {
    if (confirm('Are you sure you want to delete this group? All expenses in this group will also be deleted.')) {
      groupStore.deleteGroup(index)
    }
  }
  </script>