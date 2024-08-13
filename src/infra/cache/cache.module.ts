import { Module } from '@nestjs/common'
import { EnvModule } from '../env/env.module'
import { EnvService } from '../env/env.service'
import { CacheRepository } from './cache_repository'
import { RedisService } from './redis/redis.service'
import { RedisCacheRepository } from './redis/redis_cache_repository'

@Module({
    imports: [EnvModule],
    providers: [
        RedisService,
        {
            provide: CacheRepository,
            useClass: RedisCacheRepository,
        },
    ],
    exports: [CacheRepository],
})
export class CacheModule { }