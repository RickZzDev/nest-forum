import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique_entity_id'

export interface StudentProps {
  name: string
  email: string
  password: string
}

export class Student extends Entity<StudentProps> {

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  static create(props: StudentProps, id?: UniqueEntityId): Student {
    const student = new Student(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )

    return student
  }
}
