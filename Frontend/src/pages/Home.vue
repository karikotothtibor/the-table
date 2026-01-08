<script setup>
import { onMounted, ref, computed, nextTick } from "vue";
import 'vue3-carousel/carousel.css';
import { Carousel, Slide } from 'vue3-carousel';
import {RouterLink} from 'vue-router';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';


const reviews = ref();
//const reviewslogout = ref();
const user = ref([]);
const me = ref([]);
const reservation = ref([]);
const token = ref(localStorage.getItem('token'));
const reserv = [];
const openningHours = ref([]);
const modalRef = ref(null);
const modalMessage = ref('');
const modalType = ref('error'); 

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
     const res = await fetch ("http://localhost:3300/user");
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
        modalShow('A munkamenet lejárt, kérjük jelentkezz be újra!','warning');
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
    modalShow('Hiba a felhasználói adatok betöltésekor!','error');
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
  if (me.value && me.value.id > 0) {
    try {
      await fetch("http://localhost:3300/reviewadd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          comment: formData.value.comment,
          rating: formData.value.rating,
          reservation_id: reserv[reserv.length - 1].id,
          user_id: me.value.id,
        }),
      })
      modalShow('Köszönjük az értékelést!','success');

      setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
    } catch (err) {
      console.error('Hiba a reviewadd-nél:', err)
      modalShow('Nem sikerült elküldeni az értékelést.','error');
    }
    return
  }

  const name = formData.value.name?.trim() || '';
  if (!nameRegex.test(name)) {
    modalShow('Adj meg teljes nevet (vezetéknév és keresztnév).','warning');
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
    modalShow('Köszönjük az értékelést!','success');

      setTimeout(() => {
      window.location.reload();
    }, 1000); // 1 másodperc múlva frissít
  } catch (err) {
    console.error('Hiba a reviewslogoutadd-nál:', err)
    modalShow('Nem sikerült elküldeni az értékelést.','error');
  }
}

const isLoggedIn = computed(() => !!token.value)

const handleLogout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false;
  token.value = null;
  modalShow('Sikeresen kijelentkeztél!','success');
};

</script>

<template>

    <!-- Fejléc -->
      <Header 
    :me="me"
    :user="user" 
    :is-logged-in="isLoggedIn" 
    :handle-logout="handleLogout"
  />
    
    <!-- Hero szekció -->
    <section id="home" class="vh-100 d-flex align-items-center bg-dark text-light " style="background-image: url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80'); background-size:cover;">
      <div class="container text-center py-5">
        <h1 class="display-3 fw-bold" style="text-shadow: -3px -3px 2px black;">Az ízek meseszép otthona</h1>
        <p class="lead mb-4" style="text-shadow: -2px -2px 1px black;">2004 óta varázsoljuk vissza kedvenc ízeid legfinomabb megtestesülésébe saját, kiemelt receptjeink segítségével.</p>
        <router-link to="/Login" class="btn btn-info btn-lg rounded-pill text-white">
        Asztalfoglalás
      </router-link>
       
        <div class="row mt-5">
          
          <div class="col" style="text-shadow: -2px -2px 1px black;"><span class="h2 text-warning" >2004</span><br />év nyitottunk</div>
          <div class="col" style="text-shadow: -2px -2px 1px black;"><span class="h2 text-warning">120</span><br />Elégedett vendég naponta</div>
          <div class="col" style="text-shadow: -2px -2px 1px black;"><span class="h2 text-warning">100%</span><br />Friss alapanyagok</div>
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
            <p>2004-ben nyitottuk meg éttermünket azzal a céllal, hogy a Szentesi vendégeink számára klasszikus ízeket kínáljunk modern, szofisztikált formában. A kezdeti években csupán 10 étellel, egy kis helyiséggel és nagyobb küzdelemmel dolgoztunk.</p>
            <div class="alert alert-warning fw-bold fst-italic my-4"> Mai napig megtartottuk az eredeti főétel lényegét, míg az elkészítés tudományának módja fejlődött az évek során.</div>
            <p>Filozófiánk egyszerű: mindig friss, helyi összetevőket használunk minden fogáshoz. Mi magunk közvetlenül dolgozunk össze helyi gyártókkal és termelőkkel, akik kölcsönös megbecsülésen alapuló kapcsolatot alakítottak ki velünk az elmúlt években.</p>
            <a href="#reviews" class="btn btn-outline-info">Írjon véleményt</a>
          </div>
          <div class="col-lg-6 shadow" >
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
              <div class="mb-3">
                <label for="review" class="form-label">Vélemény</label>
                <textarea id="review" class="form-control" rows="5" required v-model="formData.comment"></textarea>
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
                
              <button type="submit" class="btn btn-info w-100" >Vélemény Küldése</button>
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
      400: {
        itemsToShow: 2,
        snapAlign: 'start',
      },
      600: {
        itemsToShow: 3,
        snapAlign: 'center',
      },
      1000: {
        itemsToShow: 4,
        snapAlign: 'start',
      }
    }" >
    <Slide v-for="review in reviews" :key="review"  >
       <div class="carousel-item active " style="height: 20rem;" >
          <div class="row justify-content-center">
            <div class="card mb-3 bg-secondary-subtle review-card "  style="border: 2px solid grey; height:17rem;" >
              <div class="card-body d-flex flex-column shadow-bottom-sm"  >
                <span class="row align-items-center positon-absolute "><i class="fas fa-user-circle fa-lg"></i></span>
                <h5 class="card-title text-center mb-3 text-info">{{ review.name }}</h5><h5 class="card-title text-center mb-3 mt-0 text-info" v-for="users in user"  v-show="review.user_id === users.id"  >{{ users.name }}</h5>
                <h6 class="card-subtitle mb-3  text-center text-warning" style="font-size:1.5rem;">
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
    <!-- Ételek ajánlatai szekció -->
