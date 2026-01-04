<script setup>
import { onMounted, ref , computed, watch, nextTick } from 'vue';
import { RouterLink , useRouter } from 'vue-router';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const router = useRouter();
const token = ref(localStorage.getItem('token'));

const me = ref();
const user = ref();
const table = ref([]);
const status = ref([]);
const selected = ref(1);
const tableStatus = ref(["szabad"]); 
const date = ref('');
const time = ref('');
const timeOffSet= ref('');
const reservations =ref([]);
const currentDate = ref(new Date());
const currentDateCut = ref(new Date);
const currentTime = ref('');
const currentTimeCut = ref('');
const currentDateTime = ref('');
const openningHours = ref([]);
const modalRef = ref(null);
const modalMessage = ref('');
const modalType = ref('error');
const emit = defineEmits(['logged-out']);
//const closeHour = ref([]);
const rawDay = new Date().toLocaleDateString('hu-HU', { weekday: 'long' });


const todayName = rawDay.toString().charAt(0).toUpperCase() + rawDay.toString().slice(1);

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


async function getMe() {
  if (!token.value) {
    console.log("Nincs token, me nem tölthető be");
    return;
  }

  try {
    const response = await fetch("http://localhost:3300/me", {
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });
    
    console.log("🔍 /me response status:", response.status);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token érvénytelen, töröljük
        localStorage.removeItem('token');
        token.value = null;
        me.value = null;
        modalShow('A munkamenet lejárt, kérjük jelentkezz be újra!', 'warning');
        return;
      }
      throw new Error(`HTTP hiba! státusz: ${response.status}`);
    }
    
    const meData = await response.json();
    me.value = meData;
    
    console.log("Bejelentkezett me:", meData);
    
    // Me ID automatikus beállítása
    if (me.value && me.value.id) {
      formData.value.me_id = me.value.id;
      console.log("Me ID beállítva:", me.value.id);
    } else {
      console.warn("Me adatok hiányoznak");
    }
  } catch (error) {
    console.error("Hiba a me lekérésekor:", error);
    modalShow('Hiba a felhasználói adatok betöltésekor!', 'error');
  }
};

async function getUser() {
    try{
     const res = fetch ("http://localhost:3300/user");
      if (!res.ok) throw new Error ("Nem sikerült a felhasználót lekérni!");  
      const data = await res.json();
      user.value = data;
     }catch (error) {
      console.error(error);
     }
};

async function getTable() {
    try{
     const res = fetch ("http://localhost:3300/table");
      if (!res.ok) throw new Error ("Nem sikerült a asztalt lekérni!");  
      const data = await res.json();
      table.value = data;
     }catch (error) {
      console.error(error);
     }
};

