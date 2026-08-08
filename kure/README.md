# Küre — 3B Öğrenme Platformu

İlkokul, ortaokul ve lise müfredatını **gerçek görsellerle, üç boyutlu ve
animasyonlu** ders sahneleriyle anlatan okul uygulaması. Her ders bir soruyla
başlar — *neden böyle?*, *nasıl oluyor?* — öğrenci sahnede kendi eliyle dener,
sonunda ispatı ve ölçme sorularını görür.

## Tasarım ilkeleri

1. **Grafik değil, gerçeklik.** Sahneler boşlukta yüzen çizgiler değil; çim
   saha, ahşap tezgâh, kareli defter yaprağı gibi gerçek bir ortamın içinde
   durur. Nesneler gölge düşürür, ışık gerçek hesaplanır.
2. **Gerçek görseller.** Dünya, Ay ve gezegen dokuları NASA görüntülerinden
   türetilmiş açık kaynak dokulardır (`public/doku/`). Sahne aydınlatması
   gerçek bir HDR ortam haritasıyla yapılır (`public/hdr/`). Kart kapakları
   yapay stok fotoğraf değil, dersin kendi sahnesinden alınmış gerçek
   karelerdir (`public/kapak/`, `npm run kapaklar`).
3. **Neden–nasıl akışı.** Adım başlıkları soru cümlesidir; her adım bir
   gözlemi açıklar ve sonraki soruyu doğurur.
4. **İspat zorunlu.** Her modülde formülün nereden çıktığı adım adım
   türetilir; "ezberle" denmez.

## Neler var?

| Katman | Durum |
| --- | --- |
| **Müfredat ağacı** | 12 ders · 1–12. sınıf · ünite/tema → konu → kazanım (MEB Türkiye Yüzyılı Maarif Modeli yapısına göre) |
| **3B ders sahneleri** | 23 ders (matematik, fizik, kimya, biyoloji, fen bilimleri) |
| **Ders oynatıcı** | Adım adım anlatım · canlı sahne · KaTeX ispat paneli · ölçme soruları · müfredat bağlantısı |
| **Ödev + çözüm sistemi** | Öğretmen ödev verir; öğrenci çözer; **yanlış yaptığı sorularda adım adım çözüm açılır** ve ilgili 3B derse bağlanır |
| **Soru bankası** | Adım adım çözümlü, ipuçlu, çoktan seçmeli ve sayısal sorular (`src/soru/banka.ts`) |
| **İlerleme takibi** | Modül ilerlemesi, quiz puanı, ödev sonuçları (tarayıcıda; sunucu arayüzü hazır) |
| **Okul (multi-tenant)** | Alt alan adına göre okul profili, marka rengi, açık kademeler (`src/lib/okul.ts`) |

### 3B dersler

**Matematik** — türev (kesen → teğet limiti), integral (Riemann toplamları →
analizin temel teoremi), dönel cisim hacmi, birim çember (sinüs–kosinüs
sarmalı), fonksiyon dönüşümleri, Pisagor (alanlarla ispat), geometrik cisimler
(açınım katlama + kesit), kesirler.

**Fizik** — eğik atış (çim sahada, gezegen seçimli), basit sarkaç (ahşap
düzenek, metal küre, enerji çubukları), eğik düzlem, elektrik alan (3B alan
çizgileri), mercekler (üç ana ışın, gerçek/sanal görüntü).

**Kimya** — atom modeli (Bohr → orbital olasılık bulutu), molekül geometrisi
(VSEPR), periyodik sistem (118 element, 3B eğilim haritası).

**Biyoloji** — hücre, kalp ve kan dolaşımı, nöron ve sinirsel iletim, DNA
(replikasyon → transkripsiyon → translasyon), iskelet ve kas sistemi.

**Fen Bilimleri** — Güneş sistemi / Ay evreleri / tutulmalar, mevsimlerin
oluşumu (gerçek Dünya dokusu, öğle açısı ve gündüz süresi hesaplı).

## Çalıştırma

