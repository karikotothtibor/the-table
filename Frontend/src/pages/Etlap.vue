<script setup>
import { ref, computed } from "vue";

const token = ref(localStorage.getItem('token'));

const isLoggedIn = computed(() => !!token.value)
</script>
<template>
<!-- Felső sáv -->
    <header id="header">
   <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4">
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
              <li class="nav-item"><RouterLink class="nav-link" to="/etlap">Étlap</RouterLink></li>
              <li class="nav-item"><RouterLink class="nav-link" to="/reservation">Foglalás</RouterLink></li>
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

    <main class="container pb-5">

      <!-- Előételek -->
      <section class="menu-section">
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
          li class="list-group-item d-flex justify-content-between align-items-start">
            <div class="me-4 flex-grow-1">
              <div class="dish-name">Cafe gourmand</div>
              <div class="dish-desc">Presszó kávé vagy cappucino a ház süteményeinek válogatásából .</div>
            </div>
            <div class="dish-price">2 400 Ft</div>
          </li>
        </ul>
      </section>

      <!-- Köretek -->
      <section class="menu-section">
        <h2>Köretek</h2>
        <ul class="list-group menu-list">
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Házi hasábburgonya</span>
            <span class="dish-price">1 200 Ft</span>
          </li>
          <li class="list-group-item d-flex justify-content-between">
            <span class="dish-name">Grillezett zöldségmix</span>
            <span class="dish-price">1 600 Ft</span>
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
        </ul>
      </section>

    </main>
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