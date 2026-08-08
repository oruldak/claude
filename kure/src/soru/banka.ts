/**
 * Adım adım çözümlü soru bankası.
 *
 * Her sorunun bir çözümü vardır: öğrenci yanlış yaptığında cevabı değil,
 * ÇÖZÜMÜN NASIL KURULDUĞUNU görür. Çözüm adımları LaTeX ile yazılabilir ve
 * ilgili 3B ders modülüne bağlanır; böylece "neden böyle" sorusu sahnede
 * yanıtlanır.
 */

export interface CozumAdimi {
  anlat: string
  tex?: string
}

export interface BankaSorusu {
  id: string
  ders: string
  sinif: number
  konu: string
  zorluk: 1 | 2 | 3
  soru: string
  tip: 'secmeli' | 'sayisal'
  secenekler?: string[]
  /** secmeli → doğru şıkkın indeksi; sayisal → sayısal cevap */
  dogru: number
  birim?: string
  /** Sayısal cevaplarda kabul edilen sapma */
  tolerans?: number
  ipucu: string
  cozum: CozumAdimi[]
  modul?: string
}

export const BANKA: BankaSorusu[] = [
  /* ------------------------------ MATEMATİK ------------------------------ */
  {
    id: 'mat-tur-1',
    ders: 'matematik',
    sinif: 12,
    konu: 'Türev',
    zorluk: 1,
    soru: 'f(x) = x³ − 6x² + 9x fonksiyonunun yerel maksimum noktasının apsisi (x değeri) kaçtır?',
    tip: 'sayisal',
    dogru: 1,
    tolerans: 0.01,
    ipucu: 'Önce f′(x) = 0 yapan noktaları bul, sonra f′ işaretinin + → − değiştiği yeri seç.',
    cozum: [
      { anlat: 'Türevi alalım.', tex: "f'(x)=3x^{2}-12x+9" },
      { anlat: 'Kritik noktalar için türevi sıfıra eşitleyelim.', tex: '3x^{2}-12x+9=0 \\Rightarrow x^{2}-4x+3=0' },
      { anlat: 'Çarpanlara ayıralım.', tex: '(x-1)(x-3)=0 \\Rightarrow x=1 \\text{ veya } x=3' },
      {
        anlat: 'İşaret tablosu: f′, x < 1 için pozitif, 1 < x < 3 için negatif, x > 3 için pozitiftir.',
        tex: "f'(0)=9>0,\\quad f'(2)=-3<0,\\quad f'(4)=9>0",
      },
      {
        anlat: 'Fonksiyon x = 1’de artandan azalana geçer → YEREL MAKSİMUM. x = 3’te ise azalandan artana geçer → yerel minimum.',
        tex: 'x=1 \\Rightarrow \\text{yerel maksimum},\\qquad f(1)=4',
      },
    ],
    modul: 'turev',
  },
  {
    id: 'mat-tur-2',
    ders: 'matematik',
    sinif: 12,
    konu: 'Türev',
    zorluk: 2,
    soru: 'Çevresi 20 m olan dikdörtgen bir bahçenin alanı en fazla kaç m² olabilir?',
    tip: 'sayisal',
    dogru: 25,
    tolerans: 0.01,
    birim: 'm²',
    ipucu: 'Bir kenara x dersen diğer kenar (10 − x) olur. Alanı x cinsinden yazıp türevini al.',
    cozum: [
      { anlat: 'Kenarlara x ve y diyelim. Çevre koşulu:', tex: '2x+2y=20 \\Rightarrow y=10-x' },
      { anlat: 'Alanı tek değişkenle yazalım.', tex: 'A(x)=x(10-x)=10x-x^{2}' },
      { anlat: 'Maksimum için türevi sıfırlayalım.', tex: "A'(x)=10-2x=0 \\Rightarrow x=5" },
      { anlat: 'İkinci türev negatif olduğundan bu bir maksimumdur.', tex: "A''(x)=-2<0" },
      { anlat: 'Alanı hesaplayalım: kare olduğunda maksimum çıkıyor.', tex: 'A(5)=5\\cdot 5=25\\ \\text{m}^{2}' },
    ],
    modul: 'turev',
  },
  {
    id: 'mat-int-1',
    ders: 'matematik',
    sinif: 12,
    konu: 'İntegral',
    zorluk: 1,
    soru: '∫₁³ (2x + 1) dx integralinin değeri kaçtır?',
    tip: 'sayisal',
    dogru: 10,
    tolerans: 0.01,
    ipucu: 'İlkel fonksiyonu bul, sonra F(3) − F(1) yaz.',
    cozum: [
      { anlat: 'İlkel fonksiyonu bulalım.', tex: 'F(x)=x^{2}+x' },
      { anlat: 'Analizin temel teoremini uygulayalım.', tex: '\\int_1^3 (2x+1)\\,dx=F(3)-F(1)' },
      { anlat: 'Değerleri yerine koyalım.', tex: '=(9+3)-(1+1)=12-2=10' },
      {
        anlat: 'Kontrol: bu integral, y = 2x+1 doğrusu altındaki yamuğun alanıdır. Alt taban 3, üst taban 7, yükseklik 2 → (3+7)/2 · 2 = 10. Aynı sonuç.',
      },
    ],
    modul: 'integral',
  },
  {
    id: 'mat-int-2',
    ders: 'matematik',
    sinif: 12,
    konu: 'İntegralin uygulamaları',
    zorluk: 3,
    soru: 'y = √x eğrisinin 0 ≤ x ≤ 4 aralığındaki parçası x ekseni etrafında döndürülürse oluşan cismin hacmi kaç π birim küptür?',
    tip: 'sayisal',
    dogru: 8,
    tolerans: 0.01,
    ipucu: 'Disk yöntemi: V = π∫f(x)² dx. Kareyi alınca kök gider.',
    cozum: [
      { anlat: 'Disk yöntemi formülünü yazalım.', tex: 'V=\\pi\\int_a^b [f(x)]^{2}\\,dx' },
      { anlat: 'f(x) = √x olduğundan karesi sadece x’tir.', tex: '[f(x)]^{2}=(\\sqrt{x})^{2}=x' },
      { anlat: 'İntegrali kuralım ve hesaplayalım.', tex: 'V=\\pi\\int_0^4 x\\,dx=\\pi\\left[\\frac{x^{2}}{2}\\right]_0^4' },
      { anlat: 'Sonuç:', tex: 'V=\\pi\\cdot\\frac{16}{2}=8\\pi' },
    ],
    modul: 'donel-cisim',
  },
  {
    id: 'mat-tri-1',
    ders: 'matematik',
    sinif: 11,
    konu: 'Trigonometri',
    zorluk: 2,
    soru: 'y = 3·sin(2x) fonksiyonunun periyodu aşağıdakilerden hangisidir?',
    tip: 'secmeli',
    secenekler: ['π', '2π', 'π/2', '3π'],
    dogru: 0,
    ipucu: 'y = a·sin(bx) için periyot 2π/b’dir. Genlik periyodu etkilemez.',
    cozum: [
      { anlat: 'Sinüs fonksiyonunun temel periyodu 2π’dir.', tex: '\\sin x \\text{ periyodu } 2\\pi' },
      { anlat: 'İçerideki x katsayısı b, grafiği yatayda b kat sıkıştırır.', tex: '\\sin(bx) \\text{ periyodu } \\frac{2\\pi}{b}' },
      { anlat: 'b = 2 için:', tex: 'T=\\frac{2\\pi}{2}=\\pi' },
      { anlat: 'Baştaki 3 yalnızca genliktir; grafiği dikeyde gerer, periyoda etki etmez.' },
    ],
    modul: 'birim-cember',
  },
  {
    id: 'mat-pis-1',
    ders: 'matematik',
    sinif: 8,
    konu: 'Pisagor bağıntısı',
    zorluk: 1,
    soru: 'Dik kenarları 9 cm ve 12 cm olan dik üçgenin hipotenüsü kaç cm’dir?',
    tip: 'sayisal',
    dogru: 15,
    tolerans: 0.01,
    birim: 'cm',
    ipucu: 'a² + b² = c². 9-12-15 üçgeni, 3-4-5 üçgeninin 3 katıdır.',
    cozum: [
      { anlat: 'Pisagor bağıntısını yazalım.', tex: 'a^{2}+b^{2}=c^{2}' },
      { anlat: 'Değerleri yerine koyalım.', tex: '9^{2}+12^{2}=81+144=225' },
      { anlat: 'Karekökünü alalım.', tex: 'c=\\sqrt{225}=15\\ \\text{cm}' },
      { anlat: 'Not: 3-4-5 üçgeninin her kenarı 3 ile çarpılırsa 9-12-15 elde edilir; bu yüzden sonuç doğrudan görülebilirdi.' },
    ],
    modul: 'pisagor',
  },
  {
    id: 'mat-kes-1',
    ders: 'matematik',
    sinif: 5,
    konu: 'Kesirler',
    zorluk: 1,
    soru: '2/3 + 1/6 işleminin sonucu kaçtır?',
    tip: 'secmeli',
    secenekler: ['3/9', '5/6', '3/6', '1/2'],
    dogru: 1,
    ipucu: 'Paydalar farklıysa doğrudan toplayamayız; önce parçaları aynı büyüklüğe getirmeliyiz.',
    cozum: [
      { anlat: 'Paydalar farklı: 3 ve 6. Ortak payda EKOK(3, 6) = 6’dır.' },
      { anlat: '2/3 kesrini genişletelim (pay ve paydayı 2 ile çarpalım).', tex: '\\frac{2}{3}=\\frac{2\\cdot 2}{3\\cdot 2}=\\frac{4}{6}' },
      { anlat: 'Artık parçalar aynı büyüklükte, sayabiliriz.', tex: '\\frac{4}{6}+\\frac{1}{6}=\\frac{5}{6}' },
      { anlat: 'Sık yapılan hata: paydaları da toplamak (3+6=9). Paydalar toplanmaz; payda parçanın büyüklüğünü söyler.' },
    ],
    modul: 'kesirler',
  },
  {
    id: 'mat-geo-1',
    ders: 'matematik',
    sinif: 8,
    konu: 'Geometrik cisimler',
    zorluk: 2,
    soru: 'Taban yarıçapı 3 cm, yüksekliği 4 cm olan koninin hacmi kaç π cm³’tür?',
    tip: 'sayisal',
    dogru: 12,
    tolerans: 0.01,
    ipucu: 'Koni, aynı tabanlı ve aynı yükseklikteki silindirin üçte biridir.',
    cozum: [
      { anlat: 'Koninin hacim formülü:', tex: 'V=\\frac{1}{3}\\pi r^{2}h' },
      { anlat: 'Değerleri yerleştirelim.', tex: 'V=\\frac{1}{3}\\pi\\cdot 3^{2}\\cdot 4' },
      { anlat: 'Hesaplayalım.', tex: 'V=\\frac{1}{3}\\pi\\cdot 36=12\\pi\\ \\text{cm}^{3}' },
      { anlat: 'Neden 1/3? Çünkü koninin kesitleri tepeye doğru küçülür; kesit alanları toplanınca silindirin tam üçte biri çıkar.' },
    ],
    modul: 'geometrik-cisimler',
  },

  /* -------------------------------- FİZİK -------------------------------- */
  {
    id: 'fiz-atis-1',
    ders: 'fizik',
    sinif: 11,
    konu: 'Eğik atış',
    zorluk: 2,
    soru: 'Bir cisim 20 m/s hızla 30° açıyla atılıyor. (g = 10 m/s²) Uçuş süresi kaç saniyedir?',
    tip: 'sayisal',
    dogru: 2,
    tolerans: 0.02,
    birim: 's',
    ipucu: 'Uçuş süresini yalnızca DÜŞEY hareket belirler. Yukarı çıkış süresinin iki katıdır.',
    cozum: [
      { anlat: 'Hızın düşey bileşenini bulalım.', tex: 'v_{y}=v_0\\sin\\theta=20\\cdot\\sin 30^{\\circ}=20\\cdot 0{,}5=10\\ \\text{m/s}' },
      { anlat: 'Tepe noktasında düşey hız sıfırlanır; oraya varış süresi:', tex: 't_{\\text{çıkış}}=\\frac{v_y}{g}=\\frac{10}{10}=1\\ \\text{s}' },
      { anlat: 'İniş, çıkışın simetriğidir.', tex: 't_{\\text{uçuş}}=2t_{\\text{çıkış}}=2\\ \\text{s}' },
      { anlat: 'Dikkat: yatay hız (20·cos30° ≈ 17,3 m/s) uçuş süresini hiç etkilemez — yatay ve düşey hareket birbirinden bağımsızdır.' },
    ],
    modul: 'egik-atis',
  },
  {
    id: 'fiz-atis-2',
    ders: 'fizik',
    sinif: 11,
    konu: 'Eğik atış',
    zorluk: 3,
    soru: 'Aynı hızla yapılan atışlarda en büyük menzil hangi açıda elde edilir?',
    tip: 'secmeli',
    secenekler: ['30°', '45°', '60°', '90°'],
    dogru: 1,
    ipucu: 'Menzil formülünde sin(2θ) var. Bu ifade ne zaman en büyüktür?',
    cozum: [
      { anlat: 'Menzil bağıntısı:', tex: 'R=\\frac{v_0^{2}\\sin 2\\theta}{g}' },
      { anlat: 'v₀ ve g sabit olduğuna göre R yalnızca sin2θ ile değişir.' },
      { anlat: 'Sinüs en büyük değerini 90°’de alır.', tex: '2\\theta=90^{\\circ}\\Rightarrow \\theta=45^{\\circ}' },
      { anlat: 'Ayrıca 30° ile 60° gibi tümler açı çiftleri aynı menzili verir; çünkü sin60° = sin120°.' },
    ],
    modul: 'egik-atis',
  },
  {
    id: 'fiz-egik-1',
    ders: 'fizik',
    sinif: 11,
    konu: 'Eğik düzlem',
    zorluk: 2,
    soru: 'Sürtünme katsayısı μ = 0,4 olan eğik düzlemde cismin kaymaya başladığı açının tanjantı kaçtır?',
    tip: 'sayisal',
    dogru: 0.4,
    tolerans: 0.001,
    ipucu: 'Kayma şartını yaz ve mg terimlerini sadeleştir.',
    cozum: [
      { anlat: 'Yamaç boyunca cismi aşağı çeken bileşen:', tex: 'F_{\\parallel}=mg\\sin\\alpha' },
      { anlat: 'Yüzeye dik dengeden normal kuvvet:', tex: 'N=mg\\cos\\alpha' },
      { anlat: 'En büyük statik sürtünme:', tex: 'f_{\\max}=\\mu N=\\mu mg\\cos\\alpha' },
      { anlat: 'Kayma şartını yazalım ve mg’yi sadeleştirelim.', tex: 'mg\\sin\\alpha>\\mu mg\\cos\\alpha \\Rightarrow \\tan\\alpha>\\mu' },
      { anlat: 'Demek ki kritik açının tanjantı doğrudan μ’ye eşittir: tanα = 0,4 (α ≈ 21,8°). Kütlenin hiç etkisi yok!' },
    ],
    modul: 'egik-duzlem',
  },
  {
    id: 'fiz-sar-1',
    ders: 'fizik',
    sinif: 12,
    konu: 'Basit sarkaç',
    zorluk: 2,
    soru: 'Basit bir sarkacın ipi 4 katına çıkarılırsa periyodu nasıl değişir?',
    tip: 'secmeli',
    secenekler: ['2 katına çıkar', '4 katına çıkar', 'Yarıya iner', 'Değişmez'],
    dogru: 0,
    ipucu: 'T ile L arasındaki ilişki doğrusal değil, karekökle.',
    cozum: [
      { anlat: 'Basit sarkacın periyodu:', tex: 'T=2\\pi\\sqrt{\\frac{L}{g}}' },
      { anlat: 'Uzunluk 4L olsun.', tex: "T'=2\\pi\\sqrt{\\frac{4L}{g}}=2\\pi\\cdot 2\\sqrt{\\frac{L}{g}}" },
      { anlat: 'Oranlayalım.', tex: "\\frac{T'}{T}=2" },
      { anlat: 'Periyot 2 katına çıkar. Kütle formülde hiç yok — bu yüzden ağır bir top ile hafif bir top aynı ritimde salınır.' },
    ],
    modul: 'sarkac',
  },
  {
    id: 'fiz-mer-1',
    ders: 'fizik',
    sinif: 10,
    konu: 'Mercekler',
    zorluk: 2,
    soru: 'Odak uzaklığı 10 cm olan ince kenarlı mercekten 15 cm uzağa konulan cismin görüntüsü mercekten kaç cm uzakta oluşur?',
    tip: 'sayisal',
    dogru: 30,
    tolerans: 0.05,
    birim: 'cm',
    ipucu: '1/f = 1/d₀ + 1/dᵢ bağıntısında bilinmeyeni yalnız bırak.',
    cozum: [
      { anlat: 'İnce mercek denklemini yazalım.', tex: '\\frac{1}{f}=\\frac{1}{d_o}+\\frac{1}{d_i}' },
      { anlat: 'Bilinenleri yerleştirelim.', tex: '\\frac{1}{10}=\\frac{1}{15}+\\frac{1}{d_i}' },
      { anlat: 'Bilinmeyeni yalnız bırakalım.', tex: '\\frac{1}{d_i}=\\frac{1}{10}-\\frac{1}{15}=\\frac{3-2}{30}=\\frac{1}{30}' },
      { anlat: 'Sonuç pozitif çıktı → görüntü gerçek ve terstir.', tex: 'd_i=30\\ \\text{cm},\\qquad m=-\\frac{d_i}{d_o}=-2' },
    ],
    modul: 'mercek',
  },
  {
    id: 'fiz-ele-1',
    ders: 'fizik',
    sinif: 11,
    konu: 'Elektriksel kuvvet',
    zorluk: 2,
    soru: 'İki nokta yük arasındaki uzaklık 3 katına çıkarılırsa aralarındaki kuvvet kaç kat azalır?',
    tip: 'sayisal',
    dogru: 9,
    tolerans: 0.01,
    ipucu: 'Coulomb kuvveti uzaklığın karesiyle ters orantılıdır.',
    cozum: [
      { anlat: 'Coulomb yasası:', tex: 'F=k\\frac{q_1q_2}{r^{2}}' },
      { anlat: 'Uzaklık 3r olsun.', tex: "F'=k\\frac{q_1q_2}{(3r)^{2}}=k\\frac{q_1q_2}{9r^{2}}" },
      { anlat: 'Oranlayalım.', tex: "\\frac{F'}{F}=\\frac{1}{9}" },
      { anlat: 'Kuvvet 9 kat azalır. "Ters kare yasası" adı buradan gelir: uzaklık 2 katına çıkarsa kuvvet 4 kat, 3 katına çıkarsa 9 kat azalır.' },
    ],
    modul: 'elektrik-alan',
  },

  /* -------------------------------- KİMYA -------------------------------- */
  {
    id: 'kim-atom-1',
    ders: 'kimya',
    sinif: 9,
    konu: 'Atom ve elektron dizilimi',
    zorluk: 1,
    soru: '₁₇Cl atomunun son kabuğundaki (değerlik) elektron sayısı kaçtır?',
    tip: 'sayisal',
    dogru: 7,
    tolerans: 0,
    ipucu: 'Kabuk kapasiteleri sırasıyla 2, 8, 8’dir. 17 elektronu sırayla yerleştir.',
    cozum: [
      { anlat: 'Atom numarası 17 olduğundan nötr atomda 17 elektron vardır.' },
      { anlat: 'Kabukları sırayla dolduralım.', tex: '2 + 8 + 7 = 17' },
      { anlat: 'Son kabukta 7 elektron kalır → değerlik elektron sayısı 7.' },
      { anlat: 'Bu yüzden klor 1 elektron alarak Cl⁻ olur ve 17. grupta (halojenler) yer alır; sodyumla birleşip NaCl oluşturmasının nedeni budur.' },
    ],
    modul: 'atom-modeli',
  },
  {
    id: 'kim-mol-1',
    ders: 'kimya',
    sinif: 11,
    konu: 'Molekül geometrisi',
    zorluk: 2,
    soru: 'H₂O molekülünün geometrisi neden doğrusal değildir?',
    tip: 'secmeli',
    secenekler: [
      'Oksijen çok küçük olduğu için',
      'Oksijendeki 2 ortaklanmamış elektron çifti bağları ittiği için',
      'Hidrojenler birbirini çektiği için',
      'Bağlar apolar olduğu için',
    ],
    dogru: 1,
    ipucu: 'VSEPR: merkez atomdaki TÜM elektron çiftlerini say, sadece bağları değil.',
    cozum: [
      { anlat: 'Oksijenin 6 değerlik elektronu vardır. İkisi H atomlarıyla bağ yapar, kalan 4 elektron 2 ortaklanmamış çift oluşturur.' },
      { anlat: 'Merkez atom çevresinde toplam 4 elektron grubu vardır → elektron geometrisi düzgün dörtyüzlüdür (109,5°).' },
      { anlat: 'Molekül geometrisini yalnızca ATOMLAR belirler; 2 bağ + 2 ortaklanmamış çift → açısal (bükük) geometri.' },
      {
        anlat: 'Ortaklanmamış çiftler tek çekirdeğe bağlı olduğundan daha geniş yer kaplar ve bağları sıkıştırır.',
        tex: '109{,}5^{\\circ} \\rightarrow 104{,}5^{\\circ}',
      },
      { anlat: 'Bu bükük şekil sayesinde bağ dipolleri birbirini götüremez; su POLAR olur. Suyun çözücü gücü, yüksek kaynama noktası ve buzun yüzmesi bu şekilden doğar.' },
    ],
    modul: 'molekul-geometri',
  },
  {
    id: 'kim-per-1',
    ders: 'kimya',
    sinif: 9,
    konu: 'Periyodik sistem',
    zorluk: 2,
    soru: 'Bir periyotta soldan sağa gidildikçe atom yarıçapı neden küçülür?',
    tip: 'secmeli',
    secenekler: [
      'Kabuk sayısı azaldığı için',
      'Çekirdek yükü artarken kabuk sayısı sabit kaldığı için',
      'Elektron sayısı azaldığı için',
      'Atom kütlesi arttığı için',
    ],
    dogru: 1,
    ipucu: 'Aynı periyotta eklenen elektronlar hangi kabuğa giriyor?',
    cozum: [
      { anlat: 'Aynı periyottaki atomların kabuk sayısı aynıdır; eklenen her elektron AYNI kabuğa girer.' },
      { anlat: 'Buna karşılık her adımda çekirdeğe bir proton daha eklenir, yani çekim artar.' },
      { anlat: 'Aynı kabuktaki elektronlar birbirini iyi perdelemez.', tex: 'Z_{\\text{etkin}}=Z-S \\uparrow' },
      { anlat: 'Artan çekim elektron bulutunu içeri çeker → yarıçap küçülür. Aynı nedenle iyonlaşma enerjisi ve elektronegatiflik artar.' },
    ],
    modul: 'periyodik-sistem',
  },

  /* ------------------------------- BİYOLOJİ ------------------------------ */
  {
    id: 'biy-kalp-1',
    ders: 'biyoloji',
    sinif: 11,
    konu: 'Dolaşım sistemi',
    zorluk: 2,
    soru: 'Akciğer atardamarında kirli kan bulunması "atardamarda temiz kan olur" kuralıyla nasıl bağdaşır?',
    tip: 'secmeli',
    secenekler: [
      'Bağdaşmaz, bu bir istisnadır çünkü atardamar tanımı kanın temizliğiyle değil YÖNÜYLE ilgilidir',
      'Akciğer atardamarında aslında temiz kan vardır',
      'Akciğer atardamarı bir toplardamardır',
      'Kan akciğerde temizlendiği için fark etmez',
    ],
    dogru: 0,
    ipucu: 'Atardamarın tanımını hatırla: kanı nereye taşır?',
    cozum: [
      { anlat: 'ATARDAMAR, kanı kalpten UZAKLAŞTIRAN damardır. TOPLARDAMAR ise kanı kalbe getirir. Tanım yönle ilgilidir, kanın temizliğiyle değil.' },
      { anlat: 'Sağ karıncık, oksijeni azalmış kanı akciğerlere pompalar. Kan kalpten uzaklaştığı için bu damar atardamardır.' },
      { anlat: 'Akciğerde gaz alışverişi olur; temizlenen kan akciğer TOPLARDAMARIYLA sol kulakçığa döner — kalbe geldiği için toplardamardır, üstelik içi temiz kandır.' },
      { anlat: 'Yani iki "istisna" aslında istisna değildir: tanımı doğru uygularsak kural hiç bozulmaz.' },
    ],
    modul: 'kalp',
  },
  {
    id: 'biy-dna-1',
    ders: 'biyoloji',
    sinif: 12,
    konu: 'DNA ve protein sentezi',
    zorluk: 2,
    soru: 'Kalıp DNA zinciri 3′-TAC GGA TTA-5′ ise sentezlenen mRNA aşağıdakilerden hangisidir?',
    tip: 'secmeli',
    secenekler: ['5′-AUG CCU AAU-3′', '5′-ATG CCT AAT-3′', '5′-UAC GGA UUA-3′', '5′-AUG GGA UUA-3′'],
    dogru: 0,
    ipucu: 'Tamamlayıcı baz yaz, ama T yerine U kullan.',
    cozum: [
      { anlat: 'Transkripsiyonda mRNA, kalıp zincirin TAMAMLAYICISI olarak yazılır.' },
      { anlat: 'Eşleşme kuralı: A↔U (RNA’da T yoktur), T↔A, G↔C, C↔G.' },
      { anlat: 'Kalıp: T A C  G G A  T T A → mRNA: A U G  C C U  A A U' },
      { anlat: 'İlk kodon AUG çıktı; bu hem metiyonini kodlar hem de protein sentezinin başlangıç işaretidir.' },
      { anlat: 'B şıkkı yanlıştır çünkü RNA’da timin (T) bulunmaz; C şıkkı ise kalıbın kendisini kopyalamıştır.' },
    ],
    modul: 'dna',
  },
  {
    id: 'biy-huc-1',
    ders: 'biyoloji',
    sinif: 9,
    konu: 'Hücrede madde geçişi',
    zorluk: 1,
    soru: 'Bir hücre saf suya konulduğunda ne olur?',
    tip: 'secmeli',
    secenekler: [
      'Su kaybeder ve büzüşür',
      'Osmozla su alır ve şişer',
      'Hiçbir değişiklik olmaz',
      'Aktif taşımayla tuz alır',
    ],
    dogru: 1,
    ipucu: 'Su, çözünen derişiminin AZ olduğu yerden ÇOK olduğu yere geçer.',
    cozum: [
      { anlat: 'Saf suda çözünen madde yoktur; hücre içi ise çözünen bakımından daha yoğundur. Ortam hipotoniktir.' },
      { anlat: 'Osmoz: su, su derişiminin fazla olduğu yerden az olduğu yere geçer → dışarıdan içeri.' },
      { anlat: 'Hayvan hücresinde bu geçiş sürerse hücre patlayabilir (hemoliz).' },
      { anlat: 'Bitki hücresinde ise selüloz çeper direnç gösterir; hücre turgorlu hâle gelir ama patlamaz. Bitkilerin dik durmasının nedeni budur.' },
    ],
    modul: 'hucre',
  },
  {
    id: 'biy-nor-1',
    ders: 'biyoloji',
    sinif: 11,
    konu: 'Sinirsel iletim',
    zorluk: 3,
    soru: 'Miyelinli aksonlarda iletim hızının çok daha yüksek olmasının nedeni nedir?',
    tip: 'secmeli',
    secenekler: [
      'Akson daha kalın olduğu için',
      'İmpuls, Ranvier boğumları arasında sıçradığı için',
      'Daha çok ATP üretildiği için',
      'Sinaps sayısı arttığı için',
    ],
    dogru: 1,
    ipucu: 'Miyelin bir yalıtkandır. Zar potansiyeli nerede değişebilir?',
    cozum: [
      { anlat: 'Miyelin kılıf aksonu yalıtır; kılıfın altında iyon kanalları çalışamaz, dolayısıyla depolarizasyon oluşamaz.' },
      { anlat: 'Depolarizasyon yalnızca kılıfsız noktalarda — Ranvier boğumlarında — gerçekleşir.' },
      { anlat: 'İmpuls boğumdan boğuma atlar; buna saltatorik (sıçrayarak) iletim denir.' },
      { anlat: 'Her noktada yeniden üretilmediği için iletim çok hızlanır: miyelinsiz ≈ 1 m/s iken miyelinli ≈ 100 m/s.' },
      { anlat: 'MS (multipl skleroz) hastalığında bu kılıf hasar görür ve iletim yavaşlar — hastalığın belirtileri buradan anlaşılır.' },
    ],
    modul: 'noron',
  },

  /* ---------------------------- FEN BİLİMLERİ ---------------------------- */
  {
    id: 'fen-mev-1',
    ders: 'fen',
    sinif: 8,
    konu: 'Mevsimler',
    zorluk: 2,
    soru: 'Ocak ayında Dünya Güneş’e en yakın konumdadır. Buna rağmen kuzey yarım kürede kış yaşanmasının nedeni nedir?',
    tip: 'secmeli',
    secenekler: [
      'Kar bulutları Güneş’i engellediği için',
      'Eksen eğikliği nedeniyle ışınların kuzeye çok eğik gelmesi',
      'Güneş kışın daha az enerji yaydığı için',
      'Dünya kışın daha yavaş döndüğü için',
    ],
    dogru: 1,
    ipucu: 'Aynı anda güney yarım kürede yaz yaşanıyor. Uzaklık ikisi için de aynı.',
    cozum: [
      { anlat: 'Dünya–Güneş uzaklığı yıl boyunca yalnızca %3 kadar değişir; bu, mevsim farkı yaratacak büyüklükte değildir.' },
      { anlat: 'Kesin kanıt: aynı anda iki yarım kürede ZIT mevsimler yaşanır. Uzaklık ikisi için de aynı olduğuna göre neden uzaklık olamaz.' },
      { anlat: 'Ocak’ta kuzey yarım küre Güneş’ten uzağa eğiktir; ışınlar yayvan gelir.', tex: 'I=I_0\\sin h' },
      { anlat: 'Aynı enerji daha geniş alana yayılır, gündüz de kısalır → hava soğur. Güneyde tam tersi olur, orada yaz yaşanır.' },
    ],
    modul: 'mevsimler',
  },
  {
    id: 'fen-ay-1',
    ders: 'fen',
    sinif: 6,
    konu: 'Ay’ın evreleri',
    zorluk: 1,
    soru: 'Yeni ay evresinde Ay’ı neden göremeyiz?',
    tip: 'secmeli',
    secenekler: [
      'Dünya’nın gölgesi Ay’ı tamamen kapattığı için',
      'Ay’ın aydınlık yüzü Güneş’e, karanlık yüzü bize dönük olduğu için',
      'Ay o gün ışık yaymadığı için',
      'Ay Dünya’dan çok uzaklaştığı için',
    ],
    dogru: 1,
    ipucu: 'Ay’ın yarısı her zaman aydınlıktır. Soru şu: o aydınlık yarı nereye bakıyor?',
    cozum: [
      { anlat: 'Ay ışık üretmez, Güneş’ten aldığı ışığı yansıtır. Bu yüzden Ay’ın Güneş’e bakan yarısı her zaman aydınlıktır.' },
      { anlat: 'Yeni ayda Ay, Güneş ile Dünya’nın arasındadır.' },
      { anlat: 'Bu konumda aydınlık yarı Güneş’e, karanlık yarı Dünya’ya dönüktür; biz karanlık yüzü gördüğümüz için Ay görünmez.' },
      { anlat: 'Gölge açıklaması yanlıştır — o Ay tutulmasıdır ve yalnızca DOLUNAY evresinde gerçekleşir.' },
    ],
    modul: 'gunes-sistemi',
  },
]

export const soruBul = (id: string) => BANKA.find((s) => s.id === id)

export function bankaFiltre(ders?: string, sinif?: number) {
  return BANKA.filter((s) => (!ders || s.ders === ders) && (!sinif || s.sinif === sinif))
}

/** Öğrencinin cevabını değerlendirir. */
export function dogruMu(soru: BankaSorusu, cevap: string): boolean {
  if (cevap === '' || cevap == null) return false
  if (soru.tip === 'secmeli') return Number(cevap) === soru.dogru
  const sayi = parseFloat(cevap.replace(',', '.'))
  if (!Number.isFinite(sayi)) return false
  return Math.abs(sayi - soru.dogru) <= (soru.tolerans ?? 0.01)
}
