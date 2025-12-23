<script setup>
import { onMounted, ref, computed, warn } from "vue";
import 'vue3-carousel/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import {RouterLink} from 'vue-router';
import { Alert } from "bootstrap";


const reviews = ref();
//const reviewslogout = ref();
const user = ref([]);
const me = ref([]);
const reservation = ref([]);
const token = ref(localStorage.getItem('token'));
const reserv = [];
const openningHours = ref([]);


async function getReviews() {
  try {
    const res1 = await fetch("http://localhost:3300/review");
    const data1 = await res1.json();

    const res2 = await fetch("http://localhost:3300/reviewslogoutList");
    const data2 = await res2.json();

    reviews.value = data1.concat(data2);

    return reviews.value; 
  } catch (error) {
    console.error('Hiba a reviews lekérésekor:', error);
    return [];
  }
}

async function getUser () {
    try{
     const res = fetch ("http://localhost:3300/user");
      if (!res.ok) throw new Error ("Nem sikerült a felhasználót lekérni!");  
      const data = await res.json();
      user.value = data;
     }catch (error) {
      console.error(error);

     }
};
async function getMe() {
  if (!token.value) {
    console.log("Nincs token, user nem tölthető be");
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
        alert("A munkamenet lejárt, kérjük jelentkezz be újra!");
        return;
      }
      throw new Error(`HTTP hiba! státusz: ${response.status}`);
    }
    
    const userData = await response.json();
    me.value = userData;
    
    console.log("Bejelentkezett user:", userData);
    
    // User ID automatikus beállítása
    if (me.value && me.value.id) {
      formData.value.user_id = me.value.id;
      console.log("User ID beállítva:", me.value.id);
    } else {
      console.warn("User adatok hiányoznak");
    }
  } catch (error) {
    console.error("Hiba a user lekérésekor:", error);
    alert("Hiba a felhasználói adatok betöltésekor!");
  }
}

async function getReservation() {
    try{
     const response = await fetch ("http://localhost:3300/reservation");
      if (!response.ok) throw new Error ("Nem sikerült a foglalást lekérni!");  
      const data = await response.json();
      reservation.value = data;
      
      for (let index = 0; index < reservation.value.length; index++) {
      if (reservation.value[index].user_id === me.value.id) {
        console.log("Van foglalás az userID-hez")
        reserv.push(reservation.value[index]);
      } else {
        console.log("Nincs foglalás az IDhez")
      };
    }  console.log(reserv);
    return reserv ;

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

onMounted(async() => {
 await getUser();
 await getMe();
 await getReviews();
 await getReservation()
 await getOpenningHours() 
});

const formData = ref({
    default:{
      rating: 0,
      comment: "",
      email: "",
      name: "",
    }
});

const nameRegex = /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+(\s+[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű]+)+$/

async function submitReviewForm() {
    // 1) Bejelentkezett user
  if (me.value && me.value.id > 0) {
    try {
      await fetch("http://localhost:3300/reviewsadd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: formData.value.comment,
          rating: formData.value.rating,
          reservation_id: reserv[reserv.length - 1].id,
          user_id: me.value.id, 
      }),
    });
    alert('Köszönjük az értékelést!')

    setTimeout(() => {
    window.location.reload();
  }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error('Hiba a reviewadd-nél:', err)
    alert('Nem sikerült elküldeni az értékelést.')
    }
  return
}

  // 2) NINCS bejelentkezett user → név ellenőrzés + vendég review
const name = formData.value.name?.trim() || ''
if (!nameRegex.test(name)) {
  alert('Adj meg teljes nevet (vezetéknév és keresztnév).')
  return
}

try {
  await fetch("http://localhost:3300/reviewslogoutadd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.value.name,
        email: formData.value.email,
        comment: formData.value.comment,
        rating: formData.value.rating,
      }),
  })
  alert('Köszönjük az értékelést!')
        setTimeout(() => {
        window.location.reload();
      }, 1000); // 1 másodperc múlva frissít
    } catch (err) {
      console.error('Hiba a reviewslogoutadd-nál:', err)
      alert('Nem sikerült elküldeni az értékelést.')  
  }
}

const isLoggedIn = computed(() => !!token.value)