async function getStatus() {
    try{
     const response = await fetch ("http://localhost:3300/status");
      if (!response.ok) throw new Error ("Nem sikerült a státuszt lekérni!");  
      const data = await response.json();
      status.value = data;
     }catch (error) {
      console.error(error);
      
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

const getTableStatus = async (at) => {
  try {
    const url = at 
      ? `http://localhost:3300/tablestatus?at=${encodeURIComponent(at)}`
      : `http://localhost:3300/tablestatus`;

    const res = await fetch(url)
    if (!res.ok) throw new Error('Nem sikerült az asztal státuszt lekérni')
    const data = await res.json()
    tableStatus.value = data
    console.log('TableStatus@', at, data)
  } catch (err) {
    console.error(err)
    tableStatus.value = []
  }
}

const getTableStatusFullRange = async () => {
  if (!dtime_from.value || !dtime_to.value) return;
  
  try {
    const url = `http://localhost:3300/tablestatus?start=${encodeURIComponent(dtime_from.value)}&end=${encodeURIComponent(dtime_to.value)}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Nem sikerült az asztal státuszt lekérni');
    
    const data = await res.json();
    tableStatus.value = data;
    console.log('TableStatus FULL RANGE:', dtime_from.value, '→', dtime_to.value, data);
  } catch (err) {
    console.error(err);
    tableStatus.value = [];
  }
};

async function getOpenningHours() {
    try{
     const response = await fetch ("http://localhost:3300/openninghours");
      if (!response.ok) throw new Error ("Nem sikerült nyitvatartási táblát lekérni!");  
      const data = await response.json();
      openningHours.value = data;
      console.log("Nyitvatartási adatok",openningHours.value, todayName)
     }catch (error) {
      console.error(error);
      
     }
};

const getTableStatusClass = (tables) => {
  // Nincs foglalás = zöld (szabad)
  if (!tables.reservation || tables.reservation.length === 0) {
    return 'bg-success text-white';
  }
  
  // Van foglalás, nézzük status_id
  const statusId = tables.reservation[0].status_id;
  if (statusId === 2) {
    return 'bg-danger text-white'; // foglalt = piros
  }
};

const formData = defineModel({
    default:{
      user_id:0,
      table_id: 0,
      status_id: 0,
      dtime_from: "",
      dtime_to: "",
      number_of_customers: 0,
      guest_name:''
    }
});

async function reservationAdd() {

   if (me.value && me.value.id) {
    formData.value.user_id = me.value.id;
  } else {
    modalShow('Nem sikerült betölteni a felhasználói adatokat!', 'error');
    return;
  }
  if(!time.value || !date.value ){
    modalShow('A dátum és az idő megadása kötelező!', 'warning');
    return;
  }
    if(!timeOffSet.value){
    modalShow('A foglalás várható időtartamának megadása kötelező!', 'warning');
    return;
  }
    if(!formData.value.number_of_customers){
    modalShow('A vendégek számának megadása kötelező!', 'warning');
    return;
  }
   if (!selected.value || !selected.value.id) {
    modalShow('Kérlek válassz egy asztalt!', 'warning');
    return;
  }
    try {
    const res = await fetch('http://localhost:3300/reservationadd', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.value}`
      },
      body: JSON.stringify({
        user_id: me.value.id,
        table_id: formData.value.table_id,
        status_id: 2,
        dtime_from: formData.value.dtime_from,
        dtime_to: formData.value.dtime_to,
        number_of_customers: formData.value.number_of_customers,
        guest_name: me.value.name
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Sikertelen foglalás')
    }

    modalShow('Sikeres foglalás! Köszönjük, hogy minket választott!','success')

    setTimeout(() => {
      window.location.reload()
    }, 1500)

  } catch (err) {
    console.error('Foglalás hiba:', err)
    modalShow(
      'A foglalás nem sikerült. Lehet, hogy az asztal már foglalt az adott időpontban.',
      'error'
    )
  }
};

const sumSzabad = () => {
  return tableStatus.value.filter(t => !t.reservation || t.reservation.length === 0).length;
};

const sumFoglalt = () => {
  return tableStatus.value.filter(t => t.reservation?.length > 0).length;
};

watch(token, (newToken) => {
  if (newToken) {
    localStorage.setItem('token', newToken)
    getMe(); // Automatikusan lekérjük a me adatokat token változásakor
  } else {
    localStorage.removeItem('token')
    me.value = null;
  }
})

watch([date, time], ([newDate, newTime]) => {
  if (newDate && newTime) {
    getTableStatus(selectedDateTime.value)
  }
})

watch([date, time, timeOffSet], () => {
  if (date.value && time.value && timeOffSet.value && selected.value) {
    // ✅ TELJES TARTOMÁNY ellenőrzés!
    getTableStatusFullRange();
  }
});

const selectedDateTime = computed(() => {
  if (!date.value || !time.value) return null
  // "2025-12-01T18:00:00"
  return `${date.value}T${time.value}`
})

const selectedDayName = computed(() => {
  if (!date.value) return '';
  
  const dateObj = new Date(date.value).toLocaleDateString('hu-HU', { weekday: 'long' });
  return dateObj.toString().charAt(0).toUpperCase() + dateObj.toString().slice(1);
  
});

function selectedAsztal(tables){
  selected.value = tables;
  formData.value.table_id=tables.id;
  modalShow('Asztal kiválasztva!', 'success');
};



const dtime_from = computed(() => {
  const result = `${date.value}T${time.value}`;
  // Automatikusan beállítjuk a formData-ba is
  formData.value.dtime_from = result;
  return result;
})

const dateTimeOffset = computed(() => {
  if (!time.value || !timeOffSet.value) return '00:00';

  const [t,tp] = time.value.split(':').map(Number);
  const [ts,tsp] = timeOffSet.value.split(':').map(Number);

   if (isNaN(t) || isNaN(tp) || isNaN(ts) || isNaN(tsp)) {
    console.warn('Érvénytelen idő formátum:', time.value, timeOffSet.value);
    return '00:00';
  }

  const newHours = Math.max(0, (t + ts) % 24);
  const minutes = Math.max(0, Math.min(59, tp + tsp));

  const formattedHours = newHours.toString().padStart(2, '0');
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;//:00
});

const dtime_to = computed(() => {
  if (!date.value || !dateTimeOffset.value || dateTimeOffset.value.includes('NaN')) {
    return '';
  }

   const result = `${date.value}T${dateTimeOffset.value}`;
  // Automatikusan beállítjuk a formData-ba is
  formData.value.dtime_to = result;
  return result;
})

const isLoggedIn = computed(() => !!token.value)

onMounted(async()=>{
  await getMe();
  //if(token.value){getMe()};
  if (me.value.role !== 'USER'|| 'ADMIN' && !isLoggedIn) {
  router.replace('/')};
  await getOpenningHours();
  await getUser(); 
  await getTable();
  await getStatus();
  await getTableStatus();
  await getReservation();
});

// Kijelentkezés esemény kezelése
const handleLogout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false;
  token.value = null;
  modalShow('Sikeresen kijelentkeztél!', 'success');
  setTimeout(() => {
      window.location.reload()
    }, 1500)
};



currentDate.value = new Date();
currentDateCut.value = new Date().toISOString().split("T")[0];
console.log( currentDateCut.value);

//const yesterday = new Date(currentDateCut.value);
//yesterday.setDate(yesterday.getDate()-1);
//currentDateCut.value = yesterday.toISOString().split("T")[0];

currentTime.value = new Date().toLocaleTimeString('hu-HU', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
});

