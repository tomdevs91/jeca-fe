<template>
  <div class="page-container">
    <h2 class="page-title mb-8">Customer Management</h2>
    
    <!-- Create Customer Form -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Create Customer</h3>
      <form @submit.prevent="createCustomer">
        <div class="form-group">
          <label for="create-name" class="form-label">Name:</label>
          <input id="create-name" v-model="createForm.name" type="text" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="create-email" class="form-label">Email:</label>
          <input id="create-email" v-model="createForm.email" type="email" required class="form-input" />
        </div>
        <button type="submit" class="btn-create w-full">
          Create Customer
        </button>
      </form>
    </div>

    <!-- Get All Customers -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Get All Customers</h3>
      <button @click="getAllCustomers" class="btn-cancel w-full mb-4">
        Fetch All Customers
      </button>
      <div v-if="customers.length > 0" class="mt-4">
        <h4 class="text-lg font-medium text-emerald-400 mb-2">Customers:</h4>
        <ul class="space-y-2">
          <li v-for="customer in customers" :key="customer.id" class="card flex justify-between items-center">
            <span>ID: {{ customer.id }}, Name: {{ customer.name }}, Email: {{ customer.email }}</span>
            <button @click="deleteCustomer(customer.id)" class="btn-delete">
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Get Customer by ID -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Get Customer by ID</h3>
      <form @submit.prevent="getCustomerById">
        <div class="form-group">
          <label for="get-id" class="form-label">Customer ID:</label>
          <input id="get-id" v-model="getIdForm.id" type="number" required class="form-input" />
        </div>
        <button type="submit" class="btn-cancel w-full">
          Get Customer
        </button>
      </form>
    </div>

    <!-- Update Customer -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Update Customer</h3>
      <form @submit.prevent="updateCustomer">
        <div class="form-group">
          <label for="update-id" class="form-label">Customer ID:</label>
          <input id="update-id" v-model="updateForm.id" type="number" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="update-name" class="form-label">Name:</label>
          <input id="update-name" v-model="updateForm.name" type="text" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="update-email" class="form-label">Email:</label>
          <input id="update-email" v-model="updateForm.email" type="email" required class="form-input" />
        </div>
        <button type="submit" class="btn-edit w-full">
          Update Customer
        </button>
      </form>
    </div>

    <!-- Response Display -->
    <div v-if="response" class="form-container">
      <h4 class="form-label mb-2">Response:</h4>
      <pre :class="[
        'p-4 rounded-xl',
        responseClass === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 
        'bg-rose-50 text-rose-800 border border-rose-200'
      ]">{{ response }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/utils/auth'

interface Customer {
  id: number;
  name: string;
  email: string;
}

const API_BASE = 'http://83.229.85.23:3000/api'

const customers = ref<Customer[]>([])
const response = ref('')
const responseClass = ref('')

const createForm = reactive({
  name: '',
  email: ''
})

const getIdForm = reactive({
  id: ''
})

const updateForm = reactive({
  id: '',
  name: '',
  email: ''
})

async function createCustomer() {
  try {
    const res = await fetch(`${API_BASE}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: createForm.name,
        email: createForm.email
      })
    })

    const data = await res.json()
    
    if (res.ok) {
      response.value = `Customer created successfully:\n${JSON.stringify(data, null, 2)}`
      responseClass.value = 'success'
      createForm.name = ''
      createForm.email = ''
      getAllCustomers() // Refresh the list
    } else {
      response.value = `Error: ${data.message || 'Failed to create customer'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function getAllCustomers() {
  try {
    const res = await fetch(`${API_BASE}/customers`)
    const data = await res.json()
    
    if (res.ok) {
      customers.value = data
      response.value = `Fetched ${data.length} customers`
      responseClass.value = 'success'
    } else {
      response.value = `Error: ${data.message || 'Failed to fetch customers'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function getCustomerById() {
  try {
    const res = await fetch(`${API_BASE}/customers/${getIdForm.id}`)
    const data = await res.json()
    
    if (res.ok) {
      response.value = `Customer found:\n${JSON.stringify(data, null, 2)}`
      responseClass.value = 'success'
    } else {
      response.value = `Error: ${data.message || 'Customer not found'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function updateCustomer() {
  try {
    const res = await fetch(`${API_BASE}/customers/${updateForm.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: updateForm.name,
        email: updateForm.email
      })
    })

    const data = await res.json()
    
    if (res.ok) {
      response.value = `Customer updated successfully:\n${JSON.stringify(data, null, 2)}`
      responseClass.value = 'success'
      updateForm.id = ''
      updateForm.name = ''
      updateForm.email = ''
      getAllCustomers() // Refresh the list
    } else {
      response.value = `Error: ${data.message || 'Failed to update customer'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function deleteCustomer(id: number) {
  try {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'DELETE'
    })
    
    if (res.ok) {
      response.value = `Customer ${id} deleted successfully`
      responseClass.value = 'success'
      getAllCustomers() // Refresh the list
    } else {
      const data = await res.json()
      response.value = `Error: ${data.message || 'Failed to delete customer'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}
</script> 