</script>

<template>

    <!-- Fejléc -->
    <header id="header">
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
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item"><a class="nav-link" href="#home">Főoldal</a></li>
              <li class="nav-item"><a class="nav-link" href="#about">Rólunk</a></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/etlap">Étlap</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/Reservation">Foglalás</RouterLink></li>
              <li class="nav-item"><a class="nav-link" href="#contact">Kapcsolat</a></li>
              <li class="nav-item mt-2"><a class="nav-link" href=""><div >
                <p v-if="isLoggedIn">Be vagy jelentkezve ✅</p>
                <p v-else>Nem vagy bejelentkezve ❌</p>
              </div></a></li>
              
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <i class="fas fa-user-circle fa-lg "></i>
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                   <li>
                      <span class="dropdown-item-text small text-muted" v-if="isLoggedIn && user">
                        Bejelentkezve mint: <strong>{{ me.name }}</strong>
                      </span>
                    </li>
                    
                  <li><RouterLink class="dropdown-item" to="/user">Profil</RouterLink></li>
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
    
    <!-- Hero szekció -->
    <section id="home" class="vh-100 d-flex align-items-center bg-dark text-white" style="background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'); background-size:cover;">
      <div class="container text-center py-5">
        <h1 class="display-3 fw-bold" style="text-shadow: -3px -3px 2px black;">Az ízek meseszép otthona</h1>
        <p class="lead mb-4" style="text-shadow: -2px -2px 1px black;">2004 óta varázsoljuk vissza kedvenc ízeid legfinomabb megtestesülésébe saját, kiemelt receptjeink segítségével.</p>
        <router-link to="/Login" class="btn btn-info btn-lg rounded-pill text-white">
        Asztalfoglalás
      </router-link>
       
        <div class="row mt-5">
          
          <div class="col"> style="text-shadow: -2px -2px 1px black;"<span class="h2 text-warning">2004</span><br />év nyitottunk</div>
          <div class="col"> style="text-shadow: -2px -2px 1px black;"<span class="h2 text-warning">120</span><br />Elégedett vendég naponta</div>
          <div class="col"> style="text-shadow: -2px -2px 1px black;"<span class="h2 text-warning">100%</span><br />Friss alapanyagok</div>
        </div>
      </div>
    </section>
 
    
    
    <!-- Bemutatkozás szekció -->
    <section id="about" class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5 text-info">Történetünk</h2>
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h3 class="mb-4">Ízlésre hangolt megkülönböztetettség</h3>
            <p>2004-ben nyitottuk meg éttermünket azzal a céllal, hogy a budapesti vendégeink számára klasszikus ízeket kínáljunk modern, szofisztikált formában. A kezdeti években csupán 10 étellel, egy kis helyiséggel és nagyobb küzdelemmel dolgoztunk.</p>
            <div class="alert alert-warning fw-bold fst-italic my-4"> Mai napig megtartottuk az eredeti főétel lényegét, míg az elkészítés tudományának módja fejlődött az évek során.</div>
            <p>Filozófiánk egyszerű: mindig friss, helyi összetevőket használunk minden fogáshoz. Mi magunk közvetlenül dolgozunk össze helyi gyártókkal és termelőkkel, akik kölcsönös megbecsülésen alapuló kapcsolatot alakítottak ki velünk az elmúlt években.</p>
            <a href="#reviews" class="btn btn-outline-info">Írjon véleményt</a>
          </div>
          <div class="col-lg-6">
            <div id="carouselExampleDark" class="carousel carousel slide">
              <div class="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="1" aria-label="Slide 2"></button>
                <button type="button" data-bs-target="#carouselExampleDark" data-bs-slide-to="2" aria-label="Slide 3"></button>
              </div>
              <div class="carousel-inner">
                <div class="carousel-item active" data-bs-interval="1000">
                  <img src="/pictures/pexels-davideibiza-1739748.jpg" class="d-block w-100" alt="Éttermi környezet1">
                </div>
                <div class="carousel-item" data-bs-interval="1000">
                  <img src="/pictures/pexels-helenalopes-696218.jpg" class="d-block w-100" alt="Éttermi környezet2">
                </div>
                <div class="carousel-item" data-bs-interval="1000">
                  <img src="/pictures/pexels-life-of-pix-67468.jpg" class="d-block w-100" alt="Éttermi környezet3">
                </div>
              </div>
              <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Previous</span>
              </button>
              <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleDark" data-bs-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    
    <!-- Vélemény szekció -->
   <section id="reviews" class="py-5" >
      <div class="container" >
        <h2 class="text-center mb-5 text-info">Az Ön Véleménye</h2>
        <div class="card mx-auto" style="max-width:600px;">
          <div class="card-body bg-secondary-subtle" >
            <h3 class="card-title">Ossza meg tapasztalatát</h3>
            <form  @submit.prevent="submitReviewForm">
              <div class="mb-3">
                <label for="name" class="form-label" >Teljes név</label>
                <div v-if="isLoggedIn && user">
            <input 
              type="text" 
              id="name" 
              class="form-control bg-light" 
              :value="me.name" 
              readonly 
            ><small class="text-success"></small></div>
              <div v-else>
                <input type="text" class="form-control" id="name" required v-model="formData.name" > 
              </div>
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email cím</label>
                <input type="email" class="form-control" id="email" required v-model="formData.email" :readonly="me.id > 0">
              </div>
               <div class="mb-3" >
                  <div id="rating" class="d-flex mb-2" >
                    <span class="rating-star" v-for="star in 5" 
                    :key="star" 
                    :data-value="star"                    
                    :class="{'text-warning': formData.rating >= star}"
                    style="cursor:pointer;font-size:3rem;color: grey;"
                    @click="formData.rating=star"
                    >&#9733;</span>
                  </div><p class="mt-2 small text-muted">Aktuális értékelés: {{ formData.rating }}</p>
                  <input type="hidden" name="rating" id="rating-input" required v-if="formData.rating > 0" v-model="formData.rating">
                </div>

              <button type="submit" class="btn btn-info w-100" @click="formData">Vélemény Küldése</button>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!--Kommentek-->
    <section >
    <Carousel :items-to-show="3" 
    :wrap-around="true" 
    :transition="1000"  
    :autoplay="1000"
    :pause-autoplay-on-hover="true"
    :mouse-drag="true"
    :touch-drag="true"
    :mouse-wheel="{ threshold: 2 }"
    :gap="40"
    slide-effect="slide"
    breakpoint-mode="carousel"
    :breakpoints="{
      600: {
        itemsToShow: 1,
        snapAlign: 'center',
      },
      1000: {
        itemsToShow: 3,
        snapAlign: 'start',
      }
    }">
    <Slide v-for="(review) in reviews" :key="review">
       <div class="carousel-item active " style="height: 20rem;" >
          <div class="row justify-content-center">
            <div class="card mb-3 bg-secondary-subtle review-card"  style="border: 2px solid grey; height:15rem;">
              <div class="card-body d-flex flex-column shadow-bottom-sm" >
                <span class="row align-items-center positon-absolute "><i class="fas fa-user-circle fa-lg"></i></span>
                <h5 class="card-title text-center mb-3 text-info">{{ review.name }}</h5><h5 class="card-title text-center mb-3 mt-0 text-info" v-for="users in user"  v-show="review.user_id === users.id"  >{{ users.name }}</h5>
                <h6 class="card-subtitle mb-3 text-center text-warning" style="font-size:1.5rem;">
                <span v-for="star in 5" :key="star">
                <span v-if="star <= Number(review.rating)">&#9733;</span>
                </span></h6>
                <p class="card-text text-center mb-2 text-info flex-fill overflow-auto rounded-3 bg-info text-dark" style="border: 2px solid grey ; height:5rem;">{{ review.comment }}</p>
                <p class="card-text text-center mb-0 text-info">{{ review.created_at.split("T")[0] }}</p>
              </div>
            </div>
          </div>
        </div>
    </Slide>
    </Carousel>      
    </section>
    
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
                <li v-for="openningHour in openningHours" :key="openningHour.id">{{openningHour.day_of_week}}: {{ openningHour.open_time }}:00 - {{openningHour.close_time}}:00</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>     
<router-view></router-view>
</template>

<style scoped>

</style>
