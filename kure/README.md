# Küre — 3B Öğrenme Platformu

İlkokul, ortaokul ve lise müfredatını **üç boyutlu, animasyonlu ve etkileşimli**
ders modülleriyle anlatan okul uygulaması. Amaç ezber değil: öğrenci sahneyi
döndürür, parametreleri değiştirir, sonucu anında görür ve konunun ispatını okur.

## Şu an ne var?

| Katman | Durum |
| --- | --- |
| **Müfredat ağacı** | 12 ders · 1–12. sınıf · ünite/tema → konu → kazanım (MEB Türkiye Yüzyılı Maarif Modeli yapısına göre) |
| **3B ders modülleri** | 23 modül (matematik, fizik, kimya, biyoloji, fen bilimleri) |
| **Ders oynatıcı** | Adım adım anlatım · canlı sahne · KaTeX ispat paneli · ölçme soruları · müfredat bağlantısı |
| **İlerleme takibi** | Modül bazlı ilerleme + quiz puanı (tarayıcıda; sunucu arayüzü hazır) |
| **Okul (multi-tenant)** | Alt alan adına göre okul profili, marka rengi, açık kademeler — `src/lib/okul.ts` |

### 3B modüller

**Matematik** — türev (kesen → teğet limiti), integral (Riemann toplamları →
analizin temel teoremi), dönel cisim hacmi (disk yöntemi), birim çember
(sinüs–kosinüs sarmalı), fonksiyon dönüşümleri, Pisagor (alanlarla ispat),
geometrik cisimler (açınım katlama + kesit), kesirler.

**Fizik** — eğik atış (3B, gezegen seçimli), basit sarkaç (enerji çubukları),
eğik düzlem (serbest cisim diyagramı), elektrik alan (3B alan çizgileri),
mercekler (üç ana ışın, gerçek/sanal görüntü).

**Kimya** — atom modeli (Bohr → orbital olasılık bulutu), molekül geometrisi
(VSEPR), periyodik sistem (118 element, 3B eğilim haritası).

**Biyoloji** — hücre (organeller + madde geçişi), kalp ve kan dolaşımı, nöron
ve sinirsel iletim, DNA (replikasyon → transkripsiyon → translasyon), iskelet
ve kas sistemi.

**Fen Bilimleri** — Güneş sistemi / Ay evreleri / tutulmalar, mevsimlerin
oluşumu (eksen eğikliği, öğle açısı, gündüz süresi hesaplı).

## Çalıştırma

```bash
npm install
npm run dev      # geliştirme
npm run build    # üretim derlemesi (dist/)
npm run preview  # derlenmiş sürümü sun
npm run smoke    # tüm sayfaları tarayıcıda gezip konsol hatası arar
```

`npm run smoke` için önce `npm run preview` ile sunucunun 4321 portunda
ayakta olması gerekir.

## Mimari

```
src/
  curriculum/     müfredat verisi (ders → sınıf → ünite → konu → kazanım)
  lessons/
    shared/       ortak 3B araç takımı (Sahne, Etiket, Ok, Eksenler, Egri, Cizgi…)
                  ve kontrol arayüzü (Kaydirac, Dugme, Gosterge, Tex…)
    matematik/    her dosya bir DersModulu: sahne + adımlar + ispat + sorular
    fizik/ kimya/ biyoloji/ fen/
    registry.ts   sahne kimliği → modül eşlemesi
  components/     Kabuk, DersOynatici, Quiz
  pages/          ana sayfa, kademe, ders, modül, arama, panel
  lib/            tipler, ilerleme (zustand + localStorage), okul profili
```

Bir konuyu 3B modüle bağlamak için müfredat verisindeki konuya `sahne: 'modul-id'`
yazmak yeterlidir; ders sayfası, arama ve panel bağlantıyı otomatik kurar.

### Yeni modül eklemek

1. `src/lessons/<ders>/<ad>.tsx` içinde `DersModulu` dışa aktar:
   `Sahne` (adım numarasını prop olarak alır), `adimlar`, `ispat`, `sorular`.
2. `src/lessons/registry.ts` içine ekle.
3. İlgili müfredat konusuna `sahne: '<id>'` alanını yaz.

## Performans notları

- Sahneler React durumu ile sürüldüğü için `useZaman` ~42 fps ile sınırlandırıldı.
- `Cizgi` bileşeni, nokta değerleri değişmediği sürece aynı dizi referansını
  koruyarak her karede yeni `LineGeometry` ayrılmasını engeller.
- Etiketler DOM tabanlıdır (drei `Html`); böylece harici yazı tipi indirilmez ve
  Türkçe karakterler sorunsuz görünür.

## Yol haritası

1. Kalan müfredat başlıkları için modül üretimi.
2. Okul bazlı giriş paneli, sınıf–şube ve öğretmen yönetimi.
3. Okul başına ayrı sunucu / alt alan adı, marka ve tema özelleştirmesi.
4. Ödev, sınav ve karne raporlaması; veli görünümü.

## Not

Müfredat verisi kamuya açık MEB öğretim programı yapısına göre sadeleştirilerek
hazırlanmıştır ve okul zümreleri tarafından `src/curriculum/` altından
güncellenebilir.
