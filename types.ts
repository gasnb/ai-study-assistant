export interface MCQOption {
  [key: string]: string;
}

export interface MultipleChoiceQuestionType {
  question: string;
  options: MCQOption;
  correctAnswerKey: string;
  explanation?: string; // Optional explanation for the correct answer
}

export interface VisualResourceType {
  title: string;
  url: string;
  type: 'video' | 'image';
}

export interface DiagramSuggestionType {
  name: string;
  description: string;
  steps: string[];
}

export interface StudyMaterials {
  detailedSummary: string;
  textualMindMap: string; // Tree format using └─, ├─ etc.
  diagramSuggestions: DiagramSuggestionType[]; // Array of diagram suggestion objects
  mnemonics: string[];
  multipleChoiceQuestions: MultipleChoiceQuestionType[];
  visualResources?: VisualResourceType[]; // Optional: links to YouTube videos, images
  extraTips: string[]; // Common mistakes, study strategies
}

export enum StudyTool {
  DETAILED_SUMMARY = "Detailed Summary",
  TEXTUAL_MIND_MAP = "Textual Mind Map",
  DIAGRAM_SUGGESTIONS = "Diagram Suggestions",
  MNEMONICS = "Memory Shortcuts",
  QUIZ = "Quiz",
  VISUAL_RESOURCES = "Visual Resources",
  EXTRA_TIPS = "Extra Tips"
}