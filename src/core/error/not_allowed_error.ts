import { UseCaseError } from '@/core/error/use_case_error'

export class NotAllowedError extends Error implements UseCaseError {
  constructor() {
    super('Not Allowed')
  }

  error: string = 'Not Allowed'
}
