import { UniqueEntityId } from '../entities/unique_entity_id'

// Especifica a estrutura de um evento de domínio
export interface DomainEvent {
  ocurredAt: Date
  getAggregateId(): UniqueEntityId
}