currentTimeCut.value= currentTime.value.slice(0,-3);

currentDateTime.value = `${currentDate.value} ${currentTime.value}`;
console.log( currentDateCut.value);

const isSelectedTableBooked = computed(() => {
if (!selected.value || !dtime_from.value || !dtime_to.value) return false;
  
  const table = tableStatus.value.find(t => t.id === selected.value.id);
  if (!table?.reservation?.length) return false;
  
  const newFrom = new Date(dtime_from.value);
  const newTo = new Date(dtime_to.value);
  
  return table.reservation.some(r => {
    const rFrom = new Date(r.dtime_from);
    const rTo = new Date(r.dtime_to);
    
    return newFrom < rTo && newTo > rFrom;
  });
});


const timeSlots = computed(() => {
  if (!selectedDayName.value || !openningHours.value?.length) return [];

  const dayRow = openningHours.value.find(
    oh => oh.day_of_week === selectedDayName.value
  );
  if (!dayRow) return [];

  const openHour = parseInt(dayRow.open_time);
  const closeHour = parseInt(dayRow.close_time);

  const isToday = date.value === currentDateCut.value;
  const nowHour = new Date().getHours();
  const nowMinute = new Date().getMinutes();

  const slots = [];
  for (let h = openHour; h < closeHour; h++) {
    const hour = h.toString().padStart(2, '0');

    if (isToday && h < nowHour) continue;
    if (isToday && h === nowHour && 0 < nowMinute) continue;

    slots.push(`${hour}:00`);
  }
  return slots;
});

