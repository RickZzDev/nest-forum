import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student_entity'
import { UniqueEntityId } from '../../src/core/entities/unique_entity_id'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma_student_mapper'

export function maekStudent(
    override: Partial<StudentProps> = {},
    id?: UniqueEntityId,
): Student {
    const student = Student.create(
        {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            ...override,
        },
        id,
    )

    return student
}

@Injectable()
export class StudentFactory {

    constructor(private prisma: PrismaService) { }

    async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
        const student = maekStudent(data)

        await this.prisma.user.create({
            data: PrismaStudentMapper.toPrisma(student)
        })
        return student
    }
}