<template>
  <div class="page-container">
    <h2 class="page-title mb-8">Product Management</h2>
    
    <!-- Create Product Form -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Create Product</h3>
      <form @submit.prevent="createProduct">
        <div class="form-group">
          <label for="create-name" class="form-label">Name:</label>
          <input id="create-name" v-model="createForm.name" type="text" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="create-price" class="form-label">Price:</label>
          <input id="create-price" v-model="createForm.price" type="number" step="0.01" required class="form-input" />
        </div>
        <button type="submit" class="btn-create w-full">
          Create Product
        </button>
      </form>
    </div>

    <!-- Get All Products -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Get All Products</h3>
      <button @click="getAllProducts" class="btn-cancel w-full mb-4">
        Fetch All Products
      </button>
      <div v-if="products.length > 0" class="mt-4">
        <h4 class="text-lg font-medium text-emerald-400 mb-2">Products:</h4>
        <ul class="space-y-2">
          <li v-for="product in products" :key="product.id" class="card flex justify-between items-center">
            <span>ID: {{ product.id }}, Name: {{ product.name }}, Price: ${{ product.price }}</span>
            <button @click="deleteProduct(product.id)" class="btn-delete">
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>

    <!-- Get Product by ID -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Get Product by ID</h3>
      <form @submit.prevent="getProductById">
        <div class="form-group">
          <label for="get-id" class="form-label">Product ID:</label>
          <input id="get-id" v-model="getIdForm.id" type="number" required class="form-input" />
        </div>
        <button type="submit" class="btn-cancel w-full">
          Get Product
        </button>
      </form>
    </div>

    <!-- Update Product -->
    <div class="form-container mb-8">
      <h3 class="text-xl font-semibold text-emerald-400 mb-4">Update Product</h3>
      <form @submit.prevent="updateProduct">
        <div class="form-group">
          <label for="update-id" class="form-label">Product ID:</label>
          <input id="update-id" v-model="updateForm.id" type="number" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="update-name" class="form-label">Name:</label>
          <input id="update-name" v-model="updateForm.name" type="text" required class="form-input" />
        </div>
        <div class="form-group">
          <label for="update-price" class="form-label">Price:</label>
          <input id="update-price" v-model="updateForm.price" type="number" step="0.01" required class="form-input" />
        </div>
        <button type="submit" class="btn-edit w-full">
          Update Product
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
import { ref, reactive, onMounted } from 'vue'
import { useAuth } from '@/utils/auth'

interface Product {
  id: number;
  name: string;
  price: number;
}

const { token } = useAuth();
const API_BASE = 'http://83.229.85.23:3000/api'

const products = ref<Product[]>([])
const response = ref('')
const responseClass = ref('')

const createForm = reactive({
  name: '',
  price: ''
})

const getIdForm = reactive({
  id: ''
})

const updateForm = reactive({
  id: '',
  name: '',
  price: ''
})

function buildHeaders(withContent = false) {
  const headers: HeadersInit = {};
  if (token.value) {
    headers['Authorization'] = `Bearer ${token.value}`;
  }
  if (withContent) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function createProduct() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: buildHeaders(true),
      body: JSON.stringify({
        name: createForm.name,
        price: parseFloat(createForm.price)
      })
    })

    const data = await res.json()
    
    if (res.ok) {
      response.value = `Product created successfully:\n${JSON.stringify(data, null, 2)}`
      responseClass.value = 'success'
      createForm.name = ''
      createForm.price = ''
      getAllProducts() // Refresh the list
    } else {
      response.value = `Error: ${data.message || 'Failed to create product'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function getAllProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`, {
      headers: buildHeaders()
    })
    const data = await res.json()
    
    if (res.ok) {
      products.value = data
      response.value = `Fetched ${data.length} products`
      responseClass.value = 'success'
    } else {
      response.value = `Error: ${data.message || 'Failed to fetch products'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function getProductById() {
  try {
    const res = await fetch(`${API_BASE}/products/${getIdForm.id}`, {
      headers: buildHeaders()
    })
    const data = await res.json()
    
    if (res.ok) {
      response.value = `Product found:\n${JSON.stringify(data, null, 2)}`
      responseClass.value = 'success'
    } else {
      response.value = `Error: ${data.message || 'Product not found'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function updateProduct() {
  try {
    const res = await fetch(`${API_BASE}/products/${updateForm.id}`, {
      method: 'PUT',
      headers: buildHeaders(true),
      body: JSON.stringify({
        name: updateForm.name,
        price: parseFloat(updateForm.price)
      })
    })

    const data = await res.json()
    
    if (res.ok) {
      response.value = `Product updated successfully:\n${JSON.stringify(data, null, 2)}`
      responseClass.value = 'success'
      updateForm.id = ''
      updateForm.name = ''
      updateForm.price = ''
      getAllProducts() // Refresh the list
    } else {
      response.value = `Error: ${data.message || 'Failed to update product'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

async function deleteProduct(id: number) {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: buildHeaders()
    })
    
    if (res.ok) {
      response.value = `Product ${id} deleted successfully`
      responseClass.value = 'success'
      getAllProducts() // Refresh the list
    } else {
      const data = await res.json()
      response.value = `Error: ${data.message || 'Failed to delete product'}`
      responseClass.value = 'error'
    }
  } catch (err: any) {
    response.value = `Network Error: ${err.message}`
    responseClass.value = 'error'
  }
}

onMounted(() => {
  getAllProducts();
});
</script> 