
import React, { useState } from 'react';
import { MessengerBriefing } from '../types';
import { Copy, Check, MessageCircle, User, Share2 } from 'lucide-react';

interface MessengerKitProps {
  briefings: MessengerBriefing[];
}

const MessengerKit: React.FC<MessengerKitProps> = ({ briefings }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-indigo-100 p-3 rounded-2xl text-indigo-600">
          <MessageCircle size={32} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900">Messenger Delivery Kit</h3>
          <p className="text-sm text-slate-500 font-medium">각 팀 리더용 맞춤형 브리핑 문구입니다. 클릭 한 번으로 복사하여 즉시 지시사항을 전달하세요.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {briefings.map((briefing, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 text-white p-1.5 rounded-lg">
                  <User size={14} />
                </div>
                <div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-tighter">{briefing.teamName}</span>
                  <p className="text-sm font-black text-slate-900">{briefing.leaderName}</p>
                </div>
              </div>
              <button
                onClick={() => handleCopy(briefing.briefingText, idx)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  copiedIndex === idx 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-white text-indigo-600 border border-indigo-100 hover:bg-indigo-50'
                }`}
              >
                {copiedIndex === idx ? <Check size={14} /> : <Copy size={14} />}
                {copiedIndex === idx ? '복사됨' : '복사하기'}
              </button>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 font-medium text-sm text-slate-700 leading-relaxed whitespace-pre-wrap flex-grow">
                {briefing.briefingText}
              </div>
              
              <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400 px-2">
                <div className="flex items-center gap-1">
                   <Share2 size={12} />
                   <span>슬랙 / 카카오톡 최적화 포맷</span>
                </div>
                <span>약 {briefing.briefingText.length}자</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {briefings.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <MessageCircle size={32} />
          </div>
          <p className="text-slate-500 font-bold italic">생성된 브리핑 문구가 없습니다. 분석을 다시 실행해 보세요.</p>
        </div>
      )}
    </div>
  );
};

export default MessengerKit;
