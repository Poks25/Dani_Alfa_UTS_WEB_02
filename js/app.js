// js/app.js

let allProducts = []; // Tempat menyimpan data asli dari JSON
let activeCategory = 'Semua';

// 1. Fungsi mengambil data dari JSON
async function loadProducts() {
    const grid = document.getElementById('product-grid');
    try {
        const response = await fetch('data/products.json');
        allProducts = await response.json();
        renderProducts(allProducts); // Tampilkan semua saat pertama kali buka
    } catch (error) {
        console.error("Gagal load data:", error);
        grid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-red-500 font-bold">Gagal memuat data produk!</p>
                <p class="text-sm text-gray-500">Pastikan Anda menggunakan Live Server untuk membuka file ini.</p>
            </div>`;
    }
}

// 2. Fungsi Utama untuk menampilkan produk ke layar (Update Terbaru)
function renderProducts(products) {
    const grid = document.getElementById('product-grid');
    
    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-20">
                <p class="text-gray-400 animate-pulse">Produk tidak ditemukan...</p>
            </div>`;
        return;
    }

    grid.innerHTML = products.map(p => `
        <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group">
            <div class="relative overflow-hidden aspect-square">
                <img 
                    src="${p.image}" 
                    alt="${p.name}" 
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onerror="this.src='https://via.placeholder.com/600x600?text=Sepatu+Alfas+Step'"
                >
                <div class="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm text-slate-900 dark:text-white">
                    ${p.category}
                </div>
            </div>
            <div class="p-5">
                <div class="flex justify-between items-start mb-1">
                    <h3 class="font-bold text-gray-800 dark:text-white truncate flex-1">${p.name}</h3>
                    <span class="text-yellow-500 text-xs flex items-center shrink-0 ml-2">
                        ⭐ ${p.rating || '4.5'}
                    </span>
                </div>
                <p class="text-indigo-600 dark:text-indigo-400 font-bold text-lg mb-4">
                    Rp ${p.price.toLocaleString('id-ID')}
                </p>
                <a href="product-detail.html?id=${p.id}" class="block text-center w-full bg-slate-900 dark:bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-indigo-700 transition shadow-md">
                    Beli Sekarang
                </a>
            </div>
        </div>
    `).join('');
}

// 3. Fungsi Filter & Pencarian
function applyFilters() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const sortValue = document.getElementById('sort-select').value;

    let filtered = allProducts.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchInput) || 
                            p.category.toLowerCase().includes(searchInput);
        const matchCategory = activeCategory === 'Semua' || p.category === activeCategory;
        return matchSearch && matchCategory;
    });

    // Logika Pengurutan (Sort)
    if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

// 4. Fungsi Klik Kategori
function filterCategory(cat) {
    activeCategory = cat;
    
    // Update tampilan tombol kategori agar yang aktif terlihat berbeda
    document.querySelectorAll('.cat-btn').forEach(btn => {
        if (btn.innerText === cat) {
            btn.classList.add('bg-slate-900', 'text-white');
            btn.classList.remove('bg-white', 'text-gray-600');
        } else {
            btn.classList.remove('bg-slate-900', 'text-white');
            btn.classList.add('bg-white', 'text-gray-600');
        }
    });

    applyFilters();
}

// 5. Fungsi Sort (Terbaru)
function sortProducts() {
    applyFilters();
}

// Jalankan load data saat halaman siap
document.addEventListener('DOMContentLoaded', loadProducts);