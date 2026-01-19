<script setup>
import { RouterLink } from 'vue-router';

defineProps({
  openningHours: Array
});
</script>

<template>
  <footer class="bg-info text-white py-5" id="footer">
    <div class="container text-center">
      <div class="mb-3">
        <i class="fa-solid fa-utensils fa-2x"></i>
        <span class="h4 ms-2 fw-bold text-outline ">The Table</span>
      </div>
      <nav class="mb-3">
       <RouterLink class="text-white mx-2" to="/">Főoldal</RouterLink>
        <RouterLink class="text-white mx-2" to="/#about">Rólunk</RouterLink>
        <RouterLink class="text-white mx-2" to="/etlap">Étlap</RouterLink>
        <RouterLink class="text-white mx-2" to="/reservation">Asztalfoglalás</RouterLink>
        <RouterLink class="text-white mx-2" to="/#contact">Kapcsolat</RouterLink>
      </nav>
      <!-- Social icons -->
      <div class="mb-3">
        <a href="#" class="text-white mx-1"><i class="fab fa-facebook-f"></i></a>
        <a href="#" class="text-white mx-1"><i class="fab fa-instagram"></i></a>
        <a href="#" class="text-white mx-1"><i class="fab fa-tripadvisor"></i></a>
        <a href="#" class="text-white mx-1"><i class="fab fa-twitter"></i></a>
      </div>
      <div id="#contact">
        <h4 class="fw-bold text-outline">Kapcsolat</h4>
        <p >Tel.: 06-30/567-4837</p>
        <p>E-mail: <a href="mailto:thetable@gmail.com"> thetable@gmail.com</a></p>
        <p>Cím: 6600, Szentes Kossuth Lajos utca 111.</p>
      </div>
      
      <div class="container mt-4">
        <div class="row justify-content-center">
          <div class="col-auto">
            <h5 class="fw-bold text-outline">Nyitvatartás</h5>
            <ul class="list-unstyled">
              <li v-for="openningHour in openningHours" :key="openningHour.id">
                {{ openningHour.day_of_week }}:
                <span v-if="openningHour.open_time === 0 && openningHour.close_time === 0">Zárva</span>
                <span v-else>{{ openningHour.open_time }}:00 - {{ openningHour.close_time }}:00</span> 
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="small">&copy; 2004-2026 Minden jog fenntartva</div>
    </div>
  </footer>
</template>
<style>
  .text-outline {
  text-shadow: 2px 2px 3px rgb(42, 145, 134), -1px -1px 3px rgb(42, 145, 134), 1px -1px 3px rgb(42, 145, 134), -1px 1px 3px rgb(42, 145, 134), 1px 1px 3px rgb(42, 145, 134);
}
</style>