import { S, U, type Ders } from '../lib/types'

/**
 * Matematik — 1. sınıftan 12. sınıfa kadar.
 *
 * 1, 5 ve 9. sınıflar Türkiye Yüzyılı Maarif Modeli'nin tema yapısıyla
 * (Sayılar, Nicelikler ve Değişimler, Geometri, Veri ve Olasılık,
 * Algoritma ve Bilişim), diğer sınıflar yürürlükteki öğrenme alanı
 * yapısıyla düzenlenmiştir.
 */
export const matematik: Ders = {
  kod: 'matematik',
  ad: 'Matematik',
  kademeler: ['ilkokul', 'ortaokul', 'lise'],
  renk: '#38e1c6',
  ikon: '∫',
  ozet:
    'Sayılardan analize kadar tüm matematik; her kavram animasyonlu grafik, ' +
    'geometrik yorum ve ispatıyla birlikte.',
  siniflar: [
    /* ---------------------------- İLKOKUL ---------------------------- */
    S(1, [
      U('Sayılar ve Nicelikler', [
        ['20 İçinde Sayma ve Sayı Kavramı', ['1-20 arasındaki doğal sayıları okur, yazar ve sıralar.', 'Nesne topluluklarının sayısını belirler, ritmik sayar.']],
        ['Toplama İşlemi', ['20 içinde toplama işlemini modeller ve yapar.', 'Toplamada değişme özelliğini örneklerle açıklar.']],
        ['Çıkarma İşlemi', ['20 içinde çıkarma işlemini modeller ve yapar.', 'Toplama ile çıkarma arasındaki ilişkiyi kurar.']],
        ['Onluk ve Birlik', ['İki basamaklı sayıları onluk ve birliklerine ayırır.', 'Basamak değerini nesnelerle gösterir.']],
      ], 40),
      U('Geometri ve Uzamsal Beceriler', [
        ['Geometrik Cisimler ve Şekiller', ['Küp, prizma, silindir, koni ve küreyi modelleri üzerinde tanır.', 'Cisimlerin yüzlerindeki düzlemsel şekilleri eşleştirir.'], 'geometrik-cisimler'],
        ['Uzamsal İlişkiler', ['Nesnelerin konumunu yön ve mesafe belirten ifadelerle anlatır.', 'Basit örüntüleri devam ettirir.']],
      ], 24),
      U('Ölçme', [
        ['Uzunluk Ölçme', ['Standart olmayan birimlerle uzunluk ölçer.', 'Nesneleri uzunluklarına göre sıralar.']],
        ['Paralarımız ve Zaman', ['Madenî ve kâğıt paraları tanır.', 'Saati tam ve yarım olarak okur, takvimi kullanır.']],
      ], 20),
      U('Veri', [['Veri Toplama ve Gösterme', ['Basit bir soruya ilişkin veri toplar.', 'Verileri nesne ve şekil grafikleriyle gösterir, yorumlar.']]], 12),
    ]),
    S(2, [
      U('Sayılar ve İşlemler', [
        ['100 İçinde Doğal Sayılar', ['100 içindeki doğal sayıları okur, yazar, karşılaştırır.', 'İkişer, beşer, onar ritmik sayar.']],
        ['Toplama ve Çıkarma', ['Eldeli toplama ve onluk bozarak çıkarma yapar.', 'Zihinden toplama-çıkarma stratejileri kullanır.']],
        ['Çarpma İşlemine Giriş', ['Çarpmayı tekrarlı toplama olarak modeller.', 'Çarpım tablosunu 5\'e kadar oluşturur.']],
        ['Bölme İşlemine Giriş', ['Bölmeyi paylaştırma ve gruplandırma ile modeller.']],
      ], 46),
      U('Geometri', [
        ['Düzlemsel Şekiller', ['Üçgen, kare, dikdörtgen ve çemberin kenar-köşe sayılarını belirler.'], 'geometrik-cisimler'],
        ['Simetri', ['Bir şeklin simetri doğrusunu belirler, simetriğini çizer.']],
      ], 20),
      U('Ölçme ve Veri', [
        ['Uzunluk, Sıvı ve Zaman Ölçme', ['Metre ve santimetreyi kullanarak ölçüm yapar.', 'Saati beşer dakikalık aralıklarla okur.']],
        ['Şekil Grafiği', ['Verileri şekil grafiğiyle gösterir ve yorumlar.']],
      ], 22),
    ]),
    S(3, [
      U('Sayılar ve İşlemler', [
        ['1000 İçinde Doğal Sayılar', ['Üç basamaklı sayıları okur, yazar, basamak değerlerini belirtir.', 'En yakın onluğa ve yüzlüğe yuvarlar.']],
        ['Çarpma ve Bölme', ['Çarpım tablosunu ezberden değil örüntüyle kurar.', 'Bölme işleminde kalanı yorumlar.']],
        ['Kesirler', ['Bütün, yarım, çeyrek ve basit kesirleri modelle gösterir.', 'Payı paydasından küçük kesirleri karşılaştırır.'], 'kesirler'],
      ], 50),
      U('Geometri ve Ölçme', [
        ['Geometrik Cisimler ve Açınımları', ['Küp ve dikdörtgenler prizmasının yüz, ayrıt ve köşe sayısını belirler.', 'Cisimlerin açınımlarını eşleştirir.'], 'geometrik-cisimler'],
        ['Çevre ve Alan', ['Şekillerin çevre uzunluğunu hesaplar.', 'Alanı birim kareler ile ölçer.']],
      ], 26),
      U('Veri ve Olasılık', [['Çetele ve Sıklık Tablosu', ['Veriyi çetele ve sıklık tablosuyla düzenler.', 'Sütun grafiği oluşturur ve okur.']]], 14),
    ]),
    S(4, [
      U('Sayılar ve İşlemler', [
        ['Milyona Kadar Doğal Sayılar', ['Altı basamağa kadar sayıları okur, yazar ve çözümler.', 'Doğal sayılarla dört işlem problemleri kurar ve çözer.']],
        ['Kesirler ve Kesirlerle İşlemler', ['Denk kesirleri modelle bulur, kesirleri sıralar.', 'Paydaları eşit kesirlerle toplama-çıkarma yapar.'], 'kesirler'],
        ['Ondalık Gösterim', ['Kesirlerin ondalık gösterimini yazar.', 'Ondalık gösterimleri karşılaştırır.']],
      ], 56),
      U('Geometri ve Ölçme', [
        ['Açılar ve Üçgenler', ['Açıyı tanır, açıölçer ile ölçer.', 'Üçgenleri kenar ve açı özelliklerine göre sınıflandırır.']],
        ['Geometrik Cisimler', ['Prizma, piramit, koni, silindir ve küreyi ayırt eder, açınımlarını çizer.'], 'geometrik-cisimler'],
        ['Alan ve Hacim', ['Dikdörtgenin alanını hesaplar.', 'Birim küplerle hacmi ölçer.']],
      ], 34),
      U('Veri ve Olasılık', [['Grafikler ve Olasılık', ['Sütun grafiğini yorumlar, aritmetik ortalamayı bulur.', 'Bir olayın olma olasılığını "kesin, olası, imkânsız" ile niteler.']]], 16),
    ]),

    /* ---------------------------- ORTAOKUL --------------------------- */
    S(5, [
      U('Sayılar (Tema: Sayılarla Düşünme)', [
        ['Doğal Sayılar ve İşlemler', ['Milyonlar bölüğüne kadar sayıları çözümler.', 'İşlem önceliğini kullanarak dört işlem yapar.']],
        ['Kesirler ve İşlemler', ['Birim kesirleri sıralar, denk kesirleri bulur.', 'Kesirlerle toplama ve çıkarma işlemini modelle açıklar.'], 'kesirler'],
        ['Ondalık Gösterim', ['Ondalık gösterimleri çözümler ve sıralar.', 'Ondalık sayılarla toplama-çıkarma yapar, yuvarlar.']],
        ['Yüzdeler', ['Yüzdeyi kesir ve ondalık gösterimle ilişkilendirir.', 'Bir çokluğun belirtilen yüzdesini bulur.']],
      ], 48),
      U('Geometri ve Ölçme', [
        ['Doğru, Doğru Parçası, Açı', ['Doğru, ışın ve doğru parçasını ayırt eder.', 'Açıları ölçer, sınıflandırır; komşu ve tümler açıları bulur.']],
        ['Üçgen ve Dörtgenler', ['Üçgen ve dörtgenleri kenar-açı özelliklerine göre sınıflandırır.', 'Çevre uzunluklarını hesaplar.']],
        ['Alan ve Hacim Ölçme', ['Dikdörtgenin alanını, dikdörtgenler prizmasının hacmini hesaplar.', 'Alan ve hacim birimlerini dönüştürür.'], 'geometrik-cisimler'],
      ], 36),
      U('Veri, Olasılık ve Algoritma', [
        ['Veri Toplama ve Değerlendirme', ['Araştırma sorusu üretir, veriyi sıklık tablosuyla düzenler.', 'Sütun grafiğini yorumlar ve aritmetik ortalamayı hesaplar.']],
        ['Algoritmik Düşünme', ['Bir problemin çözümünü adımlarla ifade eder.', 'Basit akış şemaları oluşturur.']],
      ], 18),
    ]),
    S(6, [
      U('Sayılar ve İşlemler', [
        ['Doğal Sayılarla İşlemler ve Çarpanlar', ['Üslü ifadeleri yazar ve değerini hesaplar.', 'Asal çarpanlara ayırır, EBOB-EKOK bulur.']],
        ['Tam Sayılar', ['Tam sayıları sayı doğrusunda gösterir ve karşılaştırır.', 'Mutlak değeri yorumlar.']],
        ['Kesirlerle İşlemler', ['Kesirlerle çarpma ve bölme işlemini modelle açıklar.', 'Kesirlerle dört işlem problemleri çözer.'], 'kesirler'],
        ['Oran', ['İki çokluğun oranını bulur, birimli-birimsiz oranı ayırt eder.']],
      ], 52),
      U('Cebir', [['Cebirsel İfadeler', ['Sözel durumu cebirsel ifadeyle yazar.', 'Cebirsel ifadenin değerini hesaplar, benzer terimleri toplar.']]], 12),
      U('Geometri ve Ölçme', [
        ['Açılar ve Çokgenler', ['Ters, yöndeş ve iç ters açıları belirler.', 'Üçgenin iç açıları toplamının 180° olduğunu keşfeder.']],
        ['Alan ve Hacim', ['Üçgen ve paralelkenarın alan bağıntısını oluşturur.', 'Dikdörtgenler prizmasının hacmini ve yüzey alanını hesaplar.'], 'geometrik-cisimler'],
        ['Çember', ['Çemberin çevresi ile çapı arasındaki π ilişkisini keşfeder.']],
      ], 34),
      U('Veri ve Olasılık', [['Veri Analizi', ['Veriyi çizgi grafiğiyle gösterir.', 'Açıklık, aritmetik ortalama ve ortancayı hesaplar.']]], 14),
    ]),
    S(7, [
      U('Sayılar ve İşlemler', [
        ['Tam Sayılarla İşlemler', ['Tam sayılarla çarpma ve bölme yapar.', 'Tam sayıların kuvvetlerini hesaplar.']],
        ['Rasyonel Sayılar', ['Rasyonel sayıları farklı gösterimlerle yazar ve sıralar.', 'Rasyonel sayılarla dört işlem yapar.']],
        ['Oran ve Orantı', ['Doğru ve ters orantıyı ayırt eder.', 'Orantı problemlerini çözer, orantı grafiğini yorumlar.']],
        ['Yüzde Problemleri', ['Yüzde artış-azalış hesaplar, kâr-zarar-faiz problemleri çözer.']],
      ], 48),
      U('Cebir', [
        ['Cebirsel İfadelerde Çarpma', ['İki cebirsel ifadeyi çarpar, alan modeliyle gösterir.']],
        ['Eşitlik ve Denklem', ['Birinci dereceden bir bilinmeyenli denklemleri kurar ve çözer.', 'Doğrusal denklemin grafiğini çizer, eğimi yorumlar.'], 'fonksiyon-grafik'],
      ], 22),
      U('Geometri ve Ölçme', [
        ['Doğrular ve Açılar', ['Paralel iki doğrunun bir kesenle yaptığı açıları belirler.']],
        ['Çokgenler ve Dönüşüm Geometrisi', ['Düzgün çokgenlerin açı ölçülerini hesaplar.', 'Öteleme ve yansımayı koordinat düzleminde uygular.']],
        ['Çember ve Daire', ['Çemberin çevresini ve dairenin alanını hesaplar, daire diliminin alanını bulur.']],
        ['Cisimlerin Hacmi', ['Dik prizmaların hacmini ve yüzey alanını hesaplar.'], 'geometrik-cisimler'],
      ], 34),
      U('Veri ve Olasılık', [['Merkezî Eğilim ve Yayılım', ['Ortalama, ortanca ve tepe değeri karşılaştırır.', 'Daire grafiği oluşturur ve yorumlar.']]], 12),
    ]),
    S(8, [
      U('Sayılar ve İşlemler', [
        ['Çarpanlar ve Katlar', ['Pozitif tam sayıları asal çarpanlarına ayırır.', 'EBOB-EKOK problemlerini çözer.']],
        ['Üslü İfadeler', ['Üslü ifadelerin çarpma-bölme kurallarını uygular.', 'Çok büyük ve çok küçük sayıları bilimsel gösterimle yazar.']],
        ['Kareköklü İfadeler', ['Tam kare sayıların kareköklerini bulur.', 'Kareköklü ifadelerle dört işlem yapar, gerçek sayıları tanır.']],
      ], 40),
      U('Cebir', [
        ['Cebirsel İfadeler ve Özdeşlikler', ['Özdeşlikleri (a±b)² ve a²−b² modelle açıklar.', 'Cebirsel ifadeleri çarpanlarına ayırır.']],
        ['Doğrusal Denklemler', ['Doğrunun eğimini bulur, denklemini yazar.', 'Doğrusal denklem sistemlerini grafikle çözer.'], 'fonksiyon-grafik'],
        ['Eşitsizlikler', ['Birinci dereceden bir bilinmeyenli eşitsizlikleri çözer ve sayı doğrusunda gösterir.']],
      ], 30),
      U('Geometri ve Ölçme', [
        ['Üçgenler ve Pisagor Bağıntısı', ['Üçgenin kenar-açı ilişkilerini kullanır.', 'Pisagor bağıntısını alan modeliyle ispatlar ve problemlerde uygular.'], 'pisagor'],
        ['Dönüşüm Geometrisi', ['Öteleme, yansıma ve dönmeyi koordinat düzleminde uygular.']],
        ['Geometrik Cisimler', ['Dik dairesel silindir, koni ve kürenin hacmini hesaplar.', 'Yüzey alanı ile açınım arasındaki ilişkiyi kurar.'], 'geometrik-cisimler'],
      ], 32),
      U('Veri ve Olasılık', [['Basit Olayların Olasılığı', ['Örnek uzayı belirler, eşit olasılıklı olayları ayırt eder.', 'Bir olayın olasılığını hesaplar.']]], 14),
    ]),

    /* ------------------------------ LİSE ----------------------------- */
    S(9, [
      U('Tema: Sayılar', [
        ['Sayı Kümeleri ve Gerçek Sayılar', ['Sayı kümeleri arasındaki kapsama ilişkisini açıklar.', 'Gerçek sayılarda işlem özelliklerini kullanır.']],
        ['Üslü ve Köklü İfadeler', ['Üslü ifade kurallarını genelleştirir.', 'Köklü ifadelerde işlem yapar, paydayı rasyonel yapar.']],
        ['Özdeşlikler ve Çarpanlara Ayırma', ['Tam kare ve iki kare farkı özdeşliklerini geometrik modelle ispatlar.', 'Cebirsel ifadeleri çarpanlarına ayırır.']],
        ['Denklem ve Eşitsizlikler', ['Birinci dereceden denklem ve eşitsizlikleri çözer.', 'Mutlak değerli denklem ve eşitsizlikleri çözümler.']],
      ], 38),
      U('Tema: Nicelikler ve Değişimler', [
        ['Oran, Orantı ve Yüzde', ['Orantısal ilişkileri modeller ve grafikle yorumlar.']],
        ['Doğrusal İlişkiler ve Referans Fonksiyonlar', ['Doğrusal fonksiyonu tablo, grafik ve cebirsel gösterimle ilişkilendirir.', 'Değişim hızını (eğim) yorumlar.'], 'fonksiyon-grafik'],
        ['Fonksiyon Kavramı', ['Fonksiyonu tanım-değer kümesiyle tanımlar.', 'Bire bir, örten ve ters fonksiyonu açıklar.'], 'fonksiyon-grafik'],
      ], 38),
      U('Tema: Geometri', [
        ['Üçgenlerde Eşlik ve Benzerlik', ['Eşlik ve benzerlik ölçütlerini ispatlarla kullanır.', 'Benzerlik oranıyla alan ilişkisini açıklar.']],
        ['Üçgende Açı ve Kenar Bağıntıları', ['Pisagor, Öklid ve kosinüs bağıntılarını uygular.'], 'pisagor'],
        ['Üçgende Yardımcı Elemanlar', ['Kenarortay, açıortay, yükseklik ve orta dikmenin özelliklerini ispatlar.']],
      ], 40),
      U('Tema: Veri, Olasılık ve Bilişim', [
        ['Veri Analizi', ['Merkezî eğilim ve yayılım ölçülerini hesaplar, kutu grafiği çizer.']],
        ['Algoritma ve Bilişim', ['Problemi algoritmik adımlara ayırır, akış şeması ve sözde kod yazar.']],
      ], 24),
    ]),
    S(10, [
      U('Sayma ve Olasılık', [
        ['Sıralama ve Seçme', ['Toplama-çarpma sayma yöntemlerini kullanır.', 'Permütasyon, kombinasyon ve Pascal üçgeni ile problem çözer.']],
        ['Binom Açılımı', ['Binom teoremini kullanarak açılım yapar.']],
        ['Olasılık', ['Koşullu olasılık, bağımlı ve bağımsız olayları ayırt eder.']],
      ], 30),
      U('Fonksiyonlar', [
        ['Fonksiyonlarla İşlemler', ['Fonksiyonların toplamı, farkı, çarpımı ve bileşkesini bulur.', 'Ters fonksiyonun grafiğini y = x doğrusuna göre simetriyle çizer.'], 'fonksiyon-grafik'],
        ['Fonksiyon Grafikleri ve Dönüşümleri', ['Öteleme, yansıma ve ölçekleme dönüşümlerini grafik üzerinde gösterir.'], 'fonksiyon-grafik'],
      ], 24),
      U('Polinomlar', [
        ['Polinom Kavramı ve İşlemler', ['Polinomlarda derece, baş katsayı ve işlemleri belirler.', 'Polinom bölmesi ve kalan teoremini uygular.']],
        ['Çarpanlara Ayırma', ['Polinomları çarpanlarına ayırır, köklerini bulur.']],
      ], 22),
      U('İkinci Dereceden Denklemler', [
        ['Denklemin Kökleri ve Diskriminant', ['Diskriminantla kök durumunu yorumlar.', 'Kökler ile katsayılar arasındaki ilişkiyi kullanır.'], 'fonksiyon-grafik'],
        ['Parabol', ['Parabolün tepe noktasını ve grafiğini belirler.', 'İkinci dereceden fonksiyonun maksimum-minimum problemlerine uygulanmasını yapar.'], 'fonksiyon-grafik'],
      ], 24),
      U('Dörtgenler ve Çokgenler', [
        ['Çokgenler', ['Düzgün çokgenin iç-dış açılarını ve köşegen sayısını hesaplar.']],
        ['Dörtgenler', ['Paralelkenar, eşkenar dörtgen, dikdörtgen, kare ve yamuğun özelliklerini ispatlar.', 'Alan bağıntılarını türetir.']],
      ], 26),
      U('Uzay Geometri', [['Katı Cisimler', ['Dik prizma, piramit, silindir, koni ve kürenin hacim ve yüzey alanı bağıntılarını türetir.', 'Kesitleri ve açınımları inceler.'], 'geometrik-cisimler']], 18),
    ]),
    S(11, [
      U('Trigonometri', [
        ['Yönlü Açılar ve Birim Çember', ['Açıyı radyan ve derece cinsinden ifade eder.', 'Birim çember üzerinde trigonometrik oranların işaretini ve periyodunu açıklar.'], 'birim-cember'],
        ['Trigonometrik Fonksiyonların Grafikleri', ['Sinüs ve kosinüs grafiğinin birim çemberden nasıl doğduğunu gösterir.', 'Genlik, periyot ve öteleme parametrelerini yorumlar.'], 'birim-cember'],
        ['Toplam-Fark ve Yarım Açı Formülleri', ['Toplam-fark formüllerini ispatlar ve uygular.']],
        ['Üçgende Sinüs ve Kosinüs Teoremi', ['Sinüs ve kosinüs teoremini ispatlar, üçgen çözer.']],
      ], 34),
      U('Analitik Geometri', [
        ['Doğrunun Analitik İncelenmesi', ['Doğrunun denklemini eğim ve nokta ile yazar.', 'İki doğru arasındaki açıyı ve nokta-doğru uzaklığını hesaplar.'], 'fonksiyon-grafik'],
        ['Çemberin Analitik İncelenmesi', ['Çemberin denklemini yazar, doğru-çember ilişkisini inceler.']],
      ], 24),
      U('Fonksiyonlarda Uygulamalar', [
        ['Üstel ve Logaritmik Fonksiyonlar', ['Üstel fonksiyonun tersinin logaritma olduğunu grafikle gösterir.', 'Logaritma özelliklerini ispatlar, denklem çözer.'], 'fonksiyon-grafik'],
        ['Diziler', ['Aritmetik ve geometrik dizinin genel terimini ve toplamını bulur.']],
      ], 26),
      U('Katı Cisimler ve Dönüşümler', [
        ['Dönüşümler', ['Öteleme, dönme, yansıma ve homoteti dönüşümlerini analitik olarak ifade eder.']],
        ['Katı Cisimlerin Analitik İncelenmesi', ['Küre, koni ve silindirin kesitlerini ve hacimlerini inceler.'], 'donel-cisim'],
      ], 20),
    ]),
    S(12, [
      U('Üstel ve Logaritmik Denklemler', [['Üstel ve Logaritmik Denklem-Eşitsizlikler', ['Üstel ve logaritmik denklemleri çözer.', 'Modelleme problemlerinde büyüme-azalma bağıntılarını kullanır.'], 'fonksiyon-grafik']], 14),
      U('Diziler ve Limit', [
        ['Diziler', ['Dizinin yakınsaklığını ve limitini yorumlar.']],
        ['Fonksiyonlarda Limit', ['Limiti sağdan ve soldan limitle tanımlar.', 'Süreklilik ile limit arasındaki ilişkiyi grafikle açıklar.'], 'turev'],
      ], 24),
      U('Türev', [
        ['Anlık Değişim Oranı ve Türev', ['Ortalama değişim oranından anlık değişim oranına geçişi limitle kurar.', 'Türevin teğetin eğimi olduğunu geometrik olarak ispatlar.'], 'turev'],
        ['Türev Alma Kuralları', ['Toplam, çarpım, bölüm ve zincir kurallarını uygular.', 'Trigonometrik, üstel ve logaritmik fonksiyonların türevini alır.'], 'turev'],
        ['Türevin Uygulamaları', ['Artan-azalan aralıkları, yerel ekstremumları ve bükeyliği belirler.', 'Maksimum-minimum problemlerini modelleyerek çözer.'], 'turev'],
      ], 40),
      U('İntegral', [
        ['Belirsiz İntegral', ['İntegrali türevin ters işlemi olarak tanımlar.', 'Değişken değiştirme ve kısmi integrasyonu uygular.'], 'integral'],
        ['Belirli İntegral ve Riemann Toplamları', ['Alanı Riemann toplamlarının limiti olarak tanımlar.', 'Analizin temel teoremini ifade eder ve kullanır.'], 'integral'],
        ['İntegralin Uygulamaları', ['İki eğri arasında kalan alanı hesaplar.', 'Dönel cisimlerin hacmini disk ve silindirik kabuk yöntemleriyle bulur.'], 'donel-cisim'],
      ], 44),
      U('Analitik Geometri ve Uzayda Vektörler', [
        ['Uzayda Doğru ve Düzlem', ['Uzayda nokta, doğru ve düzlem denklemlerini yazar.', 'Vektörel çarpımla düzlem normalini belirler.']],
        ['Çember ve Elips', ['Konikleri denklemleriyle tanır ve grafiklerini çizer.']],
      ], 22),
    ]),
  ],
}
