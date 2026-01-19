<script setup>
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

defineProps({
  me: Object,
  user: Object,
  isLoggedIn: Boolean,
  handleLogout: Function
});


const isDropdownOpen = ref(false);

const isMenuOpen = ref(false);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const handleLogoutLocal = () => {
  props.handleLogout();
};
</script>

<template>
  <header id="header">
    <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top mb-3">
      <div class="container">
        <RouterLink class="navbar-brand d-flex align-items-center" to="/">
          <i class="fa-solid fa-utensils me-2"></i>
          <span class="fw-bold text-info">The Table</span>
        </RouterLink>
        <button class="navbar-toggler" type="button" @click="toggleMenu" aria-expanded="isMenuOpen.toString()">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="mainNav" :class="{'show': isMenuOpen}">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
            <li class="nav-item"><RouterLink class="nav-link" to="/">Főoldal</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/#about">Rólunk</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/etlap">Étlap</RouterLink></li>
            <li class="nav-item"><RouterLink class="nav-link" to="/reservation">Foglalás</RouterLink></li>
            <li class="nav-item"><a class="nav-link" href="#footer">Kapcsolat</a></li>
            
            <!-- Dropdown-->
            <li class="nav-item dropdown">
              <a 
                class="nav-link dropdown-toggle d-flex align-items-center" 
                href="#" 
                id="userDropdown" 
                role="button" 
                @click="toggleDropdown"
                aria-expanded="false"
              >
                <i class="fas fa-user-circle fa-lg"></i>
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow" :class="{'show': isDropdownOpen}" aria-labelledby="userDropdown">
                <li v-if="isLoggedIn && me">
                  <span class="dropdown-item-text small text-muted px-3 py-2 border-bottom">
                    <strong>{{ me.name }}</strong>
                  </span>
                </li>
                <li v-if="isLoggedIn">
                  <RouterLink class="dropdown-item" to="/user">
                    <i class="fas fa-user me-2"></i>Profil
                  </RouterLink>
                  <hr class="dropdown-divider">
                  <a class="dropdown-item text-danger" href="#" @click="handleLogout">
                    <i class="fas fa-sign-out-alt me-2"></i>Kijelentkezés
                  </a>
                </li>
                <li v-else>
                  <RouterLink class="dropdown-item" to="/login">
                    <i class="fas fa-right-to-bracket me-2"></i>Bejelentkezés
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>
