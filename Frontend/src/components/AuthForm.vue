<template>
      <!-- </transition> -->
<header class="header">
      <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <i class="fa-solid fa-utensils me-2"></i>
            <span class="fw-bold text-info">The Table</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto mb-3 mb-lg-0">
              <li class="nav-item"><RouterLink class="nav-link" href="#home" to="/">Főoldal</RouterLink></li>
              <li class="nav-item"><a class="nav-link" href="#about">Rólunk</a></li>
              <li class="nav-item"><a class="nav-link" href="#menu">Étlap</a></li>
              <li class="nav-item"><a class="nav-link" href="#reservation">Foglalás</a></li>
              <li class="nav-item"><a class="nav-link" href="#contact">Kapcsolat</a></li>
              <li class="nav-item"><a class="nav-link" href=""><div>
                <p v-if="isLoggedIn">Be vagy jelentkezve ✅</p>
                <p v-else>Nem vagy bejelentkezve ❌</p>
              </div></a></li>
              <li class="nav-item dropdown" v-if="isLoggedIn">
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              <i class="fa-solid fa-user-circle fa-lg me-1"></i>
              <span class="small">Profil</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li>
                <span class="dropdown-item-text small text-muted">
                  Bejelentkezve
                </span>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <RouterLink class="dropdown-item" to="/user">
                  <i class="fa-solid fa-user me-2"></i>Profilom
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/reservation">
                  <i class="fa-solid fa-calendar-check me-2"></i>Foglalásaim
                </RouterLink>
              </li>
              <li>
                <RouterLink class="dropdown-item" to="/#reviews">
                  <i class="fa-solid fa-star me-2"></i>Értékeléseim
                </RouterLink>
              </li>
              <li><hr class="dropdown-divider"></li>
              <li>
                <button class="dropdown-item text-danger" @click="handleLogout">
                  <i class="fa-solid fa-right-from-bracket me-2"></i>Kijelentkezés
                </button>
              </li>
            </ul>
          </li>
          
          <!-- Bejelentkezés gomb ha nincs bejelentkezve -->
          <li class="nav-item" v-else>
            <RouterLink class="nav-link" to="/login">
              <i class="fa-solid fa-right-to-bracket me-1"></i>
              Bejelentkezés
            </RouterLink>
          </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    
    <!-- Fő tartalom -->
