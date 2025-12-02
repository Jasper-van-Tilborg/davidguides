# PWA Setup - Habit Adventure

Deze app is geconfigureerd als een Progressive Web App (PWA) volgens de moderne Next.js 16 + Tailwind CSS v4 guide.

## ✅ Geïmplementeerde PWA Features

- ✅ **TypeScript Manifest** (`app/manifest.ts`) - Type-safe manifest configuratie
- ✅ **Service Worker** - Automatisch gegenereerd door `@ducanh2912/next-pwa`
- ✅ **Offline Support** - Network First caching strategie
- ✅ **Installable** - App kan geïnstalleerd worden op home screen
- ✅ **Custom Icons** - Voorbereid voor icon-192.png, icon-512.png, apple-touch-icon.png
- ✅ **Offline Fallback Page** - Custom offline pagina bij `/offline`

## 📦 PWA Dependencies

- `@ducanh2912/next-pwa` - Moderne PWA plugin voor Next.js 13+ App Router
- Tailwind CSS v4 - Met nieuwe `@theme` configuratie

## 🎨 Icons Toevoegen

Volg deze stappen om icons toe te voegen:

1. **Gebruik Favicon.io** (aanbevolen):
   - Ga naar https://favicon.io
   - Upload een 512x512 PNG afbeelding of genereer van tekst/emoji
   - Download het package
   - Gebruik deze bestanden:
     - `android-chrome-192x192.png` → hernoem naar `icon-192.png`
     - `android-chrome-512x512.png` → hernoem naar `icon-512.png`
     - `apple-touch-icon.png` → gebruik zoals het is

2. **Plaats de icons**:
   ```
   public/
   ├── icons/
   │   ├── icon-192.png
   │   └── icon-512.png
   └── apple-touch-icon.png
   ```

3. **Test de icons**:
   - Build de app: `npm run build`
   - Start production server: `npm run start`
   - Open DevTools → Application → Manifest
   - Controleer of alle icons geladen worden

## 🧪 PWA Testen

### Lokaal Testen

1. **Development mode**:
   ```bash
   npm run dev
   ```
   PWA is uitgeschakeld in development (zoals geconfigureerd)

2. **Production build**:
   ```bash
   npm run build
   npm run start
   ```
   Nu is PWA actief op http://localhost:3001

### Chrome DevTools

1. Open DevTools (F12)
2. Ga naar **Application** tab
3. Check:
   - **Manifest** - Zie manifest details en install status
   - **Service Workers** - Zie geregistreerde service worker
   - **Cache Storage** - Zie gecachte bestanden

### Offline Testen

1. Open DevTools → Application → Service Workers
2. Vink **Offline** checkbox aan
3. Herlaad de pagina - zou moeten werken!
4. Test navigatie tussen pagina's

### Installeren

**Desktop (Chrome/Edge)**:
- Kijk naar install icon (➕) in address bar
- Of: Menu (⋯) → "Install Habit Adventure"

**Android (Chrome)**:
- Menu (⋯) → "Add to Home Screen"

**iOS (Safari)**:
- Share button → "Add to Home Screen"

## 🔧 Configuratie Details

### Manifest (`app/manifest.ts`)

Het manifest wordt automatisch geserveerd op `/manifest.webmanifest` door Next.js. Je hoeft het niet handmatig te linken in `layout.tsx`.

**Belangrijk**: Verwijder `manifest: "/manifest.json"` uit metadata als je `app/manifest.ts` gebruikt!

### Service Worker Strategie

**Network First** (huidige configuratie):
- Probeert eerst netwerk
- Val terug op cache als offline
- Goed voor dynamische content

**Cache First** (optioneel):
- Voor offline-first apps
- Zie guide voor custom service worker implementatie

### Caching

- **Pages**: Network First (max 200 entries, 30 dagen)
- **Images**: Cache First (max 60 entries, 30 dagen)
- **Automatic**: Service worker cachet automatisch bezochte pagina's

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

## 📚 Resources

- [Next.js PWA Guide](https://github.com/DuCanhGH/next-pwa)
- [MDN PWA Guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev PWA](https://web.dev/progressive-web-apps/)

## ⚠️ Troubleshooting

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

