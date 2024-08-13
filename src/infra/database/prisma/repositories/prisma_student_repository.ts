import { Student } from "@/domain/forum/enterprise/entities/student_entity";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { StudentsRepository } from "@/domain/forum/application/repositories/students_repository";
import { PrismaStudentMapper } from "../mappers/prisma_student_mapper";

@Injectable()
export class PrismaStudentRepository implements StudentsRepository {

    constructor(private prismService: PrismaService) { }

    async create(student: Student): Promise<void> {
        const data = PrismaStudentMapper.toPrisma(student)

        await this.prismService.user.create({
            data
        })
    }

    async findByEmail(email: string): Promise<Student | null> {
        const student = await this.prismService.user.findUnique({
            where: {
                email
            }
        })

        if (!student) {
            return null;
        }

        return PrismaStudentMapper.toDomain(student);
    }

}