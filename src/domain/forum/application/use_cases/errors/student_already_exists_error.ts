import { UseCaseError } from "@/core/error/use_case_error";

export class StudentAlreadyExistsError extends Error implements UseCaseError {
    constructor(identifier: string) {
        super(`Student with "${identifier}" already exists`)
    }
    error: string = 'Student with this email already exists'
}