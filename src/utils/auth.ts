import { ref, computed } from 'vue';

const token = ref(localStorage.getItem('authToken'));

function setToken(newToken: string) {
    token.value = newToken;
    localStorage.setItem('authToken', newToken);
}

function clearToken() {
    token.value = null;
    localStorage.removeItem('authToken');
}

export function useAuth() {
    return {
        token: computed(() => token.value),
        setToken,
        clearToken,
        isAuthenticated: computed(() => !!token.value),
    };
} 