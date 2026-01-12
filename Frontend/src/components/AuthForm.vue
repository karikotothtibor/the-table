
<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import Footer from '../components/Footer.vue'

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const showPassword = ref(false)
const phone = ref('')
const checkbox = ref(false)
const emit = defineEmits(['logged-in'])
const openningHours = ref([])
const activeTab = ref('login')
const modalRef = ref(null)
const modalMessage = ref('')
const modalType = ref('error')

const token = ref(localStorage.getItem('token'))

const modalShow = (message, type = 'error') => {
  modalMessage.value = message;
  modalType.value = type;

  nextTick(() => {
    if (modalRef.value) {
      const modal = bootstrap.Modal.getOrCreateInstance(modalRef.value);
      modal.show();
    }
  });
};

const login = async (e) => {
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
      modalShow(data.error, 'error');
    }
  } catch (err) {
    console.error(err)
    modalShow('Hiba történt a bejelentkezés során!', 'error');
  }
}

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
});

// ✅ NÉV validáció
const isValidName = computed(() => {
  return name.value && name.value.trim().length >= 2;
});

// ✅ TELEFON validáció (magyar formátum)
const isValidPhone = computed(() => {
  const phoneRegex = /^(\+36|06)[0-9]{9}$/;
  return phone.value && phoneRegex.test(phone.value.replace(/\s/g, ''));
});

const validateEmail = (email) => {
  if (!email) return 'Email megadása kötelező!';
  if (!isValidEmail.value) return 'Érvénytelen email cím!';
  return '';
};

const validateName = () => {
  if (!name?.value.trim()) return 'Név megadása kötelező!';
  if (name.value.trim().length < 2) return 'Név legalább 2 karakter!';
  return '';
};

const validatePhone = () => {
  if (!phone?.value.trim()) return 'Telefon megadása kötelező!';
  const cleanedPhone = phone.value.replace(/\s/g, '');
  const phoneRegex = /^(\+36|06)[0-9]{9}$/;
  if (!phoneRegex.test(cleanedPhone)) return 'Érvénytelen telefonszám (+36 vagy 06)';
  return '';
};

