<script setup>
import { onMounted, ref, computed,watch } from 'vue';
import { RouterLink } from 'vue-router';
import { VueCal } from 'vue-cal';
import 'vue-cal/style';
import { useRouter } from 'vue-router';


const router = useRouter();
const messageText = ref('');
const users = ref([]);
const userSelected = ref(null);
const table = ref([]);
const status = ref([]);
const reservations = ref([]);
const tabstatus = ref("szabad");
const date = ref('');
const time = ref('');
const timeOffSet= ref('');
const currentDate = ref('');
const currentTime = ref('');
const currentDateTime = ref('');
const currentDateCut = ref(new Date);
const notifications = ref([]);
const me = ref(null);
const events = ref([]);
const emit = defineEmits(['loggedOut']);
const selected = ref(null);
const selectedUser = ref(null);
const selectedHour = ref(null);
const selectedRes = ref(null);
const selectedResForMessage = ref(null);
const showModal = ref(false);
const openningHours = ref([]);

const isLoggedIn = ref(!!localStorage.getItem('token'));

async function getUser() {
    try{
     const res = await fetch ("http://localhost:3300/user");
      if (!res.ok) throw new Error ("Nem sikerült a felhasználót lekérni!");  
      const data = await res.json();
      users.value = data;
     }catch (error) {
      console.error(error);
      users.value = {id:0, name:"", email:""};
     }
};

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
    me.value = await res.json();
    console.log("Users adatok",me.value,me.value.role)
  } catch (err) {
    console.error("Nem sikerült lekérni a profilt:", err);
  }
};

async function getTable() {
    try{
     const response = await fetch ("http://localhost:3300/table");
      if (!response.ok) throw new Error ("Nem sikerült a asztalt lekérni!");  
      const data = await response.json();
      table.value = data;
     }catch (error) {
      console.error(error);
      
     }
};

async function getStatus() {
    try{
     const response = await fetch ("http://localhost:3300/status");
      if (!response.ok) throw new Error ("Nem sikerült a asztalt lekérni!");  
      const data = await response.json();
      status.value = data;
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

async function getTableStatus() {
    try{
     const response = await fetch ("http://localhost:3300/tablestatus");
      if (!response.ok) throw new Error ("Nem sikerült a asztalt státuszát lekérni!");  
      const data = await response.json();
      tabstatus.value = data;
     }catch (error) {
      console.error(error);
      
     }
};

async function getReservation() {
    try{
     const response = await fetch ("http://localhost:3300/reservation");
      if (!response.ok) throw new Error ("Nem sikerült a rendelést lekérni!");  
      const data = await response.json();
      reservations.value = data.reverse();
        console.log("Reservation adatok:",reservations.value);

        const event = [];
        
        for (let i = 0; i < data.length; i++) {
          const foglalas = data[i];

          if (foglalas.dtime_from && foglalas.dtime_to) {
          event.push({
            start: new Date(foglalas.dtime_from),
            end: new Date(foglalas.dtime_to),
            title: `Asztal ${foglalas.table_id}`,
            class: "Reservation",
          })
        }}
        // 5. Átadás a vue-cal számára
        events.value = event;
        console.log("Events adatok",events.value)
     }catch (error) {
      console.error(error);
      
     }
};

function selectedReservation(reservation){
  selectedRes.value = reservation;
  selectedRes.value.user_id = reservation.user_id;
  selectedRes.value.id = reservation.id;
 //reservations.value.id=0;
 console.log(selectedRes.value.id, selectedRes.value.user_id, selectedRes.value.id)
};

const cancelReservation = async () => {
  if (confirm('Biztosan le szeretné mondani ezt a foglalást?')){
  try {
    await fetch(`http://localhost:3300/reservation/${selectedRes.value.id}`, {
      method: "DELETE"
    });alert('Foglalás sikeresen törölve!');

    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
  }
};}



const formData = defineModel({
  default:{
    capacity:0,
    user_id : 0,
    reservation_id: 0,
    table_id: 0,
    status_id: 0,
    dtime_from: "",
    dtime_to: "",
    number_of_customers: 0,
    guest_name:"",
    day_of_week:'',
    open_time: 0,
    close_time: 0,
  }
});


const sumSzabad = () => {
  return tabstatus.value.filter(t => !t.reservation || t.reservation.length === 0).length;
};

const sumFoglalt = () => {
  return tabstatus.value.filter(t => t.reservation?.length > 0).length;
};

function selectedOpeningHours(openningHour){
  selectedHour.value = openningHour;
  selectedHour.value.id = openningHour.id;
 console.log(selectedHour.value.id , selectedHour.value.id)
};

function openingHoursAdd() {
    fetch("http://localhost:3300/openninghours",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day_of_week: formData.value.day_of_week,
        open_time: Number(formData.value.open_time),
        close_time: Number(formData.value.close_time)
    })
  })
  setTimeout(() => {
      window.location.reload();
    }, 1000);
};

