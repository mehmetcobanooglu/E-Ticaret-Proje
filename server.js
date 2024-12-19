const express = require('express');
const bodyParser = require('body-parser'); 
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const { error } = require('console');
const helmet = require('helmet');  //HTTP başlıklarını güvenli hale getirmek için kullandım
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
const PORT = process.env.PORT || 3000;
const { register } = require('module');


app.use(session({ 
    secret: '1234mEmo',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use(flash());
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public2'));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-inline';");
    next();
});


app.set('views', path.join(__dirname, 'public2', 'views'));
app.set('view engine', 'ejs');


const admin_db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'incigiyim_adminpaneli'
});
admin_db.connect(err => {
    if (err) throw err;
    console.log('Admin paneli veri tabanına bağlandı');
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.get('/kayit', (req, res) => {
    res.sendFile(path.join(__dirname, 'public2', 'HTML', 'kayitol.html'));
});
app.post('/api/register', (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;
    const query = 'INSERT INTO users (first_name, last_name, phone, email, password) VALUES (?, ?, ?, ?, ?)';

    admin_db.query(query, [firstName, lastName, phone, email, password], (err, results) => {
        if (err) {
            console.error('Kayıt Hatası:', err);
            return res.status(500).send('Kayıt sırasında bir hata oluştu');
        }
  
        res.json({ message: "Kayıt Başarılı" });

    });
});
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public2', 'HTML', 'login.html'));
});
// Kullanıcı Giriş İşlemi
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'E-posta ve şifre gereklidir.' });
    }

    // Veritabanında kullanıcı arama
    admin_db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Sunucu hatası.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Geçersiz e-posta veya şifre.' });
        }
        req.session.user = {
            id: results[0].id,
            firstName: results[0].first_name,
            lastName: results[0].last_name,
            email: results[0].email,
            phone: results[0].phone
        };
        res.json({
            success: true,
            message: 'Giriş başarılı',
            user: req.session.user
        });
     
    });
});
app.get('/anasayfa', (req, res) => {
    const query = "SELECT *FROM urunler";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error('Veri Tabani Hatasi');
            return res.status(500).send("Veri Tabani Hatasi");
        }
        res.render('anasayfa', { urunler: results });
    })

})
app.get('/erkek', (req, res) => {
    const query = "SELECT * FROM urunler WHERE kategori = 'erkek'";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error('Veritabanı hatası:', error);
            return res.status(500).send("Veritabanı hatası.");
        }
        res.render('erkek', { urunler: results });
    });
});
app.get('/kadin', (req, res) => {
    const query = "SELECT * FROM urunler WHERE kategori = 'kadın'"; 
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error("Veri Tabanı Hatası", error);
            return res.status(500).send("Veri Tabanı Hatası");
        }
        res.render('kadın', { urunler: results }); 
    });
});
app.get('/erkekCocuk', (req, res) => {
    const query = "SELECT * FROM urunler WHERE kategori = 'erkek çocuk'";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error("veri tabani hatasi !", error);
            return res.status(500).send("veri tabani hatasi");
        }
        res.render("erkekCocuk", { urunler: results });
    })
});
app.get('/kizcocuk', (req, res) => {
    const query = "SELECT * FROM urunler WHERE kategori = 'kız çocuk'";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error("veri tabani hatasi !", error);
            return res.status(500).send("veri tabani hatasi");
        }
        res.render("kızCocuk", { urunler: results });
    })
});
app.get('/askidaelbise', (req, res) => {
    const query = "SELECT * FROM urunler";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error('Veritabanı hatası:', error);
            return res.status(500).send("Veritabanı hatası.");
        }
        res.render('askidaelbise', { urunler: results });
    });
});
app.post('/bagisYap', (req, res) => {
    const { id } = req.body; // Ürün ID'si
    // Ürün bilgilerini 'urunler' tablosundan alalım
    admin_db.query('SELECT * FROM urunler WHERE id = ?', [id], (err, urun) => {
        if (err) {
            console.error('Veritabanı hatası:', err);
            return res.status(500).json({ message: 'Veritabanı hatası' });
        }

        if (urun.length === 0) {
            return res.status(404).json({ message: 'Ürün bulunamadı' });
        }

        const { isim, fiyat, aciklama, resim_yolu, beden, renk } = urun[0];
        console.log('Ürün Verileri:', urun[0]);
        console.log("Bedeni:", beden);
        console.log("Rengi:", renk);
        // Ürün bilgilerini 'askida_elbise' tablosuna kaydedelim
        admin_db.query(
            'INSERT INTO askida_elbise (isim, fiyat, aciklama, resim_yolu, beden, renk) VALUES ( ?, ?, ?, ?, ?, ?)',
            [isim, fiyat, aciklama, resim_yolu, beden, renk],
            (err, result) => {
                if (err) {
                    console.error('Veritabanı hatası:', err);
                    return res.status(500).json({ message: 'Bağış işlemi sırasında bir hata oluştu' });
                }

                const askidaElbiseId = result.insertId;
                res.status(200).json({ message: 'Bağış işlemi başarılı' });
            }
        );
    });
});


