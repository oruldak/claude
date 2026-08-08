import { S, U, type Ders } from '../lib/types'

/**
 * Sözel ve yardımcı dersler.
 * Bu dersler için 3B modüller ikinci fazda üretilecek; müfredat ağacı,
 * konu takibi ve içerik planlaması bugünden hazır durumdadır.
 */

export const turkce: Ders = {
  kod: 'turkce',
  ad: 'Türkçe',
  kademeler: ['ilkokul', 'ortaokul'],
  renk: '#f472b6',
  ikon: '✎',
  ozet: 'Okuma, dinleme, konuşma ve yazma becerileri; söz varlığı ve metin türleri.',
  siniflar: [
    S(1, [U('Okuma Yazmaya Hazırlık ve İlk Okuma', [
      ['Ses ve Harf Çalışmaları', ['Sesleri ayırt eder, harfleri tanır ve yazar.']],
      ['Okuduğunu Anlama', ['Kısa metinleri okur, sorulara cevap verir.']],
    ])]),
    S(2, [U('Okuma ve Yazma', [
      ['Metin Türleri', ['Şiir, hikâye ve bilgilendirici metni ayırt eder.']],
      ['Yazım ve Noktalama', ['Büyük harf, nokta, virgül ve soru işaretini kurallara uygun kullanır.']],
    ])]),
    S(3, [U('Anlama ve Anlatma', [
      ['Metin Çözümleme', ['Metnin ana fikrini ve yardımcı fikirlerini belirler.']],
      ['Söz Varlığı', ['Eş ve zıt anlamlı sözcükleri, deyimleri kullanır.']],
    ])]),
    S(4, [U('Dil Bilgisi ve Metin', [
      ['Sözcük Türleri', ['İsim, sıfat ve fiilleri cümle içinde belirler.']],
      ['Yazma', ['Olay yazıları ve mektup türünde metin oluşturur.']],
    ])]),
    S(5, [U('Okuma ve Dil Bilgisi', [
      ['Metin Türleri ve Ana Düşünce', ['Metin türlerini ayırt eder, ana düşünceyi belirler.']],
      ['Sözcükte Anlam ve Yapı', ['Gerçek, mecaz ve terim anlamı ayırt eder; kök-ek çözümlemesi yapar.']],
    ])]),
    S(6, [U('Dil Bilgisi', [
      ['Sözcük Türleri', ['İsim, zamir, sıfat, zarf ve edatları belirler.']],
      ['Cümlede Anlam', ['Cümleler arası anlam ilişkilerini çözümler.']],
    ])]),
    S(7, [U('Fiiller ve Metin', [
      ['Fiiller ve Ekleri', ['Fiil kip ve çekimlerini, ek fiili belirler.']],
      ['Metin Türleri', ['Anı, gezi yazısı ve deneme türlerini ayırt eder.']],
    ])]),
    S(8, [U('Cümle Bilgisi', [
      ['Fiilimsiler', ['İsim-fiil, sıfat-fiil ve zarf-fiilleri cümlede bulur.']],
      ['Cümlenin Ögeleri ve Cümle Türleri', ['Ögeleri ayırır, cümleleri yapı ve anlamına göre sınıflandırır.']],
    ])]),
  ],
}

export const hayatBilgisi: Ders = {
  kod: 'hayat-bilgisi',
  ad: 'Hayat Bilgisi',
  kademeler: ['ilkokul'],
  renk: '#fbbf24',
  ikon: '🏡',
  ozet: 'Okul, aile, sağlık, güvenlik, doğa ve toplum hayatına ilişkin temel yaşam becerileri.',
  siniflar: [1, 2, 3].map((s) =>
    S(s, [
      U('Okulumuzda Hayat', [['Okul Kuralları ve Arkadaşlık', ['Okul kurallarına uyar, iş birliği yapar.']]]),
      U('Evimizde Hayat', [['Aile ve Sorumluluklar', ['Aile içindeki görev ve sorumluluklarını yerine getirir.']]]),
      U('Sağlıklı Hayat', [['Beslenme ve Hijyen', ['Sağlıklı beslenme ve temizlik alışkanlıkları kazanır.']]]),
      U('Güvenli Hayat', [['Trafik ve Kaza Önleme', ['Trafik kurallarına uyar, acil durumlarda ne yapacağını bilir.']]]),
      U('Ülkemizde Hayat', [['Millî Değerler', ['Millî bayramları ve değerleri tanır.']]]),
      U('Doğada Hayat', [['Doğa ve Çevre', ['Doğal varlıkları korur, mevsim değişimlerini gözlemler.']]]),
    ]),
  ),
}

