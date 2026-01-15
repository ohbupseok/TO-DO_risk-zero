
import React, { useState, useEffect } from 'react';
import { DashboardData, ViewMode, Task, HistoryItem } from '../types';
import TaskTable from './TaskTable';
import MessengerKit from './MessengerKit';
import RiskHeatmap from './RiskHeatmap';
import MaturityDashboard from './MaturityDashboard';
import DailySyncView from './DailySyncView';
import { LayoutDashboard, FileOutput, FileSpreadsheet, BookmarkPlus, SendHorizontal, RefreshCw, BarChart3, Send } from 'lucide-react';

interface DashboardViewProps {
  data: DashboardData;
  rawInput: string;
  history: HistoryItem[];
  onSave: () => void;
  onRefine: (instruction: string) => void;
  onSync: (yesterday: string, today: string) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ data, rawInput, history, onSave, onRefine, onSync }) => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.EXECUTIVE);
  const [syncTime, setSyncTime] = useState("");
  const [refineInput, setRefineInput] = useState("");

  useEffect(() => {
    setSyncTime(new Date().toLocaleTimeString('ko-KR'));
  }, [data]);

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white p-3 md:p-4 rounded-2xl border border-slate-200 shadow-sm gap-3">
        <div className="flex items-center justify-between sm:justify-start gap-4">
          <button onClick={onSave} className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100">
            <BookmarkPlus size={16} /> 설계 저장
          </button>
          <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-100">
            {syncTime}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50">
             <FileOutput size={16} /> 복사
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg hover:bg-slate-800">
            <FileSpreadsheet size={16} className="text-emerald-400" /> Excel
          </button>
        </div>
      </div>

      {/* Main Grid Views */}
      <section className="bg-white border border-slate-200 rounded-[24px] md:rounded-[32px] overflow-hidden shadow-xl">
        {/* Scrollable Tab Menu for Mobile */}
        <div className="overflow-x-auto no-scrollbar border-b border-slate-100">
          <div className="flex p-2 min-w-max justify-start md:justify-center bg-slate-50 md:bg-white gap-1">
             {[
               { mode: ViewMode.EXECUTIVE, icon: LayoutDashboard, label: 'MASTER' },
               { mode: ViewMode.DAILY_SYNC, icon: RefreshCw, label: 'DAILY SYNC' },
               { mode: ViewMode.MATURITY, icon: BarChart3, label: 'MATURITY' },
               { mode: ViewMode.MESSENGER, icon: Send, label: 'MESSENGER' }
             ].map(item => (
               <button 
                 key={item.mode} 
                 onClick={() => setViewMode(item.mode)}
                 className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[11px] font-black transition-all ${viewMode === item.mode ? 'bg-white md:bg-indigo-600 text-indigo-600 md:text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
               >
                 <item.icon size={14} /> {item.label}
               </button>
             ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {viewMode === ViewMode.MESSENGER ? (
            <MessengerKit briefings={data.messengerBriefings} />
          ) : viewMode === ViewMode.MATURITY ? (
            <MaturityDashboard currentData={data} history={history} />
          ) : viewMode === ViewMode.DAILY_SYNC ? (
            <DailySyncView onSync={onSync} />
          ) : (
            <TaskTable tasks={data.tasks} mode={viewMode} />
          )}
        </div>
      </section>

      {/* Slim Refine Bar for Mobile */}
      <div className="fixed bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 md:px-6">
        <form 
          onSubmit={(e) => { e.preventDefault(); if(refineInput.trim()) onRefine(refineInput); setRefineInput(""); }} 
          className="bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-1.5 flex items-center gap-2 ring-1 ring-white/20"
        >
          <input
            type="text"
            value={refineInput}
            onChange={(e) => setRefineInput(e.target.value)}
            placeholder="아키텍처 수정 요청..."
            className="flex-grow bg-transparent border-none outline-none py-2.5 px-4 text-xs md:text-sm font-medium text-white placeholder:text-slate-500"
          />
          <button type="submit" className="bg-indigo-600 text-white p-2.5 md:p-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center shrink-0">
            <SendHorizontal size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashboardView;
