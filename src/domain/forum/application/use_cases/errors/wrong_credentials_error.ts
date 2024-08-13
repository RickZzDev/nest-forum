import { UseCaseError } from "@/core/error/use_case_error";

export class WrongCredentialsError extends Error implements UseCaseError {
    constructor() {
        super(`Credentials not valid`)
    }
    error: string = 'Credentials not valid'
}