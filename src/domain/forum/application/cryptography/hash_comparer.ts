import { Hash } from "crypto";

export abstract class HashComparer {
    abstract compare(plain: string, hash: string): Promise<boolean>
}