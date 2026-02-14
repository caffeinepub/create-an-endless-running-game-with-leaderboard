import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Score = bigint;
export interface backendInterface {
    getBestScore(): Promise<Score>;
    getLeaderboard(n: bigint): Promise<Array<[Principal, Score]>>;
    submitScore(newScore: Score): Promise<Score>;
}
