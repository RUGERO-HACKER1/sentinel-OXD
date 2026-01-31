export type ThreatType = 'PHISHING' | 'MALWARE' | 'DDOS' | 'RANSOMWARE' | 'SAFE_TRANSACTION' | 'SAFE_LOGIN';

export type MaskStatus = 'MASKED' | 'PARTIALLY_REVEALED' | 'UNMASKED';

export type GameMode = 'SOLO' | 'VS_COMPUTER';

export type Turn = 'PLAYER' | 'COMPUTER';

export interface Clue {
    id: string;
    text: string;
    reliability: number; // 0-1, how true the clue is
    revealed: boolean;
}

export interface GameEvent {
    id: string;
    timestamp: number;
    source: string;
    message: string;
    amount?: string; // Optional financial context
    type: ThreatType;
    isThreat: boolean; // The Truth
    maskStatus: MaskStatus;
    riskScore: number; // 0-100 displayed risk
    clues: Clue[];
}

export interface GameState {
    trust: number; // 0-100
    score: number;
    level: number;
    completedLevels: number[];
    cycle: number;
    events: GameEvent[];
    activeEvent: GameEvent | null;
    isPlaying: boolean;
    gameOver: boolean;
    highScore: number;
    streak: number;
    multiplier: number;
    threatsBlocked: number;
    falsePositives: number;
    totalDecisions: number;
    // Competitive mode properties
    gameMode: GameMode;
    currentTurn: Turn;
    playerScore: number;
    computerScore: number;
    playerStats: { correct: number; incorrect: number };
    computerStats: { correct: number; incorrect: number };
    roundNumber: number;
    maxRounds: number;
    winner: 'PLAYER' | 'COMPUTER' | null;
}
