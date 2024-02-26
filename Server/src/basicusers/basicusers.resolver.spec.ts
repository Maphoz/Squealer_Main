import { Test, TestingModule } from '@nestjs/testing';
import { BasicusersResolver } from './basicusers.resolver';

describe('BasicusersResolver', () => {
  let resolver: BasicusersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicusersResolver],
    }).compile();

    resolver = module.get<BasicusersResolver>(BasicusersResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