const closeHour = computed(() => {
  if (!selectedDayName.value || !openningHours.value?.length) return '';
  
  const dayRow = openningHours.value.find(
    oh => oh.day_of_week === selectedDayName.value
  );
 if (!dayRow || !dayRow.close_time) return '';

  const closeTimeStr = String(dayRow.close_time).padStart(2, '0');
  return closeTimeStr;
});

const maxTimeOffset = computed(() => {
  if (!selectedDayName.value || !openningHours.value?.length) return '2:00';
  
  const dayRow = openningHours.value.find(
    oh => oh.day_of_week === selectedDayName.value
  );
  if (!dayRow || !dayRow.close_time) return '2:00';
  
  const closeHourNum = parseInt(dayRow.close_time);
  const selectedHour = time.value ? parseInt(time.value.split(':')[0]) : 0;
  
  if (isNaN(closeHourNum) || isNaN(selectedHour)) return '2:00';
  // Pl. 18:00-ra max 4 óra (22-ig), ha close_time=22
  const maxHours = closeHourNum - selectedHour;
  return `${Math.max(0, Math.min(maxHours, 2))}:00`; // max 2 óra limit
});

const timeOffsetOptions = computed(() => {
  if (!time.value || !selectedDayName.value || !openningHours.value?.length) return [];
  
  const dayRow = openningHours.value.find(
    oh => oh.day_of_week === selectedDayName.value
  );
  if (!dayRow) return [];
  
  const selectedHour = parseInt(time.value.split(':')[0]);
  const closeHour = parseInt(dayRow.close_time);
  const options = ['0:30', '1:00', '1:30', '2:00'];
  
  return options.filter(option => {
    const [h] = option.split(':').map(Number);
    return (selectedHour + h) <= closeHour;
  });
});

