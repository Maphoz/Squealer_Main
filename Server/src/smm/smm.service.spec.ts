import { Test, TestingModule } from '@nestjs/testing';
import { SmmService } from './smm.service';

describe('SmmService', () => {
  let service: SmmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmmService],
    }).compile();

    service = module.get<SmmService>(SmmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
