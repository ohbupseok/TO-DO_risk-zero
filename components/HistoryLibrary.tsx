
import React from 'react';
import { HistoryItem, TaskCategory } from '../types';
import { Trash2, ExternalLink, Calendar, Layers, ShieldAlert } from 'lucide-react';

interface HistoryLibraryProps {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const HistoryLibrary: React.FC<HistoryLibraryProps> = ({ history, onLoad, onDelete }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {history.map((item) => {
        const counts = item.data.tasks.reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const date = new Date(item.timestamp).toLocaleDateString('ko-KR', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        const mainTitle = item.data.tasks[0]?.taskName || "제목 없는 아키텍처";

        return (
          <div 
            key={item.id} 
            className="group relative bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer flex flex-col"
            onClick={() => onLoad(item)}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                  <Calendar size={10} />
                  {date}
                </span>
                <h4 className="text-sm font-black text-slate-900 line-clamp-1 leading-tight group-hover:text-indigo-600 transition-colors">
                  {mainTitle}
                </h4>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="mt-auto space-y-3">
              <div className="flex gap-2">
                {Object.entries(counts).map(([cat, count]) => (
                  <div key={cat} className="flex flex-col items-center bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{cat}</span>
                    <span className="text-xs font-bold text-slate-700">{count}</span>
                  </div>
                ))}
              </div>
              
              <p className="text-[11px] text-slate-500 line-clamp-2 italic leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                "{item.rawInput.slice(0, 80)}..."
              </p>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[10px] font-bold text-indigo-600">
                <ExternalLink size={12} />
                설계 불러오기
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HistoryLibrary;
