/* 

# Bir web sitesi gerçekte nasıl çalışır?

Bir web sitesine girdiğinde ekranda yalnızca bir sayfa görürsün. Fakat arkada alan adı, DNS, ağ bağlantısı, HTTPS, sunucu, uygulama kodu, veritabanı, önbellek, tarayıcı ve JavaScript gibi birçok katman peş peşe çalışır.

Örneğin tarayıcıya şunu yazdığını düşün:

```text
https://sitecont.io/products
```

Bu adresi yazdığın andan sayfa görünene kadar sistem kabaca şu yolu izler:

```text
Kullanıcı
  ↓
Tarayıcı
  ↓
DNS
  ↓
Sunucu IP adresi
  ↓
HTTPS bağlantısı
  ↓
Web sunucusu
  ↓
Next.js / uygulama kodu
  ↓
API / veritabanı / cache
  ↓
HTML, CSS, JavaScript
  ↓
Tarayıcıda sayfanın çizilmesi
```

Şimdi bunu katman katman inceleyelim.

---

# 1. URL nedir?

Tarayıcıya yazdığın adres bir URL'dir.

```text
https://sitecont.io/products?id=15
```

Bu adresin parçaları vardır:

```text
https://
```

Bağlantı protokolüdür. HTTPS, tarayıcı ile sunucu arasındaki verinin şifreli taşındığını belirtir.

```text
sitecont.io
```

Alan adıdır. İnsanların hatırlaması kolay olan adrestir.

```text
/products
```

Path, yani yol bilgisidir. Sunucuya hangi sayfanın istendiğini söyler.

```text
?id=15
```

Query parameter, yani sorgu parametresidir. Sayfaya veya sunucuya ek veri gönderir.

Buradaki önemli nokta şudur:

Alan adı sitenin kendisi değildir.

`sitecont.io`, sadece ilgili sunucuya ulaşmak için kullanılan okunabilir bir adrestir.

Gerçek iletişim IP adresleri üzerinden gerçekleşir.

Örneğin:

```text
sitecont.io → 104.21.10.25
```

Bu çevirme işlemini DNS yapar.

---

# 2. DNS ne yapar?

DNS'i internetin telefon rehberi gibi düşünebilirsin.

İnsanlar alan adlarını kullanır:

```text
sitecont.io
```

Bilgisayarlar ise IP adresleriyle iletişim kurar:

```text
104.21.10.25
```

Tarayıcı alan adının hangi IP adresine karşılık geldiğini bulmak zorundadır.

Bu işlem sırasında genellikle şu sıra izlenir:

```text
Tarayıcı DNS cache'i
  ↓
İşletim sistemi DNS cache'i
  ↓
Modem veya ağ DNS'i
  ↓
İnternet sağlayıcısının DNS sunucusu
  ↓
Yetkili DNS sunucuları
```

Tarayıcı daha önce aynı siteye girdiyse IP adresi cache içinde bulunabilir. Böylece her seferinde tüm DNS zinciri çalıştırılmaz.

DNS tarafında en sık kullanılan kayıtlar şunlardır:

## A kaydı

Alan adını IPv4 adresine yönlendirir.

```text
sitecont.io → 192.0.2.10
```

## AAAA kaydı

Alan adını IPv6 adresine yönlendirir.

## CNAME kaydı

Bir alan adını başka bir alan adına yönlendirir.

```text
www.sitecont.io → sitecont.io
```

## MX kaydı

E-posta sunucularını belirtir.

```text
mail.sitecont.io
```

## TXT kaydı

Alan adı doğrulama, güvenlik veya e-posta ayarları için kullanılır.

Örneğin:

```text
SPF
DKIM
Google doğrulaması
Cloudflare doğrulaması
```

DNS'in yaptığı şey site dosyalarını barındırmak değildir. Sadece isteğin hangi sunucuya veya servise gideceğini belirtir.

---

# 3. Domain, hosting ve sunucu farkı

Bu üç kavram sık sık birbirine karıştırılır.

## Domain

Sitenin adresidir.

```text
sitecont.io
```

## Hosting

Sitenin dosyalarının veya uygulamasının çalıştığı hizmettir.

Örneğin:

```text
Vercel
Cloudflare Pages
Netlify
DigitalOcean
Windows Server
Linux VPS
```

## Sunucu

Gelen isteklere cevap veren fiziksel veya sanal bilgisayardır.

Sunucuda şunlar çalışabilir:

```text
IIS
Nginx
Apache
Node.js
Next.js
PHP
.NET
Java
Veritabanı
```

Bir domain satın almak, otomatik olarak sitenin çalışacağı anlamına gelmez.

Domain yalnızca adresi verir. Ayrıca hosting veya sunucu gerekir.

Bazı firmalar domain ve hosting hizmetini birlikte satar. Fakat teknik olarak bunlar ayrı sistemlerdir.

---

# 4. Tarayıcı sunucuya nasıl bağlanır?

DNS sonucunda IP adresi bulunduğunda tarayıcı sunucuya ağ bağlantısı açar.

Geleneksel olarak bu işlem TCP üzerinden gerçekleşir.

HTTPS için genellikle port `443` kullanılır.

HTTP için port `80` kullanılır.

Örneğin:

```text
http://sitecont.io
```

isteği varsayılan olarak port 80'e gider.

```text
https://sitecont.io
```

isteği varsayılan olarak port 443'e gider.

Sunucuda ilgili portu dinleyen bir servis bulunmalıdır.

Örneğin Windows Server üzerinde:

```text
IIS → 80 ve 443 portlarını dinler
Next.js → localhost:3000 üzerinde çalışır
```

Bu durumda kullanıcı doğrudan 3000 portuna gitmez.

Akış şu şekilde olabilir:

```text
Kullanıcı
  ↓
IIS :443
  ↓
Reverse proxy
  ↓
Next.js localhost:3000
```

---

# 5. HTTPS ve SSL sertifikası

HTTPS bağlantısı, tarayıcı ile sunucu arasındaki verinin şifrelenmesini sağlar.

Bu sadece şifre veya ödeme bilgileri için önemli değildir. Günümüzde sıradan bir kurumsal site bile HTTPS kullanmalıdır.

HTTPS bağlantısı kurulurken tarayıcı sunucunun sertifikasını kontrol eder.

Sertifika şunları doğrular:

```text
Bu sertifika hangi alan adına ait?
Süresi dolmuş mu?
Güvenilir bir sertifika otoritesi tarafından verilmiş mi?
Bağlantı sırasında değiştirilmiş mi?
```

Örneğin sertifika şu alan adına aitse:

```text
www.sitecont.io
```

ama kullanıcı şuraya girerse:

```text
sitecont.io
```

sertifika iki alanı da kapsamıyorsa tarayıcı hata verebilir.

Bu nedenle sertifika genellikle şunların ikisini de kapsar:

```text
sitecont.io
www.sitecont.io
```

HTTPS bağlantısının ardından tarayıcı ile sunucu ortak bir şifreleme anahtarı oluşturur.

Bundan sonra gönderilen HTTP verileri şifreli şekilde taşınır.

---

# 6. HTTP isteği nedir?

Tarayıcı sunucuya bağlandıktan sonra bir HTTP isteği gönderir.

Basitleştirilmiş bir istek şöyle görünür:

```http
GET /products HTTP/1.1
Host: sitecont.io
User-Agent: Chrome
Accept: text/html
Cookie: sessionId=abc123
```

Burada:

```text
GET
```

İstek metodudur.

```text
/products
```

İstenen kaynağın yoludur.

```text
Host
```

Hangi alan adının istendiğini belirtir.

```text
User-Agent
```

Tarayıcı ve cihaz hakkında bilgi verir.

```text
Accept
```

Tarayıcının hangi veri türünü beklediğini söyler.

```text
Cookie
```

Kullanıcıya ait oturum veya tercih bilgilerini taşıyabilir.

---

# 7. HTTP metodları

Web uygulamalarında en sık kullanılan HTTP metodları şunlardır.

## GET

Veri okumak için kullanılır.

```http
GET /api/products
```

Örneğin ürün listesini getirir.

## POST

Yeni veri oluşturmak için kullanılır.

```http
POST /api/orders
```

Yeni sipariş oluşturabilir.

## PUT

Bir kaynağın tamamını güncellemek için kullanılır.

## PATCH

Bir kaynağın belirli alanlarını güncellemek için kullanılır.

## DELETE

Bir kaynağı silmek için kullanılır.

Örneğin:

```http
DELETE /api/products/15
```

15 numaralı ürünü siler.

Frontend'de düğmeye basmak doğrudan veritabanına erişmez. Genellikle önce API'ye istek gönderilir. API veriyi kontrol eder ve sonra veritabanı işlemini gerçekleştirir.

---

# 8. Web sunucusu ne yapar?

İstek sunucuya ulaştığında ilk olarak bir web sunucusu tarafından karşılanabilir.

Windows Server'da bu genellikle IIS'tir.


*/