const overlappingReservation = computed(() => {
  if (!selected.value || !dtime_from.value || !dtime_to.value) return null;
  
  const table = tableStatus.value.find(t => t.id === selected.value.id);
  if (!table?.reservation) return null;
  
  const newFrom = new Date(dtime_from.value);
  const newTo = new Date(dtime_to.value);
  
  // Megkeressük az első ütköző foglalást
  return table.reservation.find(existing => {
    const existingFrom = new Date(existing.dtime_from);
    const existingTo = new Date(existing.dtime_to);
    const noOverlap1 = newTo <= existingFrom;  // Új előbb végződik
    const noOverlap2 = existingTo <= newFrom;   // Régi előbb végződik
    
    return !(noOverlap1 || noOverlap2); 
  });
});

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('hu-HU', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

</script>

<template>
  <Header 
    :me="me"
    :user="user" 
    :is-logged-in="isLoggedIn" 
    :handle-logout="handleLogout"
  />

<!-- HERO -->
<section class=" bg-dark text-light py-5 mt-5 text-start" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1470&q=80') center/cover;">
  <div class="container text-info">
    <h1 class="display-3 mb-3">Vendégszeretet az első helyen</h1>
    <p class="lead">Válassza ki az Önnek tetsző asztalt és foglalja le ideális időpontjában</p>
  </div>
   <div class="row mt-5 text-center">         
          <div class="col"><span class="h2 text-warning" v-for="tables in table">{{ table.length }}</span><br />Összes asztal</div>
          <div class="col"><span class="h2 text-warning">{{sumSzabad()}}</span><br />Szabad asztal</div>
          <div class="col"><span class="h2 text-warning">{{ sumFoglalt() }}</span><br />Foglalt asztal</div>
        </div>
</section>

<!-- FŐ TARTALOM -->
 <main>
<div class="container my-5">
  <h2 class="text-center text-primary mb-5">Éttermi Elrendezés</h2>
  <div class="row g-4">
    <div class="col-lg-8">
      <div class="border rounded p-4 shadow-sm bg-light">
        <h5 class="text-center mb-3">Asztalok</h5>
        <div class="position-relative gap-3 justify-content-center row" style="min-height:600px;">
               <div class="table-card d-flex col-3 bg-success text-white p-3 rounded shadow mb-1 mt-5 mx-4 d-flex justify-content-center align-items-center"
                v-for="tables in tableStatus" :key="tables.id" 
               @click="selectedAsztal(tables)"
               :class="getTableStatusClass(tables)"
               style="  width: 100px; height: 100px;cursor:pointer;" > 
               {{ tables.id }} <br> {{ tables.capacity }} fő
              </div>
        </div>
        <div class="d-flex justify-content-between mb-3">
          <div title="Bejárat" class="p-2 border rounded bg-light text-center" style="width: 100px;">
            <i class="fas fa-door-open fa-2x"></i><br>
            Bejárat
          </div>
          <div title="Konyha" class="p-2 border rounded bg-light text-center" style="width: 100px;">
            <i class="fas fa-utensils fa-2x"></i><br>
            Konyha
          </div>
        </div>

      </div>
    </div>
    <div class="col-lg-4 ">
    <div class="align-items-center gap-4 bg-success text-white rounded p-4  shadow-sm mb-5 mt-3" >
      <i class="fas fa-table fa-2x opacity-75"></i>
      <div v-if="selected ">
        <h5 class="mb-1">{{selected.id}}. asztal</h5>
        <p class="mb-0 small opacity-75">Max. {{ selected.capacity }} fő</p>
      </div>
    </div>

    
      <form class="bg-white p-4 rounded shadow-sm sticky-top">
        <h4 class="text-primary mb-3">Asztalfoglalás</h4>
        <div class="mb-3">
        <div class="mb-3">
          <label for="date" class="form-label">Foglalás időpontja</label>
          <input type="date" id="date" class="form-control" :min="currentDateCut" required v-model="date">
        </div>
        <div class="row mb-3">
          <div class="col">
            <label for="time" class="form-label" v-if="selectedDayName">Időpont</label>
            <select id="time" class="form-select" v-model="time" required :disabled="!timeSlots.length">
              <option value="" disabled>{{ timeSlots.length ? 'Válassz időpontot' : (date === currentDateCut ? 'Már lezárultak a mai időpontok' : 'Először válassz dátumot') }}</option>
              <option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</option>
            </select>
          </div>
          </div>

          <div class="col mb-3">
            <label for="timeOffSet" class="form-label">A foglalás várható hossza</label>
            <select id="timeOffSet" class="form-select" v-model="timeOffSet" required :disabled=" !timeOffsetOptions.length">
              <option value="" disabled>{{ timeOffsetOptions.length ? 'Válassz időtartamot' : 'Időpont túl késő' }}</option>
              <option v-for="offset in timeOffsetOptions" :key="offset" :value="offset">{{ offset }}</option>
            </select>
          </div>

          <div class="col">
            <label for="guests" class="form-label">Vendégek száma</label>
            <select id="guests" class="form-select" v-if="selected" v-model="formData.number_of_customers" required>
              <option v-for="(cap,index) in selected.capacity">{{ cap }}</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">Teljes név</label>
          <div v-if="isLoggedIn && me">
          <input 
          type="text" 
          id="name" 
          class="form-control bg-light" 
          :value="me.name" 
          readonly>
          <small class="text-success">
            <i class="fas fa-check-circle"></i> 
            A neved automatikusan betöltődött: <strong>{{ me.name }}</strong>
          </small>
        </div>
        </div>
        <div v-if="selected && isSelectedTableBooked" class="alert alert-danger p-3 mb-3">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>Asztal foglalt!</strong><br>
          <span v-if="overlappingReservation">
            Ütközés: 
            <strong>{{ formatTime(overlappingReservation.dtime_from) }} - {{ formatTime(overlappingReservation.dtime_to) }}</strong>
          </span><span>Kérjük válasszon másik időpontot!!</span>
        </div>
        <button type="submit" class="btn btn-primary w-100" @click.prevent="reservationAdd">Foglalás megerősítése</button>
      </form>
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
</main>
<Footer :openning-hours="openningHours" />
</template>
<style>
</style>