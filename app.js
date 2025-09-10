// Tahun di footer
document.getElementById('year').textContent = new Date().getFullYear();

// Drawer / Hamburger: simple & elegan
const drawer = document.getElementById('drawer');
const backdrop = document.getElementById('backdrop');
const hamburger = document.getElementById('hamburger');
const closeDrawer = document.getElementById('closeDrawer');

function openDrawer(){
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
  hamburger.setAttribute('aria-expanded','true');
  backdrop.hidden = false;
  document.body.style.overflow = 'hidden';
}
function closeDrawerFn(){
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
  hamburger.setAttribute('aria-expanded','false');
  backdrop.hidden = true;
  document.body.style.overflow = '';
}

hamburger?.addEventListener('click', openDrawer);
closeDrawer?.addEventListener('click', closeDrawerFn);
backdrop?.addEventListener('click', closeDrawerFn);
window.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeDrawerFn(); });

// Form → WhatsApp deep link (ringkas & jelas)
function sendWA(form){
  const nama = form.nama.value.trim();
  const produk = form.produk.value.trim();
  const catatan = form.catatan.value.trim();
  const msg = encodeURIComponent(
    `Halo Toko Besi Rizky Ilahi,\nSaya ${nama}.\nProduk: ${produk}\nCatatan: ${catatan}`
  );
  const phone = '6281234567890'; // GANTI ke nomor WA
  window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  return false;
}
window.sendWA = sendWA;

// === OPSIONAL: isi grid produk dari Google Sheet (CSV publish) ===
// 1) Publish sheet -> URL CSV
// 2) Kolom: image,name,badge,meta,wa
const CSV_URL = ''; // contoh: 'https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&single=true&output=csv'

async function fetchCSV(){
  if(!CSV_URL) return;
  const res = await fetch(CSV_URL);
  const text = await res.text();
  const rows = text.trim().split(/\r?\n/).map(r => r.split(','));
  const header = rows.shift().map(h => h.trim().toLowerCase());
  const data = rows.map(r => Object.fromEntries(r.map((v,i)=>[header[i], v])));

  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  for(const item of data){
    const meta = (item.meta||'').split('|').map(s=>s.trim()).filter(Boolean).join(' • ');
    grid.insertAdjacentHTML('beforeend', `
      <article class="card">
        <img loading="lazy" decoding="async"
             src="${item.image}?tr=w-900"
             srcset="${item.image}?tr=w-540 540w, ${item.image}?tr=w-900 900w, ${item.image}?tr=w-1200 1200w"
             sizes="(max-width:639px) 100vw, (max-width:959px) 50vw, 33vw"
             width="900" height="675" alt="${item.name}">
        <div class="content">
          <p class="badge">${item.badge||''}</p>
          <h3 class="h3">${item.name||''}</h3>
          <p class="meta">${meta}</p>
          <div class="actions">
            <a class="btn btn--ghost" href="${item.wa||'#'}"><span class="icon">price_check</span> Tanya harga</a>
          </div>
        </div>
      </article>
    `);
  }
}
// fetchCSV(); // aktifkan jika sudah ada CSV
