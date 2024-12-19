document.addEventListener('DOMContentLoaded', function () {
    const paymentBtn = document.getElementById("payment-btn");
    const totalPriceElement = document.getElementById("total-price");
    const paymentForm = document.getElementById("payment-form");

    if (!paymentBtn || !totalPriceElement || !paymentForm) {
        console.error("Gerekli öğeler bulunamadı!");
        return;
    }

    // Sepeti al ve toplam fiyatı hesapla
    const cartItems = JSON.parse(localStorage.getItem("sepet")) || [];
    const totalPrice = cartItems.reduce((acc, item) => acc + item.fiyat * item.adet, 0);
    localStorage.setItem("totalPrice", totalPrice);

    // Toplam fiyatı göster
    if (cartItems.length > 0) {
        totalPriceElement.innerHTML = `Toplam Fiyat: ${totalPrice.toFixed(2)} TL`;
    } else {
        totalPriceElement.innerHTML = "Toplam Fiyat: 0 TL";
    }

    // Ödeme butonu tıklama olayı
    paymentBtn.addEventListener("click", function (event) {
        event.preventDefault(); // Form gönderimini engelle

        // Input alanlarını kontrol et
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.trim();
        const expiryDate = document.getElementById("expiry-date").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        if (!cardName || !cardNumber || !expiryDate || !cvv) {
            alert("Lütfen tüm alanları doldurun!");
            return;
        }

        // Kart numarasını doğrula (16 basamaklı ve sadece sayılardan oluşmalı)
        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            alert("Hatalı kart numarası! Lütfen 16 basamaklı bir kart numarası girin.");
            return;
        }

        // CVV doğrulama (3 basamaklı olmalı)
        if (cvv.length !== 3 || !/^\d+$/.test(cvv)) {
            alert("Hatalı CVV! Lütfen 3 basamaklı bir CVV girin.");
            return;
        }

        // Ödeme işlemi onayı
        if (confirm(`Toplam ödeme tutarınız: ${totalPrice.toFixed(2)} TL. Ödemeyi onaylıyor musunuz?`)) {
            alert("Ödeme işlemi başarılı! Teşekkür ederiz.");
            localStorage.removeItem("sepet"); // Sepeti temizle
            localStorage.removeItem("totalPrice"); 
            totalPriceElement.innerHTML = "Toplam Fiyat: 0 TL";
            paymentForm.reset(); // Formu sıfırla
        } else {
            alert("Ödeme işlemi iptal edildi.");
        }
    });
});
