import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
  Award, 
  Users, 
  Printer, 
  ShieldCheck, 
  HeartHandshake, 
  Sparkles, 
  Send, 
  CheckCircle2, 
  MapPin, 
  FileText 
} from 'lucide-react';

export const HouseOfSamwednaView: React.FC = () => {
  const { showToast, setCurrentView } = useApp();
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [bookProposal, setBookProposal] = useState('');
  const [manuscriptSubject, setManuscriptSubject] = useState('Competitive Exam Test Series');
  const [authorSubmitted, setAuthorSubmitted] = useState(false);

  const handleAuthorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !authorEmail || !bookProposal) {
      showToast('Please fill all manuscript proposal fields', 'error');
      return;
    }
    setAuthorSubmitted(true);
    showToast('Your author proposal has been submitted to our Chief Editorial Board!', 'success');
  };

  const milestones = [
    { value: '12+ Years', label: 'Publishing Legacy & Trust', desc: 'Serving aspirants relentlessly since 2014' },
    { value: '150+ Titles', label: 'Active Standard Textbooks', desc: 'Covering UPSC, SSC, Railways & Defence' },
    { value: '3,500+', label: 'Partner Coaching Institutes', desc: 'White-label distribution across 14 states' },
    { value: '250,000+', label: 'Copies in Active Circulation', desc: 'Empowering tier-1, tier-2 & rural students' }
  ];

  const editorialLeaders = [
    {
      name: 'डॉ. रजनीश कुमार यादव',
      title: 'सहायक प्रोफेसर (हिन्दी) एवं मुख्य सम्पादक, शिक्षक भर्ती विंग',
      desc: 'बी.ए. बीएचयू (वाराणसी), एम.ए., एम.फिल., पीएच.डी. जेएनयू नई दिल्ली। सम्प्रति: राजेन्द्र कॉलेज छपरा, जय प्रकाश विश्वविद्यालय। लेखक: हिन्दी साहित्य का इतिहास (वस्तुनिष्ठ 2500+ MCQs)।',
      badge: 'Academic Chair'
    },
    {
      name: 'जगदीश नारायण श्रीवास्तव',
      title: 'वरिष्ठ लेखक एवं वैचारिक सम्पादक (सामाजिक सरोकार)',
      desc: 'प्रशासनिक विचारक एवं लेखक। कृति: "अंतर्मन - जीविका पक्ष से सामाजिक सरोकार तक"। सिविल सेवा मुख्य परीक्षा एवं नीतिशास्त्र अध्ययन हेतु मार्गदर्शक।',
      badge: 'Social Thought'
    },
    {
      name: 'राघवेन्द्र दुबे \'भाऊ\'',
      title: 'राजनीतिक विश्लेषक एवं सम्पादक, समकालीन विमर्श',
      desc: 'लेखक: "डिस्कवरी ऑफ डेमोक्रेसी (\'डिस्कवरी ऑफ इंडिया\' से आगे)" - राहुल गांधी पर केन्द्रित \'जैसे सांस देश की\' का परिवर्धित संस्करण \'भारत जोड़ो यात्रा\' पर प्रत्यक्ष रिपोर्ताज।',
      badge: 'Political Philosophy'
    },
    {
      name: 'डा. अरुण प्रताप सिंह',
      title: 'संवैधानिक अध्ययन एवं निर्वाचन विश्लेषक',
      desc: 'लेखक: "निर्वाचन - लोकतंत्र का आधार"। भारत निर्वाचन आयोग (ECI), चुनावी सुधार, ईवीएम प्रणाली एवं जन-प्रतिनिधित्व कानून के विशेषज्ञ।',
      badge: 'Election & Polity'
    },
    {
      name: 'Er. R.K. Verma',
      title: 'Managing Editor & Head of R&D',
      desc: 'Former Indian Railways cadre engineer and academician with 15+ years mentoring 50,000+ candidates in speed mathematics and reasoning.',
      badge: 'Academic Lead'
    },
    {
      name: 'Dr. Vivek Sharma',
      title: 'Senior Editor, General Studies & Science',
      desc: 'Ph.D in Applied Sciences, university gold medalist, and celebrated author of Samwedna Static GK Encyclopedia.',
      badge: 'Research Chair'
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Brand Hero */}
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>The Story Behind Our Publishing Legacy</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              House of Samwedna
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded on the bedrock of educational empathy (&quot;Samwedna&quot;), our publishing house was born to democratize access to world-class competitive exam materials for every ambitious youth in India.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300 pt-2">
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Rigorous 3-Tier Proofreading</span>
              <span className="flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-cyan-400" /> Transparent Author Royalties</span>
              <span className="flex items-center gap-1.5"><Printer className="w-4 h-4 text-amber-400" /> High-Density Eco-Friendly Printing</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Milestones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <p className="text-3xl font-extrabold text-indigo-600 font-display">{m.value}</p>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{m.label}</h4>
              <p className="text-[11px] text-slate-500">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Publishing Philosophy & Editorial Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-100/70 rounded-3xl p-8 sm:p-12 border border-slate-200 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              The Samwedna Publishing Standard
            </h2>
            <p className="text-xs text-slate-500">
              How an exam question goes from Commission gazette to a verified page in your handbook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Syllabus Synchronization
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as SSC, UPSC, or Railway recruitment bodies release fresh notification guidelines, our academic R&D cell calibrates chapter blueprints to eliminate obsolete patterns.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Multi-Stage Proofreading
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every calculation, date, historical treaty, and Hindi-English translation passes through three independent subject specialists before entering typesetting.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900 font-display">
                Digital + Physical Convergence
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every printed textbook is accompanied by high-speed CBT online test series passes and digital PDF updates, ensuring uninterrupted learning on smartphones and desktops.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Editorial Board Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
            Scholarly Governance
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            The Editorial Board of Samwedna
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Meet the distinguished scholars, civil servants, and authors behind our best-selling titles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {editorialLeaders.map((leader, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded uppercase">
                    {leader.badge}
                  </span>
                  <span className="text-xs text-slate-400">House of Samwedna</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">{leader.name}</h3>
                <p className="text-xs font-semibold text-slate-600">{leader.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{leader.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Editorial Member</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Author Wing: "Publish with House of Samwedna" */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-xl space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Author Fellowship & Manuscript Submissions
            </span>
            <h2 className="text-2xl font-bold font-display text-white">
              Publish Your Book with Samwedna Prakashan
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you an experienced competitive exam educator, coaching institute director, or subject expert? Submit your book proposal to get published, distributed in 14 states, and promoted across 3,500+ partner academies.
            </p>
          </div>

          {!authorSubmitted ? (
            <form onSubmit={handleAuthorSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Your Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Sharma"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="author@example.com"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proposed Subject / Domain
                </label>
                <select
                  value={manuscriptSubject}
                  onChange={(e) => setManuscriptSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                >
                  <option value="Competitive Exam Test Series">Competitive Exam Test Series</option>
                  <option value="General Studies & Static GK">General Studies & Static GK</option>
                  <option value="Mathematics & Aptitude">Mathematics & Aptitude</option>
                  <option value="Reasoning & Mental Ability">Reasoning & Mental Ability</option>
                  <option value="Current Affairs & Yearbooks">Current Affairs & Yearbooks</option>
                  <option value="State Civil Services Special Module">State Civil Services Special Module</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Manuscript Summary & Table of Contents Outline <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={bookProposal}
                  onChange={(e) => setBookProposal(e.target.value)}
                  placeholder="Describe your book concept, unique shortcuts, target examination, and estimated page count..."
                  className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Submit Book Proposal to Editorial Committee</span>
              </button>
            </form>
          ) : (
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700 text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white font-display">
                Proposal Received, {authorName}!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                Our Editorial Board will review your manuscript outline for <strong>{manuscriptSubject}</strong> and reply to <strong>{authorEmail}</strong> within 3 business days.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 5. Official Publishing Centers & Geographic Presence */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">Headquarters & Centers</span>
              <h3 className="text-2xl font-extrabold font-display mt-1 text-white">Samwedna Prakashan Offices</h3>
            </div>
            <div className="text-xs text-slate-400">
              Printer · Publisher · Distributor · Graphic Composing
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Head Office (New Delhi)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                VZ/B-93, Ring Road Naraina Vihar, New Delhi - 110028
              </p>
            </div>

            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-indigo-400 font-bold">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>Institutional Center (Gorakhpur)</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Mahui Sugharpur, Near Bhavya Marriage Hall, Azad Chauk, Rustampur, Gorakhpur, UP (273016)
              </p>
            </div>

            <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Direct Contact & Helpline</span>
              </div>
              <p className="text-slate-200 font-mono">
                Mobile: <strong className="text-white">+91 9792903247</strong>
              </p>
              <div className="space-y-0.5 text-slate-300 text-[11px] pt-1">
                <div><span className="text-amber-400 font-semibold">BooksBoon:</span> booksboon17@gmail.com</div>
                <div><span className="text-cyan-400 font-semibold">Institute (SGI):</span> sgi181069@gmail.com</div>
                <div><span className="text-indigo-400 font-semibold">Prakashan HQ (SPI):</span> spiindia181069@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export const HouseOfSamvednaView = HouseOfSamwednaView;