export const sosyalBilgiler: Ders = {
  kod: 'sosyal',
  ad: 'Sosyal Bilgiler',
  kademeler: ['ortaokul'],
  renk: '#fb923c',
  ikon: '🌍',
  ozet: 'Birey, toplum, kültür, coğrafya, tarih, ekonomi ve vatandaşlık konuları.',
  siniflar: [5, 6, 7].map((s) =>
    S(s, [
      U('Birey ve Toplum', [['Kimlik, Rol ve Haklar', ['Toplumdaki rollerini ve çocuk haklarını açıklar.']]]),
      U('Kültür ve Miras', [['Tarihî Dönemler ve Kültürel Miras', ['Türk tarihindeki önemli dönemleri ve kültürel mirası tanır.']]]),
      U('İnsanlar, Yerler ve Çevreler', [['Coğrafi Konum ve İklim', ['Haritalar üzerinde konum belirler, iklim-yaşam ilişkisini kurar.']]]),
      U('Bilim, Teknoloji ve Toplum', [['Buluşlar ve Etkileri', ['Buluşların toplumsal değişime etkisini açıklar.']]]),
      U('Üretim, Dağıtım ve Tüketim', [['Ekonomik Faaliyetler', ['Üretim-tüketim ilişkisini ve bilinçli tüketiciliği açıklar.']]]),
      U('Etkin Vatandaşlık', [['Yönetim ve Katılım', ['Demokratik katılım yollarını açıklar.']]]),
    ]),
  ).concat(
    S(8, [
      U('Bir Kahraman Doğuyor', [['Atatürk\'ün Hayatı', ['Atatürk\'ün fikir hayatını etkileyen olayları açıklar.']]]),
      U('Millî Uyanış', [['I. Dünya Savaşı ve Kurtuluş Savaşı Hazırlıkları', ['Millî mücadelenin hazırlık dönemini analiz eder.']]]),
      U('Millî Bir Destan', [['Kurtuluş Savaşı Cepheleri', ['Cepheleri ve sonuçlarını değerlendirir.']]]),
      U('Atatürkçülük ve Çağdaşlaşan Türkiye', [['İnkılaplar ve İlkeler', ['İnkılapların amaçlarını ve Atatürk ilkelerini açıklar.']]]),
      U('Demokratikleşme Çabaları', [['Çok Partili Hayat', ['Demokratikleşme sürecini değerlendirir.']]]),
      U('Atatürk\'ün Ölümü ve Sonrası', [['Türkiye\'nin Dış Politikası', ['Dönemin dış politika gelişmelerini analiz eder.']]]),
    ]),
  ),
}

export const edebiyat: Ders = {
  kod: 'edebiyat',
  ad: 'Türk Dili ve Edebiyatı',
  kademeler: ['lise'],
  renk: '#f472b6',
  ikon: '📖',
  ozet: 'Metin türleri, edebî dönemler ve dil bilgisi.',
  siniflar: [
    S(9, [
      U('Giriş ve Hikâye', [['Edebiyat-Bilim İlişkisi, Olay Örgüsü', ['Edebiyatın diğer bilimlerle ilişkisini açıklar.', 'Hikâyede olay örgüsü, kişi, zaman ve mekânı çözümler.']]]),
      U('Şiir ve Diğer Türler', [['Şiir Bilgisi', ['Şiirde ahenk, ölçü ve imgeyi çözümler.']], ['Roman, Tiyatro ve Deneme', ['Türlerin yapı özelliklerini karşılaştırır.']]]),
    ]),
    S(10, [U('Türk Edebiyatının Dönemleri', [
      ['Destan ve Halk Edebiyatı', ['Sözlü ve yazılı dönem ürünlerini karşılaştırır.']],
      ['Divan Edebiyatı', ['Divan şiirinin biçim ve içerik özelliklerini çözümler.']],
    ])]),
    S(11, [U('Tanzimat\'tan Cumhuriyet\'e', [
      ['Tanzimat ve Servetifünun', ['Dönemin edebî anlayışını metinlerle karşılaştırır.']],
      ['Millî Edebiyat', ['Dil ve edebiyat anlayışındaki değişimi açıklar.']],
    ])]),
    S(12, [U('Cumhuriyet Dönemi', [
      ['Cumhuriyet Dönemi Şiiri ve Romanı', ['Toplumcu, garipçi ve modernist eğilimleri karşılaştırır.']],
      ['Dünya Edebiyatı', ['Türk edebiyatı ile dünya edebiyatı arasında ilişki kurar.']],
    ])]),
  ],
}