app.get('/askidakielbiseler', (req, res) => {
    admin_db.query('SELECT * FROM askida_elbise', (err, results) => {
        if (err) throw err;

        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');

        res.render('askidakielbiseler', { urunler: results });
    });
});

app.post('/satin-al', (req, res) => {
    const { tc_kimlik, id, beden, renk } = req.body;


    admin_db.query('SELECT * FROM tc WHERE tc_kimlik = ?', [tc_kimlik], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
            console.log('Gelen id:', id);

            admin_db.query('DELETE FROM askida_elbise WHERE id = ?', [id], (err) => {
                // if (err) throw err;
                if (err) {
                    console.error('Silme sırasında hata oluştu:', err);
                    throw err;
                }
                console.log('Silme işlemi sonuçları:', results);

                req.flash('success_msg', 'Ürün başarıyla satın alındı ve askıdan kaldırıldı!');
                res.redirect('/askidakielbiseler');
            });
        } else {

            req.flash('error_msg', 'Geçersiz TC Kimlik numarası.');
            res.redirect('/askidakielbiseler');
        }
    });
});

let cartItems = [];

app.post('/sepet', (req, res) => {

    cartItems = req.body.cartItems;
    const totalPrice = cartItems.reduce((total, item) => total + item.fiyat, 0);
    res.json({ totalPrice, cartItems });
});
app.get('/sepet', (req, res) => {
    res.render('sepet', { cartItems });
});


app.get('/admin', (req, res) => {
    res.render('admin', { username: 'Admin Kullanıcısı' });
});
app.get('/api/urunler', (req, res) => {
    const query = "SELECT * FROM urunler";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error('Veritabanı hatası:', error);
            return res.status(500).json({ error: "Veritabanı hatası" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'Hiçbir ürün bulunamadı.' });
        }
        res.json(results);
    });
});
app.get('/admin_tumUrunler', (req, res) => {
    const query = "SELECT * FROM urunler";
    admin_db.query(query, (error, results) => {
        if (error) {
            console.error('Veritabanı hatası:', error);
            return res.status(500).send("Veritabanı hatası.");
        }
        res.render("admin_tumUrunler", { urunler: results });
    });
});

app.get("/admin_urunEkle", (req, res) => {
    res.render("admin_urunEkle");
});

app.post('/api/urun-ekle', upload.single('resim'), (req, res) => {
    const { isim, fiyat, aciklama, kategori, kodu, stok, renk, beden } = req.body;
    const resimYolu = req.file ? `/uploads/${req.file.filename}` : null;

    const sql = 'INSERT INTO urunler (isim, fiyat, aciklama, kategori, stok, resim_yolu, kodu, renk, beden) VALUES (? ,? ,? ,? , ?, ?, ?, ?, ?)';
    admin_db.query(sql, [isim, fiyat, aciklama, kategori, stok, resimYolu, kodu, renk, beden], (err, result) => {
        if (err) {
            console.error("Ürün Ekleme Hatası:", err);
            return res.status(500).json({ message: 'Ürün eklenemedi: ' + err.message });  // JSON formatında hata mesajı
        } 
        res.status(200).json({ message: 'Ürün başarıyla eklendi!' });  // Başarı durumunda JSON mesajı
    });
});


