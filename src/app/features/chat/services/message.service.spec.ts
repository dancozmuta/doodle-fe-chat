import { describe, expect, it, vi } from 'vitest';
import { of } from 'rxjs';
import { MessageService } from './message.service';

describe('MessageService', () => {
  it('sortChronologically: API reverse order -> UI order', () => {
    const apiMessages = [
      {
        _id: '2',
        message: 'newer',
        author: 'Alice',
        createdAt: '2020-01-02T00:00:00.000Z',
      },
      {
        _id: '1',
        message: 'older',
        author: 'Alice',
        createdAt: '2020-01-01T00:00:00.000Z',
      },
    ];

    const chatApiService = {
      getMessages: vi.fn().mockReturnValue(of(apiMessages)),
    };

    const service = new MessageService(chatApiService as any);

    service.loadMessages();

    expect(service.getMessages().map((m) => m._id)).toEqual(['1', '2']);
  });
});

