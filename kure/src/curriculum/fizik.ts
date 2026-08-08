import { S, U, type Ders } from '../lib/types'

/** Fizik — 9-12. sınıf. */
export const fizik: Ders = {
  kod: 'fizik',
  ad: 'Fizik',
  kademeler: ['lise'],
  renk: '#8b7dff',
  ikon: '⚛',
  ozet:
    'Her yasa bir deney düzeneğiyle: eğik atış, sarkaç, eğik düzlem, elektrik ' +
    'alan ve optik üç boyutlu olarak kurulup gözlemlenir.',
  siniflar: [
    S(9, [
      U('Fizik Bilimi ve Kariyer Keşfi', [
        ['Fiziğin Alt Dalları ve Meslekler', ['Fiziğin alt dallarını ve çalışma alanlarını açıklar.', 'Fizik temelli meslekleri araştırır.']],
        ['Fiziksel Nicelikler ve Birimler', ['Temel ve türetilmiş nicelikleri ayırt eder.', 'Skaler ve vektörel nicelikleri sınıflandırır.'], 'egik-atis'],
        ['Ölçme ve Belirsizlik', ['Ölçüm sonuçlarını anlamlı rakamlarla ifade eder.']],
      ], 20),
      U('Kuvvet ve Hareket', [
        ['Hareket Nicelikleri', ['Konum, yer değiştirme, sürat ve hızı ayırt eder.', 'Hareket grafiklerini çizer ve yorumlar.'], 'egik-atis'],
        ['Newton\'ın Hareket Yasaları', ['Eylemsizlik, F = m·a ve etki-tepki yasalarını deneyle doğrular.', 'Serbest cisim diyagramı çizer.'], 'egik-duzlem'],
        ['Sürtünme Kuvveti', ['Statik ve kinetik sürtünme kuvvetini hesaplar.'], 'egik-duzlem'],
      ], 34),
      U('Akışkanlar', [
        ['Basınç ve Kaldırma Kuvveti', ['Katı, sıvı ve gaz basıncını hesaplar.', 'Arşimet ilkesini deneyle doğrular, yüzme koşullarını açıklar.']],
        ['Pascal ve Bernoulli İlkeleri', ['Pascal ilkesini hidrolik sistemlere uygular.', 'Akış hızı ile basınç ilişkisini yorumlar.']],
      ], 22),
      U('Enerji', [
        ['İş, Güç ve Enerji', ['İş ve gücü hesaplar, birimlerini kullanır.']],
        ['Mekanik Enerjinin Korunumu', ['Kinetik ve potansiyel enerji dönüşümünü sarkaçta gösterir.', 'Sürtünmeli ortamda enerji kaybını yorumlar.'], 'sarkac'],
        ['Verim ve Enerji Kaynakları', ['Enerji dönüşüm verimini hesaplar.']],
      ], 26),
    ]),
    S(10, [
      U('Elektrik ve Manyetizma', [
        ['Elektrik Akımı ve Devreler', ['Ohm yasasını kullanarak devre çözer.', 'Seri-paralel bağlı dirençlerde eşdeğer direnci hesaplar.']],
        ['Elektriksel Enerji ve Güç', ['Elektriksel gücü ve tüketilen enerjiyi hesaplar.']],
        ['Mıknatıslar ve Manyetik Alan', ['Akımın manyetik etkisini deneyle gösterir.', 'Manyetik alan çizgilerini çizer.'], 'elektrik-alan'],
      ], 32),
      U('Basınç ve Kaldırma Kuvveti', [['Akışkanlarda Uygulamalar', ['Açık hava basıncını ve barometreyi açıklar.', 'Kaldırma kuvvetiyle ilgili problem çözer.']]], 16),
      U('Dalgalar', [
        ['Dalga Türleri ve Özellikleri', ['Dalga boyu, frekans ve hız arasındaki bağıntıyı kurar.']],
        ['Yay, Su, Ses ve Deprem Dalgaları', ['Yansıma, kırılma ve girişimi gözlemler.']],
      ], 24),
      U('Optik', [
        ['Işığın Yansıması ve Aynalar', ['Düzlem, çukur ve tümsek aynalarda görüntüyü ışın çizimiyle bulur.'], 'mercek'],
        ['Işığın Kırılması ve Mercekler', ['Snell yasasını uygular.', 'İnce kenarlı ve kalın kenarlı merceklerde görüntü özelliklerini belirler.'], 'mercek'],
        ['Prizmalar ve Renk', ['Beyaz ışığın bileşenlerine ayrılmasını açıklar.']],
      ], 28),
    ]),
    S(11, [
      U('Kuvvet ve Hareket', [
        ['Vektörler', ['Vektörleri bileşenlerine ayırır, toplar.'], 'egik-atis'],
        ['Bağıl Hareket ve Nehir Problemleri', ['Bağıl hız vektörünü belirler.']],
        ['Newton Yasaları ve Sürtünme', ['Eğik düzlemde hareketi serbest cisim diyagramıyla çözer.'], 'egik-duzlem'],
        ['İki Boyutta Hareket — Atışlar', ['Yatay ve eğik atışta hareketi bağımsız bileşenlere ayırır.', 'Menzil, maksimum yükseklik ve uçuş süresini türetir.'], 'egik-atis'],
        ['Enerji ve Hareket', ['İş-enerji teoremini uygular.']],
        ['İtme ve Momentum', ['Momentumun korunumunu çarpışmalarda uygular.']],
        ['Tork ve Denge', ['Torku hesaplar, dengeyi kütle merkezi ile açıklar.'], 'egik-duzlem'],
      ], 46),
      U('Elektrik ve Manyetizma', [
        ['Elektriksel Kuvvet ve Alan', ['Coulomb yasasını uygular.', 'Elektrik alan çizgilerini ve alan şiddetini belirler.'], 'elektrik-alan'],
        ['Elektriksel Potansiyel ve Sığa', ['Potansiyel farkı ve kondansatörün sığasını hesaplar.'], 'elektrik-alan'],
        ['Manyetizma ve İndüksiyon', ['Manyetik kuvveti ve Lenz yasasını uygular.']],
      ], 34),
      U('Dalgalar ve Optik', [['Girişim ve Kırınım', ['Çift yarıkta girişim desenini açıklar.', 'Kırınımı dalga modeliyle yorumlar.']]], 18),
      U('Madde ve Özellikleri', [['Yarı İletkenler ve Süper İletkenler', ['Yarı iletkenlerin kullanım alanlarını açıklar.']]], 12),
    ]),
    S(12, [
      U('Çembersel ve Basit Harmonik Hareket', [
        ['Düzgün Çembersel Hareket', ['Merkezcil ivme ve kuvveti hesaplar.', 'Açısal hız ile çizgisel hız ilişkisini kurar.'], 'sarkac'],
        ['Basit Harmonik Hareket', ['Yay sarkacı ve basit sarkacın periyodunu türetir.', 'BHH ile çembersel hareket arasındaki izdüşüm ilişkisini gösterir.'], 'sarkac'],
        ['Kütle Çekim ve Kepler Yasaları', ['Newton\'ın genel çekim yasasını uygular.', 'Kepler yasalarını yörünge modeliyle açıklar.'], 'gunes-sistemi'],
      ], 36),
      U('Dalga Mekaniği', [['Girişim, Kırınım ve Doppler', ['Doppler olayını hesaplamalarla açıklar.', 'Elektromanyetik dalga spektrumunu sıralar.']]], 20),
      U('Modern Fizik', [
        ['Özel Görelilik', ['Zaman genleşmesi ve boy kısalmasını yorumlar.']],
        ['Kuantum Fiziğine Giriş', ['Fotoelektrik olayı foton modeliyle açıklar.', 'Compton ve de Broglie ilişkilerini kullanır.'], 'atom-modeli'],
        ['Atom Modelleri ve Çekirdek', ['Atom modellerinin gelişimini karşılaştırır.', 'Radyoaktif bozunma ve yarılanma süresini hesaplar.'], 'atom-modeli'],
      ], 40),
      U('Modern Fiziğin Teknolojideki Uygulamaları', [['Görüntüleme ve Nanoteknoloji', ['MR, PET, LASER ve nanoteknoloji uygulamalarını açıklar.']]], 16),
    ]),
  ],
}
