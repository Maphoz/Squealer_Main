import { Test, TestingModule } from '@nestjs/testing';
import { SquealsService } from './squeals.service';

describe('SquealsService', () => {
  let service: SquealsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SquealsService],
    }).compile();

    service = module.get<SquealsService>(SquealsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
