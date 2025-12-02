# 🎮 Habit Adventure - Gamified Habit Tracker PWA

Een meertalige Progressive Web App waarin gebruikers dagelijkse gewoontes tracken in een avonturengame format.

## ✨ Features

- 🎯 **Gamified Habit Tracking** - Elke gewoonte geeft XP, levels en wereldvoortgang
- 🌍 **Meertalig** - URL-based routing (NL/EN) met TypeScript translations
- 📱 **Mobile-First PWA** - Volledig geoptimaliseerd voor mobile, installeerbaar als app
- 🔐 **Authenticatie** - LocalStorage-based authenticatie systeem
- 🎨 **Modern UI** - Gebouwd met Next.js, TypeScript en Tailwind CSS
- ⚡ **Offline Support** - Service Worker caching voor offline gebruik
- 🎮 **Gamification** - XP systeem, levels, werelden en streaks
- 📱 **Touch-Friendly** - Grote touch targets, hamburger menu, mobile-optimized layouts

## 🚀 Getting Started

### Vereisten

- Node.js 18+
- npm of yarn

### Installatie

1. Clone de repository:

```bash
git clone <repository-url>
cd davidguides
```

2. Installeer dependencies:

```bash
npm install
```

3. Start de development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in je browser.

**Let op**: Deze app gebruikt LocalStorage voor data opslag. Alle data wordt lokaal opgeslagen in je browser en werkt volledig offline. Geen externe services of API's nodig!

### Production Build

```bash
npm run build
npm run start
```

