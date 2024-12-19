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
  } else {
      hesapBtn.style.display = 'none';         // Hesap butonunu gizle
      girisBtn.style.display = 'inline-block';
      welcomeMessage.textContent = '';  // Giriş butonunu göster
  }

  const ayrintiButonlari = document.querySelectorAll(".urun-ayrintilari");
  ayrintiButonlari.forEach(button => {
      button.addEventListener("click", () => {
          const aciklamaBolumu = button.nextElementSibling;
          aciklamaBolumu.classList.toggle("gizli");
      });
  });


  const statusMessage = document.querySelector('.statusMessage');
  const successMessage = document.querySelector('.success-message');
  const errorMessage = document.querySelector('.error-message');

  if (statusMessage) {
    if (successMessage?.textContent.trim()) {
        // Success mesajını göster, Error mesajını gizle
        successMessage.style.display = 'block';
        if (errorMessage) errorMessage.style.display = 'none';

        statusMessage.classList.add('show');
        setTimeout(function () {
            statusMessage.classList.remove('show');
            successMessage.style.display = 'none';
        }, 3000);
    }else if (errorMessage?.textContent.trim()) {
      // Error mesajını göster, Success mesajını gizle
      errorMessage.style.display = 'block';
      if (successMessage) successMessage.style.display = 'none';

      statusMessage.classList.add('show');
      setTimeout(function () {
          statusMessage.classList.remove('show');
          errorMessage.style.display = 'none';
      }, 3000);
  }}
});
