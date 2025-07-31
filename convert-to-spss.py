#!/usr/bin/env python3
"""
Konvertera Trax-mall data från JSON till SPSS-format
Med standardiserade variabelnamn (A1, A2, etc.)
"""

import pandas as pd
import json
import sys

# Variabelmappning från JSON-namn till SPSS-namn
VARIABLE_MAPPING = {
    # Grundläggande demografi
    'age': 'A1',
    'gender': 'A2',
    'household_size': 'A3',
    'children': 'A4',
    'children_ages_0': 'A5_1',
    'children_ages_1': 'A5_2',
    'children_ages_2': 'A5_3',
    'children_ages_3': 'A5_4',
    'children_ages_inget': 'A5_5',
    'location': 'A6',
    'income': 'A7',
    'life_situation': 'A8',
    'education': 'A9',
    'employment': 'A10',
    
    # Köpbeteende
    'last_purchase': 'B1',
    'main_provider': 'B2',
    
    # Current customers
    'current_customers_mcdonalds': 'B3_1',
    'current_customers_burger_king': 'B3_2',
    'current_customers_max': 'B3_3',
    'current_customers_sibylla': 'B3_4',
    'current_customers_bastard_burgers': 'B3_5',
    'current_customers_prime_burger': 'B3_6',
    'current_customers_inget': 'B3_7',
    
    # Purchase frequency
    'purchase_frequency_mcdonalds': 'B4_1',
    'purchase_frequency_burger_king': 'B4_2',
    'purchase_frequency_max': 'B4_3',
    'purchase_frequency_sibylla': 'B4_4',
    'purchase_frequency_bastard_burgers': 'B4_5',
    'purchase_frequency_prime_burger': 'B4_6',
    
    # Share of market
    'share_of_market_mcdonalds': 'B5_1',
    'share_of_market_burger_king': 'B5_2',
    'share_of_market_max': 'B5_3',
    'share_of_market_sibylla': 'B5_4',
    'share_of_market_bastard_burgers': 'B5_5',
    'share_of_market_prime_burger': 'B5_6',
    
    # Awareness
    'awareness_v2_mcdonalds': 'C1_1',
    'awareness_v2_burger_king': 'C1_2',
    'awareness_v2_max': 'C1_3',
    'awareness_v2_sibylla': 'C1_4',
    'awareness_v2_bastard_burgers': 'C1_5',
    'awareness_v2_prime_burger': 'C1_6',
    
    # Strength scale
    'strength_scale_mcdonalds': 'C2_1',
    'strength_scale_burger_king': 'C2_2',
    'strength_scale_max': 'C2_3',
    'strength_scale_sibylla': 'C2_4',
    'strength_scale_bastard_burgers': 'C2_5',
    'strength_scale_prime_burger': 'C2_6',
    
    # Image statements
    'image_statements_0_mcdonalds': 'D1_1_1',
    'image_statements_0_burger_king': 'D1_1_2',
    'image_statements_0_max': 'D1_1_3',
    'image_statements_0_sibylla': 'D1_1_4',
    'image_statements_0_bastard_burgers': 'D1_1_5',
    'image_statements_0_prime_burger': 'D1_1_6',
    'image_statements_0_ingen': 'D1_1_7',
    
    'image_statements_1_mcdonalds': 'D1_2_1',
    'image_statements_1_burger_king': 'D1_2_2',
    'image_statements_1_max': 'D1_2_3',
    'image_statements_1_sibylla': 'D1_2_4',
    'image_statements_1_bastard_burgers': 'D1_2_5',
    'image_statements_1_prime_burger': 'D1_2_6',
    'image_statements_1_ingen': 'D1_2_7',
    
    'image_statements_2_mcdonalds': 'D1_3_1',
    'image_statements_2_burger_king': 'D1_3_2',
    'image_statements_2_max': 'D1_3_3',
    'image_statements_2_sibylla': 'D1_3_4',
    'image_statements_2_bastard_burgers': 'D1_3_5',
    'image_statements_2_prime_burger': 'D1_3_6',
    'image_statements_2_ingen': 'D1_3_7',
    
    'image_statements_3_mcdonalds': 'D1_4_1',
    'image_statements_3_burger_king': 'D1_4_2',
    'image_statements_3_max': 'D1_4_3',
    'image_statements_3_sibylla': 'D1_4_4',
    'image_statements_3_bastard_burgers': 'D1_4_5',
    'image_statements_3_prime_burger': 'D1_4_6',
    'image_statements_3_ingen': 'D1_4_7',
    
    'image_statements_4_mcdonalds': 'D1_5_1',
    'image_statements_4_burger_king': 'D1_5_2',
    'image_statements_4_max': 'D1_5_3',
    'image_statements_4_sibylla': 'D1_5_4',
    'image_statements_4_bastard_burgers': 'D1_5_5',
    'image_statements_4_prime_burger': 'D1_5_6',
    'image_statements_4_ingen': 'D1_5_7',
    
    'image_statements_5_mcdonalds': 'D1_6_1',
    'image_statements_5_burger_king': 'D1_6_2',
    'image_statements_5_max': 'D1_6_3',
    'image_statements_5_sibylla': 'D1_6_4',
    'image_statements_5_bastard_burgers': 'D1_6_5',
    'image_statements_5_prime_burger': 'D1_6_6',
    'image_statements_5_ingen': 'D1_6_7',
    
    'image_statements_6_mcdonalds': 'D1_7_1',
    'image_statements_6_burger_king': 'D1_7_2',
    'image_statements_6_max': 'D1_7_3',
    'image_statements_6_sibylla': 'D1_7_4',
    'image_statements_6_bastard_burgers': 'D1_7_5',
    'image_statements_6_prime_burger': 'D1_7_6',
    'image_statements_6_ingen': 'D1_7_7',
    
    'image_statements_7_mcdonalds': 'D1_8_1',
    'image_statements_7_burger_king': 'D1_8_2',
    'image_statements_7_max': 'D1_8_3',
    'image_statements_7_sibylla': 'D1_8_4',
    'image_statements_7_bastard_burgers': 'D1_8_5',
    'image_statements_7_prime_burger': 'D1_8_6',
    'image_statements_7_ingen': 'D1_8_7',
    
    'image_statements_8_mcdonalds': 'D1_9_1',
    'image_statements_8_burger_king': 'D1_9_2',
    'image_statements_8_max': 'D1_9_3',
    'image_statements_8_sibylla': 'D1_9_4',
    'image_statements_8_bastard_burgers': 'D1_9_5',
    'image_statements_8_prime_burger': 'D1_9_6',
    'image_statements_8_ingen': 'D1_9_7',
    
    'image_statements_9_mcdonalds': 'D1_10_1',
    'image_statements_9_burger_king': 'D1_10_2',
    'image_statements_9_max': 'D1_10_3',
    'image_statements_9_sibylla': 'D1_10_4',
    'image_statements_9_bastard_burgers': 'D1_10_5',
    'image_statements_9_prime_burger': 'D1_10_6',
    'image_statements_9_ingen': 'D1_10_7',
    
    # Importance attributes
    'importance_attributes_0': 'E1_1',
    'importance_attributes_1': 'E1_2',
    'importance_attributes_2': 'E1_3',
    'importance_attributes_3': 'E1_4',
    'importance_attributes_4': 'E1_5',
    'importance_attributes_inget': 'E1_6',
    
    # Security questions
    'security_questions_0': 'F1',
    'security_questions_1': 'F2',
    'security_questions_2': 'F3',
    'security_questions_3': 'F4',
    'security_questions_4': 'F5',
    'security_questions_5': 'F6',
    'security_questions_6': 'F7',
    'security_questions_7': 'F8',
    'security_questions_8': 'F9',
    'security_questions_9': 'F10',
    'security_questions_10': 'F11',
    'security_questions_11': 'F12',
    'security_questions_12': 'F13',
    'security_questions_13': 'F14',
    'security_questions_14': 'F15',
    'security_questions_15': 'F16',
    'security_questions_16': 'F17',
    'security_questions_17': 'F18',
    'security_questions_18': 'F19',
    'security_questions_19': 'F20'
}

