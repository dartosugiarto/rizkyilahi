document.addEventListener('DOMContentLoaded', function() {
    // GANTI DENGAN URL CSV DARI GOOGLE SHEET ANDA
    const googleSheetURL = 'URL_CSV_ANDA';

    const productGrid = document.getElementById('product-grid');
    const loader = document.querySelector('.loader');

    // Fungsi untuk mengubah data CSV menjadi objek JSON
    function csvToJSON(csv) {
        const lines = csv.split('\n');
        const result = [];
        const headers = lines[0].split(',').map(header => header.trim());

        for (let i = 1; i < lines.length; i++) {
            if (!lines[i]) continue;
            const obj = {};
            const currentline = lines[i].split(',');

            for (let j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j] ? currentline[j].trim() : '';
            }
            result.push(obj);
        }
        return result;
    }

    // Fungsi untuk menampilkan produk
    function displayProducts(products) {
        // Hapus loader
        loader.style.display = 'none';

        if (!products || products.length === 0) {
            productGrid.innerHTML = '<p>Gagal memuat produk. Silakan coba lagi nanti.</p>';
            return;
        }

        products.forEach(product => {
            // Asumsikan nama kolom di Google Sheet adalah: namaProduk, harga, deskripsi, urlGambar
            const card = document.createElement('div');
            card.className = 'product-card';

            card.innerHTML = `
                <img src="${product.urlGambar}" alt="${product.namaProduk}" class="product-image">
                <div class="product-info">
                    <h4>${product.namaProduk}</h4>
                    <div class="price">${product.harga}</div>
                    <p>${product.deskripsi}</p>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // Mengambil data dari Google Sheet
    fetch(googleSheetURL)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(csvText => {
            const products = csvToJSON(csvText);
            displayProducts(products);
        })
        .catch(error => {
            console.error('Error fetching or parsing data:', error);
            loader.style.display = 'none';
            productGrid.innerHTML = '<p>Terjadi kesalahan saat memuat produk. Periksa kembali URL Google Sheet dan pastikan sudah dipublikasikan dengan benar.</p>';
        });
});