De production server draait op [http://localhost:3001](http://localhost:3001).

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 3.4
- **Storage**: LocalStorage (client-side data persistence)
- **PWA**: @ducanh2912/next-pwa (Next.js 13+ compatible)
- **i18n**: react-i18next
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Icons**: lucide-react

## 🗂️ Project Structuur

```
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout met PWA metadata
│   ├── page.tsx           # Root redirect naar /nl
│   ├── manifest.ts        # PWA manifest (TypeScript)
│   ├── providers.tsx      # Client providers (i18n)
│   ├── globals.css        # Global styles + mobile optimizations
│   ├── translations.ts    # TypeScript translations (NL/EN)
│   ├── [lang]/            # Dynamic language routing
│   │   ├── layout.tsx     # Language layout met Navigation
│   │   ├── page.tsx       # Homepage
│   │   ├── dashboard/     # Dashboard pagina
│   │   ├── adventure/     # Adventure/world map pagina
│   │   └── auth/          # Authenticatie pagina's
│   │       ├── signin/
│   │       └── signup/
│   └── offline/           # Offline fallback pagina
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx    # Touch-friendly button
│   │   └── Card.tsx
│   ├── auth/             # Authenticatie componenten
│   ├── Navigation.tsx    # Main navigation (hamburger menu)
│   ├── HomeContent.tsx   # Homepage content
│   ├── DashboardContent.tsx
│   ├── AdventureContent.tsx
│   ├── HabitCard.tsx     # Habit display card
│   ├── ProgressDisplay.tsx
│   ├── AddHabitModal.tsx
│   └── LanguageSwitcher.tsx
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hook
│   ├── useHabits.ts      # Habits management hook
│   └── useProgress.ts    # Progress/XP tracking hook
├── lib/                   # Utilities
│   ├── storage.ts        # LocalStorage client & auth
│   ├── i18n.ts           # i18n configuration (react-i18next)
│   └── utils.ts          # Helper functions
├── locales/              # Translation files (react-i18next)
│   ├── en.json
│   └── nl.json
├── types/                # TypeScript type definitions
│   └── index.ts
├── public/               # Static assets
│   ├── favicon.ico       # Favicon
│   ├── apple-touch-icon.png  # iOS icon
│   ├── icons/            # PWA icons
│   │   ├── icon-192.png  # Android icon (192x192)
│   │   ├── icon-512.png  # Android icon (512x512)
│   │   └── SETUP.md      # Icon setup instructies
│   └── robots.txt
├── tailwind.config.js    # Tailwind CSS configuratie
├── next.config.js        # Next.js + PWA configuratie
└── package.json
```

## ✅ Geïmplementeerde Features

- [x] Habit CRUD operaties (via LocalStorage)
- [x] Authenticatie systeem (LocalStorage-based)
- [x] XP en level systeem (100 XP per level)
- [x] Wereld unlock systeem (elke 5 levels)
- [x] Dagelijkse check-ins systeem
- [x] Streak tracking
- [x] Meertalig systeem (NL/EN) - URL-based routing met TypeScript translations
- [x] PWA configuratie (TypeScript manifest)
- [x] Service Worker met caching strategie
- [x] Offline fallback pagina
- [x] Installable PWA
- [x] Mobile-first design met hamburger menu
- [x] Touch-friendly interfaces (44px minimum touch targets)
- [x] Responsive layouts voor alle schermformaten
- [x] Language switching zonder page reload

## 🎯 Toekomstige Features

- [ ] Wereldkaart UI component (visuele verbetering)
- [ ] Achievements/Badges systeem
- [ ] Admin dashboard
- [ ] Habit templates
- [ ] Export/Import functionaliteit
- [ ] Push notifications
- [ ] Background sync

## 📱 Mobile Optimizations

De app is volledig geoptimaliseerd voor mobile devices:

- **Hamburger Menu** - Mobile navigation met slide-out menu
- **Touch Targets** - Minimum 44px voor alle klikbare elementen
- **Responsive Layouts** - Alle pagina's zijn mobile-first
- **Touch-Friendly** - `touch-manipulation` CSS voor betere touch response
- **Mobile Viewport** - Correct geconfigureerde viewport meta tags
- **iOS Optimizations** - Voorkomt zoom op input focus, verbeterde scrolling

## 📱 PWA Setup

### Icons Toevoegen

Voor volledige PWA functionaliteit zijn de volgende icons nodig:

1. **PWA Icons** (vereist voor installatie):

   - `public/icons/icon-192.png` (192x192 pixels)
   - `public/icons/icon-512.png` (512x512 pixels)

2. **Apple Touch Icon** (al aanwezig ✅):
   - `public/apple-touch-icon.png` (180x180 pixels)

**Snelste methode**:

1. Ga naar https://favicon.io/favicon-converter/
2. Upload je `apple-touch-icon.png`
3. Download het package
4. Gebruik `android-chrome-192x192.png` → hernoem naar `icon-192.png`
5. Gebruik `android-chrome-512x512.png` → hernoem naar `icon-512.png`
6. Plaats beide in `public/icons/`

Zie `public/icons/SETUP.md` voor gedetailleerde instructies.

### PWA Testen

**Development mode**:

- PWA is uitgeschakeld in development (zoals geconfigureerd)
- Gebruik `npm run dev` voor development

**Production mode**:

```bash
npm run build
npm run start
```

- PWA is actief op http://localhost:3001
- Test installatie en offline functionaliteit

**Chrome DevTools**:

1. Open DevTools (F12)
2. Ga naar **Application** tab
3. Check:
   - **Manifest** - Zie manifest details en install status
   - **Service Workers** - Zie geregistreerde service worker
   - **Cache Storage** - Zie gecachte bestanden

**Offline Testen**:

1. DevTools → Application → Service Workers
2. Vink **Offline** checkbox aan
3. Herlaad de pagina - zou moeten werken!

**Installeren**:

- **Desktop**: Kijk naar install icon (➕) in address bar
- **Android**: Menu (⋯) → "Add to Home Screen" of "Install app"
- **iOS**: Share button → "Add to Home Screen"

**📱 Zie `INSTALL_PWA.md` voor gedetailleerde instructies om de PWA op je telefoon te installeren!**

## 💾 LocalStorage Data Structuur

De app gebruikt LocalStorage voor alle data opslag:

- **User Data**: Gebruikersinformatie en authenticatie
- **Habits**: Alle gewoontes van de gebruiker
- **Check-ins**: Dagelijkse voltooiingen per gewoonte
- **Progress**: XP, level, en huidige wereld
- **Achievements**: Behaalde prestaties (toekomstig)
- **Settings**: App instellingen en voorkeuren

Alle data wordt automatisch gesynchroniseerd en werkt volledig offline.

## 🎮 Gamification Systeem

- **XP Rewards**: Elke gewoonte geeft 5-50 XP (configureerbaar)
- **Level System**: 100 XP per level
- **World Unlock**: Elke 5 levels een nieuwe wereld
- **Streak Tracking**: Aantal dagen op rij een gewoonte voltooien
- **Progress Bar**: Visuele voortgang naar volgende level

## 📝 Guides Toegepast

Deze app implementeert de volgende workshop guides:

1. ✅ **PWA Workshop** - TypeScript manifest, Service Worker, offline support (@ducanh2912/next-pwa)
2. ✅ **Multilingual Portfolio Workshop** - URL-based routing met `[lang]` parameter, TypeScript translations, language switching
3. ✅ **LocalStorage Auth** - Authenticatie en data opslag via LocalStorage
4. ✅ **CRUD Operations** - Volledige CRUD operaties voor habits via LocalStorage
5. ✅ **Mobile-First Design** - Touch-friendly interfaces, hamburger menu, responsive layouts
6. ⏳ **Git/GitHub** - Feature branches en workflow (to be implemented)

## 🌍 URL Structuur

De app gebruikt URL-based language routing:

- `/` → Redirect naar `/nl`
- `/nl` → Nederlandse homepage
- `/nl/dashboard` → Nederlandse dashboard
- `/nl/adventure` → Nederlandse adventure
- `/nl/auth/signin` → Nederlandse sign in
- `/nl/auth/signup` → Nederlandse sign up
- `/en` → English homepage
- `/en/dashboard` → English dashboard
- `/en/adventure` → English adventure
- `/en/auth/signin` → English sign in
- `/en/auth/signup` → English sign up

Language switching behoudt de huidige pagina - als je op `/nl/dashboard` bent en naar Engels wisselt, ga je naar `/en/dashboard`.

## 🚀 Deployment

### Vercel (Aanbevolen)

1. Push code naar GitHub
2. Import project in Vercel
3. Deploy automatisch
4. HTTPS wordt automatisch geconfigureerd (vereist voor PWA)

### Post-Deployment Checklist

- [ ] Test installatie op desktop
- [ ] Test installatie op Android
- [ ] Test installatie op iOS
- [ ] Test offline functionaliteit
- [ ] Check manifest in DevTools
- [ ] Verify service worker registratie
- [ ] Test op verschillende browsers

## 🐛 Troubleshooting

### Service Worker niet geüpdatet?

- Hard refresh: `Ctrl+Shift+R` (Windows) of `Cmd+Shift+R` (Mac)
- Unregister in DevTools → Application → Service Workers

### Manifest errors?

- Check `app/manifest.ts` voor TypeScript errors
- Verify icons bestaan op juiste locaties
- Check `/manifest.webmanifest` in browser

### App niet installable?

- Check HTTPS (of localhost)
- Verify manifest is valid
- Check service worker is geregistreerd
- Test op echte device (niet alleen emulator)

## 📚 Resources

- [Next.js PWA Guide](https://github.com/DuCanhGH/next-pwa)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)

## 📄 License

MIT
