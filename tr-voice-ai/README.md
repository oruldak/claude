# TR Sesli AI Ajan — Vapi / Retell + Türk numarası (+90 / 0850)

Türkiye numarasıyla **giden (outbound)** ve **gelen (inbound)** AI telefon araması yapmak için
çalışır durumda bir başlangıç kiti. Vapi ve Retell için ayrı ayrı, aynı SIP altyapısını kullanan
iki kurulum içerir.

## Önce bilmen gereken tek kritik şey

**Twilio'dan +90'lı numara alamazsın.** Türkiye'de numara tahsisi BTK'ya bağlıdır ve numarayı
sana ancak **STH lisanslı bir Türk operatörü** verebilir. Vapi ve Retell'in panelinden numara
satın alma ekranında Türkiye yoktur — bu bir eksiklik değil, mevzuat sonucudur.

Doğru mimari şudur:

```
Türk operatör (STH)  ──SIP trunk──>  Vapi / Retell  ──>  LLM + STT + TTS
   0850 / 0212 DID                    (BYO SIP)
```

Numara Türk operatöründe kalır, ses trafiği SIP üzerinden Vapi/Retell'e taşınır. Böylece hem
arayan tarafta senin **+90'lı numaran** görünür, hem de gelen aramaları AI karşılar.

### Seçenekler

| Yol | Ne yaparsın | Arayan numara | Ne zaman |
|---|---|---|---|
| **A. TR SIP trunk + BYO** (önerilen) | Verimor, Netgsm, Telesis, Bulutfon, İşNet, Turkcell/TT kurumsal gibi bir operatörden 0850 veya coğrafi (0212/0312) DID + SIP trunk alırsın, Vapi/Retell'e bağlarsın | Kendi +90 numaran | Gerçek kullanım, hem inbound hem outbound |
| **B. Yabancı numarayla TR'yi arama** | Twilio/Telnyx US numarası alıp +90'ı ararsın | Yabancı numara (+1...) | Sadece hızlı deneme. Türk operatörleri yurt dışı çağrıyı "spam/şüpheli" etiketleyebilir, inbound hiç olmaz |
| **C. GSM hattını bağlama (FCT)** | Elindeki cep numarasını operatörün FCT/GSM gateway'ine bağlarsın | Kendi GSM numaran | Numara taşımak istemediğinde |

0850 numaralar bu iş için en pratiği: coğrafi bağı yok, ülke geneline tek numara, SIP ile
doğrudan çalışır ve fiyatı düşüktür.

---

## Kurulum

### 0) Gereksinimler

- Node.js 20+
- Vapi hesabı (private API key) **veya** Retell hesabı (API key)
- Bir TR operatöründen: **DID numara + SIP trunk bilgileri** (host, kullanıcı adı, şifre)
- Dışarı açık bir URL (geliştirme için `ngrok http 3000`)

```bash
cd tr-voice-ai
npm install
cp .env.example .env    # sonra .env içini doldur
```

### 1) Operatörden isteyeceklerin

Operatöre şunu söyle: *"AI sesli asistan için SIP trunk ve bir 0850 DID istiyorum;
giden aramalarda DID'imi caller ID olarak kullanacağım, gelen aramaları kendi SIP
adresime yönlendireceğim."* Sana şunları vermeleri gerekir:

- SIP sunucu adresi (host/IP) ve portu → `SIP_GATEWAY_HOST`, `SIP_GATEWAY_PORT`
- SIP kullanıcı adı / şifre → `SIP_USERNAME`, `SIP_PASSWORD` (IP tabanlı yetkilendirme yerine bunu iste)
- DID numaran → `TR_DID_NUMBER` (E.164: `+908502223344`)
- Gelen çağrı yönlendirme (inbound routing) ekranına erişim
- Codec olarak **G.711 (alaw/ulaw)** açık olsun; ses kalitesi ve gecikme için en iyisi
- Eşzamanlı kanal (concurrent call) sayısı — kaç paralel arama yapabileceğini belirler

### 2) Webhook sunucusunu başlat

```bash
npm run server        # 3000 portu
ngrok http 3000       # çıkan https adresini .env -> PUBLIC_URL
```

### 3a) Vapi kurulumu

```bash
npm run vapi:setup
```

Bu komut sırayla: SIP trunk kimlik bilgisini (`byo-sip-trunk`), Türkçe asistanı ve
DID numarasını (`byo-phone-number`) oluşturur. Çıktıdaki ID'leri `.env` dosyasına yaz.

Son adım **operatör panelinde**: DID'e gelen aramaları şu adrese yönlendir:

```
{aranan_numara}@{VAPI_CREDENTIAL_ID}.sip.vapi.ai
```

(AB bölgesindeysen `...sip.eu.vapi.ai`.)