def convert_json_to_spss_format(input_file, output_file):
    """
    Konvertera JSON-data från Supabase till SPSS-format
    """
    print(f"Läser data från: {input_file}")
    
    # Läs CSV-filen
    df = pd.read_csv(input_file)
    
    print(f"Hittade {len(df)} rader data")
    
    # Flattena JSON-kolumnen
    responses_df = df['responses'].apply(json.loads).apply(pd.Series)
    
    # Kombinera med huvuddata
    final_df = pd.concat([df.drop('responses', axis=1), responses_df], axis=1)
    
    print(f"Antal kolumner efter flattening: {len(final_df.columns)}")
    
    # Skapa mappning för kolumnnamn
    column_mapping = {}
    for old_name in final_df.columns:
        if old_name in VARIABLE_MAPPING:
            column_mapping[old_name] = VARIABLE_MAPPING[old_name]
        else:
            # Behåll ursprungliga namn för metadata
            column_mapping[old_name] = old_name
    
    # Byt namn på kolumnerna
    final_df = final_df.rename(columns=column_mapping)
    
    # Sortera kolumnerna för att få logisk ordning
    spss_columns = []
    
    # Lägg till metadata först
    metadata_cols = ['id', 'version', 'submitted_at', 'survey_version', 
                    'brands_order', 'statements_order', 'importance_options_order', 
                    'security_questions_used']
    spss_columns.extend([col for col in metadata_cols if col in final_df.columns])
    
    # Lägg till variabler i logisk ordning
    for i in range(1, 11):  # A1-A10
        if f'A{i}' in final_df.columns:
            spss_columns.append(f'A{i}')
    
    # Lägg till A5_1-A5_5
    for i in range(1, 6):
        if f'A5_{i}' in final_df.columns:
            spss_columns.append(f'A5_{i}')
    
    # Lägg till B-variabler
    for i in range(1, 6):  # B1-B5
        if f'B{i}' in final_df.columns:
            spss_columns.append(f'B{i}')
    
    # Lägg till B3_1-B3_7
    for i in range(1, 8):
        if f'B3_{i}' in final_df.columns:
            spss_columns.append(f'B3_{i}')
    
    # Lägg till B4_1-B4_6
    for i in range(1, 7):
        if f'B4_{i}' in final_df.columns:
            spss_columns.append(f'B4_{i}')
    
    # Lägg till B5_1-B5_6
    for i in range(1, 7):
        if f'B5_{i}' in final_df.columns:
            spss_columns.append(f'B5_{i}')
    
    # Lägg till C-variabler
    for i in range(1, 7):  # C1_1-C1_6
        if f'C1_{i}' in final_df.columns:
            spss_columns.append(f'C1_{i}')
    
    for i in range(1, 7):  # C2_1-C2_6
        if f'C2_{i}' in final_df.columns:
            spss_columns.append(f'C2_{i}')
    
    # Lägg till D-variabler (statements)
    for statement in range(1, 11):
        for brand in range(1, 8):
            if f'D1_{statement}_{brand}' in final_df.columns:
                spss_columns.append(f'D1_{statement}_{brand}')
    
    # Lägg till E-variabler
    for i in range(1, 7):
        if f'E1_{i}' in final_df.columns:
            spss_columns.append(f'E1_{i}')
    
    # Lägg till F-variabler (security)
    for i in range(1, 21):
        if f'F{i}' in final_df.columns:
            spss_columns.append(f'F{i}')
    
    # Lägg till eventuella återstående kolumner
    remaining_cols = [col for col in final_df.columns if col not in spss_columns]
    spss_columns.extend(remaining_cols)
    
    # Sortera dataframen
    final_df = final_df[spss_columns]
    
    # Spara som CSV
    final_df.to_csv(output_file, index=False)
    
    print(f"Konverterad data sparad till: {output_file}")
    print(f"Antal kolumner: {len(final_df.columns)}")
    print(f"Antal rader: {len(final_df)}")
    
    # Visa första raden som exempel
    print("\nFörsta raden som exempel:")
    print(final_df.iloc[0].head(10).to_dict())
    
    return final_df

