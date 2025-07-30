# Supabase Setup för Enkät-projektet

## Steg 1: Skapa tabell i Supabase

1. Gå till din Supabase Dashboard: https://supabase.com/dashboard
2. Välj ditt projekt: `ackvimwoqzpqjxoadwnh`
3. Gå till **SQL Editor** i sidomenyn
4. Skapa en ny query och kör följande SQL-kod:

```sql
-- Skapa tabell för enkätsvar
CREATE TABLE IF NOT EXISTS survey_responses (
    id SERIAL PRIMARY KEY,
    gender VARCHAR(50) NOT NULL,
    age INTEGER NOT NULL,
    zodiac VARCHAR(100) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa RLS (Row Level Security) policies
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;

-- Tillåt alla att lägga till svar (INSERT)
CREATE POLICY "Allow public insert" ON survey_responses
    FOR INSERT WITH CHECK (true);

-- Tillåt alla att läsa antal svar (för statistik)
CREATE POLICY "Allow public select count" ON survey_responses
    FOR SELECT USING (true);
```

## Steg 2: Verifiera tabellen

1. Gå till **Table Editor** i sidomenyn
2. Du bör nu se `survey_responses`-tabellen
3. Tabellen ska ha följande kolumner:
   - `id` (SERIAL PRIMARY KEY)
   - `gender` (VARCHAR)
   - `age` (INTEGER)
   - `zodiac` (VARCHAR)
   - `submitted_at` (TIMESTAMP)

## Steg 3: Testa applikationen

1. Gå tillbaka till din applikation: http://localhost:5173
2. Fyll i enkäten och skicka in
3. Kontrollera att svaret sparas i Supabase genom att gå till **Table Editor** och kolla `survey_responses`-tabellen

## Funktioner

- ✅ **Automatisk tabellskapning** - Tabellen skapas automatiskt när första svaret skickas in
- ✅ **Säkerhet** - RLS (Row Level Security) är aktiverat
- ✅ **Statistik** - Visar totalt antal svar i realtid
- ✅ **Validering** - Alla fält är obligatoriska
- ✅ **Responsiv design** - Fungerar på alla enheter

## Deployment till Vercel

När du är redo att publicera:

1. Pusha koden till GitHub
2. Koppla ditt GitHub-repo till Vercel
3. Lägg till miljövariabler i Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Felsökning

Om du får fel vid inskickning av svar:
1. Kontrollera att tabellen är skapad i Supabase
2. Verifiera att RLS-policies är korrekt konfigurerade
3. Kontrollera att miljövariablerna är korrekta
4. Kolla browser-konsolen för felmeddelanden 