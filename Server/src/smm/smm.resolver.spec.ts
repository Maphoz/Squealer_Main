import { Test, TestingModule } from '@nestjs/testing';
import { SmmResolver } from './smm.resolver';

describe('SmmResolver', () => {
  let resolver: SmmResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmmResolver],
    }).compile();

    resolver = module.get<SmmResolver>(SmmResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
