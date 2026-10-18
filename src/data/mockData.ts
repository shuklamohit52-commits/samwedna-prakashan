import { 
  Book, 
  AcademicCourse, 
  BlogPost, 
  VideoLecture, 
  CBTQuestion, 
  UserProfile, 
  TestSeriesExam, 
  UserTestScore,
  CurrentAffairArticle,
  FreePdfResource,
  StudyMaterialItem,
  HardCopyOrder
} from '../types';

export const SAMWEDNA_CONTACT_INFO = {
  brandName: 'Samwedna Prakashan',
  groupName: 'Samwedna Group of Institutions',
  tagline: 'Printer | Publisher and Distributor',
  phones: ['+91 9792903247'],
  primaryPhone: '+91 9792903247',
  email: 'booksboon17@gmail.com',
  booksBoonEmail: 'booksboon17@gmail.com',
  instituteEmail: 'sgi181069@gmail.com',
  prakashanEmail: 'spiindia181069@gmail.com',
  website: 'booksboon.com',
  headOffice: {
    title: 'Head Office (New Delhi)',
    address: 'VZ/B-93, Ring Road Naraina Vihar, New Delhi - 110028'
  },
  regionalOffice: {
    title: 'Institutional & Regional Center (Gorakhpur)',
    address: 'Mahui Sugharpur, Near Bhavya Marriage Hall, Azad Chauk, Rustampur, Gorakhpur, Uttar Pradesh - 273016'
  },
  branches: ['Dehradun', 'Lucknow', 'Patna', 'Gorakhpur'],
  creativeServices: [
    'Brochure Design',
    'Business Card',
    'Banner Design',
    'Logo Design',
    'Magazine Design',
    'Book Design & Composing',
    'Leaflet & Flyers',
    'Poster & Hoardings',
    'Letterhead & Stationery',
    'Professional Photo Editing'
  ],
  associatedWings: [
    { name: 'All In Career Point (ACP)', desc: 'Coaching & Academic Counselling' },
    { name: 'Kisan Gaurav (किसान गौरव)', desc: 'Rural & Agricultural Publications' },
    { name: 'Samwedna Creative Studio', desc: 'Graphic Design & Digital Branding' }
  ]
};

