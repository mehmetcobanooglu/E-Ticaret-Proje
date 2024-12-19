document.addEventListener('DOMContentLoaded', function () {
    // Kayıt formunu seçme
    const kayitFormu = document.querySelector('#kayitFormu');
    if (kayitFormu) {
        kayitFormu.addEventListener('submit', function (event) {
            event.preventDefault();

            const firstName = document.querySelector('input[placeholder="Ad"]').value;
            const lastName = document.querySelector('input[placeholder="Soyad"]').value;
            const phone = document.querySelector('input[placeholder="Telefon Numaranız"]').value;
            const email = document.querySelector('input[placeholder="E-posta"]').value;
            const password = document.querySelector('input[placeholder="Şifre"]').value;

            if (!firstName || !lastName || !phone || !email || !password) {
                alert('Lütfen tüm alanları doldurun.');
                return;
            }

            // Kayıt API çağrısı
            fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, phone, email, password }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.message);
                        alert(data.message);
                        window.location.href = '/login'; // Başarılı kayıt sonrası login sayfasına yönlendirme
                    } else {
                        alert(data.message);
                    }
                })
                .catch(err => console.error('Hata: ', err));
        });
    }

    // Giriş formunu seçme
    const girisFormu = document.querySelector('#girisFormu');
    if (girisFormu) {
        girisFormu.addEventListener('submit', function (event) {
            event.preventDefault();

            const email = document.querySelector('input[placeholder="E-Posta"]').value;
            const password = document.querySelector('input[placeholder="Şifre"]').value;

            if (!email || !password) {
                alert('Lütfen e-posta ve şifre girin.');
                return;
            }

            // Giriş API çağrısı
            fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                       
                        localStorage.setItem('user', JSON.stringify(data.user));

                        alert(data.message);
                        window.location.href = '/anasayfa'; 
                    } else {
                        alert(data.message);
                    }
                })
                .catch(err => console.error('Hata: ', err));
        });
    }
});
