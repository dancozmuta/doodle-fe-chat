import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MessageItemComponent } from './features/chat/components/message-item/message-item.component';
import { MessageListComponent } from './features/chat/components/message-list/message-list.component';
import { ChatComposerComponent } from './features/chat/components/chat-composer/chat-composer.component';
import { ButtonComponent } from './shared/ui/button/button.component';
import { TextareaComponent } from './shared/ui/textarea/textarea.component';

@NgModule({
  declarations: [
    AppComponent,
    MessageItemComponent,
    MessageListComponent,
    ChatComposerComponent,
    ButtonComponent,
    TextareaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CommonModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
