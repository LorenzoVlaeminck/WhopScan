
import React from 'react';
import { WhopListing } from '../types';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface Props {
  listing: WhopListing;
  onExport: (listing: WhopListing) => void;
}

const ListingCard: React.FC<Props> = ({ listing, onExport }) => {
  const chartData = [
    { subject: 'Value', A: listing.sentimentBreakdown.valueForMoney, fullMark: 100 },
    { subject: 'Quality', A: listing.sentimentBreakdown.quality, fullMark: 100 },
    { subject: 'Support', A: listing.sentimentBreakdown.support, fullMark: 100 },
    { subject: 'Ease', A: listing.sentimentBreakdown.easeOfUse, fullMark: 100 },
    { subject: 'Growth', A: 85, fullMark: 100 },
  ];

  const getConfidenceColor = (score: number) => {
    if (score > 80) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (score > 50) return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-red-400 bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Top Action Bar */}
      <div className="flex justify-between items-center px-2">
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest ${getConfidenceColor(listing.confidenceScore)}`}>
          <i className="fa-solid fa-shield-check"></i>
          AI Confidence: {listing.confidenceScore}%
        </div>
        <button 
          onClick={() => onExport(listing)}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 transition-all hover:bg-indigo-600 hover:border-indigo-500 active:scale-95"
        >
          <i className="fa-solid fa-file-export"></i>
          Export Intel
        </button>
      </div>

      {/* Hero Card */}
      <div className="glass-morphism rounded-[32px] p-8 md:p-10 border border-white/10 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-32 -mt-32 rounded-full"></div>
        
        <div className="relative flex flex-col lg:flex-row justify-between gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-white/5 text-slate-400 text-[9px] font-black uppercase tracking-widest rounded-full border border-white/5">
                {listing.category}
              </span>
              {listing.creator && (
                <span className="text-[10px] text-slate-500 font-bold">
                  by <span className="text-indigo-400">@{listing.creator.toLowerCase().replace(/\s/g, '')}</span>
                </span>
              )}
            </div>
            
            <h2 className="text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              {listing.name}
            </h2>
            
            <p className="text-slate-400 leading-relaxed text-lg max-w-3xl font-medium">
              {listing.description}
            </p>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { label: 'Value', val: listing.sentimentBreakdown.valueForMoney, color: 'bg-emerald-500' },
                { label: 'Support', val: listing.sentimentBreakdown.support, color: 'bg-blue-500' },
                { label: 'Ease', val: listing.sentimentBreakdown.easeOfUse, color: 'bg-purple-500' },
                { label: 'Quality', val: listing.sentimentBreakdown.quality, color: 'bg-amber-500' }
              ].map((stat, i) => (
                <div key={i}>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
                  <div className="flex items-end gap-2">
                    <span className="text-xl font-bold text-white leading-none">{stat.val}</span>
                    <div className="flex-1 h-1.5 bg-slate-800 rounded-full mb-1">
                      <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.val}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-80 glass-morphism rounded-3xl p-6 border border-white/5 bg-white/2 flex flex-col items-center shadow-xl">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">Competency Radar</h3>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Radar
                    name="Performance"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-col items-center">
              <div className="text-4xl font-black text-white">{listing.sentimentScore}<span className="text-slate-500 text-sm ml-1">/ 10</span></div>
              <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mt-1">Global Sentiment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {listing.plans.map((plan, i) => (
          <div key={i} className="glass-morphism p-6 rounded-3xl border border-white/5 hover:border-indigo-500/50 transition-all hover:-translate-y-1 duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-credit-card text-xs"></i>
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{plan.cycle}</span>
            </div>
            <h4 className="text-white text-sm font-bold truncate mb-1">{plan.name}</h4>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">
                {plan.currency}{plan.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Competitive */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-morphism p-8 rounded-3xl border border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <i className="fa-solid fa-crosshairs text-indigo-500"></i> Competitive Edge
            </h3>
            <div className="space-y-4">
              {listing.competitors.map((comp, i) => (
                <div key={i} className="group p-5 bg-white/2 rounded-2xl border border-white/5 hover:bg-white/5 transition-all">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-bold text-slate-200 text-sm">{comp.name}</h4>
                    <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded font-black tracking-widest uppercase">{comp.priceRange}</span>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-1 bg-indigo-500/30 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
                    <p className="text-xs text-slate-500 leading-relaxed italic">
                      {comp.advantage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-indigo-600/10 border border-indigo-500/20 rounded-[32px] relative overflow-hidden group">
            <i className="fa-solid fa-arrow-trend-up absolute -bottom-4 -right-4 text-8xl text-indigo-500/5 group-hover:scale-110 transition-transform"></i>
            <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-4">Trajectory Analysis</h4>
            <p className="text-sm text-slate-300 leading-relaxed font-medium relative z-10">
              {listing.growthPotential}
            </p>
          </div>
        </div>

        {/* Right Col: Features & Sentiment */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-morphism p-8 rounded-3xl border border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <i className="fa-solid fa-microchip text-emerald-500"></i> Technical Feature Stack
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listing.features.map((feat, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white/2 rounded-xl border border-white/5 hover:bg-white/5 transition-colors">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0">
                    <i className="fa-solid fa-check text-[10px]"></i>
                  </div>
                  <span className="text-xs text-slate-300 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="glass-morphism p-8 rounded-3xl border border-white/5">
              <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-plus"></i> Market Strengths
              </h4>
              <ul className="space-y-4">
                {listing.pros.map((pro, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass-morphism p-8 rounded-3xl border border-white/5">
              <h4 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                <i className="fa-solid fa-minus"></i> Core Vulnerabilities
              </h4>
              <ul className="space-y-4">
                {listing.cons.map((con, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-3 group">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0 group-hover:scale-150 transition-transform"></span>
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Sources Section */}
      {listing.sources.length > 0 && (
        <div className="glass-morphism rounded-3xl p-8 border border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
              <i className="fa-solid fa-fingerprint text-indigo-500"></i> Evidence & Grounding
            </h4>
            <span className="text-[9px] font-bold text-slate-600 italic">Data validated via Google Search</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {listing.sources.map((source, i) => (
              <a
                key={i}
                href={source.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 bg-white/2 rounded-2xl border border-white/5 hover:bg-white/5 hover:border-indigo-500/20 transition-all overflow-hidden"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:rotate-12 transition-transform">
                  <i className="fa-solid fa-link text-xs"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-slate-400 group-hover:text-slate-200 truncate font-black uppercase tracking-wider mb-0.5">
                    {source.title}
                  </p>
                  <p className="text-[8px] text-slate-600 truncate font-medium">{source.uri}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingCard;
