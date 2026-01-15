
import React, { useState, useCallback, useEffect } from 'react';
import { AppState, DashboardData, HistoryItem } from './types';
import { transformNotesToTaskSystem, refineTaskSystem, syncDailyTasks } from './services/geminiService';
import InputForm from './components/InputForm';
import DashboardView from './components/DashboardView';
import HistoryLibrary from './components/HistoryLibrary';
import { ShieldCheck, Loader2, AlertCircle, Bookmark, Clock, Key } from 'lucide-react';

const STORAGE_KEY = 'risk_zero_history_v2';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    rawInput: '',
    rawImages: [],
    processedData: null,
    history: [],
    isLoading: false,
    error: null,
  });

  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const checkKey = async () => {
      // @ts-ignore
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    // @ts-ignore
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(prev => ({ ...prev, history: JSON.parse(saved) }));
      } catch (e) { console.error(e); }
    }
  }, []);

  const saveToHistory = useCallback((data: DashboardData, input: string) => {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      rawInput: input,
      data: data
    };
    setState(prev => {
      const updatedHistory = [newItem, ...prev.history].slice(0, 20);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return { ...prev, history: updatedHistory };
    });
  }, []);

  const deleteHistoryItem = useCallback((id: string) => {
    setState(prev => {
      const updatedHistory = prev.history.filter(item => item.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
      return { ...prev, history: updatedHistory };
    });
  }, []);

  const loadHistoryItem = useCallback((item: HistoryItem) => {
    setState(prev => ({ ...prev, processedData: item.data, rawInput: item.rawInput, error: null }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleProcessInput = useCallback(async (input: string, images: { data: string; mimeType: string }[]) => {
    if (!input.trim() && images.length === 0) return;
    setState(prev => ({ ...prev, isLoading: true, error: null, rawInput: input, rawImages: images }));
    try {
      const nowString = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
      const data = await transformNotesToTaskSystem(input, nowString, images);
      setState(prev => ({ ...prev, processedData: data, isLoading: false }));
    } catch (err: any) {
      let errorMessage = err.message || "연산 중 알 수 없는 오류가 발생했습니다.";
      if (errorMessage.includes("Requested entity was not found")) setHasKey(false);
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, []);

  const handleRefineData = useCallback(async (instruction: string) => {
    if (!state.processedData) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const updatedData = await refineTaskSystem(state.processedData, instruction);
      setState(prev => ({ ...prev, processedData: updatedData, isLoading: false }));
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) setHasKey(false);
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, [state.processedData]);

  const handleDailySync = useCallback(async (yesterday: string, today: string) => {
    if (!state.processedData) return;
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const syncedData = await syncDailyTasks(state.processedData, yesterday, today);
      setState(prev => ({ ...prev, processedData: syncedData, isLoading: false }));
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) setHasKey(false);
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
    }
  }, [state.processedData]);

  const handleReset = () => setState(prev => ({ ...prev, processedData: null, error: null }));

  if (hasKey === false) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-[32px] p-8 md:p-12 text-center space-y-6 md:space-y-8 shadow-2xl">
          <div className="bg-indigo-600 text-white w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto shadow-xl ring-4 ring-indigo-50">
            <Key size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl md:text-2xl font-black text-slate-900">API Key 인증 필요</h1>
            <p className="text-sm text-slate-500 font-medium">관리 연산을 위해 API Key 선택이 필요합니다.</p>
          </div>
          <button onClick={handleOpenKeySelector} className="w-full bg-slate-900 text-white font-black py-4 md:py-5 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
            <Key size={18} /> Key 선택하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer" onClick={handleReset}>
          <div className="bg-indigo-600 p-1.5 md:p-2 rounded-lg text-white"><ShieldCheck size={20} /></div>
          <div>
            <h1 className="text-sm md:text-lg font-black text-slate-900 tracking-tight leading-none">Risk-Zero Architect</h1>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Master Edition</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600 font-mono text-[10px] border border-slate-200">
            <Clock size={12} className="text-indigo-500" />
            <span>{currentTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <button onClick={handleOpenKeySelector} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all active:scale-95">
            <Key size={18} />
          </button>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        {!state.processedData && !state.isLoading && !state.error && (
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">현장의 파편을<br/>정교한 시스템으로.</h2>
              <p className="text-slate-500 font-medium text-sm md:text-base">메모, 대화, 이미지를 통한 관리 아키텍처 구축</p>
            </div>
            <InputForm onSubmit={handleProcessInput} />
            {state.history.length > 0 && (
              <div className="pt-8 md:pt-12 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-6 text-slate-800">
                  <Bookmark size={18} className="text-indigo-600" />
                  <h3 className="text-sm md:text-base font-black uppercase tracking-tighter">Architecture Library</h3>
                </div>
                <HistoryLibrary history={state.history} onLoad={loadHistoryItem} onDelete={deleteHistoryItem} />
              </div>
            )}
          </div>
        )}

        {state.isLoading && (
          <div className="flex flex-col items-center justify-center py-24 md:py-40 space-y-6 md:space-y-8">
            <Loader2 size={48} className="text-indigo-600 animate-spin" />
            <div className="text-center space-y-1">
              <h3 className="text-lg md:text-xl font-black text-slate-900">지능형 아키텍처 연산 중...</h3>
              <p className="text-[10px] md:text-xs text-slate-400 font-medium italic">Gemini 3 Flash가 데이터를 구조화하고 있습니다.</p>
            </div>
          </div>
        )}

        {state.error && (
          <div className="max-w-2xl mx-auto py-12 md:py-16 text-center bg-white rounded-[32px] p-8 md:p-12 space-y-6 md:space-y-8 border border-red-100 shadow-xl shadow-red-500/5">
            <div className="bg-red-500 text-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <AlertCircle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-red-900">시스템 연산 정지</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-red-50/50 p-4 rounded-xl border border-red-100 break-all">{state.error}</p>
            </div>
            <button onClick={() => handleReset()} className="w-full bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95">다시 시도하기</button>
          </div>
        )}

        {state.processedData && !state.isLoading && (
          <DashboardView 
            data={state.processedData} 
            rawInput={state.rawInput}
            history={state.history}
            onSave={() => saveToHistory(state.processedData!, state.rawInput)}
            onRefine={handleRefineData}
            onSync={handleDailySync}
          />
        )}
      </main>
    </div>
  );
};

export default App;
