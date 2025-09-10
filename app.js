// Tahun footer
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

// Inject header/footer pada halaman selain index (untuk konsistensi)
(function includePartials(){
  const headerHTML = `
  <header class="header" aria-label="Navigasi utama">
    <div class="container nav">
      <div class="brand">
        <div class="logo" aria-hidden="true">RI</div>
        <p class="brand-title">Toko Besi Rizky Ilahi</p>
      </div>
      <nav class="menu" aria-label="Menu utama">
        <a href="index.html" data-nav="home">Beranda</a>
        <a href="produk.html" data-nav="produk">Produk</a>
        <a href="layanan.html" data-nav="layanan">Layanan</a>
        <a href="tentang.html" data-nav="tentang">Tentang</a>
        <a href="kontak.html" class="btn btn--accent"><span class="icon">chat</span> Minta Penawaran</a>
      </nav>
      <button id="hamburger" class="hamburger" aria-label="Buka menu" aria-controls="drawer" aria-expanded="false">
        <span class="icon">menu</span>
      </button>
    </div>
    <aside id="drawer" class="drawer" aria-hidden="true">
      <div class="drawer-head">
        <div class="brand"><div class="logo" aria-hidden="true">RI</div><strong>Toko Besi Rizky Ilahi</strong></div>
        <button id="closeDrawer" class="icon-btn" aria-label="Tutup menu"><span class="icon">close</span></button>
      </div>
      <nav class="drawer-nav">
        <a href="index.html" data-nav="home">Beranda</a>
        <a href="produk.html" data-nav="produk">Produk</a>
        <a href="layanan.html" data-nav="layanan">Layanan</a>
        <a href="tentang.html" data-nav="tentang">Tentang</a>
        <a href="kontak.html" class="btn btn--accent w-100"><span class="icon">chat</span> Chat WhatsApp</a>
      </nav>
    </aside>
    <div id="backdrop" class="backdrop" hidden></div>
  </header>`;

  const footerHTML = `
  <footer class="footer">
    <div class="container footer-wrap">
      <div class="brand">
        <div class="logo" aria-hidden="true">RI</div>
        <p class="muted">© <span id="year"></span> Toko Besi Rizky Ilahi</p>
      </div>
      <p class="muted">Tipografi: Plus Jakarta Sans & Inter</p>
    </div>
  </footer>`;

  document.querySelectorAll('[data-include="header"]').forEach(el => el.outerHTML = headerHTML);
  document.querySelectorAll('[data-include="footer"]').forEach(el => el.outerHTML = footerHTML);

  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// Tandai nav aktif (menu & drawer)
(function setActiveNav(){
  const page = document.body.getAttribute('data-page');
  if (!page) return;
  const mark = sel => document.querySelectorAll(sel).forEach(a => {
    if (a.dataset.nav === page) a.setAttribute('aria-current','page');
  });
  mark('.menu a[data-nav]');
  mark('.drawer-nav a[data-nav]');
})();

// Drawer / Hamburger
(function drawer(){
  const drawer = document.getElementById('drawer');
  const backdrop = document.getElementById('backdrop');
  const hamburger = document.getElementById('hamburger');
  const closeDrawer = document.getElementById('closeDrawer');
  if(!drawer || !hamburger) return;

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    hamburger.setAttribute('aria-expanded','true');
    if (backdrop) backdrop.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    hamburger.setAttribute('aria-expanded','false');
    if (backdrop) backdrop.hidden = true;
    document.body.style.overflow = '';
  };

  hamburger.addEventListener('click', open);
  closeDrawer?.addEventListener('click', close);
  backdrop?.addEventListener('click', close);
  window.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
})();

// Form WhatsApp
function sendWA(form){
  const nama = form.nama.value.trim();
  const produk = form.produk.value.trim();
  const catatan = form.catatan.value.trim();
  const msg = encodeURIComponent(`Halo Toko Besi Rizky Ilahi,\nSaya ${nama}.\nProduk: ${produk}\nCatatan: ${catatan}`);
  const phone = '6281234567890'; // ganti ke nomor WA
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  return false;
}
window.sendWA = sendWA;

// Ken Burns hanya saat terlihat (hemat baterai)
(function lazyKenburns(){
  const items = document.querySelectorAll('[data-kenburns]');
  if(!('IntersectionObserver' in window) || !items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('kenburns'); }
    });
  }, {threshold: .35});
  items.forEach(el=>io.observe(el));
})();
