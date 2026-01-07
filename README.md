# Servicetechniker Portal - PWA

Eine Progressive Web App (PWA) für den schnellen Zugriff auf KASYS und Telekom Portale.

## 🚀 Quick Start

### Lokales Testen

```bash
# Option 1: Mit Node.js
npx serve

# Option 2: Mit Python
python -m http.server 8080

# Option 3: Mit VS Code Live Server Extension
# Rechtsklick auf index.html → "Open with Live Server"
```

Dann öffne http://localhost:8080 (oder den angezeigten Port).

## 📁 Projektstruktur

```
kasys-pwa/
├── index.html          # Hauptseite
├── manifest.json       # PWA-Manifest
├── sw.js              # Service Worker
├── css/
│   └── styles.css     # Styling
├── js/
│   └── app.js         # App-Logik
├── icons/
│   └── favicon.svg    # Favicon (SVG)
└── generate-icons.html # Tool zum Generieren der PNG-Icons
```

## 🎨 Icons generieren

Bevor du die App deployst, müssen die PNG-Icons erstellt werden:

1. Öffne `generate-icons.html` im Browser
2. Klicke "Alle Icons generieren"
3. Klicke "Alle herunterladen"
4. Verschiebe die heruntergeladenen PNGs in den `icons/` Ordner

**Benötigte Icons:**
- icon-72.png, icon-96.png, icon-128.png, icon-144.png
- icon-152.png, icon-192.png, icon-384.png, icon-512.png
- icon-maskable-192.png, icon-maskable-512.png
- kasys-shortcut.png, telekom-shortcut.png

## 🌐 Deployment

### Option A: GitHub Pages (Empfohlen)

```bash
git init
git add .
git commit -m "Initial PWA"
git branch -M main
git remote add origin https://github.com/DEIN-USERNAME/kasys-pwa.git
git push -u origin main
```

Dann in GitHub:
1. Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: main, Folder: / (root)
4. Save

URL wird sein: `https://DEIN-USERNAME.github.io/kasys-pwa/`

### Option B: Netlify

1. Gehe zu [netlify.com](https://netlify.com)
2. Drag & Drop den gesamten Projektordner
3. Fertig! Du bekommst eine URL wie `random-name.netlify.app`

## 📱 Intune Deployment

### Als Managed Google Play Web-App

1. Microsoft Endpoint Manager Admin Center öffnen
2. Apps → Android → Hinzufügen
3. App-Typ: "Managed Google Play-App"
4. "Web-App hinzufügen" wählen
5. Details eingeben:
   - **Titel:** Servicetechniker Portal
   - **URL:** `https://DEINE-URL.github.io/kasys-pwa/`
   - **Icon:** Das 512px Icon hochladen
6. Zielgruppe zuweisen
7. Speichern & Synchronisieren

## ✨ Features

- ✅ Installierbar auf Homescreen
- ✅ Offline-fähig (App-Shell wird gecacht)
- ✅ Dark Mode Support
- ✅ Responsive Design
- ✅ Touch-optimiert
- ✅ Automatische Update-Erkennung

## 🔧 Anpassungen

### Farben ändern

In `css/styles.css` die CSS-Variablen anpassen:

```css
:root {
  --primary-color: #1976D2;     /* Hauptfarbe */
  --kasys-color: #4CAF50;       /* KASYS Grün */
  --telekom-color: #E20074;     /* Telekom Magenta */
}
```

### Links ändern

In `index.html` die `href` Attribute der Portal-Cards anpassen:

```html
<a href="https://NEUE-URL.de/" ...>
```

### App-Name ändern

In `manifest.json`:
```json
{
  "name": "Neuer Name",
  "short_name": "Kurz"
}
```

## 📋 Checkliste vor Go-Live

- [ ] Icons generiert und in `/icons/` verschoben
- [ ] App lokal getestet
- [ ] Lighthouse PWA Audit bestanden (Chrome DevTools)
- [ ] Auf HTTPS gehostet
- [ ] Auf Testgerät installiert
- [ ] Links zu Portalen funktionieren

## 🐛 Troubleshooting

### Service Worker wird nicht registriert
→ HTTPS ist erforderlich (außer localhost)

### App lässt sich nicht installieren
→ Prüfe manifest.json und Icons in DevTools → Application

### Offline funktioniert nicht
→ Cache leeren: DevTools → Application → Storage → Clear site data
