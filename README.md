# 🧟 Zombie Apocalypse - Survival Game

En iyi zombi hayatta kalma oyunu! Modern HTML5 Canvas, CSS3 ve JavaScript ile geliştirilmiş aksiyon dolu bir zombi savaş oyunu.

## 🎮 Oyun Özellikleri

### 🔥 Temel Özellikler
- **Gerçek zamanlı zombi savaşı** - Sürekli saldıran zombi hordalarına karşı savaş
- **3 farklı silah sistemi** - Tabanca, tüfek ve pompalı tüfek
- **Dalga sistemi** - Her dalga daha zor zombilerle dolu
- **Skor sistemi** - Yüksek skor için zombileri öldür
- **Sağlık sistemi** - Hasar aldığında sağlığın azalır
- **Mühimmat yönetimi** - Silahlarını şarj et ve mühimmatını yönet

### 🧟 Zombi Türleri
- **Normal Zombiler** - Yavaş ama güçlü
- **Hızlı Zombiler** - Hızlı ama zayıf

### 🔫 Silah Sistemi
1. **Tabanca** - Hızlı ateş, orta hasar
2. **Tüfek** - Yüksek hasar, doğru atış
3. **Pompalı Tüfek** - Çok yüksek hasar, yakın mesafe

## 🎯 Kontroller

| Tuş | Aksiyon |
|-----|---------|
| **WASD** | Hareket et |
| **Fare** | Nişan al ve ateş et |
| **R** | Silahı şarj et |
| **1-3** | Silah değiştir |
| **ESC** | Ana menüye dön |

## 🚀 Oyunu Başlatma

### Yöntem 1: Doğrudan Tarayıcıda
1. `index.html` dosyasını çift tıklayın
2. Tarayıcınızda otomatik olarak açılacak
3. "START GAME" butonuna tıklayın

### Yöntem 2: Local Server ile
1. Terminal/Command Prompt açın
2. Oyun klasörüne gidin
3. Python ile server başlatın:
   ```bash
   python -m http.server 8000
   ```
4. Tarayıcıda `http://localhost:8000` adresine gidin

## 🎪 Oyun Mekanikleri

### 💊 Sağlık Sistemi
- Başlangıç sağlığı: 100
- Zombiler saldırdığında sağlık azalır
- Sağlık 0 olduğunda oyun biter
- Her dalga sonunda biraz sağlık yenilenir

### 🔄 Dalga Sistemi
- Her dalga daha fazla zombi içerir
- Zombiler her dalgada güçlenir
- Dalga aralarında mühimmat ve sağlık yenilenir

### 💰 Skor Sistemi
- Normal zombi: 100 + (dalga-1) × 10 puan
- Hızlı zombi: 100 + (dalga-1) × 10 puan
- Yüksek skorlar için hayatta kalmaya çalış!

## 🛠️ Teknik Özellikler

### 🎨 Görsel Efektler
- **Kan efektleri** - Zombiler vurulduğunda
- **Patlama efektleri** - Zombiler öldüğünde
- **Namlu alevi** - Ateş ettiğinde
- **Hasar efektleri** - Hasar aldığında
- **Parçacık sistemi** - Gerçekçi efektler

### 🎵 Ses Sistemi
- Silah sesleri
- Zombi sesleri
- Hasar sesleri
- Arka plan müziği

### 📱 Responsive Tasarım
- Masaüstü ve mobil uyumlu
- Modern tarayıcı desteği
- 60 FPS smooth gameplay

## 🎭 Oyun İpuçları

1. **Hareket halinde kal** - Durduğunda zombiler seni çevirir
2. **Mühimmatını yönet** - Boş kaldığında savunmasız kalırsın
3. **Mesafeyi koru** - Zombilerden uzak dur
4. **Silah değiştir** - Duruma göre en uygun silahı kullan
5. **Köşelere sıkışma** - Açık alanda savaş

## 🏆 Zorluk Seviyeleri

- **Dalga 1-3**: Başlangıç seviyesi
- **Dalga 4-7**: Orta seviye
- **Dalga 8-12**: Zor seviye
- **Dalga 13+**: Uzman seviye

## 🔧 Sistem Gereksinimleri

- Modern web tarayıcısı (Chrome, Firefox, Safari, Edge)
- JavaScript desteği
- HTML5 Canvas desteği
- Fare ve klavye

## 📁 Dosya Yapısı

```
zombie-game/
├── index.html      # Ana HTML dosyası
├── style.css       # CSS stilleri
├── game.js         # Oyun motoru
└── README.md       # Bu dosya
```

## 🎮 Oyun Geliştirme

Bu oyun aşağıdaki teknolojilerle geliştirilmiştir:
- **HTML5 Canvas** - Grafik rendering
- **CSS3** - Modern UI tasarımı
- **Vanilla JavaScript** - Oyun motoru
- **Web APIs** - Ses ve input yönetimi

## 🐛 Bilinen Sorunlar

- Mobil cihazlarda touch kontrolleri henüz mevcut değil
- Ses dosyaları henüz eklenmedi (gelecek güncellemede)

## 🚀 Gelecek Güncellemeler

- [ ] Ses efektleri eklenmesi
- [ ] Mobil touch kontrolleri
- [ ] Yeni zombi türleri
- [ ] Power-up sistemleri
- [ ] Çok oyunculu mod
- [ ] Leaderboard sistemi

## 📞 İletişim

Oyunla ilgili geri bildirimlerinizi ve önerilerinizi paylaşmaktan çekinmeyin!

---

**🎯 Hayatta kalabilecek misin? Zombi istilasını durdur!**