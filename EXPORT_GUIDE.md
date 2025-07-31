# Guide för Export av Enkätdata från Supabase

## Förväntad Datastruktur

När du exporterar från Supabase kommer du att få en CSV-fil med följande struktur:

### Huvudkolumner:
- `id` - Unikt ID för varje svar
- `version` - Version av enkätkonfigurationen (alltid 1 för nu)
- `responses` - JSON-sträng med alla svar
- `submitted_at` - Tidpunkt när svaret skickades in
- `survey_version` - Version av enkätkonfigurationen
- `brands_order` - JSON-array med ordningen brands visades
- `statements_order` - JSON-array med ordningen statements visades
- `importance_options_order` - JSON-array med ordningen importance options visades
- `security_questions_used` - JSON-array med vilka säkerhetsfrågor som användes

### JSON-struktur i `responses`-kolumnen:

```json
{
  "age": "25",
  "gender": "man",
  "household_size": "2",
  "children": "nej",
  "children_ages_0": false,
  "children_ages_1": false,
  "children_ages_2": false,
  "children_ages_3": false,
  "location": "stockholm",
  "income": "30001_40000",
  "life_situation": "sambo_gift_utan_barn",
  "education": "universitet_högskola",
  "employment": "anställd",
  "last_purchase": "mindre_än_1_månad",
  "current_customers_mcdonalds": true,
  "current_customers_burger_king": false,
  "current_customers_max": false,
  "current_customers_sibylla": false,
  "current_customers_bastard_burgers": false,
  "current_customers_prime_burger": false,
  "current_customers_inget": false,
  "main_provider": "mcdonalds",
  "purchase_frequency_mcdonalds": "Varje vecka",
  "purchase_frequency_burger_king": "",
  "purchase_frequency_max": "",
  "purchase_frequency_sibylla": "",
  "purchase_frequency_bastard_burgers": "",
  "purchase_frequency_prime_burger": "",
  "share_of_market_mcdonalds": "60",
  "share_of_market_burger_king": "40",
  "share_of_market_max": "",
  "share_of_market_sibylla": "",
  "share_of_market_bastard_burgers": "",
  "share_of_market_prime_burger": "",
  "importance_attributes_0": true,
  "importance_attributes_1": false,
  "importance_attributes_2": true,
  "importance_attributes_3": false,
  "importance_attributes_4": false,
  "importance_attributes_inget": false,
  "strength_scale_mcdonalds": "5",
  "strength_scale_burger_king": "3",
  "strength_scale_max": "4",
  "strength_scale_sibylla": "2",
  "strength_scale_bastard_burgers": "1",
  "strength_scale_prime_burger": "1",
  "awareness_v2_mcdonalds": "Hört talas om och vet vad det har att erbjuda",
  "awareness_v2_burger_king": "Hört talas om, men vet inget om vad det har att erbjuda",
  "awareness_v2_max": "Har inte hört talas om",
  "awareness_v2_sibylla": "Hört talas om och vet vad det har att erbjuda",
  "awareness_v2_bastard_burgers": "Har inte hört talas om",
  "awareness_v2_prime_burger": "Har inte hört talas om",
  "image_statements_0_mcdonalds": true,
  "image_statements_0_burger_king": false,
  "image_statements_0_max": false,
  "image_statements_0_sibylla": false,
  "image_statements_0_bastard_burgers": false,
  "image_statements_0_prime_burger": false,
  "image_statements_0_ingen": false,
  "image_statements_1_mcdonalds": false,
  "image_statements_1_burger_king": true,
  "image_statements_1_max": false,
  "image_statements_1_sibylla": false,
  "image_statements_1_bastard_burgers": false,
  "image_statements_1_prime_burger": false,
  "image_statements_1_ingen": false,
  "security_questions_0": "12",
  "security_questions_1": "Grön",
  "security_questions_2": "April",
  "security_questions_3": "",
  "security_questions_4": "",
  "security_questions_5": "",
  "security_questions_6": "",
  "security_questions_7": "",
  "security_questions_8": "",
  "security_questions_9": "",
  "security_questions_10": "",
  "security_questions_11": "",
  "security_questions_12": "",
  "security_questions_13": "",
  "security_questions_14": "",
  "security_questions_15": "",
  "security_questions_16": "",
  "security_questions_17": "",
  "security_questions_18": "",
  "security_questions_19": ""
}
```

## Steg för Export

### 1. Från Supabase Dashboard:
1. Gå till **Table Editor**
2. Välj `survey_responses_flexible`-tabellen
3. Klicka på **Export** (CSV-format)
4. Ladda ner filen

### 2. Bearbeta JSON-data:
Eftersom `responses` är en JSON-sträng behöver du "flattena" den för analys:

```python
import pandas as pd
import json

# Läs CSV-filen
df = pd.read_csv('survey_responses_flexible.csv')

# Flattena JSON-kolumnen
responses_df = df['responses'].apply(json.loads).apply(pd.Series)

# Kombinera med huvuddata
final_df = pd.concat([df.drop('responses', axis=1), responses_df], axis=1)

# Spara som ny CSV
final_df.to_csv('flattened_survey_data.csv', index=False)
```

### 3. R-kod för export:
```r
library(jsonlite)
library(dplyr)

# Läs CSV
data <- read.csv("survey_responses_flexible.csv")

# Flattena JSON
responses <- lapply(data$responses, fromJSON)
responses_df <- do.call(rbind, lapply(responses, as.data.frame))

# Kombinera data
final_data <- cbind(data %>% select(-responses), responses_df)

# Spara
write.csv(final_data, "flattened_survey_data.csv", row.names = FALSE)
```

## Fördelar med denna struktur:

1. **Konsistent** - Alla respondenter har samma kolumner
2. **Komplett** - Inga saknade frågor, även om de inte visades
3. **Analysvänlig** - Enkel att importera i SPSS, R, Python, etc.
4. **Framtidssäker** - Kan lägga till nya frågor utan att ändra databasen
5. **Spårbar** - Metadata visar hur enkäten visades för varje respondent

## Exempel på analys:

```sql
-- Antal svar per åldersgrupp
SELECT 
  CASE 
    WHEN (responses->>'age')::int < 25 THEN '18-24'
    WHEN (responses->>'age')::int < 35 THEN '25-34'
    WHEN (responses->>'age')::int < 45 THEN '35-44'
    ELSE '45+'
  END as age_group,
  COUNT(*) as count
FROM survey_responses_flexible
GROUP BY age_group;

-- Awareness per brand
SELECT 
  responses->>'awareness_v2_mcdonalds' as mcdonalds_awareness,
  responses->>'awareness_v2_burger_king' as burger_king_awareness,
  COUNT(*) as count
FROM survey_responses_flexible
GROUP BY mcdonalds_awareness, burger_king_awareness;
``` 