<div class="container py-5">
  <div class="row g-4 d-flex justify-content-center mt-5 " >
    <div class="col-lg-5 ">
      <!-- Üdvözlő kártya -->
      <div class="card bg-info text-white border-0 h-100 overflow-auto">
        <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" class="card-img" alt="étterem" style="opacity: .25;">
        <div class="card-img-overlay flex-column justify-content-center ">
          <h1 class="card-title mb-4 mt-4">Üdvözlünk a The Table Étteremben!</h1>
          <p class="card-text mb-4">Számos kiemelkedő gasztronómiai élmény vár rád, amit csak törzsvendégeinknek kínálunk. Lépj be a fiókodba, vagy regisztrálj most!</p>
          <ul class="list-unstyled">
            <li class="mb-3 mt-5"><i class="fa-solid fa-utensils me-2"></i> Exkluzív kedvezmények gasztronómiai élményeinkre</li>
            <li class="mb-3 "><i class="fa-solid fa-calendar me-2"></i> Előzetes értesítés a különleges eseményekről</li>
            <li class="mb-3"><i class="fa-solid fa-gift me-2"></i> Felkészíthető ajándékkártya és kedvezmények</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="col-lg-5">
      <!-- Tabok + űrlapok -->
      <div class="card shadow-lg rounded-4">
        <div class="card-body">
          <ul class="nav nav-tabs nav-justified mb-4" id="authTab" role="tablist">
            <li class="nav-item" role="presentation">
              <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button">Bejelentkezés</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button">Regisztráció</button>
            </li>
          </ul>
          <div class="tab-content" id="authTabContent">
            <!-- Bejelentkezés -->
            <div class="tab-pane fade show active" id="login" role="tabpanel">
              <form autocomplete="off">
                <div class="mb-3">
                  <label for="email-login" class="form-label" >Email cím</label>
                  <input type="email" class="form-control" id="email-login" placeholder="email@example.com" required v-model="email">
                </div>
                <div class="mb-3 position-relative ">
                  <label for="password-login" class="form-label">Jelszó</label>
                  <input :type="showPassword ? 'text' : 'password'" class="form-control" id="password-login" placeholder="Írd be a jelszavad" required v-model="password">
                  <span class="password-toggle position-absolute top-50 end-0 justify-content-center me-3 " style="cursor:pointer;" @click="togglePasswordVisibility"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></span>
                </div>
                <div class="mb-2 text-end">
                  <a href="#" class="link-info small">Elfelejtetted a jelszavad?</a>
                </div>
                <button type="submit" class="btn btn-info w-100 fw-bold"  @click.prevent="login">Bejelentkezés</button>
                
                <div class="text-center mt-4 mb-2 text-info">Vagy jelentkezz be másképp</div>
                <div class="d-flex justify-content-center gap-3 mb-3">
                  <a href="#" class="btn btn-outline-secondary rounded-circle"><i class="fab fa-google"></i></a>
                  <a href="#" class="btn btn-outline-secondary rounded-circle"><i class="fab fa-facebook-f"></i></a>
                  <a href="#" class="btn btn-outline-secondary rounded-circle"><i class="fab fa-twitter"></i></a>
                </div>
                <div class="small text-center">
                  Még nincs felhasználói fiókod? <a href="#" class="link-info" data-bs-toggle="tab" data-bs-target="#register">Regisztrálj most!</a>
                </div>
              </form>
            </div>
            <!-- Regisztráció -->
            <div class="tab-pane fade" id="register" role="tabpanel">
              <form autocomplete="off" @submit.prevent="handleSubmit">
                <div class="row gx-2">
                  <div class="col-12 mb-3">
                    <label for="reg-name" class="form-label">Teljes név</label>
                    <input type="text" class="form-control" id="reg-name" placeholder="Gipsz Jakab" required v-model="name">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="reg-tel" class="form-label">Telefonszám</label>
                    <input type="tel" class="form-control" id="reg-tel" placeholder="06-30/1234-567" required v-model="phone">
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="reg-email" class="form-label">Email cím</label>
                    <input type="email" class="form-control" id="reg-email" placeholder="email@example.com" required v-model="email">
                  </div>
                  <div class="col-md-6 mb-3 position-relative">
                    <label for="reg-password" class="form-label">Jelszó</label>
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="reg-password" placeholder="Legalább 8 karakter" required v-model="password">
                    <span class="password-toggle position-absolute top-50 end-0 me-3" style="cursor:pointer;" @click="togglePasswordVisibility"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></span>
                  </div>
                  <div class="col-md-6 mb-3 position-relative">
                    <label for="reg-confirm" class="form-label">Jelszó megerősítése</label>
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="reg-confirm" placeholder="Erősítsd meg a jelszavadat" required v-model ="passwordconfirm">
                    <span class="password-toggle position-absolute  top-50 end-0 me-3" style="cursor:pointer;" @click="togglePasswordVisibility"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></span>
                  </div>
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="terms" v-model="checkbox" required>
                  <label class="form-check-label" for="terms">Elfogadom az <a href="#" class="link-info">adatkezelési szabályzatot</a>, és megismertem az <a href="#" class="link-info">általános szerződési feltételeket</a></label>
                </div>
                <button type="submit" class="btn btn-info w-100 fw-bold"  >Regisztráció</button>
                <div class="small text-center mt-3">
                  Már van felhasználói fiókod? <a href="#" class="link-info" data-bs-toggle="tab" data-bs-target="#login">Jelentkezz be!</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

   <!-- Lábléc -->
   <footer class="bg-info text-white py-5">
      <div class="container text-center">
        <div class="mb-3">
          <i class="fa-solid fa-utensils fa-2x"></i>
          <span class="h4 ms-2 fw-bold">The Table</span>
        </div>
        <nav class="mb-3">
          <a href="#home" class="text-white mx-2">Főoldal</a>
          <a href="#about" class="text-white mx-2">Rólunk</a>
          <a href="#menu" class="text-white mx-2">Étlap</a>
          <a href="#reservation" class="text-white mx-2">Asztalfoglalás</a>
          <a href="#contact" class="text-white mx-2">Kapcsolat</a>
        </nav>
        <div class="mb-3">
          <a href="#" class="text-white mx-1"><i class="fab fa-facebook-f"></i></a>
          <a href="#" class="text-white mx-1"><i class="fab fa-instagram"></i></a>
          <a href="#" class="text-white mx-1"><i class="fab fa-tripadvisor"></i></a>
          <a href="#" class="text-white mx-1"><i class="fab fa-twitter"></i></a>
        </div>
        <div class="small">&copy; 2004-2023 Minden jog fenntartva The Table étterem</div>
        <div class="container mt-4">
          <div class="row justify-content-center">
            <div class="col-auto">
              <h5 class="fw-bold">Nyitvatartás</h5>
              <ul class="list-unstyled">
                <li>Hétfő: 11:00 - 22:00</li>
                <li>Kedd: 11:00 - 22:00</li>
                <li>... stb.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { RouterLink } from 'vue-router'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordconfirm = ref('')
const showPassword = ref(false)
const phone = ref('')
const checkbox = ref(false)
const emit = defineEmits(['logged-in'])

const token = ref(localStorage.getItem('token'))

const login = async () => {
  e?.preventDefault()
  try {
    const res = await fetch('http://localhost:3300/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: email.value, 
        password: password.value
      })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      token.value = data.token
      emit('logged-in')
      console.log("Bejelentkezve")
    } else {
      alert(data.error)
    }
  } catch (err) {
    console.error(err)
    alert('Hiba a bejelentkezés során')
  }
}

const nameRegex =  /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\s+[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$/
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

const register = async () => {
  if (!strongPasswordRegex.test(password.value)){
    alert('A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert.')
    return
  }

  if (!nameRegex.test(name.value?.trim() || '')){
    alert('Adj meg teljes nevet (vezetéknév és keresztnév.)')
    return
  }

  try {
    const res = await fetch('http://localhost:3300/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value,
        phone: phone.value
      })
    })
    alert("Sikeres regisztráció!")
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('token', data.token)
      emit('logged-in')
      console.log("logged-in")
    } else {
      alert(data.error)
    }
  } catch (err) {
    console.error(err)
    alert('Hiba a regisztráció során')
  }
}

function handleSubmit() {
  if (!checkbox.value) {
    alert('Kérlek pipáld ki a checkboxot!')
    return
  }
  register()
}

watch(token, (newToken) => {
  if (newToken) {
    localStorage.setItem('token', newToken)
  } else {
    localStorage.removeItem('token')
  }
})

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
}

const isLoggedIn = computed(() => !!tokenn.value)

</script>
