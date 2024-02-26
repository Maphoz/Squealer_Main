import { Test, TestingModule } from '@nestjs/testing';
import { SquealsResolver } from './squeals.resolver';

describe('SquealsResolver', () => {
  let resolver: SquealsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SquealsResolver],
    }).compile();

    resolver = module.get<SquealsResolver>(SquealsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