const nameRegex =  /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\s+[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$/
const strongPasswordRegex = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

const register = async () => {
    const isEmailAvailable = await checkEmailAvailability(email.value);

    if (!isEmailAvailable) {
        modalShow('Ez az e-mail cím már foglalt!', 'warning');
        return 
    }

    if (!strongPasswordRegex.test(password.value)) {
    modalShow('A jelszónak legalább 8 karakterből kell állnia, kis- és nagybetűt, számot és speciális karaktert kell tartalmaznia.','warning');
    return
      }
    
    if (password.value !== passwordConfirm.value) {
        modalShow('A két jelszó nem egyezik!', 'warning');
        return;}

    if (!nameRegex.test(name.value?.trim() || '')) {
    modalShow('Adj meg teljes nevet (vezetéknév és keresztnév).', 'warning');
    return
      }
    const nameError = validateName();
        if (nameError) {
          alert(nameError);
          return;
        }
      
    const emailError = validateEmail(email.value);
        if (emailError) {
          alert(emailError);
          return;
        }
      
    const phoneError = validatePhone();
        if (phoneError) {
          alert(phoneError);
          return;
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
    
    const data = await res.json()

     if (!res.ok) {
    modalShow(data.error || 'Hiba történt a regisztráció során!', 'error')
    return
    }

    modalShow('Sikeres regisztráció!', 'success');
    if (data.token) {
      localStorage.setItem('token', data.token)
      emit('logged-in')
      console.log("logged-in");
    } else {
      alert(data.error)
    }
  } catch (err) {
    console.error(err)
    modalShow('Hiba történt a regisztráció során!', 'error');
  }
}

function handleSubmit() {
  if (!checkbox.value) {
    modalShow('Az adatvédelmi feltételek elfogadása kötelező!', 'warning');
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

const isLoggedIn = computed(() => !!token.value)

async function getOpenningHours() {
    try{
     const response = await fetch ("http://localhost:3300/openninghours");
      if (!response.ok) throw new Error ("Nem sikerült nyitvatartási táblát lekérni!");  
      const data = await response.json();
      openningHours.value = data;
      console.log("Nyitvatartási adatok",openningHours.value)
     }catch (error) {
      console.error(error);
      
     }
};

const checkEmailAvailability = async (emailValue) => {
  console.log("Email :",emailValue)
    try {
        const res = await fetch('http://localhost:3300/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailValue })
        });
        const data = await res.json();
        if (data.message === "Az e-mail cím elérhető.") {
            return true; // Az e-mail cím elérhető
        } else {
            modalShow(data.message, 'warning'); // Ha az e-mail már foglalt
            return false;
        }
    } catch (error) {
        console.error("Hiba az e-mail ellenőrzésekor:", error);
        modalShow('Hiba történt az e-mail ellenőrzésekor!', 'error');
        return false;
    }
};
onMounted(async() => {
 await getOpenningHours() 
});

</script>

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
              <li class="nav-item"><RouterLink class="nav-link" to="/">Főoldal</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/#about">Rólunk</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/etlap">Étlap</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/reservation">Foglalás</RouterLink></li>
              <li class="nav-item"><a class="nav-link" href="#contact">Kapcsolat</a></li>
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
          <h1 class="card-title mb-4 mt-4 text-outline">Üdvözlünk a The Table Étteremben!</h1>
          <p class="card-text mb-5 text-outline mt-5">Számos kiemelkedő gasztronómiai élmény vár rád, amit csak törzsvendégeinknek kínálunk. Lépj be a fiókodba, vagy regisztrálj most!</p>
          <ul class="list-unstyled mt-5">
            <li class="mb-3 mt-5 text-outline"><i class="fa-solid fa-utensils me-2 text-outline"></i> Exkluzív kedvezmények gasztronómiai élményeinkre</li>
            <li class="mb-3 text-outline"><i class="fa-solid fa-calendar me-2 text-outline"></i> Előzetes értesítés a különleges eseményekről</li>
            <li class="mb-3 text-outline"><i class="fa-solid fa-gift me-2 text-outline"></i> Rendkivüli kedvezmények rendezvényekre</li>
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
              <button class="nav-link"  :class="{ active: activeTab === 'login' }" type="button" @click="activeTab = 'login'">Bejelentkezés</button>
            </li>
            <li class="nav-item" role="presentation">
              <button class="nav-link" :class="{ active: activeTab === 'register' }" type="button" @click="activeTab = 'register'" >Regisztráció</button>
            </li>
          </ul>
          <div class="tab-content" id="authTabContent">
            <!-- Bejelentkezés -->
             <div class="tab-pane fade " :class="{ show: activeTab === 'login', active: activeTab === 'login' }" id="login" role="tabpanel">
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
                  Még nincs felhasználói fiókod? <a href="#" class="link-info" @click="activeTab = 'register'">Regisztrálj most!</a>
                </div>
              </form>
            </div>
            <!-- Regisztráció -->
           <div class="tab-pane fade" :class="{ show: activeTab === 'register', active: activeTab === 'register' }" id="register" role="tabpanel">
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
                    <input :type="showPassword ? 'text' : 'password'" class="form-control" id="reg-confirm" placeholder="Erősítsd meg a jelszavadat" required v-model ="passwordConfirm">
                    <span class="password-toggle position-absolute  top-50 end-0 me-3" style="cursor:pointer;" @click="togglePasswordVisibility"><i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i></span>
                  </div>
                </div>
                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" id="terms" v-model="checkbox" required>
                  <label class="form-check-label" for="terms">Elfogadom az   <RouterLink to="/adatvedelem"><a href="" target="_blank" class="link-info" rel="noopener noreferrer">Adatvédelmi Szabályzatot</a></RouterLink>, és megismertem az <RouterLink to="/aszf"><a href="" target="_blank" class="link-info" rel="noopener noreferrer">Általános Szerződési Feltételeket</a></RouterLink></label>
                </div>
                <button type="submit" class="btn btn-info w-100 fw-bold" >Regisztráció</button>
                <div class="small text-center mt-3">
                  Már van felhasználói fiókod? <a href="#" class="link-info"  @click="activeTab = 'login'">Jelentkezz be!</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" tabindex="-1" ref="modalRef">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div
        class="modal-header"
        :class="{
          'bg-danger text-white': modalType === 'error',
          'bg-success text-white': modalType === 'success',
          'bg-warning text-dark': modalType === 'warning'
        }"
      >
        <h5 class="modal-title">
          {{
            modalType === 'success'
              ? 'Siker'
              : modalType === 'warning'
              ? 'Figyelmeztetés'
              : 'Hiba'
          }}
        </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        {{ modalMessage }}
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">
          OK
        </button>
      </div>
    </div>
  </div>
</div>

</div>

   <!-- Lábléc -->
    <Footer :openning-hours="openningHours" />  
    
</template>

<style>
  .text-outline {
  text-shadow: 2px 2px 3px rgb(42, 145, 134), -1px -1px 3px rgb(42, 145, 134), 1px -1px 3px rgb(42, 145, 134), -1px 1px 3px rgb(42, 145, 134), 1px 1px 3px rgb(42, 145, 134);
}
</style>
