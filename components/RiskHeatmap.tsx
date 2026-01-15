
import React, { useMemo } from 'react';
import { Task } from '../types';
import { AlertTriangle, TrendingUp, Users, Info } from 'lucide-react';

interface RiskHeatmapProps {
  tasks: Task[];
}

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ tasks }) => {
  const teamMetrics = useMemo(() => {
    const metrics: Record<string, { totalTasks: number; avgRisk: number; maxRisk: number; leader: string }> = {};
    
    tasks.forEach(task => {
      if (!metrics[task.teamName]) {
        metrics[task.teamName] = { totalTasks: 0, avgRisk: 0, maxRisk: 0, leader: task.assigneeLeader };
      }
      metrics[task.teamName].totalTasks += 1;
      metrics[task.teamName].avgRisk += task.riskScore;
      metrics[task.teamName].maxRisk = Math.max(metrics[task.teamName].maxRisk, task.riskScore);
    });

    Object.keys(metrics).forEach(team => {
      metrics[team].avgRisk = metrics[team].avgRisk / metrics[team].totalTasks;
    });

    return metrics;
  }, [tasks]);

  const teams = Object.keys(teamMetrics).sort((a, b) => teamMetrics[b].avgRisk - teamMetrics[a].avgRisk);

  const getHeatColor = (avgRisk: number) => {
    if (avgRisk >= 4.0) return 'bg-red-500 border-red-600 text-white';
    if (avgRisk >= 3.0) return 'bg-orange-500 border-orange-600 text-white';
    if (avgRisk >= 2.0) return 'bg-amber-400 border-amber-500 text-slate-900';
    return 'bg-emerald-500 border-emerald-600 text-white';
  };

  const getHeatBgLight = (avgRisk: number) => {
    if (avgRisk >= 4.0) return 'bg-red-50';
    if (avgRisk >= 3.0) return 'bg-orange-50';
    if (avgRisk >= 2.0) return 'bg-amber-50';
    return 'bg-emerald-50';
  };

  return (
    <div className="p-8 space-y-8 bg-slate-50/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
          <AlertTriangle size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Organizational Risk Heatmap</h3>
          <p className="text-sm text-slate-500 font-medium">조직 전반의 리스크 집중도를 시각적으로 파악합니다. 붉은색에 가까울수록 긴급 점검이 필요합니다.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teams.map(teamName => {
          const m = teamMetrics[teamName];
          return (
            <div key={teamName} className={`relative overflow-hidden rounded-3xl border-2 transition-all hover:scale-[1.02] hover:shadow-xl ${getHeatBgLight(m.avgRisk)} border-slate-200/50 shadow-sm`}>
              {/* Heat Header */}
              <div className={`px-6 py-4 flex items-center justify-between ${getHeatColor(m.avgRisk)}`}>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span className="font-black text-sm uppercase tracking-wider">{teamName}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/10 backdrop-blur-sm">
                  <span className="text-[10px] font-black uppercase">AVG RISK</span>
                  <span className="text-sm font-black">{m.avgRisk.toFixed(1)}</span>
                </div>
              </div>

              {/* Stats Body */}
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Team Leader</p>
                    <p className="text-lg font-black text-slate-900">{m.leader}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Tasks</p>
                    <p className="text-lg font-black text-slate-900">{m.totalTasks}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/60 p-4 rounded-2xl border border-white flex flex-col items-center">
                    <TrendingUp size={16} className="text-indigo-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase">Max Score</p>
                    <p className="text-xl font-black text-slate-900">{m.maxRisk}</p>
                  </div>
                  <div className="bg-white/60 p-4 rounded-2xl border border-white flex flex-col items-center">
                    <Info size={16} className="text-amber-500 mb-2" />
                    <p className="text-[9px] font-black text-slate-400 uppercase">Severity</p>
                    <p className={`text-xs font-black uppercase tracking-tighter ${m.avgRisk >= 3 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {m.avgRisk >= 4 ? 'CRITICAL' : m.avgRisk >= 3 ? 'HIGH' : m.avgRisk >= 2 ? 'MODERATE' : 'LOW'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Risk Distribution</p>
                    <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div className="h-full bg-red-500" style={{ width: `${(tasks.filter(t => t.teamName === teamName && t.riskScore >= 4).length / m.totalTasks) * 100}%` }} />
                        <div className="h-full bg-orange-400" style={{ width: `${(tasks.filter(t => t.teamName === teamName && t.riskScore === 3).length / m.totalTasks) * 100}%` }} />
                        <div className="h-full bg-emerald-400" style={{ width: `${(tasks.filter(t => t.teamName === teamName && t.riskScore < 3).length / m.totalTasks) * 100}%` }} />
                    </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
            <AlertTriangle size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="grid grid-cols-2 gap-4 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold text-slate-400">Critical (4.0+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-400" />
                    <span className="text-[10px] font-bold text-slate-400">Warning (3.0+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <span className="text-[10px] font-bold text-slate-400">Moderate (2.0+)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-[10px] font-bold text-slate-400">Low (&lt;2.0)</span>
                </div>
            </div>
            <div className="border-l border-white/10 pl-10">
                <h5 className="text-lg font-black mb-2">Heatmap Insight</h5>
                <p className="text-slate-400 text-xs leading-relaxed max-w-xl">
                    히트맵은 각 팀별 리스크 총합의 평균을 나타냅니다. 특정 팀의 점수가 급격히 상승할 경우, 해당 팀 리더와의 긴급 면담(Messenger Kit 활용)을 통해 원인을 파악하고 Trigger를 재점검하십시오.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default RiskHeatmap;
