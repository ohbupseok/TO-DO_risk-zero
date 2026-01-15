
import React from 'react';
import { Sun, Moon, CheckCircle2 } from 'lucide-react';

interface RoutineListProps {
  routine: {
    todayFilter: string[];
    closingChecklist: string[];
  };
}

const RoutineList: React.FC<RoutineListProps> = ({ routine }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-indigo-600 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <Sun size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 font-bold text-indigo-100">
            <Sun size={20} />
            <span>오전 5분 필터 (Top 3 Focus)</span>
          </div>
          <div className="space-y-3">
            {routine.todayFilter.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-white text-indigo-600 font-bold text-xs shrink-0">
                  {i + 1}
                </span>
                <p className="text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
          <Moon size={120} />
        </div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2 font-bold text-slate-400">
            <Moon size={20} />
            <span>퇴근 전 7분 체크리스트 (누락 차단)</span>
          </div>
          <div className="space-y-2">
            {routine.closingChecklist.map((item, i) => (
              <div key={i} className="flex items-center gap-3 border-b border-white/10 pb-2">
                <CheckCircle2 size={18} className="text-slate-500" />
                <p className="text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoutineList;
