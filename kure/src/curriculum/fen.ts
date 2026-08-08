import { S, U, type Ders } from '../lib/types'

/** Fen Bilimleri — 3. sınıftan 8. sınıfa (ilkokul + ortaokul). */
export const fenBilimleri: Ders = {
  kod: 'fen',
  ad: 'Fen Bilimleri',
  kademeler: ['ilkokul', 'ortaokul'],
  renk: '#7dd3fc',
  ikon: '🔬',
  ozet:
    'Gezegenlerden hücreye, kuvvetten elektriğe; her ünite üç boyutlu deney ' +
    'düzenekleri ve gözlemlenebilir modellerle.',
  siniflar: [
    S(3, [
      U('Gezegenimizi Tanıyalım', [['Dünya\'nın Şekli ve Yapısı', ['Dünya\'nın şeklinin küreye benzediğini model üzerinde gösterir.', 'Karalar ve suların dağılımını açıklar.'], 'gunes-sistemi']], 12),
      U('Beş Duyumuz', [['Duyu Organları', ['Duyu organlarının görevlerini açıklar.', 'Duyu organlarının sağlığını korumak için yapılması gerekenleri söyler.']]], 12),
      U('Kuvveti Tanıyalım', [['Varlıkların Hareket Özellikleri', ['Hareket türlerini (dönme, sallanma, öteleme, titreşim) örneklerle gösterir.', 'İtme ve çekmenin cisimler üzerindeki etkisini gözlemler.']]], 14),
      U('Maddeyi Tanıyalım', [['Maddeyi Niteleyen Özellikler', ['Maddenin hâllerini tanır.', 'Maddelerin ölçülebilir özelliklerini karşılaştırır.']]], 16),
      U('Çevremizdeki Işık ve Sesler', [['Işığın ve Sesin Yayılması', ['Işığın ve sesin her yöne yayıldığını deneyle gösterir.', 'Işık ve ses kirliliğini açıklar.']]], 14),
      U('Canlılar Dünyasına Yolculuk', [['Canlıları Tanıyalım', ['Canlıları ve cansızları ayırt eder.', 'İnsan, hayvan, bitki ve mikroskobik canlıları sınıflandırır.']]], 16),
      U('Elektrikli Araçlar', [['Elektriğin Günlük Yaşamdaki Yeri', ['Elektrikle çalışan araçları tanır.', 'Elektriği güvenli kullanma kurallarını uygular.']]], 10),
    ]),
    S(4, [
      U('Yer Kabuğu ve Dünya\'mızın Hareketleri', [
        ['Yer Kabuğunun Yapısı', ['Kayaç, mineral ve fosilleri tanır.']],
        ['Dünya\'mızın Hareketleri', ['Dünya\'nın kendi ekseni ve Güneş etrafındaki hareketini modeller.', 'Gece-gündüz ve mevsimlerin oluşumunu açıklar.'], 'mevsimler'],
      ], 16),
      U('Besinlerimiz', [['Besin İçerikleri ve Sağlıklı Beslenme', ['Besin içeriklerini ve görevlerini açıklar.', 'Sağlıklı beslenme menüsü hazırlar.']]], 14),
      U('Kuvvetin Etkileri', [['Kuvvetin Cisimler Üzerindeki Etkisi', ['Kuvvetin hareketi ve şekli değiştirebildiğini deneyle gösterir.', 'Mıknatısın çekme kuvvetini araştırır.']]], 12),
      U('Maddenin Özellikleri', [['Maddeyi Tanıyalım ve Hâl Değişimi', ['Maddenin ölçülebilir özelliklerini ölçer.', 'Isının maddeler üzerindeki etkisini ve hâl değişimini gözlemler.']]], 18),
      U('Aydınlatma ve Ses Teknolojileri', [['Işık ve Ses', ['Geçmişten günümüze aydınlatma araçlarını karşılaştırır.', 'Sesin şiddetini ve yayılmasını deneyle inceler.']]], 14),
      U('İnsan ve Çevre', [['Besin Zinciri ve Çevre', ['Besin zincirindeki üretici-tüketici-ayrıştırıcıları belirler.', 'Yerel ve küresel çevre sorunlarına çözüm önerir.']]], 12),
      U('Basit Elektrik Devreleri', [['Elektrik Devresi Elemanları', ['Basit bir elektrik devresi kurar ve şemasını çizer.', 'Devre elemanlarının görevlerini açıklar.']]], 12),
    ]),
    S(5, [
      U('Güneş, Dünya ve Ay', [
        ['Güneş\'in ve Ay\'ın Yapısı', ['Güneş ve Ay\'ın yapısal özelliklerini karşılaştırır.']],
        ['Ay\'ın Hareketleri ve Evreleri', ['Ay\'ın evrelerini Güneş-Dünya-Ay konumlarıyla modelleyerek açıklar.'], 'gunes-sistemi'],
      ], 12),
      U('Canlılar Dünyası', [
        ['Canlıların Sınıflandırılması', ['Canlıları benzerlik ve farklılıklarına göre sınıflandırır.']],
        ['Mikroskobik Canlılar ve Mantarlar', ['Mikroskobik canlıların yararlı ve zararlı etkilerini açıklar.'], 'hucre'],
        ['İnsan ve Çevre İlişkisi', ['Biyoçeşitliliğin önemini ve yok olma nedenlerini tartışır.']],
      ], 18),
      U('Kuvvetin Ölçülmesi ve Sürtünme', [
        ['Kuvvetin Ölçülmesi', ['Kuvveti dinamometre ile ölçer, birimini belirtir.']],
        ['Kütle ve Ağırlık İlişkisi', ['Kütle ile ağırlık arasındaki farkı örneklerle açıklar.'], 'egik-duzlem'],
        ['Sürtünme Kuvveti', ['Sürtünme kuvvetinin bağlı olduğu değişkenleri deneyle belirler.'], 'egik-duzlem'],
      ], 16),
      U('Madde ve Değişim', [
        ['Maddenin Tanecikli Yapısı', ['Katı, sıvı ve gazın tanecik dizilimini modelle gösterir.']],
        ['Isı ve Sıcaklık', ['Isı ile sıcaklık arasındaki farkı açıklar.', 'Isı alışverişini ve ısıl dengeyi yorumlar.']],
        ['Hâl Değişimi', ['Erime, donma, buharlaşma ve yoğuşmayı tanecik modeliyle açıklar.']],
      ], 20),
      U('Işığın Yayılması', [
        ['Işığın Yayılması ve Madde ile Etkileşimi', ['Işığın doğrusal yayıldığını gösterir.', 'Saydam, yarı saydam ve opak maddeleri ayırt eder.'], 'mercek'],
        ['Tam Gölge', ['Tam gölgenin oluşumunu ve boyutunu etkileyen değişkenleri belirler.'], 'mercek'],
      ], 14),
      U('İnsan ve Çevre / Elektrik', [
        ['Destek ve Hareket Sistemi', ['Kemik çeşitlerini ve iskeletin görevlerini açıklar.', 'Kas-kemik-eklem birlikteliğini modelle gösterir.'], 'iskelet'],
        ['Elektrik Devre Elemanları', ['Devre elemanlarının sembollerini kullanarak devre şeması çizer.']],
      ], 16),
    ]),
    S(6, [
      U('Güneş Sistemi ve Tutulmalar', [
        ['Güneş Sistemi', ['Güneş sistemindeki gezegenleri özellikleriyle sıralar.'], 'gunes-sistemi'],
        ['Güneş ve Ay Tutulmaları', ['Tutulmaların oluşumunu üç boyutlu modelle açıklar.'], 'gunes-sistemi'],
      ], 12),
      U('Vücudumuzdaki Sistemler', [
        ['Destek ve Hareket Sistemi', ['İskelet ve kas sisteminin sağlığını korumaya yönelik öneriler sunar.'], 'iskelet'],
        ['Sindirim Sistemi', ['Sindirim organlarını ve görevlerini model üzerinde gösterir.']],
        ['Dolaşım Sistemi', ['Kalbin bölümlerini ve kan dolaşımını model üzerinde açıklar.'], 'kalp'],
        ['Solunum ve Boşaltım Sistemi', ['Solunum ve boşaltım organlarının görevlerini açıklar.']],
      ], 24),
      U('Kuvvet ve Hareket', [
        ['Bileşke Kuvvet', ['Aynı ve zıt yönlü kuvvetlerin bileşkesini bulur, dengelenmiş kuvveti yorumlar.'], 'egik-duzlem'],
        ['Sabit Süratli Hareket', ['Sürat-zaman ve konum-zaman grafiklerini çizer ve yorumlar.'], 'egik-atis'],
      ], 14),
      U('Madde ve Isı', [
        ['Maddenin Tanecikli Yapısı ve Yoğunluk', ['Yoğunluğu hesaplar, maddeleri yoğunluklarına göre ayırt eder.']],
        ['Genleşme ve Büzülme', ['Isının maddelerde genleşme-büzülmeye yol açtığını deneyle gösterir.']],
      ], 18),
      U('Ses ve Işık', [
        ['Sesin Yayılması ve Özellikleri', ['Sesin farklı ortamlardaki yayılma hızını karşılaştırır.']],
        ['Işığın Yansıması ve Aynalar', ['Yansıma kanununu çizerek gösterir.', 'Düzlem, çukur ve tümsek aynalarda görüntü oluşumunu inceler.'], 'mercek'],
      ], 18),
      U('Elektriğin İletimi', [['İletken-Yalıtkan ve Direnç', ['İletken ve yalıtkan maddeleri sınıflandırır.', 'Direncin bağlı olduğu değişkenleri deneyle belirler.']]], 12),
    ]),
    S(7, [
      U('Güneş Sistemi ve Ötesi', [
        ['Uzay Araştırmaları', ['Teleskopların ve uzay araştırmalarının gelişimini açıklar.']],
        ['Gök Cisimleri', ['Yıldız, gök adası, kara delik ve nebulaları ayırt eder.'], 'gunes-sistemi'],
      ], 12),
      U('Hücre ve Bölünmeler', [
        ['Hücre ve Organeller', ['Hayvan ve bitki hücresini organelleriyle karşılaştırır.', 'Hücre-doku-organ-sistem-organizma ilişkisini kurar.'], 'hucre'],
        ['Mitoz ve Mayoz', ['Mitozu ve mayozu evreleriyle karşılaştırır.'], 'dna'],
      ], 18),
      U('Kuvvet ve Enerji', [
        ['Kütle ve Ağırlık, Bileşke Kuvvet', ['Kütle ve ağırlığı ayırt eder, kuvvetleri vektörel toplar.'], 'egik-duzlem'],
        ['İş, Enerji ve Enerji Dönüşümleri', ['Kinetik ve potansiyel enerjiyi hesaplar.', 'Enerjinin korunumunu sarkaç örneğiyle açıklar.'], 'sarkac'],
      ], 18),
      U('Saf Madde ve Karışımlar', [
        ['Atomun Yapısı', ['Atomun temel parçacıklarını ve yerlerini modelle gösterir.'], 'atom-modeli'],
        ['Element, Bileşik ve Karışımlar', ['Element ve bileşiği modelle ayırt eder.', 'Homojen ve heterojen karışımları ayırma yöntemlerini seçer.'], 'periyodik-sistem'],
      ], 22),
      U('Işığın Madde ile Etkileşimi', [
        ['Işığın Soğurulması ve Renk', ['Cisimlerin renkli görünmesini soğurulma ile açıklar.']],
        ['Işığın Kırılması ve Mercekler', ['Kırılmayı ışın çizimiyle gösterir.', 'İnce kenarlı ve kalın kenarlı merceklerde görüntüyü çizer.'], 'mercek'],
      ], 18),
      U('Elektrik Devreleri', [['Ampullerin Bağlanma Şekilleri', ['Seri ve paralel bağlı devreleri karşılaştırır.']]], 10),
    ]),
    S(8, [
      U('Mevsimler ve İklim', [
        ['Mevsimlerin Oluşumu', ['Eksen eğikliğinin mevsimlere etkisini üç boyutlu modelle açıklar.'], 'mevsimler'],
        ['İklim ve Hava Hareketleri', ['İklim ile hava olaylarını ayırt eder.']],
      ], 12),
      U('DNA ve Genetik Kod', [
        ['DNA ve Genetik Kod', ['DNA\'nın yapısını model üzerinde gösterir, kendini eşlemesini açıklar.'], 'dna'],
        ['Kalıtım', ['Punnett karesiyle çaprazlama yapar, baskın-çekinik kavramlarını kullanır.'], 'dna'],
        ['Mutasyon, Modifikasyon ve Adaptasyon', ['Mutasyon ile modifikasyonu karşılaştırır.']],
        ['Biyoteknoloji', ['Biyoteknolojik uygulamaların etkilerini tartışır.']],
      ], 20),
      U('Basınç', [['Katı, Sıvı ve Gaz Basıncı', ['Basıncı bağlı olduğu değişkenlerle açıklar.', 'Pascal ilkesini günlük yaşam uygulamalarıyla ilişkilendirir.']]], 12),
      U('Madde ve Endüstri', [
        ['Periyodik Sistem', ['Elementleri periyodik sistemdeki yerine göre sınıflandırır.'], 'periyodik-sistem'],
        ['Fiziksel ve Kimyasal Değişimler', ['Fiziksel ve kimyasal değişimi ayırt eder.']],
        ['Kimyasal Tepkimeler', ['Kütlenin korunumunu denklem üzerinde gösterir.']],
        ['Asitler ve Bazlar', ['Asit ve bazları pH ile sınıflandırır, nötrleşmeyi açıklar.']],
      ], 22),
      U('Basit Makineler', [['Basit Makineler', ['Kaldıraç, makara, eğik düzlem ve çıkrıkta kuvvet kazancını hesaplar.', 'İşten kazanç olmadığını açıklar.'], 'egik-duzlem']], 14),
      U('Enerji Dönüşümleri ve Çevre', [['Besin Zinciri ve Madde Döngüleri', ['Enerji akışını ve madde döngülerini şemayla açıklar.', 'Sürdürülebilir kalkınma için öneri geliştirir.']]], 14),
      U('Elektrik Yükleri ve Enerjisi', [
        ['Elektriklenme', ['Elektriklenme çeşitlerini deneyle gösterir.', 'Elektroskopun çalışmasını yorumlar.'], 'elektrik-alan'],
        ['Elektrik Enerjisinin Dönüşümü', ['Elektrik enerjisinin ısı, ışık ve harekete dönüşümünü açıklar.']],
      ], 14),
    ]),
  ],
}
