import { Message } from 'ai';
import { useRef } from 'react';
import { Bot, User2 } from 'lucide-react';

export default function Messages({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className='mx-4 my-2'>
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`${
            msg.role === 'assistant' ? 'text-green-400' : 'text-black'
          } p-4 flex gap-4`}
        >
          {msg.role === 'assistant' ? <Bot/> : <User2/>}
          <div className='...'>{msg.content}</div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
