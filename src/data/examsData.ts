export interface ExamSubItem {
  id: string;
  name: string;
  hindiName?: string;
  fullName: string;
  badge?: string;
  officialBoard?: string;
  logoUrl?: string;
  gradientBorder?: string;
  vacancies?: string;
  eligibility: string;
  pattern: string;
  totalMarks: string;
  negativeMarking?: string;
  description: string;
  hindiDescription?: string;
  syllabusHighlights?: string[];
  recommendedBookIds?: string[];
  mockTestIds?: string[];
  freePdfIds?: string[];
  popular?: boolean;
}

export interface ExamCategoryGroup {
  id: string;
  name: string;
  hindiName: string;
  icon: string;
  description: string;
  color: string;
  exams: ExamSubItem[];
}

export const EXAMS_CATEGORIES_DATA: ExamCategoryGroup[] = [
  {
    id: 'ssc',
    name: 'SSC Exams',
    hindiName: 'एसएससी परीक्षाएं',
    icon: 'Briefcase',
    description: 'Staff Selection Commission recruitment examinations for Central Government departments',
    color: 'from-blue-600 to-indigo-700',
    exams: [
      {
        id: 'ssc-cgl',
        name: 'SSC CGL',
        hindiName: 'एसएससी सीजीएल (Combined Graduate Level)',
        fullName: 'Combined Graduate Level Examination (Tier I & Tier II)',
        badge: 'Top Choice',
        vacancies: '17,727+ Posts',
        eligibility: 'Bachelor Degree in any discipline from recognized University',
        pattern: 'CBT Tier I (100 Qs / 200 Marks) + Tier II (Paper I Computer Based)',
        totalMarks: '390 Marks (Tier II Merit)',
        negativeMarking: '-0.50 in Tier I, -1.0 in Tier II',
        description: 'SSC CGL is India\'s most prestigious graduate examination for posts such as Assistant Section Officer (ASO), Inspector of Central Excise, Preventive Officer, Income Tax Inspector, and Auditor in Ministries.',
        hindiDescription: 'भारत सरकार के विभिन्न मंत्रालयों एवं विभागों में ग्रुप B और C पदों (इनकम टैक्स इंस्पेक्टर, ASO, सेंट्रल एक्साइज) हेतु आयोजित सर्वाधिक प्रतिष्ठित परीक्षा।',
        syllabusHighlights: [
          'Mathematical Abilities (Quantitative Aptitude)',
          'Reasoning and General Intelligence',
          'English Language and Comprehension',
          'General Awareness (Polity, History, Economy, Science, Current Affairs)',
          'Computer Knowledge Module & Data Entry Speed Test (DEST)'
        ],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh', 'samanya-adhyayan-vol1', 'ssc-cgl-tier1-solved-papers'],
        mockTestIds: ['test-ssc-cgl-prelims-01'],
        popular: true
      },
      {
        id: 'ssc-chsl',
        name: 'SSC CHSL',
        hindiName: 'एसएससी सीएचएसएल (10+2 Level)',
        fullName: 'Combined Higher Secondary Level (LDC, JSA, DEO)',
        badge: 'Trending',
        vacancies: '3,712+ Posts',
        eligibility: '12th Standard or equivalent from a recognized Board',
        pattern: 'CBT Tier I + Tier II (Session I & Skill Test)',
        totalMarks: '360 Marks (Tier II Merit)',
        negativeMarking: '-0.50 Tier I, -1.0 Tier II',
        description: 'Recruitment for Lower Division Clerk (LDC), Junior Secretariat Assistant (JSA), and Data Entry Operator (DEO) across Central Government Ministries.',
        hindiDescription: 'केन्द्रीय मंत्रालयों एवं विभागों में 12वीं पास अभ्यर्थियों हेतु लोअर डिवीजन क्लर्क और डेटा एंट्री ऑपरेटर भर्ती।',
        syllabusHighlights: ['General Intelligence', 'English Language', 'Quantitative Aptitude', 'General Awareness'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'ssc-gd',
        name: 'SSC GD Constable',
        hindiName: 'एसएससी जीडी कांस्टेबल',
        fullName: 'Constable (GD) in Central Armed Police Forces (CAPFs), SSF & Rifleman in Assam Rifles',
        badge: 'High Vacancies',
        vacancies: '39,481+ Posts',
        eligibility: '10th Class (Matriculation) pass from recognized Board',
        pattern: 'Computer Based Examination (80 Qs / 160 Marks) + PST/PET',
        totalMarks: '160 Marks (60 Minutes)',
        negativeMarking: '-0.25 Marks for each wrong answer',
        description: 'General Duty Constable in BSF, CISF, CRPF, ITBP, SSB, SSF and Assam Rifles.',
        hindiDescription: 'केन्द्रीय सशस्त्र पुलिस बलों (BSF, CRPF, CISF, ITBP) में 10वीं पास युवाओं हेतु विशाल भर्ती।',
        syllabusHighlights: ['General Intelligence & Reasoning', 'General Knowledge & General Awareness', 'Elementary Mathematics', 'English / Hindi'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'ssc-mts',
        name: 'SSC MTS & Havaldar',
        hindiName: 'एसएससी एमटीएस एवं हवलदार',
        fullName: 'Multi Tasking (Non-Technical) Staff and Havaldar in CBIC and CBN',
        badge: 'Matric Pass',
        vacancies: '9,583+ Posts',
        eligibility: '10th Standard / Matriculation',
        pattern: 'CBT Session I (Math + Reasoning) & Session II (GK + English)',
        totalMarks: '150 Marks (Session II Merit)',
        negativeMarking: 'No negative marking in Session I; -1 Mark in Session II',
        description: 'Multi Tasking Staff across Central Government offices and Havaldar in Central Board of Indirect Taxes and Narcotics.',
        hindiDescription: 'भारत सरकार के मंत्रालयों एवं सीबीआईसी/सीबीएन में एमटीएस व हवलदार पद।',
        syllabusHighlights: ['Numerical and Mathematical Ability', 'Reasoning Ability', 'General Awareness', 'English Language'],
        recommendedBookIds: ['samanya-adhyayan-vol1']
      },
      {
        id: 'ssc-cpo',
        name: 'SSC CPO',
        hindiName: 'एसएससी सीपीओ (SI in Delhi Police & CAPFs)',
        fullName: 'Sub-Inspector in Delhi Police and Central Armed Police Forces',
        badge: 'Sub-Inspector',
        vacancies: '4,187+ Posts',
        eligibility: 'Bachelor Degree + Valid Driving License for Delhi Police',
        pattern: 'Paper I (200 Qs / 200 Marks) + PET/PST + Paper II (English 200 Marks)',
        totalMarks: '400 Marks Total',
        negativeMarking: '-0.25 Marks',
        description: 'Direct entry for Sub-Inspectors in Delhi Police, BSF, CRPF, CISF, ITBP and SSB.',
        hindiDescription: 'दिल्ली पुलिस एवं केंद्रीय अर्धसैनिक बलों में सब-इंस्पेक्टर पद पर सीधी भर्ती।',
        syllabusHighlights: ['General Intelligence & Reasoning', 'General Knowledge', 'Quantitative Aptitude', 'English Comprehension']
      },
      {
        id: 'ssc-stenographer',
        name: 'SSC Stenographer',
        hindiName: 'एसएससी स्टेनोग्राफर (Grade C & D)',
        fullName: 'Stenographer Grade C & D Examination',
        vacancies: '2,006+ Posts',
        eligibility: '12th Pass + Stenography Skill (Hindi/English)',
        pattern: 'CBT (200 Qs / 200 Marks) + Skill Test in Stenography',
        totalMarks: '200 Marks',
        negativeMarking: '-0.25 Marks',
        description: 'Stenographers in Central Government Ministries, Subordinate offices, and Armed Forces Headquarters.',
        hindiDescription: 'केन्द्रीय मंत्रालयों में आशुलिपिक (स्टेनोग्राफर ग्रेड सी व डी) पद।',
        syllabusHighlights: ['General Intelligence & Reasoning', 'General Awareness', 'English Language & Comprehension']
      },
      {
        id: 'ssc-selection-post',
        name: 'SSC Selection Post',
        hindiName: 'एसएससी सेलेक्शन पोस्ट (Phase XII / XIII)',
        fullName: 'Selection Post Phase Examination (Matric, 10+2, Graduate)',
        vacancies: '2,049+ Posts',
        eligibility: 'Matriculation, 10+2, or Graduation depending on post category',
        pattern: 'CBT (100 Qs / 200 Marks)',
        totalMarks: '200 Marks',
        negativeMarking: '-0.50 Marks',
        description: 'Specialized scientific, technical, and ministerial vacancies across Central ministries.',
        hindiDescription: 'विभिन्न मंत्रालयों में विशिष्ट तकनीकी व प्रशासनिक पदों हेतु परीक्षा।',
        syllabusHighlights: ['General Intelligence', 'General Awareness', 'Quantitative Aptitude', 'English Language']
      },
      {
        id: 'ssc-je',
        name: 'SSC JE (Junior Engineer)',
        hindiName: 'एसएससी जूनियर इंजीनियर',
        fullName: 'Junior Engineer (Civil, Mechanical & Electrical) Examination',
        vacancies: '1,765+ Posts',
        eligibility: 'Degree or Diploma in Civil / Electrical / Mechanical Engineering',
        pattern: 'Paper I (CBT 200 Marks) + Paper II (CBT Technical 300 Marks)',
        totalMarks: '500 Marks',
        negativeMarking: '-0.25 Marks Paper I, -1.0 Mark Paper II',
        description: 'CPWD, MES, CWC and BRO Junior Engineer recruitments.',
        hindiDescription: 'सीपीडब्ल्यूडी एवं एमईएस में सिविल, इलेक्ट्रिकल व मैकेनिकल जूनियर इंजीनियर भर्ती।',
        syllabusHighlights: ['General Intelligence & Reasoning', 'General Awareness', 'Part A/B/C Engineering Technical Subject']
      }
    ]
  },
  {
    id: 'banking',
    name: 'Banking Exams',
    hindiName: 'बैंकिंग परीक्षाएं',
    icon: 'Landmark',
    description: 'Public Sector Banks, State Bank of India, and Reserve Bank of India recruitments',
    color: 'from-sky-600 to-cyan-700',
    exams: [
      {
        id: 'ibps-rrb-clerk',
        name: 'IBPS RRB Clerk',
        hindiName: 'आईबीपीएस आरआरबी क्लर्क (Office Assistant)',
        fullName: 'Common Recruitment Process for RRBs (CRP RRBs XIII) - Office Assistant (Multipurpose)',
        badge: 'High Speed',
        vacancies: '5,585+ Posts',
        eligibility: 'Bachelor Degree in any discipline + Proficiency in local language',
        pattern: 'Prelims (80 Qs / 80 Marks / 45 Min) + Mains (200 Qs / 200 Marks / 2 Hours)',
        totalMarks: '200 Marks (Mains Merit, No Interview)',
        negativeMarking: '-0.25 of marks assigned to question',
        description: 'Recruitment for Office Assistant (Multipurpose) across 43 Regional Rural Banks of India (Aryavart, Baroda UP Bank, Prathama, Dakshin Bihar, etc.).',
        hindiDescription: 'देश के 43 क्षेत्रीय ग्रामीण बैंकों में ऑफिस असिस्टेंट (मल्टीपर्पज) पद पर भर्ती। क्षेत्रीय भाषा में परीक्षा की सुविधा।',
        syllabusHighlights: [
          'Reasoning Ability (Puzzles, Seating Arrangement, Syllogism)',
          'Quantitative Aptitude / Numerical Ability (DI, Simplification, Arithmetic)',
          'General Awareness (Banking, Financial Awareness & Current Affairs)',
          'English Language or Hindi Language (Candidate Choice)',
          'Computer Knowledge'
        ],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh', 'samanya-adhyayan-vol1'],
        mockTestIds: ['test-sbi-clerk-mains-01'],
        popular: true
      },
      {
        id: 'sbi-clerk',
        name: 'SBI Clerk',
        hindiName: 'एसबीआई क्लर्क (Junior Associate)',
        fullName: 'State Bank of India Junior Associates (Customer Support & Sales)',
        badge: 'Premier Bank',
        vacancies: '8,773+ Posts',
        eligibility: 'Graduation in any discipline from a recognized University',
        pattern: 'Phase I (Prelims 100 Qs / 100 Marks / 60 Min) + Phase II (Mains 190 Qs / 200 Marks / 160 Min)',
        totalMarks: '200 Marks (No Interview)',
        negativeMarking: '-0.25 Marks for wrong answers',
        description: 'India\'s largest commercial bank recruitment for Customer Support & Sales Junior Associates across pan-India circles.',
        hindiDescription: 'भारतीय स्टेट बैंक में जूनियर एसोसिएट (ग्राहक सहायता एवं बिक्री) पदों पर राष्ट्रीय स्तर की भर्ती।',
        syllabusHighlights: ['English Language', 'Numerical Ability', 'Reasoning Ability & Computer Aptitude', 'General/Financial Awareness'],
        mockTestIds: ['test-sbi-clerk-mains-01'],
        popular: true
      },
      {
        id: 'ibps-rrb-po',
        name: 'IBPS RRB PO',
        hindiName: 'आईबीपीएस आरआरबी पीओ (Officer Scale I)',
        fullName: 'Regional Rural Banks Officer Scale I (Assistant Manager)',
        badge: 'Officer Grade',
        vacancies: '3,551+ Posts',
        eligibility: 'Graduation in any stream (preference for Agriculture, IT, Law, Economics)',
        pattern: 'Prelims (80 Qs / 80 Marks) + Mains (200 Qs / 200 Marks) + Interview (100 Marks)',
        totalMarks: 'Weighted Score 80:20 (Mains : Interview)',
        negativeMarking: '-0.25 Marks',
        description: 'Assistant Manager posts in Regional Rural Banks with strong rural development leadership exposure.',
        hindiDescription: 'क्षेत्रीय ग्रामीण बैंकों में ऑफिसर स्केल-1 (असिस्टेंट मैनेजर) पद पर भर्ती।',
        syllabusHighlights: ['Reasoning', 'Quantitative Aptitude', 'General Awareness', 'Hindi / English Language', 'Computer Knowledge'],
        popular: true
      },
      {
        id: 'ibps-po',
        name: 'IBPS PO',
        hindiName: 'आईबीपीएस पीओ (Probationary Officer)',
        fullName: 'Common Recruitment Process for Probationary Officers in 11 Public Sector Banks',
        badge: 'Prestigious',
        vacancies: '4,455+ Posts',
        eligibility: 'Graduation in any discipline',
        pattern: 'Prelims + Mains (Objective + Descriptive Letter/Essay) + Interview',
        totalMarks: '225 Marks Mains + 100 Marks Interview',
        negativeMarking: '-0.25 Marks',
        description: 'Probationary Officer recruitments in PNB, Bank of Baroda, Canara Bank, Union Bank, Indian Bank, and other PSBs.',
        hindiDescription: '11 राष्ट्रीयकृत बैंकों में प्रोबेशनरी ऑफिसर पद पर भर्ती।',
        syllabusHighlights: ['Reasoning & Computer', 'Data Analysis & Interpretation', 'General Economy/Banking Awareness', 'English Language', 'Descriptive Paper'],
        popular: true
      },
      {
        id: 'ibps-clerk',
        name: 'IBPS Clerk',
        hindiName: 'आईबीपीएस क्लर्क',
        fullName: 'Clerical Cadre in Participating Public Sector Banks',
        badge: 'High Intake',
        vacancies: '6,128+ Posts',
        eligibility: 'Bachelor Degree + Local Language Proficiency',
        pattern: 'Prelims (100 Marks) + Mains (200 Marks, No Interview)',
        totalMarks: '200 Marks',
        negativeMarking: '-0.25 Marks',
        description: 'Clerical recruitment in 11 nationalized banks across 28 states and 8 union territories.',
        hindiDescription: 'सार्वजनिक क्षेत्र के 11 राष्ट्रीयकृत बैंकों में क्लर्क भर्ती।',
        syllabusHighlights: ['General/Financial Awareness', 'General English', 'Reasoning Ability & Computer Aptitude', 'Quantitative Aptitude'],
        popular: true
      },
      {
        id: 'sbi-po',
        name: 'SBI PO',
        hindiName: 'एसबीआई पीओ (Probationary Officer)',
        fullName: 'State Bank of India Probationary Officer',
        badge: 'Elite Banking',
        vacancies: '2,000+ Posts',
        eligibility: 'Graduation in any stream (Final year students eligible)',
        pattern: 'Phase I (Prelims) + Phase II (Mains + Descriptive) + Phase III (Psychometric, GE & Interview)',
        totalMarks: '250 Marks Mains + 50 Marks Group Exercise & Interview',
        negativeMarking: '-0.25 Marks',
        description: 'The most prestigious entry-level officer career in Indian banking, offering accelerated promotions and high remuneration.',
        hindiDescription: 'भारतीय स्टेट बैंक में प्रोबेशनरी ऑफिसर पद, बैंकिंग क्षेत्र का सर्वाधिक प्रतिष्ठित पद।',
        syllabusHighlights: ['Reasoning & Computer Aptitude', 'Data Analysis & Interpretation', 'General/Economy/Banking Awareness', 'English & Essay/Letter Writing'],
        popular: true
      },
      {
        id: 'rbi-assistant',
        name: 'RBI Assistant',
        hindiName: 'आरबीआई असिस्टेंट',
        fullName: 'Reserve Bank of India Assistant in Various Regional Offices',
        badge: 'Central Bank',
        vacancies: '450+ Posts',
        eligibility: 'Bachelor Degree with minimum 50% marks + Word processing on PC',
        pattern: 'Prelims (100 Marks) + Mains (200 Marks) + Language Proficiency Test (LPT)',
        totalMarks: '200 Marks',
        negativeMarking: '-0.25 Marks',
        description: 'Central Banking service under the Reserve Bank of India with postings in metro regional capitals.',
        hindiDescription: 'भारतीय रिज़र्व बैंक (RBI) में असिस्टेंट पद पर भर्ती। उत्कृष्ट कार्य-जीवन संतुलन।',
        syllabusHighlights: ['Test of Reasoning', 'English Language', 'Numerical Ability', 'General Awareness', 'Computer Knowledge']
      },
      {
        id: 'rbi-grade-b',
        name: 'RBI Grade B',
        hindiName: 'आरबीआई ग्रेड बी ऑफिसर',
        fullName: 'Officers in Grade B (General / DEPR / DSIM) in Reserve Bank of India',
        badge: 'Apex Role',
        vacancies: '130+ Posts',
        eligibility: 'Graduation with min 60% marks (50% for SC/ST/PwBD)',
        pattern: 'Phase I (CBT 200 Marks) + Phase II (Economic & Social Issues, English, Finance & Management) + Interview',
        totalMarks: '300 Marks Phase II + 75 Marks Interview',
        negativeMarking: '-0.25 Marks Phase I',
        description: 'Direct recruitment for central banking policymaking officers at the Reserve Bank of India.',
        hindiDescription: 'भारतीय रिज़र्व बैंक में नीति-निर्धारक क्लास-वन अधिकारी पद।',
        syllabusHighlights: ['Economic and Social Issues (ESI)', 'Finance and Management (FM)', 'English Writing Skills', 'General Awareness']
      },
      {
        id: 'harco-bank-clerk',
        name: 'HARCO Bank Clerk',
        hindiName: 'हरको बैंक क्लर्क (Haryana State Apex)',
        fullName: 'Haryana State Cooperative Apex Bank Clerk & Junior Accountant',
        vacancies: '978+ Posts',
        eligibility: 'Graduation with 55% marks or 1st division in 10+2 with Commerce',
        pattern: 'CBT (90 Marks) + Socio-economic criteria (10 Marks)',
        totalMarks: '100 Marks',
        description: 'State Apex cooperative banking positions in Haryana.',
        hindiDescription: 'हरियाणा राज्य सहकारी शीर्ष बैंक में क्लर्क एवं कनिष्ठ लेखाकार भर्ती।',
        syllabusHighlights: ['Reasoning', 'Quantitative Aptitude', 'English', 'General Awareness', 'Current Affairs of Haryana']
      },
      {
        id: 'bank-of-baroda-lbo',
        name: 'Bank of Baroda LBO',
        hindiName: 'बैंक ऑफ बड़ौदा एलबीओ (Local Bank Officer)',
        fullName: 'Bank of Baroda Local Bank Officer & Specialist Officers',
        vacancies: '500+ Posts',
        eligibility: 'Graduation with minimum 60% marks + 2 years banking experience',
        pattern: 'Online Exam + Group Discussion & Interview',
        totalMarks: '200 Marks',
        description: 'Branch leadership banking opportunities in specialized circles.',
        hindiDescription: 'बैंक ऑफ बड़ौदा में स्थानीय बैंक अधिकारी पद।',
        syllabusHighlights: ['Banking Law and Practice', 'Credit Management', 'Financial Analysis', 'Economy']
      },
      {
        id: 'jaiib-exam',
        name: 'JAIIB Exam',
        hindiName: 'जेएआईआईबी परीक्षा (IIBF Certificate)',
        fullName: 'Junior Associate of Indian Institute of Bankers',
        badge: 'Career Promotion',
        eligibility: 'Regular employees of recognized banking institutions',
        pattern: '4 Papers (IE&IFS, PPB, AFM, RBWM) - 100 Qs each',
        totalMarks: '100 Marks per paper (50% to pass)',
        description: 'Flagship qualification of Indian Institute of Banking & Finance (IIBF) providing immediate salary increments to bank employees.',
        hindiDescription: 'आईआईबीएफ द्वारा बैंक कर्मचारियों के वेतनमान एवं पदोन्नति हेतु अनिवार्य प्रमाणन।',
        syllabusHighlights: ['Indian Economy & Financial System', 'Principles & Practices of Banking', 'Accounting & Financial Management', 'Retail Banking & Wealth Management']
      },
      {
        id: 'nabard-development-assistant',
        name: 'NABARD Dev Assistant',
        hindiName: 'नाबार्ड डेवलपमेंट असिस्टेंट',
        fullName: 'National Bank for Agriculture and Rural Development - Development Assistant',
        vacancies: '177+ Posts',
        eligibility: 'Bachelor Degree in any discipline with min 50% marks',
        pattern: 'Phase I (Prelims 100 Marks) + Phase II (Mains 200 Marks)',
        totalMarks: '200 Marks',
        description: 'Apex development bank supporting rural infrastructure and microfinance across India.',
        hindiDescription: 'राष्ट्रीय कृषि और ग्रामीण विकास बैंक में विकास सहायक पद।',
        syllabusHighlights: ['Test of Reasoning', 'Quantitative Aptitude', 'General Awareness (Focus on Agriculture & Rural Development)', 'English Descriptive']
      },
      {
        id: 'pnb-lbo',
        name: 'PNB LBO',
        hindiName: 'पीएनबी लोकल बैंक ऑफिसर',
        fullName: 'Punjab National Bank Local Bank Officer & Specialist Manager',
        vacancies: '1,025+ Posts',
        eligibility: 'Graduation + relevant banking certifications',
        pattern: 'CBT + Interview',
        totalMarks: '200 Marks',
        description: 'Punjab National Bank circle-based officer recruitments.',
        hindiDescription: 'पंजाब नेशनल बैंक में स्थानीय बैंक अधिकारी एवं विशेषज्ञ भर्ती।',
        syllabusHighlights: ['Financial Awareness', 'Professional Knowledge', 'Reasoning', 'English']
      },
      {
        id: 'rbi-office-attendant',
        name: 'RBI Office Attendant',
        hindiName: 'आरबीआई ऑफिस अटेंडेंट',
        fullName: 'Reserve Bank of India Office Attendant Recruitment',
        vacancies: '841+ Posts',
        eligibility: '10th Standard (Matriculation) pass from recognized Board',
        pattern: 'Online Test (120 Qs / 120 Marks / 90 Min) + LPT',
        totalMarks: '120 Marks',
        description: 'Entry-level support positions across RBI offices.',
        hindiDescription: 'भारतीय रिज़र्व बैंक में 10वीं पास युवाओं हेतु कार्यालय परिचारक भर्ती।',
        syllabusHighlights: ['Reasoning', 'General English', 'General Awareness', 'Numerical Ability']
      },
      {
        id: 'hdfc-bank-po',
        name: 'HDFC Bank PO',
        hindiName: 'एचडीएफसी बैंक पीओ (Future Bankers Program)',
        fullName: 'HDFC Bank Future Bankers Program in association with Manipal Academy',
        badge: 'Private Bank',
        eligibility: 'Graduation with min 55% marks, Age 21-28 years',
        pattern: 'Online Assessment + Video Interview + 1 Year PGDBF Training',
        totalMarks: '100 Marks Assessment',
        description: 'Assured career entry as Deputy Manager at India\'s largest private sector bank.',
        hindiDescription: 'एचडीएफसी बैंक में डिप्टी मैनेजर पद पर सुनिश्चित नियुक्ति हेतु फ्यूचर बैंकर्स कार्यक्रम।',
        syllabusHighlights: ['Aptitude', 'Logical Reasoning', 'Verbal Ability', 'Personality Profiling']
      }
    ]
  },
  {
    id: 'teaching',
    name: 'Teaching Exams',
    hindiName: 'शिक्षक भर्ती एवं यूजीसी नेट',
    icon: 'GraduationCap',
    description: 'Central & State Teacher Eligibility Tests, Assistant Professor & TGT/PGT',
    color: 'from-amber-600 to-orange-700',
    exams: [
      {
        id: 'ugc-net-hindi',
        name: 'UGC NET Hindi Sahitya',
        hindiName: 'यूजीसी नेट हिन्दी साहित्य (JRF एवं सहायक प्रोफेसर)',
        fullName: 'UGC National Eligibility Test (NET / JRF) - Hindi Literature (Subject Code: 20)',
        badge: 'BooksBoon Bestseller',
        vacancies: 'National Eligibility / JRF Stipend ₹37,000/mo',
        eligibility: 'Master Degree in Hindi with minimum 55% marks (50% for reserved categories)',
        pattern: 'Paper 1 (Teaching & Research Aptitude 50 Qs / 100 Marks) + Paper 2 (Hindi Sahitya 100 Qs / 200 Marks)',
        totalMarks: '300 Marks (3 Hours Continuous CBT)',
        negativeMarking: 'No Negative Marking',
        description: 'National qualifying exam for Assistant Professorship and Junior Research Fellowship (JRF). Samwedna\'s authored book by Dr. Rajneesh Kumar Yadav (2500+ MCQs) is the #1 recommended text.',
        hindiDescription: 'विश्वविद्यालयों एवं डिग्री कॉलेजों में असिस्टेंट प्रोफेसर एवं जेआरएफ हेतु राष्ट्रीय परीक्षा। डॉ. रजनीश कुमार यादव कृत 2500+ वस्तुनिष्ठ पुस्तक इस परीक्षा की सर्वश्रेष्ठ संदर्भ पुस्तक है।',
        syllabusHighlights: [
          'इकाई 1: हिन्दी भाषा और उसका विकास (अपभ्रंश, अवहट्ट, पुरानी हिन्दी, खड़ी बोली, बोलियां)',
          'इकाई 2: हिन्दी साहित्य का इतिहास (काल-विभाजन, आदिकाल, भक्तिकाल, रीतिकाल, आधुनिक काल)',
          'इकाई 3: साहित्यशास्त्र (रस, अलंकार, रीति, ध्वनि, वक्रोक्ति, पाश्चात्य काव्यशास्त्र)',
          'इकाई 4: वैचारिक पृष्ठभूमि (भारतीय नवजागरण, गांधी दर्शन, अम्बेडकर व लोहिया दर्शन)',
          'इकाई 5-10: हिन्दी कविता, उपन्यास, कहानी, नाटक, निबन्ध एवं अन्य गद्य विधाएँ'
        ],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh', 'hindi-sahitya-itihas-rajneesh-ed1'],
        popular: true
      },
      {
        id: 'ctet',
        name: 'CTET (Central TET)',
        hindiName: 'सीटेट (Central Teacher Eligibility Test)',
        fullName: 'Central Teacher Eligibility Test (Paper I for Classes I-V & Paper II for Classes VI-VIII)',
        badge: 'National Mandate',
        eligibility: 'D.El.Ed / B.El.Ed for Paper 1; B.Ed / D.El.Ed with Graduation for Paper 2',
        pattern: '150 MCQs / 150 Marks (150 Minutes per paper)',
        totalMarks: '150 Marks (60% qualifying)',
        negativeMarking: 'No Negative Marking',
        description: 'Mandatory qualifying eligibility for KVS, NVS, DSSSB, and Central Tibetan Schools.',
        hindiDescription: 'केन्द्रीय विद्यालय (KVS), नवोदय (NVS) एवं सैनिक स्कूलों में शिक्षक बनने हेतु अनिवार्य पात्रता परीक्षा।',
        syllabusHighlights: ['Child Development and Pedagogy', 'Language I & II', 'Mathematics', 'Environmental Studies / Science / Social Studies'],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh'],
        popular: true
      },
      {
        id: 'bpsc-tre',
        name: 'BPSC TRE (Teacher 4.0)',
        hindiName: 'बीपीएससी टीआरई 4.0 (बिहार शिक्षक भर्ती)',
        fullName: 'Bihar Public Service Commission School Teacher Recruitment (Primary, Middle, Secondary, Senior Secondary)',
        badge: 'Mega Recruitment',
        vacancies: '1,00,000+ Expected Posts',
        eligibility: 'Graduation / Post Graduation + B.Ed / D.El.Ed + CTET / STET',
        pattern: 'Language (Qualifying) + General Studies + Subject Paper (150 Qs / 150 Marks)',
        totalMarks: '150 Marks',
        negativeMarking: 'No Negative Marking',
        description: 'BPSC recruitment for Primary (Class 1-5), Middle (6-8), Secondary (9-10), and Higher Secondary (11-12) teachers in Bihar.',
        hindiDescription: 'बिहार के विद्यालयों में प्राथमिक, माध्यमिक एवं उच्च माध्यमिक शिक्षकों की विशाल भर्ती। हिन्दी विषय हेतु डॉ. रजनीश यादव की पुस्तक सर्वाधिक उपयोगी।',
        syllabusHighlights: ['Language (Hindi/English)', 'General Studies (History, Geography, Science, Maths)', 'Subject Specific Domain (Hindi Literature)'],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh'],
        popular: true
      },
      {
        id: 'up-tgt-pgt',
        name: 'UP TGT / PGT',
        hindiName: 'यूपी टीजीटी / पीजीटी शिक्षक भर्ती',
        fullName: 'UP Secondary Education Service Selection Board (UPSESSB) TGT & PGT',
        badge: 'High Prestige',
        vacancies: '4,163+ Posts',
        eligibility: 'B.Ed + Graduation (TGT) / Post Graduation in relevant subject (PGT)',
        pattern: '125 MCQs / 500 Marks (2 Hours)',
        totalMarks: '500 Marks',
        negativeMarking: 'No Negative Marking',
        description: 'Aided secondary schools in Uttar Pradesh for Trained Graduate Teachers and Post Graduate Teachers.',
        hindiDescription: 'उत्तर प्रदेश के अशासकीय सहायता प्राप्त इण्टर कॉलेजों में सहायक अध्यापक (टीजीटी) एवं प्रवक्ता (पीजीटी) भर्ती।',
        syllabusHighlights: ['हिन्दी साहित्य का इतिहास', 'संस्कृत साहित्य एवं व्याकरण', 'काव्यशास्त्र एवं भाषा विज्ञान'],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh'],
        popular: true
      },
      {
        id: 'dsssb-teacher',
        name: 'DSSSB PRT / TGT / PGT',
        hindiName: 'डीएसएसएसबी शिक्षक भर्ती (दिल्ली)',
        fullName: 'Delhi Subordinate Services Selection Board Teaching Posts',
        vacancies: '5,118+ Posts',
        eligibility: 'Degree/Diploma + CTET + B.Ed for TGT/PGT',
        pattern: 'Section A (General 100 Marks) + Section B (Subject/Pedagogy 100/200 Marks)',
        totalMarks: '200 / 300 Marks',
        negativeMarking: '-0.25 Marks',
        description: 'Directorate of Education & MCD Schools in Delhi.',
        hindiDescription: 'दिल्ली सरकार के विद्यालयों में प्राथमिक, प्रशिक्षित स्नातक एवं प्रवक्ता पदों पर भर्ती।',
        syllabusHighlights: ['General Awareness', 'General Intelligence & Reasoning', 'Arithmetical & Numerical Ability', 'Hindi & English', 'Subject Pedagogy']
      },
      {
        id: 'uptet',
        name: 'UPTET (UP TET)',
        hindiName: 'यूपीटीईटी (उत्तर प्रदेश शिक्षक पात्रता परीक्षा)',
        fullName: 'Uttar Pradesh Teacher Eligibility Test',
        eligibility: 'D.El.Ed / B.Ed',
        pattern: '150 MCQs / 150 Marks (No negative marking)',
        totalMarks: '150 Marks',
        description: 'Mandatory eligibility for UP Super TET and state government primary/upper primary schools.',
        hindiDescription: 'उत्तर प्रदेश के परिषदीय प्राथमिक एवं उच्च प्राथमिक विद्यालयों में शिक्षक हेतु अनिवार्य पात्रता।',
        syllabusHighlights: ['बाल विकास एवं शिक्षण विधि', 'भाषा 1 (हिन्दी)', 'भाषा 2 (संस्कृत/अंग्रेजी)', 'गणित एवं पर्यावरण']
      }
    ]
  },
  {
    id: 'civil-services',
    name: 'Civil Services Exam',
    hindiName: 'संघ एवं राज्य लोक सेवा आयोग',
    icon: 'Shield',
    description: 'UPSC CSE (IAS/IPS), UPPSC PCS, BPSC, and State Administrative Services',
    color: 'from-emerald-600 to-teal-800',
    exams: [
      {
        id: 'upsc-cse',
        name: 'UPSC CSE (IAS/IPS)',
        hindiName: 'यूपीएससी सिविल सेवा परीक्षा (IAS / IPS / IFS)',
        fullName: 'Union Public Service Commission Civil Services Examination',
        badge: 'Premier Service',
        vacancies: '1,056+ Posts',
        eligibility: 'Graduate in any discipline from recognized University',
        pattern: 'Prelims (GS + CSAT) + Mains (9 Papers / 1750 Marks) + Personality Test (275 Marks)',
        totalMarks: '2,025 Marks Total Merit',
        negativeMarking: '-0.33 Marks in Prelims',
        description: 'Apex administrative examination of India for the Indian Administrative Service, Indian Police Service, and Indian Foreign Service.',
        hindiDescription: 'भारत की सर्वोच्च प्रशासनिक सेवा परीक्षा (आईएएस, आईपीएस, आईएफएस)।',
        syllabusHighlights: [
          'Prelims GS Paper I (History, Polity, Economy, Geography, Environment, Current Affairs)',
          'Prelims GS Paper II - CSAT (Reading Comprehension, Logical Reasoning, Basic Numeracy)',
          'Mains Essay & 4 General Studies Papers (GS I, II, III, IV Ethics)',
          'Optional Subject (2 Papers / 500 Marks - Hindi Literature / History / PSIR / Geography)'
        ],
        recommendedBookIds: ['hindi-sahitya-itihas-rajneesh', 'samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'uppsc-pcs',
        name: 'UPPSC PCS',
        hindiName: 'यूपीपीएससी पीसीएस (Combined State / Upper Subordinate)',
        fullName: 'Uttar Pradesh Public Service Commission Combined State / Upper Subordinate Services',
        badge: 'State Admin',
        vacancies: '268+ Posts',
        eligibility: 'Bachelor Degree in any stream (special eligibility for specific posts)',
        pattern: 'Prelims (GS I + CSAT) + Mains (6 GS Papers including UP Special Papers 5 & 6) + Interview',
        totalMarks: '1,500 Marks Mains + 100 Marks Interview',
        negativeMarking: '-0.33 Marks in Prelims',
        description: 'Recruitment for Sub Divisional Magistrate (SDM), Deputy SP, Block Development Officer (BDO), and ARTO in Uttar Pradesh.',
        hindiDescription: 'उत्तर प्रदेश में एसडीएम, डीएसपी, बीडीओ, तहसीलदार पदों हेतु प्रांतीय सिविल सेवा परीक्षा। उत्तर प्रदेश विशेष प्रश्नपत्र 5 एवं 6 सम्मिलित।',
        syllabusHighlights: ['GS 1 (History & Culture)', 'GS 2 (Governance & Polity)', 'GS 3 (Economy & Security)', 'GS 4 (Ethics)', 'GS 5 & 6 (UP Special History, Economy, Geography)'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'bpsc-cce',
        name: 'BPSC CCE (Bihar PSC)',
        hindiName: 'बीपीएससी संयुक्त प्रतियोगिता परीक्षा (70वीं CCE)',
        fullName: 'Bihar Public Service Commission Combined Competitive Examination',
        badge: 'State Admin',
        vacancies: '1,957+ Posts',
        eligibility: 'Bachelor Degree in any discipline',
        pattern: 'Prelims (150 Qs / 150 Marks) + Mains (General Hindi qualifying, GS I, GS II, Essay) + Interview',
        totalMarks: '900 Marks Mains + 120 Marks Interview',
        negativeMarking: '-0.33 Marks in Prelims',
        description: 'Deputy Collector, Deputy SP, Revenue Officer, and Block Welfare Officer posts in Bihar Government.',
        hindiDescription: 'बिहार प्रशासनिक सेवा, पुलिस उपाधीक्षक एवं राजस्व अधिकारी पदों हेतु परीक्षा।',
        syllabusHighlights: ['Modern History of India & Indian Culture', 'Current Events of National & International Importance', 'Statistical Analysis & Graphs', 'Polity, Economy & Geography of India and Bihar'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'mppsc-prelims',
        name: 'MPPSC State Service',
        hindiName: 'एमपीपीएससी राज्य सेवा परीक्षा (मध्य प्रदेश)',
        fullName: 'Madhya Pradesh Public Service Commission State Service Examination',
        vacancies: '110+ Posts',
        eligibility: 'Graduation in any stream',
        pattern: 'Prelims (GS Paper I + CSAT) + Mains (6 Papers) + Interview',
        totalMarks: '1,500 Marks Mains + 185 Marks Interview',
        description: 'Deputy Collector and DSP posts in Madhya Pradesh.',
        hindiDescription: 'मध्य प्रदेश शासन में डिप्टी कलेक्टर एवं डीएसपी पद हेतु परीक्षा।',
        syllabusHighlights: ['History, Culture & Literature of MP', 'Geography of MP and World', 'Constitutional System & Economy of MP', 'Science & Technology']
      }
    ]
  },
  {
    id: 'railways',
    name: 'Railways Exams',
    hindiName: 'रेलवे भर्ती परीक्षाएं',
    icon: 'Train',
    description: 'Railway Recruitment Boards (RRB) across all Indian Railway zones',
    color: 'from-rose-600 to-red-800',
    exams: [
      {
        id: 'rrb-ntpc',
        name: 'RRB NTPC',
        hindiName: 'आरआरबी एनटीपीसी (Non-Technical Popular Categories)',
        fullName: 'Non-Technical Popular Categories (Graduate & Undergraduate Posts)',
        badge: 'Mega Railway',
        vacancies: '11,558+ Posts',
        eligibility: '12th Pass (Level 2 & 3) / Graduation (Level 5 & 6: Station Master, Goods Guard)',
        pattern: 'CBT 1 (100 Qs / 90 Min) + CBT 2 (120 Qs / 90 Min) + CBAT / Typing Skill Test',
        totalMarks: '120 Marks (CBT 2 Merit)',
        negativeMarking: '-0.33 Marks for each incorrect response',
        description: 'Station Master, Goods Train Manager, Senior Clerk cum Typist, Commercial Apprentice and Junior Clerk across 21 RRBs.',
        hindiDescription: 'भारतीय रेल के 21 बोर्डों में स्टेशन मास्टर, गुड्स ट्रेन मैनेजर एवं क्लर्क पदों पर भर्ती।',
        syllabusHighlights: ['General Awareness (40 Qs in CBT 1, 50 Qs in CBT 2)', 'Mathematics (30 Qs in CBT 1, 35 Qs in CBT 2)', 'General Intelligence and Reasoning (30 Qs in CBT 1, 35 Qs in CBT 2)'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'rrb-group-d',
        name: 'RRB Group D',
        hindiName: 'आरआरबी ग्रुप डी (Level 1 Posts)',
        fullName: 'Railway Level 1 Posts (Track Maintainer, Pointsman, Assistant Workshop)',
        badge: 'Mass Recruitment',
        vacancies: '1,00,000+ Posts',
        eligibility: '10th Pass or ITI from NCVT/SCVT',
        pattern: 'CBT (100 Qs / 90 Min) + Physical Efficiency Test (PET)',
        totalMarks: '100 Marks',
        negativeMarking: '-0.33 Marks',
        description: 'Track Maintainer Grade IV, Helper/Assistant in Electrical, Mechanical, and S&T departments.',
        hindiDescription: 'भारतीय रेल में ट्रैक मेंटेनर, प्वॉइंट्समैन एवं वर्कशॉप सहायक पदों पर विशाल भर्ती।',
        syllabusHighlights: ['General Science (Physics, Chemistry, Life Sciences 10th standard)', 'Mathematics', 'General Intelligence & Reasoning', 'General Awareness on Current Affairs'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'rrb-alp',
        name: 'RRB ALP',
        hindiName: 'आरआरबी एएलपी (Assistant Loco Pilot)',
        fullName: 'Assistant Loco Pilot Examination',
        badge: 'Technical Role',
        vacancies: '18,799+ Posts',
        eligibility: 'Matriculation + ITI / Diploma / Degree in Mechanical, Electrical, Electronics, Automobile',
        pattern: 'CBT 1 + CBT 2 (Part A Non-tech + Part B Trade) + CBAT (Aptitude)',
        totalMarks: 'Part A 100 Marks (70% weightage) + CBAT (30% weightage)',
        negativeMarking: '-0.33 Marks',
        description: 'Direct locomotive piloting career under Indian Railways running train operations.',
        hindiDescription: 'भारतीय रेल में सहायक लोको पायलट (ट्रेन चालक) पद पर तकनीकी भर्ती।',
        syllabusHighlights: ['Basic Science and Engineering', 'Mathematics', 'General Intelligence', 'Relevant Technical Trade Test']
      },
      {
        id: 'rpf-si-constable',
        name: 'RPF SI & Constable',
        hindiName: 'आरपीएफ एसआई एवं कांस्टेबल',
        fullName: 'Railway Protection Force Sub-Inspector and Constable',
        badge: 'Uniform Service',
        vacancies: '4,660+ Posts',
        eligibility: 'Graduation for SI; 10th Pass for Constable',
        pattern: 'CBT (120 Qs / 120 Marks / 90 Min) + PET/PMT',
        totalMarks: '120 Marks',
        negativeMarking: '-0.33 Marks',
        description: 'Law enforcement and passenger security across Indian Railways network and railway stations.',
        hindiDescription: 'रेलवे सुरक्षा बल (RPF) में सब-इंस्पेक्टर एवं कांस्टेबल पद पर भर्ती।',
        syllabusHighlights: ['General Awareness (50 Marks)', 'Arithmetic (35 Marks)', 'General Intelligence & Reasoning (35 Marks)']
      }
    ]
  },
  {
    id: 'defence',
    name: 'Defence Exams',
    hindiName: 'रक्षा सेवाएं एवं सेना भर्ती',
    icon: 'Crosshair',
    description: 'National Defence Academy, CDS, AFCAT, CAPF AC, and Agniveer forces',
    color: 'from-zinc-700 to-slate-900',
    exams: [
      {
        id: 'nda-exam',
        name: 'NDA Exam',
        hindiName: 'एनडीए (National Defence Academy)',
        fullName: 'National Defence Academy and Naval Academy Examination (UPSC)',
        badge: 'After 12th',
        vacancies: '400+ Seats per course',
        eligibility: '12th Pass or appearing (Physics & Maths required for Air Force & Navy)',
        pattern: 'Mathematics (300 Marks / 2.5 Hrs) + General Ability Test (600 Marks / 2.5 Hrs) + SSB Interview (900 Marks)',
        totalMarks: '900 Marks Written + 900 Marks SSB',
        negativeMarking: '-0.33 Marks',
        description: 'Joint services academy of Indian Armed Forces training cadets of Army, Navy, and Air Force together.',
        hindiDescription: '12वीं के उपरांत भारतीय सेना, नौसेना एवं वायुसेना में क्लास-वन कमीशंड अधिकारी बनने की राष्ट्रीय परीक्षा।',
        syllabusHighlights: ['Mathematics (Algebra, Matrices, Trigonometry, Calculus)', 'GAT Part A: English (200 Marks)', 'GAT Part B: General Knowledge, Physics, Chemistry, History, Geography, Current Events (400 Marks)'],
        popular: true
      },
      {
        id: 'cds-exam',
        name: 'CDS Exam',
        hindiName: 'सीडीएस (Combined Defence Services)',
        fullName: 'Combined Defence Services Examination (IMA, INA, AFA, OTA)',
        badge: 'Graduate Entry',
        vacancies: '459+ Seats',
        eligibility: 'Graduation from recognized university (Engineering for AFA/INA)',
        pattern: 'English (100 Marks) + General Knowledge (100 Marks) + Elementary Maths (100 Marks) + SSB',
        totalMarks: '300 Marks (200 Marks for OTA without Maths)',
        negativeMarking: '-0.33 Marks',
        description: 'Direct officer commissioning into Indian Military Academy, Naval Academy, Air Force Academy, and Officers Training Academy.',
        hindiDescription: 'स्नातक उत्तीर्ण युवाओं हेतु भारतीय सेना, नौसेना व वायुसेना में अधिकारी पद।',
        syllabusHighlights: ['English Language', 'General Knowledge (Science, History, Geography, Defence)', 'Elementary Mathematics'],
        popular: true
      },
      {
        id: 'afcat',
        name: 'AFCAT',
        hindiName: 'एफकैट (Air Force Common Admission Test)',
        fullName: 'Air Force Common Admission Test for Flying & Ground Duty Branches',
        badge: 'Air Force',
        vacancies: '317+ Posts',
        eligibility: 'Graduation with min 60% marks + 60% in Maths & Physics at 10+2 level for Flying Branch',
        pattern: 'Online Exam (100 Qs / 300 Marks / 2 Hours) + AFSB Interview',
        totalMarks: '300 Marks',
        negativeMarking: '-1 Mark for each wrong answer (+3 for correct)',
        description: 'Commissioned Officer entry in the Indian Air Force for Flying Branch, Weapons Systems, Technical and Non-Technical ground branches.',
        hindiDescription: 'भारतीय वायु सेना में फ्लाइंग एवं ग्राउंड ड्यूटी शाखाओं में अधिकारी पद।',
        syllabusHighlights: ['General Awareness', 'Verbal Ability in English', 'Numerical Ability', 'Reasoning and Military Aptitude']
      },
      {
        id: 'capf-ac',
        name: 'CAPF AC',
        hindiName: 'सीएपीएफ एसी (Assistant Commandant)',
        fullName: 'Central Armed Police Forces (Assistant Commandants) Examination (UPSC)',
        badge: 'Gazetted Officer',
        vacancies: '506+ Posts',
        eligibility: 'Bachelor Degree in any discipline',
        pattern: 'Paper I (General Ability & Intelligence 250 Marks) + Paper II (General Studies, Essay & Comprehension 200 Marks) + PET + Interview (150 Marks)',
        totalMarks: '600 Marks',
        negativeMarking: '-0.33 Marks Paper I',
        description: 'Direct entry as Assistant Commandant (Group A Gazetted Officer) in BSF, CRPF, CISF, ITBP, and SSB.',
        hindiDescription: 'केन्द्रीय अर्धसैनिक बलों (BSF, CRPF, CISF) में असिस्टेंट कमांडेंट (राजपत्रित अधिकारी) पद।',
        syllabusHighlights: ['General Mental Ability', 'General Science', 'Current Events', 'Indian Polity & Economy', 'History of India', 'Essay Writing & Precis']
      }
    ]
  },
  {
    id: 'police',
    name: 'Police & State Exams',
    hindiName: 'पुलिस एवं राज्य स्तरीय परीक्षाएं',
    icon: 'Award',
    description: 'State Police Constable, Sub Inspector, and subordinate recruitment boards',
    color: 'from-amber-700 to-yellow-900',
    exams: [
      {
        id: 'up-police-constable',
        name: 'UP Police Constable',
        hindiName: 'यूपी पुलिस आरक्षी (Constable)',
        fullName: 'Uttar Pradesh Police Recruitment & Promotion Board Constable Civil Police',
        badge: 'Mass State Exam',
        vacancies: '60,244+ Posts',
        eligibility: '12th Pass (Intermediate) from recognized Board',
        pattern: 'OMR Written Exam (150 Qs / 300 Marks / 2 Hours) + Physical Standard & Run',
        totalMarks: '300 Marks',
        negativeMarking: '-0.50 Marks for each wrong answer',
        description: 'Largest state police constable recruitment in Uttar Pradesh offering stable government law-and-order careers.',
        hindiDescription: 'उत्तर प्रदेश पुलिस में 60,244 नागरिक पुलिस आरक्षी पदों पर विशाल भर्ती।',
        syllabusHighlights: [
          'सामान्य ज्ञान (General Knowledge - UP History, Culture, Revenue, Police System)',
          'सामान्य हिन्दी (General Hindi - व्याकरण, मुहावरे, पर्यायवाची, प्रसिद्ध कवि व लेखक)',
          'संख्यात्मक एवं मानसिक योग्यता (Numerical and Mental Ability)',
          'मानसिक अभिरुचि, बुद्धिलब्धि एवं तार्किक क्षमता (Reasoning & Mental Aptitude)'
        ],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'up-si',
        name: 'UP Police Sub Inspector (UP SI)',
        hindiName: 'यूपी पुलिस उप-निरीक्षक (UP SI)',
        fullName: 'UP Police Sub Inspector (Civil Police), Platoon Commander & Fire Officer',
        badge: 'Two Stars',
        vacancies: '4,500+ Expected Posts',
        eligibility: 'Bachelor Degree in any discipline',
        pattern: 'CBT (160 Qs / 400 Marks / 2 Hours) + PST & Running',
        totalMarks: '400 Marks (35% section cutoff, 50% overall qualifying)',
        negativeMarking: 'No negative marking',
        description: 'Sub-Inspector of Police in Uttar Pradesh Civil Police and PAC Platoon Commander.',
        hindiDescription: 'उत्तर प्रदेश पुलिस में दो सितारा उप-निरीक्षक पद। मूल विधि एवं संविधान का विशेष महत्व।',
        syllabusHighlights: ['सामान्य हिन्दी (100 Marks)', 'मूल विधि / संविधान एवं सामान्य ज्ञान (100 Marks)', 'संख्यात्मक एवं मानसिक योग्यता (100 Marks)', 'मानसिक अभिरुचि एवं तार्किक परीक्षा (100 Marks)'],
        recommendedBookIds: ['samanya-adhyayan-vol1'],
        popular: true
      },
      {
        id: 'delhi-police-constable',
        name: 'Delhi Police Constable',
        hindiName: 'दिल्ली पुलिस कांस्टेबल',
        fullName: 'Constable (Executive) Male and Female in Delhi Police (through SSC)',
        badge: 'Capital Police',
        vacancies: '7,547+ Posts',
        eligibility: '10+2 (Senior Secondary) Pass + LMV Driving License for Male candidates',
        pattern: 'CBT (100 Qs / 100 Marks / 90 Min) + PE&MT',
        totalMarks: '100 Marks',
        negativeMarking: '-0.25 Marks',
        description: 'Direct recruitment for executive constables in the National Capital Territory of Delhi under Central Government pay scale.',
        hindiDescription: 'देश की राजधानी दिल्ली पुलिस में कांस्टेबल (कार्यकारी) पद पर सीधी भर्ती।',
        syllabusHighlights: ['Reasoning (25 Qs)', 'General Knowledge & Current Affairs (50 Qs)', 'Numerical Ability (15 Qs)', 'Computer Fundamentals (10 Qs)']
      },
      {
        id: 'bihar-police-constable',
        name: 'Bihar Police Constable',
        hindiName: 'बिहार पुलिस सिपाही भर्ती',
        fullName: 'Central Selection Board of Constable (CSBC) Bihar Police',
        badge: 'State Police',
        vacancies: '21,391+ Posts',
        eligibility: '10+2 (Intermediate) pass',
        pattern: 'Written Qualifying Exam (100 Marks) + Physical Efficiency Test (100 Marks determines final merit)',
        totalMarks: '100 Marks in Physical for Merit',
        description: 'Constable recruitment under Central Selection Board of Constable in Bihar.',
        hindiDescription: 'बिहार पुलिस में 21,391 सिपाही पदों पर भर्ती। शारीरिक दक्षता परीक्षा से अंतिम मेधा सूची।',
        syllabusHighlights: ['हिन्दी, अंग्रेजी, गणित, इतिहास, भूगोल, राजनीति शास्त्र, अर्थशास्त्र, भौतिकी, रसायन, जीव विज्ञान']
      }
    ]
  }
];

// Helper to look up any exam by id across all categories
export const getStoredExamsData = (): ExamCategoryGroup[] => {
  try {
    const raw = localStorage.getItem('samwedna_exams_data');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('Error reading stored exams data:', e);
  }
  return EXAMS_CATEGORIES_DATA;
};

export const saveExamsDataToStorage = (data: ExamCategoryGroup[]): void => {
  try {
    localStorage.setItem('samwedna_exams_data', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving exams data:', e);
  }
};

export const getExamById = (id: string): ExamSubItem | undefined => {
  const currentData = getStoredExamsData();
  for (const group of currentData) {
    const found = group.exams.find(e => e.id === id);
    if (found) return found;
  }
  return undefined;
};

export const getCategoryByExamId = (examId: string): ExamCategoryGroup | undefined => {
  const currentData = getStoredExamsData();
  for (const group of currentData) {
    if (group.exams.some(e => e.id === examId)) {
      return group;
    }
  }
  return undefined;
};

export const upsertExam = (categoryId: string, exam: ExamSubItem): ExamCategoryGroup[] => {
  const currentData = getStoredExamsData();
  const targetCategoryIndex = currentData.findIndex(c => c.id === categoryId);
  
  if (targetCategoryIndex > -1) {
    const category = currentData[targetCategoryIndex];
    const existingExamIndex = category.exams.findIndex(e => e.id === exam.id);
    
    if (existingExamIndex > -1) {
      category.exams[existingExamIndex] = exam;
    } else {
      category.exams.unshift(exam);
    }
    currentData[targetCategoryIndex] = { ...category };
  } else {
    // If category not found, add to first category (e.g. ssc)
    if (currentData[0]) {
      currentData[0].exams.unshift(exam);
    }
  }

  saveExamsDataToStorage(currentData);
  return currentData;
};

export const removeExam = (examId: string): ExamCategoryGroup[] => {
  const currentData = getStoredExamsData();
  const updated = currentData.map(group => ({
    ...group,
    exams: group.exams.filter(e => e.id !== examId)
  }));
  saveExamsDataToStorage(updated);
  return updated;
};

