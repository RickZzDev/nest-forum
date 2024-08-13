import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { StudentsRepository } from '../repositories/students_repository'
import { HashComparer } from '../cryptography/hash_comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong_credentials_error'

interface AuthenticateStudentInput {
    email: string
    password: string
}

type AuthenticateStudentResponse = Either<WrongCredentialsError, { accessToken: string }>

@Injectable()
export class AuthenticateStudentUseCase {
    constructor(private studentRepository: StudentsRepository,
        private hashComparer: HashComparer,
        private encrypter: Encrypter) { }

    async execute({
        email, password
    }: AuthenticateStudentInput): Promise<AuthenticateStudentResponse> {

        const student = await this.studentRepository.findByEmail(email)

        if (!student) {
            return left(new WrongCredentialsError())
        }

        const isPasswordValid = await this.hashComparer.compare(password, student.password)

        if (!isPasswordValid) {
            throw new WrongCredentialsError()
        }

        const accessToken = await this.encrypter.encrypt({
            sub: student.id.toString(),
        })

        return right({
            accessToken,
        })
    }
}
