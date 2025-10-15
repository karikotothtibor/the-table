<template>
  <!-- Tab navigáció -->
  <!-- <div class="auth-container"> -->
    <button :class="{ active: activeTab === 'login' }" @click="switchTab('login')">Bejelentkezés</button>
    <button :class="{ active: activeTab === 'register' }" @click="switchTab('register')">Regisztráció</button>


  <!-- Bejelentkezés / Regisztráció Form -->
    <div class="buttons">
      <!-- <transition name="fade-slide" mode="out-in"> -->
      <div :key="activeTab" class="form-wrapper">
       <div v-if="activeTab === 'login'">
       <h2>Bejelentkezés</h2>
         <form @submit.prevent="login">
           <input v-model="email" type="email" placeholder="Email" class="input" />
            <input v-model="password" type="password" placeholder="Jelszó" class="input" />
            <button type="submit">Bejelentkezés</button>
          </form>
       </div>

      <div v-if="activeTab === 'register'">
        <h2>Regisztráció</h2>
          <form @submit.prevent="register">
            <input v-model="email" type="email" placeholder="Email" class="input" />
            <input v-model="password" type="password" placeholder="Jelszó" class="input" />
            <button type="submit">Regisztráció</button>
          </form>
      </div>
    </div>
    <!-- </transition> -->
  </div>

</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const emit = defineEmits(['logged-in'])

const activeTab = ref ("login")

const login = async () => {
  try {
    const res = await fetch('http://localhost:3300/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      emit('logged-in')
    } else {
      alert(data.error)
    }
  } catch (err) {
    console.error(err)
    alert('Hiba a bejelentkezés során')
  }
}

const register = async () => {
  try {
    const res = await fetch('http://localhost:3300/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: email.value.split('@')[0],
        email: email.value,
        password: password.value
      })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      emit('logged-in')
    } else {
      alert(data.error)
    }
  } catch (err) {
    console.error(err)
    alert('Hiba a regisztráció során')
  }
}

function switchTab (tabname) {
  activeTab.value = tabname
}
</script>
