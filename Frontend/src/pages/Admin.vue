<script setup>
import { onMounted, ref, computed,watch } from 'vue';
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
const currentTimeCut = ref('');
const currentDateCut = ref(new Date);
const notifications = ref([]);
const me = ref(null);
const events = ref([]);
const emit = defineEmits(['loggedOut']);
const selected = ref(null);
const selectedUser = ref(null);
const selectedHour = ref(null);
const selectedRes = ref(null);
const selectReview = ref(null);
const selectedResForMessage = ref(null);
const selectedNoti = ref(null);
const openningHours = ref([]);
const reviews = ref([]);
const modalRef = ref(null);
const modalMessage = ref('');
const modalType = ref('info'); 
const modalConfirmAction = ref(null);

const showModal = (message, type = 'info', confirmAction = null) => {
  modalMessage.value = message
  modalType.value = type
  modalConfirmAction.value = confirmAction

  nextTick(() => {
    const instance = bootstrap.Modal.getInstance(modalRef.value)
    const modal = instance || new bootstrap.Modal(modalRef.value, {
      backdrop: 'static', 
      focus: true  
    })
    modal.show()
  })
}

const rawDay = new Date().toLocaleDateString('hu-HU', { weekday: 'long' });


const todayName = rawDay.toString().charAt(0).toUpperCase() + rawDay.toString().slice(1);


const isLoggedIn = ref(!!localStorage.getItem('token'));

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

function selectedUserForDelete(user){
  userSelected.value = user;
  userSelected.value.id = user.id;
  console.log(userSelected.value.id);
  alert("Felhasználó kiválasztva!")
};

