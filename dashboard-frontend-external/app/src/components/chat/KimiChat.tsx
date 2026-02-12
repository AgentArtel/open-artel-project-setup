// ============================================================================
// Kimi Chat Component - Floating Chat Interface
// ============================================================================

import { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User,
  Loader2,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useChatStore } from '@/stores/chatStore';
import { cn } from '@/lib/utils';

interface KimiChatProps {
  project?: string;
  task?: string;
}

export function KimiChat({ project, task }: KimiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { 
    messages, 
    isLoading, 
    isStreaming, 
    streamContent, 
    context, 
    setContext, 
    sendMessageStream, 
    clearMessages 
  } = useChatStore();

  // Update context when props change
  useEffect(() => {
    setContext({ project, task });
  }, [project, task, setContext]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, streamContent]);

  const handleSend = () => {
    if (!input.trim() || isLoading || isStreaming) return;
    
    sendMessageStream(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <Button
          className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg z-50"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card className="fixed bottom-4 right-4 w-96 h-[500px] shadow-xl z-50 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold">Kimi Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  {isStreaming ? 'Typing...' : 'Ready to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {/* Context Settings */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Context</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {project && (
                    <DropdownMenuCheckboxItem checked={!!context.project}>
                      Project: {project}
                    </DropdownMenuCheckboxItem>
                  )}
                  {task && (
                    <DropdownMenuCheckboxItem checked={!!context.task}>
                      Task: {task}
                    </DropdownMenuCheckboxItem>
                  )}
                  {!project && !task && (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      No context set
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clear Chat */}
              {messages.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearMessages}
                >
                  Clear
                </Button>
              )}

              {/* Close */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Ask me anything about your projects!</p>
                  {(project || task) && (
                    <div className="mt-4 space-y-1">
                      <p className="text-xs">Current context:</p>
                      {project && (
                        <Badge variant="secondary" className="text-xs">
                          Project: {project}
                        </Badge>
                      )}
                      {task && (
                        <Badge variant="secondary" className="text-xs ml-1">
                          Task: {task}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                messages.map((message: { id: string; role: 'user' | 'assistant'; content: string }) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === 'user' ? "justify-end" : "justify-start"
                    )}
                  >
                    {message.role === 'assistant' && (
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg p-3 text-sm",
                        message.role === 'user'
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      {message.content}
                    </div>
                    {message.role === 'user' && (
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Streaming Content */}
              {isStreaming && streamContent && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="max-w-[80%] rounded-lg p-3 text-sm bg-muted">
                    {streamContent}
                    <span className="inline-block w-2 h-4 ml-1 bg-primary animate-pulse" />
                  </div>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && !isStreaming && (
                <div className="flex gap-3 justify-start">
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="rounded-lg p-3 bg-muted">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading || isStreaming}
                className="flex-1"
              />
              <Button 
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isStreaming}
                size="icon"
              >
                {isLoading || isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
