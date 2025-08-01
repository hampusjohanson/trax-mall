# 🎯 Trax Mall Version 2 - Projekt Sammanfattning

## ✅ **Vad vi har åstadkommit:**

### 1. **Standardiserade Variabelnamn**
- **Gamla namn:** `awareness_v2_mcdonalds`, `gender`, `image_statements_0_max`
- **Nya namn:** `C1_1`, `A2`, `D1_1_1`
- **Format:** A1-A10 (demografi), B1-B5 (beteende), C1-C2 (medvetenhet), D1 (image), E1 (viktighet), F1-F18 (säkerhet)

### 2. **Numeriska Värden**
- **Kategoriska:** "kvinna" → `2`, "man" → `1`
- **Boolean:** `true` → `1`, `false` → `0`
- **Tomma värden:** `""` → `""` (behålls som tomma)

### 3. **Komplett Datastruktur**
- **140 variabler** totalt
- **Alla möjliga frågor** inkluderade (även dolda)
- **Metadata** för randomisering

## 📁 **Viktiga Filer:**

### **`spss-syntax.sps`** ⭐
```spss
VARIABLE LABELS
A2 "Kön"
A3 "Ålder"
...

VALUE LABELS
A2
1 "Man"
2 "Kvinna"
...
```

### **`src/App.jsx`** (Huvudändringar)
- **`handleSubmit` funktion:** Standardiserar data innan Supabase
- **`variableMapping`:** Mappar gamla namn till nya
- **`convertToNumeric`:** Konverterar värden till numeriska

### **`variable-mapping.js`**
```javascript
{
  "gender": "A2",
  "awareness_v2_mcdonalds": "C1_1",
  "image_statements_0_max": "D1_1_1"
}
```

## 🔄 **Dataflöde:**

1. **Användare svarar** → React state (`formData`)
2. **`handleSubmit`** → Standardiserar namn och värden
3. **Supabase** → Sparar med A1, A2, etc.
4. **CSV Export** → Redan redo för SPSS
5. **SPSS** → Kör `spss-syntax.sps` för labels

## 📊 **Exempel på Exporterad Data:**
```csv
id,responses,created_at
14,"{""A1"":"""",""A2"":1,""A3"":"""",""C1_1"":"""",""D1_1_1"":0}",2025-07-31
```

## 🚀 **Nästa Steg på PC:**

1. **Klona från GitHub:**
   ```bash
   git clone https://github.com/hampusjohanson/trax-mall.git
   ```

2. **Exportera från Supabase:**
   - Gå till Table Editor
   - Välj `survey_responses_flexible`
   - Klicka "Export" → CSV

3. **Importera i SPSS:**
   - File → Open → Data
   - Välj CSV-filen
   - Kör `spss-syntax.sps`

## 🎯 **Resultat:**
- ✅ **138 standardiserade variabler**
- ✅ **Numeriska värden**
- ✅ **SPSS-klar syntax**
- ✅ **Komplett datastruktur**
- ✅ **Metadata för randomisering**

## 📝 **Viktiga Noter:**
- Alla variabler finns för alla respondenter
- Tomma värden = `""`
- Boolean = `0` eller `1`
- Kategoriska = `1`, `2`, `3`, etc.

---
**Skapad:** 31 juli 2025  
**Status:** ✅ Klar för analys 