export const BOOKS_DATA: Book[] = [
  {
    id: 'hindi-sahitya-itihas-rajneesh',
    title: 'हिन्दी साहित्य का इतिहास (वस्तुनिष्ठ संकलन - 2500+ MCQs)',
    hindiTitle: 'आचार्य रामचन्द्र शुक्ल कृत हिन्दी साहित्य का इतिहास (द्वितीय संस्करण: परिमार्जित और संशोधित)',
    category: 'Teaching & UGC NET',
    subject: 'हिन्दी साहित्य एवं शिक्षक भर्ती परीक्षा विशेषांक',
    author: 'डॉ. रजनीश कुमार यादव (सहायक प्रोफेसर, हिन्दी - JNU/BHU)',
    paperbackPrice: 395,
    originalPrice: 480,
    ebookAvailable: true,
    rating: 4.95,
    reviewsCount: 3840,
    pages: 580,
    language: 'Hindi',
    badge: 'Best Seller',
    description: 'आचार्य रामचन्द्र शुक्ल कृत हिन्दी साहित्य के इतिहास का प्रामाणिक वस्तुनिष्ठ संकलन। 2500 से अधिक उच्च-स्तरीय प्रश्नों का अध्यायवार समावेश। यूजीसी नेट, असिस्टेंट प्रोफेसर, DSSSB, UP TGT, UP PGT, UP GIC, UP LT Grade, BPSC TRE एवं उत्तर प्रदेश, उत्तराखण्ड, मध्य प्रदेश, राजस्थान, बिहार, झारखण्ड शिक्षक भर्ती परीक्षाओं के लिए अनिवार्य संदर्भ ग्रंथ।',
    features: [
      '2500+ से अधिक स्तरीय वस्तुनिष्ठ प्रश्नों का प्रामाणिक संकलन',
      'विगत वर्षों के शिक्षक भर्ती एवं असिस्टेंट प्रोफेसर परीक्षाओं के हल प्रश्न-पत्र',
      'UGC NET, BPSC TRE, UP TGT/PGT, RPSC एवं DSSSB हेतु विशेष रूप से उपयोगी',
      'लेखक: डॉ. रजनीश कुमार यादव (बी.ए. बीएचयू, एम.ए., एम.फिल., पीएच.डी. जेएनयू नई दिल्ली)',
      'ISBN: 978-81-966432-4-9 | सम्प्रति: राजेन्द्र कॉलेज छपरा, जय प्रकाश वि.वि.'
    ],
    tableOfContents: [
      'खण्ड 1: काल-विभाजन एवं नामकरण (आदिकाल / वीरगाथा काल)',
      'खण्ड 2: भक्तिकाल (निर्गुण ज्ञानमार्गी, प्रेममार्गी, सगुण कृष्ण व राम काव्य)',
      'खण्ड 3: रीतिकाल (रीतिबद्ध, रीतिसिद्ध एवं रीतिमुक्त धारा)',
      'खण्ड 4: आधुनिक काल (भारतेन्दु युग, द्विवेदी युग, छायावाद, प्रगतिवाद, प्रयोगवाद)',
      'खण्ड 5: गद्य विधाएँ (उपन्यास, कहानी, नाटक, निबन्ध, आलोचना)',
      'खण्ड 6: 2500+ वस्तुनिष्ठ अभ्यास प्रश्न एवं व्याख्यात्मक उत्तर'
    ],
    samplePdfUrl: '/samples/hindi_sahitya_sample.pdf',
    coverGradient: 'from-amber-900 via-red-950 to-stone-950',
    coverIcon: 'BookOpen',
    patternYear: 'द्वितीय संस्करण: परिमार्जित और संशोधित',
    isTestSeries: true,
    testsCount: 25,
    bannerImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80%20%E0%A4%B8%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%AF%20%E0%A4%95%E0%A4%BE%20%E0%A4%87%E0%A4%A4%E0%A4%BF%E0%A4%B9%E0%A4%BE%E0%A4%B8%20(%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%81%E0%A4%A8%E0%A4%BF%E0%A4%B7%E0%A5%8D%E0%A4%A0%20%E0%A4%B8%E0%A4%82%E0%A4%95%E0%A4%B2%E0%A4%A8)%2C%20%E0%A4%A6%E0%A5%8D%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A5%80%E0%A4%AF%20%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%B0%E0%A4%A3%20%E2%80%94%20%E2%82%B9395.jpg'
  },
  {
    id: 'hindi-sahitya-itihas-rajneesh-ed1',
    title: 'हिन्दी साहित्य का इतिहास (वस्तुनिष्ठ संकलन - प्रथम संस्करण)',
    hindiTitle: 'हिन्दी साहित्य का इतिहास (वस्तुनिष्ठ संकलन) — ₹395',
    category: 'Teaching & UGC NET',
    subject: 'हिन्दी साहित्य एवं शिक्षक भर्ती विशेषांक',
    author: 'डॉ. रजनीश कुमार यादव (सहायक प्रोफेसर, हिन्दी - JNU/BHU)',
    paperbackPrice: 395,
    originalPrice: 480,
    ebookAvailable: true,
    rating: 4.9,
    reviewsCount: 2240,
    pages: 540,
    language: 'Hindi',
    badge: 'Best Seller',
    description: 'आचार्य रामचन्द्र शुक्ल कृत हिन्दी साहित्य के इतिहास पर आधारित सर्वाधिक लोकप्रिय प्रामाणिक वस्तुनिष्ठ संकलन। शिक्षक भर्ती एवं असिस्टेंट प्रोफेसर परीक्षाओं हेतु लाखों छात्रों की प्रथम पसंद।',
    features: [
      'वस्तुनिष्ठ प्रश्नों का प्रामाणिक एवं विस्तृत संकलन',
      'विगत वर्षों के सॉल्व्ड पेपर्स एवं मॉडल टेस्ट',
      'UGC NET, BPSC TRE, UP TGT/PGT हेतु अनिवार्य पुस्तक',
      'लेखक: डॉ. रजनीश कुमार यादव'
    ],
    tableOfContents: [
      'आदिकाल, भक्तिकाल, रीतिकाल एवं आधुनिक काल',
      'गद्य एवं पद्य की समस्त विधाएं',
      'विगत वर्षों के हल प्रश्न-पत्र'
    ],
    samplePdfUrl: '/samples/hindi_sahitya_sample.pdf',
    coverGradient: 'from-amber-800 via-rose-950 to-neutral-900',
    coverIcon: 'BookOpen',
    patternYear: 'प्रथम संस्करण',
    isTestSeries: true,
    testsCount: 20,
    bannerImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80%20%E0%A4%B8%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%AF%20%E0%A4%95%E0%A4%BE%20%E0%A4%87%E0%A4%A4%E0%A4%BF%E0%A4%B9%E0%A4%BE%E0%A4%B8%20(%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%81%E0%A4%A8%E0%A4%BF%E0%A4%B7%E0%A5%8D%E0%A4%A0%20%E0%A4%B8%E0%A4%82%E0%A4%95%E0%A4%B2%E0%A4%A8)%20%E2%80%94%20%E2%82%B9395.jpg'
  },
  {
    id: 'antarman-jagdish-narayan',
    title: 'अंतर्मन (जीविका पथ से सामाजिक सरोकार तक)',
    hindiTitle: 'अंतर्मन - जीविका पथ से सामाजिक सरोकार तक (सारगर्भित वैचारिक निबंध) — ₹350',
    category: 'UPSC & Civil Services',
    subject: 'सामाजिक चिंतन, लोक प्रशासन एवं मानवीय मूल्य',
    author: 'जगदीश नारायण श्रीवास्तव',
    paperbackPrice: 350,
    originalPrice: 420,
    ebookAvailable: true,
    rating: 4.88,
    reviewsCount: 1620,
    pages: 360,
    language: 'Hindi',
    badge: 'Top Rated',
    description: 'जीविका और जीवन के अंतर्संबंधों, मानवीय संवेदनाओं तथा सामाजिक सरोकारों का गहन दार्शनिक एवं व्यावहारिक विश्लेषण। सिविल सेवा मुख्य परीक्षा (निबंध एवं एथिक्स) तथा समाजशास्त्र के विद्यार्थियों के लिए उत्कृष्ट प्रेरणादायी कृति।',
    features: [
      'जीविका पक्ष से सामाजिक सरोकार तक का समग्र और व्यावहारिक चिंतन',
      'प्रशासनिक संवेदनशीलता, मानवीय मूल्य एवं कर्तव्यबोध पर विचारोत्तेजक लेख',
      'UPSC एवं राज्य सेवा मुख्य परीक्षा निबंध व साक्षात्कार हेतु विशेष रूप से उपयोगी',
      'समृद्ध भाषिक सौष्ठव और परिपक्व विश्लेषणात्मक शैली'
    ],
    tableOfContents: [
      'अध्याय 1: जीविका का अर्थ और आत्म-संतुष्टि की खोज',
      'अध्याय 2: सामाजिक ताना-बाना और व्यक्ति का उत्तरदायित्व',
      'अध्याय 3: आधुनिकता, प्रौद्योगिकी और मानवीय संवेदनशीलता',
      'अध्याय 4: लोक सेवा, संवेदना और नैतिक सरोकार',
      'अध्याय 5: जीवन-दृष्टि और अंतर्मन की यात्रा'
    ],
    samplePdfUrl: '/samples/antarman_sample.pdf',
    coverGradient: 'from-emerald-900 via-teal-950 to-slate-950',
    coverIcon: 'HeartHandshake',
    patternYear: '2026 Edition',
    bannerImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%85%E0%A4%82%E0%A4%A4%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%A8%20%E0%A4%9C%E0%A5%80%E0%A4%B5%E0%A4%BF%E0%A4%95%E0%A4%BE%20%E0%A4%AA%E0%A4%A5%20%E0%A4%B8%E0%A5%87%20%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9C%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A4%B0%E0%A5%8B%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%A4%E0%A4%95%20%E2%80%94%20%E2%82%B9350.jpg'
  },
  {
    id: 'discovery-of-democracy-raghvendra-dubey',
    title: 'डिस्कवरी ऑफ डेमोक्रेसी (\'डिस्कवरी ऑफ इंडिया\' से आगे)',
    hindiTitle: 'डिस्कवरी ऑफ डेमोक्रेसी डिस्कवरी ऑफ इंडिया’ से आगे — ₹495',
    category: 'UPSC & Civil Services',
    subject: 'राजनीतिक दर्शन, आधुनिक भारतीय इतिहास एवं समकालीन लोकतंत्र',
    author: 'राघवेन्द्र दुबे \'भाऊ\'',
    paperbackPrice: 495,
    originalPrice: 595,
    ebookAvailable: true,
    rating: 4.92,
    reviewsCount: 2410,
    pages: 440,
    language: 'Hindi',
    badge: 'New & Upcoming',
    description: 'पंडित जवाहरलाल नेहरू की कालजयी पुस्तक \'डिस्कवरी ऑफ इंडिया\' की वैचारिक निरंतरता में 21वीं सदी के भारतीय लोकतंत्र का शोधपरक विश्लेषण। राहुल गांधी के नेतृत्व में संपन्न ऐतिहासिक \'भारत जोड़ो यात्रा\' का जीवंत प्रत्यक्ष रिपोर्ताज एवं लोकतांत्रिक विमर्श।',
    features: [
      '\'जैसे सांस देश की\' का बहुप्रतीक्षित परिवर्धित संस्करण',
      'कन्याकुमारी से कश्मीर तक \'भारत जोड़ो यात्रा\' का प्रामाणिक रिपोर्ताज',
      'भारतीय लोकतंत्र, संविधान, सेक्युलरिज्म एवं सामाजिक समरसता पर सांगोपांग दृष्टि',
      'राजनीति विज्ञान, समकालीन इतिहास एवं सामान्य अध्ययन हेतु मूल्यवान संकलन'
    ],
    tableOfContents: [
      'भाग 1: लोकतंत्र की ऐतिहासिक आधारशिला - नेहरू से आज तक',
      'भाग 2: आधुनिक भारत की चुनौतियाँ और जन-संवाद का पुनरोदय',
      'भाग 3: भारत जोड़ो यात्रा - डायरी के पन्नों से कश्मीर की वादियों तक',
      'भाग 4: युवाओं, किसानों और वंचितों की आवाज',
      'भाग 5: लोकतंत्र की पुनर्खोज - भावी भारत का विजन'
    ],
    samplePdfUrl: '/samples/discovery_democracy_sample.pdf',
    coverGradient: 'from-slate-950 via-emerald-950 to-stone-900',
    coverIcon: 'Award',
    patternYear: 'परिवर्धित संस्करण 2026',
    bannerImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%A1%E0%A4%BF%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%B5%E0%A4%B0%E0%A5%80%20%E0%A4%91%E0%A4%AB%20%E0%A4%A1%E0%A5%87%E0%A4%AE%E0%A5%8B%E0%A4%95%E0%A5%8D%E0%A4%B0%E0%A5%87%E0%A4%B8%E0%A5%80%20%E0%A4%A1%E0%A4%BF%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%B5%E0%A4%B0%E0%A5%80%20%E0%A4%91%E0%A4%AB%20%E0%A4%87%E0%A4%82%E0%A4%A1%E0%A4%BF%E0%A4%AF%E0%A4%BE%E2%80%99%20%E0%A4%B8%E0%A5%87%20%E0%A4%86%E0%A4%97%E0%A5%87%20%E2%80%94%20%E2%82%B9495.jpg'
  },
  {
    id: 'nirvachan-loktantra-ka-aadhar-arun-singh',
    title: 'निर्वाचन (लोकतंत्र का आधार)',
    hindiTitle: 'निर्वाचन लोकतंत्र का आधार — ₹275',
    category: 'All State Exam',
    subject: 'भारतीय राजव्यवस्था, चुनाव आयोग एवं लोक प्रतिनिधित्व कानून',
    author: 'डा. अरुण प्रताप सिंह',
    paperbackPrice: 275,
    originalPrice: 350,
    ebookAvailable: true,
    rating: 4.85,
    reviewsCount: 1980,
    pages: 320,
    language: 'Hindi',
    badge: 'Best Seller',
    description: 'लोकतंत्र के सबसे बड़े उत्सव एवं संवैधानिक स्तम्भ "निर्वाचन" पर समग्र और प्रामाणिक पुस्तक। निर्वाचन आयोग के अधिकार, ईवीएम/वीवीपैट प्रणाली, जन-प्रतिनिधित्व अधिनियम 1951, तथा चुनावी सुधारों की ऐतिहासिक यात्रा का सरल और सुबोध विश्लेषण।',
    features: [
      'भारत निर्वाचन आयोग (ECI) की संरचना, शक्तियाँ और संवैधानिक अनुच्छेद 324-329',
      'चुनावी सुधार, धनबल व बाहुबल पर अंकुश तथा आदर्श आचार संहिता की बारीकियां',
      'UPSC, राज्य लोक सेवा आयोग (UPPSC, BPSC, RAS, MPPSC) हेतु प्रामाणिक गाइड',
      'मतदाता अधिकार एवं लोकतांत्रिक जागरूकता का संपूर्ण दस्तावेज'
    ],
    tableOfContents: [
      'अध्याय 1: लोकतंत्र की आत्मा - निर्वाचन की अवधारणा',
      'अध्याय 2: भारतीय संविधान में निर्वाचन संबंधी प्रावधान',
      'अध्याय 3: चुनाव सुधार - तारकुंडे समिति से आधुनिक तकनीकी सुधारों तक',
      'अध्याय 4: ईवीएम, वीवीपैट एवं मतदाता सत्यापन प्रक्रिया',
      'अध्याय 5: मॉडल प्रश्नोत्तरी एवं सिविल सेवा मुख्य परीक्षा प्रारूप'
    ],
    samplePdfUrl: '/samples/nirvachan_sample.pdf',
    coverGradient: 'from-amber-600 via-yellow-700 to-slate-900',
    coverIcon: 'ShieldCheck',
    patternYear: '2026 Edition',
    bannerImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%A8%E0%A4%BF%E0%A4%B0%E0%A5%8D%E0%A4%B5%E0%A4%BE%E0%A4%9A%E0%A4%A8%20%E0%A4%B2%E0%A5%8B%E0%A4%95%E0%A4%A4%E0%A4%82%E0%A4%A4%E0%A5%8D%E0%A4%B0%20%E0%A4%95%E0%A4%BE%20%E0%A4%86%E0%A4%A7%E0%A4%BE%E0%A4%B0%20%E2%80%94%20%E2%82%B9275.jpg'
  },
  {
    id: 'ssc-gd-2026',
    title: 'SSC GD Constable (2026 Latest Pattern)',
    hindiTitle: 'एसएससी जीडी कांस्टेबल 10 टेस्ट सीरीज एवं गाइड',
    category: 'All SSC Exam',
    subject: 'Complete Exam Guide & Practice',
    author: 'Samwedna Editorial Board & Expert Faculty',
    paperbackPrice: 449,
    originalPrice: 699,
    ebookAvailable: true,
    rating: 4.8,
    reviewsCount: 1420,
    pages: 480,
    language: 'Hindi',
    badge: 'Best Seller',
    description: 'Comprehensive preparation manual strictly aligned with the latest 2026 SSC GD syllabus. Contains 10 full-length offline+online test series, previous 5 years solved papers, and topic-wise conceptual shortcuts for Reasoning, GK, Elementary Maths, and Hindi/English.',
    features: [
      '10 Full-Length Mock Tests on New Pattern',
      'Detailed Step-by-Step Solutions in Hindi',
      'Quick Formula Revision Booklet included',
      'Free OMR Practice Sheets for offline drill',
      'QR Code for Video Solution of Tough Questions'
    ],
    tableOfContents: [
      'General Intelligence & Reasoning (80 Marks Blueprint)',
      'General Knowledge & General Awareness (History, Polity, Static GK)',
      'Elementary Mathematics (Speed Arithmetic Tricks)',
      'Hindi / English Grammar & Comprehension',
      'Mock Tests 1 to 10 with Detailed Explanations',
      'Previous Years Solved Papers 2023 - 2025'
    ],
    samplePdfUrl: '/samples/ssc_gd_sample.pdf',
    coverGradient: 'from-sky-700 via-blue-800 to-slate-900',
    coverIcon: 'ShieldAlert',
    patternYear: '2026 New Pattern',
    isTestSeries: true,
    testsCount: 10
  },
  {
    id: 'rrb-ntpc-paper1',
    title: 'RRB NTPC Stage-I & II (2026 Pattern)',
    hindiTitle: 'आरआरबी एनटीपीसी - 10 टेस्ट सीरीज + अध्यायवार प्रश्नोत्तर',
    category: 'All Railway Exam',
    subject: 'Railway Recruitment Board Complete Series',
    author: 'Er. R.K. Verma & Samwedna R&D Cell',
    paperbackPrice: 479,
    originalPrice: 699,
    ebookAvailable: true,
    rating: 4.9,
    reviewsCount: 2180,
    pages: 520,
    language: 'Hindi',
    badge: 'Best Seller',
    description: 'Master Railway Non-Technical Popular Categories examinations. Featuring high-yield railway-specific General Awareness, Science questions, Speed Maths, and high-level reasoning simulations.',
    features: [
      '10 Full-Length CBT Simulation Tests',
      'Detailed Railway Science & Current Affairs Focus',
      'Previous 2016, 2019, 2024 Exam Analysis',
      'TCS Exam Interface Mock Access Code'
    ],
    tableOfContents: [
      'Railway Special General Science (Physics, Chemistry, Biology)',
      'Mathematics - Arithmetic & Advanced Algebra/Geometry',
      'General Intelligence & Analytical Reasoning',
      'Indian Railways Trivia, Budget & Infrastructure GK',
      'Stage 1 CBT Practice Papers 01 - 10'
    ],
    samplePdfUrl: '/samples/rrb_ntpc_sample.pdf',
    coverGradient: 'from-blue-900 via-indigo-900 to-slate-950',
    coverIcon: 'TrainTrack',
    patternYear: '2026 Edition',
    isTestSeries: true,
    testsCount: 10
  },
  {
    id: 'ssc-cgl-tier1',
    title: 'SSC CGL Tier-I Master Prep (10 Test Series)',
    hindiTitle: 'एसएससी सीजीएल टियर - 1 (लेटेस्ट पैटर्न 2026)',
    category: 'All SSC Exam',
    subject: 'Staff Selection Commission Combined Graduate Level',
    author: 'Dr. Vivek Sharma & Samwedna Faculty',
    paperbackPrice: 519,
    originalPrice: 799,
    ebookAvailable: true,
    rating: 4.9,
    reviewsCount: 3100,
    pages: 560,
    language: 'Bilingual',
    badge: 'Best Seller',
    description: 'The golden benchmark for SSC CGL Tier-1 aspirants. Features exhaustive problem explanations, bilingual text, smart elimination techniques, and verified answers compiled by top rankers.',
    features: [
      '10 Tier-1 CBT Pattern Mock Exams',
      'Comprehensive Bilingual Explanations (Eng/Hin)',
      'Sectional Cutoff & Difficulty Level Tagging',
      'Exclusive Mensuration & Geometry Cheat Codes'
    ],
    tableOfContents: [
      'Quantitative Aptitude (Arithmetic + Advanced)',
      'English Comprehension & Grammar Rules',
      'General Intelligence & Logical Reasoning',
      'General Studies & Science Module',
      '10 Full Mock Papers with OMR & Online Codes'
    ],
    samplePdfUrl: '/samples/ssc_cgl_sample.pdf',
    coverGradient: 'from-slate-900 via-teal-900 to-emerald-950',
    coverIcon: 'Award',
    patternYear: '2026 Pattern',
    isTestSeries: true,
    testsCount: 10
  },
  {
    id: 'rpf-constable-si',
    title: 'RPF Constable & Sub-Inspector 2026',
    hindiTitle: 'आरपीएफ कांस्टेबल एवं उप निरीक्षक - 10 टेस्ट सीरीज',
    category: 'All Railway Exam',
    subject: 'Railway Protection Force',
    author: 'Samwedna Defence Wing',
    paperbackPrice: 429,
    originalPrice: 649,
    ebookAvailable: true,
    rating: 4.7,
    reviewsCount: 980,
    pages: 440,
    language: 'Hindi',
    badge: 'New & Upcoming',
    description: 'Specialized testing handbook for Railway Protection Force recruitment. Contains high-probability general awareness topics, mental ability exercises, and numerical ability tests.',
    features: [
      '10 Test Series with Instant Solution Keys',
      'Special Focus on Constitution, Railway Security & Sports',
      'Physical Efficiency Test (PET/PMT) Guidelines Guide'
    ],
    tableOfContents: [
      'General Awareness (50 Questions Blueprint)',
      'Arithmetic (35 Questions Speed Tests)',
      'General Intelligence & Reasoning (35 Questions)',
      '10 Practice Papers with Detailed Explanations'
    ],
    samplePdfUrl: '/samples/rpf_sample.pdf',
    coverGradient: 'from-blue-800 via-blue-950 to-neutral-900',
    coverIcon: 'ShieldCheck',
    patternYear: '2026 Edition',
    isTestSeries: true,
    testsCount: 10
  },
  {
    id: 'static-gk-booster',
    title: 'General Knowledge & Static GK Encyclopedia',
    hindiTitle: 'सामान्य ज्ञान - स्टैटिक जीके कम्पलीट एनसाइक्लोपीडिया',
    category: 'All State Exam',
    subject: 'Static GK for All Central & State Govt Exams',
    author: 'Samwedna Research Editorial Team',
    paperbackPrice: 389,
    originalPrice: 599,
    ebookAvailable: true,
    rating: 4.9,
    reviewsCount: 4120,
    pages: 620,
    language: 'Hindi',
    badge: 'Best Seller',
    description: 'The definitive static GK handbook trusted by more than 3,500 coaching institutes. Packed with curated tables, mindmaps, mnemonics, and 5000+ targeted one-liners covering Indian Art & Culture, Rivers, Monuments, Biospheres, Awards, and First in India.',
    features: [
      '5000+ Exam-Proven One Liners',
      'High-Density Mindmaps & Color Tables',
      'Art & Culture, Temples, Dances & Festivals Covered',
      'QR Links for Audio Flashcards'
    ],
    tableOfContents: [
      'Indian History & National Movement Chronology',
      'Indian & World Geography with Color Maps',
      'Indian Polity & Constitution Simplified',
      'Indian Economy & Budget Fundamentals',
      'Static GK Mega Section (Dances, Sports, Awards, Biosphere)'
    ],
    samplePdfUrl: '/samples/static_gk_sample.pdf',
    coverGradient: 'from-rose-900 via-red-950 to-neutral-950',
    coverIcon: 'Globe2',
    patternYear: '2026 Edition'
  },
  {
    id: 'reasoning-verbal-nonverbal',
    title: 'Verbal & Non-Verbal Reasoning Master Guide',
    hindiTitle: 'तर्कशक्ति - वर्बल एवं नॉन-वर्बल रीजनिंग मास्टर गाइड',
    category: 'All Bank Exam',
    subject: 'Reasoning for SSC, Banking, Railways & Defence',
    author: 'P.K. Agnihotri',
    paperbackPrice: 469,
    originalPrice: 699,
    ebookAvailable: true,
    rating: 4.8,
    reviewsCount: 1840,
    pages: 580,
    language: 'Hindi',
    badge: 'Discounted',
    description: 'Master puzzles, seating arrangements, syllogisms, analogies, and cube dice problems with patented 30-second shortcut techniques and graphical breakdown methods.',
    features: [
      'Step-by-step logic algorithms for critical reasoning',
      '2500+ Practice MCQs categorized by difficulty levels',
      'Special Bank PO High-Level Puzzles included'
    ],
    tableOfContents: [
      'Verbal Reasoning (Analogy, Classification, Coding-Decoding)',
      'Analytical Reasoning (Syllogism, Statement & Assumption)',
      'Non-Verbal Reasoning (Mirror Images, Paper Folding, Figure Matrices)',
      'Advanced Banking Seating Arrangements & Floor Puzzles'
    ],
    samplePdfUrl: '/samples/reasoning_sample.pdf',
    coverGradient: 'from-indigo-900 via-purple-950 to-slate-900',
    coverIcon: 'BrainCircuit',
    patternYear: '2026 Edition'
  },
  {
    id: 'english-a-to-z',
    title: 'English Vocabulary & Grammar A to Z',
    hindiTitle: 'इंग्लिश वोकैब्युलरी एवं ग्रामर - ए टू जेड कम्पलीट बुक',
    category: 'All SSC Exam',
    subject: 'English for Competitive Examinations',
    author: 'A.K. Saxena & Editorial Board',
    paperbackPrice: 399,
    originalPrice: 599,
    ebookAvailable: true,
    rating: 4.7,
    reviewsCount: 1650,
    pages: 490,
    language: 'English',
    badge: 'Best Seller',
    description: 'Essential English textbook for SSC CGL, CHSL, Bank PO, CDS, and NDA. Features 3,000+ high-frequency root words, mnemonics, 1,200 idioms & phrases, and 100 golden grammar rules.',
    features: [
      '100 Golden Rules of Grammar with error spotting drills',
      'Root word vocabulary with visual associations',
      'Cloze test & Parajumbles mastery modules',
      '10 Mock English Comprehension tests'
    ],
    tableOfContents: [
      'Grammar Fundamentals: Parts of Speech in Depth',
      'Sentence Improvement & Error Spotting Golden Rules',
      'Vocabulary Builder: Synonyms, Antonyms & One Word Substitution',
      'Idioms, Phrasal Verbs & Foreign Words in Exams',
      'Reading Comprehension & Cloze Test Drills'
    ],
    samplePdfUrl: '/samples/english_sample.pdf',
    coverGradient: 'from-sky-900 via-cyan-950 to-slate-950',
    coverIcon: 'BookOpen',
    patternYear: '2026 Edition'
  },
  {
    id: 'current-affairs-monthly-2026',
    title: 'Samwedna Current Affairs Monthly Magazine',
    hindiTitle: 'सम्वेदना करेंट अफेयर्स मासिक पत्रिका (अद्यतन संस्करण)',
    category: 'All State Exam',
    subject: 'Monthly Digest & Yearly One-Liner Compilation',
    author: 'Samwedna Current Affairs Research Desk',
    paperbackPrice: 149,
    originalPrice: 220,
    ebookAvailable: true,
    rating: 4.9,
    reviewsCount: 5200,
    pages: 180,
    language: 'Bilingual',
    badge: 'New & Upcoming',
    description: 'The premier national current affairs digest. Covering national news, international summits, sports awards, indices, government schemes, defense exercises, and 1,000+ monthly practice MCQs.',
    features: [
      '7-in-1 format: Daily, Weekly & Monthly capsules',
      'Bilingual format with clear bullet points',
      'Subject-wise bifurcation for instant revision',
      'Included monthly test paper with OMR answer key'
    ],
    tableOfContents: [
      'National News & Central Government Schemes',
      'International Relations, G20, BRICS & Treaties',
      'Economic Survey, Union Budget & RBI Highlights',
      'Science, Space (ISRO/NASA) & Defence Technology',
      'Sports, Awards, Appointments, Books & Obituaries',
      '300 Practice MCQs with Detailed Solutions'
    ],
    samplePdfUrl: '/samples/current_affairs_sample.pdf',
    coverGradient: 'from-emerald-800 via-teal-900 to-slate-900',
    coverIcon: 'Newspaper',
    patternYear: 'October 2026 Issue'
  },
  {
    id: 'bank-po-quant-pro',
    title: 'Quantitative Aptitude for Bank PO & Clerk',
    hindiTitle: 'बैंकिंग क्वांटिटेटिव एप्टीट्यूड - प्री एवं मेन्स',
    category: 'All Bank Exam',
    subject: 'Data Interpretation & Arithmetic Mastery',
    author: 'S.N. Trivedi',
    paperbackPrice: 489,
    originalPrice: 749,
    ebookAvailable: true,
    rating: 4.8,
    reviewsCount: 1120,
    pages: 540,
    language: 'English',
    badge: 'Discounted',
    description: 'Designed specifically for SBI PO, IBPS PO, and RBI Grade B. High-emphasis on caselet DI, radar charts, missing arithmetic, and approximation speed drills.',
    features: [
      '500+ Advanced Data Interpretation Sets',
      'Vedic Maths techniques for 3-second mental calculations',
      'Mains-level arithmetic application problems'
    ],
    tableOfContents: [
      'Speed Math & Vedic Calculation Hacks',
      'Arithmetic Core: Percentages, Profit & Loss, SI & CI',
      'Modern Math: Permutations, Probability & Mensuration',
      'Data Interpretation: Bar, Pie, Radar & Caselet Tables'
    ],
    samplePdfUrl: '/samples/bank_quant_sample.pdf',
    coverGradient: 'from-amber-900 via-stone-900 to-neutral-950',
    coverIcon: 'Calculator',
    patternYear: '2026 Edition'
  },
  {
    id: 'defence-agniveer-combo',
    title: 'Agniveer Army & Navy 5 Books + 50 Test Series Combo',
    hindiTitle: 'अग्निवीर थल सेना एवं नौसेना 5 पुस्तकें + 50 टेस्ट सीरीज कॉम्बो',
    category: 'All Defence Exam',
    subject: 'Indian Army GD, Clerk, Technical & Tradesman',
    author: 'Col. (Retd.) B.S. Rathore & Samwedna Team',
    paperbackPrice: 999,
    originalPrice: 1899,
    ebookAvailable: true,
    rating: 4.9,
    reviewsCount: 1780,
    pages: 940,
    language: 'Hindi',
    badge: 'Discounted',
    description: 'All-in-one comprehensive recruitment kit for Agniveer candidates. Includes 5 printed handbooks (Maths, Science, GK, English, Reasoning) plus digital pass for 50 computer-based test series.',
    features: [
      '5 Complete Subject Handbooks in a Box Pack',
      'Access to 50 Full-Length Online Mock Tests',
      'Physical Training & Medical Screening Tips Manual',
      'Bilingual Question Bank with 6,000+ MCQs'
    ],
    tableOfContents: [
      'Book 1: General Science Fundamentals (Physics, Chem, Bio)',
      'Book 2: General Knowledge & Current Defence Affairs',
      'Book 3: Arithmetic & Mensuration for Army Recruitment',
      'Book 4: Reasoning & Mental Ability',
      'Book 5: 50 CBT Simulation Test Papers with Solutions'
    ],
    samplePdfUrl: '/samples/agniveer_sample.pdf',
    coverGradient: 'from-emerald-950 via-teal-950 to-neutral-900',
    coverIcon: 'Shield',
    patternYear: '2026 Edition',
    isTestSeries: true,
    testsCount: 50
  }
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: 'Free Starter',
    price: 0,
    billingPeriod: 'Forever Free',
    description: 'Perfect for students exploring syllabus and sample exam papers.',
    features: [
      'Access to 5 Sample Chapters of any book',
      'Download 2 Mock Test Series Papers (PDF)',
      'Daily Current Affairs Brief (Web)',
      'Participate in Weekly All-India Open Mock Test',
      'Standard community support'
    ],
    buttonText: 'Get Started Free',
    popular: false,
    badge: 'Starter'
  },
  {
    id: 'monthly',
    name: 'Monthly Pro Pass',
    price: 299,
    billingPeriod: 'per month',
    description: 'Uncapped digital library access with all monthly magazines & test series.',
    features: [
      'Unlimited PDF E-Book Downloads across all subjects',
      'Instant access to all 50+ CBT Online Test Series',
      'Daily, Weekly & Monthly Current Affairs PDF files',
      'Detailed Performance Analytics & Rank Predictor',
      '10% Flat Discount on all Paperback Book purchases',
      'Ad-free reading experience on mobile & web'
    ],
    buttonText: 'Subscribe Monthly',
    popular: false,
    badge: 'Flexible'
  },
  {
    id: 'yearly',
    name: 'Yearly Elite Scholar',
    price: 1499,
    billingPeriod: 'per year (Save 58%)',
    description: 'The ultimate subscription for serious government exam aspirants.',
    features: [
      'Everything in Monthly Pro Pass',
      'Unlimited downloads of all 100+ Books & Magazines',
      'Full Access to Video Lectures & Masterclasses',
      'Exclusive 1-on-1 Mentorship Session with toppers',
      'Priority Delivery & 20% off all Paperback Books',
      'White-label offline printable question sets',
      'Valid for 365 Days across all devices'
    ],
    buttonText: 'Subscribe Yearly Elite',
    popular: true,
    badge: 'Most Popular'
  }
];

