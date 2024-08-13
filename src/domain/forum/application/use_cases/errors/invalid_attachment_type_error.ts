import { UseCaseError } from "@/core/error/use_case_error";

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
    constructor(type: string) {
        super(`File type "${type}" is not valid.`)
    }
    error: string = 'File type is not valid.';
}