const userUpdate = async () => {
  try {
    await fetch(`http://localhost:3300/users/${userSelected.value.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ 
          role: formData.value.role,
          name: userSelected.value.name,
          phone: userSelected.value.phone,
          email: userSelected.value.email
       }),
    });
    alert('Felhasználói adatok sikeresen frissítve!');
    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error("Nem sikerült frissíteni:", err);
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
      console.log("Table adatok",table.value)
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
      console.log("Status adatok",status.value)
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

const getTableStatus = async (at) => {
  try {
    const url = at 
      ? `http://localhost:3300/tablestatus?at=${encodeURIComponent(at)}`
      : `http://localhost:3300/tablestatus`;

    const res = await fetch(url)
    if (!res.ok) throw new Error('Nem sikerült az asztal státuszt lekérni')
    const data = await res.json()
    tabstatus.value = data
    console.log('TableStatus@', at, data)
  } catch (err) {
    console.error(err)
    tabstatus.value = []
  }
}

const getTableStatusFullRange = async () => {
  if (!dtime_from.value || !dtime_to.value) return;
  
  try {
    const url = `http://localhost:3300/tablestatus?start=${encodeURIComponent(dtime_from.value)}&end=${encodeURIComponent(dtime_to.value)}`;
    
    const res = await fetch(url);
    if (!res.ok) throw new Error('Nem sikerült az asztal státuszt lekérni');
    
    const data = await res.json();
    tabstatus.value = data;
    console.log('TableStatus FULL RANGE:', dtime_from.value, '→', dtime_to.value, data);
  } catch (err) {
    console.error(err);
    tabstatus.value = [];
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

async function getReviews() {
  try {
    const res1 = await fetch("http://localhost:3300/review");
    const data1 = await res1.json();

    const res2 = await fetch("http://localhost:3300/reviewslogout");
    const data2 = await res2.json();

    reviews.value = data1.concat(data2);

    return reviews.value; 
  } catch (error) {
    console.error('Hiba a reviews lekérésekor:', error);
    return [];
  }
};

function selectedReview(review){
  selectReview.value = review;
 // selectReview.value.id = review.id;
 console.log(selectReview.value.id)
};


const deleteReview = async () => {
  if (!confirm('Biztosan törli ezt a véleményt?')) return

  try {
    const res = await fetch(`http://localhost:3300/reviews/${selectReview.value.id}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      showModal('Nem sikerült törölni a véleményt.', 'error')
      return
    }

    showModal('A véleményt sikeresen törölte!', 'success')

    await getReviews()
  } catch (err) {
    console.error('Hiba a törlésnél:', err)
    showModal('Hiba a vélemény törlésénél!', 'error');
  }
};

const averageRating = computed(() => {
  if (!reviews.value.length) return 0
  const sum = reviews.value.reduce((acc, r) => acc + (Number(r.rating) || 0), 0)
  return (sum / reviews.value.length).toFixed(1)
})


function selectedReservation(reservation){
  selectedRes.value = reservation;
  selectedRes.value.user_id = reservation.user_id;
  selectedRes.value.id = reservation.id;
 //reservations.value.id=0;
 console.log(selectedRes.value.id, selectedRes.value.user_id, selectedRes.value.id)
};

const cancelReservation = async () => {
  if (selectedRes.value.id === 1) {
    showModal('Ez a foglalás nem törölhető!', 'warning');
    return; // Kilépés a törlésből, ha az ID 1
  }
  if (confirm('Biztosan le szeretné mondani ezt a foglalást?')){
  try {
    await fetch(`http://localhost:3300/reservation/${selectedRes.value.id}`, {
      method: "DELETE"
    });
    showModal('Foglalás sikeresen törölve!', 'success');

    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
    showModal('Nem sikerült törölni!', 'error');
  }
};}

const formData = defineModel({
  default:{
    capacity:0,
    user_id : 0,
    reservation_id: 0,
    message: "",
    table_id: 0,
    status_id: 0,
    dtime_from: "",
    dtime_to: "",
    number_of_customers: 0,
    guest_name:"",
    day_of_week:'',
    open_time: 0,
    close_time: 0,
    role: ""
  }
});

async function tableAdd() {
  // 1️⃣ Alap validáció
  if (!formData.value.capacity || formData.value.capacity <= 0) {
    showModal('Az asztal kapacitása kötelező és nagyobb kell legyen mint 0!','warning')
    return
  }
  try {
    const res = await fetch('http://localhost:3300/table', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        capacity: Number(formData.value.capacity)
      })
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Sikertelen asztal létrehozás')
    }
   
    await getTable()

    const modalEl = document.getElementById('myModal')
    const modal = bootstrap.Modal.getInstance(modalEl)
    modalEl.addEventListener(
      'hidden.bs.modal',
      () => {
        showModal('Asztal sikeresen létrehozva!', 'success')
      },
      { once: true }
    )
    modal?.hide()

  } catch (err) {
    console.error('Asztal hozzáadás hiba:', err)
    showModal('Nem sikerült létrehozni az asztalt. Kérjük próbálja újra!','error')
  }
}

async function tableUpdate() {
  if (!formData.value.table_id) {showModal('Először válasszon ki egy asztalt!', 'warning')
    return
  }

  if (!formData.value.capacity || formData.value.capacity <= 0) {
    showModal('Az asztal kapacitása kötelező és nagyobb kell legyen mint 0!','warning')
    return
  }

  try {
    const res = await fetch('http://localhost:3300/table', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(formData.value.table_id),
        capacity: Number(formData.value.capacity)
      })
    })
    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Sikertelen asztal módosítás')
    }

    await getTable()

    const modalEl = document.getElementById('myUpdateModal')
    const modal = bootstrap.Modal.getInstance(modalEl)
    modalEl.addEventListener(
      'hidden.bs.modal',
      () => {
        showModal('Asztal sikeresen frissítve!', 'success')
      },
      { once: true }
    )
    modal?.hide()

  } catch (err) {
    console.error('Asztal frissítés hiba:', err)
    showModal('Nem sikerült módosítani az asztalt. Kérjük próbálja újra!','error')
  }
}

function selectedOpeningHours(openningHour){
  selectedHour.value = openningHour;
  selectedHour.value.id = openningHour.id;
 console.log(selectedHour.value.id , selectedHour.value.id)
};

