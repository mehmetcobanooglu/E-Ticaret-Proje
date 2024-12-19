async function urunleriGetir() {
    try {
        const response = await fetch('/api/urunler');
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
console.log(localStorage); // Konsolda localStorage içeriğini kontrol et

function urunleriGoster(urunler) {
    const productContainer = document.getElementById("productContainer");
    productContainer.innerHTML = "";

    urunler.forEach((urun) => {
        const renkler = urun.renk ? urun.renk.split(',') : ["Bilinmiyor"];
        const bedenler = urun.beden ? urun.beden.split(',') : ["Standart"];
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
            
            <label for="renk">Renk Seçin </label>
            <select name="renk" class="renk">
            ${renkler.map(renk => `<option value="${renk}">${renk}</option>`).join('')}
            </select>
            
            <label for="beden">Beden Seçin  </label>
            <select name="beden" class="beden">
            ${bedenler.map(beden => `<option value="${beden}">${beden}</option>`).join('')}
            </select>
            
            
            <button class="ekle" data-urun='${JSON.stringify(urun)}'>Sepete Ekle</button>
        `;
        productContainer.appendChild(urunDiv);
    });
    const ayrintiButonlari = document.querySelectorAll(".urun-ayrintilari");
    ayrintiButonlari.forEach(button => {
        button.addEventListener("click", () => {
            const aciklamaBolumu = button.nextElementSibling;
            aciklamaBolumu.classList.toggle("gizli");
        });
    });
    const btnler = document.querySelectorAll(".ekle");
    btnler.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const urunData = event.target.getAttribute('data-urun');
            const urun = JSON.parse(urunData);
            const secilenRenk = btn.parentElement.querySelector(".renk").value;
            const secilenBeden = btn.parentElement.querySelector(".beden").value;


            urun.renk = secilenRenk;
            urun.beden = secilenBeden;
            sepeteEkle(JSON.stringify(urun));
        });
    });
}

function sepeteEkle(urunData) {
    const urun = JSON.parse(urunData);
    let sepeteEklenecekUrunler = JSON.parse(localStorage.getItem("sepet")) || [];
    sepeteEklenecekUrunler.push(urun);
    localStorage.setItem("sepet", JSON.stringify(sepeteEklenecekUrunler));
    alert(`${urun.isim} sepete eklendi!`);
}


document.addEventListener("DOMContentLoaded", urunleriGetir);
