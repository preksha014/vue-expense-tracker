<template>
    <nav class="bg-blue-600 text-white shadow">
        <div class="container mx-auto px-4">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <router-link to="/" class="flex-shrink-0">
                        <span class="text-xl font-bold">Expense Tracker</span>
                    </router-link>
                </div>

                <div class="hidden md:block">
                    <div class="flex items-center space-x-4">
                        <router-link v-for="item in navigationItems" :key="item.name" :to="item.path"
                            class="px-3 py-2 rounded text-white hover:bg-blue-700"
                            :class="{ 'bg-blue-700': isActive(item.path) }">
                            {{ item.name }}
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navigationItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Expenses', path: '/expenses' },
    { name: 'Groups', path: '/groups' }
]

function isActive(path) {
    if (path === '/' && route.path === '/') {
        return true
    }
    return route.path.startsWith(path) && path !== '/'
}
</script>