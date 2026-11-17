# Şantiye Defteri – Kurulum Rehberi

Telefona kurulan (iPhone + Android), internetsiz çalışan, iki telefonda otomatik eşitlenen uygulama.
Veriler Firebase'de (Google) tutulur. İnternet yokken girdiğin kayıtlar telefonda saklanır, internet gelince otomatik gönderilir.

Bir kerelik kurulum gerekir (yaklaşık 20-30 dk). Yayınlama adımı için **bir bilgisayar** gerekir.

## 1. Firebase projesi (telefondan da yapılabilir)

1. https://console.firebase.google.com adresine Google hesabınla gir → **Proje ekle** → ad: `santiye-defteri` (Analytics kapalı olsun).
2. **Build → Firestore Database → Veritabanı oluştur** → konum `europe-west` → **Üretim modunda** başlat.
3. Firestore'da **Kurallar (Rules)** sekmesine gir, içindekini sil, `firestore.rules` dosyasındaki metni yapıştır → **Yayınla**.
4. **Build → Authentication → Başlayın → Sign-in method → E-posta/Şifre** → etkinleştir.
5. Authentication → **Users → Kullanıcı ekle**:
   - E-posta: `firma@santiyedefteri.com` (gerçek olmak zorunda değil)
   - Şifre: **ortak şifreniz** (en az 12 karakter olsun; ortağınla paylaşacaksın)
6. Proje ayarları (⚙️) → **Genel → Uygulamalarınız → Web (`</>`)** → uygulama ekle → çıkan `firebaseConfig` değerlerini `firebase-config.js` dosyasındaki yerlere yapıştır.
7. **Build → Hosting → Başlayın** (siteyi açar).

## 2. Yayınlama (bilgisayarda)

Zip'i aç, klasörde terminal aç:

```
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore --project PROJE_ID
```

`PROJE_ID` = Firebase proje kimliği. Bitince `https://PROJE_ID.web.app` adresi çıkar. Bu adres uygulamandır.

(Alternatif: klasörü netlify.com/drop sayfasına sürükle-bırak. Bu durumda Firestore kurallarını 1.3'teki gibi elle yapıştırman yeterli.)

## 3. Telefonlara kurma

Adresi ortağına da gönder. **İlk açılış internetle olmalı.**

- **iPhone:** Safari'de aç → Paylaş ⬆️ → **Ana Ekrana Ekle**.
- **Android:** Chrome'da aç → ⋮ → **Uygulamayı yükle** / **Ana ekrana ekle**.

Ana ekrandaki simgeden aç, adını ve ortak şifreyi yaz. Sonrasında internetsiz de açılır; çıkış yapmadığın sürece tekrar giriş istemez.

## Kullanım özeti

- **Tanımlar ⚙️:** önce müteahhit, sonra iş (anlaşılan nakit + gayrimenkul değeri), çalışan/ekip (yevmiye), ortak adları.
- **Puantaj:** "Toplu giriş" ile günün tüm çalışanlarını tek seferde gir.
- **Gider:** kim ödedi seç (kasa / ortak cebi).
- **Cari:** çalışan borçları, müteahhit/iş alacakları, ortakların cepten koyduğu.
- Üstteki rozet: **Eşitlendi / Gönderiliyor / Çevrimdışı**.

## Güncelleme

Uygulama dosyaları değişince `sw.js` içindeki `sd-v1` değerini artır (`sd-v2`…), tekrar `firebase deploy --only hosting` çalıştır. Telefonlarda uygulamayı iki kez kapatıp açınca yeni sürüm gelir.

## Notlar

- İki kişi internetsizken **aynı kaydı** düzenlerse son kaydeden geçerli olur; farklı kayıtlar sorunsuz birleşir.
- Firebase'in ücretsiz planı bu kullanım için fazlasıyla yeterlidir.
- Yedek için Firebase konsolundan Firestore verisini dışa aktarabilirsin.
