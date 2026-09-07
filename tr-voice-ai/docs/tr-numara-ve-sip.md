# TR numara, SIP trunk ve sorun giderme

## 1. Hangi numarayı almalı?

| Numara tipi | Örnek | Artı | Eksi |
|---|---|---|---|
| **0850** | 0850 XXX XX XX | Coğrafi bağ yok, ülke geneli tek numara, ucuz, SIP ile doğrudan çalışır | Arayan için "kurumsal/çağrı merkezi" algısı |
| **Coğrafi (0212/0312/0232...)** | 0212 XXX XX XX | Yerel güven algısı yüksek, cevaplanma oranı daha iyi | Adres/şehir bağı istenir |
| **444'lü** | 444 X XXX | Prestij, kısa numara | Pahalı, tahsis süreci uzun |
| **GSM (FCT ile)** | 05XX | Cepten arıyormuş gibi görünür, cevaplanma oranı en yüksek | Operatörün FCT altyapısı gerekir, kanal sayısı sınırlı |

Outbound kampanya yapacaksan cevaplanma oranı sırası genelde: GSM > coğrafi > 0850 > 444.

## 2. Operatörler

BTK'dan STH lisanslı, SIP trunk + API veren yaygın seçenekler: **Verimor**, **Netgsm**,
**Telesis**, **Bulutfon**, **İşNet**, **Vodafone/Turkcell/Türk Telekom kurumsal**.
Verimor ve Netgsm küçük hacimde en hızlı başlanan ikisi; Verimor'un Vapi ve Retell için
yayımlanmış entegrasyon dokümanları da var.

Operatör seçerken sorulacaklar:

1. SIP trunk'ta **kullanıcı adı/şifre (digest) yetkilendirmesi** var mı? (Vapi, paylaşımlı IP
   havuzu kullandığı için salt IP tabanlı yetkilendirmeyi önermiyor.)
2. **Eşzamanlı kanal** sayısı kaç, artırılabiliyor mu?
3. Giden aramada **caller ID olarak kendi DID'imi** gönderebiliyor muyum?
4. **G.711 alaw** destekleniyor mu? (Opus/G.729 transcoding gecikme ekler.)
5. Gelen çağrıyı **harici bir SIP URI'ye** yönlendirebiliyor muyum? (Vapi/Retell için şart.)
6. Dakika ücreti ve DID aylık ücreti nedir; sabit/mobil ayrımı var mı?

## 3. Yön yön ne yapılandırılır

### Giden (outbound) — Vapi/Retell → operatör → arayan kişi

`.env` içindeki `SIP_GATEWAY_HOST`, `SIP_USERNAME`, `SIP_PASSWORD` bunun için. Vapi tarafında
`outboundLeadingPlusEnabled: true` bırakıldı: TR operatörlerinin çoğu `+905321234567`
biçimini bekler. Operatörün `00905321234567` ya da `05321234567` istiyorsa bu bayrağı
kapat ve `src/vapi/setup.js` içinde numara formatını ona göre ayarla.

### Gelen (inbound) — arayan → operatör → Vapi/Retell

Operatör panelinde DID'in gelen çağrı hedefi:

- **Vapi:** `{aranan_numara}@{CREDENTIAL_ID}.sip.vapi.ai` (AB için `sip.eu.vapi.ai`)
- **Retell:** `sip.retellai.com`

## 4. Sorun giderme

| Belirti | Muhtemel sebep | Çözüm |
|---|---|---|
| Giden arama `403 Forbidden` ile düşüyor | SIP kullanıcı adı/şifre yanlış veya IP whitelist eksik | Operatörden trunk log'unu iste; digest auth kullan |
| `404 Not Found` / `484 Address Incomplete` | Numara formatı operatörün beklediğinden farklı | `+90...` ↔ `0090...` ↔ `0...` varyantlarını dene |
| Telefon çalıyor ama ses gelmiyor (tek yönlü ses) | RTP/NAT veya codec uyuşmazlığı | G.711 alaw'ı zorla, operatörden RTP portlarını ve medya sunucusunu doğrulat |
| Asistan İngilizce konuşuyor | STT/TTS dili sabitlenmemiş | `transcriber.language = "tr"` ve çok dilli TTS sesi |
| Türkçe kelimeler yanlış telaffuz | Tek dilli (İngilizce) TTS modeli | ElevenLabs `eleven_turbo_v2_5` veya Azure `tr-TR-*` |
| Yanıt gecikmesi 2 sn+ | Uzak bölge veya ağır model | Sunucuyu/bölgeyi Avrupa'ya al, daha küçük bir modele geç, `startSpeakingPlan` ayarla |
| Arayan numaram "spam" görünüyor | Yurt dışı caller ID veya yoğun outbound | TR DID kullan, günlük arama hacmini kademeli artır |
| Gelen arama Vapi'ye ulaşmıyor | Operatörde inbound routing tanımsız | DID'in hedefini yukarıdaki SIP URI'ye ayarlat |

## 5. Maliyet kalemleri

Aylık toplam maliyet dört kalemden oluşur ve dakika başına düşünmek gerekir:

1. **Operatör:** DID aylık ücreti + dakika (mobil aramalar sabitten pahalı)
2. **Vapi/Retell platform ücreti:** dakika başına
3. **STT + TTS:** dakika başına (ElevenLabs en büyük kalem olabilir)
4. **LLM:** konuşma uzunluğuna göre token

Gerçek maliyeti ölçmenin tek yolu 20-30 gerçek arama yapıp panelden dakika başı ortalamayı
görmek; ilk hesaplarken TTS'i hafife alma.