<section id="menu" class="py-5 bg-light">
  <div class="container">
    <h2 class="text-center mb-5 text-info">Éttermünk Ajánlatai</h2>
    <div class="row">
      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <img src="/pictures/margherita-pizza.jpg" class="card-img-top" alt="Margherita Pizza">
          <div class="card-body">
            <h5 class="card-title text-center">Margherita Pizza</h5>
            <p class="card-text text-center">A klasszikus pizza friss mozzarellával, paradicsommal és bazsalikommal.</p>
          </div>
        </div>
      </div>
      
      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <img src="/pictures/caesar-salad.jpg" class="card-img-top" alt="Caesar Salad">
          <div class="card-body">
            <h5 class="card-title text-center">Caesar Saláta</h5>
            <p class="card-text text-center">Friss saláta ropogós zöldségekkel, Caesar öntettel és pirított kenyérkockákkal.</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <img src="/pictures/spaghetti-carbonara.jpg" class="card-img-top" alt="Spaghetti Carbonara">
          <div class="card-body">
            <h5 class="card-title text-center">Spaghetti Carbonara</h5>
            <p class="card-text text-center">Finom spaghetti krémes carbonara szósszal és baconnel.</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card mb-4 shadow-sm">
          <img src="/pictures/tiramisu.jpg" class="card-img-top" alt="Tiramisu">
          <div class="card-body">
            <h5 class="card-title text-center">Tiramisu</h5>
            <p class="card-text text-center">Gazdag és krémes olasz desszert mascarpone-val és eszpresszóval.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
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
        <button class="btn-close" data-bs-dismiss="modal"></button>
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

    
    
    <!-- Lábléc -->
   <Footer :openning-hours="openningHours" />    
<router-view></router-view>
</template>

<style scoped>
#menu .card {
  border: 2px solid #ddd;
  border-radius: 8px;
  height: 400px;
}

#menu .card-img-top {
  height: 200px;
  object-fit: cover;
}

#menu .card-body {
  padding: 15px;
}

#menu .card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

#menu .card-text {
  font-size: 1rem;
  color: #555;
}

#menu .row {
  display: flex;
  justify-content: space-between;
}

#menu .col-md-3 {
  margin-bottom: 20px;
}
</style>