<template>
  <header class="flex justify-between items-center p-4 border-b border-gray-700">
    <div class="logo">
      <a class="text-2xl font-black text-emerald-400 no-underline uppercase">APP</a>
    </div>
    <nav>
      <ul class="flex gap-4 m-0 p-0 list-none">
        <li>
          <button @click="$emit('update:activeView', 'customers')" 
                  :class="['hover:text-emerald-400 bg-transparent border-0 cursor-pointer p-0', 
                          activeView === 'customers' ? 'text-emerald-400' : 'text-gray-300']">
            Customers
          </button>
        </li>
        <li>
          <button @click="$emit('update:activeView', 'products')" 
                  :class="['hover:text-emerald-400 bg-transparent border-0 cursor-pointer p-0', 
                          activeView === 'products' ? 'text-emerald-400' : 'text-gray-300']">
            Products
          </button>
        </li>
        <li>
          <button @click="onLogout" 
                  class="text-gray-300 hover:text-emerald-400 bg-transparent border-0 cursor-pointer p-0">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  activeView: string
}>()

const emit = defineEmits<{
  'update:activeView': [view: string]
  'logout': []
}>()

function onLogout() {
  emit('logout')
}
</script> 