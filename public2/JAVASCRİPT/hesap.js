document.getElementById('cikis').addEventListener('click', function(event) {
    
    event.preventDefault();
  

    localStorage.removeItem('user');
    console.log('User silindi.');
  
  
    window.location.href = "/anasayfa";  
  });
  