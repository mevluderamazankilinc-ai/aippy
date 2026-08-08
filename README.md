# Babaanne Games — Kurulum Rehberi

Bu proje Vercel üzerinde ücretsiz olarak yayına alınabilir. Aşağıdaki adımları sırayla takip et.

## 1. Gerekli hesaplar (hepsi ücretsiz)
- [Vercel](https://vercel.com) hesabı
- [GitHub](https://github.com) hesabı (proje dosyalarını yüklemek için)
- [Google AI Studio](https://aistudio.google.com/apikey) — Gemini API key almak için
- [Google Cloud Console](https://console.cloud.google.com) — Google ile giriş için OAuth Client ID almak için

## 2. Projeyi GitHub'a yükle
Bu klasördeki tüm dosyaları yeni bir GitHub reposuna yükle (GitHub Desktop, `git` komutları veya web arayüzünden "upload files" ile).

## 3. Vercel'de projeyi oluştur
1. Vercel'e gir → **Add New → Project**
2. GitHub reponu seç ve **Import** et
3. Framework olarak "Other" seçilebilir, ek ayar gerekmez
4. Henüz **Deploy** etme — önce aşağıdaki adımları tamamla

## 4. Paylaşılan depoyu (Vercel KV) bağla
1. Vercel projende **Storage** sekmesine git
2. **Create Database → KV** seç, bir isim ver, oluştur
3. Bu veritabanını projene bağla ("Connect Project") — Vercel gerekli ortam değişkenlerini otomatik ekler

## 5. Gemini API key'ini ekle
1. [Google AI Studio](https://aistudio.google.com/apikey)'dan bir API key oluştur
2. Vercel projende **Settings → Environment Variables** kısmına git
3. Şunu ekle:
   - Key: `GEMINI_API_KEY`
   - Value: (senin gerçek Gemini API key'in)

## 6. Google ile Girişi ayarla
1. [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services → Credentials**
2. **Create Credentials → OAuth Client ID** → Application type: **Web application**
3. **Authorized JavaScript origins** kısmına Vercel'in sana vereceği adresi ekle
   (örn. `https://babaanne-games.vercel.app`) — deploy sonrası bu adresi görürsün, sonra buraya dönüp ekleyebilirsin
4. Oluşan **Client ID**'yi kopyala
5. `public/index.html` dosyasında şu satırı bul:
   ```js
   const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com";
   ```
   ve kendi Client ID'inle değiştir, GitHub'a tekrar yükle (push)

## 7. Deploy et
Vercel'de **Deploy** butonuna bas. Birkaç dakika içinde siten `https://<proje-adın>.vercel.app` adresinde yayında olacak.

## Bilinmesi gerekenler
- `GEMINI_API_KEY` sadece sunucuda (`/api/generate.js` içinde) kullanılır, tarayıcıya asla gönderilmez.
- Site herkese açık olacağı için, oyun oluşturma isteklerini kimin yaptığını sınırlamak (rate limiting) istersen bu ileride eklenebilir — şu an herkes sınırsız oyun oluşturabilir ve bu senin Gemini kotanı kullanır.
- Google girişinden gelen kimlik bilgisi tarayıcıda çözümlenir (JWT decode) ve sunucuda doğrulanmaz; bu görüntüleme amaçlı girişler için yeterlidir ama ödeme veya yetkilendirme gibi hassas işlemler için ek bir sunucu tarafı doğrulama eklenmelidir.
