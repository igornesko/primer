/* tslint:disable:max-line-length */
import { User } from '../user/user.model';
import { Thread } from '../thread/thread.model';
import { Message } from '../message/message.model';
import { MessagesService } from '../message/messages.service';
import { ThreadsService } from '../thread/threads.service';
import { UsersService } from '../user/users.service';
import * as moment from 'moment';

// the person using the app us Juliet
const me: User      = new User('Klijent', 'assets/images/avatars/female-avatar-1.png');
const ladycap: User = new User('Klijent@', 'assets/images/avatars/female-avatar-2.png');
const echo: User    = new User('Eho Klijent', 'assets/images/avatars/male-avatar-1.png');
const rev: User     = new User('Obrnuti klijent', 'assets/images/avatars/female-avatar-4.png');
const wait: User    = new User('Čekajući klijent', 'assets/images/avatars/male-avatar-2.png');

const tLadycap: Thread = new Thread('tLadycap', ladycap.name, ladycap.avatarSrc);
const tEcho: Thread    = new Thread('tEcho', echo.name, echo.avatarSrc);
const tRev: Thread     = new Thread('tRev', rev.name, rev.avatarSrc);
const tWait: Thread    = new Thread('tWait', wait.name, wait.avatarSrc);

const initialMessages: Array<Message> = [
  new Message({
    author: me,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: 'Probne poruke.',
    thread: tLadycap
  }),
  new Message({
    author: ladycap,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: 'Samo mi pošalji poruku.',
    thread: tLadycap
  }),
  new Message({
    author: echo,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: `Vrati ću vam poruku koju mi pošaljente`,
    thread: tEcho
  }),
  new Message({
    author: rev,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: `Obrnuću redosled slova u poruci`,
    thread: tRev
  }),
  new Message({
    author: wait,
    sentAt: moment().subtract(1, 'minutes').toDate(),
    text: `Odgovoriću vam na poruku za onoliko sekundi, koliko mi pošaljete u poruci`,
    thread: tWait
  }),
];

export class ChatExampleData {
  static init(messagesService: MessagesService,
              threadsService: ThreadsService,
              UsersService: UsersService): void {

    // TODO make `messages` hot
    messagesService.messages.subscribe(() => ({}));

    // set "Juliet" as the current user
    UsersService.setCurrentUser(me);

    // create the initial messages
    initialMessages.map( (message: Message) => messagesService.addMessage(message) );

    threadsService.setCurrentThread(tEcho);

    this.setupBots(messagesService);
  }

  static setupBots(messagesService: MessagesService): void {

    // echo bot
    messagesService.messagesForThreadUser(tEcho, echo)
      .forEach( (message: Message): void => {
        messagesService.addMessage(
          new Message({
            author: echo,
            text: message.text,
            thread: tEcho
          })
        );
      },
                null);


    // reverse bot
    messagesService.messagesForThreadUser(tRev, rev)
      .forEach( (message: Message): void => {
        messagesService.addMessage(
          new Message({
            author: rev,
            text: message.text.split('').reverse().join(''),
            thread: tRev
          })
        );
      },
                null);

    // waiting bot
    messagesService.messagesForThreadUser(tWait, wait)
      .forEach( (message: Message): void => {

        let waitTime: number = parseInt(message.text, 10);
        let reply: string;

        if (isNaN(waitTime)) {
          waitTime = 0;
          reply = `Nerazumem ${message.text}. Pošalji mi broj`;
        } else {
          reply = `Čekao sam ${waitTime} sekundi dok ti nisam posalo ovu poruku.`;
        }

        setTimeout(
          () => {
            messagesService.addMessage(
              new Message({
                author: wait,
                text: reply,
                thread: tWait
              })
            );
          },
          waitTime * 1000);
      },
                null);


  }
}