const deleteOpeningHours = async () => {
  if (confirm('Biztosan ki szeretné törölni a nyitvatartási időt?')){
  try {
    await fetch(`http://localhost:3300/openninghours/${selectedHour.value.id}`, {
      method: "DELETE"
    });alert('Sikeresen törölve!');

    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
  }
};}

function openningHoursUpdate(){
  fetch ("http://localhost:3300/openninghours",{
    method: "PUT",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: selectedHour.value.id,
        day_of_week: selectedHour.value.day_of_week,
        open_time: formData.value.open_time,
        close_time: formData.value.close_time
  })
  }
)};

const userReservations = computed(() => {
  if (!selectedUser.value) return [];
  return reservations.value.filter(
    res => res.user_id === selectedUser.value.id
  );
});

// Modal megnyitása
function openModal() {
  const modal = bootstrap.Modal.getOrCreateInstance('#messageModal')
  modal.show()
  showModal.value = true
}

const openMessageModal = (reservation) => {
  // user objektum a users listából
  const user = users.value.find(u => u.id === reservation.user_id) || null
  selectedUser.value = user
  selectedResForMessage.value = reservation
  messageText.value = ''
}

function openHoursModal() {
  const modal = bootstrap.Modal.getOrCreateInstance('#editHoursModal')
  modal.show()
  showModal.value = true
}

function openUpdateHoursModal() {
  const modal = bootstrap.Modal.getOrCreateInstance('#updateHoursModal')
  modal.show()
  showModal.value = true
}

async function messageAdd() {
  if (!selectedUser.value || !selectedResForMessage.value || !messageText.value.trim()) {
    alert('Kérem tölje ki az összes mezőt!');
    return;
  }

  try {
    const response = await fetch("http://localhost:3300/notification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: selectedUser.value.id,
        reservation_id: selectedResForMessage.value.id,
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
      selectedRes.value = null
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

const nameRegex = /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\s+[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$/

function reservationAdd() {
  if (!nameRegex.test(formData.value.guest_name?.trim() || '')) {
    alert('Adj meg teljes nevet (vezetéknév és keresztnév).')
    return
  }
  if(!date.value || !time.value){
    alert("A dátum és időmegadása megadása kötelező");
    return;
  }
    if(!timeOffSet.value){
    alert("A foglalás várható időtartam megadása kötelező");
    return;
  }
      if(!formData.value.number_of_customers){
    alert("A vendégek számának megadása kötelező");
    return;
  }

    fetch("http://localhost:3300/reservationadd", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
        user_id: 1,
        table_id: formData.value.table_id,
        status_id: 2,
        dtime_from: formData.value.dtime_from,
        dtime_to: formData.value.dtime_to,
        number_of_customers: formData.value.number_of_customers,
        guest_name: formData.value.guest_name
    })
  })
  alert("✅ Sikeres foglalás! Köszönjük, hogy minket választott!");


    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
};

onMounted(async()=>{
  await getUser();
  await fetchMe()
  if (me.value?.role !== 'ADMIN') {
  router.replace('/')};
  await getReservation();
  await getTable();
  await getStatus();
  await getTableStatus();
  await getNotification();
  await getOpenningHours();
});

function tableAdd() {
    fetch("http://localhost:3300/tableadd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        capacity: formData.value.capacity,
    })
  })
};

