import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { FormsModule } from '@angular/forms';
import { describe, expect, it } from 'vitest';

import { ChatComposerComponent } from './chat-composer.component';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { TextareaComponent } from '../../../../shared/ui/textarea/textarea.component';

describe('ChatComposerComponent (Testing Library)', () => {
  it('send disabled when empty, enabled when typing', async () => {
    await render(ChatComposerComponent, {
      imports: [FormsModule],
      declarations: [ButtonComponent, TextareaComponent],
    });

    const user = userEvent.setup();

    const sendButton = screen.getByRole('button', { name: /send/i });
    expect(sendButton).toBeDisabled();

    const messageInput = screen.getByRole('textbox', { name: /message input/i });
    await user.type(messageInput, 'Hello');

    expect(sendButton).toBeEnabled();
  });
});