<script setup>
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

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

const formData = defineModel({
    default:{
      table_id: 0,
      status_id: 0,
      dtime_from: "",
      dtime_to: "",
      number_of_customers: 0
    }
});

function reservationAdd() {
    fetch("http://localhost:3300/reservationadd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        table_id: formData.value.table_id,
        status_id: formData.value.status_id,
        dtime_from: formData.value.dtime_from,
        dtime_to: formData.value.dtime_to,
        number_of_customers: formData.value.number_of_customers
    })
  })
}

onMounted(()=>{
  getUser(),
  getTable()
});
</script>
<template>


    <!-- Fejléc -->
    <header id="header">
   <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top">
        <div class="container">
          <RouterLink class="navbar-brand d-flex align-items-center" to="/">
            <i class="fa-solid fa-utensils me-2"></i>
            <span class="fw-bold text-info">The Table</span>
          </RouterLink>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item"><RouterLink class="nav-link" to="/">Főoldal</RouterLink></li>
              <li class="nav-item"><a class="nav-link" href="#about">Rólunk</a></li>
              <li class="nav-item"><a class="nav-link" href="#menu">Étlap</a></li>
              <li class="nav-item"><a class="nav-link" href="#reservation">Foglalás</a></li>
              <li class="nav-item"><a class="nav-link" href="#contact">Kapcsolat</a></li>
            </ul>
          </div>
        </div>
</nav>

</header>

<!-- HERO -->
<section class=" bg-dark text-light py-5 mt-5 text-start" style="background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1470&q=80') center/cover;">
  <div class="container text-info">
    <h1 class="display-3 mb-3">Vendégszeretet az első helyen</h1>
    <p class="lead">Válassza ki az Önnek tetsző asztalt és foglalja le ideális időpontjában</p>
  </div>
   <div class="row mt-5 text-center">         
          <div class="col"><span class="h2 text-warning" v-for="tables in table">{{ tables }}</span><br />Összes asztal</div>
          <div class="col"><span class="h2 text-warning">4</span><br />Szabad asztal</div>
          <div class="col"><span class="h2 text-warning">12</span><br />Foglalt asztal</div>
        </div>
</section>

<!-- FŐ TARTALOM -->
<div class="container my-5">
  <h2 class="text-center text-primary mb-5">Éttermi Elrendezés</h2>

  <div class="row g-4">
    <div class="col-lg-8">
      <div class="border rounded p-4 shadow-sm bg-light">
        <h5 class="text-center mb-3">Asztalok</h5>
        <div class="position-relative d-flex flex-wrap gap-3 justify-content-center" style="min-height:600px;">
               <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:20px; left:20px;  width: 100px; height: 100px;">
                1 <br> 4 fő
              </div>
              <div class="table-card bg-warning text-dark p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:220px; left:20px; width: 100px; height: 100px;">
                2 <br> 6 fő
              </div>
               <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:420px; left:20px; width: 100px; height: 100px;">
                3 <br> 6 fő
              </div>
              <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:20px; right:20px;  width: 100px; height: 100px;">
                4 <br> 4 fő
              </div>
              <div class="table-card bg-warning text-dark p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:220px; right:20px; width: 100px; height: 100px;">
                5 <br> 6 fő
              </div>
               <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:420px; right:20px; width: 100px; height: 100px;">
                6 <br> 6 fő
              </div>
              <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:30px; justify-content: center; width: 100px; height: 100px;">
                7 <br> 6 fő
              </div>
              <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:230px; justify-content: center;  width: 100px; height: 100px;">
                8 <br> 4 fő
              </div>
              <div class="table-card bg-warning text-dark p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:430px; justify-content: center; width: 100px; height: 100px;">
                9 <br> 6 fő
              </div>
               <div class="table-card bg-success text-white p-3 rounded position-absolute shadow d-flex justify-content-center align-items-center" style="top:610px; justify-content: center; width: 100px; height: 100px;">
                10 <br> 6 fő
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
      <div>
        <h5 class="mb-1">3-as asztal</h5>
        <p class="mb-0 small opacity-75">Max. 4 vendég</p>
      </div>
    </div>

    
      <form class="bg-white p-4 rounded shadow-sm sticky-top">
        <h4 class="text-primary mb-5">Asztalfoglalás</h4>
        <div class="mb-3">
          <label for="date" class="form-label">Foglalás időpontja</label>
          <input type="date" id="date" class="form-control">
        </div>
        <div class="row">
          <div class="col">
            <label for="time" class="form-label">Időpont</label>
            <select id="time" class="form-select">
              <option>17:00</option>
              <option>18:00</option>
              <option>19:00</option>
              <option>20:00</option>
              <option>21:00</option>
            </select>
          </div>
          <div class="col">
            <label for="guests" class="form-label">Vendégek száma</label>
            <select id="guests" class="form-select" v-model="formData.number_of_customers">
              <option>2 fő</option>
              <option>4 fő</option>
            </select>
          </div>
        </div>
        <div class="mb-3">
          <label for="name" class="form-label">Teljes név</label>
          <input type="text" id="name" class="form-control" placeholder="Kovács István">
        </div>
        <div class="mb-5">
          <label for="notes" class="form-label">Különleges kérések</label>
          <textarea id="notes" class="form-control" placeholder="Kérjük, írja le speciális igényeit..." rows="3"></textarea>
        </div>
        <button class="btn btn-primary w-100" @click="reservationAdd">Foglalás megerősítése</button>
      </form>
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
                <li>Szerda: 11:00 - 22:00</li>
                <li>Csütörtök: 11:00 - 22:00</li>
                <li>Péntek: 11:00 - 22:00</li>
                <li>Szombat: 11:00 - 24:00</li>
                <li>Vasárnap: 11:00 - 23:00</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>




</template>
<style>
</style>