function tableUpdate(){
  fetch ("http://localhost:3300/table",{
    method: "PUT",
    headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: formData.value.table_id,
        capacity: formData.value.capacity,
  })
  }
)};

function selectedTable(tables){
  selected.value = tables;
  formData.value.table_id=tables.id;
  console.log(formData.value.table_id, selected)
  alert("Asztal kiválasztva!")
};

const deleteTable = async () => {
    if (!formData.value.table_id) {
    alert('Először válasszon ki egy asztalt!');
    return;
  }
  if (confirm('Biztosan ki szeretné törölni ezt az asztalt?')){
  try {
    await fetch(`http://localhost:3300/table/${formData.value.table_id}`, {
      method: "DELETE"
    });alert('Asztal sikeresen törölve!');
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
  }
};}

currentDate.value = new Date();
currentTime.value = new Date().toLocaleTimeString('hu-HU', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
});

currentDateTime.value = `${currentDate.value} ${currentTime.value}`;
console.log(currentDateTime);

currentDate.value = new Date();
currentDateCut.value = new Date().toISOString().split("T")[0];
console.log( currentDateCut.value);

const logout = () => {
  localStorage.removeItem("token");
  if (confirm('Biztosan ki szeretne jelentkezni?')) {
            alert('Sikeres kijelentkezés!');}
  emit("logged-out");
      setTimeout(() => {
      window.location.reload();
    }, 1000);
};

const dtime_from = computed(() => {
  const result = `${date.value}T${time.value}:00`;
  // Automatikusan beállítjuk a formData-ba is
  formData.value.dtime_from = result;
  return result;
})

const dateTimeOffset = computed(() => {
  const [t,tp] = time.value.split(':').map(Number);
  const [ts,tsp] = timeOffSet.value.split(':').map(Number);
  const newHours = (t + ts) % 24
  const minutes = (tp + tsp)
  const formattedHours = newHours.toString().padStart(2, '0')
  const formattedMinutes = minutes.toString().padStart(2, '0')
  return `${formattedHours}:${formattedMinutes}`
})

const dtime_to = computed(() => {
   const result = `${date.value}T${dateTimeOffset.value}:00`;
  // Automatikusan beállítjuk a formData-ba is
  formData.value.dtime_to = result;
  return result;
})

watch(() => formData.value.table_id, (newId) => {
  console.log('Asztal megváltozott:', newId);
  
  const tables = table.value.find(t => t.id === parseInt(newId));
  selectedTable.value = tables || null;
}, { immediate: true })

</script>
<template>
<header class="navbar navbar-light bg-white shadow-sm px-4 align-items-center">
      <span class="navbar-brand fs-5 "><span class="text-info fw-bold">The Table</span> Admin Felület</span>
      <div class="d-flex align-items-center gap-4">
        <div class="position-relative">
          <i class="fas fa-bell"></i>
          <span class="badge bg-danger position-absolute top-0 start-100 translate-middle">3</span>
        </div>
        <div class="d-flex align-items-center gap-2">
          <span class="bg-info text-white rounded-circle p-2 fw-bold">A</span>
          <div>
            <div>Adminisztrátor</div>
            <small class="text-secondary">Rendszergazda</small>
          </div>
        </div>
      </div>
    </header>
