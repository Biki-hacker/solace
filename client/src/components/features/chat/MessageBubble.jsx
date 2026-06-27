/**
 * MessageBubble — Individual chat message bubble.
 * @param {object} props
 * @param {object} props.message - { role, content, timestamp }
 */
import { formatChatTime } from '../../../utils/dateUtils';

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] sm:max-w-[70%] ${
          isUser
            ? 'bg-lavender-500 text-white rounded-[18px] rounded-tr-[4px]'
            : 'glass-card text-pearl/90 rounded-[18px] rounded-tl-[4px]'
        } px-4 py-3`}
      >
        <p
          className={`text-sm leading-relaxed whitespace-pre-wrap ${
            !isUser ? 'font-mono' : ''
          }`}
        >
          {message.content}
        </p>
        {message.timestamp && (
          <p
            className={`text-[10px] mt-1.5 ${
              isUser ? 'text-white/50' : 'text-pearl/30'
            }`}
          >
            {formatChatTime(message.timestamp)}
          </p>
        )}
      </div>
    </div>
  );
}
