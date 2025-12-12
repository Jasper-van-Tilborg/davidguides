# PWA Icons Setup

## Vereiste Icons

Voor volledige PWA functionaliteit heb je de volgende icons nodig:

### 1. PWA Icons (vereist voor installatie)
- `icon-192.png` - 192x192 pixels
- `icon-512.png` - 512x512 pixels

### 2. Apple Touch Icon (al toegevoegd ✅)
- `apple-touch-icon.png` - 180x180 pixels (staat in `public/`)

## Snelste Methode: Gebruik je bestaande apple-touch-icon.png

Je hebt al `apple-touch-icon.png`. Je kunt deze gebruiken als basis:

### Optie 1: Online Tool (Aanbevolen)
1. Ga naar https://favicon.io/favicon-converter/
2. Upload je `apple-touch-icon.png`
3. Download het package
4. Gebruik:
   - `android-chrome-192x192.png` → hernoem naar `icon-192.png`
   - `android-chrome-512x512.png` → hernoem naar `icon-512.png`
5. Plaats beide in `public/icons/`

### Optie 2: Image Resizer
1. Open `apple-touch-icon.png` in een image editor
2. Resize naar 192x192 → save als `icon-192.png`
3. Resize naar 512x512 → save als `icon-512.png`
4. Plaats beide in `public/icons/`

### Optie 3: Online Image Resizer
- https://imageresizer.com/
- Upload `apple-touch-icon.png`
- Resize naar 192x192 en 512x512
- Download beide en plaats in `public/icons/`

## Verificatie

Na het toevoegen van de icons:

1. Build de app: `npm run build`
2. Start: `npm run start`
3. Open DevTools → Application → Manifest
4. Check of alle icons geladen worden (geen 404 errors)

## Folder Structuur

```
public/
├── favicon.ico ✅
├── apple-touch-icon.png ✅
└── icons/
    ├── icon-192.png ⏳ (nog toe te voegen)
    └── icon-512.png ⏳ (nog toe te voegen)
```





