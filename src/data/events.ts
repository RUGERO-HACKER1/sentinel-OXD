import type { GameEvent, ThreatType, Clue } from '../types';
import { v4 as uuidv4 } from 'uuid';

const SOURCES = [
    'Financial Operations Division',
    'Human Resources Management System',
    'External Vendor Portal Link',
    'Unidentified Network Node',
    'Secure Cloud Gateway Interface',
    'User Account: J.Doe (Authorized)',
    'Administrative Control Console'
];

const MESSAGES = [
    'Processing high-volume asset transfer request pending final authorization from senior management',
    'Critical Security Alert: User password expiration imminent requiring immediate reset procedure',
    'Unusual login attempt detected from new device fingerprint not previously associated with this account',
    'System patches and software updates are available and mandatory for continued network compliance',
    'Invoice #8921 attached for review regarding quarterly server maintenance services',
    'Incoming connection request detected from external IP address starting with 192.168.x.x',
    'Automated database backup sequence initiated for redundancy and disaster recovery protocols'
];

const THREAT_TYPES: ThreatType[] = ['PHISHING', 'MALWARE', 'DDOS', 'SAFE_TRANSACTION', 'SAFE_LOGIN'];


export const generateEvent = (_cycle: number): GameEvent => {
    const isThreat = Math.random() > 0.5; // 50/50 chance
    const type = isThreat
        ? THREAT_TYPES[Math.floor(Math.random() * 3)] // First 3 are threats
        : THREAT_TYPES[Math.floor(Math.random() * 2) + 3]; // Last 2 are safe

    const source = SOURCES[Math.floor(Math.random() * SOURCES.length)];
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];

    // Generate Clues (The Puzzle)
    const clues: Clue[] = [];

    if (isThreat) {
        clues.push({ id: uuidv4(), text: 'Traffic analysis reveals source IP is originating from a high-risk geo-location often associated with cyber crime syndicates', reliability: 0.9, revealed: false });
        clues.push({ id: uuidv4(), text: 'Digital certificate signature validation failed indicating potential tampering or spoofing attempt', reliability: 1.0, revealed: false });
        if (Math.random() > 0.5) {
            clues.push({ id: uuidv4(), text: 'Content analysis detected urgency keywords commonly used in social engineering attacks to bypass scrutiny', reliability: 0.8, revealed: false });
        }
    } else {
        clues.push({ id: uuidv4(), text: 'Source IP address has been verified against the corporate whitelist and is considered trusted', reliability: 1.0, revealed: false });
        clues.push({ id: uuidv4(), text: 'Digital signature is valid and matches the registered public key for this user entity', reliability: 1.0, revealed: false });
        clues.push({ id: uuidv4(), text: 'User activity matches established behavior patterns and falls within standard operating hours', reliability: 0.9, revealed: false });
    }

    return {
        id: uuidv4(),
        timestamp: Date.now(),
        source,
        message,
        amount: Math.random() > 0.7 ? `$${(Math.random() * 10000).toFixed(2)}` : undefined,
        type,
        isThreat,
        maskStatus: 'MASKED',
        riskScore: isThreat ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30), // Initial risk score might be misleading!
        clues,
    };
};
