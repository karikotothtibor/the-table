<script setup>
import { ref, onMounted, computed, watch, nextTick} from "vue";
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const users = ref([]);
const me = ref([]);
const reservations = ref([]);
const email = ref('');
const activeTab = ref('section-nev');
const emit = defineEmits(["logged-out"]);
const currentDate = ref('');
const token = ref(localStorage.getItem('token'));
const passwordNew = ref('');
const passwordConfirm = ref('');
const passwordOld = ref('')
const selected = ref(null);
const selectedUser = ref(null);
const notifications = ref([]);
const messageText = ref('');
//const showModal = ref(false);
const modalRef = ref(null);
const modalMessage = ref('');
const modalType = ref('');
const openningHours = ref([]);
const selectedNoti = ref(null);

const modalShow = (message, type = 'error') => {
  modalMessage.value = message;
  modalType.value = type;
  nextTick(() => {
    const instance = bootstrap.Modal.getInstance(modalRef.value)
    const modal = instance || new bootstrap.Modal(modalRef.value, {
      backdrop: 'static', 
      focus: true  
    })
    modal.show()
  })
};

const fetchMe = async () => {
  try {
    const res = await fetch("http://localhost:3300/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    /*if (!res.ok) {
      emit("logged-out");
      return;
    }*/
    if (!res.ok) { 
        localStorage.removeItem('token');
        token.value = null;
        me.value = null;
        modalShow('A munkamenet lejárt, kérjük jelentkezz be újra!', 'error');
        return;
      }
    me.value = await res.json();
    console.log("Me adatok",me.value)
  } catch (err) {
    console.error("Nem sikerült lekérni a profilt:", err);
  }
};

async function getUser() {
    try{
     const res = await fetch ("http://localhost:3300/user");
      if (!res.ok) throw new Error ("Nem sikerült a felhasználót lekérni!");  
      const data = await res.json();
      users.value = data;
      console.log("user adatok",users.value)
     }catch (error) {
      console.error(error);
      users.value = {id:0, name:"", email:""};
     }
};

async function getReservation() {
    try{
     const response = await fetch ("http://localhost:3300/reservation");
      if (!response.ok) throw new Error ("Nem sikerült a rendelést lekérni!");  
      const data = await response.json();
      reservations.value = data;
        console.log("Reservation adatok:",reservations.value);
       }catch (error) {
      console.error(error);
      
     }
};

async function getNotification() {
    try{
     const response = await fetch ("http://localhost:3300/notification");
      if (!response.ok) throw new Error ("Nem sikerült üzenetet lekérni!");  
      const data = await response.json();
      notifications.value = data;
      console.log("Üzenet adatok",notifications.value)
     }catch (error) {
      console.error(error);
      
     }
};

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

onMounted(async()=>{
  await fetchMe();
  await getReservation();
  await getNotification();
  await getUser();
  await getOpenningHours();
});

const isValidEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(me.value.email);
});

// NÉV validáció
const isValidName = computed(() => {
  return me.value.name && me.value.name.trim().length >= 2;
});

// TELEFON validáció 
const isValidPhone = computed(() => {
  const phoneRegex = /^(\+36|06)[0-9]{9}$/;
  return me.value.phone && phoneRegex.test(me.value.phone.replace(/\s/g, ''));
});

const validateEmail = (email) => {
  if (!email) return 'Email megadása kötelező!';
  if (!isValidEmail.value) return 'Érvénytelen email cím!';
  return '';
};

const validateName = () => {
  if (!me.value.name?.trim()) return 'Név megadása kötelező!';
  if (me.value.name.trim().length < 2) return 'Név legalább 2 karakter!';
  return '';
};

const validatePhone = () => {
  if (!me.value.phone?.trim()) return 'Telefon megadása kötelező!';
  const cleanedPhone = me.value.phone.replace(/\s/g, '');
  const phoneRegex = /^(\+36|06)[0-9]{9}$/;
  if (!phoneRegex.test(cleanedPhone)) return 'Érvénytelen telefonszám (+36 vagy 06)';
  return '';
};

