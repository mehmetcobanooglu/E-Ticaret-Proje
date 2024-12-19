
function addItemToCart(item) {
    let cartItems = JSON.parse(localStorage.getItem('sepet')) || [];
    cartItems = cartItems.map(item=>{
      
        if(!item.adet || item.adet<=0){
            item.adet =1;
        }
        return item;
    });
    updateLocalStorage(cartItems);
    renderCartItems();
}


function updateLocalStorage(cartItems) {
    localStorage.setItem('sepet', JSON.stringify(cartItems));
}


function renderCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('sepet')) || [];
    const totalPriceElement = document.getElementById("total-price");
    const tableBody = document.getElementById("cart-items-table-body");
    tableBody.innerHTML = ''; // Mevcut tabloyu temizle

    let totalPrice = 0;

    
    cartItems.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.isim}</td>
            <td class="item-price">${item.fiyat} TL</td>
            <td>${item.aciklama}</td>
            <td>${item.beden}</td>
            <td>${item.renk}</td>
            <td>
                <button class="increase-btn" data-id="${item.id}" data-color="${item.renk}" data-size="${item.beden}">+</button>
                <span class="quantity">${item.adet}</span>
                <button class="decrease-btn" data-id="${item.id}" data-color="${item.renk}" data-size="${item.beden}">-</button>
            </td>
            <td><button class="remove-btn" data-id="${item.id}" data-color="${item.renk}" data-size="${item.beden}">Sil</button></td>
        `;
        tableBody.appendChild(row);

        totalPrice += item.fiyat * item.adet;  
    });
    totalPriceElement.textContent = `Toplam Fiyat: ${totalPrice} TL`;
    localStorage.setItem('totalPrice', totalPrice);

    attachEventListeners();
}

function attachEventListeners() {
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            const productColor = e.target.getAttribute("data-color");
            const productSize = e.target.getAttribute("data-size");

            let cartItems = JSON.parse(localStorage.getItem('sepet')) || [];
            cartItems = cartItems.filter(item => item.id !== parseInt(productId) || item.renk !== productColor || item.beden !== productSize);
            updateLocalStorage(cartItems);
            renderCartItems();
        });
    });

    const increaseButtons = document.querySelectorAll(".increase-btn");
    increaseButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            const productColor = e.target.getAttribute("data-color");
            const productSize = e.target.getAttribute("data-size");

            let cartItems = JSON.parse(localStorage.getItem('sepet')) || [];
            cartItems = cartItems.map(item => {
                if (item.id === parseInt(productId) && item.renk === productColor && item.beden === productSize) {
                    item.adet += 1;
                }
                return item;
            });

            updateLocalStorage(cartItems);
            renderCartItems();
        });
    });

    const decreaseButtons = document.querySelectorAll(".decrease-btn");
    decreaseButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productId = e.target.getAttribute("data-id");
            const productColor = e.target.getAttribute("data-color");
            const productSize = e.target.getAttribute("data-size");

            let cartItems = JSON.parse(localStorage.getItem('sepet')) || [];
            cartItems = cartItems.map(item => {
                if (item.id === parseInt(productId) && item.renk === productColor && item.beden === productSize && item.adet > 1) {
                    item.adet -= 1;
                }
                return item;
            });

            updateLocalStorage(cartItems);
            renderCartItems();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderCartItems();
});
