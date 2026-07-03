# Zimny Detailing — Premium One-Page Website

Elitarna, kinowa strona typu one-page dla studia auto detailingu **Zimny Detailing**.
„Mistrzowska precyzja. Lodowaty blask."

## Doświadczenie

Strona prowadzi użytkownika przez filmową, sterowaną scrollem sekwencję:

1. **Hero** — czarna limuzyna od frontu, reflektory rozbłyskują lodowym błękitem, wielka typografia marki.
2. **SEQ 01 — Wnętrze** — kamera najeżdża na bok auta, drzwi kierowcy otwierają się, odsłaniając podświetlone wnętrze.
3. **SEQ 02 — Lakier** — przejazd do tylnych drzwi i błotnika; suwak Przed/Po ściera zmatowiały, porysowany lakier do czerni fortepianu.
4. **SEQ 03 — Bagażnik** — obrót do tyłu auta, klapa unosi się nad nieskazitelnie odkurzoną przestrzenią.
5. **SEQ 04 — Finał** — pełna sylwetka pod stożkami studyjnego światła, przelot refleksu po karoserii, drobinki kurzu w powietrzu.
6. **Wartości** (jasny marmur) → **Rezerwacja Concierge** (formularz) → stopka.

Całość auta to autorska, warstwowa grafika SVG (trzy ujęcia: przód / bok / tył) — zero bitmap,
ostro w każdej rozdzielczości, a drzwi, klapa i suwak Przed/Po są animowane na poziomie warstw.

## Stack

- **HTML5 + Tailwind CSS** (kompilowany lokalnie, bez CDN) + własne style komponentów
- **GSAP 3 + ScrollTrigger** — przypięta scena i scrubbowana oś czasu
- **Lenis** — płynny, kinowy scroll
- Czcionki **Syncopate / Outfit** self-hosted (WOFF2, latin + latin-ext) — przyjazne RODO
- Wszystkie biblioteki vendorowane w `assets/js/vendor/` — strona działa w pełni offline

## Struktura

```
index.html              # cała treść + inline SVG auta i teł marmurowych
src/styles.css          # źródło Tailwind + style komponentów
assets/css/styles.css   # skompilowany, zminifikowany CSS (commitowany)
assets/js/main.js       # preloader, intro, oś czasu kina, formularz, nawigacja
assets/js/vendor/       # gsap.min.js, ScrollTrigger.min.js, lenis.min.js
assets/fonts/           # Syncopate 700, Outfit (zmienna) — woff2
```

## Rozwój

```bash
npm install          # jednorazowo (tylko tailwindcss jako devDependency)
npm run watch:css    # przebudowa CSS przy zmianach w src/styles.css lub index.html
npm run serve        # http://localhost:8080
npm run build:css    # produkcyjny, zminifikowany CSS
```

Strona jest w 100% statyczna — wystarczy wgrać pliki na dowolny hosting
(GitHub Pages, Netlify, Cloudflare Pages…). Otwarcie `index.html` z dysku również działa.

## Personalizacja

- **Telefon**: podmień `+48 600 000 000` (występuje w `index.html` w linkach `tel:` i treści).
- **Formularz**: obecnie działa jako elegancka makieta (walidacja + ekran podziękowania po stronie
  przeglądarki, pole-pułapka na boty). Aby wysyłał zgłoszenia, podepnij endpoint
  (np. Formspree / własne API) w funkcji `initForm()` w `assets/js/main.js`.
- **Social media**: linki w stopce (`Instagram`, `Facebook`) czekają na adresy profili.
- **Kolory / typografia**: `tailwind.config.js` (paleta `ink` / `ice` / `marble`).

## Dostępność i wydajność

- `prefers-reduced-motion` → statyczna wersja bez przypinania i animacji
- Pełna treść dostępna bez JavaScriptu (animowane nakładki są wtedy ukryte)
- Animacje wyłącznie na `transform` / `opacity`; grafika wektorowa zamiast ciężkich zdjęć

## Licencje bibliotek

GSAP (standard "no charge" license), Lenis (MIT), czcionki Syncopate i Outfit (SIL OFL).
