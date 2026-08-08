import { S, U, type Ders } from '../lib/types'

/**
 * Biyoloji — 9-12. sınıf.
 * Maarif Modeli tema yapısı: Yaşam & Organizasyon (9), Enerji & Ekoloji (10),
 * Tepki & Homeostazi (11), Üreme & Gen (12).
 */
export const biyoloji: Ders = {
  kod: 'biyoloji',
  ad: 'Biyoloji',
  kademeler: ['lise'],
  renk: '#5eead4',
  ikon: '🧬',
  ozet:
    'Hücrenin içinden dokulara, kalbin odacıklarından sinir iletimine kadar ' +
    'canlılığın her katmanı üç boyutlu ve kesitli modellerle.',
  siniflar: [
    S(9, [
      U('Tema: Yaşam — Canlıların Ortak Özellikleri', [
        ['Canlıların Ortak Özellikleri', ['Canlıları cansızlardan ayıran özellikleri örneklerle açıklar.']],
        ['Canlıların Yapısındaki Moleküller', ['İnorganik (su, mineral, asit-baz) bileşiklerin görevlerini açıklar.', 'Karbonhidrat, lipit, protein, enzim, vitamin ve nükleik asitlerin yapı-görev ilişkisini kurar.'], 'dna'],
      ], 28),
      U('Tema: Organizasyon — Hücre', [
        ['Hücrenin Yapısı ve Organeller', ['Hücre zarı, sitoplazma ve çekirdeğin yapısını açıklar.', 'Organelleri görevleriyle eşleştirir, prokaryot-ökaryot hücreyi karşılaştırır.'], 'hucre'],
        ['Hücre Zarından Madde Geçişi', ['Difüzyon, osmoz, aktif taşıma, endositoz ve ekzositozu karşılaştırır.'], 'hucre'],
        ['Canlıların Sınıflandırılması', ['Sınıflandırma basamaklarını sıralar, âlemleri özellikleriyle karşılaştırır.']],
      ], 40),
      U('Tema: Organizasyon — Canlı Âlemleri ve Çevre', [
        ['Canlı Âlemleri', ['Bakteri, arke, protista, mantar, bitki ve hayvan âlemlerinin özelliklerini açıklar.']],
        ['Güncel Çevre Sorunları', ['Habitat kaybı ve biyoçeşitlilik azalmasının nedenlerini tartışır.']],
      ], 22),
    ]),
    S(10, [
      U('Tema: Üreme — Hücre Bölünmeleri', [
        ['Mitoz ve Eşeysiz Üreme', ['Mitozun evrelerini kromozom davranışıyla açıklar.', 'Eşeysiz üreme çeşitlerini karşılaştırır.'], 'dna'],
        ['Mayoz ve Eşeyli Üreme', ['Mayozda krossing-over ve varyasyon oluşumunu açıklar.', 'Mayoz ile mitozu karşılaştırır.'], 'dna'],
      ], 30),
      U('Tema: Gen — Kalıtım', [
        ['Kalıtımın Temel İlkeleri', ['Mendel ilkelerini çaprazlamalarla uygular.', 'Eş baskınlık, çok alellilik ve kan gruplarını çözümler.'], 'dna'],
        ['Eşeye Bağlı Kalıtım ve Soy Ağacı', ['Eşeye bağlı kalıtım problemlerini çözer.', 'Soy ağacı analizi yapar.']],
      ], 28),
      U('Tema: Ekoloji — Ekosistem', [
        ['Ekosistem Ekolojisi', ['Popülasyon, komünite ve ekosistem ilişkilerini açıklar.', 'Besin ağı ve enerji piramidini yorumlar.']],
        ['Madde Döngüleri', ['Su, karbon, azot ve fosfor döngülerini şemayla açıklar.']],
      ], 26),
    ]),
    S(11, [
      U('Tema: Tepki — Sinir Sistemi', [
        ['Nöron ve Sinirsel İletim', ['Nöronun yapısını ve çeşitlerini açıklar.', 'İmpuls oluşumunu ve sinaps üzerinden iletimi aşamalarıyla anlatır.'], 'noron'],
        ['Merkezî ve Çevresel Sinir Sistemi', ['Beyin, beyincik, omurilik soğanı ve omuriliğin görevlerini açıklar.', 'Refleks yayını çizerek gösterir.'], 'noron'],
        ['Duyu Organları', ['Göz, kulak, burun, dil ve derinin yapı-görev ilişkisini açıklar.'], 'mercek'],
      ], 34),
      U('Tema: Homeostazi — Denetleyici Sistemler', [
        ['Endokrin Sistem', ['Hormonların hedef doku üzerindeki etkisini açıklar.', 'Geri bildirim mekanizmalarını örneklerle yorumlar.']],
        ['Destek ve Hareket Sistemi', ['Kemik ve kas yapısını, kas kasılma mekanizmasını açıklar.'], 'iskelet'],
      ], 26),
      U('Tema: Homeostazi — Sistemler', [
        ['Sindirim Sistemi', ['Mekanik ve kimyasal sindirim basamaklarını enzimleriyle açıklar.']],
        ['Dolaşım ve Bağışıklık Sistemi', ['Kalbin yapısını, büyük-küçük kan dolaşımını ve kalp döngüsünü açıklar.', 'Bağışıklık çeşitlerini karşılaştırır.'], 'kalp'],
        ['Solunum Sistemi', ['Solunum organlarını ve gaz alışverişini açıklar.']],
        ['Üriner Sistem', ['Nefronda süzülme, geri emilim ve salgılamayı açıklar.']],
      ], 34),
    ]),
    S(12, [
      U('Tema: Gen — Genden Proteine', [
        ['Nükleik Asitler ve DNA\'nın Kendini Eşlemesi', ['DNA ve RNA yapısını karşılaştırır.', 'Replikasyonu yarı korunumlu model ile açıklar.'], 'dna'],
        ['Protein Sentezi', ['Transkripsiyon ve translasyon basamaklarını kodon-antikodon ilişkisiyle açıklar.'], 'dna'],
        ['Genetik Mühendisliği ve Biyoteknoloji', ['Gen klonlama, PCR ve CRISPR uygulamalarını tartışır.']],
      ], 34),
      U('Tema: Enerji — Canlılarda Enerji Dönüşümleri', [
        ['Fotosentez', ['Işığa bağımlı ve bağımsız tepkimeleri kloroplast yapısıyla ilişkilendirir.'], 'hucre'],
        ['Kemosentez', ['Kemosentezi fotosentezle karşılaştırır.']],
        ['Hücresel Solunum', ['Glikoliz, Krebs ve ETS basamaklarını mitokondri yapısıyla ilişkilendirir.', 'Oksijenli ve oksijensiz solunumun verimini karşılaştırır.'], 'hucre'],
      ], 40),
      U('Tema: Yaşam — Bitki Biyolojisi ve Komünite', [
        ['Bitkilerin Yapısı ve Taşıma', ['Kök, gövde ve yaprak yapısını açıklar.', 'Su ve mineral taşınmasını terleme-kohezyon kuramıyla açıklar.']],
        ['Bitkilerde Üreme ve Büyüme', ['Çiçekli bitkilerde tozlaşma, döllenme ve tohum oluşumunu açıklar.']],
        ['Komünite ve Popülasyon Ekolojisi', ['Süksesyon ve popülasyon büyüme grafiklerini yorumlar.']],
      ], 30),
    ]),
  ],
}
