/**
 * ChatWindow — Full-height chat interface container.
 * @param {object} props
 * @param {Array} props.messages
 * @param {boolean} props.isTyping
 * @param {Function} props.onSend
 * @param {Function} props.onNewChat
 * @param {string} [props.className]
 */
import { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import BrainWave from '../../../assets/vectors/BrainWave';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import StarterPrompts from './StarterPrompts';

export default function ChatWindow({ messages = [], isTyping, onSend, onNewChat, className = '' }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    onSend(text);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 96) + 'px';
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 border-b border-white/[0.06]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-lavender-500/10 flex items-center justify-center">
              <BrainWave className="w-5 h-3" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-pearl">Solace</h2>
              <p className="text-[10px] text-pearl/40">Your wellness companion</p>
            </div>
          </div>
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-pearl/50 hover:text-pearl/80 hover:bg-white/[0.04] transition-colors"
            aria-label="New conversation"
          >
            <Plus size={14} />
            New
          </button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {messages.length === 0 && !isTyping && (
          <StarterPrompts onSelect={(prompt) => { setInput(prompt); handleSend(); onSend(prompt); }} />
        )}

        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}

        {isTyping && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* Input row */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-3 border-t border-white/[0.06]">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            maxLength={1000}
            rows={1}
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-pearl placeholder:text-pearl/25 resize-none focus:outline-none focus:border-lavender-500/30 transition-colors"
            aria-label="Chat message input"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-lavender-500 text-white hover:bg-lavender-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
