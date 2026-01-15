
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardData } from "../types";

const SYSTEM_INSTRUCTION = `당신은 ‘조직도 기반 실장 TO DO 설계 엔진’이자 '리스크 시뮬레이션 AI'입니다. 
제공된 정보를 분석하여 업무 체계를 구축하고, 각 업무의 '진척도(0~100%)'와 '실행 결과'를 추론하여 관리 데이터로 변환하십시오.

[핵심 분석 항목]
- 진척도: "진행중", "완료", "50% 완료" 등 텍스트에서 상태를 파악하여 숫자로 변환.
- 결과 요약: 업무가 완료되었거나 진행 중인 경우 핵심 성과를 요약.
- 이월 로직: 미완료 업무(Progress < 100)는 자동으로 이월하며 'isRolledOver'를 true로 설정.
- 점검 기준 고도화: 이월된 업무의 경우 'executiveCheckCriteria'를 더 강력한 독려 액션으로 업데이트.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    topRisks: { type: Type.ARRAY, items: { type: Type.STRING } },
    essentialChecks: { type: Type.ARRAY, items: { type: Type.STRING } },
    triggerConditions: { type: Type.ARRAY, items: { type: Type.STRING } },
    deepRiskSimulation: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          scenarioName: { type: Type.STRING },
          cascadingImpact: { type: Type.STRING },
          bottleneckIdentify: { type: Type.STRING },
          preemptiveTrigger: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["Critical", "Warning", "Moderate"] }
        },
        required: ["scenarioName", "cascadingImpact", "bottleneckIdentify", "preemptiveTrigger", "severity"]
      }
    },
    messengerBriefings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          teamName: { type: Type.STRING },
          leaderName: { type: Type.STRING },
          briefingText: { type: Type.STRING }
        },
        required: ["teamName", "leaderName", "briefingText"]
      }
    },
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          teamName: { type: Type.STRING },
          realName: { type: Type.STRING },
          category: { type: Type.STRING, enum: ["Action", "Check", "Trigger"] },
          taskName: { type: Type.STRING },
          purpose: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
          executiveCheckCriteria: { type: Type.STRING },
          deadline: { type: Type.STRING },
          assigneeLeader: { type: Type.STRING },
          riskScore: { type: Type.NUMBER },
          riskGuide: { type: Type.STRING },
          isManageable: { type: Type.BOOLEAN },
          status: { type: Type.STRING },
          progress: { type: Type.NUMBER },
          resultSummary: { type: Type.STRING },
          isTemplateable: { type: Type.BOOLEAN },
          missingRiskPoint: { type: Type.STRING },
          isRolledOver: { type: Type.BOOLEAN },
          leaderSubTasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                parentAction: { type: Type.STRING },
                leaderAction: { type: Type.STRING },
                leaderPurpose: { type: Type.STRING },
                assignee: { type: Type.STRING },
                criteria: { type: Type.STRING },
                deadline: { type: Type.STRING },
                executiveCheckPoint: { type: Type.STRING }
              }
            }
          }
        },
        required: ["teamName", "realName", "category", "taskName", "purpose", "priority", "executiveCheckCriteria", "deadline", "assigneeLeader", "riskScore", "riskGuide", "isManageable", "status", "progress", "isTemplateable", "missingRiskPoint", "leaderSubTasks"]
      }
    }
  },
  required: ["topRisks", "essentialChecks", "triggerConditions", "tasks", "deepRiskSimulation", "messengerBriefings"]
};

// 매 요청마다 새로운 인스턴스를 생성하여 API Key 정합성을 보장합니다.
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const transformNotesToTaskSystem = async (
  content: string, 
  currentDate: string,
  imagesData?: { data: string; mimeType: string }[]
): Promise<DashboardData> => {
  const ai = getAI();
  const promptText = `신규 분석 요청입니다.\n[업무 입력 내용]: ${content}\n[현재 날짜/시간]: ${currentDate}`;

  const parts: any[] = [{ text: promptText }];
  if (imagesData) imagesData.forEach(img => parts.push({ inlineData: img }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });

  return JSON.parse(response.text || '{}') as DashboardData;
};

export const syncDailyTasks = async (currentData: DashboardData, yesterdayResults: string, todayPlan: string): Promise<DashboardData> => {
  const ai = getAI();
  const promptText = `동기화 요청: ${JSON.stringify(currentData)}\n전일 결과: ${yesterdayResults}\n금일 계획: ${todayPlan}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: promptText,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });
  return JSON.parse(response.text || '{}') as DashboardData;
};

export const refineTaskSystem = async (currentData: DashboardData, instruction: string): Promise<DashboardData> => {
  const ai = getAI();
  const promptText = `수정 요청: ${instruction}\n현재 데이터: ${JSON.stringify(currentData)}`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: promptText,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA
    }
  });
  return JSON.parse(response.text || '{}') as DashboardData;
};
