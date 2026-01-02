<template>
  <<header id="header">
   <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
          <a class="navbar-brand d-flex align-items-center" href="#">
            <i class="fa-solid fa-utensils me-2"></i>
            <span class="fw-bold text-info">The Table</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item"><RouterLink class="nav-link" to="/">Főoldal</RouterLink></li>
              <li class="nav-item"><a class="nav-link" href="#about">Rólunk</a></li>
              <li class="nav-item"><a class="nav-link" href="#menu">Étlap</a></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/Reservation">Foglalás</RouterLink></li>
              <li class="nav-item"><a class="nav-link" href="#contact">Kapcsolat</a></li>
              <li class="nav-item"><a class="nav-link" href=""><div>
                <p v-if="isLoggedIn">Be vagy jelentkezve ✅</p>
                <p v-else>Nem vagy bejelentkezve ❌</p>
              </div></a></li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user-circle fa-lg"></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                   <li>
                      <span class="dropdown-item-text small text-muted" v-if="isLoggedIn && me">
                        Bejelentkezve mint: <strong>{{ me.name }}</strong>
                      </span>
                    </li>
                    
                  <li><a class="dropdown-item" href="#">Profil</a></li>
                  <li><a class="dropdown-item" href="#settings">Beállítások</a></li>
                  <li><hr class="dropdown-divider"></li>
                  <li><a class="dropdown-item" href="#logout">Kijelentkezés</a></li>
                  
                </ul>
              </li>
              <li class="nav-item" v-if="!isLoggedIn">
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

  <div id="app">
    <div class="container-fluid">
      <div class="row flex-nowrap">
        <!-- Bal oldali menü -->
        <nav class="col-auto col-md-3 col-xl-2 px-0 sidebar d-none d-md-flex flex-column">
          <div class="d-flex flex-column p-3">
            <div class="text-center mb-4 mt-3">
              <h4 class="text-white">Étterem Foglalás</h4>
              <hr class="text-white">
            </div>
            <ul class="nav nav-pills flex-column mb-auto" id="navTabs">
              <li class="nav-item">
                <a href="#section-nev" class="nav-link active" @click="setActiveTab('section-nev')">
                  <i class="fas fa-user me-2"></i>Profil adatok
                </a>
              </li>
              <li>
                <a href="#section-jelszo" class="nav-link" @click="setActiveTab('section-jelszo')">
                  <i class="fas fa-lock me-2"></i>Jelszó változtatás
                </a>
              </li>
              <li>
                <a href="#section-asztalok" class="nav-link" @click="setActiveTab('section-asztalok')">
                  <i class="fas fa-chair me-2"></i>Aktuális foglalások
                </a>
              </li>
              <li>
                <a href="#section-elozo" class="nav-link" @click="setActiveTab('section-elozo')">
                  <i class="fas fa-history me-2"></i>Előző foglalások
                </a>
              </li>
              <li>
                <a href="#section-uzenetek" class="nav-link" @click="setActiveTab('section-uzenetek')">
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
        <main class="col py-4" style="min-height: calc(100vh - 70px);">
          <div class="card p-4 mx-auto" style="max-width: 900px;">
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
                  <div class="d-flex justify-content-between align-items-start mb-2"  v-for="reservation in reservations.slice().reverse()" :key="reservation.id">
                    
                    <div class="reservation-card container-fluid px-4  w-100 " v-if="reservation.user_id === me.id && new Date(reservation.dtime_from) >= new Date()">
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
                    <button type="button" class="btn btn-primary" data-bs-target="#myModal1" @click="openModal"><i class="fas fa-plus"></i> Új Üzenet</button>
                  <div class="modal fade" id="messageModal" tabindex="-1">
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title">Üzenet küldése</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                      </div>
                      <div class="modal-body">
                        <div class="mb-3">
                          <label class="form-label">Címzett</label>
                          <select class="form-select" >
                            <option value="">Válasszon felhasználót</option>
                            <option readonly>
                              Admin
                            </option>
                          </select>
                        </div>
    
                        <div class="mb-3">
                          <label class="form-label">Üzenet</label>
                          <textarea class="form-control" rows="4" v-model="messageText"></textarea>
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
                <div class="message-item"  v-for="notification in notifications" :key="notification.id">
                  <div class="d-flex align-items-start" v-if="notification.sender_id != me.id">
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
      </div>
    </div>
  </div>

