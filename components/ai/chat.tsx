import React, { FormEvent, ChangeEvent } from 'react';
import { Message } from 'ai/react';
import { Textarea } from '@nextui-org/input';
import { Send } from 'lucide-react';
import { Spinner } from '@nextui-org/react';

import Messages from './messages';

export default function Chat({ postId }: { postId: string }) {
  const [id, setId] = React.useState(1);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  

  const handleSubmit = async (event: FormEvent) => {
    setLoading(true);
    event.preventDefault();
    setMessages([...messages, { id: '1', content: message, role: 'user' }]);
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message, postId: postId, userId: id }),
    });
    setMessage('');
    setId(id + 1);
    const data = await res.json();
    console.log(data);
    if (data.error) {
      setMessages([
        ...messages,
        { id: id as unknown as string, content: data.error.error, role: 'assistant' },
      ]);
    }
    if (!data.messages) {
      return;
    }
    setMessages([
      ...messages,
      { id: id as unknown as string, content: data.messages, role: 'assistant' },
    ]);
    setId(id + 1);
    setLoading(false);
  };

  return (
    <div className='m-2 rounded-xl border bg-white drop-shadow-sm' id='chat'>
      <Messages messages={messages} />
      <>
        <form>
          <div className='flex gap-x-4 p-4 text-black'>
            {loading && <Spinner/>}
            <Textarea
              placeholder='Chat with Persona..'
              className='font-xl w-full'
              onChange={(event: any) => {
                setMessage(event.target.value);
              }}
            />
            <button
              type='submit'
              className='rounded-md bg-purple-500 px-4 py-2 text-white'
              onClick={handleSubmit}
            >
              <Send />
            </button>
          </div>
        </form>
      </>
    </div>
  );
}
