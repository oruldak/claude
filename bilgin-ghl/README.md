# Bilgin Anadolu Lisesi — GHL (GoHighLevel) Uyumlu Site Kopyası

Bu klasör, `bilginokullari.k12.tr` ana sayfasının **GoHighLevel'a yapıştırılabilir**, tek parça, kendi içinde çalışan (inline CSS) bir kopyasını içerir.

## Dosyalar
- `index.html` — Ana sayfa. Tüm CSS dosyanın içinde; harici bağımlılık yoktur.

## GHL'e nasıl eklenir?
1. GHL → **Sites → Funnels/Websites** → yeni bir sayfa oluştur.
2. Boş bir **Custom Code / HTML** elementi ekle (ya da sayfayı "blank" açıp tek bir 1-column section içine Custom Code koy).
3. `index.html` içeriğini olduğu gibi yapıştır.
   - Not: GHL bazı şablonlarda `<html>/<head>/<body>` etiketlerini soyabilir. O durumda `<style>...</style>` bloğunu + `<body>` içindeki HTML'i yapıştırman yeterli.

## Takip kodları (asıl amaç)
GHL'de pixel/tag eklemenin **iki** yolu var, ikisi de bu projede hazır:
- **Sayfa/Funnel ayarları → Tracking Code → Head**: Meta Pixel ve Google tag'i buraya koy (önerilen).
- Ya da `index.html` içindeki `<!-- TAKİP KODLARI -->` bloğunun yorumunu açıp `PIXEL_ID` / `G-XXXXXXX` değerlerini gir.

## Eksikler / yapılacaklar
- **Görseller**: Canlı site tarama korumalı olduğu için gerçek fotoğraflar indirilemedi. HTML'de `[ ... GÖRSELİ ]` yazan gri kutular birer slot; gerçek görselleri GHL Media Library'e yükleyip `background-image` veya `<img>` ile değiştir.
- **Alt sayfalar** (Kurumsal, Kayıt, Haberler, Erasmus vb.): Elimde yalnızca ana sayfanın ekran görüntüsü vardı. İçeriklerini iletirsen aynı stille kurarım.
- Renk/yazı tipi ana sayfa ekran görüntüsünden örneklendi (ana sarı: `#F7C901`). Marka fontu farklıysa `--font` değişkenini güncelle.

## Kaynak
Düzen ve metinler, müşteri kurumun (Velvetine tarafından yönetilen) ana sayfa ekran görüntüsünden birebir yeniden oluşturulmuştur.
