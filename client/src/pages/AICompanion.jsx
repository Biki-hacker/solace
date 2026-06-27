/**
 * AI Companion Page — Full-height chat interface with session persistence.
 */
import { useState, useEffect, useCallback } from 'react';
import AppShell from '../components/layout/AppShell';
import ChatWindow from '../components/features/chat/ChatWindow';
import Skeleton from '../components/ui/Skeleton';
import { useAuth } from '../hooks/useAuth';
import {
  getRecentChatSession,
  createChatSession,
  updateChatSession,
} from '../services/firestore.service';
import api from '../services/api.service';
import { calculateAverageMood } from '../utils/moodUtils';
import { useMood } from '../hooks/useMood';

export default function AICompanion() {
  const { user, profile } = useAuth();
  const { moods } = useMood();
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);

  /** Load the most recent chat session */
  useEffect(() => {
    if (!user) return;
    const loadSession = async () => {
      try {
        const session = await getRecentChatSession(user.uid);
        if (session) {
          setSessionId(session.id);
          setMessages(session.messages || []);
        }
      } catch (err) {
        if (import.meta.env.DEV) console.error('Error loading chat:', err);
      } finally {
        setLoading(false);
      }
    };
    loadSession();
  }, [user]);

  /** Send a message */
  const handleSend = useCallback(
    async (text) => {
      if (!user || !text.trim()) return;

      const userMessage = {
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setIsTyping(true);

      try {
        let currentSessionId = sessionId;
        if (!currentSessionId) {
          const title = text.substring(0, 50);
          currentSessionId = await createChatSession(user.uid, title);
          setSessionId(currentSessionId);
        }

        const avgMood = calculateAverageMood(moods);
        const recentTriggers = [];

        const response = await api.post('/api/ai/chat', {
          message: text,
          sessionHistory: updatedMessages.slice(-20).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          examType: profile?.examType || 'OTHER',
          recentMoodAvg: avgMood,
          recentTriggers,
        });

        const aiMessage = {
          role: 'model',
          content: response.reply,
          timestamp: new Date(),
        };

        const finalMessages = [...updatedMessages, aiMessage];
        setMessages(finalMessages);

        await updateChatSession(user.uid, currentSessionId, finalMessages);
      } catch (err) {
        const errorMessage = {
          role: 'model',
          content: 'I am having a moment of difficulty connecting. Please try again in a moment.',
          timestamp: new Date(),
        };
        setMessages([...updatedMessages, errorMessage]);
      } finally {
        setIsTyping(false);
      }
    },
    [user, sessionId, messages, moods, profile]
  );

  /** Start a new conversation */
  const handleNewChat = useCallback(async () => {
    setSessionId(null);
    setMessages([]);
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="h-[calc(100vh-80px)] flex items-center justify-center">
          <Skeleton variant="card" width="300px" height="200px" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="h-[calc(100vh-80px)] lg:h-screen">
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          onSend={handleSend}
          onNewChat={handleNewChat}
        />
      </div>
    </AppShell>
  );
}
