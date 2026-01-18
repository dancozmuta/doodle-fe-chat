import { describe, expect, it } from 'vitest';
import { ChatComposerComponent } from './chat-composer.component';

describe('ChatComposerComponent', () => {
  it('canSend: empty/whitespace -> false', () => {
    const component = new ChatComposerComponent();

    component.message = '';
    component.onInput();
    expect(component.canSend).toBe(false);

    component.message = '   \n\t  ';
    component.onInput();
    expect(component.canSend).toBe(false);
  });
});