### 3b) Retell kurulumu

```bash
npm run retell:setup
```

Retell LLM + agent oluşturur ve DID'i elastic SIP trunk üzerinden import eder.
Operatör panelinde gelen aramaların hedefi: **`sip.retellai.com`**.
`RETELL_TERMINATION_URI` ise operatörünün sana verdiği trunk adresidir (giden aramalar için).

### 4) Kendi numaranı arat

```bash
npm run vapi:call                      # .env -> MY_TEST_NUMBER
npm run vapi:call -- +905321234567
npm run retell:call
```

Telefonun çaldığında asistan Türkçe konuşmaya başlar. Gelen aramayı test etmek için
kendi cebinden 0850 numaranı ara.

---

## Türkçe kalitesi için ayarlar

Türkçe'de en sık yapılan hata dili otomatik algılamaya bırakmak. Kitte üç yerde sabitlendi:

- **STT (dinleme):** `transcriber.language = "tr"`. Deepgram `nova-2` iyi çalışır;
  aksan/gürültü sorununda ElevenLabs Scribe veya Azure Speech `tr-TR` alternatiftir.
- **TTS (konuşma):** ElevenLabs `eleven_turbo_v2_5` (çok dilli, düşük gecikme) veya
  Azure `tr-TR-EmelNeural` / `tr-TR-AhmetNeural`. **Tek dilli İngilizce model kullanma**,
  Türkçe kelimeleri İngilizce okur.
- **Prompt:** `src/vapi/assistant.config.js` içindeki sistem promptu Türkçe yazıldı ve
  sayı/saat/telefon okuma kuralları verildi ("14:30" → "on dört otuz"). Bu kurallar
  olmadan model sayıları İngilizce ya da rakam rakam telaffuz ettirir.

Model `LLM_MODEL` ile değiştirilebilir (varsayılan `claude-opus-5`). Panelinde hangi
modellerin açık olduğunu kontrol et; daha düşük gecikme/maliyet istersen `claude-haiku-4-5`
gibi küçük bir modele geçmek konuşma akışını hızlandırır.

Gecikme hedefi: kullanıcı sustuktan sonra ilk sesin çıkması **1 saniyenin altı** olmalı.
Bunun için sunucunu Avrupa'da (Frankfurt/İstanbul) tut ve operatörle Vapi/Retell arasındaki
SIP yolunu kısa tut.

---

## Yasal taraf (Türkiye)

Bunlar teknik değil ama ceza kesilen kısım:

- **İYS (İleti Yönetim Sistemi):** Ticari/pazarlama amaçlı **sesli arama** için alıcının
  İYS'de kayıtlı izni olmalı. İzinsiz aramanın cezası kişi başı on binlerce TL'ye çıkabiliyor.
  Aramadan önce numarayı İYS'den sorgula. Kendi numaranı test etmen bu kapsamda değil.
- **KVKK:** Görüşme kaydı ve transkript kişisel veridir; aydınlatma metni ve saklama süresi gerekir.
- **Kayıt anonsu:** Görüşme kaydediliyorsa açılışta bunu söylet (prompt'a ekle).
- **Yapay zekâ olduğunu belirtme:** Arayanın karşısındakinin insan olmadığını anlaması
  hem doğru hem de şikâyet riskini azaltır — ilk cümleye koymanı öneririm.
- **Talep dışı arama:** Bilgilendirme/hatırlatma aramaları (randevu, kargo, tahsilat) izin
  kapsamında farklı değerlendirilir; pazarlama araması ise kesinlikle izin ister.

---

## Dosya düzeni

```
src/
  server.js                  Vapi + Retell webhook'ları ve tool uçları
  lib/http.js                ortak fetch/env yardımcıları
  vapi/
    client.js                Vapi REST istemcisi
    assistant.config.js      Türkçe asistan tanımı (STT/TTS/prompt/tool)
    setup.js                 SIP trunk + asistan + numara kurulumu
    call.js                  giden arama
  retell/
    client.js                Retell REST istemcisi
    setup.js                 LLM + agent + numara import
    call.js                  giden arama
docs/
  tr-numara-ve-sip.md        operatör seçimi, SIP ayarları, sorun giderme
```

## Vapi mı Retell mi?

İkisi de aynı işi yapar; fark detayda:

- **Vapi:** daha esnek (asistanı çalışma anında webhook'tan döndürebilirsin —
  `assistant-request`), tool/workflow tarafı daha derin, konfigürasyon JSON ile tam kontrol.
- **Retell:** kurulumu daha kısa, panel üzerinden no-code akış kurmak kolay, telefon
  entegrasyonu (elastic SIP) daha az parametreyle çalışıyor.

Aynı SIP trunk'ı ikisine birden bağlayıp deneyebilirsin; bu kit ikisini de kuruyor.
