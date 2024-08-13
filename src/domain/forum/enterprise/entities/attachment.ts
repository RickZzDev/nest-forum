import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique_entity_id'

export interface AttachtmentProps {
  title: string
  url: string
}

export class Attachtment extends Entity<AttachtmentProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(attatchmentProps: AttachtmentProps, id?: UniqueEntityId) {
    const attachment = new Attachtment(attatchmentProps, id)

    return attachment
  }
}