<div class="container-fluid mt-4">
  <div class="row">
    <!-- Oldalsáv -->
    <aside class="col-md-3 col-lg-2 bg-dark text-white p-4">
      <h4 class="mb-4"><i class="fa-solid fa-utensils me-2 text-info"></i> Menü</h4>
      <nav class="nav flex-column">
        <a href="#Asztalok" class="nav-link text-white"><i class="fa fa-chair me-2"></i> Asztalok kezelése</a>
        <a href="#Foglalasok" class="nav-link text-white"><i class="fa fa-calendar-alt me-2"></i> Foglalások</a>
        <a href="#Rendelesek" class="nav-link text-white"><i class="fa fa-clipboard-list me-2"></i> Rendelések</a>
        <a href="#Uzenetek" class="nav-link text-white"><i class="fa-solid fa-envelope me-2"></i> Üzenetek</a>
        <a href="#Foglalas" class="nav-link text-white"><i class="fa fa-user me-2"></i> Új foglalás</a>
        <a href="#Naptar" class="nav-link text-white"><i class="fa fa-calendar-alt me-2"></i> Naptár</a>
        <a href="#Velemenyek" class="nav-link text-white"><i class="fa fa-comment-alt me-2"></i>Vélemények</a>
      
        <div class="logout-btn">
          <button class="btn btn-warning " @click="logout">
            <i class="fas fa-sign-out-alt me-2"></i>Kijelentkezés
          </button>
        </div>      
      </nav>
    </aside>

    
    <!-- Fő tartalom -->
    <main class="col-md-9 col-lg-10">
      <!-- Dashboard statisztika kártyák -->
    <div class="row">
    <div class="col-md-5 col-lg-5">
      <div class="card ">
        <div class="card-header fw-bold">Áttekintés</div>
        <div class="row text-center">
          <div class="col-6 col-md-3 p-3">
            <div class="p-3 rounded bg-info bg-opacity-10 mb-2">
              <i class="fas fa-chair fs-3 text-info"></i>
            </div>
            <div class="fs-4">{{ table.length }}</div>
            <div class="small text-muted">Összes asztal</div>
          </div>
          <div class="col-6 col-md-3 p-3">
            <div class="p-3 rounded bg-success bg-opacity-10 mb-2">
              <i class="fas fa-check-circle fs-3 text-success"></i>
            </div>
            <div class="fs-4">{{sumSzabad()}}</div>
            <div class="small text-muted">Szabad asztal</div>
          </div>
          <div class="col-6 col-md-3 p-3">
            <div class="p-3 rounded bg-warning bg-opacity-10 mb-2">
              <i class="fas fa-user-clock fs-3 text-warning"></i>
            </div>
            <div class="fs-4">{{sumFoglalt()}}</div>
            <div class="small text-muted">Foglalt asztal</div>
          </div>
          <div class="col-6 col-md-3 p-3">
            <div class="p-3 rounded bg-danger bg-opacity-10 mb-2">
              <i class="fas fa-shopping-basket fs-3 text-danger"></i>
            </div>
            <div class="fs-4">1</div>
            <div class="small text-muted">Aktív rendelés</div>
          </div>
        </div>
      </div>
        </div>

      <!-- Asztal elrendezés -->
      <div class="card mb-4 col-md-5 col-lg-5 ">
        <div class="row justify-content-center">
        <div class="card-header d-flex justify-content-between align-items-center fw-bold ">
          <span>Asztal Elrendezés</span>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#myModal"><i class="fas fa-plus"></i> Új asztal</button>
          <div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="myModalLabel">Űrlap</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                </div>
                <div class="modal-body">
                  <form id="myForm">
                    <div class="mb-3">
                      <label for="name" class="form-label">Kapacitás</label>
                      <input type="text" class="form-control" id="name" required v-model="formData.capacity">
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezár</button>
                  <button type="submit" class="btn btn-primary" form="myForm" @click="tableAdd()">Elküld</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 col-lg-12  d-flex overflow-auto">
              <div class="border rounded p-3 text-center col-3 m-1 " v-for="tables in table" @click="selectedTable(tables)">
              <div class="fs-2 text-info">{{tables.id}}</div>
              <div class="mb-1">{{tables.capacity}}</div>
              <div>
                <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#myUpdateModal"  ><i class="fas fa-pen"></i></button>
                  <div class="modal fade" id="myUpdateModal" tabindex="-1" aria-labelledby="myUpdateModalLabel" aria-hidden="true" @click.stop>
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="myUpdateModalLabel">Űrlap</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Bezárás"></button>
                        </div>
                        <div class="modal-body">
                          <form id="myUpdateForm">
                            <div class="mb-3">
                              <label for="name" class="form-label">Kapacitás</label>
                              <input type="text" class="form-control" id="name" required v-model="formData.capacity">
                            </div>
                          </form>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezár</button>
                          <button type="submit" class="btn btn-primary" form="myUpdateForm" @click.stop="tableUpdate()">Elküld</button>
                        </div>
                      </div>
                    </div>
                  </div>
                <button class="btn btn-outline-secondary btn-sm" @click.stop="deleteTable"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      </div>

      <!-- Foglalások táblázat -->
      <div class="card mb-4 col-md-9 col-lg-10" id="Foglalasok" style="height: 25rem;">
        <div class="card-header">
          <h2 class="mb-0">Aktuális Foglalások</h2>
        </div>
        <div class="card-body table-responsive">
          <table class="table table-hover overflow-hidden " v-for="reservation in reservations" >
            <thead>
              <tr>
                <th>Asztal</th>
                <th>Név</th>
                <th>Időpont</th>
                <th>Fő</th>
                <th>Státusz</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td >{{reservation.table_id}}</td>
                <td ><span v-for="user in users" v-show="reservation.user_id === user.id">{{reservation.guest_name}}</span></td>
                <td>{{reservation.dtime_from.split("T")[0]}}  {{  reservation.dtime_from.split("T")[1].split('.')[0].slice(0, -3)}}</td>
                <td>{{ reservation.number_of_customers }}</td>
                <td><span class="badge bg-danger"  v-if="reservation.status_id === 2">Foglalt</span><span class="badge bg-success"  v-if="reservation.status_id === 1">Szabad</span></td>
                <td>
                  <button class="btn btn-sm btn-secondary" data-bs-toggle="modal" data-bs-target="#messageModal" @click="openMessageModal(reservation)"><i class="fa fa-comment"></i></button>
                  <button class="btn btn-outline-secondary btn-sm" @click="selectedReservation(reservation); cancelReservation()"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

       <!-- Aktuális Rendelések -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">Aktuális Rendelések</h2>
          <button class="btn btn-primary btn-sm">
            <i class="fas fa-plus"></i> Új rendelés
          </button>
        </div>
        <div class="card-body table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>#</th>
                <th>Asztal</th>
                <th>Termékek</th>
                <th>Állapot</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>124</td>
                <td>2</td>
                <td><span class="badge bg-info text-dark">Feldolgozás alatt</span></td>
                <td class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-check"></i></button>
                  <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-times"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Üzenetek-->
      <div class="card mb-4 shadow-sm" id="Uzenetek">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">Üzenetek és hibajelentések</h2>
          <button type="button" class="btn btn-primary" data-bs-target="#messageModal" @click="openModal"><i class="fas fa-plus"></i> Új Üzenet</button>
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
                  <select class="form-select" v-model="selectedUser">
                    <option value="">Válasszon felhasználót</option>
                    <option v-for="user in users" :key="user.id" :value="user">
                      {{ user.name}}
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Foglalás</label>
                  <select class="form-select" v-if="selectedUser" v-model="selectedResForMessage">
                    <option value="">Válasszon foglalást</option>
                    <option  v-for="res in userReservations" :key="res.id" :value="res" >
                      Asztal {{ res.table_id }} • {{ res.dtime_from.split('T')[0] }} {{ res.dtime_from.split('T')[1].slice(0,5) }}
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
        <div class="card-body p-3" style="max-height:350px; overflow-y:auto;" v-for="notification in notifications">
          <!-- Egy üzenet -->
          <div class="d-flex gap-3 p-3 border-bottom border-light bg-light rounded mb-2 hover-overlay" v-if="notification.user_id === me.id">
            <div class="bg-info text-white rounded d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div v-for="user in users">
            <div v-if="notification.user_id === me.id && notification.sender_id === user.id" >
              <h4 class="h6 mb-1">{{ user.name }}</h4>
              <p class="mb-1 small text-muted">{{ notification.message }}</p>
              <div class="small text-muted"></div>
            </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Új foglalás felvétele -->
      <div class="card mb-4 shadow-sm" id="Foglalas">
        <div class="card-header">
          <h2 class="card-title mb-0">Új Foglalás Felvétele</h2>
          <form class="bg-white p-4 rounded shadow-sm sticky-top" @submit.prevent="reservationAdd">
        <h4 class="text-primary mb-5" >Asztalfoglalás</h4>
        <div class="mb-3" >
          <div class="col-md-6">
              <label for="tableNumber" class="form-label">Asztal száma</label>
              <select class="form-select" v-model="formData.table_id" @change.stop="selectedTable(table.find(t => t.id === Number(formData.table_id)))">
                <option  value="">Válasszon helyet</option>
                <option  v-for="tables in table" :value="tables.id" :key="tables.id"  >{{tables.id}}</option>
              </select>
            </div>
        <div class="mb-3">
          <label for="date" class="form-label">Foglalás időpontja</label>
          <input type="date" id="date" class="form-control" :min="currentDateCut" required v-model="date">
        </div>
        <div class="row mb-3">
          <div class="col" >
            <label for="time" class="form-label" >Időpont</label>
            <select id="time" class="form-select" v-model="time" required>
              <option>17:00</option>
              <option>18:00</option>
              <option>19:00</option>
              <option>20:00</option>
              <option>21:00</option>
              <option>22:00</option>
              <option>23:00</option>
            </select>
          </div>
          </div>
          
          <p >{{dtime_from}}</p>
         
          <div class="col mb-3">
            <label for="time" class="form-label">A foglalás várható hossza</label>
            <select id="time" class="form-select" v-model="timeOffSet" required>
              <option>0:30</option>
              <option>1:00</option>
              <option>1:30</option>
              <option>2:00</option>
            </select>
          </div>
          <p>{{ dtime_to }}</p>

          <div class="col">
            <label for="guests" class="form-label" >Vendégek száma</label>
            <select id="guests" class="form-select" v-if="selected" v-model="formData.number_of_customers" required>
              <option v-for="cap in selected.capacity">{{ cap }}</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">Teljes név</label>
            <input 
              type="text"
              id="name" 
              class="form-control bg-light"
              v-model="formData.guest_name"
              required 
              pattern="^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$"
              title="Kérjük, adjon meg legalább két nevet, csak betűkkel." 
              >
        </div>
        <div v-if="reservations.some(r => 
            r.table_id === Number(formData.table_id) && 
            new Date(dtime_from) < new Date(r.dtime_to) && 
            new Date(dtime_to) > new Date(r.dtime_from)
          )" 
          class="alert alert-danger p-3 mb-3"> <span >Átfedés!Ebben az időpontban foglalt: {{ dtime_from }} - {{ dtime_to }}</span> </div>
        <button type="submit"
          v-else
          class="btn btn-primary w-100" 
          @click.prevent="reservationAdd()"
        >Foglalás megerősítése</button>
      </form>
    </div>
    </div>

      <!-- Nyitvatartási Idők -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">Nyitvatartási Idők</h2>
          <div>
            <button type="button" class="btn btn-outline-primary btn-sm me-2" data-bs-target="#editHoursModal" @click="openHoursModal"><i class="fas fa-edit"></i> Új Nyitvatartás</button>
          <div class="modal fade" id="editHoursModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Nyitvatartás hozzáadás</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nap kiválasztása</label>
                  <select class="form-select" v-model="formData.day_of_week">
                    <option value="">Válasszon Napot</option>
                    <option value="Hétfő">Hétfő</option>
                    <option value="Kedd">Kedd</option>
                    <option value="Szerda">Szerda</option>
                    <option value="Csütörtök">Csütörtök</option>
                    <option value="Péntek">Péntek</option>
                    <option value="Szombat">Szombat</option>
                    <option value="Vasárnap">Vasárnap</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nyitás ideje</label>
                  <select class="form-select" v-model.number="formData.open_time">
                    <option value="">Válasszon időpontot</option>
                    <option :value="6">6:00</option>
                    <option :value="7">7:00</option>
                    <option :value="8">8:00</option>
                    <option :value="9">9:00</option>
                    <option :value="10">10:00</option>
                    <option :value="11">11:00</option>
                    <option :value="12">12:00</option>
                    <option :value="13">13:00</option>
                    <option :value="14">14:00</option>
                    <option :value="15">15:00</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Zárás ideje</label>
                  <select class="form-select" v-model.number="formData.close_time">
                    <option value="">Válasszon időpontot</option>
                    <option :value="14">14:00</option>
                    <option :value="15">15:00</option>
                    <option :value="16">16:00</option>
                    <option :value="17">17:00</option>
                    <option :value="18">18:00</option>
                    <option :value="19">19:00</option>
                    <option :value="20">20:00</option>
                    <option :value="21">21:00</option>
                    <option :value="22">22:00</option>
                    <option :value="23">23:00</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Mégse
                </button>
                <button type="button" class="btn btn-primary" @click="openingHoursAdd">
                  Küldés
                </button>
              </div>
            </div>
          </div>
          </div>
            <button class="btn btn-outline-success btn-sm me-2" id="saveHours" style="display:none;">
              <i class="fas fa-save"></i> Mentés
            </button>
            <button class="btn btn-outline-danger btn-sm" id="cancelHours" style="display:none;">
              <i class="fas fa-times"></i> Mégse
            </button>
          </div>
          </div>
        </div>
        <div class="card-body">
          <div class="list-group">
            <div class="d-flex justify-content-between align-items-center border-bottom py-2" v-for="openningHour in openningHours" :key="openningHour.id" @click="selectedOpeningHours(openningHour)">
              <span class="fw-medium">{{openningHour.day_of_week}}</span>
              <span class="text-muted" contenteditable="false">{{openningHour.open_time}}:00 - {{ openningHour.close_time }}:00</span>
            
            <button class="btn btn-outline-secondary btn-sm" @click="deleteOpeningHours"><i class="fas fa-trash"></i></button>
            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#updateHoursModal" @click="openUpdateHoursModal" ><i class="fas fa-pen"></i></button>
            <div class="modal fade" id="updateHoursModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Nyitvatartás Módositása</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label">Nap kiválasztása</label>
                  <select class="form-select"  v-model="formData.day_of_week">
                    <option value="">{{selectedHour?.day_of_week}}</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Nyitás ideje</label>
                  <select class="form-select" @click.stop v-model.number="formData.open_time">
                    <option value="">Válasszon időpontot</option>
                    <option :value="6">6:00</option>
                    <option :value="7">7:00</option>
                    <option :value="8">8:00</option>
                    <option :value="9">9:00</option>
                    <option :value="10">10:00</option>
                    <option :value="11">11:00</option>
                    <option :value="12">12:00</option>
                    <option :value="13">13:00</option>
                    <option :value="14">14:00</option>
                    <option :value="15">15:00</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Zárás ideje</label>
                  <select class="form-select" @click.stop v-model.number="formData.close_time">
                    <option value="">Válasszon időpontot</option>
                    <option :value="14">14:00</option>
                    <option :value="15">15:00</option>
                    <option :value="16">16:00</option>
                    <option :value="17">17:00</option>
                    <option :value="18">18:00</option>
                    <option :value="19">19:00</option>
                    <option :value="20">20:00</option>
                    <option :value="21">21:00</option>
                    <option :value="22">22:00</option>
                    <option :value="23">23:00</option>
                  </select>
                </div>
                </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                  Mégse
                </button>
                <button type="button" class="btn btn-primary" @click.stop="openningHoursUpdate">
                  Küldés
                </button>
              </div>
            </div>
          </div>
          </div>
          </div>
          </div>
        </div>
      </main>
 </div>
</div>
      <div class="card mb-4 shadow-sm col-md-12 col-lg-12 vh=20" id="Naptar">
          <vue-cal          
          :events="events || []"
          active-view="day"
          :time-from="11 * 60" :time-to="24 * 60" :time-step="30"
          @view-change="(e) => console.log('view-change', e)"/>
      </div>
</template>