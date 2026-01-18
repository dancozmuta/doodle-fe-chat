import { describe, expect, it } from 'vitest';
import { MessageListComponent } from './message-list.component';
import type { Message } from '../../models/message.model';

describe('MessageListComponent', () => {
  it('isOwnMessage: "Dan C" -> true, others -> false', () => {
    const component = new MessageListComponent();
    component.currentUser = 'Dan C';

    const mine: Message = {
      author: 'Dan C',
      message: 'hello',
      createdAt: '2020-01-01T00:00:00.000Z',
    };

    const theirs: Message = {
      author: 'Alice',
      message: 'hi',
      createdAt: '2020-01-01T00:00:01.000Z',
    };

    expect(component.isOwnMessage(mine)).toBe(true);
    expect(component.isOwnMessage(theirs)).toBe(false);
  });
});

