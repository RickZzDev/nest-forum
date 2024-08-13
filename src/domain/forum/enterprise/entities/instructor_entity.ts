import { Entity } from '../../../../core/entities/entity'

interface InstructorParams {
  name: string
}

export class Instructor extends Entity<InstructorParams> {}