async function openingHoursAdd() {
  if (!formData.value.day_of_week) {showModal('Válasszon egy napot!', 'warning')
    return
  }

  if (
    formData.value.open_time === '' ||
    formData.value.close_time === ''
  ) {showModal('A nyitás és zárás ideje kötelező!', 'warning')
    return
  }

  if (Number(formData.value.open_time) >= Number(formData.value.close_time)) {showModal('A nyitás ideje nem lehet később vagy egyenlő a zárással!', 'warning')
    return
  }

  try {
    const res = await fetch('http://localhost:3300/openninghours', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        day_of_week: formData.value.day_of_week,
        open_time: Number(formData.value.open_time),
        close_time: Number(formData.value.close_time)
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Sikertelen nyitvatartás mentés')
    }

    await getOpenningHours()

    const modalEl = document.getElementById('editHoursModal')
    const modal = bootstrap.Modal.getInstance(modalEl)

    modalEl.addEventListener(
      'hidden.bs.modal',
      () => {
        showModal('Nyitvatartási idő sikeresen hozzáadva!', 'success')
      },
      { once: true }
    )

    modal?.hide()

  } catch (err) {
    console.error('Nyitvatartás mentési hiba:', err)

    showModal('Nem sikerült menteni a nyitvatartást. Próbálja újra!','error')
  }
};

const deleteOpeningHours = async () => {
  if (confirm('Biztosan ki szeretné törölni a nyitvatartási időt?')){
  try {
    await fetch(`http://localhost:3300/openninghours/${selectedHour.value.id}`, {
      method: "DELETE"
    });
    showModal('Sikeresen törölve!', 'success')

    setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
    showModal('Nem sikerült törölni!', 'error')
  }
};}

async function openningHoursUpdate() {
  // 1️⃣ Alap ellenőrzések
  if (!selectedHour.value?.id) {showModal('Nincs kiválasztva módosítandó nap!', 'warning')
    return
  }

  if (!selectedHour.value.day_of_week) {showModal('A nap megadása kötelező!', 'warning')
    return
  }

  if (
    formData.value.open_time === '' ||
    formData.value.close_time === ''
  ) {showModal('A nyitás és zárás ideje kötelező!', 'warning')
    return
  }

  if (Number(formData.value.open_time) >= Number(formData.value.close_time) && !(Number(formData.value.open_time)===0 && Number(formData.value.close_time)=== 0)) {showModal('A nyitás ideje nem lehet később vagy egyenlő a zárással!', 'warning')
    return
  }

  try {
    const res = await fetch('http://localhost:3300/openninghours', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Number(selectedHour.value.id),
        day_of_week: selectedHour.value.day_of_week,
        open_time: Number(formData.value.open_time),
        close_time: Number(formData.value.close_time)
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Sikertelen nyitvatartás frissítés')
    }

    await getOpenningHours();

    const modalEl = document.getElementById('updateHoursModal')
    const modal = bootstrap.Modal.getInstance(modalEl)

    modalEl.addEventListener(
      'hidden.bs.modal',
      () => {
        showModal('Nyitvatartási idő sikeresen frissítve!', 'success')
      },
      { once: true }
    )

    modal?.hide()


  } catch (err) {
    console.error('Nyitvatartás frissítési hiba:', err)
    showModal('Nem sikerült frissíteni a nyitvatartást. Próbálja újra!','error')
  }
}

const userReservations = computed(() => {
  if (!selectedUser.value) return [];
  return reservations.value.filter(
    res => res.user_id === selectedUser.value.id
  );
});

const openMessageModal = (reservation) => {
  // user objektum a users listából
  const user = users.value.find(u => u.id === reservation.user_id) || null
  selectedUser.value = user
  selectedResForMessage.value = reservation
  messageText.value = ''
}

async function messageAdd() {
  if (!selectedUser.value || !selectedResForMessage.value || !messageText.value.trim()) {
    showModal('Kérem töltse ki az összes mezőt!', 'warning');
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
      const modalEl = document.getElementById('messageModal')
      const modal = bootstrap.Modal.getInstance(modalEl)

        modalEl.addEventListener(
        'hidden.bs.modal',
        () => {
          showModal('Üzenet elküldve!', 'success')
        },
        { once: true }
      )

      modal?.hide();

      selectedUser.value = null
      selectedRes.value = null
      messageText.value = ''
      await getNotification(); // Frissítjük a listát
    } else {
      showModal('Hiba az üzenet küldésekor!', 'error');
    }
  } catch (error) {
    console.error('Üzenetküldés hiba:', error);
    showModal('Hálozati hiba!', 'error')
  }
};

