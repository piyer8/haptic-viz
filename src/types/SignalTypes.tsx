export interface Signal {
    signal_index: string;
    sensory_descriptions: string[];
    emotion_descriptions: string[];
    associative_descriptions: string[];
    sensory_keywords: string[];
    emotional_keywords: string[];
    associative_keywords: string[];
}

export interface EmotionalKeyword {
    word: string;
    emotion: string;
    intensity: number;
}
export interface SignalEmotions {
    signal_index: string;
    emotional_keywords: EmotionalKeyword[];
}