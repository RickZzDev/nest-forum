import { StudentsRepository } from '@/domain/forum/application/repositories/students_repository'
import { Student } from '@/domain/forum/enterprise/entities/student_entity'
import { DomainEvents } from 'src/core/events/domain_events'
import { PaginationParams } from 'src/core/repositories/pagination_params'

export class InMemoryStudentRepository implements StudentsRepository {


    public items: Student[] = []


    async create(question: Student) {
        this.items.push(question)

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async findByEmail(email: string): Promise<Student | null> {
        const question = this.items.find((item) => item.email === email)

        if (!question) {
            return null
        }

        return question
    }

}