const nameRegex = /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\s+[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$/

async function reservationAdd() {
  if (!nameRegex.test(formData.value.guest_name?.trim() || '')) {
    showModal('Adj meg teljes nevet (vezetéknév és keresztnév).','warning');
    return
  }
  if(!date.value || !time.value){
    showModal('A dátum és az idő megadása kötelező!', 'warning');
    return;
  }
    if(!timeOffSet.value){
    showModal('A foglalás várható időtartamának megadása kötelező!', 'warning');
    return;
  }
      if(!formData.value.number_of_customers){
    showModal('A vendégek számának megadása kötelező!', 'warning');
    return;
  }

  try {
    const res = await fetch('http://localhost:3300/reservation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Sikertelen foglalás')
    }

    showModal('Sikeres foglalás! Köszönjük, hogy minket választott!','success')

    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (err) {
    console.error('Foglalás hiba:', err)
    showModal('A foglalás nem sikerült. Lehet, hogy az asztal már foglalt az adott időpontban.','error')
  }
};

const sumSzabad = () => {
  return tabstatus.value.filter(t => !t.reservation || t.reservation.length === 0).length;
};

const sumFoglalt = () => {
  return tabstatus.value.filter(t => t.reservation?.length > 0).length;
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
  await getReviews();
});

function selectedTable(tables){
  selected.value = tables;
  formData.value.table_id=tables.id;
  console.log(formData.value.table_id, selected)
  alert("Asztal kiválasztva!")
};

const deleteTable = async () => {
    if (!formData.value.table_id) {
    showModal('Elöszőr válasszon ki egy asztalt!', 'warning');
    return;
  }
  if (confirm('Biztosan ki szeretné törölni ezt az asztalt?')){
  try {
    await fetch(`http://localhost:3300/table/${formData.value.table_id}`, {
      method: "DELETE"
    });
    showModal('Asztal sikeresen törölve!', 'success');
  } catch (err) {
    console.error("Nem sikerült törölni:", err);
    showModal('Nem sikerült törölni!', 'error');
  }
};}

currentDate.value = new Date();
currentTime.value = new Date().toLocaleTimeString('hu-HU', { 
  hour: '2-digit', 
  minute: '2-digit',
  hour12: false 
});

currentTimeCut.value= currentTime.value.slice(0,-3);

currentDateTime.value = `${currentDate.value} ${currentTime.value}`;
console.log(currentDateTime);

currentDate.value = new Date();
currentDateCut.value = new Date().toISOString().split("T")[0];
console.log( currentDateCut.value);

