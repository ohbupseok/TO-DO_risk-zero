
export enum TaskCategory {
  ACTION = 'Action',
  CHECK = 'Check',
  TRIGGER = 'Trigger'
}

export enum Priority {
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low'
}

export enum ViewMode {
  EXECUTIVE = 'Executive',
  LEADER = 'Leader',
  RISK = 'Risk',
  SIMULATION = 'Simulation',
  MESSENGER = 'Messenger',
  HEATMAP = 'Heatmap',
  MATURITY = 'Maturity',
  DAILY_SYNC = 'DailySync'
}

export interface LeaderSubTask {
  parentAction: string;
  leaderAction: string;
  leaderPurpose: string;
  assignee: string;
  criteria: string;
  deadline: string;
  executiveCheckPoint: string; 
}

export interface DeepRiskSimulation {
  scenarioName: string;
  cascadingImpact: string;
  bottleneckIdentify: string;
  preemptiveTrigger: string;
  severity: 'Critical' | 'Warning' | 'Moderate';
}

export interface MessengerBriefing {
  teamName: string;
  leaderName: string;
  briefingText: string;
}

export interface Task {
  category: TaskCategory;
  taskName: string;
  purpose: string;
  priority: Priority;
  executiveCheckCriteria: string; 
  deadline: string;
  assigneeLeader: string; 
  leaderSubTasks: LeaderSubTask[]; 
  riskScore: number;
  riskGuide: string;
  isManageable: boolean; 
  interventionTrigger?: string;
  status: string; 
  progress: number; 
  resultSummary?: string; 
  teamName: string;
  realName: string;
  isTemplateable: boolean;
  missingRiskPoint: string;
  isRolledOver?: boolean; 
}

export interface DashboardData {
  topRisks: string[]; 
  essentialChecks: string[]; 
  triggerConditions: string[]; 
  tasks: Task[];
  deepRiskSimulation: DeepRiskSimulation[];
  messengerBriefings: MessengerBriefing[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  rawInput: string;
  data: DashboardData;
}

export interface AppState {
  rawInput: string;
  rawImages: { data: string; mimeType: string }[];
  processedData: DashboardData | null;
  history: HistoryItem[];
  isLoading: boolean;
  error: string | null;
}