app.get("/admin_urunGuncelle", (req, res) => {
    res.render("admin_urunGuncelle");
});

app.post('/admin_urunGuncelle', (req, res) => {
    const { kodu, isim, fiyat, aciklama } = req.body;
    admin_db.query(
        'UPDATE urunler SET isim = ?, fiyat = ?, aciklama = ? WHERE kodu = ?',
        [isim, fiyat, aciklama, kodu],
        (error, results) => {
            if (error) {
                console.error(error);
                // Hata mesajı gönder
                return res.render('admin_urunGuncelle', { message: 'Bir hata oluştu' });
            }
            if (results.affectedRows === 0) {
                return res.render('admin_urunGuncelle', { message: "ürün bulunamadı" })
            }
            // Başarı mesajı gönder
            res.render('admin_urunGuncelle', { message: 'Ürün başarıyla güncellendi' });
        }
    );
});

app.get('/admin_urunSil', (req, res) => {
    res.render("admin_urunSil");
})
app.get('/odeme',(req,res)=>{
    res.render("odeme");
})
app.post("/admin_urunSil", (req, res) => {
    const kodu = req.body.kodu;  // Formdan gelen 'kodu'yu alıyoruz

    if (!kodu) {
        return res.status(400).json({ error: "Ürün kodu gerekli!" });  // Eğer kod yoksa hata döndürüyoruz
    }

    const sql = "DELETE FROM urunler WHERE kodu = ?";
    admin_db.query(sql, [kodu], (err, result) => {
        if (err) {
            console.error("Ürün silme hatası:", err);
            return res.status(500).json({ error: "Ürün silinemedi: " + err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).render( 'admin_urunSil', {message: "Ürün bulunamadı"} );
        }
        res.render('admin_urunSil', { message: 'Ürün başarıyla silindi' });
    });
});
app.get('/help', (req, res) => {
    res.render("help");
});
app.post("/tcEkle", (req, res) => {
    const tckimlik = req.body.tckimlik;
    const sql = `INSERT INTO tc (tc_kimlik) VALUES ('${tckimlik}')`;
    admin_db.query(sql, (err, result) => {
        if (err) {
            return res.status(500).send("Bir Hata Oluştu" + err);
        }
        res.render('help',{message:'İhtiyaç Sahibi Eklendi.'})
    })
});
app.get('/hesap', (req, res) => {
    // Kullanıcı oturumunu kontrol et
    if (!req.session || !req.session.user) {
        return res.redirect('/login'); // Oturum yoksa giriş sayfasına yönlendir
    }

   
    res.render('hesap', { 
        user: req.session.user
    });
});
app.post('/change-password', (req, res) => {
    const { mevcutSIFRE, yeniSIFRE, onaylaSIFRE } = req.body;
    
    const userId = req.session.user.id;
    console.log(userId);
    // Şifre eşleşmesini kontrol et
    if (yeniSIFRE !== onaylaSIFRE) {
        return res.render('sifre-yenile', {message:'Yeni Şifreler Uyuşmuyor'});
    }

    // Mevcut şifreyi kontrol et
    const query = 'SELECT password FROM users WHERE id = ?';
    admin_db.query(query, [userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Sunucu hatası.' });
        }

        if (results.length === 0 || results[0].password !== mevcutSIFRE) {
            return res.render('sifre-yenile', {message:'Mevcut Şifre Yanlış'})
        }

        // Şifreyi güncelle
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';
        admin_db.query(updateQuery, [yeniSIFRE, userId], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Şifre güncellenirken hata oluştu.' });
            }
            res.render('sifre-yenile', {message:'Şifre Başarıyla Değiştirildi'})
        });
    });
});
app.get("/sifre-yenile",(req,res)=>{
    res.render("sifre-yenile");
  
  })

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Çıkış yapılamadı');
        }
        res.redirect('/anasayfa'); 
    });
});


app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
