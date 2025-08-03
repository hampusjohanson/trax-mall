import { useState, useEffect } from 'react'
import './App.css'

// Skapa Supabase-klient endast om credentials finns
let supabase = null
try {
  const { createClient } = require('@supabase/supabase-js')
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here') {
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
} catch (error) {
  console.log('Supabase not configured, running in demo mode')
}

// Enkät-konfiguration för hamburgerkedjor
const SURVEY_CONFIG = {
  version: 1,
  title: "Denna enkät handlar om hamburgerkedjor som erbjuder snabbmat för att äta på plats eller ta med.",
  subtitle: "",
  category: "Denna enkät handlar om hamburgerkedjor som erbjuder snabbmat för att äta på plats eller ta med.",
  brands: [
    { id: 'mcdonalds', name: 'McDonald\'s', logo: '/images/mcdonalds.png' },
    { id: 'burger_king', name: 'Burger King', logo: '/images/burger-king.png' },
    { id: 'max', name: 'MAX', logo: '/images/max.png' },
    { id: 'sibylla', name: 'Sibylla', logo: '/images/sibylla.png' },
    { id: 'bastard_burgers', name: 'Bastard Burgers', logo: '/images/bastard-burgers.png' },
    { id: 'prime_burger', name: 'Prime Burger', logo: '/images/prime-burger.png' },
    { id: 'frasses', name: 'Frasses', logo: '/images/frasses.svg' },
    { id: 'shake_shack', name: 'Shake Shack', logo: '/images/shake-shack.svg' },
    { id: 'five_guys', name: 'Five Guys', logo: '/images/five-guys.svg' },
    { id: 'flippin_burgers', name: 'Flippin\' Burgers', logo: '/images/flippin-burgers.png' },
    { id: 'brodernas', name: 'Brödernas', logo: '/images/brodernas.svg' }
    // PLACEHOLDER BRANDS - Lägg till eller ta bort efter behov (kommenterade ut för att inte visa för användare)
    // { id: 'placeholder_1', name: 'Placeholder Brand 1', logo: '/images/placeholder.png' },
    // { id: 'placeholder_2', name: 'Placeholder Brand 2', logo: '/images/placeholder.png' },
    // { id: 'placeholder_3', name: 'Placeholder Brand 3', logo: '/images/placeholder.png' },
    // { id: 'placeholder_4', name: 'Placeholder Brand 4', logo: '/images/placeholder.png' }
  ],
  sections: {
    security: {
      title: "",
      questions: {
        security_questions: {
          type: 'security_check',
          label: 'För att säkerställa att du är en riktig person, svara på följande frågor:',
          required: true,
          questions: [
            {
              question: 'Vad är 5+7?',
              options: ['10', '11', '12', '13'],
              correct: '12'
            },
            {
              question: 'Vilken färg har gräs?',
              options: ['Röd', 'Blå', 'Grön', 'Gul'],
              correct: 'Grön'
            },
            {
              question: 'Vilken månad kommer efter mars?',
              options: ['Februari', 'Maj', 'April', 'Juni'],
              correct: 'April'
            },
            {
              question: 'Hur många ben har en katt?',
              options: ['2', '4', '6', '8'],
              correct: '4'
            },
            {
              question: 'Vilken är Sveriges huvudstad?',
              options: ['Göteborg', 'Malmö', 'Stockholm', 'Uppsala'],
              correct: 'Stockholm'
            },
            {
              question: 'Vad är 3x4?',
              options: ['7', '10', '12', '15'],
              correct: '12'
            },
            {
              question: 'Vilken färg har himlen på en solig dag?',
              options: ['Grön', 'Röd', 'Blå', 'Gul'],
              correct: 'Blå'
            },
            {
              question: 'Hur många dagar har en vecka?',
              options: ['5', '6', '7', '8'],
              correct: '7'
            },
            {
              question: 'Vilken är Sveriges största stad?',
              options: ['Stockholm', 'Göteborg', 'Malmö', 'Uppsala'],
              correct: 'Stockholm'
            },
            {
              question: 'Vad är 10-3?',
              options: ['5', '6', '7', '8'],
              correct: '7'
            },
            {
              question: 'Vilken färg har snö?',
              options: ['Blå', 'Grön', 'Vit', 'Gul'],
              correct: 'Vit'
            },
            {
              question: 'Hur många fingrar har du på en hand?',
              options: ['3', '4', '5', '6'],
              correct: '5'
            },
            {
              question: 'Vilken årstid kommer efter vår?',
              options: ['Vinter', 'Sommar', 'Höst', 'Vår'],
              correct: 'Sommar'
            },
            {
              question: 'Vad är 2+2?',
              options: ['3', '4', '5', '6'],
              correct: '4'
            },

            {
              question: 'Hur många timmar har ett dygn?',
              options: ['12', '18', '24', '30'],
              correct: '24'
            },

            {
              question: 'Vad är 6+3?',
              options: ['7', '8', '9', '10'],
              correct: '9'
            },
            {
              question: 'Vilken färg har blod?',
              options: ['Blå', 'Grön', 'Röd', 'Gul'],
              correct: 'Röd'
            },
            {
              question: 'Hur många månader har ett år?',
              options: ['10', '11', '12', '13'],
              correct: '12'
            }
          ]
        }
      }
    },
    screening: {
      title: "",
      questions: {
        age: {
          type: 'number',
          label: 'Hur gammal är du?',
          required: true,
          min: 16,
          max: 74,
          placeholder: 'Antal år'
        }
      }
    },
    awareness_v2: {
      title: "",
      questions: {
        awareness_v2: {
          type: 'brand_matrix_v2',
          label: 'Hur väl känner du till följande hamburgerkedjor?',
          required: true,
          options: [
            'Har inte hört talas om',
            'Hört talas om, men vet inget om vad det har att erbjuda',
            'Hört talas om och vet vad det har att erbjuda'
          ]
        }
      }
    },
    image: {
      title: "",
      questions: {
        image_statements: {
          type: 'brand_statement_matrix',
          label: 'Nedan listas ett antal påståenden. Ange vilka hamburgerkedjor som du känner att respektive påstående stämmer in på. Försök svara även om du är osäker, det finns inga rätt eller fel. Du kan välja fler än 1 för respektive påstående.',
          required: true,
          statements: [
            'Nästa gång jag väljer hamburgerkedja kommer jag mest sannolikt välja detta',
            'Detta företag skulle jag definitivt kunna rekommendera till vänner och bekanta',
            'Hamburgare från detta företag är värt ett högre pris än de billigaste alternativen',
            'Här är jag kund idag/Detta köper jag oftast/Detta köpte jag senast',
            'Passar mig och mina behov',
            'Detta varumärke lägger man ofta märke till',
            'Prisvärt',
            'Enkelt att vara kund',
            'Tillgängligt - finns nära mig',
            'Att vara kund här känns nästan som att vara en del av en gemenskap',
            'Känns lyhörda för kundens önskningar',
            'Är originalet, har funnits länge'
            // PLACEHOLDER ATTRIBUTES - Lägg till eller ta bort efter behov (kommenterade ut för att inte visa för användare)
            // 'Placeholder Attribute 1',
            // 'Placeholder Attribute 2',
            // 'Placeholder Attribute 3',
            // 'Placeholder Attribute 4',
            // 'Placeholder Attribute 5',
            // 'Placeholder Attribute 6',
            // 'Placeholder Attribute 7',
            // 'Placeholder Attribute 8'
          ]
        }
      }
    },
    statements: {
      title: "",
      questions: {
        image_statements: {
          type: 'brand_statement_matrix',
          label: 'Nedan listas ett antal påståenden. Ange vilka hamburgerkedjor som du känner att respektive påstående stämmer in på. Försök svara även om du är osäker, det finns inga rätt eller fel. Du kan välja fler än 1 för respektive påstående.',
          required: true,
          statements: [
            'Nästa gång jag väljer hamburgerkedja kommer jag mest sannolikt välja detta',
            'Detta företag skulle jag definitivt kunna rekommendera till vänner och bekanta',
            'Hamburgare från detta företag är värt ett högre pris än de billigaste alternativen',
            'Här är jag kund idag/Detta köper jag oftast/Detta köpte jag senast',
            'Passar mig och mina behov',
            'Detta varumärke lägger man ofta märke till',
            'Prisvärt',
            'Enkelt att vara kund',
            'Tillgängligt - finns nära mig',
            'Att vara kund här känns nästan som att vara en del av en gemenskap',
            'Känns lyhörda för kundens önskningar',
            'Är originalet, har funnits länge'
          ]
        }
      }
    },
    behavior: {
      title: "",
      questions: {
        last_purchase: {
          type: 'select',
          label: 'När köpte du/handlade du senast hamburgare från en hamburgerkedja?',
          required: true,
          options: [
            { value: 'mindre_än_1_månad', label: 'Mindre än 1 månad sedan' },
            { value: '1_6_månader', label: '1-6 månader sedan' },
            { value: '6_månader_1_år', label: '6 månader-1 år sedan' },
            { value: 'mer_än_1_år', label: 'Mer än 1 år sedan' },
            { value: 'aldrig', label: 'Aldrig' }
          ]
        },
        current_customers: {
          type: 'brand_multiple',
          label: 'Vilka av följande hamburgerkedjor är du kund hos idag? Du kan välja flera.',
          required: true
        },
        main_provider: {
          type: 'brand_single',
          label: 'Vilken av följande hamburgerkedjor ser du som din huvudsakliga? Du kan bara välja en.',
          required: true
        },
        purchase_frequency: {
          type: 'brand_frequency',
          label: 'Hur ofta köper du hamburgare från följande kedjor?',
          required: true,
          frequency_options: [
            'Dagligen',
            'Flera gånger per vecka',
            'Varje vecka',
            'Varannan vecka',
            'Varje månad',
            'Varannan månad',
            '1 gång per kvartal',
            '1 gång per halvår',
            '1 gång per år',
            'Mer sällan/aldrig'
          ]
        }
      }
    },
    share_of_market: {
      title: "",
      questions: {
        share_of_market: {
          type: 'brand_share',
          label: 'Hur fördelar du normalt dina inköp av hamburgare mellan dessa olika kedjor? Ange procent för varje kedja du köper från minst varje år. Summan ska bli 100%.',
          required: true
        }
      }
    },
    importance: {
      title: "",
      questions: {
        importance_attributes: {
          type: 'multiple_choice',
          label: 'Vilka av följande faktorer är viktiga för dig när du väljer hamburgerkedja? Du kan välja flera alternativ.',
          required: true,
          options: [
            'Prisvärt',
            'Enkelt att vara kund',
            'Tillgängligt - finns nära mig',
            'Detta varumärke lägger man ofta märke till',
            'Att vara kund här känns nästan som att vara en del av en gemenskap',
            'Känns lyhörda för kundens önskningar',
            'Är originalet, har funnits länge'
            // PLACEHOLDER ATTRIBUTES - Lägg till eller ta bort efter behov (kommenterade ut för att inte visa för användare)
            // 'Placeholder Attribute 1',
            // 'Placeholder Attribute 2',
            // 'Placeholder Attribute 3',
            // 'Placeholder Attribute 4',
            // 'Placeholder Attribute 5',
            // 'Placeholder Attribute 6',
            // 'Placeholder Attribute 7',
            // 'Placeholder Attribute 8'
          ]
        }
      }
    },
    consideration: {
      title: "",
      questions: {
        strength_scale: {
          type: 'brand_scale_single',
          label: 'Nästa gång jag väljer hamburgerkedja kan jag tänka mig att välja detta.',
          required: true,
          scale: [
            '1 Instämmer inte alls',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7 Instämmer helt och hållet'
          ]
        }
      }
    },
    open_questions: {
      title: "",
      questions: {
        dynamic_open_questions: {
          type: 'dynamic_open_questions',
          label: '',
          required: true
        }
      }
    },
    background: {
      title: "",
      questions: {

        gender: {
          type: 'select',
          label: 'Kön:',
          required: true,
          options: [
            { value: 'man', label: 'Man' },
            { value: 'kvinna', label: 'Kvinna' },
            { value: 'annat', label: 'Annat' },
            { value: 'vill_ej_säga', label: 'Vill ej säga' }
          ]
        },
        household_size: {
          type: 'select',
          label: 'Hur många personer består ditt hushåll av (inklusive dig själv)?',
          required: true,
          options: [
            { value: '1', label: '1' },
            { value: '2', label: '2' },
            { value: '3', label: '3' },
            { value: '4', label: '4' },
            { value: '5', label: '5' },
            { value: 'fler_än_5', label: 'Fler än 5 personer' }
          ]
        },
        children: {
          type: 'select',
          label: 'Finns det några barn eller ungdomar i ditt hushåll som är 17 år eller yngre?',
          required: true,
          options: [
            { value: 'ja', label: 'Ja' },
            { value: 'nej', label: 'Nej' }
          ]
        },
        children_ages: {
          type: 'multiple_choice',
          label: 'Vilka åldersgrupper av barn har du i ditt hushåll? Flera svar är möjliga.',
          required: false,
          options: [
            'Nej, inga barn',
            'Ja, barn som är under 6 år',
            'Ja, barn som är mellan 6 till 12 år',
            'Ja, barn som är mellan 13 till 17 år'
          ]
        },
        location: {
          type: 'select',
          label: 'Vilket av följande alternativ passar bäst in på var du bor?',
          required: true,
          options: [
            { value: 'stockholm', label: 'Stockholm' },
            { value: 'malmö', label: 'Malmö' },
            { value: 'göteborg', label: 'Göteborg' },
            { value: 'annan_stor_stad', label: 'Annan stad med över 90 000 invånare' },
            { value: 'stad_50_90k', label: 'Stad med 50 000 – 90 000 invånare' },
            { value: 'stad_10_50k', label: 'Stad med 10 000 – 50 000 invånare' },
            { value: 'landsbygd', label: 'Landsbygd/Samhälle med färre än 10 000 invånare' }
          ]
        },
        income: {
          type: 'select',
          label: 'Hur stor är din sammanlagda inkomst per månad före skatt?',
          required: true,
          options: [
            { value: '0_10000', label: '0–10 000 kr' },
            { value: '10001_20000', label: '10 001–20 000 kr' },
            { value: '20001_30000', label: '20 001–30 000 kr' },
            { value: '30001_40000', label: '30 001–40 000 kr' },
            { value: '40001_50000', label: '40 001–50 000 kr' },
            { value: '50001_60000', label: '50 001–60 000 kr' },
            { value: '60001_70000', label: '60 001–70 000 kr' },
            { value: '70001_80000', label: '70 001–80 000 kr' },
            { value: '80001_90000', label: '80 001–90 000 kr' },
            { value: '90001_100000', label: '90 001–100 000 kr' },
            { value: 'mer_än_100000', label: 'Mer än 100 000 kr' },
            { value: 'vet_ej', label: 'Vet ej/Vill ej uppge' }
          ]
        },
        life_situation: {
          type: 'select',
          label: 'Vilket av följande alternativ passar bäst in på din livssituation?',
          required: true,
          options: [
            { value: 'singel', label: 'Singel' },
            { value: 'pojkvän_flickvän', label: 'Pojkvän/flickvän' },
            { value: 'sambo_gift_utan_barn', label: 'Sambo/gift utan barn' },
            { value: 'ensamstående_med_barn', label: 'Ensamstående med barn' },
            { value: 'sambo_gift_med_små_barn', label: 'Sambo/gift med små barn' },
            { value: 'sambo_gift_med_tonårsbarn', label: 'Sambo/gift med tonårsbarn' },
            { value: 'sambo_gift_med_utflyttade_barn', label: 'Sambo/gift med utflyttade barn' },
            { value: 'frånskild', label: 'Frånskild' },
            { value: 'änka_änkeman', label: 'Änka/Änkeman' },
            { value: 'annat', label: 'Annat' }
          ]
        },
        education: {
          type: 'select',
          label: 'Vilken är din senast fullföljda utbildningsnivå?',
          required: true,
          options: [
            { value: 'grundskola', label: 'Grundskola' },
            { value: 'gymnasieskola', label: 'Gymnasieskola' },
            { value: 'universitet_högskola', label: 'Universitet eller högskola' }
          ]
        },
        employment: {
          type: 'select',
          label: 'Vad är din nuvarande sysselsättning?',
          required: true,
          options: [
            { value: 'egenföretagare', label: 'Egenföretagare' },
            { value: 'anställd', label: 'Anställd' },
            { value: 'studerande', label: 'Studerande' },
            { value: 'pensionär', label: 'Pensionär' },
            { value: 'arbetslös', label: 'Arbetslös' }
          ]
        }
      }
    }
  }
}

