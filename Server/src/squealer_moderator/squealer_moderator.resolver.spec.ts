import { Test, TestingModule } from '@nestjs/testing';
import { SquealerModeratorResolver } from './squealer_moderator.resolver';

describe('SquealerModeratorResolver', () => {
  let resolver: SquealerModeratorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SquealerModeratorResolver],
    }).compile();

    resolver = module.get<SquealerModeratorResolver>(SquealerModeratorResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
