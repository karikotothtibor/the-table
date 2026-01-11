<template>
  <main class="container my-4">
    <h1>The Table Étterem – Adatvédelmi Szabályzat</h1>
    <p><strong>Utolsó frissítés:</strong> 2026. január 10.</p>

    <p>
      A The Table Étterem (továbbiakban: „Üzemeltető") elkötelezett a felhasználók személyes
      adatainak védelmében. Jelen Adatvédelmi Szabályzat (továbbiakban: „Szabályzat") meghatározza,
      hogy milyen adatokat, milyen célból, milyen módon gyűjtünk, kezelünk és védünk meg.
    </p>

    <h2>1. Üzemeltő Adatkezelési Információi</h2>
    <p>
      <strong>Név:</strong> The Table Étterem<br>
      <strong>Székhely:</strong> Szentes, Magyarország<br>
      <strong>Kapcsolattartó:</strong> info@thetable.hu
    </p>

    <h2>2. Kezelt Személyes Adatok</h2>
    <p>Az étterem foglalási rendszerében a következő adatokat kezeljük:</p>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Adatfajta</th>
          <th>Cél</th>
          <th>Kötelező</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Név</td>
          <td>Foglalás azonosítás</td>
          <td>Igen</td>
        </tr>
        <tr>
          <td>E-mail cím</td>
          <td>Megerősítő üzenet, törlés</td>
          <td>Igen</td>
        </tr>
        <tr>
          <td>Telefonszám</td>
          <td>Elérhetőség</td>
          <td>Nem</td>
        </tr>
        <tr>
          <td>Foglalási dátum/idő</td>
          <td>Asztal foglalás</td>
          <td>Igen</td>
        </tr>
        <tr>
          <td>Asztal szám</td>
          <td>Foglalás kezelés</td>
          <td>Igen</td>
        </tr>
        <tr>
          <td>Vendégek száma</td>
          <td>Kapacitás tervezés</td>
          <td>Igen</td>
        </tr>
      </tbody>
    </table>

    <h2>3. Adatkezelési Célok</h2>
    <ul>
      <li><strong>Foglalás kezelése:</strong> asztal lefoglalása adott időpontra.</li>
      <li><strong>Megszüntetés:</strong> felhasználói kezdeményezésű törlés a userprofilból.</li>
      <li><strong>Szolgáltatásnyújtás:</strong> az étterem működtetéséhez szükséges.</li>
    </ul>

    <h2>4. Jogi Alap</h2>
    <p>
      <strong>Szerződés teljesítése</strong> (GDPR 6. cikk (1) bek. b) pont) – foglalás létrehozása és kezelése.
    </p>

    <h2>5. Adattárolás Időtartama</h2>
    <ul>
      <li><strong>Foglalás aktív:</strong> törlésig vagy lemondásig.</li>
      <li><strong>Törlés után:</strong> 30 napig (jogi igények érvényesítéséhez).</li>
      <li><strong>Technikai naplók:</strong> 90 napig.</li>
    </ul>

    <h2>6. Adatok Biztonsága</h2>
    <ul>
      <li>HTTPS titkosítás.</li>
      <li>Szerveroldali jelszó hash-elés (pl. bcrypt).</li>
      <li>JWT token alapú hitelesítés.</li>
      <li>Rendszeres biztonsági mentések.</li>
    </ul>

    <h2>7. Érintetti Jogok</h2>
    <ul>
      <li><strong>Hozzáférés:</strong> adataid megismerése.</li>
      <li><strong>Törlés:</strong> „elfeledtetés joga” (profil törlése).</li>
      <li><strong>Helyesbítés:</strong> adatjavítás.</li>
      <li><strong>Tárolhatóság:</strong> adatok exportálása.</li>
    </ul>

    <p><strong>Kapcsolat:</strong> info@thetable.hu</p>
  </main>
</template>

<script setup>
</script>
