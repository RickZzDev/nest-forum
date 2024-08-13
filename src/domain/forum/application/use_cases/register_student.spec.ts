import { it, expect, describe, beforeEach } from 'vitest'
import { RegisterStudentUseCase } from './register_student'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake_hasher'

let inMemoryStudentsRepo: InMemoryStudentRepository
let fakeHasher: FakeHasher
let useCase: RegisterStudentUseCase

describe('Register Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepo = new InMemoryStudentRepository()
        fakeHasher = new FakeHasher()
        useCase = new RegisterStudentUseCase(inMemoryStudentsRepo, fakeHasher)
    })

    it('Create a student', async () => {
        const result = await useCase.execute({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            student: inMemoryStudentsRepo.items[0]
        })
    })

    it('Should hash student password on register', async () => {
        const result = await useCase.execute({
            name: 'John Doe',
            email: 'john@gmail.com',
            password: '123456'
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryStudentsRepo.items[0].password).toEqual('123456-hashed')
    })
})
