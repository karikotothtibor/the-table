<script setup>
import { ref, onMounted, watch } from 'vue'
import AuthForm from './components/AuthForm.vue'
import Reservation from '../pages/Reservation.vue'
import Admin from '../pages/Admin.vue'

const isLoggedIn = ref(!!localStorage.getItem('token'));
const currentUser= ref([]);

// Bejelentkezés esemény kezelése
const handleLogin = async() => {
  isLoggedIn.value = true
  await fetchMe();
}

// Kijelentkezés esemény kezelése
const handleLogout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  currentUser.value = null
}

const fetchMe = async () => {
  if (!isLoggedIn.value) return;
  try {
    const res = await fetch("http://localhost:3300/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) {
      emit("logged-out");
      return;
    }
    currentUser.value = await res.json();
    console.log("Users adatok",currentUser.value,currentUser.value.role)
  } catch (err) {
    console.error("Nem sikerült lekérni a profilt:", err);
  }
};

onMounted(()=>{
  fetchMe();}
);

watch(isLoggedIn, (loggedIn) => {
  if (loggedIn) {
    fetchMe();
  } else {
    currentUser.value = null;
  }
});

</script>

<template>
  <div>

    <Admin v-if="isLoggedIn && currentUser?.role==='ADMIN'" @logged-out="handleLogout" />

    <!-- Ha be van jelentkezve a user -->
    <Reservation v-else-if="isLoggedIn && currentUser?.role === 'USER'" @logged-out="handleLogout" />

    <!-- Ha nincs bejelentkezve -->
    <AuthForm v-else @logged-in="handleLogin" />
  </div>
</template>