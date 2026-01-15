
import React from 'react';
import { Task, ViewMode } from '../types';
import { ShieldAlert, CornerDownRight, AlertCircle, CheckCircle2, Search, User, Calendar, Flag, Users, Copy, Activity, ArrowUpRight, AlertTriangle } from 'lucide-react';

interface TaskTableProps {
  tasks: Task[];
  mode: ViewMode;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, mode }) => {
  const filteredTasks = mode === ViewMode.RISK 
    ? [...tasks].sort((a, b) => b.riskScore - a.riskScore) 
    : [...tasks].sort((a, b) => (b.isRolledOver ? 1 : 0) - (a.isRolledOver ? 1 : 0));

  return (
    <div className="w-full">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">소속 팀 / 유형</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">Action (실장 MASTER)</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">목적 / 리스크 포인트</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">점검기준 / 결과요약</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">진행/진척도</th>
              <th className="px-6 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest">마감/주기</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {filteredTasks.map((task, idx) => (
              <tr key={idx} className={`group hover:bg-slate-50/50 transition-colors ${task.isRolledOver ? 'bg-red-50/30' : !task.isManageable ? 'bg-red-50/10' : ''}`}>
                <td className="px-6 py-5">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">
                      <Users size={12} />
                      {task.teamName}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      <CategoryBadge category={task.category} />
                      {task.isRolledOver && <span className="flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-md bg-red-600 text-white animate-pulse">이월</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 max-w-xs">
                  <p className={`text-[15px] font-extrabold leading-tight ${task.isRolledOver ? 'text-red-700' : 'text-slate-900'}`}>{task.taskName}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <PriorityDots priority={task.priority} />
                    <span className="text-[10px] text-slate-400 font-bold">[{task.assigneeLeader}]</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-slate-500">
                  <p className="line-clamp-2">🎯 {task.purpose}</p>
                  <p className="text-[10px] text-red-500 font-bold mt-1">⚠️ {task.missingRiskPoint}</p>
                </td>
                <td className="px-6 py-5">
                  <div className={`p-3 rounded-xl border text-xs font-bold ${task.isRolledOver ? 'bg-red-50 border-red-200 text-red-900' : 'bg-indigo-50/40 border-indigo-100/50 text-indigo-900'}`}>
                    {task.executiveCheckCriteria}
                  </div>
                </td>
                <td className="px-6 py-5 text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black mb-1">{task.progress}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden border">
                      <div className={`h-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-black">{task.deadline}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-slate-100">
        {filteredTasks.map((task, idx) => (
          <div key={idx} className={`p-5 space-y-4 ${task.isRolledOver ? 'bg-red-50/40' : 'bg-white'}`}>
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">{task.teamName}</span>
                  <CategoryBadge category={task.category} />
                  {task.isRolledOver && <span className="text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded">이월</span>}
                </div>
                <h4 className={`text-lg font-black leading-tight ${task.isRolledOver ? 'text-red-800' : 'text-slate-900'}`}>
                  {task.taskName}
                </h4>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="text-[10px] font-black text-slate-400">{task.deadline}</span>
                 <PriorityDots priority={task.priority} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">담당 리더</p>
                <p className="text-xs font-bold text-slate-700">{task.assigneeLeader}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black text-slate-400 uppercase mb-1">진척도</p>
                <div className="flex items-center gap-2">
                  <div className="flex-grow h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className={`h-full ${task.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`} style={{ width: `${task.progress}%` }} />
                  </div>
                  <span className="text-[10px] font-black text-slate-900">{task.progress}%</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                <Search size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-indigo-400 uppercase">점검 기준</p>
                  <p className="text-xs font-bold text-indigo-900 leading-relaxed italic">{task.executiveCheckCriteria}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-red-50/30 p-3 rounded-xl border border-red-100/50">
                <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-black text-red-400 uppercase">포착된 리스크</p>
                  <p className="text-xs font-medium text-red-900 leading-relaxed">{task.missingRiskPoint}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const styles: Record<string, string> = {
    'Action': 'bg-amber-100 text-amber-700 border-amber-200',
    'Check': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Trigger': 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase border tracking-tighter ${styles[category] || 'bg-slate-100'}`}>
      {category}
    </span>
  );
};

const PriorityDots: React.FC<{ priority: string }> = ({ priority }) => {
  const styles: Record<string, string> = { 'High': 'bg-red-500', 'Medium': 'bg-orange-400', 'Low': 'bg-slate-300' };
  const count = priority === 'High' ? 3 : priority === 'Medium' ? 2 : 1;
  return (
    <div className="flex gap-1">
      {[1, 2, 3].map(v => (
        <div key={v} className={`w-1.5 h-1.5 rounded-full ${v <= count ? styles[priority] : 'bg-slate-100'}`} />
      ))}
    </div>
  );
};

export default TaskTable;