const updateUsers = async () => {
  try {

      const nameError = validateName();
        if (nameError) {
          modalShow(nameError);
          return;
        }
      
        const emailError = validateEmail(me.value.email);
        if (emailError) {
          modalShow(emailError);
          return;
        }
      
        const phoneError = validatePhone();
        if (phoneError) {
          modalShow(phoneError);
          return;
        }

    const response = await fetch(`http://localhost:3300/users/${me.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ 
        name: me.value.name,
        email : me.value.email,
        phone : me.value.phone
       }),
    });

    const data = await response.json();

 if (!response.ok) {
      throw new Error(data.error || `Hiba ${response.status}`);
    }

    modalShow('Profil sikeresen frissítve!', 'success');
    setTimeout(() => window.location.reload(), 1500);
  } catch (err) {
    modalShow('Nem sikerült frissíteni a profilt!', 'error');
  }
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

const updatePassword = async () => {
  try {
    if (!strongPasswordRegex.test(passwordNew.value)) {
          modalShow(
          'A jelszónak legalább 8 karakterből kell állnia, kis- és nagybetűvel, számmal és speciális karakterrel.',
          'warning');
        return};    
    if (passwordNew.value !== passwordConfirm.value) {
        modalShow('A két jelszó nem egyezik!', 'warning');
        return;}

    const response = await fetch(`http://localhost:3300/password/${me.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ 
        oldPassword: passwordOld.value,
        newPassword: passwordNew.value 
      }),
    });

     const data = await response.json(); 

    if (!response.ok) {
      throw new Error(`Hiba ${response.status}: ${data.error || 'Ismeretlen hiba'}`)
    }    
    modalShow('Jelszó sikeresen megváltoztatva!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Nem sikerült frissíteni:", err);
    alert('Hiba történt a jelszó frissítésekor!')
    modalShow('Hiba történt a jelszó frissítésekor!', 'error');
  }
};


const remove = async () => {
  try {
    const response = await fetch(`http://localhost:3300/user/${me.value.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
       if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Hiba történt a törlés során');
    }
    modalShow('A felhasználó sikeresen törölve lett!', 'success');
    localStorage.removeItem("token");
    emit("logged-out");
      setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
    modalShow(`Nem sikerült törölni a felhasználót: ${err.message}`, 'error');
  }
};

const cancelReservation = async () => {
  if (confirm('Biztosan le szeretné mondani ezt a foglalást?')){
  try {
    await fetch(`http://localhost:3300/reservation/${selected.value.id}`, {
      method: "DELETE"
    });
    modalShow('Foglalás sikeresen törölve!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
    modalShow('Nem sikerült törölni!', 'error');
  }
};}

async function messageAdd() {
  if ( !messageText.value.trim()) {
    alert('Kérem tölse ki az összes mezőt!', 'warning');
    return;
  }

  try {
    const response = await fetch("http://localhost:3300/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: 5,
        reservation_id: 1,
        message: messageText.value.trim(),
        status: "ELKULDVE",
        sender_id: me.value.id
      })
    });

    if (response.ok) {
      const modalEl = document.getElementById('messageModal')
      const modal = bootstrap.Modal.getInstance(modalEl)

            modalEl.addEventListener(
        'hidden.bs.modal',
        () => {
          modalShow('Üzenet elküldve!', 'success')
        },
        { once: true }
      )

      modal?.hide();

      selectedUser.value = null
      selected.value = null
      messageText.value = ''
      await getNotification(); // Frissítjük a listát
    } else {
      modalShow('Hiba az üzenet küldésekor!', 'error');
    }
  } catch (error) {
    console.error('Üzenetküldés hiba:', error);
    modalShow('Hálozati hiba!', 'error');;
  }
};

const setActiveTab = (tab) => {
          activeTab.value = tab;
        };        

function selectedReservation(reservation){
  selected.value = reservation;
  console.log(selected.value.id)
};

currentDate.value = new Date().toISOString();

const logout = () => {
  localStorage.removeItem("token");
  if (confirm('Biztosan ki szeretne jelentkezni?')) {
            modalShow('Sikeres kijelentkezés!');}
  emit("logged-out");
      setTimeout(() => {
      window.location.reload();
    }, 1500);
};

watch(token, (newToken) => {
  if (newToken) {
    localStorage.setItem('token', newToken)
    fetchMe(); // Automatikusan lekérjük a user adatokat token változásakor
  } else {
    localStorage.removeItem('token')
    me.value = null;
  }
})

function selectedNotification(notification){
  selectedNoti.value = notification;
  console.log(selectedNoti.value.id)
};

