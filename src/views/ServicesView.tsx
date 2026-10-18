import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Building2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Award, 
  Download, 
  Send,
  Layers,
  Palette,
  RefreshCw,
  Scale
} from 'lucide-react';
import { B2B_COACHING_SERVICES } from '../data/mockData';

export const ServicesView: React.FC = () => {
  const { showToast } = useApp();
  const [instituteName, setInstituteName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [requirement, setRequirement] = useState('Super 50 Institute Plan');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !instituteName) {
      showToast('Please fill in Institute Name, Email and Phone', 'error');
      return;
    }
    setSubmitted(true);
    showToast('Your B2B inquiry has been received! Our sales director will call you within 2 hours.', 'success');
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Hero: "Ready To Use Content With Your Brand Name" (From the user's uploaded images) */}
      <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-b border-indigo-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Samwedna B2B Solutions</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
                Ready-To-Use Exam Content With Your Brand Name
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                Partner with Samwedna Prakashan to scale your institution. Provide your students with professional textbooks, daily current affairs, and 2026 CBT test series bearing your institute&apos;s logo, phone number, and address.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Hindi & English Bilingual</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>7 Formats of Current Affairs</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Trusted by 3,500+ Institutes</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a
                  href="#contact-sales"
                  className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Request Institute Demo Kit
                </a>
                <a
                  href="tel:+919792903247"
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>+91 9792903247</span>
                </a>
              </div>
            </div>

            {/* Right: Daily Current Affairs Package Spotlight (From user's image) */}
            <div className="lg:col-span-5">
              <div className="bg-gradient-to-b from-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-indigo-500/20 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
                      Flagship B2B Package
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">
                      Daily Current Affairs Magazine
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-emerald-400 font-display">₹2,999/-</span>
                    <span className="text-[10px] text-slate-400 block font-mono">FOR 1 FULL YEAR</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Deliver daily current affairs capsules and weekly quizzes directly to your enrolled students on WhatsApp & Telegram with your coaching institute banner.
                </p>

                {/* 7 formats bullet list matching user's screen */}
                <div>
                  <p className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2.5">
                    7 Formats Delivered Under Your Brand:
                  </p>
                  <div className="space-y-2 text-xs text-slate-200">
                    {B2B_COACHING_SERVICES.formatsAvailable.map((fmt, i) => (
                      <div key={i} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{fmt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-emerald-950/60 rounded-xl border border-emerald-500/30 text-xs text-emerald-300 flex items-center justify-between">
                  <span>Get 7-Day Free Demo For Your Institute</span>
                  <a href="#contact-sales" className="underline font-bold">Apply Now →</a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. "Why Choose Samwedna Service" (Exact section from user's screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
            Institutional Advantages
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            Why Choose Samwedna Prakashan Service?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Trusted by 3,500+ coaching institutes across Rajasthan, UP, Bihar, MP, and Delhi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Comprehensive Content
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Covering all key topics for SSC, Railways, Banking, Defence, and State exams with high-yield conceptual clarity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <Palette className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Custom Branding
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ready-to-use content with your institute branding: logo, address, contact numbers, and custom watermark on every page.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Regular Updates
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Updated syllabus, recent notification changes, and daily current affairs delivered promptly without delay.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Save 10x Time & Money
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Eliminate the need to hire expensive in-house content creators and DTP operators. Efficient and cost-effective turnkey solutions.
            </p>
          </div>
        </div>

        {/* Call Banner matching screenshot */}
        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Direct Publisher & Institute Support Helpline</p>
              <p className="text-lg font-bold text-white font-mono">+91 9792903247</p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-semibold text-cyan-300 block">
              Samwedna Group of Institutions · Gorakhpur & New Delhi
            </span>
            <span className="text-[11px] text-slate-400">
              Email: sgi181069@gmail.com · booksboon17@gmail.com
            </span>
          </div>
        </div>
      </section>

      {/* 2B. Creative Graphic Design & Commercial Printing Wing (Direct from uploaded banner) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-indigo-50 to-slate-100 rounded-3xl p-8 sm:p-12 border border-indigo-100 shadow-sm space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                Creative Studio & Print Press
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-1">
                Are You Looking for a Creative Graphic Designer & Publisher?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Samwedna Prakashan provides complete in-house composing, multi-color offset printing, and brand identity design.
              </p>
            </div>
            <a
              href="#contact-sales"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs self-start md:self-auto cursor-pointer"
            >
              Get Custom Design Quote
            </a>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
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
            ].map((srv, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-2 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{srv}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold flex items-center justify-center shrink-0">
                ACP
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">ALL IN CAREER POINT</p>
                <p className="text-[11px] text-slate-500">Coaching & Academic Counselling Wing of Samwedna Group</p>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">
                KG
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">किसान गौरव (Kisan Gaurav)</p>
                <p className="text-[11px] text-slate-500">Agricultural awareness, rural empowerment & periodic farmer journals</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Exclusive Test Series Plans: Basic, Super 50, Super 100 (From screenshot) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-indigo-600 tracking-wider uppercase">
            Institutional Packages
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display">
            Exclusive Test Series Plans
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Select the tier that matches your institute enrollment volume. All plans include private-label printing rights.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {B2B_COACHING_SERVICES.packages.map((pkg, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all ${
                pkg.popular
                  ? 'bg-slate-900 text-white shadow-xl ring-2 ring-indigo-500 relative'
                  : 'bg-white text-slate-900 border border-slate-200 shadow-xs'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                  Most Popular for Academies
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className={`text-xl font-extrabold font-display ${pkg.popular ? 'text-white' : 'text-slate-900'}`}>
                    {pkg.name}
                  </h3>
                  <p className={`text-xs mt-1 ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {pkg.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-200/20">
                  <span className={`text-3xl font-extrabold font-display ${pkg.popular ? 'text-cyan-400' : 'text-indigo-600'}`}>
                    {pkg.price}
                  </span>
                  <span className={`text-xs block mt-0.5 ${pkg.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                    {pkg.tests}
                  </span>
                </div>

                <div className="space-y-2.5 pt-4 text-xs">
                  {pkg.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${pkg.popular ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      <span className={pkg.popular ? 'text-slate-300' : 'text-slate-700'}>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-8">
                <a
                  href="#contact-sales"
                  onClick={() => setRequirement(pkg.name)}
                  className={`w-full py-3 rounded-xl text-xs font-bold text-center block transition-colors cursor-pointer ${
                    pkg.popular
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Select {pkg.name}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Contact Sales Form (Matches user's screen) */}
      <section id="contact-sales" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-8">
            <h2 className="text-2xl font-bold font-display">
              Request Institute Partnership & Demo
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Fill in your academy details to receive sample books, mock CBT test series, and quotation.
            </p>
          </div>

          <div className="p-8">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Institute Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={instituteName}
                      onChange={(e) => setInstituteName(e.target.value)}
                      placeholder="e.g. Srishti Education / Sankalp Classes"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="director@institute.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Your Phone / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 97929 03247 / +91 81153 74644"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      City & State
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Jaipur, Rajasthan"
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Plan / Services Needed
                  </label>
                  <select
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-indigo-600 focus:bg-white"
                  >
                    <option value="Daily Current Affairs Branding (₹2999/yr)">Daily Current Affairs Branding (₹2999/yr)</option>
                    <option value="Super 50 Institute Plan">Super 50 Institute Plan (50 Tests / mo)</option>
                    <option value="Super 100 Enterprise Plan">Super 100 Enterprise Plan (100+ Tests / mo)</option>
                    <option value="Basic Coaching Plan">Basic Coaching Plan (20 Tests / mo)</option>
                    <option value="Custom Bulk Paperback Book Printing">Custom Bulk Paperback Book Printing</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Now (Receive Free Demo Kit)</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 font-display">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Thank you, <strong>{instituteName}</strong>. Our Regional Institutional Manager will call you at <strong>{phone}</strong> and dispatch your sample material kit.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-200"
                >
                  Submit Another Inquiry
                </button>
              </div>
            )}
          </div>

          {/* Real Office & Contact Details Footer Bar */}
          <div className="bg-slate-50 border-t border-slate-200 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
            <div>
              <span className="font-bold text-slate-900 block">Head Office (New Delhi):</span>
              <span>VZ/B-93, Ring Road Naraina Vihar, New Delhi - 110028</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Branches: Dehradun · Lucknow · Patna · Gorakhpur</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 block">Institutional Center (Gorakhpur):</span>
              <span>Mahui Sugharpur, Near Bhavya Marriage Hall, Azad Chauk, Rustampur, Gorakhpur (273016)</span>
              <p className="text-[11px] font-semibold text-indigo-700 mt-0.5">Mobile: +91 9792903247 · Email: sgi181069@gmail.com</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
