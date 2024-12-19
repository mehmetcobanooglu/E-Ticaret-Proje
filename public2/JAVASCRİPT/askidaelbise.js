document.addEventListener("DOMContentLoaded", () => {
    urunleriGetir();
});

async function urunleriGetir() {
    try {
        const response = await fetch('http://localhost:3000/api/urunler');
        if (!response.ok) {
            throw new Error("Ürünler alınamadı");
        }
        const urunler = await response.json();
        urunleriGoster(urunler);
    } catch (error) {
        console.error("Ürünleri alırken hata oluştu:", error);
    }
}
document.addEventListener('DOMContentLoaded', function () {
    
    const hesapBtn = document.getElementById('hesapBtn');
    const girisBtn = document.getElementById('girisBtn');
    const welcomeMessage = document.getElementById('welcomeMessage');
    // Kullanıcı oturum kontrolü
    const userSession = localStorage.getItem('user'); // Sunucudan dönen kullanıcı oturumu

    if (userSession) {
        const user = JSON.parse(userSession);
        hesapBtn.style.display = 'inline-block'; // Hesap butonunu göster
        girisBtn.style.display = 'none';   
        welcomeMessage.textContent = `Hoşgeldiniz, ${user.firstName}`; 
              
    }
     else {
        hesapBtn.style.display = 'none';         // Hesap butonunu gizle
        girisBtn.style.display = 'inline-block';
        welcomeMessage.textContent = '';  // Giriş butonunu göster
    }
});
function urunleriGoster(urunler) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    urunler.forEach((urun) => {
        const urunDiv = document.createElement("div");
        urunDiv.className = "urunler";
        urunDiv.innerHTML = `
            <h3>${urun.isim}</h3>
            <img src="${urun.resim_yolu}" alt="${urun.isim}">
            <p>Fiyat: ${urun.fiyat} TL</p>
            <button class="urun-ayrintilari">Ürün Ayrıntıları</button>
            <div class="urun-aciklama gizli">
                <p>${urun.aciklama}</p>
            </div>
            <button class="bagis-yap" data-id="${urun.id}">Bağış Yap</button>
        `;
        productContainer.appendChild(urunDiv);
    });

    document.querySelectorAll(".urun-ayrintilari").forEach(button => {
        button.addEventListener("click", () => {
            const aciklamaBolumu = button.nextElementSibling;
            aciklamaBolumu.classList.toggle("gizli");
        });
    });

    document.querySelectorAll(".bagis-yap").forEach(button => {
        button.addEventListener('click', async (event) => {
            const urunId = event.target.getAttribute('data-id');
            console.log("Bağış yapılacak ürün id:", urunId);
        
            try {
                const response = await fetch('/bagisYap', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: urunId }) // Ürün ID'sini gönderiyoruz
                });
        
                if (!response.ok) {
                    console.error("Hata:", response.status, await response.text());
                    throw new Error("Bağış işlemi başarısız oldu.");
                }
        
                const result = await response.json();
                alert(result.message); // Başarılı mesajı göster
            } catch (error) {
                console.error("Bağış işlemi sırasında hata oluştu:", error);
                alert("Bağış yapılırken bir hata oluştu.");
            }
        });
        
    });
}
