import { Test, TestingModule } from '@nestjs/testing';
import { BasicusersService } from './basicusers.service';

describe('BasicusersService', () => {
  let service: BasicusersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BasicusersService],
    }).compile();

    service = module.get<BasicusersService>(BasicusersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