window.not = {
  d1: '1SI2TyuLLDeYIGpQN8cmeUBBtXszPQXzpiu4GpKPXu1A',
  d2: 'Sekmeler',
  d3: 'UlakbelForm',
  srgz: '369*/852'
};

/* 
Linux sistemlerde sık kullanılan seçenekler:

```text
Nginx
Apache
Caddy
```

Web sunucusunun görevleri şunlar olabilir:

```text
HTTP ve HTTPS isteklerini karşılamak
SSL sertifikasını yönetmek
Yönlendirme yapmak
Statik dosya sunmak
Reverse proxy yapmak
Sıkıştırma uygulamak
Güvenlik başlıkları eklemek
Log tutmak
```

Örneğin IIS'e şu istek gelir:

```text
https://sitecont.io/about
```

IIS bunu Next.js uygulamasına iletebilir:

```text
http://localhost:3000/about
```

Kullanıcı bunu görmez. Kullanıcının adres çubuğunda hâlâ şu görünür:

```text
https://sitecont.io/about
```

Bu işleme reverse proxy denir.

---

# 9. Reverse proxy nedir?

Reverse proxy, kullanıcı ile uygulama sunucusu arasında duran ara katmandır.

Örneğin:

```text
İnternet
  ↓
IIS
  ↓
Node.js / Next.js
```

Burada Node.js uygulaması doğrudan internete açık olmayabilir.

Sadece yerel olarak çalışır:

```text
127.0.0.1:3000
```

IIS dışarıdan gelen istekleri ona yönlendirir.

Bunun avantajları vardır:

```text
SSL yönetimi merkezi olur
Uygulama portu doğrudan açılmaz
Birden fazla site aynı sunucuda çalışabilir
Yönlendirmeler IIS veya Nginx üzerinden yapılabilir
Güvenlik ve loglama kolaylaşır
```

Örneğin aynı sunucuda iki uygulama bulunabilir:

```text
sitecont.io → localhost:3000
admin.sitecont.io → localhost:3001
```

Reverse proxy, alan adına göre doğru uygulamayı seçer.

---

# 10. Next.js isteği nasıl işler?

İstek Next.js uygulamasına ulaştığında router hangi sayfanın istendiğini belirler.

App Router kullanan bir projede örnek klasör yapısı şöyle olabilir:

```text
app/
  page.tsx
  about/
    page.tsx
  products/
    page.tsx
  products/
    [id]/
      page.tsx
```

Bunlar şu adreslere karşılık gelir:

```text
app/page.tsx
→ /

app/about/page.tsx
→ /about

app/products/page.tsx
→ /products

app/products/[id]/page.tsx
→ /products/15
```

Kullanıcı `/products/15` adresine girdiğinde Next.js `[id]` parametresini alır ve ilgili sayfayı çalıştırır.

Örneğin:

```tsx
export default async function ProductPage({ params }) {
    const { id } = await params;

    const product = await getProduct(id);

    return <h1>{product.name}</h1>;
}
```

Next.js burada veriyi alabilir, HTML üretebilir ve kullanıcıya gönderebilir.

---

# 11. Statik site ile dinamik site farkı

Bir web sitesi iki temel şekilde içerik üretebilir.

## Statik içerik

Hazır HTML dosyaları doğrudan kullanıcıya gönderilir.

Örneğin:

```text
about.html
contact.html
logo.webp
styles.css
```

Sunucu fazla işlem yapmaz.

Dosyayı bulur ve gönderir.

Avantajları:

```text
Hızlıdır
Daha ucuzdur
Sunucu yükü düşüktür
Cache kullanımı kolaydır
```

## Dinamik içerik

Sayfa isteğe göre oluşturulur.

Örneğin kullanıcı profili:

```text
Merhaba, Ahmet
```

Başka kullanıcı için:

```text
Merhaba, Zeynep
```

Burada sunucu kullanıcı bilgisine göre HTML veya JSON üretir.

Dinamik sistemler genellikle şunları kullanır:

```text
Backend uygulaması
API
Veritabanı
Kimlik doğrulama
Session veya token
```

Next.js hem statik hem dinamik çalışabilir.

---

# 12. CSR, SSR, SSG ve ISR

Modern web geliştirmede sayfanın nerede ve ne zaman üretildiği önemlidir.

## CSR: Client-Side Rendering

Sayfa büyük ölçüde tarayıcıda JavaScript ile oluşturulur.

İlk cevap şöyle olabilir:

```html
<div id="root"></div>
<script src="app.js"></script>
```

Tarayıcı JavaScript dosyasını indirir. Daha sonra API'den veri alır ve sayfayı oluşturur.

Akış:

```text
Tarayıcı HTML'i alır
  ↓
JavaScript'i indirir
  ↓
JavaScript çalışır
  ↓
API isteği gider
  ↓
Veri gelir
  ↓
Sayfa görünür
```

Avantajı, uygulama içi geçişlerin oldukça dinamik olmasıdır.

Dezavantajı, ilk açılışta boş veya eksik içerik görülebilmesidir.

## SSR: Server-Side Rendering

HTML her istekte sunucuda oluşturulur.

Kullanıcı:

```text
/products
```

adresini açar.

Sunucu:

```text
Veritabanından ürünleri alır
HTML üretir
Tarayıcıya gönderir
```

Avantajları:

```text
İlk içerik hızlı görünür
SEO için uygundur
Kullanıcıya özel veri üretilebilir
```

Dezavantajı, her istekte sunucunun çalışmasıdır.

## SSG: Static Site Generation

Sayfalar build sırasında oluşturulur.

```text
npm run build
```

çalıştığında HTML önceden hazırlanır.

Sonra tüm kullanıcılara aynı hazır dosya gönderilir.

Avantajları:

```text
Çok hızlıdır
Sunucu maliyeti düşüktür
CDN ile kolay dağıtılır
```

Fakat veri değiştiğinde yeniden build gerekebilir.

## ISR: Incremental Static Regeneration

ISR, statik sayfanın belirli aralıklarla yenilenmesini sağlar.

Örneğin:

```tsx
export const revalidate = 300;
```

Bu, sayfanın yaklaşık 5 dakikada bir yeniden üretilebilmesini sağlar.

Akış şu şekilde olabilir:

```text
İlk kullanıcı cache'teki sayfayı görür
  ↓
Süre dolmuşsa Next.js arka tarafta yeni sayfa üretir
  ↓
Sonraki kullanıcı yeni sürümü görür
```

ISR özellikle şu tür sayfalarda kullanışlıdır:

```text
Festival programı
Haber listesi
Ürün kataloğu
Kurumsal içerikler
Blog yazıları
```

Veri her saniye değişmiyorsa her istekte SSR yapmak gereksiz yük oluşturabilir.

---

# 13. Backend nedir?

Backend, kullanıcının doğrudan görmediği sunucu tarafıdır.

Şunlardan sorumlu olabilir:

```text
Veri doğrulama
Kullanıcı işlemleri
Yetkilendirme
Veritabanı erişimi
Dosya işlemleri
E-posta gönderme
Ödeme işlemleri
İş kuralları
```

Örneğin kullanıcı bir iletişim formu gönderir:

```text
Ad: Ahmet
E-posta: ahmet@example.com
Mesaj: Bilgi almak istiyorum
```

Frontend bu bilgileri API'ye yollar.

```http
POST /api/contact
```

Backend şunları kontrol eder:

```text
Ad boş mu?
E-posta geçerli mi?
Mesaj çok uzun mu?
Spam olabilir mi?
Kullanıcı çok fazla istek gönderiyor mu?
```

Kontroller geçerse kayıt veritabanına yazılabilir veya e-posta gönderilebilir.

Frontend yalnızca kullanıcı arayüzünü temsil eder. Kritik iş kuralları sadece frontend'e bırakılmamalıdır.

Çünkü kullanıcı frontend kodunu değiştirebilir veya API'ye doğrudan istek gönderebilir.

---

# 14. API nedir?

API, sistemlerin birbiriyle konuşmasını sağlayan arayüzdür.

Örneğin frontend şu isteği yapar:

```http
GET /api/products
```

Sunucu şu cevabı döner:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Kahve",
      "price": 120
    },
    {
      "id": 2,
      "name": "Çay",
      "price": 40
    }
  ]
}
```

Frontend bu JSON verisini alıp ekranda listeleyebilir.

API'nin görevi yalnızca veri taşımak değildir. Aynı zamanda sistem sınırını oluşturur.

İyi tasarlanmış bir API şunlara dikkat eder:

```text
Tutarlı endpoint yapısı
Doğru HTTP metodları
Doğru status code'lar
Validasyon
Yetkilendirme
Hata yönetimi
Rate limiting
Loglama
```

---

# 15. HTTP durum kodları

Sunucu verdiği cevabın sonucunu status code ile belirtir.

## 200 OK

İstek başarılıdır.

## 201 Created

Yeni kayıt başarıyla oluşturulmuştur.

## 204 No Content

İşlem başarılıdır fakat cevap gövdesi yoktur.

## 301 Moved Permanently

Kalıcı yönlendirme vardır.

Örneğin:

```text
http://sitecont.io
→
https://sitecont.io
```

## 302 Found

Geçici yönlendirmedir.

## 400 Bad Request

İstek hatalıdır.

## 401 Unauthorized

Kullanıcı giriş yapmamıştır veya kimliği doğrulanamamıştır.

## 403 Forbidden

Kullanıcı tanınmıştır fakat bu işlemi yapma yetkisi yoktur.

## 404 Not Found

İstenen sayfa veya veri bulunamamıştır.

## 409 Conflict

Veri çakışması oluşmuştur.

## 422 Unprocessable Entity

Gönderilen veri yapısal olarak geçerli olabilir ancak iş kurallarına uymaz.

## 500 Internal Server Error

Sunucuda beklenmeyen hata oluşmuştur.

## 502 Bad Gateway

Reverse proxy uygulama sunucusundan geçerli cevap alamamıştır.

Örneğin IIS çalışıyor ama Next.js uygulaması kapalıysa 502 görülebilir.

## 503 Service Unavailable

Servis geçici olarak kullanılamıyordur.

---

# 16. Veritabanı nasıl devreye girer?

Bir site ürün, kullanıcı, sipariş veya içerik saklıyorsa genellikle veritabanı kullanır.

Yaygın ilişkisel veritabanları:

```text
PostgreSQL
MySQL
SQL Server
MariaDB
```

Yaygın NoSQL sistemleri:

```text
MongoDB
DynamoDB
Redis
```

Örneğin ürün tablosu şöyle olabilir:

```text
Products
--------------------------------
Id
Name
Price
Stock
CreatedAt
```

API şu isteği aldığında:

```http
GET /api/products/15
```

Backend veritabanında sorgu çalıştırır:

```sql
SELECT Id, Name, Price, Stock
FROM Products
WHERE Id = 15;
```

Sonuç JSON'a çevrilir ve kullanıcıya gönderilir.

Burada önemli mimari kural şudur:

Frontend doğrudan veritabanına bağlanmamalıdır.

Doğru akış:

```text
Frontend
  ↓
API
  ↓
Backend
  ↓
Veritabanı
```

Yanlış ve güvensiz akış:

```text
Frontend
  ↓
Doğrudan veritabanı
```

Veritabanı kullanıcı adı ve parolası tarayıcıya gönderilmemelidir.

---

# 17. Cache nedir?

Cache, daha önce üretilmiş veya indirilmiş verinin geçici olarak saklanmasıdır.

Amaç aynı işlemi tekrar tekrar yapmamaktır.

Cache farklı katmanlarda olabilir:

```text
Tarayıcı cache'i
CDN cache'i
Reverse proxy cache'i
Next.js cache'i
API cache'i
Veritabanı cache'i
Redis cache'i
```

Örneğin logo dosyası:

```text
/logo.webp
```

her sayfa açılışında tekrar indirilmeyebilir.

Tarayıcı dosyayı cache içinde tutar.

Sunucu şu header'ı gönderebilir:

```http
Cache-Control: public, max-age=31536000
```

Bu, dosyanın uzun süre saklanabileceğini belirtir.

Ancak aynı dosya adıyla logo değiştirilirse kullanıcı eski logoyu görmeye devam edebilir.

Bu nedenle build sistemleri genellikle dosya adına hash ekler:

```text
logo.a81f223c.webp
```

Dosya değişince hash de değişir:

```text
logo.09bd712a.webp
```

Böylece tarayıcı yeni dosya olduğunu anlar.

---

# 18. CDN nedir?

CDN, dosyaların kullanıcıya yakın sunuculardan dağıtılmasını sağlar.

Örneğin ana sunucun İstanbul'da olabilir.

Fakat Almanya'daki kullanıcı görselleri Frankfurt'taki CDN sunucusundan alabilir.

Akış:

```text
Kullanıcı
  ↓
En yakın CDN noktası
  ↓
Dosya cache'te varsa doğrudan cevap
  ↓
Yoksa ana sunucudan al ve cache'le
```

CDN en çok şu dosyalarda faydalıdır:

```text
Resimler
CSS
JavaScript
Fontlar
Videolar
Statik HTML
```

Cloudflare gibi sistemler DNS, CDN, güvenlik ve proxy hizmetlerini birlikte sağlayabilir.

Ancak Cloudflare genellikle sitenin uygulama kodunu otomatik olarak barındırmaz. Yapılandırmaya göre sadece trafiğin önünde durabilir veya Pages/Workers gibi ayrı servisleriyle hosting sağlayabilir.

---

# 19. Tarayıcı HTML'i nasıl işler?

Sunucudan HTML geldiğinde tarayıcı bunu okumaya başlar.

Örnek HTML:

```html
<!doctype html>
<html>
<head>
    <title>SiteCont</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <h1>SiteCont</h1>
    <button id="contact-button">İletişim</button>

    <script src="/app.js"></script>
</body>
</html>
```

Tarayıcı HTML'i işlerken DOM ağacını oluşturur.

Kabaca şöyle:

```text
html
 ├─ head
 │   ├─ title
 │   └─ link
 └─ body
     ├─ h1
     ├─ button
     └─ script
```

DOM, sayfanın programatik temsilidir.

JavaScript şu kodla düğmeye ulaşabilir:

```javascript
const button = document.querySelector("#contact-button");
```

---

# 20. CSS nasıl işlenir?

Tarayıcı CSS dosyasını indirir ve CSSOM adı verilen bir yapı oluşturur.

Örnek:

```css
h1 {
    font-size: 48px;
}

button {
    border-radius: 8px;
}
```

Tarayıcı daha sonra DOM ve CSSOM'u birleştirerek render tree oluşturur.

Render tree, ekranda gerçekten çizilecek elemanları içerir.

Örneğin:

```css
display: none;
```

olan bir eleman DOM'da bulunabilir fakat render tree'de yer almaz.

Sonrasında tarayıcı şu işlemleri yapar:

```text
Style calculation
Layout
Paint
Composite
```

## Style calculation

Hangi elemente hangi CSS kurallarının uygulanacağı hesaplanır.

## Layout

Elementlerin boyutu ve konumu hesaplanır.


*/