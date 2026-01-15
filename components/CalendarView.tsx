
import React, { useState, useMemo } from 'react';
import { Task, TaskCategory } from '../types';
import { ChevronLeft, ChevronRight, Filter, Calendar as CalendarIcon, Info, Users, Clock } from 'lucide-react';

interface CalendarViewProps {
  tasks: Task[];
}

type ViewType = 'Month' | 'Week' | 'Day';

const CalendarView: React.FC<CalendarViewProps> = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>('Month');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');

  // 날짜 파싱 헬퍼 (예: "26/03/21" -> Date 객체)
  const parseTaskDate = (deadline: string): Date | null => {
    const regex = /(\d{2})\/(\d{2})\/(\d{2})/;
    const match = deadline.match(regex);
    if (match) {
      const year = 2000 + parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const day = parseInt(match[3]);
      return new Date(year, month, day);
    }
    return null;
  };

  const teams = useMemo(() => ['All', ...Array.from(new Set(tasks.map(t => t.teamName)))], [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => selectedTeam === 'All' || t.teamName === selectedTeam);
  }, [tasks, selectedTeam]);

  // 달력 그리드 데이터 생성
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    
    // 이전 달 빈칸
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, date: null });
    }
    
    // 이번 달 날짜
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayTasks = filteredTasks.filter(t => {
        const tDate = parseTaskDate(t.deadline);
        return tDate && tDate.toDateString() === date.toDateString();
      });
      days.push({ day: i, date, tasks: dayTasks });
    }
    
    return days;
  }, [currentDate, filteredTasks]);

  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getCategoryColor = (category: TaskCategory) => {
    switch (category) {
      case TaskCategory.ACTION: return 'bg-amber-500';
      case TaskCategory.CHECK: return 'bg-emerald-500';
      case TaskCategory.TRIGGER: return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="flex flex-col h-[800px] bg-white">
      {/* Calendar Header */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-100 p-2.5 rounded-xl text-indigo-600">
            <CalendarIcon size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">
              {currentDate.toLocaleString('ko-KR', { year: 'numeric', month: 'long' })}
            </h3>
            <p className="text-xs text-slate-500 font-bold">전체 {filteredTasks.length}개의 예정된 업무가 감지됨</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {(['Month', 'Week', 'Day'] as ViewType[]).map(type => (
              <button
                key={type}
                onClick={() => setViewType(type)}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${viewType === type ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {type === 'Month' ? '월' : type === 'Week' ? '주' : '일'}
              </button>
            ))}
          </div>

          <div className="h-8 w-[1px] bg-slate-200 mx-2" />

          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
              <ChevronLeft size={20} />
            </button>
            <button onClick={goToToday} className="px-4 py-2 text-xs font-black text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl">
              오늘
            </button>
            <button onClick={nextMonth} className="p-2 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl transition-all">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold">
            <Filter size={14} />
            <span>팀 필터링:</span>
          </div>
          <select 
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-black text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            {teams.map(t => <option key={t} value={t}>{t === 'All' ? '전체 조직' : t}</option>)}
          </select>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Action</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Check</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Trigger</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-7 border-b border-slate-100">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, i) => (
            <div key={day} className={`py-3 text-center text-[10px] font-black uppercase tracking-widest ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-slate-400'}`}>
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 auto-rows-[120px]">
          {calendarDays.map((d, i) => (
            <div 
              key={i} 
              className={`border-r border-b border-slate-50 p-2 transition-colors hover:bg-slate-50/50 ${!d.day ? 'bg-slate-50/20' : ''}`}
            >
              {d.day && (
                <div className="flex flex-col h-full">
                  <span className={`text-xs font-black mb-2 ${d.date?.toDateString() === new Date().toDateString() ? 'bg-indigo-600 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm' : 'text-slate-400'}`}>
                    {d.day}
                  </span>
                  <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar">
                    {d.tasks?.map((task, idx) => (
                      <div 
                        key={idx} 
                        className={`px-2 py-1 rounded-md text-[9px] font-black text-white truncate shadow-sm flex items-center gap-1.5 group relative ${getCategoryColor(task.category)}`}
                        title={`[${task.teamName}] ${task.taskName}`}
                      >
                        <div className="w-1 h-1 bg-white rounded-full opacity-60" />
                        {task.taskName}
                        {/* Tooltip on hover */}
                        <div className="hidden group-hover:block absolute z-50 top-full left-0 mt-1 p-2 bg-slate-900 text-white rounded-lg w-48 shadow-2xl animate-in fade-in zoom-in duration-200">
                           <p className="text-[8px] opacity-60 uppercase mb-1">{task.teamName} / {task.assigneeLeader}</p>
                           <p className="text-[10px] font-bold leading-tight mb-1">{task.taskName}</p>
                           <p className="text-[9px] text-indigo-300">🎯 {task.purpose}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Routine / Continuous Section */}
      <div className="p-6 bg-slate-900 text-white flex gap-10">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
             <Clock size={16} />
             <h5 className="text-sm font-black uppercase tracking-widest">Continuous / Recurring Actions</h5>
          </div>
          <div className="flex flex-wrap gap-3">
             {tasks.filter(t => !parseTaskDate(t.deadline)).slice(0, 5).map((t, i) => (
               <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl hover:bg-white/10 transition-all cursor-default group">
                 <div className={`w-2 h-2 rounded-full ${getCategoryColor(t.category)}`} />
                 <div className="flex flex-col">
                   <span className="text-[8px] font-black text-slate-500 uppercase">{t.deadline || '지속'}</span>
                   <span className="text-xs font-bold text-slate-200">{t.taskName}</span>
                 </div>
               </div>
             ))}
          </div>
        </div>
        <div className="w-64 bg-white/5 border border-white/10 p-5 rounded-3xl relative overflow-hidden shrink-0">
          <div className="absolute -bottom-4 -right-4 opacity-5">
            <Info size={100} />
          </div>
          <h5 className="text-xs font-black text-indigo-400 mb-3 flex items-center gap-2">
            <Info size={14} />
            AI Insight
          </h5>
          <p className="text-[11px] text-slate-400 leading-relaxed italic">
            "26일 주간에 <strong>Check</strong> 유형의 업무가 집중되어 있습니다. 실 운영 리소스가 부족할 수 있으니 1팀장과 사전 조율을 권장합니다."
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
