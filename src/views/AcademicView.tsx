import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  ArrowRight, 
  BookOpen, 
  Award, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Users, 
  ShieldCheck, 
  Download, 
  Sparkles,
  PlayCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CourseItem {
  id: string;
  title: string;
  hindiTitle: string;
  targetExam: string;
  originalPrice: number;
  currentPrice: number;
  duration: string;
  mode: string;
  batchTiming: string;
  seatsRemaining: number;
  features: string[];
  curriculum: string[];
  faculty: string;
}

export const AcademicView: React.FC = () => {
  const { setCurrentView, setPortalMode, user, showToast } = useApp();
  const [selectedExamFilter, setSelectedExamFilter] = useState('All');
  const [enrolledCourses, setEnrolledCourses] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('samwedna_enrolled_courses');
      return saved ? JSON.parse(saved) : ['upsc-prelims-2026'];
    } catch {
      return ['upsc-prelims-2026'];
    }
  });

  const [activeCourseModal, setActiveCourseModal] = useState<CourseItem | null>(null);

  const courses: CourseItem[] = [
    {
      id: 'upsc-prelims-2026',
      title: 'UPSC Civil Services (IAS / IPS) GS Foundation 2026',
      hindiTitle: 'संघ लोक सेवा आयोग सिविल सेवा (IAS/IPS) प्रारंभिक + मुख्य परीक्षा सम्पूर्ण बैच',
      targetExam: 'UPSC Civil Services',
      originalPrice: 18500,
      currentPrice: 0,
      duration: '12 Months (Comprehensive)',
      mode: 'Live Interactive + Recorded Backups',
      batchTiming: 'Daily 07:30 AM & 06:00 PM IST',
      seatsRemaining: 34,
      faculty: 'Dr. Vivek Sharma, Adv. Alok Srivastava & Former Civil Servants',
      features: [
        'Complete GS Paper I to IV Coverage with Hindi & English Medium Notes',
        'Daily Current Affairs Answer Writing & Editorial Analysis',
        '30 Full-Length All-India Mock Tests with Detailed Explanations',
        'Personal 1-on-1 Mentorship & Weekly Doubt Resolution Sessions'
      ],
      curriculum: [
        'Module 1: Indian Polity, Constitution & Governance (Articles 1-395)',
        'Module 2: Indian Economy, Budget & Economic Survey Analytics',
        'Module 3: Ancient, Medieval & Modern Indian History with Art & Culture',
        'Module 4: Environment, Biodiversity, Climate Protocols & Geography',
        'Module 5: CSAT Paper-II Speed Maths & Logical Reasoning Mastery'
      ]
    },
    {
      id: 'ssc-cgl-super-achiever',
      title: 'SSC CGL & CHSL 2026 All-Rounder Super Achiever Program',
      hindiTitle: 'एसएससी सीजीएल एवं सीएचएसएल 2026 - टियर 1 व टियर 2 सम्पूर्ण तैयारी बैच',
      targetExam: 'SSC CGL & Railway',
      originalPrice: 4999,
      currentPrice: 0,
      duration: '6 Months (Intensive)',
      mode: 'Digital Classroom + Daily CBT Tests',
      batchTiming: 'Daily 09:00 AM & 04:00 PM IST',
      seatsRemaining: 58,
      faculty: 'Er. R.K. Verma & SSC Top Rankers Faculty',
      features: [
        'Vedic Maths & Speed Arithmetic shortcuts (solve in under 25 seconds)',
        'Comprehensive English Grammar, Vocab Root Words & Comprehension',
        'Reasoning Non-Verbal, Analogy & Syllogism Precision Drills',
        'Tier-1 + Tier-2 Real Simulation CBT Mock Tests with AIR Ranking'
      ],
      curriculum: [
        'Unit 1: Speed Arithmetic, Percentages, Profit-Loss & Algebra',
        'Unit 2: Geometry, Mensuration 2D/3D & Trigonometry Shortcuts',
        'Unit 3: General Intelligence, Coding-Decoding & Puzzles',
        'Unit 4: Static GK, Science NCERT Summary & Current Affairs',
        'Unit 5: Computer Knowledge Module & Data Entry Speed Techniques'
      ]
    },
    {
      id: 'ugc-net-hindi-sahitya',
      title: 'UGC NET & Assistant Professor: हिन्दी साहित्य विशेष',
      hindiTitle: 'यूजीसी नेट/जेआरएफ एवं असिस्टेंट प्रोफेसर (हिन्दी साहित्य का संपूर्ण इतिहास)',
      targetExam: 'Teaching & UGC NET',
      originalPrice: 7500,
      currentPrice: 0,
      duration: '8 Months (In-Depth Literary Analysis)',
      mode: 'Bilingual Video Modules + PDF Notes',
      batchTiming: 'Mon to Fri 05:00 PM IST',
      seatsRemaining: 21,
      faculty: 'डॉ. रजनीश कुमार यादव (JNU / BHU स्वर्ण पदक विजेता)',
      features: [
        'आदिकाल, भक्तिकाल, रीतिकाल एवं आधुनिक काल का गहन प्रमाणिक विश्लेषण',
        '2500+ विगत वर्षों के हल प्रश्न पत्र (PYQs) व्याख्या सहित',
        'आचार्य रामचन्द्र शुक्ल एवं हजारी प्रसाद द्विवेदी के प्रमुख कथनों का संकलन',
        'काव्यशास्त्र (भारतीय एवं पाश्चात्य) तथा भाषा विज्ञान के हस्तलिखित नोट्स'
      ],
      curriculum: [
        'भाग 1: हिन्दी भाषा और उसका विकास एवं बोलियों का परिचय',
        'भाग 2: हिन्दी साहित्य का इतिहास (आदिकाल से रीतिकाल तक)',
        'भाग 3: आधुनिक काल: भारतेन्दु युग, द्विवेदी युग, छायावाद, प्रगतिवाद व नई कविता',
        'भाग 4: हिन्दी गद्य विधाएँ: उपन्यास, कहानी, नाटक, निबंध व आलोचना',
        'भाग 5: भारतीय एवं पाश्चात्य काव्यशास्त्र के प्रमुख सिद्धांत'
      ]
    },
    {
      id: 'banking-po-clerk-mastery',
      title: 'Banking PO & Clerk (SBI / IBPS / RRB) Quantitative & Reasoning',
      hindiTitle: 'बैंकिंग पीओ एवं क्लर्क (एसबीआई / आईबीपीएस) स्पीड मैथ्स एवं पज़ल्स बैच',
      targetExam: 'Banking PO & Clerk',
      originalPrice: 3999,
      currentPrice: 0,
      duration: '5 Months',
      mode: 'Speed Drills + Weekly Sectional CBTs',
      batchTiming: 'Daily 08:00 AM & 07:00 PM IST',
      seatsRemaining: 42,
      faculty: 'Pooja Agarwal (Ex-SBI PO) & Quantitative Aptitude Faculty',
      features: [
        'High-speed Data Interpretation (Caselet, Radar & Missing Tables)',
        'Floor-Flat, Circular & Uncertain Linear Seating Arrangement Puzzles',
        'Daily Banking Awareness, RBI Monetary Policy & Financial Capsules',
        'Descriptive English Letter & Essay Writing Evaluation'
      ],
      curriculum: [
        'Section 1: Simplification, Approximation, Number Series & Quadratic',
        'Section 2: High Level Data Interpretation (Bar, Pie, Mixed & Caselet)',
        'Section 3: Syllogism Only-Few, Inequality, Input-Output & Puzzles',
        'Section 4: Financial Awareness, Inflation, Banking Terminologies',
        'Section 5: Mains Level Critical Reasoning & Decision Making'
      ]
    },
    {
      id: 'state-psc-comprehensive',
      title: 'State PSC Special (UPPSC, BPSC, MPPSC, RAS) General Studies',
      hindiTitle: 'राज्य लोक सेवा आयोग (UPPSC, BPSC, MPPSC) राज्य सामान्य ज्ञान व मुख्य परीक्षा',
      targetExam: 'State PSC',
      originalPrice: 8999,
      currentPrice: 0,
      duration: '9 Months',
      mode: 'Live + State Specific Special Editions',
      batchTiming: 'Daily 11:00 AM IST',
      seatsRemaining: 29,
      faculty: 'Regional Administrative Experts Panel',
      features: [
        'State-specific Special GK, History, Geography, Culture & Budget',
        'Mains Answer Writing Frameworks with Model Answers',
        'Previous 15 Years State PSC Question Bank with Explanations',
        'Monthly State Current Affairs Bulletins (Bilingual PDF)'
      ],
      curriculum: [
        'Paper 1: State History, Freedom Struggle & Cultural Heritage',
        'Paper 2: State Geography, Natural Resources, Rivers & Agriculture',
        'Paper 3: State Economy, Industries, Infrastructure & Welfare Schemes',
        'Paper 4: General Hindi & Essay Writing with High-Scoring Patterns'
      ]
    }
  ];

  const handleEnrollCourse = (course: CourseItem) => {
    if (enrolledCourses.includes(course.id)) {
      showToast(`You are already enrolled in "${course.title}". Opening Student Dashboard...`, 'info');
      setCurrentView('student-dashboard');
      return;
    }

    const updated = [...enrolledCourses, course.id];
    setEnrolledCourses(updated);
    try {
      localStorage.setItem('samwedna_enrolled_courses', JSON.stringify(updated));
      confetti({
        particleCount: 100,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.error(e);
    }

    showToast(`🎉 Enrolled successfully in "${course.title}" at ₹0 (100% Scholarship)!`, 'success');
  };

  const filteredCourses = courses.filter(c => {
    if (selectedExamFilter === 'All') return true;
    return c.targetExam.includes(selectedExamFilter);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-fadeIn">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Special Promotional Launch: All Institute Courses at ₹0 Fees</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-indigo-300 p-1 shadow-lg shrink-0">
              <img 
                src="https://cdn.jsdelivr.net/gh/luckymohittiwari52-oss/quiz-assets@main/images/sjgj.jpg" 
                alt="Samwedna Group of Institutes Official Logo" 
                className="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
                Samwedna Group of Institutes
              </h1>
              <span className="text-xs text-indigo-300 font-bold tracking-widest uppercase block mt-1">
                Premier Academy for Competitive Exams & Professional Studies
              </span>
            </div>
          </div>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Target-oriented classroom coaching, complete test series, and structured academic batches for UPSC Civil Services, SSC, Banking, State PSC, and UGC NET. All batches are currently offered with <strong>100% Scholarship (₹0 Fees)</strong> for a limited launch period.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full Syllabus & Notes Included</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Free All-India CBT Test Series</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1-Click Instant Enrollment</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'UPSC Civil Services', 'SSC CGL', 'Banking PO', 'Teaching & UGC NET', 'State PSC'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedExamFilter(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedExamFilter === tab
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{filteredCourses.length}</strong> academic batches
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourses.includes(course.id);

          return (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 sm:p-8 flex flex-col justify-between space-y-6 relative overflow-hidden"
            >
              {/* Top Accent Tag */}
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {course.targetExam}
                  </span>
                  
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>{course.seatsRemaining} Scholarship Seats Left</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">
                    {course.hindiTitle}
                  </p>
                </div>

                {/* Batch Specs */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                    <span className="font-bold text-slate-800">{course.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Batch Mode</span>
                    <span className="font-bold text-slate-800">{course.mode}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Class Timing</span>
                    <span className="font-bold text-slate-800">{course.batchTiming}</span>
                  </div>
                </div>

                {/* Features Highlights */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Curriculum & Mentorship Inclusions:
                  </span>
                  <div className="space-y-1.5">
                    {course.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Faculty */}
                <div className="text-xs text-slate-600 pt-1">
                  <span className="font-semibold text-slate-900">Lead Faculty:</span> {course.faculty}
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-800 font-display">
                      ₹0
                    </span>
                    <span className="text-sm line-through text-slate-400 font-bold">
                      ₹{course.originalPrice.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-900">
                      100% SCHOLARSHIP
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                    0 Fees Currently (Standard Fee ₹{course.originalPrice.toLocaleString()} will apply later)
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCourseModal(course)}
                    className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Syllabus
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEnrollCourse(course)}
                    className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer ${
                      isEnrolled
                        ? 'bg-slate-900 text-white hover:bg-slate-800'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    {isEnrolled ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Enrolled (Active)</span>
                      </>
                    ) : (
                      <>
                        <span>Enroll Free (₹0 Fees)</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Course Detailed Syllabus Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto space-y-5 animate-scaleUp">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-indigo-50 text-indigo-700">
                  {activeCourseModal.targetExam}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 font-display mt-1">
                  {activeCourseModal.title}
                </h3>
                <p className="text-xs text-slate-500">{activeCourseModal.hindiTitle}</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveCourseModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Pricing Banner in Modal */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-900 block">Admission Launch Offer</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-800 font-display">₹0</span>
                  <span className="text-xs line-through text-slate-400 font-bold">
                    ₹{activeCourseModal.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    100% Free Scholarship
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  handleEnrollCourse(activeCourseModal);
                  setActiveCourseModal(null);
                }}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Enroll Now (₹0)
              </button>
            </div>

            {/* Detailed Curriculum */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Full Syllabus & Topic Modules</span>
              </h4>
              <div className="space-y-2">
                {activeCourseModal.curriculum.map((mod, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed font-medium">{mod}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Faculty & Schedule */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
              <p><strong>Faculty:</strong> {activeCourseModal.faculty}</p>
              <p><strong>Schedule:</strong> {activeCourseModal.batchTiming}</p>
              <p><strong>Mode:</strong> {activeCourseModal.mode}</p>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveCourseModal(null)}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Institutional Center & Inquiries */}
      <div className="p-6 sm:p-8 bg-slate-100 rounded-3xl border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-base font-bold text-slate-900">
            Need Guidance on Choosing Your Target Batch?
          </h3>
          <p className="text-xs text-slate-600 max-w-xl">
            Visit our physical institutional center at Gorakhpur (Mahui Sugharpur, Azad Chauk, Rustampur) or speak directly with our senior academic counselors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="tel:+919792903247"
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs flex items-center gap-2 shadow-2xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>Call +91 9792903247</span>
          </a>

          <button
            onClick={() => {
              setPortalMode('institute');
              setCurrentView('test-series');
            }}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Go to CBT Test Series (₹0)</span>
          </button>
        </div>
      </div>

    </div>
  );
};
