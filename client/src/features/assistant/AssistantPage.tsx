import { useState, useRef, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { Bot, Send, User, Sparkles, Loader2 } from "lucide-react";
import Button from "@/components/Button";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface StatusData {
  chunkCount: number;
  lastIndexedAt: string | null;
  isIndexing: boolean;
  suggestedQuestions: string[];
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: status } = useQuery<StatusData>({
    queryKey: ["assistant-status"],
    queryFn: async () => {
      const res = await api.get("/assistant/status");
      return res.data.data;
    },
  });

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isStreaming) return;

    setInput("");
    const userMessage: ChatMessage = { role: "user", content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);

    // Add a placeholder assistant message for streaming
    const assistantMessage: ChatMessage = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const response = await fetch(`${backendUrl}/assistant/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history: messages.slice(-10),
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No response stream");

      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const jsonStr = line.slice(6).trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              accumulated += parsed.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: accumulated };
                return updated;
              });
            }
          } catch {
            // Ignore malformed JSON chunks
          }
        }
      }
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again in a moment, or visit the [Contact](/contact) page to reach the portfolio owner directly.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = status?.suggestedQuestions || [
    "What projects have you built?",
    "Tell me about your skills.",
    "What research are you working on?",
  ];

  return (
    <div className="max-w-3xl w-full mx-auto font-mono text-sm flex flex-col animate-in fade-in duration-500" style={{ height: "calc(100vh - 12rem)" }}>
      {/* Header */}
      <div className="border-b border-border pb-4 mb-4 shrink-0">
        <h1 className="text-h3 font-bold text-text-primary flex items-center gap-2 font-display">
          <Bot size={22} className="text-accent-ai" /> AI Copilot
        </h1>
        <p className="text-xs text-text-muted mt-1.5 font-sans leading-relaxed">
          Ask me anything about Mercer's portfolio coordinates — projects, skills, timelines, or advisory models.
          {status?.chunkCount ? (
            <span className="text-accent-ai/80 ml-1.5 font-mono text-[10px]">({status.chunkCount} knowledge chunks loaded)</span>
          ) : null}
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-2 min-h-0 py-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full space-y-6 text-center">
            <div className="w-14 h-14 bg-accent-ai/5 border border-accent-ai/20 rounded-2xl flex items-center justify-center shadow-md">
              <Sparkles size={24} className="text-accent-ai animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <p className="text-text-primary font-bold font-sans">How can I assist you today?</p>
              <p className="text-text-muted text-xs font-sans max-w-sm">
                I can detail technical specs, resolve timelines, or fetch advisory categories from index variables.
              </p>
            </div>

            {/* Suggested Question Chips */}
            <div className="flex flex-wrap justify-center gap-2 max-w-md pt-2">
              {suggestedQuestions.map((q, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => sendMessage(q)}
                  className="border-border hover:border-accent-ai/30 text-text-secondary text-[11px]"
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-accent-ai/5 border border-accent-ai/20 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Bot size={15} className="text-accent-ai" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-4 text-xs leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-accent-ai/10 border border-accent-ai/20 text-text-primary"
                  : "bg-bg-surface border border-border text-text-secondary"
              }`}
            >
              {msg.role === "assistant" ? (
                <div data-color-mode="dark" className="wmde-markdown-var">
                  <MDEditor.Markdown
                    source={msg.content || (isStreaming && i === messages.length - 1 ? "..." : "")}
                    style={{
                      background: "transparent",
                      fontSize: "12px",
                      lineHeight: "1.7",
                      color: "var(--text-secondary)",
                    }}
                  />
                </div>
              ) : (
                <span className="font-sans">{msg.content}</span>
              )}

              {/* Typing indicator */}
              {isStreaming && i === messages.length - 1 && msg.role === "assistant" && !msg.content && (
                <div className="flex items-center gap-1.5 py-1">
                  <Loader2 size={12} className="text-accent-ai animate-spin" />
                  <span className="text-[10px] text-text-muted">Resolving indexes...</span>
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <div className="w-8 h-8 bg-bg-surface border border-border rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <User size={14} className="text-text-muted" />
              </div>
            )}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-border pt-4 mt-4 shrink-0">
        <div className="flex items-center gap-3 bg-bg-surface border border-border rounded-2xl px-4 py-3 focus-within:border-accent-ai/30 transition-all shadow-md">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isStreaming ? "Waiting for response..." : "Ask a question about this portfolio..."}
            disabled={isStreaming}
            className="flex-1 bg-transparent text-xs text-text-primary placeholder-text-muted/50 focus:outline-none disabled:opacity-50 font-sans"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isStreaming || !input.trim()}
            className="text-accent-ai hover:text-accent-ai/85 disabled:text-text-muted transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            {isStreaming ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-2.5 text-center font-sans">
          Responses are generated from indexed portfolio coordinates. AI may occasionally make mistakes.
        </p>
      </div>
    </div>
  );
}