export const tarih: Ders = {
  kod: 'tarih',
  ad: 'Tarih',
  kademeler: ['lise'],
  renk: '#d4a373',
  ikon: '🏺',
  ozet: 'Tarih bilimi, İslam öncesi Türk tarihi, Osmanlı ve çağdaş Türkiye tarihi.',
  siniflar: [
    S(9, [U('Tarih ve Zaman / İlk Uygarlıklar', [
      ['Tarih Bilimi', ['Tarihin yöntemini ve kaynak türlerini açıklar.']],
      ['İlk ve Orta Çağ Uygarlıkları', ['İlk uygarlıkların yönetim ve kültür özelliklerini karşılaştırır.']],
    ])]),
    S(10, [U('Osmanlı\'nın Kuruluşu ve Yükselişi', [
      ['Beylikten Devlete', ['Osmanlı Devleti\'nin kuruluş kuramlarını değerlendirir.']],
      ['Dünya Gücü Osmanlı', ['Osmanlı\'nın klasik dönem kurumlarını açıklar.']],
    ])]),
    S(11, [U('Değişim ve Dönüşüm', [
      ['XVII-XIX. Yüzyıl Osmanlı', ['Islahat hareketlerinin nedenlerini analiz eder.']],
      ['Millî Mücadele', ['Millî mücadele sürecini kaynaklarla değerlendirir.']],
    ])]),
    S(12, [U('Çağdaş Türk ve Dünya Tarihi', [
      ['İki Savaş Arası Dönem', ['Dünya savaşları arasındaki gelişmeleri analiz eder.']],
      ['Soğuk Savaş ve Küreselleşme', ['Soğuk Savaş sonrası düzeni değerlendirir.']],
    ])]),
  ],
}

export const cografya: Ders = {
  kod: 'cografya',
  ad: 'Coğrafya',
  kademeler: ['lise'],
  renk: '#4ade80',
  ikon: '🗺',
  ozet: 'Doğal sistemler, beşerî sistemler, mekânsal sentez ve çevre-toplum.',
  siniflar: [9, 10, 11, 12].map((s) =>
    S(s, [
      U('Doğal Sistemler', [
        ['Dünya\'nın Şekli ve Hareketleri', ['Eksen eğikliği ve yıllık hareketin sonuçlarını açıklar.'], 'mevsimler'],
        ['İklim, Yer Şekilleri ve Su Kaynakları', ['İklim elemanlarını ve yer şekillerinin oluşumunu açıklar.']],
      ]),
      U('Beşerî Sistemler', [['Nüfus, Yerleşme ve Ekonomi', ['Nüfus ve yerleşme özelliklerini ekonomik faaliyetlerle ilişkilendirir.']]]),
      U('Küresel Ortam ve Çevre', [['Bölgeler, Ülkeler ve Çevre Sorunları', ['Küresel çevre sorunlarını ve doğal afetleri değerlendirir.']]]),
    ]),
  ),
}

export const ingilizce: Ders = {
  kod: 'ingilizce',
  ad: 'İngilizce',
  kademeler: ['ilkokul', 'ortaokul', 'lise'],
  renk: '#60a5fa',
  ikon: 'A',
  ozet: 'Dinleme, konuşma, okuma ve yazma becerileri; CEFR uyumlu kazanımlar.',
  siniflar: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((s) =>
    S(s, [
      U('Communication', [['Everyday Language Functions', ['Günlük iletişim kalıplarını uygun bağlamda kullanır.']]]),
      U('Vocabulary & Grammar', [['Structures in Context', ['Seviyeye uygun yapıları anlamlı bağlamda kullanır.']]]),
      U('Reading & Writing', [['Texts and Production', ['Seviyeye uygun metinleri anlar ve üretir.']]]),
    ]),
  ),
}
