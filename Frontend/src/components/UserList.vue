<template>
  <div class="userlist-container">
    <h2>Felhasználók kezelése</h2>

    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Név</th>
          <th>Email</th>
          <th>Szerep</th>
          <th>Műveletek</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>
            <input 
              v-if="editUserId === user.id" 
              v-model="editName" 
              class="input-edit" 
            />
            <span v-else>{{ user.name }}</span>
          </td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button 
              v-if="editUserId === user.id" 
              @click="saveUser(user.id)" 
              class="btn-save"
            >
              Mentés
            </button>
            <button 
              v-else 
              @click="startEdit(user)" 
              class="btn-edit"
            >
              Szerkesztés
            </button>
            <button @click="deleteUser(user.id)" class="btn-delete">Törlés</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])
const editUserId = ref(null)
const editName = ref('')

const token = localStorage.getItem('token')

// Felhasználók lekérése (admin)
const fetchUsers = async () => {
  try {
    const res = await fetch('http://localhost:3300/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) throw new Error("Hiba a felhasználók lekérésekor")
    users.value = await res.json()
  } catch (err) {
    console.error(err)
  }
}

// Szerkesztés indítása
const startEdit = (user) => {
  editUserId.value = user.id
  editName.value = user.name
}

// Mentés (PUT /users/:id)
const saveUser = async (id) => {
  try {
    await fetch(`http://localhost:3300/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name: editName.value })
    })
    editUserId.value = null
    await fetchUsers()
  } catch (err) {
    console.error("Hiba a felhasználó frissítésekor:", err)
  }
}

// Törlés (DELETE /user/:id) ← figyelj, hogy egyes számú!
const deleteUser = async (id) => {
  if (!confirm("Biztosan törlöd a felhasználót?")) return
  try {
    await fetch(`http://localhost:3300/user/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchUsers()
  } catch (err) {
    console.error("Hiba a felhasználó törlésekor:", err)
  }
}

onMounted(fetchUsers)
</script>
