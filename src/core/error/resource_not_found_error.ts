import { UseCaseError } from '@/core/error/use_case_error'

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor(message?: string) {
    super(message ?? 'Resource not found')
  }

  error: string = 'Resource not found '
}
