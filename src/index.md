---
toc: false
---

<div class="hero">
  <h1>Bengaluru Biodiversity Datajam 2025</h1>
  <h2>Bindu, Ekansh, Sharath, Tanaya, Tullika, Vaibhavi, Urmila</h2>
</div>

<!-- Cards Section -->
<div class="cards-container">
  <div class="card">
    <div class="card-image">
     <img src="./assets/overview.png" alt="Description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
    </div>
    <div class="card-title">Project Overview</div>
    <a href="/overview" class="card-link">View Overview →</a>
  </div>

  <div class="card">
    <div class="card-image">
    <img src="./assets/birds.png" alt="Description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
    </div>
    <div class="card-title">Birds Analysis</div>
    <a href="/birds" class="card-link">View Analysis →</a>
  </div>

  <div class="card">
    <div class="card-image">
    <img src="./assets/moths.png" alt="Description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
    </div>
    <div class="card-title">Moths & Butterflies</div>
    <a href="/moths-and-butterflies" class="card-link">View Analysis →</a>
  </div>

  <div class="card">
    <div class="card-image">
    <img src="./assets/bees.png" alt="Description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
    </div>
    <div class="card-title">Bees Analysis</div>
    <a href="/bees" class="card-link">View Analysis →</a>
  </div>

  <div class="card">
    <div class="card-image">
    <img src="./assets/wasp.png" alt="Description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
    </div>
    <div class="card-title">Wasps Analysis</div>
    <a href="/wasps" class="card-link">View Analysis →</a>
  </div>

  <div class="card">
    <div class="card-image">
    <img src="./assets/ward.png" alt="Description" style="width: 100%; height: 100%; object-fit: cover; border-radius: 6px;">
    </div>
    <div class="card-title">Ward-wise Analysis</div>
    <a href="/bengaluru-wards" class="card-link">View Analysis →</a>
  </div>
</div>

<style>

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  /* background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text; */
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
  padding: 0 1rem;
}

.card {
  background: var(--theme-background-alt);
  border: 1px solid var(--theme-foreground-faintest);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 100%;
  height: 200px;
  background: var(--theme-foreground-faintest);
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-foreground-muted);
  font-size: 0.9rem;
  text-align: center;
  background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>');
  background-repeat: no-repeat;
  background-position: center;
  background-size: 48px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--theme-foreground);
}

.card-description {
  color: var(--theme-foreground-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.card-link {
  color: var(--theme-foreground-focus);
  text-decoration: none;
  font-weight: 500;
}

.card-link:hover {
  text-decoration: underline;
}

</style>