</template>

<script setup>
import { ref, onMounted, computed, watch} from "vue";




const users = ref([]);
const me = ref([]);
const reservations = ref([]);
const messages = ref([]);
const activeTab = ref('section-nev');
const emit = defineEmits(["logged-out"]);
const currentDate = ref('');
const token = ref(localStorage.getItem('token'));
const passwordNew = ref('');
const passwordConfirm = ref('');
const passwordOld = ref('')
const selected = ref(1);
const selectedUser = ref(null);
const notifications = ref([]);
const messageText = ref('');
const showModal = ref(false);


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
      
        // Token érvénytelen, töröljük
        localStorage.removeItem('token');
        token.value = null;
        me.value = null;
        alert("A munkamenet lejárt, kérjük jelentkezz be újra!");
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

onMounted(async()=>{
  await fetchMe();
  await getReservation();
  await getNotification();
  await getUser();
});

const updateUsers = async () => {
  try {
    await fetch(`http://localhost:3300/users/${me.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: me.value.name,
        email : me.value.email,
        phone : me.value.phone
       }),
    });
    alert('Profil adatok sikeresen frissítve!');
  } catch (err) {
    console.error("Nem sikerült frissíteni:", err);
  }
};

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

const updatePassword = async () => {
  try {
    if (!strongPasswordRegex.test(passwordNew.value)) {
        alert('A jelszónak legalább 8 karakterből kell állnia, tartalmaznia kell kis- és nagybetűt, számot és speciális karaktert.')
        return};    
    if (passwordNew.value !== passwordConfirm.value) {
        alert('A két jelszó nem egyezik!');
        return;}
    if (passwordNew.value.length < 8) {
        alert('A jelszónak legalább 8 karakter hosszúnak kell lennie!');
        return;
    }
  
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
    if (!response.ok) {
      throw new Error(`Hiba ${response.status}: ${data.error || 'Ismeretlen hiba'}`)
    }    
    alert('Jelszó sikeresen megváltoztatva!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Nem sikerült frissíteni:", err);
    alert('Hiba történt a jelszó frissítésekor!')
  }
};


const remove = async () => {
  try {
    await fetch(`http://localhost:3300/user/${me.value.id}`, {
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

const cancelReservation = async () => {
  if (confirm('Biztosan le szeretné mondani ezt a foglalást?')){
  try {
    await fetch(`http://localhost:3300/reservation/${reservations.value.id}`, {
      method: "DELETE"
    });alert('Foglalás sikeresen törölve!');
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
  }
}
}

function openModal() {
  const modal = bootstrap.Modal.getOrCreateInstance('#messageModal')
  modal.show()
  showModal.value = true
}


async function messageAdd() {
  if ( !messageText.value.trim()) {
    alert('Kérem tölse ki az összes mezőt!');
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
      alert('Üzenet elküldve!');
      const modal = bootstrap.Modal.getOrCreateInstance('#messageModal')
      modal.hide();
      showModal.value = false;
      selectedUser.value = null
      selectedReservation.value = null
      messageText.value = ''
      await getNotification(); // Frissítjük a listát
    } else {
      alert('Hiba az üzenet küldésekor!');
    }
  } catch (error) {
    console.error('Üzenetküldés hiba:', error);
    alert('Hálózati hiba!');
  }
};



const setActiveTab = (tab) => {
          activeTab.value = tab;
        };        

function selectedReservation(reservation){
  selected.value = reservations;
  reservations.value.id=0;
};

currentDate.value = new Date().toISOString();

const logout = () => {
  localStorage.removeItem("token");
  if (confirm('Biztosan ki szeretne jelentkezni?')) {
            alert('Sikeres kijelentkezés!');}
  emit("logged-out");
      setTimeout(() => {
      window.location.reload();
    }, 1000);
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

const isLoggedIn = computed(() => !!token.value);

</script>


