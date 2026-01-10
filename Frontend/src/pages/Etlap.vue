<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const user = ref([]);
const me = ref([]);
const openningHours = ref([]);
const modalRef = ref(null);
const modalMessage = ref('');
const modalType = ref('error');

const token = ref(localStorage.getItem('token'));

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
        modalShow('A munkamenet lejárt, kérjük jelentkezz be újra!', 'warning');
        return;
      }
      throw new Error(`HTTP hiba! státusz: ${response.status}`);
    }
    
    const userData = await response.json();
    me.value = userData;
    
    console.log("Bejelentkezett user:", userData);
    
    // User ID automatikus beállítása
    if (me.value && me.value.id) {
      console.log("User ID beállítva:", me.value.id);
    } else {
      console.warn("User adatok hiányoznak");
    }
  } catch (error) {
    console.error("Hiba a user lekérésekor:", error);
    modalShow('Hiba a felhasználói adatok betöltésekor!', 'error');
  }
}

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

const isLoggedIn = computed(() => !!token.value)

onMounted(async() => {  
 await getUser();
 await getMe();
 await getOpenningHours() 
});

const handleLogout = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false;
  token.value = null;
  modalShow('Kijelentkeztél!', 'success');
};

</script>
<template>
      <Header 
    :me="me"
    :user="user" 
    :is-logged-in="isLoggedIn" 
    :handle-logout="handleLogout"
    />

    <main class="container pb-5">

      <!-- Előételek -->
      <section class="menu-section mt-5">
        <h2>Előételek</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Paradicsomos bruschetta</div>
              <div class="dish-desc">Friss paradicsom, bazsalikom, extra szűz olívaolaj.</div>
              <span class="menu-badge mt-1">Vegetáriánus</span>
            </div>
            <div class="dish-price">2 400 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Fokhagymakrémleves</div>
              <div class="dish-desc">Selymes leves pirított mandulával és krutonnal.</div>
            </div>
            <div class="dish-price">2 100 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Vargányakrémleves baconmorzsával</div>
              <div class="dish-desc">Erdei leves pirított bacondarabokkal.</div>
            </div>
            <div class="dish-price">2 500 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Eperkrémleves</div>
              <div class="dish-desc">joghurttal krémesítve, vanília fagyival, tejszínhabbal.</div>
            </div>
            <div class="dish-price">2 200 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Fűszeres haltepertő kerti zöldségekkel, bagettel</div>
              <div class="dish-desc">Ropogósra sült bundázott harcsacsíkok, párolt zöldségekkel, vajas bagettel.</div>
            </div>
            <div class="dish-price">3 500 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Sült camembert</div>
              <div class="dish-desc">Párolt áfonyamártással és pirított dióval.</div>
              <span class="menu-badge mt-1">Laktovegetáriánus</span>
            </div>
            <div class="dish-price">2 800 Ft</div>
          </li>
        </ul>
      </section>

      <!-- Főételek -->
      <section class="menu-section">
        <h2>Főételek</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Rozmaringos csirkemell</div>
              <div class="dish-desc">Grillezett csirke rozmaringgal, citrommal és zöldségekkel.</div>
            </div>
            <div class="dish-price">4 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Ropogós kacsacomb párolt vöröskáposztával, pirított gnocchival</div>
              <div class="dish-desc">Fűszeres kacsa és almás-pezsgős káposzta, kis itáliai csavarral.</div>
            </div>
            <div class="dish-price">5 200 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Kacsamáj falatok</div>
              <div class="dish-desc">Pikáns vadas mártásban, szalvétagombóccal, tejföl díszítéssel.</div>
            </div>
            <div class="dish-price">4 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Marhapofa pörkölt</div>
              <div class="dish-desc">8 órán át lassú tűzön főtt vörösboros szafttal.</div>
            </div>
            <div class="dish-price">5 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Proseccós rizottó aszalt paradicsommal, sonkacsíkokkal</div>
              <div class="dish-desc">Olasz klasszikus parmai stílusban.</div>
            </div>
            <div class="dish-price">3 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Lazac Wellington</div>
              <div class="dish-desc">Töltött leveles tésztában sült lazac spenóttal.</div>
            </div>
            <div class="dish-price">6 800 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Erdei gombás szarvasragu sztrapacskával</div>
              <div class="dish-desc">Gombás tejfölős vadragu juhtúrós, kapros sztrapacskával.</div>
            </div>
            <div class="dish-price">5 300 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Vega ratatouille</div>
              <div class="dish-desc">Provence-i zöldségleves polentával.</div>
            <span class="menu-badge mt-1">Vegán</span>
            </div>
            <div class="dish-price">4 200 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Töltött paprika gazdagon</div>
              <div class="dish-desc">Erdei gombákkal, sós burgonya krémmel, krémes paradicsomszósszal.</div>
            <span class="menu-badge mt-1">Vegán</span>
            </div>
            <div class="dish-price">3 800 Ft</div>
          </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Zalai dödölle</div>
              <div class="dish-desc">juhtúró, tejföl, pácolt lilahagyma, hagymakrém, sült hagyma.</div>
            <span class="menu-badge mt-1">Vegán</span>
            </div>
            <div class="dish-price">2 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Margherita Pizza</div>
              <div class="dish-desc">A klasszikus pizza friss mozzarellával, paradicsommal és bazsalikommal.</div>
            </div>
            <div class="dish-price">2 850 Ft</div>
          </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Spaghetti Carbonara</div>
              <div class="dish-desc">Finom spaghetti krémes carbonara szósszal és baconnel.</div>
            </div>
            <div class="dish-price">3 200 Ft</div>
          </li>
        </ul>
      </section>

      <!-- Desszertek -->
      <section class="menu-section">
        <h2>Desszertek</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Csokoládé szuflé</div>
              <div class="dish-desc">Olvadós belsejű 70% kakaós desszert fagyival.</div>
            </div>
            <div class="dish-price">2 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Somlói galuska</div>
              <div class="dish-desc">Házi diós piskóta rumos csokiszósszal.</div>
            </div>
            <div class="dish-price">2 700 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Panna cotta gyümölcsvelővel</div>
              <div class="dish-desc">Tejszínes pohárkrém erdei gyümölcsszósszal.</div>
            </div>
            <div class="dish-price">2 200 Ft</div>
          </li>
           <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Belga csokis brownie vanília sodóval</div>
              <div class="dish-desc">Csokoládés ízbomba hűvös vaníliaöntettel .</div>
            </div>
            <div class="dish-price">2 500 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Sült almáspite</div>
              <div class="dish-desc">Fahéjas krémmel és vaníliafagylalttal.</div>
              <span class="menu-badge mt-1">Laktovegetáriánus</span>
            </div>
            <div class="dish-price">2 400 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Cafe gourmand</div>
              <div class="dish-desc">Presszó kávé vagy cappucino a ház süteményeinek válogatásából .</div>
            </div>
            <div class="dish-price">2 400 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Tiramisu</div>
              <div class="dish-desc">Gazdag és krémes olasz desszert mascarpone-val és eszpresszóval.</div>
            </div>
            <div class="dish-price">2 800 Ft</div>
          </li>
        </ul>
      </section>

      <!-- Köretek -->
      <section class="menu-section">
        <h2>Köretek</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Házi fűszeres hasábburgonya</span>
            <span class="dish-price">1 200 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Grillezett zöldségmix</span>
            <span class="dish-price">1 600 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Párolt rizsgombócok zöldborsóval és sárgarépával</span>
            <span class="dish-price">1 300 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Burgonyapüré</span>
            <span class="dish-price">1 100 Ft</span>
          </li>
           <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Fűszeres édesburgonya hasábok</span>
            <span class="dish-price">1 200 Ft</span>
          </li>
           <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Bajor káposzta</span>
            <span class="dish-price">1 400 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Rizs pilaf</span>
            <span class="dish-price">1 300 Ft</span>
          </li>
        </ul>
      </section>

      <!-- Saláták -->
      <section class="menu-section">
        <h2>Saláták</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Cézár saláta csirkemell csíkokkal</div>
              <div class="dish-desc">Római saláta, grillezett csirke, parmezán, kruton.</div>
            </div>
            <div class="dish-price">3 200 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Görög falatkák</div>
              <div class="dish-desc">Feta, olívabogyó, paradicsom, uborka, hagyma.</div>
              <span class="menu-badge mt-1">Vegetáriánus</span>
            </div>
            <div class="dish-price">3 000 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Coleslaw saláta</div>
              <div class="dish-desc">Káposzta, sárgarépa, sonkahagyma, fűszeres salátaöntet.</div>
              <span class="menu-badge mt-1">Vegetáriánus</span>
            </div>
            <div class="dish-price">3 000 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Rukkola parmezánnal</div>
              <div class="dish-desc">Balzsamecet, dió, szárított paradicsom.</div>
              <span class="menu-badge mt-1">Vegetáriánus</span>
            </div>
            <div class="dish-price">2 900 Ft</div>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Paradicsomsaláta</div>
              <div class="dish-desc">Balzsamecet, paradicsom, fokhagyma, sonkahagyma.</div>
              <span class="menu-badge mt-1">Vegetáriánus</span>
            </div>
            <div class="dish-price">2 500 Ft</div>
          </li>
                    <li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Svéd uborkasaláta</div>
              <div class="dish-desc">Balzsamecet, uborka, fokhagyma, sárgarépa.</div>
              <span class="menu-badge mt-1">Vegetáriánus</span>
            </div>
            <div class="dish-price">2 400 Ft</div>
          </li>
        </ul>
      </section>

      <!-- Italok -->
      <section class="menu-section">
        <h2>Italok</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Cola / Fanta / Sprite (0,33l)</span>
            <span class="dish-price">800 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Ásványvíz szénsavval / anélkül (0,5l)</span>
            <span class="dish-price">600 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Friss narancslé (0,2l)</span>
            <span class="dish-price">1 200 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Házi limonádé (0,33l)</span>
            <span class="dish-price">1 000 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Alkoholmentes gyümölcsfröccs (0,33l)</span>
            <span class="dish-price">1 100 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Alkoholmentes sör (0,5l)</span>
            <span class="dish-price">1 200 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Fröccs száraz fehérborból (0,5l)</span>
            <span class="dish-price">1 300 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">A ház vörösbora</span>
            <span class="dish-price">350 Ft/dl</span>
          </li>
        </ul>
      </section>

    </main>
    <Footer :openning-hours="openningHours" />
