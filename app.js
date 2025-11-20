// API server buatan GPT (publik, gratis)
const API_URL = "https://jtimfood-api.onrender.com/reviews";

let ratingDipilih = 0;

// ⭐ Rating bintang
document.addEventListener("DOMContentLoaded", () => {
    const stars = document.querySelectorAll("#stars span");

    stars.forEach(star => {
        star.addEventListener("click", () => {
            ratingDipilih = star.dataset.value;

            stars.forEach(s => s.classList.remove("active"));
            for (let i = 0; i < ratingDipilih; i++) {
                stars[i].classList.add("active");
            }
        });
    });

    loadReview();
});

// Ambil semua ulasan
async function loadReview() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();
        tampilkan(data);
    } catch (e) {
        document.getElementById("reviewList").innerHTML =
            "<p>⚠ Gagal memuat ulasan dari server.</p>";
    }
}

// Tampilkan review ke halaman
function tampilkan(data) {
    const list = document.getElementById("reviewList");
    list.innerHTML = "";

    data.forEach(r => {
        list.innerHTML += `
        <div class="review-card">
            <h3>${r.tempat} — ⭐${r.rating}</h3>
            <p><strong>Kota:</strong> ${r.kota}</p>
            <p>${r.ulasan}</p>
            <p><em>Oleh: ${r.nama}</em></p>
        </div>`;
    });
}

// Kirim review ke API server
async function kirimReview() {
    const nama = document.getElementById("nama").value;
    const tempat = document.getElementById("tempat").value;
    const kota = document.getElementById("kota").value;
    const ulasan = document.getElementById("ulasan").value;

    if (!nama || !tempat || !kota || !ulasan || ratingDipilih == 0) {
        alert("Semua kolom + rating harus diisi!");
        return;
    }

    await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nama,
            tempat,
            kota,
            ulasan,
            rating: ratingDipilih,
            tanggal: new Date().toISOString()
        })
    });

    loadReview();
}

// Fitur pencarian
function cariReview() {
    const key = document.getElementById("cari").value.toLowerCase();

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            const filter = data.filter(r =>
                r.tempat.toLowerCase().includes(key) ||
                r.kota.toLowerCase().includes(key)
            );
            tampilkan(filter);
        });
}
