// Test-script för att verifiera Supabase-setup
// Kör detta i browser-konsolen för att testa anslutningen

console.log('🧪 Testar Supabase-setup...');

// Test 1: Kontrollera miljövariabler
console.log('📋 Miljövariabler:');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? '✅ Satt' : '❌ Saknas');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Satt' : '❌ Saknas');

// Test 2: Testa Supabase-anslutning
async function testSupabaseConnection() {
  try {
    const { createClient } = await import('@supabase/supabase-js');
    
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.log('❌ Supabase-credentials saknas!');
      console.log('📝 Skapa en .env fil med:');
      console.log('VITE_SUPABASE_URL=din_supabase_url');
      console.log('VITE_SUPABASE_ANON_KEY=din_supabase_anon_key');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Testa att läsa från tabellen
    const { data, error } = await supabase
      .from('survey_responses_flexible')
      .select('id', { count: 'exact' });
    
    if (error) {
      console.log('❌ Supabase-anslutning misslyckades:', error.message);
      console.log('💡 Kontrollera att:');
      console.log('   1. Tabellen "survey_responses_flexible" är skapad');
      console.log('   2. RLS-policies är konfigurerade');
      console.log('   3. Credentials är korrekta');
    } else {
      console.log('✅ Supabase-anslutning fungerar!');
      console.log('📊 Antal befintliga svar:', data?.length || 0);
    }
    
  } catch (err) {
    console.log('❌ Fel vid test av Supabase:', err.message);
  }
}

// Test 3: Visa förväntad datastruktur
console.log('📊 Förväntad datastruktur för export:');
console.log(`
{
  "id": 1,
  "version": 1,
  "responses": {
    // Alla möjliga frågor, även de som inte visades
    "age": "25",
    "gender": "man",
    "awareness_v2_mcdonalds": "Har inte hört talas om",
    "awareness_v2_burger_king": "Hört talas om, men vet inget om vad det har att erbjuda",
    "awareness_v2_max": "",
    "awareness_v2_sibylla": "",
    "awareness_v2_bastard_burgers": "",
    "awareness_v2_prime_burger": "",
    "image_statements_0_mcdonalds": false,
    "image_statements_0_burger_king": true,
    "image_statements_0_max": false,
    // ... alla andra möjliga kombinationer
    "purchase_frequency_mcdonalds": "Varje vecka",
    "purchase_frequency_burger_king": "",
    // ... alla brands
    "share_of_market_mcdonalds": "60",
    "share_of_market_burger_king": "40",
    // ... alla brands
    "strength_scale_mcdonalds": "5",
    "strength_scale_burger_king": "",
    // ... alla brands
    "importance_attributes_0": true,
    "importance_attributes_1": false,
    // ... alla options
    "security_questions_0": "12",
    "security_questions_1": "Grön",
    // ... alla 20 säkerhetsfrågor
    "children_ages_0": false,
    "children_ages_1": true,
    // ... alla options
  },
  "submitted_at": "2024-01-15T10:30:00.000Z",
  "survey_version": 1,
  "brands_order": ["mcdonalds", "burger_king", "max", "sibylla", "bastard_burgers", "prime_burger"],
  "statements_order": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  "importance_options_order": [0, 1, 2, 3, 4],
  "security_questions_used": [5, 12, 18]
}
`);

// Kör testerna
testSupabaseConnection();

console.log('🎯 Nästa steg:');
console.log('1. Skapa .env fil med Supabase-credentials');
console.log('2. Kör SQL-scriptet i Supabase för att skapa tabellen');
console.log('3. Testa applikationen genom att fylla i enkäten');
console.log('4. Exportera data från Supabase för att verifiera strukturen'); 