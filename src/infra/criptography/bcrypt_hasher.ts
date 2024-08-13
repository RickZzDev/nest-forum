import { HashComparer } from "@/domain/forum/application/cryptography/hash_comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash_generator";
import { compare, hash } from "bcryptjs";

export class Bcryphasher implements HashGenerator, HashComparer {
    private HASH_SALT_LENGTH = 8

    hash(plain: string): Promise<string> {
        return hash(plain, this.HASH_SALT_LENGTH)
    }
    compare(plain: string, hash: string): Promise<boolean> {
        return compare(plain, hash)
    }

}