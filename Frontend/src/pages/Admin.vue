<script setup>
import { onMounted, ref, computed,watch } from 'vue';
import { RouterLink } from 'vue-router';
import { VueCal } from 'vue-cal';
import 'vue-cal/style';
import { useRouter } from 'vue-router';


const user = ref();
const table = ref([]);
const status = ref([]);
const reservations = ref([]);
const tabstatus = ref("szabad");
const events = ref([]);
const emit = defineEmits(['loggedOut']);
const selectedRes = ref(null);
const selected = ref(null); 

const isLoggedIn = ref(!!localStorage.getItem('token'));

async function getUser() {
    try{
     const res = await fetch ("http://localhost:3300/user");
      if (!res.ok) throw new Error ("Nem sikerült a felhasználót lekérni!");  
      const data = await res.json();
      user.value = data;
     }catch (error) {
      console.error(error);
      user.value = {id:0, name:"", email:""};
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
    table_id: 0,
  }
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

const sumSzabad = () => {
  return tabstatus.value.filter(t => !t.reservation || t.reservation.length === 0).length;
};

const sumFoglalt = () => {
  return tabstatus.value.filter(t => t.reservation?.length > 0).length;
};

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

onMounted(async()=>{
  await getUser();
  if (me.value?.role !== 'ADMIN') {
  router.replace('/')};
  await getReservation();
  await getTable();
  await getStatus();
  await getTableStatus();;
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

const logout = () => {
  localStorage.removeItem("token");
  if (confirm('Biztosan ki szeretne jelentkezni?')) {
            alert('Sikeres kijelentkezés!');}
  emit("logged-out");
      setTimeout(() => {
      window.location.reload();
    }, 1000);
};

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
                <td>Lasagne, Cola, Tiramisu</td>
                <td><span class="badge bg-info text-dark">Feldolgozás alatt</span></td>
                <td class="d-flex gap-2">
                  <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-check"></i></button>
                  <button class="btn btn-sm btn-outline-secondary"><i class="fas fa-times"></i></button>
                </td>
              </tr>
              <!-- További rendelések -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- Hibajelentések -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h2 class="card-title mb-0">Üzenetek és hibajelentések</h2>
        </div>
        <div class="card-body p-3" style="max-height:350px; overflow-y:auto;">
          <!-- Egy üzenet -->
          <div class="d-flex gap-3 p-3 border-bottom border-light bg-light rounded mb-2">
            <div class="bg-info text-white rounded d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div>
              <h4 class="h6 mb-1">Hiba asztal #4 foglalásában</h4>
              <p class="mb-1 small text-muted">A foglalás dátuma ütközik egy másik foglalással, valószínűleg rendszerhiba miatt.</p>
              <div class="small text-muted">10:23 AM • Ma</div>
            </div>
          </div>
          <!-- További üzenetek -->
        </div>
      </div>

      <!-- Új asztal felvétele -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header">
          <h2 class="card-title mb-0">Új Asztal Felvétele</h2>
        </div>
        <div class="card-body">
          <form class="row g-3">
            <div class="col-md-6">
              <label for="tableNumber" class="form-label">Asztal száma</label>
              <input type="text" class="form-control" id="tableNumber" placeholder="Adja meg az asztal számát" />
            </div>
            <div class="col-md-6">
              <label for="tableCapacity" class="form-label">Kapacitás</label>
              <input type="number" class="form-control" id="tableCapacity" placeholder="Fő száma" />
            </div>
            <div class="col-12">
              <label for="tableLocation" class="form-label">Asztal elhelyezkedése</label>
              <select class="form-select" id="tableLocation">
                <option value="">Válasszon helyet</option>
                <option value="terasz">Terasz</option>
                <option value="belso">Belső terem</option>
                <option value="kert">Kert</option>
                <option value="ablak">Ablak mellett</option>
                <option value="belseje">Terem belseje</option>
              </select>
            </div>
            <div class="col-12">
              <label for="tableDescription" class="form-label">Megjegyzések</label>
              <textarea class="form-control" id="tableDescription" rows="3" placeholder="Írjon le egyedi jellemzőket..."></textarea>
            </div>
            <div class="col-12 d-flex justify-content-end">
              <button class="btn btn-primary" type="submit"><i class="fas fa-plus"></i> Asztal felvétele</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Nyitvatartási Idők -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">Nyitvatartási Idők</h2>
          <div>
            <button class="btn btn-outline-primary btn-sm me-2" id="editHours">
              <i class="fas fa-edit"></i> Szerkesztés
            </button>
            <button class="btn btn-outline-success btn-sm me-2" id="saveHours" style="display:none;">
              <i class="fas fa-save"></i> Mentés
            </button>
            <button class="btn btn-outline-danger btn-sm" id="cancelHours" style="display:none;">
              <i class="fas fa-times"></i> Mégse
            </button>
          </div>
        </div>
        <div class="card-body">
          <div class="list-group">
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
              <span class="fw-medium">Hétfő</span>
              <span class="text-muted" contenteditable="false">11:00 - 22:00</span>
            </div>
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
              <span class="fw-medium">Kedd</span>
              <span class="text-muted" contenteditable="false">11:00 - 22:00</span>
            </div>
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
              <span class="fw-medium">Szerda</span>
              <span class="text-muted" contenteditable="false">11:00 - 22:00</span>
            </div>
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
              <span class="fw-medium">Csütörtök</span>
              <span class="text-muted" contenteditable="false">11:00 - 22:00</span>
            </div>
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
              <span class="fw-medium">Péntek</span>
              <span class="text-muted" contenteditable="false">11:00 - 23:00</span>
            </div>
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
              <span class="fw-medium">Szombat</span>
              <span class="text-muted" contenteditable="false">12:00 - 23:30</span>
            </div>
            <div class="d-flex justify-content-between align-items-center py-2">
              <span class="fw-medium">Vasárnap</span>
              <span class="text-muted" contenteditable="false">12:00 - 21:00</span>
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