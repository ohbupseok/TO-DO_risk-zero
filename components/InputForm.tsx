import React, { useState, useRef } from 'react';
import { Send, FileText, MessageSquare, List, ImagePlus, X, Layers, ClipboardList, Target } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: string, images: { data: string; mimeType: string }[]) => void;
}

interface ImageItem {
  data: string;
  mimeType: string;
  preview: string;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [images, setImages] = useState<ImageItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() || images.length > 0) {
      onSubmit(value, images.map(img => ({ data: img.data, mimeType: img.mimeType })));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newImages: ImageItem[] = await Promise.all(
      files.map((file: File) => {
        return new Promise<ImageItem>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Data = (reader.result as string).split(',')[1];
            resolve({
              data: base64Data,
              mimeType: file.type,
              preview: URL.createObjectURL(file)
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const examples = [
    { 
      label: '운영 리스크 (전체)', 
      icon: <ClipboardList size={14} className="text-indigo-600" />, 
      text: `[조직 운영 리스크 TO DO 전체 리스트]
1. 팀별 출결·지각 패턴 주간 모니터링: 인력 공백 리스크 조기 탐지 (담당: 각 팀장, 중요도: 상, 진행중)
2. 결근·조퇴 사유 유형화 및 Top3 리스크 정의: 이탈/번아웃 대응 속도 향상 (담당: 3팀장, 중요도: 상, 마감: 26/03/21)
3. 돌발 인력 공백 발생 시 즉시 대체 플로우 적용: 대기시간 급증 차단 (담당: 1팀장, 중요도: 중, 지속)
4. SOP/금지표현 주간 위반 Top5 추출: 컴플레인 리스크 사전 차단 (담당: 2팀장, 중요도: 상, 진행중)
5. 우수 응대 사례 10건/월 수집 및 교육자산화: 코칭 품질 표준화 (담당: 4팀장, 중요도: 중, 지속)
6. 스크립트 고도화 v2.0 현장검증 및 확정: 민원 리스크 축소 (담당: 5팀장, 중요도: 상, 마감: 26/03/21)
7. 반복 민원 Top3 원분해 및 개선안 적용: 후처리 발생률 감축 (담당: 1팀장, 협업필요: QA/IT, 예정)
8. 리더 면담 기록 템플릿 표준화: 고위험군 조기 발견률 향상 (담당: 2팀장, 중요도: 상, 예정)
9. 리더별 주간 액션 로그(3개 필수) 운영: 실행 책임 명확화 (담당: 각 팀장, 중요도: 상, 마감: 26/03/21)
10. KPI 급락/급등 팀 원인 분석 루틴 고정: 숫자 이상 조기경보 (담당: 3팀장, 중요도: 상, 지속)
11. 팀별 운영 기준 불일치 항목 5개 통일 문서화: 운영 일관성 확보 (담당: 4팀장, 중요도: 중, 예정)
12. 지원 필요 항목 재분류: 타그룹 의존 과다 제거 및 실행 가속화` 
    },
    { 
      label: '핵심 관리 (각 항목)', 
      icon: <Target size={14} className="text-rose-600" />, 
      text: `[조직 운영 핵심 리스크 항목별 상세]
- 인력 관리: 출결 패턴 주간 모니터링을 통해 인력 공백 리스크를 조기에 탐지하고 운영 안정성을 확보하세요. (각 팀장 담당)
- 민원 대응: SOP 위반 Top5를 매주 추출하여 품질 편차를 줄이고, 반복 민원 Top3의 구조적 원인을 분해하여 개선안을 적용하세요.
- 리더 역량: 면담 기록 템플릿을 표준화하여 고위험군을 조기 발견하고, 리더별 주간 액션 로그를 통해 실행 책임을 명확히 하세요.` 
    },
    { label: '회의 메모', icon: <FileText size={14} />, text: '마케팅팀 하반기 계획 회의: 9월 캠페인 기획안 준비 필요, 김대리한테 매체비 리스트 받아야함. 성과 지표 150% 달성 목표로.' },
    { label: '메신저 대화', icon: <MessageSquare size={14} />, text: '팀장님: 이번주 금요일까지 거래처 미팅 보고서 정리해주세요. 아 그리고 다음주 월요일 아침에 있을 주간회의 자료 미리 공유바랍니다.' },
  ];

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="relative group bg-white border-2 border-slate-200 rounded-3xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all shadow-sm">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="여기에 관리할 업무 내용이나 메모를 입력하세요 (전체 리스트나 개별 핵심 항목을 자유롭게 입력하시면 됩니다)"
          className="w-full h-64 p-6 text-lg outline-none resize-none border-none"
        />
        
        {images.length > 0 && (
          <div className="px-6 pb-4">
            <div className="flex flex-wrap gap-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100">
              {images.map((img, idx) => (
                <div key={idx} className="relative group/img">
                  <img 
                    src={img.preview} 
                    alt={`Preview ${idx}`} 
                    className="h-24 w-24 rounded-xl border border-slate-200 shadow-sm object-cover hover:scale-105 transition-transform" 
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-24 w-24 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-400 transition-colors"
              >
                <ImagePlus size={24} />
                <span className="text-[10px] font-bold">추가</span>
              </button>
            </div>
          </div>
        )}

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all active:scale-95"
            >
              <ImagePlus size={18} />
              이미지(들) 첨부
            </button>
            {images.length > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 rounded-lg text-indigo-700 border border-indigo-100">
                <Layers size={14} />
                <span className="text-xs font-black">{images.length}장 대기 중</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!value.trim() && images.length === 0}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:shadow-none transition-all flex items-center gap-2 font-black"
          >
            <Send size={20} />
            <span>통합 시스템 생성</span>
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-3">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setValue(ex.text)}
            className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-sm font-medium transition-colors ${i < 2 ? 'border-indigo-300 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100' : 'border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'}`}
          >
            {ex.icon}
            {ex.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputForm;