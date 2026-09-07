# Kurulu Claude Code becerileri (skills)

Velvetine devir paketindeki `01_REHBERLER/KAYNAKLAR_REPOLAR_SKILLS.md` bölümünde listelenen
GitHub kaynaklarından, **rehberde yazan tam commit'lere sabitlenerek** indirilmiş ve
`.claude/skills/` altına gerçek Claude Code becerisi olarak kurulmuştur.

Devir paketi bu dosyaları `archived-reference-not-installed` durumuyla arşivlemişti — dosya
olarak duruyorlardı ama beceri olarak yüklü değildiler. Buradaki fark: bu klasördekiler
Claude Code tarafından otomatik yüklenen çalışır becerilerdir.

## Kaynaklar ve sabitlenmiş commit'ler

| Repo | Commit | Lisans | Alınan beceri |
|---|---|---|---|
| [coreyhaines31/marketingskills](https://github.com/coreyhaines31/marketingskills) | `5b2c0007766c6a1cf1d53fd8fc73e979e0821022` | MIT | 51 pazarlama becerisi |
| [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | `2c606141936f1eeef17fa3043a72095b4765b9c2` | MIT (README beyanı; ayrı LICENSE dosyası yok) | `karpathy-guidelines` |
| [wuyoscar/GPT-Image2-Skill](https://github.com/wuyoscar/GPT-Image2-Skill) | `135d873e1a843db5f122a15ddda02bd2845d4d25` | MIT | `gpt-image`, `get-prompt-from-image` |
| [ningzimu/image-to-editable-ppt-skill](https://github.com/ningzimu/image-to-editable-ppt-skill) | `fb869763127fd31ba7288d905671ffc4ea542f60` | MIT | `image-to-editable-ppt` |
| [claude-world/notebooklm-skill](https://github.com/claude-world/notebooklm-skill) | `dc38bd8106a2c5f23557fc03bf895c53fb19f67e` | MIT | `notebooklm-research` |
| [Jaycheng1103/chatgpt-video-editing-skills](https://github.com/Jaycheng1103/chatgpt-video-editing-skills) | `dc2f10ac4616603188aff3df9ea6548a8da36355` | MIT | `chatgpt-short-video-editor`, `chatgpt-video-editing-setup` |

Lisans metinleri `.claude/skills-licenses/` altındadır.

**Alınmayan repolar** (bu repolarda SKILL.md yok, sadece kaynak/mimari referansı):
`trycompai/crm`, `anil-matcha/open-generative-ai`, `saurajb/Open-Higgsfield-AI`,
`TencentCloud/TencentDB-Agent-Memory`. Bunlar devir paketinde
`03_CALISMA_ALANI/app/docs/source-pack/` altında referans olarak durmaya devam eder.

**Alınmayan içerik:** `wuyoscar/GPT-Image2-Skill/docs` (423 MB örnek görsel) ve tüm
repolardaki `evals/` test fixture'ları — becerinin çalışması için gerekli değiller.

## Dış servis durumu — dikkat

Beceri dosyasının kurulu olması, arkasındaki dış servisin bağlı olduğu anlamına **gelmez**:

- `notebooklm-research` → NotebookLM hesabı bağlı değil, Python servisi kurulmadı.
- `image-to-editable-ppt` → PPT servisi yapılandırılmadı.
- `gpt-image`, `get-prompt-from-image` → sağlayıcı anahtarı yok.
- `chatgpt-short-video-editor`, `chatgpt-video-editing-setup` → FFmpeg/video servisi kurulmadı.

Bu, devir paketindeki `service-unconfigured` durumuyla birebir aynıdır. Pazarlama becerileri
ve `karpathy-guidelines` ise saf metin rehberidir, dış servis gerektirmez.

## Kurulu beceriler (57)

- `ab-testing` — When the user wants to plan, design, or implement an A/B test or experiment, or build a growth experimentation program. 
- `ad-creative` — "When the user wants to generate, iterate, or scale ad creative — headlines, descriptions, primary text, or full ad va
- `ads` — "When the user wants help with paid advertising campaigns on Google Ads, Meta (Facebook/Instagram), LinkedIn, Twitter/X,
- `ai-seo` — "When the user wants to optimize content for AI search engines, get cited by LLMs, or appear in AI-generated answers. Al
- `analytics` — When the user wants to set up, improve, or audit analytics tracking and measurement. Also use when the user mentions "se
- `aso` — "When the user wants to audit or optimize an App Store or Google Play listing. Also use when the user mentions 'ASO audi
- `attribution` — When the user wants to figure out which marketing actually drives conversions and revenue, choose or interpret an attrib
- `chatgpt-short-video-editor` — "Edit a user-supplied video into a vertical Reel, Short, TikTok, video diary short, or an approved eight-step AI short-v
- `chatgpt-video-editing-setup` — "Set up, repair, or verify the local AI short-video environment: video-use, FFmpeg, the Source Han Sans TW subtitle font
- `churn-prevention` — "When the user wants to reduce churn, build cancellation flows, set up save offers, recover failed payments, or implemen
- `co-marketing` — "When the user wants to find co-marketing partners, plan joint campaigns, or brainstorm partnership opportunities. Use w
- `cold-email` — Write B2B cold emails and follow-up sequences that get replies. Use when the user wants to write cold outreach emails, p
- `community-marketing` — "Build and leverage online communities to drive product growth and brand loyalty. Use when the user wants to create a co
- `competitor-profiling` — "When the user wants to research, profile, or analyze competitors from their URLs. Also use when the user mentions 'comp
- `competitors` — "When the user wants to create competitor comparison or alternative pages for SEO and sales enablement. Also use when th
- `content-strategy` — When the user wants to plan a content strategy, decide what content to create, or figure out what topics to cover. Also 
- `copy-editing` — "When the user wants to edit, review, or improve existing marketing copy, or refresh outdated content. Also use when the
- `copywriting` — When the user wants to write, rewrite, or improve marketing copy for any page — including homepage, landing pages, pri
- `cro` — "When the user wants to optimize, improve, or increase conversions on any marketing page or form — including homepage,
- `customer-research` — When the user wants to conduct, analyze, or synthesize customer research. Use when the user mentions "customer research,
- `directory-submissions` — When the user wants to submit their product to startup, SaaS, AI, agent, MCP, no-code, or review directories for backlin
- `emails` — When the user wants to create or optimize an email sequence, drip campaign, automated email flow, or lifecycle email pro
- `events` — "When the user wants to plan, run, sponsor, speak at, or get pipeline from events — webinars, conferences, trade shows
- `free-tools` — When the user wants to plan, evaluate, or build a free tool for marketing purposes — lead generation, SEO value, or br
- `get-prompt-from-image` — Analyze user-provided reference images and reverse-engineer high-fidelity AI image-generation prompts. Use when the user
- `gpt-image` — "Use this skill whenever a user asks to generate, create, draw, render, or edit images with GPT Image 2 / gpt-image-2, t
- `image-to-editable-ppt` — Rebuild slide images, image-based or scanned PPT/PPTX files, and PDF decks into object-level editable PowerPoint (.pptx)
- `image` — "When the user wants to create, generate, edit, or optimize images for marketing — blog heroes, social graphics, produ
- `influencer-marketing` — "When the user wants to run influencer, creator, or ambassador partnerships to promote their product — finding and vet
- `karpathy-guidelines` — Behavioral guidelines to reduce common LLM coding mistakes. Use when writing, reviewing, or refactoring code to avoid ov
- `launch` — "When the user wants to plan a product launch, feature announcement, or release strategy. Also use when the user mention
- `lead-magnets` — When the user wants to create, plan, or optimize a lead magnet for email capture or lead generation. Also use when the u
- `marketing-council` — "When the user wants multiple expert perspectives on a marketing question — a simulated board of advisors staffed by l
- `marketing-ideas` — "When the user needs marketing ideas, inspiration, or strategies for their SaaS or software product. Also use when the u
- `marketing-loops` — "When the user wants to set up a recurring, self-running marketing workflow — a repeatable loop an AI agent runs on a 
- `marketing-plan` — When the user needs a comprehensive marketing plan for a client, a company they advise, or their own product. Also use w
- `marketing-psychology` — "When the user wants to apply psychological principles, mental models, or behavioral science to marketing. Also use when
- `notebooklm-research` — >
- `offers` — "When the user wants to design, construct, or improve an offer — the thing they actually sell — including value fram
- `onboarding` — When the user wants to optimize post-signup onboarding, user activation, first-run experience, or time-to-value. Also us
- `paywalls` — When the user wants to create or optimize in-app paywalls, upgrade screens, upsell modals, or feature gates. Also use wh
- `popups` — When the user wants to create or optimize popups, modals, overlays, slide-ins, or banners for conversion purposes. Also 
- `pricing` — "When the user wants help with pricing decisions, packaging, or monetization strategy. Also use when the user mentions '
- `product-marketing` — "When the user wants to create or update their product marketing context document. Also use when the user mentions 'prod
- `programmatic-seo` — When the user wants to create SEO-driven pages at scale using templates and data. Also use when the user mentions "progr
- `prospecting` — When the user wants to find, qualify, and build a list of prospects to reach out to — across B2B SaaS, general B2B, or
- `public-relations` — "When the user wants help with public relations, earned media, press coverage, journalist outreach, or media strategy (n
- `referrals` — "When the user wants to create, optimize, or analyze a referral program, affiliate program, or word-of-mouth strategy. A
- `revops` — "When the user wants help with revenue operations, lead lifecycle management, or marketing-to-sales handoff processes. A
- `sales-enablement` — "When the user wants to create sales collateral, pitch decks, one-pagers, objection handling docs, or demo scripts. Also
- `schema` — When the user wants to add, fix, or optimize schema markup and structured data on their site. Also use when the user men
- `seo-audit` — When the user wants to audit, review, or diagnose SEO issues on their site. Also use when the user mentions "SEO audit,"
- `signup` — When the user wants to optimize signup, registration, account creation, or trial activation flows. Also use when the use
- `site-architecture` — When the user wants to plan, map, or restructure their website's page hierarchy, navigation, URL structure, or internal 
- `sms` — When the user wants to plan, build, or optimize SMS or MMS marketing — including welcome flows, abandoned cart texts, 
- `social` — "When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, T
- `video` — "When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use w

## Kendi bilgisayarına kurmak

Bu klasördeki beceriler sadece bu repoda geçerli. Her projede (Velvetine dahil) kullanmak
için `~/.claude/skills/` altına kopyala.

**Windows (PowerShell):**

```powershell
git clone -b claude/large-file-upload-x9nqeb https://github.com/oruldak/claude.git "$env:TEMP\ccskills"
New-Item -ItemType Directory -Force "$HOME\.claude\skills" | Out-Null
Copy-Item "$env:TEMP\ccskills\.claude\skills\*" "$HOME\.claude\skills\" -Recurse -Force
Remove-Item "$env:TEMP\ccskills" -Recurse -Force
```

**Mac / Linux:**

```bash
git clone -b claude/large-file-upload-x9nqeb https://github.com/oruldak/claude.git /tmp/ccskills
mkdir -p ~/.claude/skills && cp -R /tmp/ccskills/.claude/skills/. ~/.claude/skills/
rm -rf /tmp/ccskills
```

Kurulumdan sonra Claude Code'da `/skills` yazarak listeyi görebilirsin.

## Çok fazla beceri gelirse

57 beceri aynı anda yüklü olunca doğru becerinin tetiklenmesi zorlaşabilir. Velvetine için
asıl gerekli olanlar:

`ads`, `ad-creative`, `copywriting`, `cro`, `offers`, `marketing-psychology`,
`customer-research`, `competitors`, `emails`, `sms`, `popups`, `signup`, `lead-magnets`,
`ab-testing`, `analytics`, `attribution`, `product-marketing`, `karpathy-guidelines`

Gerisini silmek istersen ilgili klasörü `.claude/skills/` (veya `~/.claude/skills/`)
altından kaldırman yeterli.