export const ACADEMIC_COURSES: AcademicCourse[] = [
  {
    id: 'upsc-state-pcs',
    title: 'Integrated Civil Services Foundation Program (UPSC & State PCS)',
    targetExam: 'UPSC CSE & State PSC Exams (UPPSC, BPSC, RAS, MPPSC)',
    duration: '12 Months (Comprehensive Cycle)',
    mode: 'Classroom + Hybrid',
    summary: 'A rigorous academic curriculum combining conceptual NCERT grounding, standard reference text analyses, daily answer-writing drills, and prelims test series managed by former civil servants and subject matter authorities.',
    highlights: [
      '650+ Hours of Classroom & Live Interactive Sessions',
      'Comprehensive 14-Volume Samwedna Printed Book Kit',
      'Weekly Prelims Mock Tests + Monthly Mains Answer Evaluation',
      'Exclusive Interview Guidance Program by Bureaucrats',
      'Current Affairs Monthly Magazine delivered to home'
    ],
    curriculumOverview: [
      'Module 1: Indian Polity, Constitution & Governance Framework',
      'Module 2: Indian History, Art & Culture, Modern World Dynamics',
      'Module 3: Geography, Environment, Ecology & Disaster Management',
      'Module 4: Indian Economy, Inclusive Growth & Union Budget Analysis',
      'Module 5: Science & Technology, Internal Security, Ethics & Essay'
    ],
    brochureFileName: 'Samwedna_UPSC_Foundation_Brochure_2026.pdf',
    syllabusFileName: 'UPSC_State_PCS_Complete_Syllabus_Breakdown.pdf',
    feeDetails: {
      tuitionFee: 32000,
      studyMaterial: 4500,
      testSeriesFee: 3500,
      total: 40000,
      installments: '3 Easy Installments of ₹14,000'
    }
  },
  {
    id: 'ssc-cgl-achiever',
    title: 'SSC CGL & CHSL 360° Achiever Batch (Tier-I & Tier-II)',
    targetExam: 'SSC CGL, CHSL, CPO, MTS & Stenographer',
    duration: '6 Months (Intensive)',
    mode: 'Online Live + Recorded',
    summary: 'The ultimate result-oriented classroom program for central government jobs. Focuses on rapid speed arithmetic, logical clarity, 100 grammar rules, and dynamic computer/typing module preparation.',
    highlights: [
      '350+ Hours of High-Yield Live Sessions',
      'Full Set of 6 Samwedna Printed Books & Formula Charts',
      '100+ Full-Length CBT Mock Tests with AI Rank Analytics',
      'Special Doubt Resolution Desk with Subject Mentors'
    ],
    curriculumOverview: [
      'Module 1: Quantitative Aptitude (Speed Arithmetic & Geometry)',
      'Module 2: General Intelligence & Analytical Reasoning',
      'Module 3: English Language & Comprehension Precision',
      'Module 4: General Studies & Static GK Booster',
      'Module 5: Tier-II Computer Knowledge & Typing Test Prep'
    ],
    brochureFileName: 'Samwedna_SSC_Achiever_Brochure.pdf',
    syllabusFileName: 'SSC_CGL_CHSL_Detailed_Syllabus.pdf',
    feeDetails: {
      tuitionFee: 12000,
      studyMaterial: 2500,
      testSeriesFee: 1500,
      total: 16000,
      installments: '2 Installments of ₹8,500'
    }
  },
  {
    id: 'bank-po-ace',
    title: 'Banking & Financial Sector Comprehensive Program',
    targetExam: 'SBI PO, IBPS PO, RRB Scale-I, RBI Assistant',
    duration: '5 Months (Fast-Track)',
    mode: 'Online Live + Recorded',
    summary: 'Tailored for banking aspirants targeting public sector banks and regulatory bodies. Covers advanced caselet Data Interpretation, high-level seating puzzles, banking awareness, and group discussion coaching.',
    highlights: [
      'Daily 2-Hour Speed Calculation & Puzzle Drills',
      'Special Financial & Economic Awareness Capsules',
      '80 Full-Length Mock Exams with sectional timer constraints',
      'Mock Interview & Personality Development Sessions'
    ],
    curriculumOverview: [
      'Module 1: Advanced Data Interpretation & Quantitative Reasoning',
      'Module 2: High-Level Analytical Puzzles & Logical Reasoning',
      'Module 3: English for Banking: Reading, Vocabulary, Error Detection',
      'Module 4: Banking Awareness, RBI Regulations & Monetary Policy',
      'Module 5: Descriptive English Writing (Letter & Essay for Mains)'
    ],
    brochureFileName: 'Samwedna_Banking_Brochure.pdf',
    syllabusFileName: 'Banking_PO_Clerk_Syllabus_Guide.pdf',
    feeDetails: {
      tuitionFee: 10500,
      studyMaterial: 2000,
      testSeriesFee: 1500,
      total: 14000,
      installments: '2 Installments of ₹7,500'
    }
  },
  {
    id: 'railway-super-batch',
    title: 'Railway Recruitment Comprehensive Super Batch',
    targetExam: 'RRB NTPC, Group D, ALP, Technician, RPF',
    duration: '4 Months (Crash Course + Test Series)',
    mode: 'Self-Paced Digital',
    summary: 'Focused crash program tailored for the vast railway recruitment drives. High emphasis on general science (Physics, Chemistry, Biology experiments), mental ability, and railway specific current affairs.',
    highlights: [
      'Complete Video Lectures Covering Entire NCERT Science',
      'Railway Special General Science Question Bank (3000+ MCQs)',
      '50 Online Computer-Based Tests on Actual TCS Pattern',
      'Full Hindi & English bilingual notes'
    ],
    curriculumOverview: [
      'Module 1: General Science (Physics, Chemistry, Life Sciences)',
      'Module 2: Elementary Mathematics & Calculation Shortcuts',
      'Module 3: General Intelligence & Diagrammatic Reasoning',
      'Module 4: General Awareness & Indian Railways Special Capsule'
    ],
    brochureFileName: 'Samwedna_Railway_Brochure.pdf',
    syllabusFileName: 'Railway_Recruitment_Complete_Syllabus.pdf',
    feeDetails: {
      tuitionFee: 6500,
      studyMaterial: 1500,
      testSeriesFee: 1000,
      total: 9000,
      installments: 'Single Payment / 2 Installments of ₹4,800'
    }
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'ssc-cgl-strategy-2026',
    title: 'How to Score 170+ in SSC CGL Tier-1: 90-Day Blueprint',
    excerpt: 'Detailed section-wise study timetable, essential books, speed calculation methods, and mock test analysis strategy curated by top rankers.',
    content: `Preparing for SSC CGL requires balancing accuracy with blistering speed. In this comprehensive guide, we dissect the Tier-1 exam pattern and offer a structured 90-day execution framework.

### 1. Mathematics & Speed Arithmetic
Focus on high-weightage chapters first: Geometry, Mensuration, Trigonometry, and Data Interpretation. Practice tables up to 30, squares up to 50, and cubes up to 25 every single morning for 15 minutes.

### 2. General Intelligence & Reasoning
Reasoning in SSC CGL has evolved from simple analogic questions to multi-layered coding-decoding and number series. Ensure you dedicate 45 minutes daily to solving 50 mixed-pattern questions.

### 3. General Studies Strategy
Do not wander aimlessly across endless internet PDFs. Stick to Samwedna Static GK Encyclopedia and the Monthly Current Affairs magazine. Static topics such as Classical Dances, Biosphere Reserves, Fundamental Rights, and Mughal Architecture consistently fetch 8-10 direct marks.

### 4. Mock Test Discipline
Take at least 2 full-length mocks per week in the first month, increasing to 1 mock every alternate day in the final 30 days. Most importantly, spend 2 hours analyzing every single incorrect and unattempted question.`,
    author: 'Er. R.K. Verma',
    authorRole: 'Chief Academic Mentor, Samwedna Prakashan',
    date: 'October 4, 2026',
    readTime: '6 min read',
    category: 'Exam Strategy',
    tags: ['SSC CGL', 'Preparation Plan', 'Speed Maths', 'Mock Tests']
  },
  {
    id: 'current-affairs-october-highlights',
    title: 'Monthly Current Affairs Digest: Key Summits, Awards & Schemes',
    excerpt: 'Crucial current events compilation for all central and state exams. High-yield points formatted for rapid revision before the examination.',
    content: `This month has witnessed significant geopolitical developments, key sports achievements, and vital national policy announcements. Here are the top 10 examination-oriented takeaways:

1. **New Green Energy Corridor Phase-III**: Approved by the Union Cabinet to evacuate 20 GW of renewable energy across western and northern grids.
2. **Global Maritime India Summit 2026**: High-level agreements signed focusing on inland waterways modernization and green port logistics.
3. **ISRO Shukrayaan Venus Mission Updates**: Payload integration finalized for deep-space atmospheric exploration.
4. **Reserve Bank of India Monetary Policy**: Key policy repo rate held steady with enhanced digital lending transparent disclosure norms.
5. **Sahitya Akademi Yuva Puraskar**: Highlights of award-winning regional authors and celebrated works.

Remember to test your retention by attempting our free monthly current affairs quiz on the Samwedna portal!`,
    author: 'Pooja Tiwari',
    authorRole: 'Current Affairs Editor',
    date: 'October 1, 2026',
    readTime: '5 min read',
    category: 'Current Affairs',
    tags: ['Current Affairs', 'Monthly Roundup', 'GK Booster']
  },
  {
    id: 'railway-exam-science-mastery',
    title: 'Mastering General Science for RRB NTPC and Group D',
    excerpt: 'Why 9th and 10th NCERT science fundamentals form the bedrock of railway exams, and how to master numerical problems in physics.',
    content: `Railway Recruitment Board examinations place immense weight on General Science. Unlike other exams where science questions are purely factual, RRB consistently tests numerical concepts in Physics and chemical reaction equations.

Key areas to master:
- **Physics**: Newton's laws of motion, Work, Energy & Power formulas, Ohm's law circuits, and concave/convex mirror ray optics.
- **Chemistry**: Periodic table classification trends, pH values of everyday substances, and metallurgy basics.
- **Biology**: Human circulatory and nervous systems, plant hormones, and infectious diseases classification.

Samwedna General Science Handbook provides solved numerical problems for each of these chapters to guarantee maximum marks.`,
    author: 'Dr. Vivek Sharma',
    authorRole: 'Senior Faculty, Science Wing',
    date: 'September 25, 2026',
    readTime: '7 min read',
    category: 'Subject Guide',
    tags: ['RRB NTPC', 'Railway Exams', 'General Science']
  }
];

