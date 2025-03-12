import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
    state: () => ({
        affection: 50, // 호감도 (0~100)
        emotion: 'neutral', // 현재 감정 상태 (neutral, happy, sad 등)
        dialogueCount: 0, // 대화 횟수
    }),
    actions: {
        increaseAffection(value) {
            this.affection = Math.min(this.affection + value, 100);
        },
        decreaseAffection(value) {
            this.affection = Math.max(this.affection - value, 0);
        },
        changeEmotion(newEmotion) {
            this.emotion = newEmotion;
        },
        incrementDialogueCount() {
            this.dialogueCount++;
        },
    },
});