const deleteNotification = async () => {
  if (confirm('Biztosan ki szeretné törölni az üzenetet?')){
  try {
    await fetch(`http://localhost:3300/notification/${selectedNoti.value.id}`, {
      method: "DELETE"
    });
    modalShow('Az üzenet sikeresen törölve!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Nem sikerült törölni az üzenetet:", err);
    modalShow('Hiba az üzenet törlése során!', 'error');
  }
};}

const isLoggedIn = computed(() => !!token.value);

const handleLogout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false;
  token.value = null;
  modalShow('Kijelentkeztél!', 'succes');
};
</script>

<template>
<Header 
    :me="me"
    :user="users" 
    :is-logged-in="isLoggedIn" 
    :handle-logout="handleLogout"
  />

   <div id="app">
    <div class="container-fluid mt-5 p-0">
      <div class="d-flex flex-column flex-md-row min-vh-100">
        <!-- Bal oldali menü -->
        <nav class="sidebar bg-dark text-white
                w-100 
                d-flex flex-row flex-md-column
                p-3">
          <div class="d-none d-md-block text-center my-3">
            <div class="text-center mb-4 mt-3">
              <h4 class="text-white text-center d-none d-md-block">Étterem Foglalás</h4>
              <hr class="text-white">
            </div>
            <ul class="nav nav-pills
                  flex-row flex-md-column
                  justify-content-around
                  w-100 mt-3"
                  id="navTabs">
              <li class="nav-item">
                <a href="#section-nev" class="nav-link" :class="{ active: activeTab === 'section-nev' }" @click="setActiveTab('section-nev')">
                  <i class="fas fa-user me-2"></i>Profil adatok
                </a>
              </li>
              <li class="nav-item">
                <a href="#section-jelszo" class="nav-link" :class="{ active: activeTab === 'section-jelszo' }"  @click="setActiveTab('section-jelszo')">
                  <i class="fas fa-lock me-2"></i>Jelszó változtatás
                </a>
              </li>
              <li class="nav-item">
                <a href="#section-asztalok" class="nav-link" :class="{ active: activeTab === 'section-asztalok' }" @click="setActiveTab('section-asztalok')">
                  <i class="fas fa-chair me-2"></i>Aktuális foglalások
                </a>
              </li>
              <li class="nav-item">
                <a href="#section-elozo" class="nav-link" :class="{ active: activeTab === 'section-elozo' }"  @click="setActiveTab('section-elozo')">
                  <i class="fas fa-history me-2"></i>Előző foglalások
                </a>
              </li>
              <li class="nav-item">
                <a href="#section-uzenetek" class="nav-link" :class="{ active: activeTab === 'section-uzenetek' }" @click="setActiveTab('section-uzenetek')">
                  <i class="fas fa-envelope me-2"></i>Üzenetek
                </a>
              </li>
            </ul>
           


            <div class="login-btn" v-if="!isLoggedIn || !me">
              <RouterLink to="/Login"><button class="btn btn-info w-100" >
                <i class="fas fa-sign-in-alt me-2"></i>Bejelentkezés
              </button></RouterLink>
            </div>


            <div class="Remove-btn">
              <button class="btn btn-danger w-100" @click="remove">
                <i class="fa-chisel fa-regular fa-xmark me-2"></i>Fiók Törlése
              </button>
            </div>



            <!-- Kijelentkezés gomb -->
            <div class="logout-btn">
              <button class="btn btn-warning w-100" @click="logout">
                <i class="fas fa-sign-out-alt me-2"></i>Kijelentkezés
              </button>
            </div>
          </div>
        </nav>

        <!-- Fő tartalom -->
        <main class="flex-fill bg-light py-4 px-3 overflow-auto" style="min-height: calc(100vh - 70px);">
         <div class="card p-4 mx-auto flex-grow-1" style="max-width: 900px;">
            
            <!-- Profil fejléc -->
            <div class="user-info text-center">
              <div class="profile-icon mb-2">
                <i class="fas fa-user"></i>
              </div v-if="isLoggedIn || me">
              <h3 class="fw-bold mb-0" >{{ me.name }}</h3>
              <small>{{ me.email }}</small>
            </div>

            <!-- Tab tartalom -->
            <div class="tab-content" id="profileTabContent">
              <!-- Név szekció -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'section-nev' }" id="section-nev" role="tabpanel">
                <h4 class="mb-4">Profil adatok szerkesztése</h4>
                <form @submit.prevent="updateUsers" class="mb-3">
                  <div class="mb-3">
                    <label for="nevInput" class="form-label">Teljes név</label>
                    <input type="text" class="form-control" id="nevInput" v-model="me.name" />
                  </div>
                  <div class="mb-3">
                    <label for="emailInput" class="form-label">E-mail cím</label>
                    <input type="email" class="form-control" id="emailInput" v-model="me.email" />
                  </div>
                  <div class="mb-3">
                    <label for="phoneInput" class="form-label">Telefonszám</label>
                    <input type="phone" class="form-control" id="phoneInput" v-model="me.phone" />
                  </div>
                  <button type="submit" class="btn btn-primary">Módosítások mentése</button>
                </form>
              </div>

              <!-- Jelszó változtatás -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'section-jelszo' }" id="section-jelszo" role="tabpanel">
                <h4 class="mb-4">Jelszó változtatás</h4>
                <form @submit.prevent="updatePassword">
                  <div class="mb-3">
                    <label for="oldPassword" class="form-label">Jelenlegi jelszó</label>
                    <input type="password" class="form-control" id="oldPassword" v-model="passwordOld" required />
                  </div>
                  <div class="mb-3">
                    <label for="newPassword" class="form-label">Új jelszó</label>
                    <input type="password" class="form-control" id="newPassword" v-model="passwordNew" required />
                  </div>
                  <div class="mb-3">
                    <label for="confirmPassword" class="form-label">Új jelszó mégegyszer</label>
                    <input type="password" class="form-control" id="confirmPassword" v-model="passwordConfirm" required />
                  </div>
                  <button class="btn btn-primary" type="submit">Jelszó módosítása</button>
                </form>
              </div>

              <!-- Asztal foglalások -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'section-asztalok' }" id="section-asztalok" role="tabpanel" >
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h4 class="mb-0">Aktuális foglalások</h4>
                  <RouterLink to="/Reservation"><button class="btn btn-outline-primary" >
                    <i class="fas fa-plus me-2"></i>Új foglalás
                  </button></RouterLink>
                </div>
                
                <div v-if="!me || !me.id || !reservations || reservations.length === 0" class="text-center py-4">
                  <i class="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <p class="text-muted">Nincsenek aktív foglalások</p>
                </div>
                <div v-else class="reservation-card overflow-auto w-100 " >
                  <div class="d-flex justify-content-between align-items-start mb-2"  v-for="reservation in reservations.slice().reverse()" :key="reservation.id" >
                    
                    <div class="reservation-card container-fluid px-4  w-100 " v-if="reservation.user_id === me.id && new Date(reservation.dtime_from) >= new Date()" @click="selectedReservation(reservation)">
                      <h5 class="mb-1" >{{ reservation.table }}</h5>
                      <p class="mb-1 text-muted" >{{reservation.dtime_from.split("T")[0]}}  {{  reservation.dtime_from.split("T")[1].split('.')[0].slice(0, -3)}}</p>
                      <p class="mb-1" >Létszám: {{ reservation.number_of_customers }} fő</p>
                      <span class="status-badge badge-success" >Aktív</span>
                      <div>
                       <button class="btn btn-sm btn-danger" @click="selectedReservation(reservation); cancelReservation()">
                      <i class="fas fa-times me-1"></i> Lemondás
                      </button>
                      </div>
                    </div> 
                  </div>
                </div>
              </div>
              <!-- Előző foglalások -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'section-elozo' }" id="section-elozo" role="tabpanel">
                <h4 class="mb-4">Előző foglalások</h4>
                
                <div  class="reservation-card overflow-auto " style="height: 20rem;">
                  <div class="d-flex justify-content-between align-items-start mb-2" v-for="reservation in reservations">
                    <div v-if="reservation.user_id === me.id && currentDate >= reservation.dtime_from">
                      <h5 class="mb-1">{{ reservation.table }}</h5>
                      <p class="mb-1 text-muted">{{reservation.dtime_from.split("T")[0]}}  {{  reservation.dtime_from.split("T")[1].split('.')[0].slice(0, -3)}}</p>
                      <p class="mb-1">Létszám: {{ reservation.number_of_customers }} fő</p>
                      <span class="status-badge badge-warning">Lejárt</span>
                    </div>
                  </div>
                
                
                <div v-if="reservations?.value?.length === 0 || !me.id" class="text-center py-4">
                  <i class="fas fa-history fa-3x text-muted mb-3"></i>
                  <p class="text-muted">Még nincsenek korábbi foglalások</p>
                </div>
              </div>
              </div>
              <!-- Üzenetek -->
              <div class="tab-pane fade" :class="{ 'show active': activeTab === 'section-uzenetek' }" id="section-uzenetek" role="tabpanel">
                 <div class="card-header d-flex justify-content-between align-items-center">
                    <h2 class="card-title mb-0">Üzenetek és értesitések</h2>
                    <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#messageModal" @click="openModal"><i class="fas fa-plus"></i> Új Üzenet</button>
                  <div class="modal fade" id="messageModal" tabindex="-1">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Üzenet küldése</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
                        <div class="mb-3">
                          <label for="reciver" class="form-label">Címzett</label>
                          <select id="reciver" class="form-select" >
                            <option value="">Válasszon felhasználót</option>
                            <option readonly>
                              Admin
                            </option>
                          </select>
                        </div>
    
                        <div class="mb-3">
                          <label for="message" class="form-label">Üzenet</label>
                          <textarea id="message" class="form-control" rows="4" v-model="messageText"></textarea>
                        </div>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                          Mégse
                        </button>
                        <button type="button" class="btn btn-primary" @click="messageAdd">
                          Küldés
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                <div class="message-item"  v-for="notification in notifications" :key="notification.id" @click.stop="selectedNotification(notification)">
                  <div class="d-flex align-items-start" v-if="notification.user_id === me.id">
                    <!--<div class="text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width:40px; height:40px;"  >
                      <i class="fas fa-user"></i> 
                    </div>-->
                    <div class="flex-grow-1" >
                      <div v-for="(user, index) in users" :key="index">
                      <div class="d-flex justify-content-between align-items-center mb-1" >
                        <h6 class="text-muted" v-if="notification.sender_id === user.id && user.id != me.id" >{{ user.name }}</h6>
              
                        <p class="mb-1 mx-3 small text-muted" v-if="notification.sender_id === user.id && user.id != me.id">{{ notification.message }}</p>
                            
                        <span v-for="reservation in reservations" :key="reservation.id">
                        <p class="mb-1 small text-muted" v-if="notification.reservation_id === reservation.id && notification.sender_id === user.id" >Foglalási idő:{{reservation.dtime_from.split("T")[0]}}  {{  reservation.dtime_from.split("T")[1].split('.')[0].slice(0, -3)}}</p>
                        </span>
                        <button class="btn btn-outline-secondary btn-sm" v-if="notification.sender_id === user.id && user.id != me.id" @click.prevent="deleteNotification()"><i class="fas fa-trash"></i></button>
                        
                      </div> 
                      </div>
                    </div>
                  </div>
                </div>
                  <div v-if="!notifications.length || !me.id " class="text-center py-4">
                  <i class="fas fa-envelope-open fa-3x text-muted mb-3"></i>
                  <p class="text-muted">Nincsenek üzenetek</p>
                </div>
              </div>
            </div>
          </div>
        </main>
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
                  modalType === 'success' ? 'Siker' :
                  modalType === 'warning' ? 'Figyelmeztetés' :
                  'Hiba'
                }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
          
            <div class="modal-body">
              <p class="mb-0">{{ modalMessage }}</p>
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
    </div>
  </div>
<Footer :openning-hours="openningHours" />
</template>
<style scoped>
  @media (min-width: 768px) {
  .sidebar {
    width: 260px !important;  /* ideális sidebar méret */
    flex-shrink: 0 !important;
  }
}
@media (max-width: 767px) {
  .sidebar {
    flex-wrap: wrap ;   /* engedje törni a sort */
    width: 100% ; /* teljes szélesség a mobil képernyőn */
    position: relative ;
    z-index: 100 !important;
  }

  .sidebar .nav {
    /*flex-wrap: wrap ;*/
    display: flex ; /* egy sorba rendezzük a menüpontokat */
    flex-direction: column ; /* függőleges elrendezés */
    width: 100% ;
    padding: 0 ;
    margin: 0 ;
  }

  .sidebar .nav-link {
    font-size: 1rem ;
    padding: 0.75rem 1rem ;
    white-space: nowrap ;
    text-align: center ;
    z-index: 120 !important;
  }
  .sidebar .nav-link.active {
    background-color: #007bff ; /* aktív menüpont szín */
  }
}
</style>
