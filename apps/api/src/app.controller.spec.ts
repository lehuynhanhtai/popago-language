import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { FirestoreService } from './providers/firebase/firestore.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: FirestoreService,
          useValue: {
            collection: () => ({
              doc: () => ({
                set: () => Promise.resolve(),
                get: () => Promise.resolve({ data: () => ({}) }),
              }),
            }),
            serverTimestamp: () => new Date(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return api response object', () => {
      expect(appController.getHello().success).toBe(true);
      expect(appController.getHello().data?.message).toContain('English Learning Monorepo API');
    });
  });
});
