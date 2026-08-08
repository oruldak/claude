import { S, U, type Ders } from '../lib/types'

/** Kimya — 9-12. sınıf. */
export const kimya: Ders = {
  kod: 'kimya',
  ad: 'Kimya',
  kademeler: ['lise'],
  renk: '#ffb454',
  ikon: '⚗',
  ozet:
    'Atomun içinden molekül geometrisine: taneciklerin nasıl dizildiğini ve ' +
    'tepkimelerin neden gerçekleştiğini üç boyutta gör.',
  siniflar: [
    S(9, [
      U('Kimya Bilimi', [['Kimyanın Alanları ve Sembolik Dili', ['Kimyanın alt dallarını ve meslekleri tanır.', 'Element sembollerini ve laboratuvar güvenlik kurallarını kullanır.']]], 12),
      U('Atom ve Periyodik Sistem', [
        ['Atom Modellerinin Gelişimi', ['Dalton\'dan modern atom teorisine gelişimi karşılaştırır.', 'Atomun temel parçacıklarını ve izotopları açıklar.'], 'atom-modeli'],
        ['Periyodik Sistem', ['Elementleri elektron dizilimine göre periyodik sistemde yerleştirir.', 'Periyodik özelliklerin (yarıçap, iyonlaşma enerjisi) değişimini yorumlar.'], 'periyodik-sistem'],
      ], 26),
      U('Kimyasal Türler Arası Etkileşimler', [
        ['Güçlü Etkileşimler', ['İyonik, kovalent ve metalik bağı oluşum mekanizmasıyla açıklar.'], 'molekul-geometri'],
        ['Zayıf Etkileşimler', ['van der Waals ve hidrojen bağını moleküller arası etkileşimle ilişkilendirir.'], 'molekul-geometri'],
        ['Bileşik Adlandırma', ['İyonik ve kovalent bileşikleri adlandırır.']],
      ], 24),
      U('Maddenin Hâlleri', [['Katı, Sıvı, Gaz ve Plazma', ['Hâl değişimlerini tanecik hareketiyle açıklar.', 'Gazların özelliklerini kinetik teoriyle yorumlar.']]], 18),
      U('Doğa ve Kimya', [['Su, Hava ve Toprak Kimyası', ['Çevre kirliliğinin kimyasal nedenlerini açıklar.']]], 12),
    ]),
    S(10, [
      U('Kimyanın Temel Kanunları', [
        ['Kütlenin Korunumu ve Sabit Oranlar', ['Temel kanunları deney verileriyle doğrular.']],
        ['Mol Kavramı', ['Mol, kütle ve tanecik sayısı arasında dönüşüm yapar.']],
        ['Kimyasal Tepkime Denklemleri', ['Denklemleri denkleştirir, sınırlayıcı bileşeni belirler.']],
      ], 28),
      U('Karışımlar', [['Homojen ve Heterojen Karışımlar', ['Derişim birimlerini hesaplar.', 'Karışımları ayırma yöntemlerini seçer ve gerekçelendirir.']]], 22),
      U('Asit, Baz ve Tuzlar', [['Asit-Baz Tanımları ve pH', ['Arrhenius, Brønsted-Lowry tanımlarını karşılaştırır.', 'pH hesaplar, nötrleşme tepkimelerini yazar.']]], 20),
      U('Kimya Her Yerde', [['Temizlik Maddeleri ve Polimerler', ['Sabun ve deterjanın temizleme mekanizmasını açıklar.', 'Polimerlerin yapısını ve kullanım alanlarını ilişkilendirir.'], 'molekul-geometri']], 18),
    ]),
    S(11, [
      U('Modern Atom Teorisi', [
        ['Atomun Kuantum Modeli', ['Kuantum sayılarını ve orbital kavramını açıklar.', 'Elektron dizilimini Aufbau, Pauli ve Hund kurallarıyla yazar.'], 'atom-modeli'],
        ['Periyodik Özellikler', ['Periyodik eğilimleri çekirdek yükü ve perdeleme ile açıklar.'], 'periyodik-sistem'],
        ['Kimyasal Bağlar ve Molekül Geometrisi', ['VSEPR kuramıyla molekül geometrisini belirler.', 'Bağ açısı, polarlık ve hibritleşmeyi ilişkilendirir.'], 'molekul-geometri'],
      ], 34),
      U('Gazlar', [['Gaz Yasaları', ['Boyle, Charles ve Gay-Lussac yasalarını türetir.', 'İdeal gaz denklemini ve kısmi basınçları kullanır.']]], 20),
      U('Sıvı Çözeltiler ve Çözünürlük', [['Çözünürlük ve Koligatif Özellikler', ['Çözünürlüğü etkileyen faktörleri açıklar.', 'Kaynama noktası yükselmesi ve donma noktası alçalmasını hesaplar.']]], 18),
      U('Kimyasal Tepkimelerde Enerji', [['Tepkime Entalpisi', ['Endotermik-ekzotermik tepkimeleri enerji diyagramıyla gösterir.', 'Hess yasasıyla entalpi hesaplar.']]], 20),
      U('Tepkime Hızları ve Denge', [
        ['Tepkime Hızı', ['Hızı etkileyen faktörleri çarpışma teorisiyle açıklar.']],
        ['Kimyasal Denge', ['Denge sabitini hesaplar, Le Chatelier ilkesini uygular.']],
      ], 24),
    ]),
    S(12, [
      U('Kimya ve Elektrik', [['Redoks ve Elektrokimya', ['Yükseltgenme basamaklarını belirler, redoks denklemlerini denkleştirir.', 'Galvanik ve elektrolitik hücreleri karşılaştırır, standart elektrot potansiyeliyle hesap yapar.']]], 26),
      U('Karbon Kimyasına Giriş', [['Karbonun Özellikleri ve Hibritleşme', ['Karbonun sp, sp², sp³ hibritleşmesini geometriyle ilişkilendirir.'], 'molekul-geometri']], 18),
      U('Organik Bileşikler', [
        ['Hidrokarbonlar', ['Alkan, alken, alkin ve aromatikleri adlandırır.', 'İzomeri türlerini modelle gösterir.'], 'molekul-geometri'],
        ['Fonksiyonel Gruplar', ['Alkol, eter, aldehit, keton, karboksilik asit ve esterleri tanır, tepkimelerini yazar.']],
      ], 34),
      U('Enerji Kaynakları ve Bilimsel Gelişmeler', [['Fosil Yakıtlar ve Yenilenebilir Enerji', ['Enerji kaynaklarının kimyasal temellerini ve çevresel etkilerini tartışır.']]], 16),
    ]),
  ],
}
