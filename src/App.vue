<template>
  <div class="min-h-screen font-sans antialiased">
    <div v-if="!isAuthenticated">
      <AuthView />
    </div>
    <div v-else>
      <Header 
        v-model:activeView="activeView"
        @logout="logout"
      />
      <main class="p-4">
        <CustomerView v-if="activeView === 'customers'" />
        <ProductView v-if="activeView === 'products'" />
      </main>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import AuthView from '@/views/auth/AuthView.vue'
import CustomerView from '@/views/customers/CustomerView.vue'
import ProductView from '@/views/products/ProductView.vue'
import Header from '@/components/Header.vue'
import { ref } from 'vue'
import { useAuth } from '@/utils/auth'

const { isAuthenticated, clearToken } = useAuth()
const activeView = ref('customers')

function logout() {
  clearToken()
}
</script>
  