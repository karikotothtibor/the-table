<template>
  <div class="profile-container" v-if="user">
    <h2>Profil</h2>

    <input v-model="user.name" />
    <input :value="user.email" disabled />

    <div class="buttons">
      <button @click="update">Mentés</button>
      <button @click="logout">Kijelentkezés</button>
      <button @click="remove">Fiók törlése</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";

const user = ref(null);
const emit = defineEmits(["logged-out"]);

const fetchMe = async () => {
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
    user.value = await res.json();
  } catch (err) {
    console.error("Nem sikerült lekérni a profilt:", err);
  }
};

const update = async () => {
  try {
    await fetch(`http://localhost:3300/users/${user.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: user.value.name }),
    });
  } catch (err) {
    console.error("Nem sikerült frissíteni:", err);
  }
};

const remove = async () => {
  try {
    await fetch(`http://localhost:3300/user/${user.value.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    localStorage.removeItem("token");
    emit("logged-out");
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
  }
};

const logout = () => {
  localStorage.removeItem("token");
  emit("logged-out");
};

onMounted(fetchMe);
</script>


