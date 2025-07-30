# 🚀 Guide: Lägg till nya frågor i enkäten

## ✅ Säkra strategier för att ändra enkäten

### **Strategi 1: Ny version (Rekommenderat)**

När du vill lägga till nya frågor:

1. **Öka versionen** i `SURVEY_CONFIG`:
```javascript
const SURVEY_CONFIG = {
  version: 2, // Öka från 1 till 2
  questions: {
    // Befintliga frågor...
    gender: { /* ... */ },
    age: { /* ... */ },
    zodiac: { /* ... */ },
    
    // Nya frågor
    favorite_color: {
      type: 'select',
      label: 'Favoritfärg:',
      required: true,
      options: [
        { value: 'röd', label: 'Röd' },
        { value: 'blå', label: 'Blå' },
        { value: 'grön', label: 'Grön' }
      ]
    }
  }
}
```

2. **Fördelar:**
   - Gamla svar påverkas inte
   - Du kan jämföra data mellan versioner
   - Enkel att återställa om något går fel

### **Strategi 2: Lägg till fråga i samma version**

Om du vill lägga till en fråga som är valfri:

```javascript
const SURVEY_CONFIG = {
  version: 1,
  questions: {
    // Befintliga frågor...
    gender: { /* ... */ },
    age: { /* ... */ },
    zodiac: { /* ... */ },
    
    // Ny valfri fråga
    comments: {
      type: 'text',
      label: 'Kommentarer (valfritt):',
      required: false, // Viktigt: sätt till false
      placeholder: 'Skriv dina kommentarer här...'
    }
  }
}
```

## 🔧 Tekniska detaljer

### **JSON-struktur i databasen:**
```json
{
  "version": 1,
  "responses": {
    "gender": "man",
    "age": "25",
    "zodiac": "lejonet"
  },
  "submitted_at": "2024-01-15T10:30:00Z"
}
```

### **Fördelar med denna struktur:**
- ✅ **Ingen databasändring** behövs
- ✅ **Befintliga data** påverkas inte
- ✅ **Flexibel** - kan lägga till valfri typ av fråga
- ✅ **Versionerad** - kan spåra ändringar
- ✅ **Säker** - inga risker för dataförlust

## 📊 Exempel: Lägg till en ny fråga

### **Steg 1: Uppdatera konfiguration**
```javascript
// Lägg till i SURVEY_CONFIG.questions
favorite_music: {
  type: 'select',
  label: 'Favorit musikgenre:',
  required: true,
  options: [
    { value: 'pop', label: 'Pop' },
    { value: 'rock', label: 'Rock' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'klassisk', label: 'Klassisk' }
  ]
}
```

### **Steg 2: Testa lokalt**
1. Starta utvecklingsservern: `npm run dev`
2. Testa den nya frågan
3. Kontrollera att data sparas korrekt

### **Steg 3: Deploy**
1. Pusha koden till GitHub
2. Vercel deployar automatiskt
3. Den nya frågan är nu live!

## ⚠️ Viktiga överväganden

### **Vad du INTE ska göra:**
- ❌ Ändra befintliga frågor som redan har svar
- ❌ Ta bort frågor som redan används
- ❌ Ändra datatyper för befintliga frågor

### **Vad du KAN göra säkert:**
- ✅ Lägga till nya frågor
- ✅ Ändra versionen
- ✅ Lägga till valfria frågor
- ✅ Ändra text/labels (men inte strukturen)

## 🎯 Bästa praxis

1. **Testa alltid lokalt** innan du deployar
2. **Använd versionering** för större ändringar
3. **Dokumentera ändringar** i koden
4. **Backup data** innan större ändringar
5. **Deploy under låg trafik** om möjligt

## 📈 Analys av data

### **För att analysera data per version:**
```sql
-- Se antal svar per version
SELECT version, COUNT(*) as responses
FROM survey_responses_flexible
GROUP BY version
ORDER BY version;

-- Se data för specifik version
SELECT responses
FROM survey_responses_flexible
WHERE version = 1;
```

Denna struktur ger dig maximal flexibilitet utan risk för dataförlust! 🚀 