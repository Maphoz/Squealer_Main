import { Test, TestingModule } from '@nestjs/testing';
import { SquealerModeratorService } from './squealer_moderator.service';

describe('SquealerModeratorService', () => {
  let service: SquealerModeratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SquealerModeratorService],
    }).compile();

    service = module.get<SquealerModeratorService>(SquealerModeratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