export const VIDEO_LECTURES: VideoLecture[] = [
  {
    id: 'vid-1',
    title: 'Indian Constitution & Preamble Masterclass (Article 1 to 51A)',
    subject: 'Indian Polity',
    instructor: 'Adv. Alok Srivastava',
    duration: '1 hr 45 min',
    views: '124K views',
    exam: 'UPSC & SSC CGL',
    thumbnailGradient: 'from-blue-900 to-indigo-950',
    description: 'Complete breakdown of constitutional articles, historical background, fundamental rights, and landmark Supreme Court verdicts with exam shortcuts.'
  },
  {
    id: 'vid-2',
    title: 'Speed Arithmetic: 15 Vedic Maths Hacks to Solve Questions in 5 Sec',
    subject: 'Quantitative Aptitude',
    instructor: 'Prof. Ankit Gupta',
    duration: '2 hr 10 min',
    views: '240K views',
    exam: 'SSC CGL & Bank PO',
    thumbnailGradient: 'from-amber-900 to-stone-900',
    description: 'Learn instantaneous multiplication, square roots, percentage calculations, and digital sum elimination methods.'
  },
  {
    id: 'vid-3',
    title: 'Static GK: All Classical Dances, Temples & Folk Art in One Video',
    subject: 'Static GK',
    instructor: 'Meenakshi Sundaram',
    duration: '1 hr 30 min',
    views: '310K views',
    exam: 'All Competitive Exams',
    thumbnailGradient: 'from-rose-900 to-red-950',
    description: 'Mnemonics and map-based visualization for every major art form, festival, and UNESCO heritage site in India.'
  },
  {
    id: 'vid-4',
    title: 'Reasoning: High-Level Floor & Circular Seating Puzzles',
    subject: 'Logical Reasoning',
    instructor: 'P.K. Agnihotri',
    duration: '1 hr 55 min',
    views: '98K views',
    exam: 'Bank PO & RRB',
    thumbnailGradient: 'from-purple-900 to-slate-950',
    description: 'Master 2-variable and 3-variable complicated seating arrangements without panic using matrix grid notation.'
  },
  {
    id: 'vid-5',
    title: 'LIVE Mega Session: 500 Most Important Current Affairs MCQs 2026',
    subject: 'Current Affairs',
    instructor: 'Samwedna Research Faculty',
    duration: '3 hr 00 min',
    views: 'Upcoming',
    exam: 'All Exams',
    thumbnailGradient: 'from-emerald-900 to-teal-950',
    isUpcoming: true,
    upcomingDate: 'Sunday, 11:00 AM IST',
    description: 'Comprehensive live marathon covering national summits, sports, defense exercises, and economic survey facts.'
  }
];

