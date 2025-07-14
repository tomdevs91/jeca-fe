<template>
  <div class="form-container">
    <h2 class="page-title text-center mb-6">{{ isLogin ? 'Login' : 'Register' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group" v-if="!isLogin">
        <label for="name" class="form-label">Name:</label>
        <input id="name" v-model="form.name" type="text" class="form-input" />
      </div>
      <div class="form-group">
        <label for="email" class="form-label">Email:</label>
        <input id="email" v-model="form.email" type="email" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="password" class="form-label">Password:</label>
        <input id="password" v-model="form.password" type="password" required class="form-input" />
      </div>
      <button type="submit" class="btn-create w-full mb-4">
        {{ isLogin ? 'Login' : 'Register' }}
      </button>
    </form>
    <div class="text-center mt-5">
      <button @click="isLogin = !isLogin" class="text-emerald-400 hover:text-emerald-300 font-medium bg-transparent border-0 cursor-pointer p-0">
        {{ isLogin ? 'Need an account? Register' : 'Have an account? Login' }}
      </button>
    </div>
    <div v-if="error" class="form-error text-center mt-5 p-3 bg-rose-50 border border-rose-200 rounded-xl">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useAuth } from '@/utils/auth';

const isLogin = ref(true);
const form = reactive({
  name: '',
  email: '',
  password: '',
});
const error = ref<string | null>(null);
const { setToken } = useAuth();

const API_BASE = import.meta.env.VITE_API_URL;

async function handleSubmit() {
  error.value = null;
  const url = isLogin.value ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;
  
  try {
    const payload:any = {
      email: form.email,
      password: form.password,
    };
    if (!isLogin.value) {
      payload.name = form.name;
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    if (isLogin.value) {
        if (data.token) {
            setToken(data.token);
        } else {
            throw new Error('Login failed, no token received.');
        }
    } else {
        // Automatically log in after registration
        await loginAfterRegister();
    }
  } catch (err: any) {
    error.value = err.message;
  }
}

async function loginAfterRegister() {
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: form.email, password: form.password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed after registration.');
        if (data.token) {
            setToken(data.token);
        } else {
            throw new Error('Login failed, no token received.');
        }
    } catch (err: any) {
        error.value = `Registration successful, but login failed: ${err.message}`;
    }
}
</script> 