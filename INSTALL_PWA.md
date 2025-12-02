# 📱 PWA Installeren op Telefoon

## ⚠️ Belangrijk: Icons Vereist

Voordat je de PWA kunt installeren, moet je eerst de PWA icons toevoegen:

1. **Ga naar**: https://favicon.io/favicon-converter/
2. **Upload**: Je `public/apple-touch-icon.png`
3. **Download** het package
4. **Gebruik**:
   - `android-chrome-192x192.png` → hernoem naar `icon-192.png`
   - `android-chrome-512x512.png` → hernoem naar `icon-512.png`
5. **Plaats beide** in `public/icons/`

Zonder deze icons werkt de installatie niet!

---

## Methode 1: Via Localhost (Development/Testing)

### Stap 1: Start Production Server

```bash
npm run build
npm run start
```

De app draait nu op: **http://localhost:3001**

### Stap 2: Maak Verbinding met Je Telefoon

Je telefoon moet op hetzelfde WiFi netwerk zitten als je computer.

#### Optie A: Via IP Adres (Eenvoudigst)

1. **Vind je computer's IP adres**:
   - **Windows**: Open CMD en typ `ipconfig`, zoek naar "IPv4 Address"
   - **Mac/Linux**: Open Terminal en typ `ifconfig` of `ip addr`

2. **Open op je telefoon**: `http://[JE-IP-ADRES]:3001`
   - Bijvoorbeeld: `http://192.168.1.100:3001`

#### Optie B: Via ngrok (Met HTTPS)

1. **Installeer ngrok**: https://ngrok.com/download
2. **Start ngrok**:
   ```bash
   ngrok http 3001
   ```
3. **Gebruik de HTTPS URL** die ngrok geeft (bijv. `https://abc123.ngrok.io`)

### Stap 3: Installeer op Telefoon

#### Android (Chrome)

1. Open de URL in Chrome browser
2. Wacht tot de pagina volledig geladen is
3. Kijk naar de **install banner** bovenaan, of:
4. Klik op **menu** (3 puntjes) → **"Add to Home Screen"** of **"Install app"**
5. Bevestig installatie
6. App verschijnt op je home screen! 🎉

#### iOS (Safari)

1. Open de URL in Safari browser (niet Chrome!)
2. Wacht tot de pagina volledig geladen is
3. Klik op **Share button** (vierkant met pijl omhoog)
4. Scroll naar beneden en klik **"Add to Home Screen"**
5. Pas naam aan indien gewenst
6. Klik **"Add"**
7. App verschijnt op je home screen! 🎉

---

## Methode 2: Via Deployment (Aanbevolen voor Productie)

### Stap 1: Deploy naar Vercel

1. **Push code naar GitHub**
2. **Ga naar**: https://vercel.com
3. **Import project** van GitHub
4. **Deploy** - Vercel geeft je een HTTPS URL (bijv. `https://habit-adventure.vercel.app`)

### Stap 2: Installeer op Telefoon

#### Android (Chrome)

1. Open de Vercel URL in Chrome
2. Wacht tot pagina geladen is
3. **Install banner** verschijnt automatisch, of:
4. Menu (3 puntjes) → **"Install app"** of **"Add to Home Screen"**
5. Bevestig
6. App geïnstalleerd! 🎉

#### iOS (Safari)

1. Open de Vercel URL in Safari
2. Share button → **"Add to Home Screen"**
3. Bevestig
4. App geïnstalleerd! 🎉

---

## Troubleshooting

### "Add to Home Screen" optie verschijnt niet?

**Mogelijke oorzaken**:

1. **Icons ontbreken** - Zorg dat `icon-192.png` en `icon-512.png` in `public/icons/` staan
2. **Geen HTTPS** - PWAs vereisen HTTPS (behalve localhost)
3. **Manifest errors** - Check DevTools → Application → Manifest voor errors
4. **Service Worker niet geregistreerd** - Check DevTools → Application → Service Workers

### Test Checklist

- [ ] App draait op production build (`npm run build && npm run start`)
- [ ] Icons zijn toegevoegd (`icon-192.png` en `icon-512.png`)
- [ ] Manifest is valid (check `/manifest.webmanifest` in browser)
- [ ] Service Worker is geregistreerd (DevTools → Application)
- [ ] HTTPS is actief (of localhost)
- [ ] Telefoon is opzelfde netwerk (voor localhost methode)

### Test Manifest

Open in browser op je telefoon:
- `https://jouw-url.com/manifest.webmanifest`

Je zou JSON moeten zien, geen 404 error.

### Test Service Worker

1. Open DevTools (op desktop, niet telefoon)
2. Application → Service Workers
3. Check of service worker geregistreerd is
4. Test offline mode

---

## Snelle Test (Zonder Icons)

Als je snel wilt testen zonder icons, kun je tijdelijk het manifest aanpassen:

```typescript
// app/manifest.ts - tijdelijk
icons: [
  {
    src: "/apple-touch-icon.png",
    sizes: "180x180",
    type: "image/png",
    purpose: "any",
  },
],
```

**Let op**: Dit werkt mogelijk niet op alle devices. Voeg altijd de juiste icons toe voor productie!

---

## Tips

- **Android**: Gebruik altijd Chrome browser voor beste PWA support
- **iOS**: Gebruik altijd Safari (Chrome op iOS heeft beperkte PWA support)
- **Test offline**: Na installatie, zet vliegtuigmodus aan en test of app werkt
- **Update**: Service Worker update automatisch bij nieuwe versies

---

## Volgende Stappen

Na installatie:
- Test offline functionaliteit
- Test alle features
- Check of data wordt opgeslagen (LocalStorage)
- Test op verschillende devices

Veel succes! 🚀

