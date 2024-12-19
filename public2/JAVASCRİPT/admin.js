document.addEventListener("DOMContentLoaded", function () {

    document.getElementById('urunEkleForm').addEventListener('submit', function (event) {
        event.preventDefault();
    
        const formData = new FormData(this);
    
        fetch('/api/urun-ekle', {
                method: 'POST',
                body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ağ hatası: ' + response.statusText);
            }
            return response.json();  // JSON olarak dönecek
        })
        .then(data => {
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.style.color = 'green'; 
            statusMessage.innerText = data.message;  // JSON'dan gelen mesajı göster
            document.getElementById('urunEkleForm').reset();  // Formu sıfırla
            urunleriYukle();  // Ürünleri yüklemek için fonksiyon (gerekirse)
        })
        .catch(error => {
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.style.color = 'red';  // Hata mesajını kırmızı renkte göster
            statusMessage.innerText = 'Ürün ekleme işlemi başarısız oldu: ' + error.message;  // Hata mesajını kullanıcıya göster
        });
    });
    
    document.getElementById('urunGuncelleForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
        const kodu = document.getElementById('kodu').value;
        const urunAdi = document.getElementById('urunAdi').value;
        const urunFiyati = document.getElementById('urunFiyati').value;
        const urunAciklamasi = document.getElementById('urunAciklamasi').value;
    
        const formData = {
            kodu: kodu,
            isim: urunAdi,
            fiyat: urunFiyati,
            aciklama: urunAciklamasi
        };
    
        fetch('/admin_urunGuncelle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('statusMessage').innerHTML = `<p>${data.message}</p>`;
                setTimeout(() => {
                    window.location.href = '/admin_tumUrunler'; // Başarılı işlem sonrası yönlendirme
                }, 2000);
            } else {
                document.getElementById('statusMessage').innerHTML = `<p>Bir hata oluştu.</p>`;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('statusMessage').innerHTML = `<p>Bir hata oluştu.</p>`;
        });
    });
    
    document.getElementById('silForm').addEventListener('submit', function (event) {
        event.preventDefault();

        const kodu = document.getElementById('kodu').value;  // Formdan kodu alıyoruz

        if (!kodu) {
            alert("Ürün kodu gerekli!");
            return;
        }

        fetch(`/api/urun-sil/${kodu}`, { 
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                alert(data.message);  
                urunleriYukle(); 
            } else if (data.error) {
                alert("Hata: " + data.error);  
            }
        })
        .catch(error => {
            console.error('Silme İsteği Hatası:', error);
            alert('Bir hata oluştu: ' + error.message); 
        });
    });

   
    function urunleriYukle() {
        const urunlerTablosu = document.querySelector("#urunlerTablosu tbody");
        if (urunlerTablosu) {
            fetch("/api/urunler")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Ağ hatası: " + response.status);
                    }
                    return response.json();
                })
                .then(urunler => {
                    urunlerTablosu.innerHTML = '';
                    urunler.forEach(urun => {
                        const satir = document.createElement("tr");
                        satir.innerHTML = `
                            <td>${urun.id}</td>
                            <td>${urun.isim}</td>
                            <td>${urun.fiyat} TL</td>
                            <td>${urun.aciklama}</td>
                            <td>${urun.kategori}</td>
                            <td>${urun.kodu}</td>
                            <td>${urun.stok}</td>
                            <td><img src="${urun.resim_yolu}" alt="${urun.isim}" width="50"></td>
                        `;
                        urunlerTablosu.appendChild(satir);
                    });
                })
                .catch(error => {
                    console.error("Hata:", error);
                    alert("Ürünleri yüklerken bir hata oluştu.");
                });
        }
    }

    
    urunleriYukle();
});
