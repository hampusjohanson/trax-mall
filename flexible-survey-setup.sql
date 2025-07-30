-- Skapa flexibel tabell för enkätsvar (kan hantera framtida ändringar)
CREATE TABLE IF NOT EXISTS survey_responses_flexible (
    id SERIAL PRIMARY KEY,
    version INTEGER NOT NULL DEFAULT 1,
    responses JSONB NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skapa RLS (Row Level Security) policies
ALTER TABLE survey_responses_flexible ENABLE ROW LEVEL SECURITY;

-- Tillåt alla att lägga till svar (INSERT)
CREATE POLICY "Allow public insert flexible" ON survey_responses_flexible
    FOR INSERT WITH CHECK (true);

-- Tillåt alla att läsa antal svar (för statistik)
CREATE POLICY "Allow public select count flexible" ON survey_responses_flexible
    FOR SELECT USING (true);

-- Skapa index för bättre prestanda
CREATE INDEX IF NOT EXISTS idx_survey_responses_flexible_version ON survey_responses_flexible(version);
CREATE INDEX IF NOT EXISTS idx_survey_responses_flexible_submitted_at ON survey_responses_flexible(submitted_at);

-- Kommentar: Denna struktur tillåter att lägga till nya frågor utan att ändra databasen
-- Alla svar sparas som JSON i 'responses' kolumnen
-- 'version' fältet hjälper till att spåra vilken enkätversion som användes 