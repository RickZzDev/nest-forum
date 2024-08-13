import { it, expect, describe, beforeEach } from 'vitest'
import { InMemoryStudentRepository } from 'test/repositories/in-memory-students-repository'
import { FakeHasher } from 'test/cryptography/fake_hasher'
import { FakeEncrypter } from 'test/cryptography/fake_encrypter'
import { AuthenticateStudentUseCase } from './auth_student'
import { maekStudent } from 'test/factories/make_student'
import { string } from 'zod'

let inMemoryStudentsRepo: InMemoryStudentRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let useCase: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepo = new InMemoryStudentRepository()
        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()
        useCase = new AuthenticateStudentUseCase(inMemoryStudentsRepo, fakeHasher, fakeEncrypter)
    })

    it('Should auth student', async () => {
        const student = maekStudent({
            email: 'john@gmail.com',
            password: await fakeHasher.hash('123456')
        })

        inMemoryStudentsRepo.items.push(student)


        const result = await useCase.execute({
            email: 'john@gmail.com',
            password: '123456'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    })


})
