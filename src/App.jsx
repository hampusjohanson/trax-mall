import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import './App.css'

// Skapa Supabase-klient
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Enkät-konfiguration för hamburgerkedjor
const SURVEY_CONFIG = {
  version: 1,
  title: "Denna enkät handlar om hamburgerkedjor som erbjuder snabbmat för att äta på plats eller ta med.",
  subtitle: "",
  category: "Denna enkät handlar om hamburgerkedjor som erbjuder snabbmat för att äta på plats eller ta med.",
  brands: [
    { id: 'mcdonalds', name: 'McDonald\'s', logo: '/images/mcdonalds.png' },
    { id: 'burger_king', name: 'Burger King', logo: '/images/burger-king.svg' },
    { id: 'max', name: 'MAX', logo: '/images/max.png' },
    { id: 'sibylla', name: 'Sibylla', logo: '/images/sibylla.png' },
    { id: 'bastard_burgers', name: 'Bastard Burgers', logo: '/images/bastard-burgers.svg' },
    { id: 'prime_burger', name: 'Prime Burger', logo: '/images/prime-burger.svg' }
  ],
  sections: {
    screening: {
      title: "",
      questions: {
        age: {
          type: 'number',
          label: 'Ålder:',
          required: true,
          min: 16,
          max: 74,
          placeholder: 'Ange din ålder (16-74 år)'
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
            'Att vara kund här känns nästan som att vara en del av en gemenskap'
          ]
        },
        strength_scale: {
          type: 'brand_scale',
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
        },
        importance_attributes: {
          type: 'multiple_choice',
          label: 'Vilka av följande faktorer är viktiga för dig när du väljer hamburgerkedja? Du kan välja flera alternativ.',
          required: true,
          options: [
            'Prisvärt',
            'Enkelt att vara kund',
            'Tillgängligt - finns nära mig',
            'Detta varumärke lägger man ofta märke till',
            'Att vara kund här känns nästan som att vara en del av en gemenskap'
          ]
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
  const [randomizedStatements, setRandomizedStatements] = useState([])
  const [randomizedImportanceOptions, setRandomizedImportanceOptions] = useState([])
  const [isInitialized, setIsInitialized] = useState(false)
  const [currentPage, setCurrentPage] = useState(0) // 0: screening, 1: awareness, 2: statements, 3: behavior, 4: background
  const [connectionStatus, setConnectionStatus] = useState('')
  const [submissionCount, setSubmissionCount] = useState(0)
  const [answeredQuestions, setAnsweredQuestions] = useState({})

  // Definiera sidorna i ordning
  const pages = [
    { key: 'screening', title: '' },
    { key: 'awareness_v2', title: '' },
    { key: 'statements', title: '' },
    { key: 'behavior', title: '' },
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
      
      // Randomisera ordningen av brands EN gång per respondent
      const shuffled = [...SURVEY_CONFIG.brands].sort(() => Math.random() - 0.5)
      setRandomizedBrands(shuffled)
      
      // Randomisera ordningen av statements EN gång per respondent
      const statements = SURVEY_CONFIG.sections.image.questions.image_statements.statements
      const shuffledStatements = [...statements].sort(() => Math.random() - 0.5)
      setRandomizedStatements(shuffledStatements)
      
      // Randomisera ordningen av importance options EN gång per respondent
      const importanceOptions = SURVEY_CONFIG.sections.behavior.questions.importance_attributes.options
      const shuffledImportanceOptions = [...importanceOptions].sort(() => Math.random() - 0.5)
      setRandomizedImportanceOptions(shuffledImportanceOptions)
      
      setIsInitialized(true)
    }
  }, [isInitialized])

  // Testa Supabase-anslutning och hämta antal svar
  useEffect(() => {
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
      // Skapa JSON-objekt med alla svar
      const surveyResponse = {
        version: SURVEY_CONFIG.version,
        category: SURVEY_CONFIG.category,
        responses: formData,
        submitted_at: new Date().toISOString()
      }

      // Lägg till svaret
      const { data, error } = await supabase
        .from('survey_responses_flexible')
        .insert([surveyResponse])

      if (error) {
        console.error('Error submitting:', error)
        alert('Ett fel uppstod när svaret skulle sparas. Försök igen.')
      } else {
        setIsSubmitted(true)
        // fetchSubmissionCount() // This line was removed
      }
    } catch (err) {
      console.error('Submission error:', err)
      alert('Ett fel uppstod. Försök igen.')
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setCurrentPage(0) // Gå tillbaka till första sidan
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

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const isQuestionAnswered = (questionKey) => {
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
    
    return isQuestionAnswered(previousQuestionKey)
  }

  const shouldShowStatement = (statementIndex) => {
    if (statementIndex === 0) return true // Visa första statement alltid
    
    // Kontrollera om föregående statement är besvarad
    const previousStatementKey = `image_statements_${statementIndex - 1}`
    return isQuestionAnswered(previousStatementKey)
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
            {randomizedBrands.map(brand => (
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
            {randomizedBrands.map(brand => (
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
                  {randomizedBrands.map(brand => (
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
                      <span className="scale-text">{scaleOption}</span>
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
            {randomizedBrands.map(brand => (
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
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [`${key}_${brand.id}`]: e.target.value
                    }))}
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
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      [`${key}_${index}`]: e.target.checked
                    }))}
                  />
                  <span className="multiple-choice-text">{option}</span>
                </label>
              ))
            )}
          </div>
        )
      
      default:
        return null
    }
  }

  const renderPage = () => {
    const currentPageData = pages[currentPage]
    
    // Statements sida
    if (currentPageData.key === 'statements') {
      return (
        <div className="page-content statements-container">
          <div className="frozen-instructions">
            <div className="instructions">
              <p><strong>Instruktioner:</strong> För varje påstående nedan, välj de hamburgerkedjor som du tycker passar bäst. Du kan välja flera alternativ.</p>
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
                    {randomizedBrands.map(brand => (
                      <label key={brand.id} className="brand-checkbox">
                        <input
                          type="checkbox"
                          name={`image_statements_${statementIndex}_${brand.id}`}
                          checked={formData[`image_statements_${statementIndex}_${brand.id}`] || false}
                          onChange={(e) => handleStatementSelection('image_statements', statementIndex, brand.id, e.target.checked)}
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
    
    // Vanliga sektioner
    const section = SURVEY_CONFIG.sections[currentPageData.key]
    if (!section) return null
    
    return (
      <div className="page-content">
        {Object.entries(section.questions).map(([key, question], index) => {
          if (!shouldShowQuestion(key, index)) {
            return null
          }
          
          return (
            <div key={key} className="question-group">
              <label className="question-label">
                {question.label}
              </label>
              {renderQuestion(key, question)}
            </div>
          )
        })}
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
        <div className="survey-header">
          <h1>{SURVEY_CONFIG.title}</h1>
          <h2>{SURVEY_CONFIG.subtitle}</h2>
        </div>
        
        <div className="survey-form">
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
        </div>
      </div>
    </div>
  )
}

export default App 