const logout = () => {
  localStorage.removeItem("token");
  if (confirm('Biztosan ki szeretne jelentkezni?')) {
      showModal('Sikeresen kijelentkeztél!', 'success');}
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

const isSelectedTableBooked = computed(() => {
if (!selected.value || !dtime_from.value || !dtime_to.value) return false;
  
  const table = tabstatus.value.find(t => t.id === selected.value.id);
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
  
  const table = tabstatus.value.find(t => t.id === selected.value.id);
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
    showModal('Üzenet sikeresen törölve!', 'success');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (err) {
    console.error("Nem sikerült törölni az üzenetet:", err);
    showModal('Nem sikerült törölni az üzenetet!', 'error');
  }
};}


</script>

<template>

<header class="navbar navbar-light bg-white shadow-sm px-4 align-items-center">
      <span class="navbar-brand fs-5 "><span class="text-info fw-bold">The Table</span> Admin Felület</span>
      <div class="d-flex align-items-center gap-4">
        <div class="position-relative">

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
      <nav class="nav flex-column d-flex d-md-block justify-content-center">
        <div class="mb-3">
        <a href="#Asztalok" class="nav-link text-white"><i class="fa fa-chair me-2"></i> Asztalok kezelése</a>
        <a href="#Foglalasok" class="nav-link text-white"><i class="fa fa-calendar-alt me-2"></i> Foglalások</a>
        <a href="#Rendelesek" class="nav-link text-white"><i class="fa fa-clipboard-list me-2"></i> Rendelések</a>
        <a href="#Uzenetek" class="nav-link text-white"><i class="fa-solid fa-envelope me-2"></i> Üzenetek</a>
        <a href="#Foglalas" class="nav-link text-white"><i class="fa fa-user me-2"></i> Új foglalás</a>
        <a href="#Naptar" class="nav-link text-white"><i class="fa fa-calendar-alt me-2"></i> Naptár</a>
        <a href="#Velemenyek" class="nav-link text-white"><i class="fa fa-comment-alt me-2"></i>Vélemények</a>
        <a href="#Felhasznalok" class="nav-link text-white"><i class="fa fa-user me-2"></i>Felhasználók kezelése</a>

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
                  <form id="myForm" @submit.prevent="tableAdd">
                    <div class="mb-3">
                      <label for="name" class="form-label">Kapacitás</label>
                      <input type="text" class="form-control" id="name" required v-model="formData.capacity">
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Bezár</button>
                  <button type="submit" class="btn btn-primary" form="myForm">Elküld</button>
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
                <!--<button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#myUpdateModal"  ><i class="fas fa-pen"></i></button>-->
                <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#myUpdateModal" @click.stop="formData.table_id = tables.id; formData.capacity = tables.capacity;" ><i class="fas fa-pen"></i></button>  
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
                              <label for="capacity" class="form-label">Kapacitás</label>
                              <input type="text" class="form-control" id="capacity" required v-model="formData.capacity">
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
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#messageModal"><i class="fas fa-plus"></i> Új Üzenet</button>
          <div class="modal fade" id="messageModal" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Üzenet küldése</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div class="mb-3">
                  <label class="form-label" for="cinzett">Címzett</label>
                  <select class="form-select" id="cimzett" v-model="selectedUser">
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
                  <label for="uzenet" class="form-label">Üzenet</label>
                  <textarea id="uzenet" class="form-control" rows="4" v-model="messageText"></textarea>
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
        <div class="card-body p-3 d-flex flex-wrap gap-2" style="max-height:350px; overflow-y:auto;" v-for="notification in notifications" @click="selectedNotification(notification)">
          <!-- Egy üzenet -->
          <div class="d-flex align-items-center justify-content-between gap-3 p-3 border-bottom border-light bg-light rounded mb-2 hover-overlay" v-if="notification.user_id === me.id">
            <div class="bg-info text-white rounded d-flex align-items-center justify-content-center" style="width:40px; height:40px;">
              <i class="fas fa-exclamation-circle"></i>
            </div>
            <div v-for="user in users" :key="user.id">
            <div class="d-flex flex-column flex-grow-1" @click.stop v-if="notification.user_id === me.id && notification.sender_id === user.id" >
              <h4 class="h6 mb-1">{{ user.name }}</h4>
              <p class="mb-1 small text-muted">{{ notification.message }}</p>
            </div>
            <button class="btn btn-outline-secondary btn-sm" v-if="notification.sender_id === user.id && user.id != me.id" @click.stop="selectedNotification(notification),deleteNotification()"><i class="fas fa-trash"></i></button>
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
              <select id="tableNumber" class="form-select" v-model="formData.table_id" @change.stop="selectedTable(table.find(t => t.id === Number(formData.table_id)))">
                <option  value="">Válasszon Asztalt</option>
                <option  v-for="tables in table" :value="tables.id" :key="tables.id"  >{{tables.id}}</option>
              </select>
            </div>
        <div class="mb-3">
          <label for="date" class="form-label">Foglalás időpontja</label>
          <input type="date" id="date" class="form-control" :min="currentDateCut" required v-model="date">
        </div>
        <div class="row mb-3">
          <div class="col" >
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
              <option value="" disabled>{{ timeSlots.length ? 'Válassz időpontot' : (date === currentDateCut ? 'Már lezárultak a mai időpontok' : 'Először válassz dátumot') }}</option>
              <option v-for="slot in timeSlots" :key="slot" :value="slot">{{ slot }}</option>
            </select>
          </div>

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
              autocomplete="name"
              pattern="^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+( [A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$"
              title="Kérjük, adjon meg legalább két nevet, csak betűkkel." 
              >
        </div>
        <div v-if="selected && isSelectedTableBooked" class="alert alert-danger p-3 mb-3">
          <i class="fas fa-exclamation-triangle me-2"></i>
          <strong>Asztal foglalt!</strong><br>
          <span v-if="overlappingReservation">
            Ütközés: 
          <strong>{{ formatTime(overlappingReservation.dtime_from) }} - {{ formatTime(overlappingReservation.dtime_to) }}</strong></span>
          <span>Kérjük válasszon másik időpontot!!</span></div>
        <button type="submit" v-else class="btn btn-primary w-100" @click.prevent="reservationAdd()">Foglalás megerősítése</button>
      </form>
    </div>
    </div>

      <!-- Nyitvatartási Idők -->
      <div class="card mb-4 shadow-sm">
        <div class="card-header d-flex justify-content-between align-items-center">
          <h2 class="card-title mb-0">Nyitvatartási Idők</h2>
          <div>
            <button type="button" class="btn btn-outline-primary btn-sm me-2" data-bs-toggle="modal" data-bs-target="#editHoursModal"><i class="fas fa-edit"></i> Új Nyitvatartás</button>
              <div class="modal fade" id="editHoursModal" tabindex="-1">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h5 class="modal-title">Nyitvatartás hozzáadás</h5>
                      <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                      <form id="editHoursForm" @submit.prevent="openingHoursAdd">
                      <div class="mb-3">
                        <label for="nap" class="form-label">Nap kiválasztása</label>
                        <select id="nap" class="form-select" v-model="formData.day_of_week">
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
                        <label for="nyitas" class="form-label">Nyitás ideje</label>
                        <select id="nyitas" class="form-select" v-model.number="formData.open_time">
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
                        <label for="zaras" class="form-label">Zárás ideje</label>
                        <select id="zaras" class="form-select" v-model.number="formData.close_time">
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
                      </form>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        Mégse
                      </button>
                      <button type="button" class="btn btn-primary" form="editHoursForm">
                        Küldés
                      </button>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        <div class="card-body">
          <div class="list-group">
            <div class="d-flex justify-content-between align-items-center border-bottom py-2" v-for="openningHour in openningHours" :key="openningHour.id" @click.prevent="selectedOpeningHours(openningHour)">
              <span class="fw-medium">{{openningHour.day_of_week}}</span>
              <span v-if="openningHour.open_time === 0 && openningHour.close_time === 0">Zárva</span>
              <span class="text-muted" contenteditable="false">{{openningHour.open_time}}:00 - {{ openningHour.close_time }}:00</span>
            
            <button class="btn btn-outline-secondary btn-sm" @click="deleteOpeningHours"><i class="fas fa-trash"></i></button>
            <div>
            <button type="button" class="btn btn-outline-secondary btn-sm" data-bs-toggle="modal" data-bs-target="#updateHoursModal" @click="openUpdateHoursModal" ><i class="fas fa-pen"></i></button>
            </div>
          </div>

            <div class="modal fade" id="updateHoursModal" tabindex="-1">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title">Nyitvatartás Módositása</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                  </div>
                  <div class="modal-body">
                    <form id="updateHoursForm" @submit.prevent="openningHoursUpdate">
                    <div class="mb-3">
                      <label for="napkivalaszt" class="form-label">Nap kiválasztása</label>
                      <select id="napkivalaszt" class="form-select"  v-if="selectedHour">
                        <option value="">{{selectedHour?.day_of_week}}</option>
                      </select>
                    </div>
                    <div class="mb-3">
                      <label for="nyitasido" class="form-label">Nyitás ideje</label>
                      <select id="nyitasido" class="form-select" @click.stop v-model.number="formData.open_time">
                        <option value="">Válasszon időpontot</option>
                        <option :value="0">ZÁRVA</option>
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
                        <option :value="0">ZÁRVA</option>
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
                    </form>
                    </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                      Mégse
                    </button>
                    <button type="button" class="btn btn-primary" form="updateHoursForm">
                      Küldés
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      </div>
        <div class="card mb-4 shadow-sm col-md-12 col-lg-12 vh=20" id="Naptar">
          <vue-cal          
          :events="events || []"
          active-view="day"
          :time-from="11 * 60" :time-to="24 * 60" :time-step="30"
          @view-change="(e) => console.log('view-change', e)"/>
        </div>

        <!--Vélemények kezelése-->
        <div class="card mb-4 col-md-12 col-lg-12" id="Velemenyek" style="height: 25rem;">
        <div class="card-header">
          <h2 class="mb-0">Vélemények kezelése</h2>
          <span v-if="reviews.length" class="ms-2 small text-muted">(Átlag: {{ averageRating }}★)</span>
        </div>
        <div class="card-body table-responsive ">
          <table class="table table-hover overflow-auto">
            <thead >
              <tr>
                <th>Név</th>
                <th>Értékelés</th>
                <th>Üzenet</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody v-for="review in reviews" :key="review.id">
              <tr @click.prevent="selectedReview(review)">
                <td><span v-if="users.some(u => u.id === review.user_id)">{{users.find(u => u.id === review.user_id).name}}</span><span v-else>{{review.name}}</span></td>
                <td ><span>{{review.rating}}<span class="text-warning" style="font-size:1rem;">&#9733;</span></span></td>
                <td>{{review.comment}}</td>
                <td>
                  <button class="btn btn-outline-secondary btn-sm" @click.stop="deleteReview"><i class="fas fa-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!--Felhasználok kezelése-->
      <div class="card mb-4 col-md-12 col-lg-12" id="Felhasznalok" style="height: 25rem;">
        <div class="card-header">
          <h2 class="mb-0">Felhasználok</h2>
        </div>
        <div class="card-body table-responsive ">
          <table class="table table-hover overflow-auto">
            <thead >
              <tr>
                <th>Név</th>
                <th>E-mail cim</th>
                <th>Telefonszám</th>
                <th>Műveletek</th>
              </tr>
            </thead>
            <tbody v-for="user in users" :key="user.id">
              <tr >
                <td><span>{{user.name}}</span></td>
                <td ><span>{{user.email}}</span></td>
                <td>{{user.phone}}</td>
                <td>
                    <select class="form-select" @change.prevent="selectedUserForDelete(user); userUpdate()" v-model="formData.role">
                    <option value="">{{user.role}}</option>
                    <option v-if="user.role === 'ADMIN' || user.role === 'LETILTVA'" value="USER">USER</option>
                    <option v-if="user.role === 'LETILTVA' || user.role === 'USER'" value="ADMIN">ADMIN</option>
                    <option v-if="user.role === 'ADMIN' || user.role === 'USER'" value="LETILTVA">Letiltva</option>
                    </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="modal fade" tabindex="-1" ref="modalRef">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div
              class="modal-header"
              :class="{
                'bg-success text-white': modalType === 'success',
                'bg-danger text-white': modalType === 'error',
                'bg-warning text-dark': modalType === 'warning',
                'bg-info text-white': modalType === 'info'
              }"
            >
              <h5 class="modal-title">Rendszerüzenet</h5>
              <button class="btn-close" data-bs-dismiss="modal"></button>
            </div>
          
            <div class="modal-body">
              {{ modalMessage }}
            </div>
          
            <div class="modal-footer">
              <button
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Mégse
              </button>
            
              <button
                v-if="modalConfirmAction"
                class="btn btn-danger"
                data-bs-dismiss="modal"
                @click="modalConfirmAction()"
              >
                Igen
              </button>
            
              <button
                v-else
                class="btn btn-primary"
                data-bs-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
 </div>
</div>

</template>