```bash
npm install
npm run dev        # geliştirme
npm run build      # üretim derlemesi (dist/)
npm run preview    # derlenmiş sürümü 4321 portunda sun
npm run smoke      # 30 sayfayı tarayıcıda gezip konsol hatası arar
npm run kapaklar   # ders kartlarının kapak görsellerini yeniden üretir
```

`smoke` ve `kapaklar`, `preview` sunucusunun ayakta olmasını bekler.

## Mimari

```
public/
  doku/     gerçek dokular (NASA türevli gök cisimleri, ahşap, çim, tuğla)
  hdr/      ortam aydınlatma haritası
  kapak/    ders kartı kapakları (sahnelerden üretilmiş gerçek kareler)
src/
  curriculum/     müfredat verisi (ders → sınıf → ünite → konu → kazanım)
  soru/banka.ts   adım adım çözümlü soru bankası
  lessons/
    shared/       3B araç takımı: Sahne (zemin, gölge, IBL), KareliKagit,
                  gokcisimleri (Dünya/Ay/Güneş), Etiket, Ok, Eksenler, Egri…
                  ve kontrol arayüzü (Kaydirac, Dugme, Gosterge, Tex…)
    matematik/ fizik/ kimya/ biyoloji/ fen/
    registry.ts   sahne kimliği → modül eşlemesi
  components/     Kabuk, DersOynatici, ModulKarti, Quiz
  pages/          ana sayfa, kademe, ders, modül, ödevler, ödev, arama, panel
  lib/            tipler, ilerleme, ödev, okul profili
```

Bir konuyu 3B derse bağlamak için müfredattaki konuya `sahne: 'modul-id'`
yazmak yeterlidir; ders sayfası, arama ve panel bağlantıyı kendiliğinden kurar.

### Yeni ders eklemek

1. `src/lessons/<ders>/<ad>.tsx` içinde `DersModulu` dışa aktar: `Sahne`
   (adım numarasını prop alır), `adimlar`, `ispat`, `sorular`.
2. `src/lessons/registry.ts` içine ekle.
3. İlgili müfredat konusuna `sahne: '<id>'` alanını yaz.
4. `npm run kapaklar` ile kapak görselini üret.

### Yeni ödev sorusu eklemek

`src/soru/banka.ts` içine `BankaSorusu` ekle: soru, doğru cevap, **ipucu**,
**adım adım çözüm** (`cozum[]`, LaTeX destekli) ve varsa `modul` bağlantısı.
Öğretmen paneli soruları buradan seçerek ödev oluşturur.

## Performans notları

- Sahneler React durumu ile sürülür; `useZaman` ~42 fps ile sınırlandırıldı.
- `Cizgi`, nokta değerleri değişmediği sürece aynı dizi referansını koruyarak
  her karede yeni `LineGeometry` ayrılmasını engeller.
- Etiketler DOM tabanlıdır (drei `Html`); harici yazı tipi indirilmez, Türkçe
  karakterler sorunsuz görünür.
- `Eksenler` bileşeninde `bolme = 0` verildiğinde tik üretimi kapatılır
  (sıfıra bölme kaynaklı sonsuz döngü koruması).

## Yol haritası

1. Kalan müfredat başlıkları için 3B ders üretimi.
2. Okul bazlı giriş paneli, sınıf–şube ve öğretmen yönetimi; ödevlerin
   sunucuda tutulması.
3. Okul başına ayrı sunucu / alt alan adı, marka ve tema özelleştirmesi.
4. Sınav, karne raporlaması ve veli görünümü.

## Varlık kaynakları

`public/doku/` ve `public/hdr/` altındaki dokular three.js deposunun örnek
varlıklarından alınmıştır (gök cismi dokuları NASA görüntülerinden türetilmiş,
HDR ortam haritası Poly Haven kaynaklıdır). Müfredat verisi kamuya açık MEB
öğretim programı yapısına göre sadeleştirilmiştir ve okul zümreleri tarafından
`src/curriculum/` altından güncellenebilir.
