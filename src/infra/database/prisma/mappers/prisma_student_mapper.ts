import { UniqueEntityId } from "@/core/entities/unique_entity_id";
import { Student } from "@/domain/forum/enterprise/entities/student_entity";
import { Slug } from "@/domain/forum/enterprise/entities/value_objects/slug";
import { Prisma, User as PrismaStudent } from "@prisma/client";


export class PrismaStudentMapper {

    static toDomain(raw: PrismaStudent) {
        return Student.create(
            {
                name: raw.name,
                email: raw.email,
                password: raw.password,
            },
            new UniqueEntityId(raw.id)
        )
    }

    static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
        return {
            id: student.id.toString(),
            name: student.name,
            email: student.email,
            password: student.password,
        }
    }
}