export const CBT_MOCK_QUESTIONS: CBTQuestion[] = [
  {
    id: 1,
    section: 'General Knowledge',
    questionText: 'Under which Article of the Indian Constitution is the "Right to Constitutional Remedies" guaranteed?',
    options: ['Article 21', 'Article 32', 'Article 19', 'Article 14'],
    correctIndex: 1,
    explanation: 'Article 32 provides the Right to Constitutional Remedies, famously described by Dr. B.R. Ambedkar as the "Heart and Soul of the Constitution".'
  },
  {
    id: 2,
    section: 'General Knowledge',
    questionText: 'Which Indian classical dance form originated in the state of Kerala and is known for elaborate face painting and headgear?',
    options: ['Kathak', 'Kathakali', 'Bharatanatyam', 'Kuchipudi'],
    correctIndex: 1,
    explanation: 'Kathakali originated in Kerala and features stylized facial make-up, striking headgear, and expressive eye gestures representing epic stories.'
  },
  {
    id: 3,
    section: 'Quantitative Aptitude',
    questionText: 'If a train 240 meters long passes an electric pole in 12 seconds, what is the speed of the train in km/h?',
    options: ['60 km/h', '72 km/h', '80 km/h', '54 km/h'],
    correctIndex: 1,
    explanation: 'Speed = Distance / Time = 240 m / 12 s = 20 m/s. In km/h = 20 * (18/5) = 72 km/h.'
  },
  {
    id: 4,
    section: 'Quantitative Aptitude',
    questionText: 'The average of 5 consecutive odd numbers is 61. What is the difference between the highest and lowest numbers?',
    options: ['6', '8', '10', '4'],
    correctIndex: 1,
    explanation: 'For any 5 consecutive odd numbers, the numbers are x-4, x-2, x, x+2, x+4. The difference between highest (x+4) and lowest (x-4) is (x+4) - (x-4) = 8.'
  },
  {
    id: 5,
    section: 'Reasoning',
    questionText: 'In a certain code, "TEACHER" is written as "VGCEJGT". How will "CHILDREN" be written in that code?',
    options: ['EJKNFTGP', 'EJKNFPER', 'EKJNFTGP', 'EMKPETGP'],
    correctIndex: 0,
    explanation: 'Each letter is shifted forward by +2 positions in the alphabetical series: C+2=E, H+2=J, I+2=K, L+2=N, D+2=F, R+2=T, E+2=G, N+2=P -> EJKNFTGP.'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'user_101',
  name: 'Mohit Shukla',
  email: 'shukla.mohit52@gmail.com',
  phone: '+91 97737 40485',
  address: {
    street: 'Ward No 24, Near Nehru Park, Chawani',
    city: 'Neem Ka Thana',
    state: 'Rajasthan',
    pinCode: '332713',
    landmark: 'Opposite State Bank Branch'
  },
  targetExam: 'SSC CGL & Railway NTPC',
  subscription: {
    planId: 'yearly',
    planName: 'Yearly Elite Scholar',
    startDate: '2026-01-15',
    expiryDate: '2027-01-14',
    status: 'Active'
  },
  library: [
    {
      id: 'lib_1',
      bookId: 'ssc-gd-2026',
      title: 'SSC GD Constable (2026 Latest Pattern)',
      author: 'Samwedna Editorial Board',
      downloadedAt: '2026-09-12',
      fileSize: '18.4 MB',
      totalPages: 480,
      lastReadPage: 142,
      category: 'All SSC Exam',
      coverGradient: 'from-sky-700 via-blue-800 to-slate-900'
    },
    {
      id: 'lib_2',
      bookId: 'static-gk-booster',
      title: 'General Knowledge & Static GK Encyclopedia',
      author: 'Samwedna Research Editorial Team',
      downloadedAt: '2026-09-28',
      fileSize: '24.2 MB',
      totalPages: 620,
      lastReadPage: 85,
      category: 'All State Exam',
      coverGradient: 'from-rose-900 via-red-950 to-neutral-950'
    },
    {
      id: 'lib_3',
      bookId: 'current-affairs-monthly-2026',
      title: 'Samwedna Current Affairs Monthly Magazine',
      author: 'Samwedna Current Affairs Research Desk',
      downloadedAt: '2026-10-02',
      fileSize: '12.1 MB',
      totalPages: 180,
      lastReadPage: 45,
      category: 'All State Exam',
      coverGradient: 'from-emerald-800 via-teal-900 to-slate-900'
    }
  ]
};

export const B2B_COACHING_SERVICES = {
  heading: 'Ready To Use Content With Your Brand Name',
  subheading: 'Partner with Samwedna Prakashan to scale your coaching institute with ready-to-print books, white-labeled CBT test series, and daily current affairs.',
  features: [
    {
      title: 'Comprehensive Content',
      description: 'Covering all key topics for SSC, Railways, Banking, Defence, and State exams with deep answer rationales.',
      icon: 'BookMarked'
    },
    {
      title: 'Custom Institute Branding',
      description: 'Your coaching logo, institute watermarks, contact info, and custom cover pages on every printed or PDF material.',
      icon: 'Palette'
    },
    {
      title: 'Regular Updates',
      description: 'Daily current affairs, weekly one-liners, and monthly magazines delivered directly on WhatsApp and portal.',
      icon: 'RefreshCw'
    },
    {
      title: 'Save 10x Time & Money',
      description: 'No need to hire expensive R&D typing staff. Get instant verified exam test series at a fraction of production cost.',
      icon: 'Scale'
    }
  ],
  stats: {
    institutes: '3,500+',
    studentsTested: '1,200,000+',
    questionsBank: '250,000+',
    satisfactionRate: '99.4%'
  },
  formatsAvailable: [
    'Daily current affairs file (PDF & Word)',
    'Weekly one liner capsule',
    'Weekly interactive quiz (OMR & Online)',
    'Monthly one liner encyclopedia',
    'Monthly topic-wise quiz with keys',
    'Yearly master compilation one liner',
    'Yearly 2,500+ important questions mock test'
  ],
  packages: [
    {
      name: 'Basic Coaching Plan',
      tagline: 'Ideal for emerging local academies',
      price: '₹1,999/mo',
      tests: '20 Test Series / month',
      branding: 'Watermark + First Page Logo',
      support: 'Standard Email & WhatsApp',
      features: ['20 PDF Test Series with Solutions', 'Daily Current Affairs files', 'Hindi & English Bilingual format', 'Instant download portal access']
    },
    {
      name: 'Super 50 Institute Plan',
      tagline: 'For established district institutes',
      price: '₹4,999/mo',
      tests: '50 Test Series / month',
      branding: 'Full Custom Book Cover + Logo on every page',
      support: 'Dedicated Account Manager',
      popular: true,
      features: ['50 CBT Test Series + Printable PDFs', 'Daily & Weekly Current Affairs Capsules', 'Custom OMR sheets with institute name', 'Word format source files for custom editing', 'White-labeled Student Portal login']
    },
    {
      name: 'Super 100 Enterprise Plan',
      tagline: 'Multi-branch premier coaching networks',
      price: '₹8,999/mo',
      tests: '100+ Test Series / month',
      branding: 'Complete Private Label Printing Rights',
      support: 'Priority VIP Hotline + Tech Support',
      features: ['All Exam Test Series (SSC, Bank, Rly, Defence)', 'Physical Book Printing bulk supply at factory rates', 'White-label Android App option', 'API integration with your institute website', 'Exclusive State-level GK modules']
    }
  ]
};

export const AVAILABLE_TEST_SERIES: TestSeriesExam[] = [
  {
    id: 'ts-ugc-hindi-sahitya',
    title: 'UGC NET & Assistant Professor: हिन्दी साहित्य का इतिहास (2500+ MCQs Master Test)',
    hindiTitle: 'हिन्दी साहित्य वस्तुनिष्ठ मॉक टेस्ट - काल विभाजन, रीतिकाल एवं आधुनिक विधाएं',
    category: 'Teaching & UGC NET',
    totalQuestions: 100,
    durationMinutes: 120,
    totalMarks: 200,
    difficulty: 'Exam Pattern',
    enrolledStudents: 14820,
    isFreeDemo: true,
    syllabusCovered: ['आदिकाल एवं भक्तिकाल', 'रीतिमुक्त एवं रीतिबद्ध धारा', 'आधुनिक गद्य विधाएं', 'काव्यशास्त्र एवं आलोचना'],
    lastUpdated: 'October 2026',
    associatedBookId: 'hindi-sahitya-itihas-rajneesh'
  },
  {
    id: 'ts-ssc-cgl-tier1-full',
    title: 'SSC CGL 2026 Tier-I All-India Live CBT Mock Test #01',
    hindiTitle: 'एसएससी सीजीएल टियर - 1 सम्पूर्ण मॉक टेस्ट (TCS न्यू पैटर्न)',
    category: 'All SSC Exam',
    totalQuestions: 100,
    durationMinutes: 60,
    totalMarks: 200,
    difficulty: 'Exam Pattern',
    enrolledStudents: 32400,
    isFreeDemo: true,
    syllabusCovered: ['Quantitative Aptitude (25Q)', 'General Intelligence (25Q)', 'English Comprehension (25Q)', 'General Awareness (25Q)'],
    lastUpdated: 'October 2026',
    associatedBookId: 'ssc-cgl-tier1'
  },
  {
    id: 'ts-bpsc-tre-hindi',
    title: 'BPSC TRE & UP TGT/PGT: हिन्दी शिक्षक भर्ती परीक्षा स्पेशल टेस्ट',
    hindiTitle: 'बिहार एवं उत्तर प्रदेश शिक्षक भर्ती वस्तुनिष्ठ प्रश्नमाला',
    category: 'Teaching & UGC NET',
    totalQuestions: 80,
    durationMinutes: 90,
    totalMarks: 160,
    difficulty: 'Moderate',
    enrolledStudents: 11250,
    isFreeDemo: false,
    syllabusCovered: ['व्याकरण एवं भाषा विज्ञान', 'साहित्यिक इतिहास', 'प्रमुख रचनाकार एवं पंक्तियाँ', 'शिक्षण शास्त्र'],
    lastUpdated: 'September 2026',
    associatedBookId: 'hindi-sahitya-itihas-rajneesh'
  },
  {
    id: 'ts-rrb-ntpc-stage1',
    title: 'RRB NTPC Stage-I Computer Based Test (CBT) Full Simulation',
    hindiTitle: 'रेलवे एनटीपीसी 100 प्रश्न स्पीड एवं एक्यूरेसी ड्रिल',
    category: 'All Railway Exam',
    totalQuestions: 100,
    durationMinutes: 90,
    totalMarks: 100,
    difficulty: 'Moderate',
    enrolledStudents: 28900,
    isFreeDemo: true,
    syllabusCovered: ['General Science (30Q)', 'Mathematics (30Q)', 'Reasoning (40Q)'],
    lastUpdated: 'October 2026',
    associatedBookId: 'rrb-ntpc-paper1'
  },
  {
    id: 'ts-polity-nirvachan',
    title: 'Indian Polity & Election Laws Special Test (आधार: निर्वाचन)',
    hindiTitle: 'भारत निर्वाचन प्रणाली, चुनाव आयोग एवं संवैधानिक अनुच्छेद टेस्ट',
    category: 'All State Exam',
    totalQuestions: 50,
    durationMinutes: 45,
    totalMarks: 100,
    difficulty: 'Moderate',
    enrolledStudents: 8640,
    isFreeDemo: true,
    syllabusCovered: ['ECI Article 324-329', 'EVM/VVPAT Protocol', 'RPA Act 1951', 'Electoral Reforms Commissions'],
    lastUpdated: 'October 2026',
    associatedBookId: 'nirvachan-loktantra-ka-aadhar-arun-singh'
  },
  {
    id: 'ts-ssc-gd-constable',
    title: 'SSC GD Constable 2026 New Pattern Sectional Mock Drill',
    hindiTitle: 'एसएससी जीडी 80 प्रश्न - 160 अंक स्पीड टेस्ट',
    category: 'All SSC Exam',
    totalQuestions: 80,
    durationMinutes: 60,
    totalMarks: 160,
    difficulty: 'Easy',
    enrolledStudents: 22100,
    isFreeDemo: true,
    syllabusCovered: ['General Intelligence', 'General Knowledge', 'Elementary Maths', 'Hindi/English'],
    lastUpdated: 'October 2026',
    associatedBookId: 'ssc-gd-2026'
  },
  {
    id: 'ts-defence-agniveer',
    title: 'Indian Army & Navy Agniveer General Duty (GD) Online Test',
    hindiTitle: 'अग्निवीर भर्ती लिखित परीक्षा मॉडल पेपर',
    category: 'All Defence Exam',
    totalQuestions: 50,
    durationMinutes: 60,
    totalMarks: 100,
    difficulty: 'Moderate',
    enrolledStudents: 15400,
    isFreeDemo: false,
    syllabusCovered: ['General Science', 'General Knowledge', 'Basic Maths', 'Logical Reasoning'],
    lastUpdated: 'September 2026',
    associatedBookId: 'defence-agniveer-combo'
  },
  {
    id: 'ts-bank-po-prelims',
    title: 'SBI PO & IBPS PO Prelims Speed & Accuracy Test Series',
    hindiTitle: 'बैंकिंग एप्टीट्यूड, पजल्स एवं डीआई स्पीड टेस्ट',
    category: 'All Bank Exam',
    totalQuestions: 100,
    durationMinutes: 60,
    totalMarks: 100,
    difficulty: 'Hard',
    enrolledStudents: 19800,
    isFreeDemo: false,
    syllabusCovered: ['Quantitative Aptitude (35Q)', 'Reasoning Ability (35Q)', 'English Language (30Q)'],
    lastUpdated: 'October 2026',
    associatedBookId: 'bank-po-quant-pro'
  }
];

export const TEST_SERIES_DATA = AVAILABLE_TEST_SERIES;

export const USER_TEST_SCORES_DATA: UserTestScore[] = [
  {
    id: 'rec-01',
    testId: 'ts-ssc-cgl-tier1-full',
    testTitle: 'SSC CGL 2026 Tier-I All-India Live CBT Mock Test #01',
    category: 'All SSC Exam',
    dateAttempted: '08 Oct 2026',
    scoreObtained: 172.5,
    totalMarks: 200,
    accuracyPercentage: 92.4,
    percentile: 98.7,
    rank: 184,
    totalCandidates: 32400,
    timeSpentMinutes: 52,
    status: 'Completed'
  },
  {
    id: 'rec-02',
    testId: 'ts-ugc-hindi-sahitya',
    testTitle: 'UGC NET & Assistant Professor: हिन्दी साहित्य का इतिहास (2500+ MCQs)',
    category: 'Teaching & UGC NET',
    dateAttempted: '05 Oct 2026',
    scoreObtained: 168.0,
    totalMarks: 200,
    accuracyPercentage: 89.2,
    percentile: 97.4,
    rank: 312,
    totalCandidates: 14820,
    timeSpentMinutes: 98,
    status: 'Completed'
  },
  {
    id: 'rec-03',
    testId: 'ts-polity-nirvachan',
    testTitle: 'Indian Polity & Election Laws Special Test (आधार: निर्वाचन)',
    category: 'All State Exam',
    dateAttempted: '01 Oct 2026',
    scoreObtained: 86.0,
    totalMarks: 100,
    accuracyPercentage: 94.0,
    percentile: 99.1,
    rank: 64,
    totalCandidates: 8640,
    timeSpentMinutes: 34,
    status: 'Completed'
  },
  {
    id: 'rec-04',
    testId: 'ts-rrb-ntpc-stage1',
    testTitle: 'RRB NTPC Stage-I Computer Based Test (CBT) Full Simulation',
    category: 'All Railway Exam',
    dateAttempted: '26 Sep 2026',
    scoreObtained: 81.5,
    totalMarks: 100,
    accuracyPercentage: 87.5,
    percentile: 94.8,
    rank: 980,
    totalCandidates: 28900,
    timeSpentMinutes: 78,
    status: 'Completed'
  }
];

export const DAILY_CURRENT_AFFAIRS: CurrentAffairArticle[] = [
  {
    id: 'ca-2026-10-14-01',
    title: 'India Inaugurates Deep Ocean Mission Submersible "Matsya 6000" Sea Trials',
    hindiTitle: 'भारत ने गहरे समुद्र मिशन पनडुब्बी "मत्स्य 6000" का समुद्री परीक्षण शुरू किया',
    date: '14 October 2026',
    category: 'Science & Technology',
    tags: ['MoES', 'Matsya 6000', 'Deep Ocean Mission', 'UPSC Prelims'],
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    summary: 'Ministry of Earth Sciences initiated final harbor and shallow water qualification trials for the indigenous human submersible capable of diving to 6,000 meters depth.',
    hindiSummary: 'पृथ्वी विज्ञान मंत्रालय ने 6,000 मीटर की गहराई तक गोता लगाने में सक्षम स्वदेशी मानवयुक्त पनडुब्बी के अंतिम बंदरगाह और उथले पानी के परीक्षण शुरू किए।',
    keyPoints: [
      'Developed by National Institute of Ocean Technology (NIOT), Chennai under Samudrayaan project.',
      'Titanium alloy personnel sphere with 2.1m diameter engineered to withstand 600 bar hydrostatic pressure.',
      'Aims to explore polymetallic nodules, hydrothermal sulfides, and gas hydrates in Central Indian Ocean Basin.',
      'Places India alongside USA, Russia, France, Japan, and China with crewed deep-submergence capability.'
    ],
    fullContent: `The Deep Ocean Mission (DOM) reached a historic milestone today as the Ministry of Earth Sciences (MoES) announced the commencement of harbor integration trials for "Matsya 6000". The submersible is designed to carry a crew of three scientists to depths of up to 6,000 meters for 12 hours of operational endurance, with emergency life-support lasting 96 hours.

This critical mission aligns with India's Blue Economy policy, focusing on sustainable utilization of ocean resources, climate change modeling, and deep-sea biodiversity documentation.`,
    relatedMcq: {
      question: 'Which premier Indian oceanographic institute is the lead executing agency for developing the "Matsya 6000" submersible under the Samudrayaan project?',
      options: [
        'National Institute of Ocean Technology (NIOT), Chennai',
        'National Institute of Oceanography (NIO), Goa',
        'Indian National Centre for Ocean Information Services (INCOIS), Hyderabad',
        'Central Marine Fisheries Research Institute (CMFRI), Kochi'
      ],
      correctIndex: 0,
      explanation: 'The National Institute of Ocean Technology (NIOT) in Chennai, an autonomous institute under MoES, is the nodal agency designing and developing Matsya 6000.'
    },
    pdfUrl: '/samples/daily_ca_14_oct_2026.pdf'
  },
  {
    id: 'ca-2026-10-13-02',
    title: 'RBI Enhances Frictionless Credit Delivery via Unified Lending Interface (ULI)',
    hindiTitle: 'आरबीआई ने यूनिफाइड लेंडिंग इंटरफेस (ULI) के माध्यम से निर्बाध ऋण वितरण को सशक्त बनाया',
    date: '13 October 2026',
    category: 'Economy & Banking',
    tags: ['RBI', 'Banking Awareness', 'ULI', 'Financial Inclusion'],
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    summary: 'The Reserve Bank of India formalized rules for nation-wide deployment of ULI, drastically cutting loan sanction times for MSME and agricultural credit.',
    hindiSummary: 'भारतीय रिजर्व बैंक ने एमएसएमई और कृषि ऋण की स्वीकृति समय सीमा को न्यूनतम करने के लिए राष्ट्रव्यापी यूएलआई नियमों को अधिसूचित किया।',
    keyPoints: [
      'ULI acts as a plug-and-play digital public infrastructure architecture connecting state land records, satellite data, and credit bureaus.',
      'Reduces turnaround time (TAT) for rural micro-loans from 2-3 weeks to under 15 minutes.',
      'Operates on open APIs ensuring consent-based data architecture similar to UPI for payments.',
      'Crucial focus for upcoming RBI Grade-B, SBI PO, and IBPS PO Banking Awareness sections.'
    ],
    fullContent: `Governor of the Reserve Bank of India outlined operational guidelines for the Unified Lending Interface (ULI). The platform democratizes credit access by integrating diverse data sources—including digitized land records from state governments, milk pouring data from dairy cooperatives, and Aadhaar-based e-KYC.

By eliminating manual paperwork, ULI bridges the massive credit gap faced by smallholder farmers and unorganized MSME units across Tier-2 and Tier-3 districts.`,
    relatedMcq: {
      question: 'What is the primary operational objective of the Unified Lending Interface (ULI) launched by the Reserve Bank of India?',
      options: [
        'To facilitate international cross-border remittances in foreign currency',
        'To enable consent-based, frictionless digital credit flow through interoperable data exchange',
        'To replace standard commercial bank debit and credit cards',
        'To regulate retail cryptocurrency exchanges in India'
      ],
      correctIndex: 1,
      explanation: 'ULI enables consent-based digital flow of financial and non-financial data to reduce credit appraisal friction, particularly for rural and small borrowers.'
    },
    pdfUrl: '/samples/daily_ca_13_oct_2026.pdf'
  },
  {
    id: 'ca-2026-10-12-03',
    title: 'Supreme Court 7-Judge Bench Landmark Ruling on Sub-Classification of SCs/STs',
    hindiTitle: 'अनुसूचित जाति एवं जनजाति के उप-वर्गीकरण पर उच्चतम न्यायालय की 7-न्यायाधीशों की संविधान पीठ का ऐतिहासिक निर्णय',
    date: '12 October 2026',
    category: 'Polity & Constitution',
    tags: ['Supreme Court', 'Article 341', 'Article 16(4)', 'Polity'],
    readTime: '6 min read',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80',
    summary: 'The Constitution Bench held that States have legislative competence to create sub-quotas within Scheduled Castes to provide affirmative action to the most marginalized sub-groups.',
    hindiSummary: 'संविधान पीठ ने माना कि राज्यों के पास सबसे वंचित उप-समूहों को सकारात्मक सहायता प्रदान करने के लिए अनुसूचित जातियों के भीतर उप-कोटा बनाने का विधायी अधिकार है।',
    keyPoints: [
      'Overruled previous 2004 judgment in E.V. Chinnaiah v. State of Andhra Pradesh.',
      'Affirmed that sub-classification does not violate Article 341 or tinker with the Presidential List.',
      'States must base sub-quotas on empirical, verifiable data proving inadequate representation.',
      'Vital for UPSC Civil Services GS Paper-II and State PCS Judiciary/Administrative exams.'
    ],
    fullContent: `In an authoritative 6:1 majority verdict, a 7-judge Constitution Bench led by the Chief Justice affirmed the constitutional authority of state governments to introduce sub-classification within the SC/ST categories.

The Court emphasized the doctrine of substantive equality enshrined in Article 14 and Article 16(4), holding that treating unequal groups as equals within a broad category perpetuates structural inequality.`,
    relatedMcq: {
      question: 'Under which Article of the Indian Constitution does the President issue the notification specifying the castes deemed to be Scheduled Castes in relation to a State or Union territory?',
      options: ['Article 338', 'Article 341', 'Article 342A', 'Article 335'],
      correctIndex: 1,
      explanation: 'Article 341 empowers the President of India to specify the castes, races, or tribes to be deemed Scheduled Castes with respect to each State or UT.'
    },
    pdfUrl: '/samples/daily_ca_12_oct_2026.pdf'
  }
];

export const INITIAL_ORDERS: HardCopyOrder[] = [
  {
    orderId: 'BB-ORD-98214',
    trackingId: 'IP-EXP-2026-7841IN',
    createdAt: '12 Oct 2026, 03:45 PM',
    studentEmail: 'shukla.mohit52@gmail.com',
    studentName: 'Mohit Shukla',
    phone: '+91 97737 40485',
    address: {
      street: 'Ward No 24, Near Nehru Park, Chawani',
      city: 'Neem Ka Thana',
      state: 'Rajasthan',
      pinCode: '332713',
      landmark: 'Opposite State Bank Branch'
    },
    items: [
      {
        bookId: 'hindi-sahitya-itihas-rajneesh',
        title: 'हिन्दी साहित्य का इतिहास (वस्तुनिष्ठ संकलन - द्वितीय संस्करण)',
        format: 'Hard Copy Paperback',
        quantity: 1,
        price: 395,
        coverImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%B9%E0%A4%BF%E0%A4%82%E0%A4%A6%E0%A5%80%20%E0%A4%B8%E0%A4%BE%E0%A4%B9%E0%A4%BF%E0%A4%A4%E0%A5%8D%E0%A4%AF%20%E0%A4%95%E0%A4%BE%20%E0%A4%87%E0%A4%A4%E0%A4%BF%E0%A4%B9%E0%A4%BE%E0%A4%B8%20(%E0%A4%B5%E0%A4%B8%E0%A5%8D%E0%A4%A4%E0%A5%81%E0%A4%A8%E0%A4%BF%E0%A4%B7%E0%A5%8D%E0%A4%A0%20%E0%A4%B8%E0%A4%82%E0%A4%95%E0%A4%B2%E0%A4%A8)%2C%20%E0%A4%A6%E0%A5%8D%E0%A4%B5%E0%A4%BF%E0%A4%A4%E0%A5%80%E0%A4%AF%20%E0%A4%B8%E0%A4%82%E0%A4%B8%E0%A5%8D%E0%A4%95%E0%A4%B0%E0%A4%A3%20%E2%80%94%20%E2%82%B9395.jpg'
      },
      {
        bookId: 'antarman-jagdish-narayan',
        title: 'अंतर्मन (जीविका पथ से सामाजिक सरोकार तक)',
        format: 'Hard Copy Paperback',
        quantity: 1,
        price: 350,
        coverImage: 'https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/%E0%A4%85%E0%A4%82%E0%A4%A4%E0%A4%B0%E0%A5%8D%E0%A4%AE%E0%A4%A8%20%E0%A4%9c%E0%A5%80%E0%A4%B5%E0%A4%BF%E0%A4%95%E0%A4%BE%20%E0%A4%AA%E0%A4%A5%20%E0%A4%B8%E0%A5%87%20%E0%A4%B8%E0%A4%BE%E0%A4%AE%E0%A4%BE%E0%A4%9c%E0%A4%BF%E0%A4%95%20%E0%A4%B8%E0%A4%B0%E0%A5%8B%E0%A4%95%E0%A4%BE%E0%A4%B0%20%E0%A4%A4%E0%A4%95%20%E2%80%94%20%E2%82%B9350.jpg'
      }
    ],
    subtotal: 745,
    shippingFee: 0,
    totalAmount: 745,
    paymentMethod: 'Razorpay',
    paymentId: 'pay_rzp_984129841',
    paymentStatus: 'Paid',
    shippingStatus: 'Dispatched via Courier',
    courierPartner: 'India Post Speed Post',
    estimatedDelivery: '16 October 2026'
  }
];

export const INITIAL_STUDENTS: UserProfile[] = [
  {
    id: 'std_101',
    rollNumber: 'SAM-2026-1042',
    name: 'Mohit Shukla',
    email: 'shukla.mohit52@gmail.com',
    phone: '+91 97737 40485',
    address: {
      street: 'Ward No 24, Near Nehru Park, Chawani',
      city: 'Neem Ka Thana',
      state: 'Rajasthan',
      pinCode: '332713',
      landmark: 'Opposite State Bank Branch'
    },
    targetExam: 'SSC CGL & Railway NTPC',
    subscription: {
      planId: 'yearly',
      planName: 'Yearly Elite Scholar',
      startDate: '2026-01-15',
      expiryDate: '2027-01-14',
      status: 'Active'
    },
    library: [],
    testScores: USER_TEST_SCORES_DATA,
    orders: INITIAL_ORDERS,
    createdAt: '15 Jan 2026'
  },
  {
    id: 'std_102',
    rollNumber: 'SAM-2026-2189',
    name: 'Ananya Sharma',
    email: 'ananya.ias2026@gmail.com',
    phone: '+91 98112 34567',
    address: {
      street: 'Flat 402, Prerna Apartments, Sector 14',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pinCode: '226012',
      landmark: 'Near City Hospital'
    },
    targetExam: 'UPSC Civil Services (IAS / IPS)',
    subscription: {
      planId: 'yearly',
      planName: 'Yearly Elite Scholar (Scholarship - ₹0)',
      startDate: '2026-02-10',
      expiryDate: '2027-02-09',
      status: 'Active'
    },
    library: [],
    testScores: [
      {
        id: 'score-as-01',
        testId: 'ts-upsc-csat-2026',
        testTitle: 'UPSC Prelims GS Paper 1 Mock Simulation',
        category: 'UPSC & Civil Services',
        dateAttempted: '12 Oct 2026',
        scoreObtained: 142,
        totalMarks: 200,
        accuracyPercentage: 86.5,
        percentile: 98.4,
        rank: 18,
        totalCandidates: 14200,
        timeSpentMinutes: 110,
        status: 'Completed'
      }
    ],
    orders: [
      {
        orderId: 'BB-ORD-912440',
        trackingId: 'IP-EXP-2026-4421IN',
        createdAt: '08 Oct 2026, 14:20',
        studentEmail: 'ananya.ias2026@gmail.com',
        studentName: 'Ananya Sharma',
        phone: '+91 98112 34567',
        address: {
          street: 'Flat 402, Prerna Apartments, Sector 14',
          city: 'Lucknow',
          state: 'Uttar Pradesh',
          pinCode: '226012'
        },
        items: [
          {
            bookId: 'antarman-jagdish-narayan',
            title: 'अंतर्मन (जीविका पथ से सामाजिक सरोकार तक)',
            format: 'Paperback',
            quantity: 1,
            price: 350
          }
        ],
        subtotal: 350,
        shippingFee: 50,
        totalAmount: 400,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_rzp_test_9921',
        paymentStatus: 'Paid',
        shippingStatus: 'Delivered',
        courierPartner: 'India Post Speed Post',
        estimatedDelivery: '12 Oct 2026'
      }
    ],
    createdAt: '10 Feb 2026'
  },
  {
    id: 'std_103',
    rollNumber: 'SAM-2026-3401',
    name: 'Rahul Verma',
    email: 'rahul.railway@gmail.com',
    phone: '+91 94520 88910',
    address: {
      street: 'H.No 12, Railway Colony, Rustampur',
      city: 'Gorakhpur',
      state: 'Uttar Pradesh',
      pinCode: '273016',
      landmark: 'Near Azad Chauk'
    },
    targetExam: 'Railway RRB NTPC & Group D',
    subscription: {
      planId: 'free',
      planName: 'Student Free Pass (₹0 Fees)',
      startDate: '2026-03-01',
      expiryDate: '2099-12-31',
      status: 'Active'
    },
    library: [],
    testScores: [
      {
        id: 'score-rv-01',
        testId: 'ts-rrb-ntpc-2026',
        testTitle: 'RRB NTPC CBT Stage-1 All India Test',
        category: 'All Railway Exam',
        dateAttempted: '11 Oct 2026',
        scoreObtained: 84,
        totalMarks: 100,
        accuracyPercentage: 91.3,
        percentile: 96.8,
        rank: 92,
        totalCandidates: 28900,
        timeSpentMinutes: 82,
        status: 'Completed'
      }
    ],
    orders: [],
    createdAt: '01 Mar 2026'
  },
  {
    id: 'std_104',
    rollNumber: 'SAM-2026-4872',
    name: 'Priya Singh',
    email: 'priya.teaching.net@gmail.com',
    phone: '+91 91200 44321',
    address: {
      street: 'Shastri Nagar, Road No 4',
      city: 'Patna',
      state: 'Bihar',
      pinCode: '800023'
    },
    targetExam: 'Teaching & UGC NET (Hindi Sahitya)',
    subscription: {
      planId: 'yearly',
      planName: 'Yearly Elite Scholar (Scholarship - ₹0)',
      startDate: '2026-04-12',
      expiryDate: '2027-04-11',
      status: 'Active'
    },
    library: [],
    testScores: [
      {
        id: 'score-ps-01',
        testId: 'ts-ugc-net-hindi-2026',
        testTitle: 'UGC NET हिन्दी साहित्य 2500+ MCQs टेस्ट',
        category: 'Teaching & UGC NET',
        dateAttempted: '14 Oct 2026',
        scoreObtained: 248,
        totalMarks: 300,
        accuracyPercentage: 88.0,
        percentile: 99.1,
        rank: 12,
        totalCandidates: 8400,
        timeSpentMinutes: 140,
        status: 'Completed'
      }
    ],
    orders: [
      {
        orderId: 'BB-ORD-771239',
        trackingId: 'IP-EXP-2026-8812IN',
        createdAt: '11 Oct 2026, 09:40',
        studentEmail: 'priya.teaching.net@gmail.com',
        studentName: 'Priya Singh',
        phone: '+91 91200 44321',
        address: {
          street: 'Shastri Nagar, Road No 4',
          city: 'Patna',
          state: 'Bihar',
          pinCode: '800023'
        },
        items: [
          {
            bookId: 'hindi-sahitya-itihas-rajneesh',
            title: 'हिन्दी साहित्य का इतिहास (वस्तुनिष्ठ संकलन - 2500+ MCQs)',
            format: 'Paperback',
            quantity: 1,
            price: 395
          }
        ],
        subtotal: 395,
        shippingFee: 50,
        totalAmount: 445,
        paymentMethod: 'Razorpay',
        paymentId: 'pay_rzp_test_priya_01',
        paymentStatus: 'Paid',
        shippingStatus: 'In Transit',
        courierPartner: 'India Post Speed Post',
        estimatedDelivery: '16 Oct 2026'
      }
    ],
    createdAt: '12 Apr 2026'
  }
];

export const FREE_PDFS_DATA: FreePdfResource[] = [
  {
    id: 'pdf-01',
    title: 'आचार्य रामचन्द्र शुक्ल: हिन्दी साहित्य का इतिहास (काल विभाजन एवं मुख्य प्रवृत्तियां)',
    category: 'Teaching & UGC NET',
    subject: 'हिन्दी साहित्य',
    fileSize: '14.2 MB',
    pages: 112,
    downloadUrl: '/samples/hindi_sahitya_sample.pdf',
    downloadsCount: 18450,
    description: 'यूजीसी नेट, टीजीटी/पीजीटी एवं असिस्टेंट प्रोफेसर हेतु काल-विभाजन, आदिकाल, भक्तिकाल, रीतिकाल एवं आधुनिक काल के संक्षिप्त हस्तलिखित नोट्स।',
    dateAdded: '12 Oct 2026',
    isTrending: true,
    tags: ['Hindi Literature', 'Dr. Rajneesh Kumar Yadav', 'UGC NET', 'Free PDF']
  },
  {
    id: 'pdf-02',
    title: 'Indian Polity 100 Most Expected Constitutional Articles & Amendments (Cheat Sheet)',
    category: 'UPSC & Civil Services',
    subject: 'Indian Polity & Constitution',
    fileSize: '6.8 MB',
    pages: 48,
    downloadUrl: '/samples/polity_cheat_sheet.pdf',
    downloadsCount: 29800,
    description: 'Summary table of Articles 1 to 395, landmark Supreme Court constitutional bench verdicts, and Schedule breakdown with mnemonics.',
    dateAdded: '10 Oct 2026',
    isTrending: true,
    tags: ['UPSC', 'Polity', 'Cheat Sheet', 'Articles']
  },
  {
    id: 'pdf-03',
    title: 'SSC CGL & CHSL: 500 High-Frequency Speed Arithmetic Formulas & Shortcuts',
    category: 'All SSC Exam',
    subject: 'Quantitative Aptitude',
    fileSize: '8.4 MB',
    pages: 64,
    downloadUrl: '/samples/ssc_quant_formula_book.pdf',
    downloadsCount: 34200,
    description: 'Vedic maths formulas, Geometry & Mensuration standard theorems, Trigonometric identities, and Algebra quick values.',
    dateAdded: '08 Oct 2026',
    isTrending: true,
    tags: ['SSC CGL', 'Maths Formulas', 'Speed Calculation']
  },
  {
    id: 'pdf-04',
    title: 'Railway NTPC & Group D: NCERT General Science 1500+ One-Liners (Physics, Chem, Bio)',
    category: 'All Railway Exam',
    subject: 'General Science',
    fileSize: '11.5 MB',
    pages: 96,
    downloadUrl: '/samples/railway_science_capsule.pdf',
    downloadsCount: 21900,
    description: 'Class 9th & 10th NCERT core science points, SI units, periodic table groups, human anatomy, and railway-specific questions.',
    dateAdded: '04 Oct 2026',
    isTrending: false,
    tags: ['RRB NTPC', 'Science Capsule', 'PYQs']
  },
  {
    id: 'pdf-05',
    title: 'Banking & Financial Awareness 2026 Capsule: Monetary Policy & Banking Terms',
    category: 'All Bank Exam',
    subject: 'Banking Awareness',
    fileSize: '7.2 MB',
    pages: 52,
    downloadUrl: '/samples/banking_awareness_2026.pdf',
    downloadsCount: 16700,
    description: 'RBI regulatory frameworks, Basel-III norms, repo rates, priority sector lending (PSL) quotas, and digital payments architecture.',
    dateAdded: '01 Oct 2026',
    isTrending: false,
    tags: ['Banking', 'SBI PO', 'RBI Grade B']
  }
];

export const STUDY_MATERIALS_DATA: StudyMaterialItem[] = [
  {
    id: 'sm-01',
    title: 'Mindmap: सम्पूर्ण भारतीय संविधान संरचना एवं अनुसूचियां (Visual Flowchart)',
    hindiTitle: 'सम्पूर्ण भारतीय संविधान माइंडमैप एवं अनुसूचियां',
    category: 'UPSC & Civil Services',
    subject: 'Indian Polity',
    type: 'Mindmap',
    pages: 18,
    downloadUrl: '/samples/polity_mindmap.pdf',
    fileSize: '16.5 MB',
    description: 'हाई-डेफिनिशन विजुअल फ्लोचार्ट। मूल अधिकार, नीति-निर्देशक तत्व, राष्ट्रपति की शक्तियां एवं निर्वाचन आयोग का एक नजर में संपूर्ण अध्ययन।',
    highlights: ['अध्यायवार कलर-कोडेड माइंडमैप', 'महत्वपूर्ण संविधान संशोधन तालिका', 'परीक्षा में त्वरित पुनरावलोकन हेतु सर्वोत्तम'],
    badge: 'High Yield'
  },
  {
    id: 'sm-02',
    title: 'हिन्दी साहित्य का इतिहास: प्रमुख सम्प्रदाय, काल एवं रचयिता तुलनात्मक चार्ट',
    hindiTitle: 'हिन्दी साहित्य तुलनात्मक चार्ट एवं महत्वपूर्ण तथ्य',
    category: 'Teaching & UGC NET',
    subject: 'हिन्दी साहित्य',
    type: 'Handwritten Notes',
    pages: 36,
    downloadUrl: '/samples/hindi_notes.pdf',
    fileSize: '22.0 MB',
    description: 'डॉ. रजनीश कुमार यादव के मार्गदर्शन में तैयार विशेष हस्तलिखित नोट्स। आदिकाल से लेकर आधुनिक काल तक के प्रमुख कवियों, ग्रंथों एवं पंक्तियों का संकलन।',
    highlights: ['प्रमुख कवियों की कालक्रमानुसार सूची', 'रस, छंद, अलंकार एवं काव्यशास्त्र चार्ट', '2500+ वस्तुनिष्ठ पुस्तक का संक्षेपण'],
    badge: 'Toppers Choice'
  },
  {
    id: 'sm-03',
    title: 'Quantitative Aptitude 150 Core Geometry & Mensuration Theorems with Proofs',
    hindiTitle: 'ज्यामिति एवं क्षेत्रमिति के 150 महत्वपूर्ण प्रमेय एवं शॉर्टकट',
    category: 'All SSC Exam',
    subject: 'Mathematics',
    type: 'Formula Sheet',
    pages: 28,
    downloadUrl: '/samples/geometry_theorems.pdf',
    fileSize: '12.4 MB',
    description: 'Triangles, circles, chords, tangents, cyclic quadrilaterals, 3D mensuration prism/pyramid direct result sheets.',
    highlights: ['Direct result formulas tested in CGL Tier-2', 'Hand-drawn geometric diagrams', 'Solved benchmark questions'],
    badge: 'Speed Booster'
  },
  {
    id: 'sm-04',
    title: 'Complete Syllabus Roadmap & Micro-Topic Breakdown: UPSC & UPPSC 2026',
    hindiTitle: 'यूपीएससी एवं यूपीपीएससी 2026 माइक्रो-टॉपिक सिलेबस ब्रेकडाउन',
    category: 'UPSC & Civil Services',
    subject: 'Exam Strategy',
    type: 'Syllabus Breakdown',
    pages: 44,
    downloadUrl: '/samples/upsc_syllabus_roadmap.pdf',
    fileSize: '9.8 MB',
    description: 'GS-1 to GS-4 micro-themes, trend analysis of past 10 years, recommended standard books and weekly study trackers.',
    highlights: ['Topic-wise weightage breakdown', 'Prelims + Mains integrated schedule', 'Booklist by top rankers'],
    badge: 'Essential'
  }
];



