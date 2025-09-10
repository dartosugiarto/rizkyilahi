document.addEventListener('DOMContentLoaded', function() {
    // GANTI DENGAN URL CSV DARI GOOGLE SHEET ANDA
    const googleSheetURL = 'URL_CSV_ANDA';

    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; // Exit if the grid element doesn't exist

    const loaderWrapper = document.querySelector('.loader-wrapper');

    // Fungsi untuk mengubah data CSV menjadi array objek JSON
    function csvToJSON(csv) {
        const lines = csv.trim().split('\n');
        if (lines.length < 2) return []; // No data rows
        
        const headers = lines[0].split(',').map(h => h.trim());
        const result = [];

        for (let i = 1; i < lines.length; i++) {
            const obj = {};
            const currentline = lines[i].split(',');

            headers.forEach((header, j) => {
                obj[header] = currentline[j] ? currentline[j].trim().replace(/"/g, '') : '';
            });
            result.push(obj);
        }
        return result;
    }

    // Fungsi untuk membuat dan menampilkan kartu produk
    function displayProducts(products) {
        if (loaderWrapper) {
            loaderWrapper.style.display = 'none';
        }

        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p>Produk tidak ditemukan atau gagal dimuat.</p>';
            return;
        }

        // Asumsikan nama kolom di Google Sheet adalah: namaProduk, harga, deskripsi, urlGambar
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <img src="${product.urlGambar || 'https://via.placeholder.com/300x220.png?text=No+Image'}" alt="${product.namaProduk}" class="product-image">
                <div class="product-info">
                    <h4>${product.namaProduk || 'Nama Produk'}</h4>
                    <div class="price">${product.harga || 'Harga Hubungi'}</div>
                    <p>${product.deskripsi || 'Deskripsi tidak tersedia.'}</p>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // Mengambil dan memproses data
    async function fetchProducts() {
        try {
            const response = await fetch(googleSheetURL);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const csvText = await response.text();
            const products = csvToJSON(csvText);
            displayProducts(products);
        } catch (error) {
            console.error('Error fetching or parsing data:', error);
            if (loaderWrapper) {
                loaderWrapper.style.display = 'none';
            }
            productGrid.innerHTML = '<p>Terjadi kesalahan saat memuat produk. Silakan coba lagi nanti.</p>';
        }
    }

    fetchProducts();
    
    // Icon library execution
    feather.replace();
});
