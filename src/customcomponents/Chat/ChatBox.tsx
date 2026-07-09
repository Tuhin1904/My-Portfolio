import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { apiRequest } from '@/apiFiles/apiClient';
import { apiEndpoints } from '@/apiFiles/apiEndpoints';

interface Message {
  id: string;
  content: string;
  senderType: 'admin' | 'user';
  timestamp: string;
  isRead?: boolean;
}

interface ChatBoxProps {
  conversationId: string;
  currentUserType: 'admin' | 'user';
}

const ChatBox = ({ conversationId, currentUserType }: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const prependingRef = useRef(false);
  const prevScrollHeightRef = useRef(0);

  // ─── Load message history ────────────────────────────────────────────────
  const loadMessages = useCallback(
    async (pageNum: number) => {
      if (!conversationId) return;
      try {
        setLoadingHistory(true);

        if (pageNum > 1 && scrollRef.current) {
          prevScrollHeightRef.current = scrollRef.current.scrollHeight;
          prependingRef.current = true;
        }

        const res = await apiRequest({
          method: 'GET',
          url: apiEndpoints.getConversationMessages(conversationId, pageNum),
        });

        const fetched: Message[] = (res?.data?.messages || res?.data || []).map((m: any) => ({
          id: m._id || m.id || Math.random().toString(),
          content: m.content,
          senderType: m.senderType || (m.isAdmin ? 'admin' : 'user'),
          timestamp: m.createdAt || new Date().toISOString(),
          isRead: m.isRead ?? false,
        }));

        if (fetched.length === 0) {
          setHasMore(false);
        } else {
          setMessages((prev) =>
            pageNum === 1 ? fetched : [...fetched, ...prev]
          );
        }
      } catch (err) {
        console.error('[ChatBox] Failed to load message history:', err);
      } finally {
        setLoadingHistory(false);
      }
    },
    [conversationId]
  );

  // ─── Initial history load ─────────────────────────────────────────────────
  useEffect(() => {
    if (!conversationId) return;
    setMessages([]);
    setPage(1);
    setHasMore(true);
    loadMessages(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);



  // ─── Restore scroll position after prepend ────────────────────────────────
  useEffect(() => {
    if (prependingRef.current && scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight - prevScrollHeightRef.current;
      prependingRef.current = false;
    }
  }, [messages]);

  // ─── Auto-scroll to bottom for new (non-prepend) messages ────────────────
  useEffect(() => {
    if (!prependingRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);



  // ─── Infinite scroll — load older pages on scroll to top ─────────────────
  const handleScroll = () => {
    if (!scrollRef.current || loadingHistory || !hasMore) return;
    if (scrollRef.current.scrollTop === 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(nextPage);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // ─── Send message ─────────────────────────────────────────────────────────
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const tempId = Math.random().toString();
    const newMsg: Message = {
      id: tempId,
      content: inputValue.trim(),
      senderType: currentUserType,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  return (
    <div className="flex flex-col h-full min-h-[300px] max-h-[400px] w-full bg-background overflow-hidden border rounded-md">
      {/* Messages area */}
      <div
        ref={scrollRef}
        className="flex-1 p-4 overflow-y-auto space-y-4 bg-muted/10"
        onScroll={handleScroll}
      >
        {loadingHistory && page > 1 && (
          <div className="text-center text-xs text-muted-foreground py-1">
            Loading older messages…
          </div>
        )}
        {!hasMore && messages.length > 0 && (
          <div className="text-center text-xs text-muted-foreground py-1">
            No older messages
          </div>
        )}

        {messages.length === 0 && !loadingHistory && (
          <div className="text-center text-sm text-muted-foreground mt-10">
            No messages yet. Say hi!
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderType === currentUserType;
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm shadow-sm ${isMe
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground border rounded-bl-sm'
                  }`}
              >
                {msg.content}
                {isMe && (
                  <span className="block text-right text-[10px] mt-0.5 opacity-60">
                    {msg.isRead ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          );
        })}


      </div>

      {/* Input area */}
      <div className="p-3 border-t bg-background flex items-center gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          className="flex-1 h-9"
        />
        <Button
          size="icon"
          className="h-9 w-9 shrink-0"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
