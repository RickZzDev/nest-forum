import { Injectable } from '@nestjs/common'
import { Either, left, right } from '../../../../core/either'
import { Student } from '../../enterprise/entities/student_entity'
import { StudentsRepository } from '../repositories/students_repository'
import { HashGenerator } from '../cryptography/hash_generator'
import { StudentAlreadyExistsError } from './errors/student_already_exists_error'

interface RegisterStudentInput {
    name: string
    email: string
    password: string
}

type RegisterStudentResponse = Either<StudentAlreadyExistsError, { student: Student }>

@Injectable()
export class RegisterStudentUseCase {
    constructor(private studentRepository: StudentsRepository, private hashGenerator: HashGenerator) { }

    async execute({
        name, email, password
    }: RegisterStudentInput): Promise<RegisterStudentResponse> {

        const userWithEmail = await this.studentRepository.findByEmail(email)

        if (userWithEmail) {
            return left(new StudentAlreadyExistsError(email))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const student = Student.create({
            name: name, email: email, password: hashedPassword
        })

        await this.studentRepository.create(student)

        return right({
            student,
        })
    }
}
