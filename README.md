# 📊 Enkät-applikation

En modern enkät-applikation byggd med React, Vite och Supabase. Samlar in data om kön, ålder och stjärntecken från användare.

## Installation

Eftersom Node.js inte är installerat på din dator, behöver du först installera det. Här är några alternativ:

### Alternativ 1: Installera Node.js via officiell webbplats
1. Gå till [nodejs.org](https://nodejs.org/)
2. Ladda ner LTS-versionen för macOS
3. Installera den nedladdade filen

### Alternativ 2: Installera via Homebrew (kräver administratörsbehörighet)
```bash
# Installera Homebrew först
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installera Node.js
brew install node
```

### Alternativ 3: Använd Node Version Manager (nvm)
```bash
# Installera nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Starta om terminalen eller kör
source ~/.bashrc

# Installera Node.js
nvm install --lts
nvm use --lts
```

## Efter Node.js-installation

När Node.js är installerat, kör följande kommandon:

```bash
# Installera dependencies
npm install

# Starta utvecklingsservern
npm run dev
```

## Supabase-konfiguration

1. Skapa en `.env`-fil i projektets rot:
```bash
cp env.example .env
```

2. Redigera `.env`-filen och lägg till dina Supabase-credentials:
```
VITE_SUPABASE_URL=din_supabase_url_här
VITE_SUPABASE_ANON_KEY=din_supabase_anon_key_här
```

## Projektstruktur

```
Trax_Mall_Version_2/
├── src/
│   ├── App.jsx          # Huvudkomponent med Supabase-koppling
│   ├── App.css          # Styling för App-komponenten
│   ├── main.jsx         # React-applikationens startpunkt
│   └── index.css        # Global CSS
├── package.json         # Projektberoenden och scripts
├── vite.config.js       # Vite-konfiguration
├── index.html           # HTML-startfil
├── env.example          # Exempel på miljövariabler
└── README.md           # Denna fil
```

## Funktioner

- ✅ **Modern enkät-design** - Snygg och responsiv UI
- ✅ **Tre frågor** - Kön, ålder och stjärntecken
- ✅ **Supabase-integration** - Automatisk datalagring
- ✅ **Realtidsstatistik** - Visar totalt antal svar
- ✅ **Validering** - Alla fält är obligatoriska
- ✅ **Success-sida** - Bekräftelse efter inskickning
- ✅ **Responsiv design** - Fungerar på alla enheter

## Nästa steg

När du har installerat Node.js och konfigurerat Supabase, kan du:

1. **Sätt upp Supabase** - Följ instruktionerna i `SUPABASE_SETUP.md`
2. **Starta utvecklingsservern** med `npm run dev`
3. **Öppna** `http://localhost:5173` i din webbläsare
4. **Testa enkäten** - Fyll i och skicka in svar
5. **Kontrollera data** - Se svaren i Supabase Dashboard

## Supabase Setup

Se `SUPABASE_SETUP.md` för detaljerade instruktioner om hur du sätter upp databasen. # Vercel deployment test