</template>
<style>
:root {
        --turquoise-primary: #0d9488;
        --turquoise-light: #a7f3d0;
        --turquoise-dark: #064e3b;
      }

      body {
        background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        min-height: 100vh;
      }

      .menu-section {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 3rem 2.5rem;
        box-shadow: 
          0 25px 50px rgba(0,0,0,0.12),
          0 0 0 1px rgba(255,255,255,0.3),
          inset 0 1px 0 rgba(255,255,255,0.8);
        margin-bottom: 2.5rem;
        border: 1px solid rgba(13, 148, 136, 0.15);
        transition: all 0.3s ease;
      }

      .menu-section:hover {
        transform: translateY(-4px);
        box-shadow: 
          0 35px 70px rgba(0,0,0,0.18),
          0 0 0 1px rgba(255,255,255,0.5);
      }

      .menu-section h2 {
        font-weight: 700;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        font-size: 0.85rem;
        color: var(--turquoise-primary);
        margin-bottom: 2rem;
        position: relative;
      }

      .menu-section h2::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 3px;
        background: linear-gradient(90deg, var(--turquoise-primary), var(--turquoise-light));
        border-radius: 2px;
      }

      .menu-section h2 span {
        font-size: 1.6rem;
        text-transform: none;
        display: block;
        color: #1f2937;
        font-weight: 600;
        margin-top: 0.25rem;
      }

      .menu-list .list-group-item {
        border: 0;
        border-bottom: 1px solid rgba(13, 148, 136, 0.1);
        padding: 1.25rem 0.5rem;
        background: transparent;
        transition: all 0.25s ease;
        position: relative;
      }

      .menu-list .list-group-item::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 0;
        background: var(--turquoise-primary);
        transition: height 0.25s ease;
        border-radius: 2px;
      }

      .menu-list .list-group-item:hover::before {
        height: 100%;
      }

      .menu-list .list-group-item:hover {
        background: rgba(13, 148, 136, 0.05);
        padding-left: 1rem;
        border-radius: 8px;
        margin: 0 -0.5rem;
      }

      .menu-list .list-group-item:last-child {
        border-bottom: 0;
      }

      .dish-name {
        font-weight: 700;
        font-size: 1.05rem;
        color: #111827;
        margin-bottom: 0.25rem;
      }

      .dish-desc {
        font-size: 0.92rem;
        color: #6b7280;
        line-height: 1.5;
      }

      .dish-price {
        font-weight: 800;
        font-size: 1.1rem;
        color: var(--turquoise-primary);
        white-space: nowrap;
      }

      .menu-badge {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        background: var(--turquoise-light);
        color: var(--turquoise-dark);
        padding: 0.25rem 0.6rem;
        border-radius: 12px;
        font-weight: 600;
      }

      .menu-header {
        background: linear-gradient(135deg, var(--turquoise-primary) 0%, var(--turquoise-dark) 100%);
        color: #fff;
        padding: 2.5rem 0;
        margin-bottom: 3rem;
        box-shadow: 0 20px 40px rgba(13, 148, 136, 0.3);
        border-radius: 0 0 24px 24px;
      }

      .menu-header-title {
        font-weight: 500;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-size: 1rem;
        opacity: 0.9;
      }

      .menu-header-subtitle {
        font-size: 2.2rem;
        font-weight: 700;
        letter-spacing: -0.02em;
      }

      @media (max-width: 576px) {
        .menu-section {
          padding: 2rem 1.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
        }
        
        .menu-header-subtitle {
          font-size: 1.8rem;
        }
      }
</style>