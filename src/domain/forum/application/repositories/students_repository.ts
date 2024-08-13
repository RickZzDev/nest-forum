import { Student } from '../../enterprise/entities/student_entity'

export abstract class StudentsRepository {
    abstract create(student: Student): Promise<void>
    abstract findByEmail(email: string): Promise<Student | null>
}
