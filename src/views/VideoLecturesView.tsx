import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Play, 
  Video, 
  Clock, 
  Eye, 
  Download, 
  Calendar, 
  Bell, 
  Share2, 
  RotateCcw, 
  BookOpen,
  X,
  Volume2
} from 'lucide-react';
import { VIDEO_LECTURES } from '../data/mockData';
import { VideoLecture } from '../types';

export const VideoLecturesView: React.FC = () => {
  const { showToast, setCurrentView } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [activeLecture, setActiveLecture] = useState<VideoLecture | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [reminderSet, setReminderSet] = useState<boolean>(false);

  const subjects = ['All', 'Indian Polity', 'Quantitative Aptitude', 'Static GK', 'Logical Reasoning', 'Current Affairs'];

  const filteredLectures = VIDEO_LECTURES.filter(v => {
    if (selectedSubject !== 'All' && v.subject !== selectedSubject) return false;
    return true;
  });

  const handleSetReminder = () => {
    setReminderSet(true);
    showToast('Reminder set for LIVE Mega Session! Alert sent to your registered email.', 'success');
  };

  const handleDownloadNotes = () => {
    showToast('Lecture Summary & PDF Handout downloaded!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <Video className="w-3.5 h-3.5 text-purple-700" />
            <span>Digital Classroom Video Stream</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            Video Lectures & Concept Masterclasses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            In-depth video breakdowns of tricky exam concepts, speed math shortcuts, and live marathon sessions designed to complement your Samvedna textbooks.
          </p>
        </div>

        {/* Live Marathon Alert Badge */}
        <div className="bg-red-50 border border-red-200 p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></div>
          <div>
            <p className="text-xs font-bold text-red-900">NEXT LIVE SESSION: Sunday 11:00 AM</p>
            <p className="text-[11px] text-red-700">500 High-Yield Current Affairs MCQs Marathon</p>
          </div>
          <button
            onClick={handleSetReminder}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              reminderSet ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            {reminderSet ? 'Reminder Set' : 'Set Reminder'}
          </button>
        </div>
      </div>

      {/* Subject Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
              selectedSubject === sub
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Active Video Player Simulation (if a video is clicked) */}
      {activeLecture && (
        <div className="bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 text-white animate-fadeIn">
          {/* Simulated Video Player Screen */}
          <div className="relative aspect-video max-h-[500px] w-full bg-black flex flex-col justify-between p-6">
            <div className="flex justify-between items-start z-10">
              <span className="bg-black/60 backdrop-blur-xs text-xs font-semibold px-3 py-1 rounded-lg text-white">
                {activeLecture.title}
              </span>
              <button
                onClick={() => setActiveLecture(null)}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Simulated Player Center */}
            <div className="text-center space-y-3 my-auto">
              <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto shadow-lg animate-pulse">
                <Play className="w-8 h-8 fill-current ml-1" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Playing High-Definition Lecture Stream ({playbackSpeed}x Speed)
              </p>
              <p className="text-xs text-slate-400">Instructor: {activeLecture.instructor} · {activeLecture.exam}</p>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between z-10 bg-black/60 backdrop-blur-xs p-3 rounded-xl border border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <Play className="w-4 h-4 fill-current text-white cursor-pointer" />
                <Volume2 className="w-4 h-4 text-white" />
                <span className="font-mono text-slate-300 text-[11px]">18:42 / {activeLecture.duration}</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[1, 1.25, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold cursor-pointer ${
                        playbackSpeed === speed ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleDownloadNotes}
                  className="flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-slate-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF Notes</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900 border-t border-slate-800 space-y-2">
            <h3 className="text-lg font-bold font-display text-white">{activeLecture.title}</h3>
            <p className="text-xs text-slate-400">{activeLecture.description}</p>
          </div>
        </div>
      )}

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLectures.map((lecture) => (
          <div
            key={lecture.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div 
              onClick={() => setActiveLecture(lecture)}
              className={`aspect-video bg-gradient-to-br ${lecture.thumbnailGradient} p-5 flex flex-col justify-between text-white relative cursor-pointer`}
            >
              <div className="flex justify-between items-start">
                <span className="bg-black/50 backdrop-blur-xs text-[10px] font-mono px-2.5 py-1 rounded text-white">
                  {lecture.exam}
                </span>
                <span className={`text-white font-bold text-[10px] px-2.5 py-1 rounded uppercase ${
                  lecture.isUpcoming ? 'bg-amber-600' : 'bg-red-600'
                }`}>
                  {lecture.isUpcoming ? 'LIVE UPCOMING' : lecture.duration}
                </span>
              </div>

              <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mx-auto my-auto group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-current text-white ml-0.5" />
              </div>

              <div className="text-[11px] text-slate-200 font-mono flex justify-between">
                <span>{lecture.subject}</span>
                <span>{lecture.views}</span>
              </div>
            </div>

            {/* Content Details */}
            <div className="p-5 space-y-3 flex flex-col flex-1 justify-between">
              <div>
                <h4 
                  onClick={() => setActiveLecture(lecture)}
                  className="text-sm font-bold text-slate-900 font-display line-clamp-2 hover:text-indigo-600 cursor-pointer"
                >
                  {lecture.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {lecture.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 text-[11px]">Faculty: </span>
                  <span className="font-semibold text-slate-800">{lecture.instructor}</span>
                </div>

                <button
                  onClick={() => setActiveLecture(lecture)}
                  className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Watch Lecture
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Notice box about future video updates (user requested: "vedio lectures section also which I will update later") */}
      <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-display">
            Video Lectures Section Architecture
          </h4>
          <p className="text-xs text-slate-600 mt-0.5">
            This section is structured with full playlist capability, chapter notes downloads, and video streaming. You can connect your YouTube playlist or proprietary video CDN credentials anytime.
          </p>
        </div>
        <button
          onClick={() => setCurrentView('product')}
          className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 cursor-pointer shrink-0"
        >
          Explore Textbooks & Tests
        </button>
      </div>

    </div>
  );
};