def generate_spss_syntax():
    """
    Generera SPSS-syntax för variabel- och värdeetiketter
    """
    syntax = """* SPSS Syntax för Trax-mall enkät
* Genererad automatiskt

* Variable Labels
VARIABLE LABELS
A1 "Ålder"
A2 "Kön"
A3 "Hushållsstorlek"
A4 "Barn i hushållet"
A5_1 "Barn åldrar - Inga barn"
A5_2 "Barn åldrar - Under 6 år"
A5_3 "Barn åldrar - 6-12 år"
A5_4 "Barn åldrar - 13-17 år"
A5_5 "Barn åldrar - Inget av dessa"
A6 "Bostadsort"
A7 "Inkomst"
A8 "Livssituation"
A9 "Utbildning"
A10 "Sysselsättning"
B1 "Senaste köp av hamburgare"
B2 "Huvudsaklig hamburgerkedja"
B3_1 "Kund hos - McDonald's"
B3_2 "Kund hos - Burger King"
B3_3 "Kund hos - MAX"
B3_4 "Kund hos - Sibylla"
B3_5 "Kund hos - Bastard Burgers"
B3_6 "Kund hos - Prime Burger"
B3_7 "Kund hos - Inget av dessa"
B4_1 "Köpfrekvens - McDonald's"
B4_2 "Köpfrekvens - Burger King"
B4_3 "Köpfrekvens - MAX"
B4_4 "Köpfrekvens - Sibylla"
B4_5 "Köpfrekvens - Bastard Burgers"
B4_6 "Köpfrekvens - Prime Burger"
B5_1 "Marknadsandel - McDonald's (%)"
B5_2 "Marknadsandel - Burger King (%)"
B5_3 "Marknadsandel - MAX (%)"
B5_4 "Marknadsandel - Sibylla (%)"
B5_5 "Marknadsandel - Bastard Burgers (%)"
B5_6 "Marknadsandel - Prime Burger (%)"
C1_1 "Awareness - McDonald's"
C1_2 "Awareness - Burger King"
C1_3 "Awareness - MAX"
C1_4 "Awareness - Sibylla"
C1_5 "Awareness - Bastard Burgers"
C1_6 "Awareness - Prime Burger"
C2_1 "Consideration - McDonald's"
C2_2 "Consideration - Burger King"
C2_3 "Consideration - MAX"
C2_4 "Consideration - Sibylla"
C2_5 "Consideration - Bastard Burgers"
C2_6 "Consideration - Prime Burger"
"""

    # Lägg till statements
    for i in range(1, 11):
        syntax += f'D1_{i}_1 "Statement {i} - McDonald\'s"\n'
        syntax += f'D1_{i}_2 "Statement {i} - Burger King"\n'
        syntax += f'D1_{i}_3 "Statement {i} - MAX"\n'
        syntax += f'D1_{i}_4 "Statement {i} - Sibylla"\n'
        syntax += f'D1_{i}_5 "Statement {i} - Bastard Burgers"\n'
        syntax += f'D1_{i}_6 "Statement {i} - Prime Burger"\n'
        syntax += f'D1_{i}_7 "Statement {i} - Ingen av dessa"\n'

    # Lägg till importance
    importance_labels = [
        'Prisvärt',
        'Enkelt att vara kund',
        'Tillgängligt - finns nära mig',
        'Detta varumärke lägger man ofta märke till',
        'Att vara kund här känns nästan som att vara en del av en gemenskap'
    ]
    
    for i, label in enumerate(importance_labels, 1):
        syntax += f'E1_{i} "Viktig faktor - {label}"\n'
    syntax += 'E1_6 "Viktig faktor - Inget av dessa"\n'

    # Lägg till security
    for i in range(1, 21):
        syntax += f'F{i} "Säkerhetsfråga {i}"\n'

    syntax += """.

* Value Labels
VALUE LABELS
A2
1 "Man"
2 "Kvinna"
3 "Annat"
4 "Vill ej säga"
.

A3
1 "1 person"
2 "2 personer"
3 "3 personer"
4 "4 personer"
5 "5 personer"
6 "Fler än 5 personer"
.

A4
1 "Ja"
2 "Nej"
.

A6
1 "Stockholm"
2 "Malmö"
3 "Göteborg"
4 "Annan stad med över 90 000 invånare"
5 "Stad med 50 000 – 90 000 invånare"
6 "Stad med 10 000 – 50 000 invånare"
7 "Landsbygd/Samhälle med färre än 10 000 invånare"
.

A7
1 "0–10 000 kr"
2 "10 001–20 000 kr"
3 "20 001–30 000 kr"
4 "30 001–40 000 kr"
5 "40 001–50 000 kr"
6 "50 001–60 000 kr"
7 "60 001–70 000 kr"
8 "70 001–80 000 kr"
9 "80 001–90 000 kr"
10 "90 001–100 000 kr"
11 "Mer än 100 000 kr"
12 "Vet ej/Vill ej uppge"
.

A8
1 "Singel"
2 "Pojkvän/flickvän"
3 "Sambo/gift utan barn"
4 "Ensamstående med barn"
5 "Sambo/gift med små barn"
6 "Sambo/gift med tonårsbarn"
7 "Sambo/gift med utflyttade barn"
8 "Frånskild"
9 "Änka/Änkeman"
10 "Annat"
.

A9
1 "Grundskola"
2 "Gymnasieskola"
3 "Universitet eller högskola"
.

A10
1 "Egenföretagare"
2 "Anställd"
3 "Studerande"
4 "Pensionär"
5 "Arbetslös"
.

B1
1 "Mindre än 1 månad sedan"
2 "1-6 månader sedan"
3 "6 månader-1 år sedan"
4 "Mer än 1 år sedan"
5 "Aldrig"
.

B2
1 "McDonald's"
2 "Burger King"
3 "MAX"
4 "Sibylla"
5 "Bastard Burgers"
6 "Prime Burger"
7 "Inget av dessa"
.

B4_1 TO B4_6
1 "Dagligen"
2 "Flera gånger per vecka"
3 "Varje vecka"
4 "Varannan vecka"
5 "Varje månad"
6 "Varannan månad"
7 "1 gång per kvartal"
8 "1 gång per halvår"
9 "1 gång per år"
10 "Mer sällan/aldrig"
.

C1_1 TO C1_6
1 "Har inte hört talas om"
2 "Hört talas om, men vet inget om vad det har att erbjuda"
3 "Hört talas om och vet vad det har att erbjuda"
.

C2_1 TO C2_6
1 "Instämmer inte alls"
2 "2"
3 "3"
4 "4"
5 "5"
6 "6"
7 "Instämmer helt och hållet"
.

* Boolean variabler (0=Nej, 1=Ja)
B3_1 TO B3_7
D1_1_1 TO D1_10_7
E1_1 TO E1_6
0 "Nej"
1 "Ja"
.

EXECUTE.
"""

    return syntax

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Användning: python convert-to-spss.py input.csv output.csv")
        print("Exempel: python convert-to-spss.py survey_responses_flexible.csv spss_ready_data.csv")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    # Konvertera data
    df = convert_json_to_spss_format(input_file, output_file)
    
    # Generera SPSS-syntax
    syntax = generate_spss_syntax()
    
    # Spara syntax till fil
    syntax_file = output_file.replace('.csv', '_syntax.sps')
    with open(syntax_file, 'w', encoding='utf-8') as f:
        f.write(syntax)
    
    print(f"\nSPSS-syntax sparad till: {syntax_file}")
    print("\nAnvändning:")
    print(f"1. Importera {output_file} i SPSS")
    print(f"2. Kör syntax från {syntax_file}")
    print("3. Nu har du standardiserade variabelnamn och etiketter!") 