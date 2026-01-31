import type { GameEvent } from '../types';

/**
 * AI logic for computer opponent decisions
 * Configured to be challenging but beatable (~75% accuracy)
 */
export function makeComputerDecision(event: GameEvent): 'ALLOW' | 'FLAG' | 'BLOCK' {
    // AI accuracy: 75% correct decisions
    const shouldMakeCorrectDecision = Math.random() < 0.75;

    if (shouldMakeCorrectDecision) {
        // Make correct decision based on actual threat status
        if (event.isThreat) {
            // For threats, prefer BLOCK but sometimes FLAG
            return Math.random() < 0.8 ? 'BLOCK' : 'FLAG';
        } else {
            // For safe events, ALLOW them
            return 'ALLOW';
        }
    } else {
        // Make mistakes 25% of the time
        // Random incorrect decision
        const mistakes: ('ALLOW' | 'FLAG' | 'BLOCK')[] = ['ALLOW', 'FLAG', 'BLOCK'];
        const correctDecision = event.isThreat ? 'BLOCK' : 'ALLOW';
        const incorrectOptions = mistakes.filter(m => m !== correctDecision);
        return incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
    }
}

/**
 * Calculate score for a decision
 */
export function calculateDecisionScore(
    event: GameEvent,
    action: 'ALLOW' | 'FLAG' | 'BLOCK'
): { scoreChange: number; isCorrect: boolean } {
    const isThreat = event.isThreat;
    let scoreChange = 0;
    let isCorrect = false;

    if (action === 'ALLOW') {
        if (!isThreat) {
            scoreChange = 50;
            isCorrect = true;
        } else {
            scoreChange = 0;
            isCorrect = false;
        }
    } else if (action === 'BLOCK') {
        if (isThreat) {
            scoreChange = 100;
            isCorrect = true;
        } else {
            scoreChange = 0;
            isCorrect = false;
        }
    } else if (action === 'FLAG') {
        if (isThreat) {
            scoreChange = 75;
            isCorrect = true;
        } else {
            scoreChange = 10;
            isCorrect = true; // Flag is always safe, just less points
        }
    }

    return { scoreChange, isCorrect };
}
