<template>
  <div>
    <!-- Ha be van jelentkezve a user -->
    <UserProfile v-if="isLoggedIn" @logged-out="handleLogout" />

    <!-- Ha nincs bejelentkezve -->
    <AuthForm v-else @logged-in="handleLogin" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthForm from './components/AuthForm.vue'
import UserProfile from './components/UserProfile.vue'

const isLoggedIn = ref(!!localStorage.getItem('token'))

// Bejelentkezés esemény kezelése
const handleLogin = () => {
  isLoggedIn.value = true
}

// Kijelentkezés esemény kezelése
const handleLogout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
}
</script>
