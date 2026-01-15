
import React, { useMemo } from 'react';
import { DashboardData, HistoryItem } from '../types';
// Fixed: Added missing 'Activity' to the import list from 'lucide-react'
import { TrendingUp, Award, Target, ShieldCheck, ChevronRight, Zap, Info, ArrowUpRight, ArrowDownRight, CheckCircle, Activity } from 'lucide-react';

interface MaturityDashboardProps {
  currentData: DashboardData;
  history: HistoryItem[];
}

const MaturityDashboard: React.FC<MaturityDashboardProps> = ({ currentData, history }) => {
  const sortedHistory = useMemo(() => {
    const combined = [...history];
    const isCurrentInHistory = combined.some(h => JSON.stringify(h.data) === JSON.stringify(currentData));
    if (!isCurrentInHistory) {
      combined.push({ id: 'current', timestamp: Date.now(), rawInput: '', data: currentData });
    }
    return combined.sort((a, b) => a.timestamp - b.timestamp);
  }, [history, currentData]);

  const maturityTrend = useMemo(() => {
    return sortedHistory.map(h => {
      const total = h.data.tasks.length;
      const manageable = h.data.tasks.filter(t => t.isManageable).length;
      const avgProgress = total > 0 
        ? h.data.tasks.reduce((sum, t) => sum + (t.progress || 0), 0) / total 
        : 0;
      return {
        timestamp: h.timestamp,
        score: total > 0 ? (manageable / total) * 100 : 0,
        progress: avgProgress,
        label: new Date(h.timestamp).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })
      };
    });
  }, [sortedHistory]);

  const currentScore = maturityTrend[maturityTrend.length - 1]?.score || 0;
  const currentProgress = maturityTrend[maturityTrend.length - 1]?.progress || 0;
  const previousProgress = maturityTrend.length > 1 ? maturityTrend[maturityTrend.length - 2].progress : currentProgress;
  const progressDiff = currentProgress - previousProgress;

  const getMaturityLevel = (score: number) => {
    if (score >= 90) return { label: 'Level 5: Optimized', desc: '초고밀도 관리 체계', color: 'text-indigo-600', bg: 'bg-indigo-50' };
    if (score >= 75) return { label: 'Level 4: Managed', desc: '안정적인 데이터 기반 관리', color: 'text-emerald-600', bg: 'bg-emerald-50' };
    if (score >= 50) return { label: 'Level 3: Defined', desc: '표준화된 점검 체계 가동', color: 'text-amber-600', bg: 'bg-amber-50' };
    if (score >= 25) return { label: 'Level 2: Reactive', desc: '부분적 리스크 대응 중', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Level 1: Initial', desc: '가시성 확보 단계', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const level = getMaturityLevel(currentScore);

  return (
    <div className="p-8 space-y-10 bg-slate-50/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <TrendingUp size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Operation Mastery & Execution</h3>
          <p className="text-sm text-slate-500 font-medium">관리 성숙도(설계의 질)와 실행 진척도(활동의 양)를 통합 관리합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Capability & Execution Index Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">Management Maturity</p>
              <h4 className="text-3xl font-black text-slate-900 flex items-baseline gap-2">
                {currentScore.toFixed(1)}<span className="text-sm text-slate-400">%</span>
              </h4>
            </div>
            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1 text-emerald-600">Execution Progress</p>
              <div className="flex items-center gap-3">
                <h4 className="text-3xl font-black text-emerald-600 flex items-baseline gap-2">
                  {currentProgress.toFixed(1)}<span className="text-sm text-emerald-400">%</span>
                </h4>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black ${progressDiff >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                   {progressDiff >= 0 ? '+' : ''}{progressDiff.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="h-48 flex items-end gap-3 px-2">
            {maturityTrend.map((t, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center group gap-1">
                {/* Maturity Bar */}
                <div className="w-full flex gap-0.5 items-end h-full">
                  <div 
                    className={`flex-1 rounded-t-md transition-all duration-500 ${idx === maturityTrend.length - 1 ? 'bg-indigo-600' : 'bg-slate-200'}`} 
                    style={{ height: `${Math.max(t.score, 5)}%` }}
                  />
                  {/* Progress Bar */}
                  <div 
                    className={`flex-1 rounded-t-md transition-all duration-500 ${idx === maturityTrend.length - 1 ? 'bg-emerald-500' : 'bg-emerald-100'}`} 
                    style={{ height: `${Math.max(t.progress, 5)}%` }}
                  />
                </div>
                <p className="text-[9px] font-black text-slate-400 mt-2 truncate w-full text-center">{t.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-6 text-[10px] font-bold">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-indigo-600 rounded-sm"/>성숙도</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-emerald-500 rounded-sm"/>진척도</div>
          </div>
        </div>

        {/* Maturity Level Card */}
        <div className={`rounded-3xl border-2 p-8 shadow-sm border-indigo-100 ${level.bg} flex flex-col justify-center text-center space-y-6 relative overflow-hidden`}>
           <div className="absolute top-0 right-0 p-8 opacity-5">
             <Award size={120} />
           </div>
           <div className="space-y-2 relative z-10">
             <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Current Status</p>
             <h4 className={`text-3xl font-black ${level.color}`}>{level.label}</h4>
             <p className="text-sm font-bold text-slate-600">{level.desc}</p>
           </div>
           <div className="flex justify-center relative z-10">
              <div className="bg-white/60 backdrop-blur-md p-6 rounded-full border border-white shadow-inner">
                <Target size={48} className={level.color} />
              </div>
           </div>
           <div className="bg-white/40 p-4 rounded-2xl border border-white/50 text-xs font-bold text-slate-700">
              미완료 업무: {currentData.tasks.filter(t => t.progress < 100).length}건
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
          <div className="flex items-center gap-3">
            <CheckCircle size={20} className="text-emerald-500" />
            <h5 className="font-black text-slate-900">Execution Highlights (최근 완료/성과)</h5>
          </div>
          <div className="space-y-4">
             {currentData.tasks.filter(t => t.progress > 0).sort((a,b) => b.progress - a.progress).slice(0, 3).map((t, i) => (
               <div key={i} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                 <div className={`p-2 rounded-xl ${t.progress === 100 ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                   {t.progress === 100 ? <CheckCircle size={18} /> : <Zap size={18} />}
                 </div>
                 <div className="flex-grow">
                   <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{t.teamName}</p>
                   <p className="text-sm font-black text-slate-800">{t.taskName} ({t.progress}%)</p>
                   {t.resultSummary && <p className="text-[10px] text-slate-500 mt-1 font-medium italic">{t.resultSummary}</p>}
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="absolute -bottom-10 -right-10 opacity-10">
            <Activity size={180} />
          </div>
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-emerald-400">
               <Info size={20} />
               <h5 className="font-black">Executive Insight</h5>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              성숙도(설계 지표)는 조직이 리스크를 얼마나 예측 가능한 구조로 관리하느냐를 나타내며, <br/>
              진척도(실행 지표)는 그 설계가 현장에서 얼마나 빠르게 완결되느냐를 보여줍니다. <br/><br/>
              현재 <strong>{currentData.tasks[0]?.teamName}</strong>의 실행 속도가 성숙도 대비 높습니다. 이는 리스크 점검 주기가 적절함을 의미합니다. 반면 진척도가 낮고 성숙도가 높은 팀은 '병목' 가능성을 점검하십시오.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturityDashboard;