function App() {
  const [currentSection, setCurrentSection] = useState('screening')
  const [formData, setFormData] = useState({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [randomizedBrands, setRandomizedBrands] = useState([])
  const [randomizedImageBrands, setRandomizedImageBrands] = useState([])
  const [randomizedStatements, setRandomizedStatements] = useState([])
  const [randomizedImportanceOptions, setRandomizedImportanceOptions] = useState([])
  const [randomizedSecurityQuestions, setRandomizedSecurityQuestions] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // 0: security, 1: screening, 2: awareness, 3: statements, 4: behavior, 5: share_of_market, 6: importance, 7: consideration, 8: background
  const [connectionStatus, setConnectionStatus] = useState('')
  const [submissionCount, setSubmissionCount] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState({})
  const [currentSecurityQuestion, setCurrentSecurityQuestion] = useState(0)
  const [currentOpenQuestionIndex, setCurrentOpenQuestionIndex] = useState(0)

  // Definiera sidorna i ordning
  const pages = [
    { key: 'security', title: '' },
    { key: 'screening', title: '' },
    { key: 'awareness_v2', title: '' },
    { key: 'image', title: '' },
    { key: 'behavior', title: '' },
    { key: 'share_of_market', title: '' },
    { key: 'importance', title: '' },
    { key: 'consideration', title: '' },
    { key: 'open_questions', title: '' },
    { key: 'background', title: '' }
  ]

  // Initiera formData baserat på konfiguration och randomisera brands EN gång
  useEffect(() => {
    if (!isInitialized) {
      const initialData = {}
      Object.values(SURVEY_CONFIG.sections).forEach(section => {
        Object.keys(section.questions).forEach(key => {
          initialData[key] = ''
        })
      })
      setFormData(initialData)
      
      // Randomisera ordningen av brands EN gång per respondent (alla 10 varumärken)
      const shuffled = [...SURVEY_CONFIG.brands].sort(() => Math.random() - 0.5)
      setRandomizedBrands(shuffled)
      
      // Skapa en separat lista för image statements (endast de 6 ursprungliga varumärkena)
      const originalBrands = SURVEY_CONFIG.brands.slice(0, 6)
      const shuffledImageBrands = [...originalBrands].sort(() => Math.random() - 0.5)
      setRandomizedImageBrands(shuffledImageBrands)
      
      // Randomisera ordningen av statements EN gång per respondent
      const statements = SURVEY_CONFIG.sections.image.questions.image_statements.statements
      const shuffledStatements = [...statements].sort(() => Math.random() - 0.5)
      setRandomizedStatements(shuffledStatements)
      
      // Randomisera ordningen av importance options EN gång per respondent
      const importanceOptions = SURVEY_CONFIG.sections.importance.questions.importance_attributes.options
      const shuffledImportanceOptions = [...importanceOptions].sort(() => Math.random() - 0.5)
      setRandomizedImportanceOptions(shuffledImportanceOptions)
      
      // Randomisera 3 säkerhetsfrågor EN gång per respondent
      try {
        const securityQuestions = SURVEY_CONFIG.sections.security.questions.security_questions.questions
        const shuffledSecurityQuestions = [...securityQuestions].sort(() => Math.random() - 0.5).slice(0, 3)
        setRandomizedSecurityQuestions(shuffledSecurityQuestions)
      } catch (error) {
        console.error('Error randomizing security questions:', error)
        setRandomizedSecurityQuestions([])
      }
      
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Testa Supabase-anslutning endast om den är konfigurerad
  useEffect(() => {
    if (supabase) {
      const testConnection = async () => {
        try {
          const { data, error } = await supabase
            .from('survey_responses_flexible')
            .select('id', { count: 'exact' })
          
          if (error) {
            setConnectionStatus('Connection failed: ' + error.message)
          } else {
            setConnectionStatus('Connected successfully!')
            setSubmissionCount(data?.length || 0)
          }
        } catch (err) {
          setConnectionStatus('Connection error: ' + err.message)
        }
      }
      
      testConnection()
    } else {
      setConnectionStatus('Demo mode - no database connection')
    }
  }, [])

  // Testa sticky-funktionen
  useEffect(() => {
    const testSticky = () => {
      const frozenInstructions = document.querySelector('.frozen-instructions')
      if (frozenInstructions) {
        const style = window.getComputedStyle(frozenInstructions)
        console.log('Sticky position:', style.position)
        console.log('Sticky top:', style.top)
        console.log('Sticky z-index:', style.zIndex)
      }
    }


    
    // Testa efter en kort fördröjning för att låta DOM laddas
    setTimeout(testSticky, 100)
  }, [currentPage])

  const testSupabaseConnection = async () => {
    console.log('Testing Supabase connection...')
    console.log('URL:', supabaseUrl ? 'Set' : 'Missing')
    console.log('Key:', supabaseAnonKey ? 'Set' : 'Missing')
    
    try {
      const { data, error } = await supabase
        .from('survey_responses_flexible')
        .select('count')
        .limit(1)
      
      if (error) {
        console.error('Supabase connection error:', error)
        alert(`Supabase error: ${error.message}`)
      } else {
        console.log('Supabase connection successful!')
        alert('Supabase connection working!')
      }
    } catch (err) {
      console.error('Connection test error:', err)
      alert(`Connection test failed: ${err.message}`)
    }
  }

  // const fetchSubmissionCount = async () => { // This function was removed
  //   try {
  //     const { count, error } = await supabase // This line was removed
  //       .from('survey_responses_flexible') // This line was removed
  //       .select('*', { count: 'exact', head: true }) // This line was removed
      
  //     if (!error && count !== null) {
  //       setSubmissionCount(count)
  //     }
  //   } catch (err) {
  //     console.error('Error fetching count:', err)
  //   }
  // }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Markera frågan som besvarad
    setAnsweredQuestions(prev => ({
      ...prev,
      [name]: true
    }))
    
    // Speciallogik för children - rensa children_ages om svaret är 'nej'
    if (name === 'children' && value === 'nej') {
      setFormData(prev => ({
        ...prev,
        children_ages: ''
      }))
      setAnsweredQuestions(prev => ({
        ...prev,
        children_ages: true // Markera som besvarad så man kan gå vidare
      }))
    }
    
    // Speciallogik för share of market - markera frågan som besvarad när någon procent ändras
    if (name.startsWith('share_of_market_')) {
      const questionKey = 'share_of_market'
      setAnsweredQuestions(prev => ({
        ...prev,
        [questionKey]: true
      }))
    }
  }

  const handleBrandSelection = (questionKey, brandId, value) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      if (brandId === 'inget') {
        // Om "Inget av dessa" väljs, avmarkera alla andra
        if (value) {
          // Rensa alla andra val för denna fråga
          Object.keys(newData).forEach(key => {
            if (key.startsWith(`${questionKey}_`) && key !== `${questionKey}_inget`) {
              newData[key] = false
            }
          })
        }
        newData[`${questionKey}_inget`] = value
      } else {
        // Om en vanlig brand väljs, avmarkera "Inget av dessa"
        if (value) {
          newData[`${questionKey}_inget`] = false
        }
        newData[`${questionKey}_${brandId}`] = value
      }
      
      return newData
    })
    
    // Markera frågan som besvarad
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionKey]: true
    }))
    
    // Speciallogik för purchase_frequency - automatiskt sätta 100% om bara en kedja
    if (questionKey === 'purchase_frequency') {
      setTimeout(() => {
        const frequentBrands = getFrequentBrands()
        if (frequentBrands.length === 1) {
          // Automatiskt sätta 100% för den enda kedjan
          const singleBrand = frequentBrands[0]
          setFormData(prev => ({
            ...prev,
            [`share_of_market_${singleBrand.id}`]: '100'
          }))
          setAnsweredQuestions(prev => ({
            ...prev,
            'share_of_market': true
          }))
        }
      }, 100) // Kort fördröjning för att låta state uppdateras
    }
  }

  const handleStatementSelection = (questionKey, statementIndex, brandId, value) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      if (brandId === 'ingen') {
        // Om "Ingen av dessa" väljs, avmarkera alla andra för denna statement
        if (value) {
          // Rensa alla andra val för denna statement
          Object.keys(newData).forEach(key => {
            if (key.startsWith(`${questionKey}_${statementIndex}_`) && key !== `${questionKey}_${statementIndex}_ingen`) {
              newData[key] = false
            }
          })
        }
        newData[`${questionKey}_${statementIndex}_ingen`] = value
      } else {
        // Om en vanlig brand väljs, avmarkera "Ingen av dessa" för denna statement
        if (value) {
          newData[`${questionKey}_${statementIndex}_ingen`] = false
        }
        newData[`${questionKey}_${statementIndex}_${brandId}`] = value
      }
      
      return newData
    })
    
    // Markera statement som besvarad
    setAnsweredQuestions(prev => ({
      ...prev,
      [`${questionKey}_${statementIndex}`]: true
    }))
  }

  const handleImportanceSelection = (questionKey, optionIndex, value) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      if (optionIndex === 'inget') {
        // Om "Inget av dessa" väljs, avmarkera alla andra
        if (value) {
          // Rensa alla andra val för denna fråga
          Object.keys(newData).forEach(key => {
            if (key.startsWith(`${questionKey}_`) && key !== `${questionKey}_inget`) {
              newData[key] = false
            }
          })
        }
        newData[`${questionKey}_inget`] = value
      } else {
        // Om en vanlig option väljs, avmarkera "Inget av dessa"
        if (value) {
          newData[`${questionKey}_inget`] = false
        }
        newData[`${questionKey}_${optionIndex}`] = value
      }
      
      return newData
    })
    
    // Markera frågan som besvarad
    setAnsweredQuestions(prev => ({
      ...prev,
      [questionKey]: true
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('Form data:', formData)
      
      // Skapa en komplett datastruktur med standardiserade variabelnamn och numeriska värden
      const completeResponseData = {}
      
      // Funktion för att konvertera text-värden till numeriska
      const convertToNumeric = (value, questionKey) => {
        if (value === '' || value === null || value === undefined) return ''
        
        // Konvertera boolean till 0/1
        if (typeof value === 'boolean') return value ? 1 : 0
        
        // Konvertera text-värden till numeriska baserat på frågetyp
        switch (questionKey) {
          case 'gender':
            switch (value) {
              case 'man': return 1
              case 'kvinna': return 2
              case 'annat': return 3
              case 'vill_ej_säga': return 4
              default: return value
            }
          
          case 'household_size':
            switch (value) {
              case '1_person': return 1
              case '2_personer': return 2
              case '3_personer': return 3
              case '4_personer': return 4
              case '5_personer': return 5
              case 'fler_än_5': return 6
              default: return value
            }
          
          case 'children':
            switch (value) {
              case 'ja': return 1
              case 'nej': return 2
              default: return value
            }
          
          case 'location':
            switch (value) {
              case 'stockholm': return 1
              case 'malmö': return 2
              case 'göteborg': return 3
              case 'annan_stad_över_90k': return 4
              case 'stad_50k_90k': return 5
              case 'stad_10k_50k': return 6
              case 'landsbygd': return 7
              default: return value
            }
          
          case 'income':
            switch (value) {
              case '0_10k': return 1
              case '10k_20k': return 2
              case '20k_30k': return 3
              case '30k_40k': return 4
              case '40k_50k': return 5
              case '50k_60k': return 6
              case '60k_70k': return 7
              case '70k_80k': return 8
              case '80k_90k': return 9
              case '90k_100k': return 10
              case 'över_100k': return 11
              case 'vet_ej': return 12
              default: return value
            }
          
          case 'life_situation':
            switch (value) {
              case 'singel': return 1
              case 'pojkvän_flickvän': return 2
              case 'sambo_gift_utan_barn': return 3
              case 'ensamstående_med_barn': return 4
              case 'sambo_gift_små_barn': return 5
              case 'sambo_gift_tonårsbarn': return 6
              case 'sambo_gift_utflyttade_barn': return 7
              case 'frånskild': return 8
              case 'änka_änkeman': return 9
              case 'annat': return 10
              default: return value
            }
          
          case 'education':
            switch (value) {
              case 'grundskola': return 1
              case 'gymnasieskola': return 2
              case 'universitet_högskola': return 3
              default: return value
            }
          
          case 'employment':
            switch (value) {
              case 'egenföretagare': return 1
              case 'anställd': return 2
              case 'studerande': return 3
              case 'pensionär': return 4
              case 'arbetslös': return 5
              default: return value
            }
          
          case 'last_purchase':
            switch (value) {
              case 'mindre_än_1_månad': return 1
              case '1_6_månader': return 2
              case '6_månader_1_år': return 3
              case 'mer_än_1_år': return 4
              case 'aldrig': return 5
              default: return value
            }
          
          case 'main_provider':
            switch (value) {
              case 'mcdonalds': return 1
              case 'burger_king': return 2
              case 'max': return 3
              case 'sibylla': return 4
              case 'bastard_burgers': return 5
              case 'prime_burger': return 6
              case 'frasses': return 7
              case 'shake_shack': return 8
              case 'five_guys': return 9
              case 'flippin_burgers': return 10
              case 'inget_av_dessa': return 11
              default: return value
            }
          
          case 'purchase_frequency':
            switch (value) {
              case 'dagligen': return 1
              case 'flera_gånger_per_vecka': return 2
              case 'varje_vecka': return 3
              case 'varannan_vecka': return 4
              case 'varje_månad': return 5
              case 'varannan_månad': return 6
              case '1_gång_per_kvartal': return 7
              case '1_gång_per_halvår': return 8
              case '1_gång_per_år': return 9
              case 'mer_sällan_aldrig': return 10
              default: return value
            }
          
          case 'awareness':
            switch (value) {
              case 'har_inte_hört_talas_om': return 1
              case 'hört_talas_om_men_vet_inget': return 2
              case 'hört_talas_om_och_vet_vad': return 3
              default: return value
            }
          
          case 'strength_scale':
            // Behåll numeriska värden som de är (1-7)
            return isNaN(value) ? value : parseInt(value)
          
          default:
            return value
        }
      }
      
      // Mappning från fråge-ID till standardnamn
      const variableMapping = {
        // Demografi
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
        
        // Köpbeteende
        'last_purchase': 'B1',
        'main_provider': 'B2',
        
        // Current customers (B3_1 till B3_11)
        'current_customers_mcdonalds': 'B3_1',
        'current_customers_burger_king': 'B3_2',
        'current_customers_max': 'B3_3',
        'current_customers_sibylla': 'B3_4',
        'current_customers_bastard_burgers': 'B3_5',
        'current_customers_prime_burger': 'B3_6',
        'current_customers_frasses': 'B3_7',
        'current_customers_shake_shack': 'B3_8',
        'current_customers_five_guys': 'B3_9',
        'current_customers_flippin_burgers': 'B3_10',
        'current_customers_inget': 'B3_11',
        
        // Purchase frequency (B4_1 till B4_10)
        'purchase_frequency_mcdonalds': 'B4_1',
        'purchase_frequency_burger_king': 'B4_2',
        'purchase_frequency_max': 'B4_3',
        'purchase_frequency_sibylla': 'B4_4',
        'purchase_frequency_bastard_burgers': 'B4_5',
        'purchase_frequency_prime_burger': 'B4_6',
        'purchase_frequency_frasses': 'B4_7',
        'purchase_frequency_shake_shack': 'B4_8',
        'purchase_frequency_five_guys': 'B4_9',
        'purchase_frequency_flippin_burgers': 'B4_10',
        
        // Share of market (B5_1 till B5_10)
        'share_of_market_mcdonalds': 'B5_1',
        'share_of_market_burger_king': 'B5_2',
        'share_of_market_max': 'B5_3',
        'share_of_market_sibylla': 'B5_4',
        'share_of_market_bastard_burgers': 'B5_5',
        'share_of_market_prime_burger': 'B5_6',
        'share_of_market_frasses': 'B5_7',
        'share_of_market_shake_shack': 'B5_8',
        'share_of_market_five_guys': 'B5_9',
        'share_of_market_flippin_burgers': 'B5_10',
        
        // Awareness (C1_1 till C1_10)
        'awareness_v2_mcdonalds': 'C1_1',
        'awareness_v2_burger_king': 'C1_2',
        'awareness_v2_max': 'C1_3',
        'awareness_v2_sibylla': 'C1_4',
        'awareness_v2_bastard_burgers': 'C1_5',
        'awareness_v2_prime_burger': 'C1_6',
        'awareness_v2_frasses': 'C1_7',
        'awareness_v2_shake_shack': 'C1_8',
        'awareness_v2_five_guys': 'C1_9',
        'awareness_v2_flippin_burgers': 'C1_10',
        
        // Strength scale (C2_1 till C2_10)
        'strength_scale_mcdonalds': 'C2_1',
        'strength_scale_burger_king': 'C2_2',
        'strength_scale_max': 'C2_3',
        'strength_scale_sibylla': 'C2_4',
        'strength_scale_bastard_burgers': 'C2_5',
        'strength_scale_prime_burger': 'C2_6',
        'strength_scale_frasses': 'C2_7',
        'strength_scale_shake_shack': 'C2_8',
        'strength_scale_five_guys': 'C2_9',
        'strength_scale_flippin_burgers': 'C2_10',
        
        // Image statements (D1_1_1 till D1_10_7)
        // Statement 1
        'image_statements_0_mcdonalds': 'D1_1_1',
        'image_statements_0_burger_king': 'D1_1_2',
        'image_statements_0_max': 'D1_1_3',
        'image_statements_0_sibylla': 'D1_1_4',
        'image_statements_0_bastard_burgers': 'D1_1_5',
        'image_statements_0_prime_burger': 'D1_1_6',
        'image_statements_0_ingen': 'D1_1_7',
        
        // Statement 2
        'image_statements_1_mcdonalds': 'D1_2_1',
        'image_statements_1_burger_king': 'D1_2_2',
        'image_statements_1_max': 'D1_2_3',
        'image_statements_1_sibylla': 'D1_2_4',
        'image_statements_1_bastard_burgers': 'D1_2_5',
        'image_statements_1_prime_burger': 'D1_2_6',
        'image_statements_1_ingen': 'D1_2_7',
        
        // Statement 3
        'image_statements_2_mcdonalds': 'D1_3_1',
        'image_statements_2_burger_king': 'D1_3_2',
        'image_statements_2_max': 'D1_3_3',
        'image_statements_2_sibylla': 'D1_3_4',
        'image_statements_2_bastard_burgers': 'D1_3_5',
        'image_statements_2_prime_burger': 'D1_3_6',
        'image_statements_2_ingen': 'D1_3_7',
        
        // Statement 4
        'image_statements_3_mcdonalds': 'D1_4_1',
        'image_statements_3_burger_king': 'D1_4_2',
        'image_statements_3_max': 'D1_4_3',
        'image_statements_3_sibylla': 'D1_4_4',
        'image_statements_3_bastard_burgers': 'D1_4_5',
        'image_statements_3_prime_burger': 'D1_4_6',
        'image_statements_3_ingen': 'D1_4_7',
        
        // Statement 5
        'image_statements_4_mcdonalds': 'D1_5_1',
        'image_statements_4_burger_king': 'D1_5_2',
        'image_statements_4_max': 'D1_5_3',
        'image_statements_4_sibylla': 'D1_5_4',
        'image_statements_4_bastard_burgers': 'D1_5_5',
        'image_statements_4_prime_burger': 'D1_5_6',
        'image_statements_4_ingen': 'D1_5_7',
        
        // Statement 6
        'image_statements_5_mcdonalds': 'D1_6_1',
        'image_statements_5_burger_king': 'D1_6_2',
        'image_statements_5_max': 'D1_6_3',
        'image_statements_5_sibylla': 'D1_6_4',
        'image_statements_5_bastard_burgers': 'D1_6_5',
        'image_statements_5_prime_burger': 'D1_6_6',
        'image_statements_5_ingen': 'D1_6_7',
        
        // Statement 7
        'image_statements_6_mcdonalds': 'D1_7_1',
        'image_statements_6_burger_king': 'D1_7_2',
        'image_statements_6_max': 'D1_7_3',
        'image_statements_6_sibylla': 'D1_7_4',
        'image_statements_6_bastard_burgers': 'D1_7_5',
        'image_statements_6_prime_burger': 'D1_7_6',
        'image_statements_6_ingen': 'D1_7_7',
        
        // Statement 8
        'image_statements_7_mcdonalds': 'D1_8_1',
        'image_statements_7_burger_king': 'D1_8_2',
        'image_statements_7_max': 'D1_8_3',
        'image_statements_7_sibylla': 'D1_8_4',
        'image_statements_7_bastard_burgers': 'D1_8_5',
        'image_statements_7_prime_burger': 'D1_8_6',
        'image_statements_7_ingen': 'D1_8_7',
        
        // Statement 9
        'image_statements_8_mcdonalds': 'D1_9_1',
        'image_statements_8_burger_king': 'D1_9_2',
        'image_statements_8_max': 'D1_9_3',
        'image_statements_8_sibylla': 'D1_9_4',
        'image_statements_8_bastard_burgers': 'D1_9_5',
        'image_statements_8_prime_burger': 'D1_9_6',
        'image_statements_8_ingen': 'D1_9_7',
        
        // Statement 10
        'image_statements_9_mcdonalds': 'D1_10_1',
        'image_statements_9_burger_king': 'D1_10_2',
        'image_statements_9_max': 'D1_10_3',
        'image_statements_9_sibylla': 'D1_10_4',
        'image_statements_9_bastard_burgers': 'D1_10_5',
        'image_statements_9_prime_burger': 'D1_10_6',
        'image_statements_9_ingen': 'D1_10_7',
        
        // Importance attributes (E1_1 till E1_6)
        'importance_attributes_0': 'E1_1',
        'importance_attributes_1': 'E1_2',
        'importance_attributes_2': 'E1_3',
        'importance_attributes_3': 'E1_4',
        'importance_attributes_4': 'E1_5',
        'importance_attributes_inget': 'E1_6',
        
        // Security questions (F1 till F18)
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
        'security_questions_17': 'F18'
      }
      
      // Lägg till alla grundläggande frågor från SURVEY_CONFIG
      Object.values(SURVEY_CONFIG.sections).forEach(section => {
        Object.keys(section.questions).forEach(questionKey => {
          const question = section.questions[questionKey]
          
          // Specialhantering för statements som använder randomizedStatements
          if (questionKey === 'image_statements') {
            randomizedStatements.forEach((statement, statementIndex) => {
              // Använd endast de 6 ursprungliga varumärkena för image statements
              const originalBrands = SURVEY_CONFIG.brands.slice(0, 6)
              originalBrands.forEach(brand => {
                const oldKey = `${questionKey}_${statementIndex}_${brand.id}`
                const newKey = `D1_${statementIndex + 1}_${brand.id === 'mcdonalds' ? 1 : 
                               brand.id === 'burger_king' ? 2 : 
                               brand.id === 'max' ? 3 : 
                               brand.id === 'sibylla' ? 4 : 
                               brand.id === 'bastard_burgers' ? 5 : 
                               brand.id === 'prime_burger' ? 6 : 7}`
                completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'boolean')
              })
              // Lägg till "ingen av dessa" för varje statement
              const oldNoneKey = `${questionKey}_${statementIndex}_ingen`
              const newNoneKey = `D1_${statementIndex + 1}_7`
              completeResponseData[newNoneKey] = convertToNumeric(formData[oldNoneKey], 'boolean')
            })
            return // Hoppa över den vanliga switch-satsen
          }
          
          // Specialhantering för importance_attributes som använder randomizedImportanceOptions
          if (questionKey === 'importance_attributes') {
            randomizedImportanceOptions.forEach((option, index) => {
              const oldKey = `${questionKey}_${index}`
              const newKey = `E1_${index + 1}`
              completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'boolean')
            })
            // Lägg till "inget av dessa"
            completeResponseData['E1_6'] = convertToNumeric(formData[`${questionKey}_inget`], 'boolean')
            return // Hoppa över den vanliga switch-satsen
          }
          
          // Hantera olika frågetyper
          switch (question.type) {
            case 'brand_matrix_v2':
              // Lägg till alla brand-specifika svar för awareness
              SURVEY_CONFIG.brands.forEach(brand => {
                const oldKey = `${questionKey}_${brand.id}`
                const newKey = `C1_${brand.id === 'mcdonalds' ? 1 : 
                               brand.id === 'burger_king' ? 2 : 
                               brand.id === 'max' ? 3 : 
                               brand.id === 'sibylla' ? 4 : 
                               brand.id === 'bastard_burgers' ? 5 : 
                               brand.id === 'prime_burger' ? 6 : 
                               brand.id === 'frasses' ? 7 : 
                               brand.id === 'shake_shack' ? 8 : 
                               brand.id === 'five_guys' ? 9 : 
                               brand.id === 'flippin_burgers' ? 10 : 1}`
                completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'awareness')
              })
              break
              
            case 'brand_statement_matrix':
              // Denna hanteras redan ovan
              break
              
            case 'brand_multiple':
              // För current_customers, hantera endast kända varumärken
              if (questionKey === 'current_customers') {
                // Först, sätt alla till missing (tomma värden)
                SURVEY_CONFIG.brands.forEach(brand => {
                  const newKey = `B3_${brand.id === 'mcdonalds' ? 1 : 
                                 brand.id === 'burger_king' ? 2 : 
                                 brand.id === 'max' ? 3 : 
                                 brand.id === 'sibylla' ? 4 : 
                                 brand.id === 'bastard_burgers' ? 5 : 
                                 brand.id === 'prime_burger' ? 6 : 
                                 brand.id === 'frasses' ? 7 : 
                                 brand.id === 'shake_shack' ? 8 : 
                                 brand.id === 'five_guys' ? 9 : 
                                 brand.id === 'flippin_burgers' ? 10 : 1}`
                  completeResponseData[newKey] = '' // Missing value för okända varumärken
                })
                
                // Sedan, sätt bara de kända varumärkena som valts
                getKnownBrandsForCurrentCustomers().forEach(brand => {
                  const oldKey = `${questionKey}_${brand.id}`
                  const newKey = `B3_${brand.id === 'mcdonalds' ? 1 : 
                                 brand.id === 'burger_king' ? 2 : 
                                 brand.id === 'max' ? 3 : 
                                 brand.id === 'sibylla' ? 4 : 
                                 brand.id === 'bastard_burgers' ? 5 : 
                                 brand.id === 'prime_burger' ? 6 : 
                                 brand.id === 'frasses' ? 7 : 
                                 brand.id === 'shake_shack' ? 8 : 
                                 brand.id === 'five_guys' ? 9 : 
                                 brand.id === 'flippin_burgers' ? 10 : 1}`
                  completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'boolean')
                })
              } else {
                // För andra brand_multiple-frågor, hantera alla varumärken
                SURVEY_CONFIG.brands.forEach(brand => {
                  const oldKey = `${questionKey}_${brand.id}`
                  const newKey = `B3_${brand.id === 'mcdonalds' ? 1 : 
                                 brand.id === 'burger_king' ? 2 : 
                                 brand.id === 'max' ? 3 : 
                                 brand.id === 'sibylla' ? 4 : 
                                 brand.id === 'bastard_burgers' ? 5 : 
                                 brand.id === 'prime_burger' ? 6 : 
                                 brand.id === 'frasses' ? 7 : 
                                 brand.id === 'shake_shack' ? 8 : 
                                 brand.id === 'five_guys' ? 9 : 
                                 brand.id === 'flippin_burgers' ? 10 : 1}`
                  completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'boolean')
                })
              }
              // Lägg till "inget av dessa"
              completeResponseData['B3_11'] = convertToNumeric(formData[`${questionKey}_inget`], 'boolean')
              break
              
            case 'brand_single':
              // För main_provider, hantera endast kända varumärken
              if (questionKey === 'main_provider') {
                // Sätt alla till missing (tomma värden)
                SURVEY_CONFIG.brands.forEach(brand => {
                  const newKey = `B2_${brand.id === 'mcdonalds' ? 1 : 
                                 brand.id === 'burger_king' ? 2 : 
                                 brand.id === 'max' ? 3 : 
                                 brand.id === 'sibylla' ? 4 : 
                                 brand.id === 'bastard_burgers' ? 5 : 
                                 brand.id === 'prime_burger' ? 6 : 
                                 brand.id === 'frasses' ? 7 : 
                                 brand.id === 'shake_shack' ? 8 : 
                                 brand.id === 'five_guys' ? 9 : 
                                 brand.id === 'flippin_burgers' ? 10 : 1}`
                  completeResponseData[newKey] = '' // Missing value för okända varumärken
                })
                
                // Sätt bara det valda kända varumärket
                const selectedBrand = getKnownBrandsForCurrentCustomers().find(brand => brand.id === formData[questionKey])
                if (selectedBrand) {
                  const newKey = `B2_${selectedBrand.id === 'mcdonalds' ? 1 : 
                                 selectedBrand.id === 'burger_king' ? 2 : 
                                 selectedBrand.id === 'max' ? 3 : 
                                 selectedBrand.id === 'sibylla' ? 4 : 
                                 selectedBrand.id === 'bastard_burgers' ? 5 : 
                                 selectedBrand.id === 'prime_burger' ? 6 : 
                                 selectedBrand.id === 'frasses' ? 7 : 
                                 selectedBrand.id === 'shake_shack' ? 8 : 
                                 selectedBrand.id === 'five_guys' ? 9 : 
                                 selectedBrand.id === 'flippin_burgers' ? 10 : 1}`
                  completeResponseData[newKey] = 1
                }
                
                // Hantera "inget av dessa"
                if (formData[questionKey] === 'inget') {
                  completeResponseData['B2_11'] = 1
                }
              } else {
                // För andra brand_single-frågor, hantera som vanligt
                const singleMappedKey = variableMapping[questionKey] || questionKey
                completeResponseData[singleMappedKey] = convertToNumeric(formData[questionKey], questionKey)
              }
              break
              
            case 'brand_scale':
            case 'brand_scale_single':
              // Lägg till alla brand-specifika skala-svar
              SURVEY_CONFIG.brands.forEach(brand => {
                const oldKey = `${questionKey}_${brand.id}`
                const newKey = `C2_${brand.id === 'mcdonalds' ? 1 : 
                               brand.id === 'burger_king' ? 2 : 
                               brand.id === 'max' ? 3 : 
                               brand.id === 'sibylla' ? 4 : 
                               brand.id === 'bastard_burgers' ? 5 : 
                               brand.id === 'prime_burger' ? 6 : 
                               brand.id === 'frasses' ? 7 : 
                               brand.id === 'shake_shack' ? 8 : 
                               brand.id === 'five_guys' ? 9 : 
                               brand.id === 'flippin_burgers' ? 10 : 1}`
                completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'strength_scale')
              })
              break
              
            case 'brand_frequency':
              // För purchase_frequency, hantera endast kända varumärken
              // Först, sätt alla till missing (tomma värden)
              SURVEY_CONFIG.brands.forEach(brand => {
                const newKey = `B4_${brand.id === 'mcdonalds' ? 1 : 
                               brand.id === 'burger_king' ? 2 : 
                               brand.id === 'max' ? 3 : 
                               brand.id === 'sibylla' ? 4 : 
                               brand.id === 'bastard_burgers' ? 5 : 
                               brand.id === 'prime_burger' ? 6 : 
                               brand.id === 'frasses' ? 7 : 
                               brand.id === 'shake_shack' ? 8 : 
                               brand.id === 'five_guys' ? 9 : 
                               brand.id === 'flippin_burgers' ? 10 : 1}`
                completeResponseData[newKey] = '' // Missing value för okända varumärken
              })
              
              // Sedan, sätt bara de kända varumärkena som har svar
              getKnownBrandsForCurrentCustomers().forEach(brand => {
                const oldKey = `${questionKey}_${brand.id}`
                const newKey = `B4_${brand.id === 'mcdonalds' ? 1 : 
                               brand.id === 'burger_king' ? 2 : 
                               brand.id === 'max' ? 3 : 
                               brand.id === 'sibylla' ? 4 : 
                               brand.id === 'bastard_burgers' ? 5 : 
                               brand.id === 'prime_burger' ? 6 : 
                               brand.id === 'frasses' ? 7 : 
                               brand.id === 'shake_shack' ? 8 : 
                               brand.id === 'five_guys' ? 9 : 
                               brand.id === 'flippin_burgers' ? 10 : 1}`
                completeResponseData[newKey] = convertToNumeric(formData[oldKey], 'purchase_frequency')
              })
              break
              
            case 'brand_share':
              // Lägg till alla brand-specifika procent-svar
              SURVEY_CONFIG.brands.forEach(brand => {
                const oldKey = `${questionKey}_${brand.id}`
                const newKey = `B5_${brand.id === 'mcdonalds' ? 1 : 
                               brand.id === 'burger_king' ? 2 : 
                               brand.id === 'max' ? 3 : 
                               brand.id === 'sibylla' ? 4 : 
                               brand.id === 'bastard_burgers' ? 5 : 
                               brand.id === 'prime_burger' ? 6 : 
                               brand.id === 'frasses' ? 7 : 
                               brand.id === 'shake_shack' ? 8 : 
                               brand.id === 'five_guys' ? 9 : 
                               brand.id === 'flippin_burgers' ? 10 : 1}`
                completeResponseData[newKey] = formData[oldKey] || '' // Behåll procent som text
              })
              break
              
            case 'multiple_choice':
            case 'select':
            case 'number':
            case 'text':
            case 'security_check':
            default:
              // Hantera vanliga frågor med mappning
              const defaultMappedKey = variableMapping[questionKey] || questionKey
              completeResponseData[defaultMappedKey] = convertToNumeric(formData[questionKey], questionKey)
              break
          }
        })
      })
      
      // Lägg till security questions (behåll som text)
      for (let i = 0; i < 18; i++) {
        const oldKey = `security_questions_${i}`
        const newKey = `F${i + 1}`
        completeResponseData[newKey] = formData[oldKey] || ''
      }

      console.log('FormData keys:', Object.keys(formData))
      console.log('Complete survey response:', completeResponseData)
      console.log('Number of response fields:', Object.keys(completeResponseData).length)

      const surveyResponse = {
        version: SURVEY_CONFIG.version,
        responses: completeResponseData,
        survey_version: SURVEY_CONFIG.version,
        brands_order: SURVEY_CONFIG.brands.map(b => b.id),
        statements_order: randomizedStatements.map((_, i) => i),
        importance_options_order: randomizedImportanceOptions.map((_, i) => i),
        security_questions_used: randomizedSecurityQuestions.length > 0 ? randomizedSecurityQuestions.map((_, i) => i) : []
      }

      if (supabase) {
        console.log('Submitting to Supabase...')
        const { data, error } = await supabase
          .from('survey_responses_flexible')
          .insert([surveyResponse])

        if (error) {
          console.error('Supabase error:', error)
          alert('Ett fel uppstod när svaret sparades. Försök igen.')
          setIsLoading(false)
          return
        }

        console.log('Successfully submitted to Supabase:', data)
      } else {
        console.log('Demo mode - data not saved to database')
      }

      setIsSubmitted(true)
      setIsLoading(false)
    } catch (error) {
      console.error('Submission error:', error)
      alert('Ett fel uppstod när svaret sparades. Försök igen.')
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setCurrentPage(0) // Gå tillbaka till första sidan
    setCurrentSecurityQuestion(0) // Återställ säkerhetsfrågan
    setCurrentOpenQuestionIndex(0) // Återställ öppen fråga index
    setIsInitialized(false) // Återställ så att ny randomisering sker för nästa respondent
    setAnsweredQuestions({}) // Återställ besvarade frågor
    const initialData = {}
    Object.values(SURVEY_CONFIG.sections).forEach(section => {
      Object.keys(section.questions).forEach(key => {
        initialData[key] = ''
      })
    })
    setFormData(initialData)
  }

  const hasVisibleQuestions = (pageIndex) => {
    const pageData = pages[pageIndex]
    const section = SURVEY_CONFIG.sections[pageData.key]
    if (!section) return false
    
    // Specialhantering för image-sidan (statements)
    if (pageData.key === 'image') {
      return randomizedStatements && randomizedStatements.length > 0
    }
    
    // Specialhantering för open_questions-sidan
    if (pageData.key === 'open_questions') {
      console.log('Checking open_questions page visibility...')
      const openQuestions = generateDynamicOpenQuestions()
      console.log('open_questions should show:', openQuestions.length > 0)
      return openQuestions.length > 0
    }
    
    // Kontrollera om någon fråga på sidan är synlig
    return Object.entries(section.questions).some(([key, question], index) => {
      if (!shouldShowQuestion(key, index)) {
        return false
      }
      
      // Kontrollera om renderQuestion returnerar null
      const renderedQuestion = renderQuestion(key, question)
      return renderedQuestion !== null
    })
  }

  const nextPage = () => {
    // Specialhantering för open_questions sidan
    if (pages[currentPage].key === 'open_questions') {
      const openQuestions = generateDynamicOpenQuestions()
      if (currentOpenQuestionIndex < openQuestions.length - 1) {
        // Gå till nästa öppen fråga
        setCurrentOpenQuestionIndex(currentOpenQuestionIndex + 1)
        return
      } else {
        // Gå till nästa sida
        setCurrentOpenQuestionIndex(0) // Reset för nästa gång
      }
    }
    
    if (currentPage < pages.length - 1) {
      let nextPageIndex = currentPage + 1
      
      // Hoppa över tomma sidor
      while (nextPageIndex < pages.length - 1 && !hasVisibleQuestions(nextPageIndex)) {
        nextPageIndex++
      }
      
      setCurrentPage(nextPageIndex)
    }
  }

  const prevPage = () => {
    // Specialhantering för open_questions sidan
    if (pages[currentPage].key === 'open_questions') {
      if (currentOpenQuestionIndex > 0) {
        // Gå till föregående öppen fråga
        setCurrentOpenQuestionIndex(currentOpenQuestionIndex - 1)
        return
      } else {
        // Gå till föregående sida
        setCurrentOpenQuestionIndex(0) // Reset för nästa gång
      }
    }
    
    if (currentPage > 0) {
      let prevPageIndex = currentPage - 1
      
      // Hoppa över tomma sidor när man går bakåt
      while (prevPageIndex > 0 && !hasVisibleQuestions(prevPageIndex)) {
        prevPageIndex--
      }
      
      setCurrentPage(prevPageIndex)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // Hitta nästa sida med synliga frågor
      let nextPageIndex = currentPage + 1
      while (nextPageIndex < pages.length && !hasVisibleQuestions(nextPageIndex)) {
        nextPageIndex++
      }
      
      if (nextPageIndex < pages.length) {
        setCurrentPage(nextPageIndex)
      } else {
        handleSubmit(e)
      }
    }
  }

  const isQuestionAnswered = (questionKey) => {
    // Speciallogik för security_questions - kolla om alla säkerhetsfrågor är besvarade
    if (questionKey === 'security_questions') {
      return randomizedSecurityQuestions && randomizedSecurityQuestions.length > 0 && 
             randomizedSecurityQuestions.every((_, index) => {
               const answer = formData[`security_questions_${index}`]
               return answer && answer !== ''
             })
    }
    
    // Speciallogik för purchase_frequency - kolla om minst ett varumärke har valts
    if (questionKey === 'purchase_frequency') {
      return randomizedBrands && randomizedBrands.length > 0 && randomizedBrands.some(brand => {
        const frequency = formData[`purchase_frequency_${brand.id}`]
        return frequency && frequency !== ''
      })
    }
    
    // Speciallogik för share_of_market - kolla om det finns flera kedjor eller om det automatiskt sätts
    if (questionKey === 'share_of_market') {
      const frequentBrands = getFrequentBrands()
      if (frequentBrands.length === 0) {
        return false // Ingen kedja vald
      } else if (frequentBrands.length === 1) {
        return true // Automatiskt satt till 100%
      } else {
        // Flera kedjor - kolla om alla har procent
        return frequentBrands.every(brand => {
          const share = formData[`share_of_market_${brand.id}`]
          return share && share !== ''
        })
      }
    }
    
    // Speciallogik för dynamic_open_questions - kolla om den aktuella öppna frågan är besvarad
    if (questionKey === 'dynamic_open_questions') {
      const openQuestions = generateDynamicOpenQuestions()
      if (openQuestions.length === 0) {
        return true // Inga frågor att svara på
      }
      
      // Om vi är på open_questions sidan, kolla bara den aktuella frågan
      if (pages[currentPage].key === 'open_questions') {
        const currentQuestion = openQuestions[currentOpenQuestionIndex]
        if (!currentQuestion) return true
        const answer = formData[currentQuestion.id]
        return answer && answer.trim() !== ''
      }
      
      // Annars kolla om alla frågor är besvarade
      return openQuestions.every(question => {
        const answer = formData[question.id]
        return answer && answer.trim() !== ''
      })
    }
    
    return answeredQuestions[questionKey] || false
  }

  const shouldShowQuestion = (questionKey, questionIndex) => {
    if (questionIndex === 0) return true // Visa första frågan alltid
    
    // Hitta föregående fråga
    const currentPageData = pages[currentPage]
    const section = SURVEY_CONFIG.sections[currentPageData.key]
    if (!section) return true
    
    const questionKeys = Object.keys(section.questions)
    const previousQuestionKey = questionKeys[questionIndex - 1]
    
    // Kontrollera om föregående fråga är besvarad
    if (!isQuestionAnswered(previousQuestionKey)) {
      return false
    }
    
    // Speciallogik för children_ages - visa bara om children = 'ja'
    if (questionKey === 'children_ages') {
      return formData.children === 'ja'
    }
    
    // Speciallogik för share_of_market - visa bara om det finns flera frekventa kedjor
    if (questionKey === 'share_of_market') {
      const frequentBrands = getFrequentBrands()
      return frequentBrands.length > 1 // Visa bara om det finns flera än 1 kedja
    }
    
    // Speciallogik för dynamic_open_questions - visa bara om det finns frågor att visa
    if (questionKey === 'dynamic_open_questions') {
      const openQuestions = generateDynamicOpenQuestions()
      return openQuestions.length > 0
    }
    
    return true
  }

  const shouldShowStatement = (statementIndex) => {
    if (statementIndex === 0) return true // Visa första statement alltid
    
    // Kontrollera om föregående statement är besvarad
    const previousStatementKey = `image_statements_${statementIndex - 1}`
    return isQuestionAnswered(previousStatementKey)
  }

  // Hämta varumärken som köps minst varje år
  const getFrequentBrands = () => {
    if (!randomizedBrands || randomizedBrands.length === 0) {
      return []
    }
    
    const frequentOptions = ['1 gång per år', '1 gång per halvår', '1 gång per kvartal', 'Varje månad', 'Varannan månad', 'Varannan vecka', 'Varje vecka', 'Flera gånger per vecka', 'Dagligen']
    
    return randomizedBrands.filter(brand => {
      const frequency = formData[`purchase_frequency_${brand.id}`]
      return frequency && frequentOptions.includes(frequency)
    })
  }

  const getKnownBrands = () => {
    if (!randomizedBrands || randomizedBrands.length === 0) {
      return []
    }
    
    return randomizedBrands.filter(brand => {
      const awareness = formData[`awareness_v2_${brand.id}`]
      return awareness && awareness !== 'Har inte hört talas om'
    })
  }

  const getKnownBrandsForCurrentCustomers = () => {
    if (!randomizedBrands || randomizedBrands.length === 0) {
      return []
    }
    
    return randomizedBrands.filter(brand => {
      const awareness = formData[`awareness_v2_${brand.id}`]
      return awareness && awareness !== 'Har inte hört talas om'
    })
  }

  const getCategoryDefinition = (pageKey) => {
    const definitions = {
      security: 'Säkerhetsfrågor för att säkerställa att du är en riktig person',
      screening: 'Screening-frågor för att säkerställa att du är rätt målgrupp',
      awareness_v2: 'Kännedom om hamburgerkedjor',
      statements: 'Attribut och påståenden om hamburgerkedjor',
      behavior: 'Köpbeteende och vanor',
      share_of_market: 'Marknadsandel mellan kedjor',
      importance: 'Viktiga faktorer vid val av hamburgerkedja',
      consideration: 'Övervägande av hamburgerkedjor',
      open_questions: 'Förklaringar till dina svar',
      background: 'Bakgrundsinformation'
    }
    return definitions[pageKey] || ''
  }

  // Funktion för att generera dynamiska öppna frågor baserat på statement-kombinationer
  const generateDynamicOpenQuestions = () => {
    const questions = []
    const statements = SURVEY_CONFIG.sections.image.questions.image_statements.statements
    
    console.log('generateDynamicOpenQuestions - checking combinations...')
    console.log('randomizedImageBrands:', randomizedImageBrands)
    console.log('formData keys:', Object.keys(formData).filter(key => key.includes('image_statements')))
    console.log('formData values for MAX:', Object.entries(formData).filter(([key, value]) => key.includes('max') && value).map(([key, value]) => `${key}: ${value}`))
    
    // Kolla alla varumärken (endast de 6 ursprungliga för statements)
    randomizedImageBrands.forEach(brand => {
      // Hitta index för "betala mer" statement i den randomiserade listan
      const betalaMerIndex = randomizedStatements.findIndex(statement => 
        statement.includes('högre pris') || statement.includes('värt ett högre pris')
      )
      console.log(`Betala mer statement index: ${betalaMerIndex}`)
      
      // Kolla om användaren har markerat "betala mer" statement
      const hasWillingToPayMore = betalaMerIndex !== -1 && (formData[`image_statements_${betalaMerIndex}_${brand.id}`] === true || formData[`image_statements_${betalaMerIndex}_${brand.id}`] === 'yes')
      console.log(`Brand ${brand.name}: hasWillingToPayMore = ${hasWillingToPayMore}`)
      
            if (hasWillingToPayMore) {
        // Kolla endast image-attribut (inte styrka-attribut)
        const imageStatements = [
          'Detta varumärke lägger man ofta märke till',
          'Prisvärt',
          'Enkelt att vara kund',
          'Tillgängligt - finns nära mig',
          'Att vara kund här känns nästan som att vara en del av en gemenskap',
          'Känns lyhörda för kundens önskningar',
          'Är originalet, har funnits länge'
          // PLACEHOLDER ATTRIBUTES - Lägg till eller ta bort efter behov (kommenterade ut för att inte visa för användare)
          // 'Placeholder Attribute 1',
          // 'Placeholder Attribute 2',
          // 'Placeholder Attribute 3',
          // 'Placeholder Attribute 4',
          // 'Placeholder Attribute 5',
          // 'Placeholder Attribute 6',
          // 'Placeholder Attribute 7',
          // 'Placeholder Attribute 8'
        ]
        
        randomizedStatements.forEach((statement, statementIndex) => {
          // Skip "betala mer" statement och kolla endast image-attribut
          if (statementIndex !== betalaMerIndex && imageStatements.includes(statement)) {
            const hasOtherStatement = formData[`image_statements_${statementIndex}_${brand.id}`] === true || formData[`image_statements_${statementIndex}_${brand.id}`] === 'yes'
            console.log(`Brand ${brand.name}, statement ${statementIndex} (image): hasOtherStatement = ${hasOtherStatement}`)
            
            if (hasOtherStatement) {
               // Skapa dynamisk frågetext
               let questionText = ''
               if (statement.includes('rekommendera')) {
                 questionText = `Du berättade att du skulle kunna rekommendera ${brand.name} till vänner och bekanta. Kan du berätta mer om det?`
               } else if (statement.includes('kund idag')) {
                 questionText = `Du berättade att du är kund hos ${brand.name} idag. Kan du berätta mer om det?`
               } else if (statement.includes('Passar mig')) {
                 questionText = `Du berättade att du upplever att ${brand.name} passar dig och dina behov. Kan du berätta mer om det?`
               } else if (statement.includes('lägger man ofta märke till')) {
                 questionText = `Du berättade att du upplever att du ofta lägger märke till ${brand.name}. Kan du berätta mer om det?`
               } else if (statement.includes('Prisvärt')) {
                 questionText = `Du berättade att du upplever ${brand.name} som prisvärt. Kan du berätta mer om det?`
               } else if (statement.includes('Enkelt att vara kund')) {
                 questionText = `Du berättade att du upplever att det är enkelt att vara kund hos ${brand.name}. Kan du berätta mer om det?`
               } else if (statement.includes('Tillgängligt')) {
                 questionText = `Du berättade att du upplever att ${brand.name} är tillgängligt för dig. Kan du berätta mer om det?`
               } else if (statement.includes('gemenskap')) {
                 questionText = `Du berättade att du upplever att det känns som att vara en del av en gemenskap när du är kund hos ${brand.name}. Kan du berätta mer om det?`
               } else if (statement.includes('lyhörda')) {
                 questionText = `Du berättade att du upplever att ${brand.name} känns lyhörda för kundens önskningar. Kan du berätta mer om det?`
               } else if (statement.includes('originalet')) {
                 questionText = `Du berättade att du upplever att ${brand.name} är originalet och har funnits länge. Kan du berätta mer om det?`
               } else if (statement.includes('högre pris')) {
                 questionText = `Du berättade att du upplever att hamburgare från ${brand.name} är värt ett högre pris. Kan du berätta mer om det?`
               } else if (statement.includes('mest sannolikt välja')) {
                 questionText = `Du berättade att du upplever att du mest sannolikt skulle välja ${brand.name} nästa gång. Kan du berätta mer om det?`
               } else if (statement.includes('Placeholder Attribute')) {
                 questionText = `Du berättade att du upplever ${brand.name} som ${statement.toLowerCase()}. Kan du berätta mer om det?`
               } else {
                 questionText = `Du berättade att du upplever ${statement.toLowerCase()} för ${brand.name}. Kan du berätta mer om det?`
               }
              
              questions.push({
                id: `open_${brand.id}_${statementIndex}`,
                text: questionText,
                brand: brand.name,
                statement: statement
              })
            }
          }
        })
      }
    })
    
    // Begränsa till max 3 frågor
    console.log('Generated questions:', questions)
    console.log('Final questions (max 3):', questions.slice(0, 3))
    return questions.slice(0, 3)
  }

  const renderQuestion = (key, question) => {
    switch (question.type) {
      case 'select':
        return (
          <div className="question-options">
            {question.options.map(option => (
              <label key={option.value} className="option-label">
                <input
                  type="radio"
                  name={key}
                  value={option.value}
                  checked={formData[key] === option.value}
                  onChange={handleInputChange}
                  required={question.required}
                />
                <span className="option-text">{option.label}</span>
              </label>
            ))}
          </div>
        )
      
      case 'number':
        return (
          <div className="question-input">
            {key === 'age' && (
              <div className="input-hint">
                <em>Skriv antal år</em>
              </div>
            )}
            <input
              type="number"
              id={key}
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              min={question.min}
              max={question.max}
              placeholder={question.placeholder}
              required={question.required}
            />
          </div>
        )
      
      case 'brand_matrix':
        return (
          <div className="brand-matrix">
            <div className="brand-header">
              <div className="brand-logo-header"></div>
              {question.options.map((option, index) => (
                <div key={index} className="option-header">{option}</div>
              ))}
            </div>
            {randomizedBrands.map(brand => (
              <div key={brand.id} className="brand-row">
                <div className="brand-logo">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-image" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                  <span className="brand-name">{brand.name}</span>
                </div>
                {question.options.map((option, index) => (
                  <div key={index} className="option-cell">
                    <input
                      type="radio"
                      name={`${key}_${brand.id}`}
                      value={option}
                      checked={formData[`${key}_${brand.id}`] === option}
                      onChange={(e) => handleBrandSelection(key, brand.id, e.target.value)}
                      required={question.required}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      
      case 'brand_matrix_v2':
        return (
          <div className="brand-matrix-v2">
            <div className="brand-header-v2">
              <div className="brand-logo-header-v2"></div>
              {question.options.map((option, index) => (
                <div key={index} className="option-header-v2">{option}</div>
              ))}
            </div>
            {randomizedBrands.map(brand => (
              <div key={brand.id} className="brand-row-v2">
                <div className="brand-logo-v2">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-image-v2" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span className="brand-fallback-v2" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                  <span className="brand-name-v2">{brand.name}</span>
                </div>
                {question.options.map((option, index) => (
                  <div key={index} className="option-cell-v2">
                    <label style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name={`${key}_${brand.id}`}
                        value={option}
                        checked={formData[`${key}_${brand.id}`] === option}
                        onChange={(e) => handleBrandSelection(key, brand.id, e.target.value)}
                        required={question.required}
                      />
                      <span className="option-text-mobile">{option}</span>
                    </label>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )
      
      case 'brand_multiple':
        return (
          <div className="brand-multiple">
            {/* För current_customers-frågan, visa endast kända varumärken */}
            {(key === 'current_customers' ? getKnownBrandsForCurrentCustomers() : randomizedBrands).map(brand => (
              <label key={brand.id} className="brand-option">
                <input
                  type="checkbox"
                  name={`${key}_${brand.id}`}
                  checked={formData[`${key}_${brand.id}`] || false}
                  onChange={(e) => handleBrandSelection(key, brand.id, e.target.checked)}
                />
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="brand-image" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                <span className="brand-name">{brand.name}</span>
              </label>
            ))}
            <label className="brand-option">
              <input
                type="checkbox"
                name={`${key}_inget`}
                checked={formData[`${key}_inget`] || false}
                onChange={(e) => handleBrandSelection(key, 'inget', e.target.checked)}
              />
              <span className="brand-name">Inget av dessa</span>
            </label>
          </div>
        )
      
      case 'brand_single':
        return (
          <div className="brand-single">
            {/* För main_provider-frågan, visa endast kända varumärken */}
            {(key === 'main_provider' ? getKnownBrandsForCurrentCustomers() : randomizedBrands).map(brand => (
              <label key={brand.id} className="brand-option">
                <input
                  type="radio"
                  name={key}
                  value={brand.id}
                  checked={formData[key] === brand.id}
                  onChange={handleInputChange}
                  required={question.required}
                />
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className="brand-image" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                <span className="brand-name">{brand.name}</span>
              </label>
            ))}
            <label className="brand-option">
              <input
                type="radio"
                name={key}
                value="inget"
                checked={formData[key] === 'inget'}
                onChange={handleInputChange}
                required={question.required}
              />
              <span className="brand-name">Inget av dessa</span>
            </label>
          </div>
        )
      
      case 'open_multiple':
        return (
          <div className="open-multiple">
            <textarea
              name={key}
              value={formData[key] || ''}
              onChange={handleInputChange}
              placeholder="Skriv dina svar här..."
              rows={4}
              required={question.required}
              className="open-textarea"
            />
            <p className="help-text">Du kan ange flera hamburgerkedjor, separera med kommatecken.</p>
          </div>
        )
      
      case 'brand_statement_matrix':
        return (
          <div className="brand-statement-matrix">
            {question.statements.map((statement, statementIndex) => (
              <div key={statementIndex} className="statement-row">
                <div className="statement-text">
                  {statement}
                </div>
                <div className="brand-checkboxes">
                  {randomizedImageBrands.map(brand => (
                    <label key={brand.id} className="brand-checkbox">
                      <input
                        type="checkbox"
                        name={`${key}_${statementIndex}_${brand.id}`}
                        checked={formData[`${key}_${statementIndex}_${brand.id}`] || false}
                        onChange={(e) => handleStatementSelection(key, statementIndex, brand.id, e.target.checked)}
                      />
                      <span className="brand-name-small">{brand.name}</span>
                    </label>
                  ))}
                  <label className="brand-checkbox none-option">
                    <input
                      type="checkbox"
                      name={`${key}_${statementIndex}_ingen`}
                      checked={formData[`${key}_${statementIndex}_ingen`] || false}
                      onChange={(e) => handleStatementSelection(key, statementIndex, 'ingen', e.target.checked)}
                    />
                    <span className="brand-name-small">Ingen av dessa</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'brand_scale':
        return (
          <div className="brand-scale">
            <div className="scale-labels">
              {question.scale.map((scaleOption, scaleIndex) => (
                <span key={scaleIndex} className="scale-label">
                  {scaleOption.replace(/^\d+\s*/, '')}
                </span>
              ))}
            </div>
            {randomizedBrands.map(brand => (
              <div key={brand.id} className="brand-scale-row">
                <div className="brand-scale-logo">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-image" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                  <span className="brand-name">{brand.name}</span>
                </div>
                <div className="scale-options">
                  {question.scale.map((scaleOption, scaleIndex) => (
                    <label key={scaleIndex} className="scale-option">
                      <input
                        type="radio"
                        name={`${key}_${brand.id}`}
                        value={scaleIndex + 1}
                        checked={formData[`${key}_${brand.id}`] === (scaleIndex + 1).toString()}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [`${key}_${brand.id}`]: e.target.value
                        }))}
                        required={question.required}
                      />
                      <span className="scale-number">{scaleIndex + 1}</span>
                      <span className="scale-text">
                        {scaleOption.replace(/^\d+\s*/, '') || 
                          (scaleIndex + 1 === 1 ? 'Instämmer inte alls' :
                           scaleIndex + 1 === 7 ? 'Instämmer helt och hållet' :
                           `Siffra ${scaleIndex + 1}`)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'brand_scale_single':
        return (
          <div className="brand-scale-single">
            {randomizedBrands.map(brand => (
              <div key={brand.id} className="brand-scale-single-question">
                <div className="brand-scale-single-header">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-image" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                  <span className="brand-name">{brand.name}</span>
                </div>
                <div className="scale-single-options">
                  {question.scale.map((scaleOption, scaleIndex) => (
                    <label key={scaleIndex} className="scale-single-option">
                      <input
                        type="radio"
                        name={`${key}_${brand.id}`}
                        value={scaleIndex + 1}
                        checked={formData[`${key}_${brand.id}`] === (scaleIndex + 1).toString()}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          [`${key}_${brand.id}`]: e.target.value
                        }))}
                        required={question.required}
                      />
                      <span className="scale-single-number">{scaleIndex + 1}</span>
                      <span className="scale-single-text">
                        {scaleOption.replace(/^\d+\s*/, '') || 
                          (scaleIndex + 1 === 1 ? 'Instämmer inte alls' :
                           scaleIndex + 1 === 7 ? 'Instämmer helt och hållet' :
                           '')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'brand_frequency':
        return (
          <div className="brand-frequency">
            {/* Visa endast kända varumärken för purchase_frequency */}
            {getKnownBrandsForCurrentCustomers().map(brand => (
              <div key={brand.id} className="brand-frequency-row">
                <div className="brand-frequency-logo">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-image" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                  <span className="brand-name">{brand.name}</span>
                </div>
                <div className="frequency-options">
                  <select
                    name={`${key}_${brand.id}`}
                    value={formData[`${key}_${brand.id}`] || ''}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        [`${key}_${brand.id}`]: e.target.value
                      }))
                      
                      // Markera frågan som besvarad för purchase_frequency
                      if (key === 'purchase_frequency') {
                        setAnsweredQuestions(prev => ({
                          ...prev,
                          [key]: true
                        }))
                      }
                    }}
                    required={question.required}
                    className="frequency-select"
                  >
                    <option value="">Välj frekvens</option>
                    {question.frequency_options.map((option, optionIndex) => (
                      <option key={optionIndex} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        )
      
      case 'multiple_choice':
        return (
          <div className="multiple-choice-options">
            {key === 'importance_attributes' ? (
              <>
                {randomizedImportanceOptions.map((option, index) => (
                  <label key={index} className="multiple-choice-option">
                    <input
                      type="checkbox"
                      name={`${key}_${index}`}
                      checked={formData[`${key}_${index}`] || false}
                      onChange={(e) => handleImportanceSelection(key, index, e.target.checked)}
                    />
                    <span className="multiple-choice-text">{option}</span>
                  </label>
                ))}
                <label className="multiple-choice-option">
                  <input
                    type="checkbox"
                    name={`${key}_inget`}
                    checked={formData[`${key}_inget`] || false}
                    onChange={(e) => handleImportanceSelection(key, 'inget', e.target.checked)}
                  />
                  <span className="multiple-choice-text">Inget av dessa</span>
                </label>
              </>
            ) : (
              question.options.map((option, index) => (
                <label key={index} className="multiple-choice-option">
                  <input
                    type="checkbox"
                    name={`${key}_${index}`}
                    checked={formData[`${key}_${index}`] || false}
                    onChange={(e) => {
                      setFormData(prev => {
                        const newData = { ...prev }
                        
                        // Speciallogik för children_ages - exklusivitet
                        if (key === 'children_ages') {
                          if (index === 0) { // "Nej, inga barn"
                            if (e.target.checked) {
                              // Rensa alla andra val
                              question.options.forEach((_, i) => {
                                if (i !== 0) {
                                  newData[`${key}_${i}`] = false
                                }
                              })
                            }
                          } else { // Barn i specifika åldersgrupper
                            if (e.target.checked) {
                              // Avmarkera "Nej, inga barn"
                              newData[`${key}_0`] = false
                            }
                          }
                        }
                        
                        newData[`${key}_${index}`] = e.target.checked
                        return newData
                      })
                      
                      // Markera frågan som besvarad för children_ages
                      if (key === 'children_ages') {
                        setAnsweredQuestions(prev => ({
                          ...prev,
                          [key]: true
                        }))
                      }
                    }}
                  />
                  <span className="multiple-choice-text">{option}</span>
                </label>
              ))
            )}
          </div>
        )
      
      case 'brand_share':
        const frequentBrands = getFrequentBrands()
        
        // Visa inte frågan alls om det inte finns några frekventa kedjor
        if (frequentBrands.length === 0) {
          return null
        }
        
        // Visa inte frågan om det bara finns en kedja (automatiskt 100%)
        if (frequentBrands.length === 1) {
          return null
        }
        
        return (
          <div className="brand-share">
            <div className="share-instructions">
              <p>Ange procent för varje kedja du köper från minst varje år. Summan ska bli 100%.</p>
            </div>
            {frequentBrands.map(brand => (
              <div key={brand.id} className="brand-share-row">
                <div className="brand-share-logo">
                  <img 
                    src={brand.logo} 
                    alt={brand.name} 
                    className="brand-image" 
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'inline';
                    }}
                  />
                  <span className="brand-fallback" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                  <span className="brand-name">{brand.name}</span>
                </div>
                <div className="share-input">
                  <input
                    type="number"
                    name={`${key}_${brand.id}`}
                    value={formData[`${key}_${brand.id}`] || ''}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="0"
                    className="share-percentage-input"
                  />
                  <span className="percentage-symbol">%</span>
                </div>
              </div>
            ))}
            <div className="share-total">
              <span>Totalt: {frequentBrands.reduce((sum, brand) => {
                const value = parseInt(formData[`${key}_${brand.id}`]) || 0
                return sum + value
              }, 0)}% ({100 - frequentBrands.reduce((sum, brand) => {
                const value = parseInt(formData[`${key}_${brand.id}`]) || 0
                return sum + value
              }, 0)}% kvar att fördela)</span>
            </div>
          </div>
        )
      
      case 'security_check':
        if (!randomizedSecurityQuestions || randomizedSecurityQuestions.length === 0) {
          return <div>Laddar säkerhetsfrågor...</div>
        }
        
        // Visa bara den aktuella säkerhetsfrågan
        const currentQuestion = randomizedSecurityQuestions[currentSecurityQuestion]
        if (!currentQuestion) {
          return <div>Inga fler säkerhetsfrågor</div>
        }
        
        return (
          <div className="security-questions">
            <div className="security-question">
              <div className="security-question-text">
                {currentQuestion.question}
              </div>
              <div className="security-options">
                {currentQuestion.options.map((option, optionIndex) => (
                  <label key={optionIndex} className="security-option">
                    <input
                      type="radio"
                      name={`${key}_${currentSecurityQuestion}`}
                      value={option}
                      checked={formData[`${key}_${currentSecurityQuestion}`] === option}
                      onChange={(e) => {
                        handleInputChange(e)
                        // Automatiskt gå till nästa fråga efter en kort fördröjning
                        setTimeout(() => {
                          if (currentSecurityQuestion < randomizedSecurityQuestions.length - 1) {
                            setCurrentSecurityQuestion(currentSecurityQuestion + 1)
                          }
                        }, 500)
                      }}
                      required={question.required}
                    />
                    <span className="security-option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="security-progress">
              Fråga {currentSecurityQuestion + 1} av {randomizedSecurityQuestions.length}
            </div>
          </div>
        )
      
      case 'dynamic_open_questions':
        // Denna hanteras nu i renderPage för open_questions sidan
        return null
      
      default:
        return null
    }
  }

  const renderPage = () => {
    const currentPageData = pages[currentPage]
    
    // Security sida - utan kategoridefinition
    if (currentPageData.key === 'security') {
      const section = SURVEY_CONFIG.sections[currentPageData.key]
      if (!section) return null
      
      return (
        <div className="page-content">
          {Object.entries(section.questions).map(([key, question], index) => {
            if (!shouldShowQuestion(key, index)) {
              return null
            }
            
            const renderedQuestion = renderQuestion(key, question)
            if (renderedQuestion === null) {
              return null
            }
            
            return (
              <div key={key} className="question-group">
                <label className="question-label">
                  {question.label}
                </label>
                {renderedQuestion}
              </div>
            )
          })}
        </div>
      )
    }
    
    // Image sida (statements)
    if (currentPageData.key === 'image') {
      return (
        <div className="page-content statements-container">
          <div className="frozen-instructions">
            <div className="instructions">
              <p><strong>Instruktioner:</strong> För varje påstående nedan, välj de varumärken som du tycker passar bäst in. Det finns inga rätt eller fel, utgå gärna från din magkänsla. Du kan välja flera alternativ för varje påstående.</p>
            </div>
          </div>
          
          <div className="statements-list">
            {randomizedStatements.map((statement, statementIndex) => {
              if (!shouldShowStatement(statementIndex)) {
                return null
              }
              
              return (
                <div key={statementIndex} className="statement-row">
                  <div className="statement-text">
                    {statement}
                  </div>
                  <div className="brand-checkboxes">
                    {randomizedImageBrands.map(brand => (
                      <label key={brand.id} className="brand-checkbox">
                        <input
                          type="checkbox"
                          name={`image_statements_${statementIndex}_${brand.id}`}
                          checked={formData[`image_statements_${statementIndex}_${brand.id}`] || false}
                          onChange={(e) => {
                            console.log(`Checkbox changed: image_statements_${statementIndex}_${brand.id} = ${e.target.checked}`)
                            handleStatementSelection('image_statements', statementIndex, brand.id, e.target.checked)
                          }}
                        />
                        <img 
                          src={brand.logo} 
                          alt={brand.name} 
                          className="brand-image-small" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'inline';
                          }}
                        />
                        <span className="brand-fallback-small" style={{display: 'none'}}>{brand.name.charAt(0)}</span>
                        <span className="brand-name-small">{brand.name}</span>
                      </label>
                    ))}
                    <label className="brand-checkbox">
                      <input
                        type="checkbox"
                        name={`image_statements_${statementIndex}_ingen`}
                        checked={formData[`image_statements_${statementIndex}_ingen`] || false}
                        onChange={(e) => handleStatementSelection('image_statements', statementIndex, 'ingen', e.target.checked)}
                      />
                      <span className="brand-name-small">Ingen av dessa</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    // Open questions sida - visa en fråga i taget
    if (currentPageData.key === 'open_questions') {
      const openQuestions = generateDynamicOpenQuestions()
      if (openQuestions.length === 0) return null
      
      // Visa frågan baserat på currentOpenQuestionIndex
      const currentQuestion = openQuestions[currentOpenQuestionIndex]
      if (!currentQuestion) return null
      
      return (
        <div className="page-content">
          <div className="question-group">
            <label className="question-label">
              {currentQuestion.text}
            </label>
            <textarea
              id={currentQuestion.id}
              name={currentQuestion.id}
              value={formData[currentQuestion.id] || ''}
              onChange={handleInputChange}
              placeholder="Skriv ditt svar här..."
              required={true}
              rows={4}
              className="open-question-textarea"
            />
          </div>
        </div>
      )
    }
    
    // Vanliga sektioner
    const section = SURVEY_CONFIG.sections[currentPageData.key]
    if (!section) return null
    
    // Special styling för consideration-frågan
    if (currentPageData.key === 'consideration') {
      return (
        <div className="page-content statements-container">
          <div className="frozen-instructions">
            <div className="instructions">
              <p><strong>{section.questions.strength_scale.label}</strong></p>
            </div>
          </div>
          
          <div className="statements-list">
            {Object.entries(section.questions).map(([key, question], index) => {
              if (!shouldShowQuestion(key, index)) {
                return null
              }
              
              const renderedQuestion = renderQuestion(key, question)
              if (renderedQuestion === null) {
                return null
              }
              
              return (
                <div key={key} className="question-group">
                  {renderedQuestion}
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    return (
      <div className="page-content statements-container">
        <div className="frozen-instructions">
        </div>
        
        <div className="statements-list">
          {Object.entries(section.questions).map(([key, question], index) => {
            if (!shouldShowQuestion(key, index)) {
              return null
            }
            
            const renderedQuestion = renderQuestion(key, question)
            if (renderedQuestion === null) {
              return null
            }
            
            return (
              <div key={key} className="question-group">
                <label className="question-label">
                  {question.label}
                </label>
                {renderedQuestion}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (isSubmitted) {
    return (
      <div className="app">
        <div className="survey-container">
          <div className="survey-header">
            <h1>{SURVEY_CONFIG.title}</h1>
            <h2>{SURVEY_CONFIG.subtitle}</h2>
          </div>
          
          <div className="success-message">
            <h3>Tack för ditt svar!</h3>
            <p>Din enkät har skickats in framgångsrikt.</p>
            {!supabase && <p><em>Demo-läge: Data sparades inte till databas</em></p>}
            <button onClick={resetForm} className="submit-btn">
              Skicka ett till svar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="survey-container">
        {currentPage > 0 && (
          <div className="survey-header">
            <h1>{SURVEY_CONFIG.title}</h1>
            <h2>{SURVEY_CONFIG.subtitle}</h2>
          </div>
        )}
        {currentPage === 0 && (
          <div className="survey-header security-header">
            <h1></h1>
            <h2></h2>
          </div>
        )}
        
        <div className="survey-form" onKeyDown={handleKeyDown} tabIndex={0}>
          {renderPage()}
        </div>

        <div className="page-navigation">
          {currentPage > 0 && (
            <button onClick={prevPage} className="nav-btn prev-btn">
              ← Föregående
            </button>
          )}
          
          {currentPage < pages.length - 1 ? (
            <button onClick={nextPage} className="nav-btn next-btn">
              Nästa →
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              className="submit-btn"
              disabled={isLoading}
            >
              {isLoading ? 'Skickar...' : 'Skicka svar'}
            </button>
          )}
          
          {!supabase && (
            <div style={{ marginTop: '10px', fontSize: '0.8em', color: '#666' }}>
              Demo-läge - ingen databasanslutning
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App // Vercel deployment trigger - Fri Aug  1 19:39:20 CEST 2025
