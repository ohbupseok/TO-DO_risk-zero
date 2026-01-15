
import React, { useState } from 'react';
import { Send, RefreshCw, History, CalendarPlus, ArrowRightLeft, Sparkles } from 'lucide-react';

interface DailySyncViewProps {
  onSync: (yesterday: string, today: string) => void;
}

const DailySyncView: React.FC<DailySyncViewProps> = ({ onSync }) => {
  const [yesterday, setYesterday] = useState('');
  const [today, setToday] = useState('');

  const handleSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (yesterday.trim() || today.trim()) {
      onSync(yesterday, today);
    }
  };

  return (
    <div className="p-10 bg-slate-50/50 min-h-[600px]">
      <div className="max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200">
            <Sparkles size={14} />
            Smart Transition Engine
          </div>
          <h3 className="text-3xl font-black text-slate-900">Daily Continuity Sync</h3>
          <p className="text-slate-500 font-medium">전일의 '결과'를 입력하면 미완료 업무가 자동으로 이월되고, 금일 '계획'과 통합됩니다.</p>
        </div>

        <form onSubmit={handleSync} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative">
          {/* Bridge Arrow */}
          <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 bg-indigo-600 text-white p-3 rounded-full shadow-xl border-4 border-white">
            <ArrowRightLeft size={24} />
          </div>

          {/* Yesterday Section */}
          <div className="space-y-4 animate-in slide-in-from-left duration-700">
            <div className="flex items-center gap-3 text-slate-500 mb-2">
              <History size={20} className="text-slate-400" />
              <h4 className="font-black text-sm uppercase tracking-widest">Yesterday's Results (13일)</h4>
            </div>
            <div className="relative group">
              <textarea
                value={yesterday}
                onChange={(e) => setYesterday(e.target.value)}
                placeholder="어제 수행된 결과나 피드백을 입력하세요 (예: 1팀장 업무 완료, 2팀 업무는 아직 진행중...)"
                className="w-full h-80 p-6 bg-white border-2 border-slate-200 rounded-3xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm resize-none text-sm font-medium leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-black text-slate-300 uppercase">Outcome Data</div>
            </div>
          </div>

          {/* Today Section */}
          <div className="space-y-4 animate-in slide-in-from-right duration-700">
            <div className="flex items-center gap-3 text-indigo-600 mb-2">
              <CalendarPlus size={20} />
              <h4 className="font-black text-sm uppercase tracking-widest">Today's Plan (14일)</h4>
            </div>
            <div className="relative group">
              <textarea
                value={today}
                onChange={(e) => setToday(e.target.value)}
                placeholder="오늘 새롭게 추가된 계획이나 지시사항을 입력하세요"
                className="w-full h-80 p-6 bg-white border-2 border-indigo-100 rounded-3xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm resize-none text-sm font-medium leading-relaxed"
              />
              <div className="absolute bottom-4 right-4 text-[10px] font-black text-indigo-300 uppercase">New Action Input</div>
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center pt-6">
            <button
              type="submit"
              disabled={!yesterday.trim() && !today.trim()}
              className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-indigo-600 transition-all active:scale-95 disabled:bg-slate-300"
            >
              <RefreshCw size={24} className="group-hover:rotate-180 transition-transform duration-700" />
              14일 통합 시스템 업데이트
            </button>
          </div>
        </form>

        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-start gap-4">
          <div className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm shrink-0">
             <Sparkles size={20} />
          </div>
          <div>
            <h5 className="font-black text-indigo-900 text-sm mb-1">Architecture Tip</h5>
            <p className="text-xs text-indigo-700/70 leading-relaxed font-medium">
              엑셀로 관리할 때 발생하는 '데이터 단절'을 방지하기 위해, AI가 전일의 컨텍스트를 유지한 채 오늘을 설계합니다. 
              완료된 업무는 자동으로 히스토리에 아카이브되고, 미진한 부분은 리스크 점수가 상향되어 오늘 리스트 상단에 배치됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySyncView;
