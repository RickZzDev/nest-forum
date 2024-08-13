import { Encrypter } from "@/domain/forum/application/cryptography/encrypter";
import { Module } from "@nestjs/common";
import { JwtEncypter } from "./jwt_encrypter";
import { HashComparer } from "@/domain/forum/application/cryptography/hash_comparer";
import { Bcryphasher } from "./bcrypt_hasher";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash_generator";

@Module({
    providers: [
        {
            provide: Encrypter,
            useClass: JwtEncypter
        },
        {
            provide: HashComparer,
            useClass: Bcryphasher
        },
        {
            provide: HashGenerator,
            useClass: Bcryphasher
        }

    ],
    exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule { }