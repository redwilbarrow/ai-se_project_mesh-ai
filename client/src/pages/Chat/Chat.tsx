import "./Chat.css";
import errorIcon from "../../assets/images/error-icon.png";
import { useState, useEffect, useRef } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getChats, getChat, createChat, sendMessage } from "../../utils/api";
import type { Chat as ChatType, Message } from "../../types";

type MobileContext = {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
};

const formatMessageTime = (createdAt: string): string => {
  return new Date(createdAt)
    .toLocaleString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", "")
    .toLowerCase();
};

export default function Chat() {
  const [chats, setChats] = useState<ChatType[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chatsError, setChatsError] = useState<string | null>(null);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [newChatTitle, setNewChatTitle] = useState("");

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLLIElement>(null);

  const navigate = useNavigate();

  const { isMobileMenuOpen, setIsMobileMenuOpen } =
    useOutletContext<MobileContext>();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getChats();
        setChats(res.data || []);
      } catch {
        setChatsError("Failed to load chats.");
      } finally {
        setIsLoadingChats(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    if (!activeChatId) return;

    const load = async () => {
      setMessages([]);
      setMessagesError("");
      setIsLoadingMessages(true);
      try {
        const res = await getChat(activeChatId);
        setMessages(res.data?.messages || []);
      } catch {
        setMessagesError("Failed to load chat.");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    load();
  }, [activeChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleCreateChat = async () => {
    const title = newChatTitle.trim() || "New Chat";

    setIsCreatingChat(false);
    setNewChatTitle("");

    try {
      const res = await createChat(title);
      if (res.data) {
        setChats((prevChats) => [res.data!, ...prevChats]);
        setActiveChatId(res.data._id);
        setIsMobileMenuOpen(false);
      }
    } catch {
      // A toast or inline error could go here in the future
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || !activeChatId || isSending) return;

    const userMessage: Message = {
      _id: Date.now().toString(),
      chatId: activeChatId,
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const res = await sendMessage(activeChatId, text);

      if (res.data) {
        setMessages((prev) => [
          ...prev.filter((m) => m._id !== userMessage._id),
          ...res.data!,
        ]);
      }
    } catch {
      const errorMessage: Message = {
        _id: Date.now().toString(),
        chatId: activeChatId,
        role: "assistant",
        content: "Something went wrong. Please try again.",
        createdAt: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={
        activeChatId && messages.length > 0 ? "chat chat_has-messages" : "chat"
      }
    >
      <aside
        className={`chat__sidebar${isMobileMenuOpen ? " chat__sidebar_open" : ""}`}
      >
        <button
          className="chat__new-btn"
          type="button"
          onClick={() => {
            setIsCreatingChat(true);
          }}
        >
          New Chat
        </button>

        {isCreatingChat && (
          <input
            className="chat__title-input"
            type="text"
            placeholder="Chat name"
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreateChat();
              if (e.key === "Escape") {
                setIsCreatingChat(false);
                setNewChatTitle("");
              }
            }}
            autoFocus
            onBlur={() => {
              setIsCreatingChat(false);
              setNewChatTitle("");
            }}
          />
        )}
        {isLoadingChats && <p className="chat__sidebar-message">Loading…</p>}
        {chatsError && <p className="chat__sidebar-message">{chatsError}</p>}

        <div className="chat__chats-scroll">
          <ul className="chat__chats-list">
            {chats.map((c) => (
              <li
                key={c._id}
                className={
                  c._id === activeChatId
                    ? "chat__chat-item chat__chat-item_active"
                    : "chat__chat-item"
                }
                onClick={() => {
                  setActiveChatId(c._id);
                  setIsMobileMenuOpen(false);
                }}
              >
                {c.title}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="chat__main">
        {!messagesError && !isLoadingMessages && !activeChatId && (
          <div className="chat__no-messages">
            <h1 className="chat__main-title">
              Create a new chat or select an existing one to start the
              conversation
            </h1>
            <button
              type="button"
              className="chat__std-btn"
              onClick={() => {
                setIsCreatingChat(true);
                setIsMobileMenuOpen(true);
              }}
            >
              Start New Chat
            </button>
          </div>
        )}

        {activeChatId && isLoadingMessages && (
          <p className="chat__no-messages">Loading...</p>
        )}

        {activeChatId && messagesError && (
          <div className="chat__error">
            <img
              src={errorIcon}
              alt=""
              aria-hidden="true"
              className="chat__error-icon"
            />
            <div className="chat__error-text">
              <h1 className="chat__main-title chat__main-title_error">
                Looks like something went wrong
              </h1>
              <p className="chat__error-p">
                Try reloading the page or creating the chat again
              </p>
              <button
                type="button"
                className="chat__std-btn"
                onClick={() => {
                  setMessagesError("");
                  setMessages([]);
                  setActiveChatId(null);
                  navigate("/chat");
                }}
              >
                Go to the Main Page
              </button>
            </div>
          </div>
        )}

        {activeChatId && !isLoadingMessages && !messagesError && (
          <div className="chat__conversation">
            {messages.length === 0 ? (
              <div className="chat__no-messages">
                <h1
                  className="chat__main-title"
                  aria-label="Ask a question below to start the conversation"
                >
                  <span className="chat__main-title_desktop" aria-hidden="true">
                    Ask a question below{" "}
                    <span className="chat__main-title_break">
                      to start the conversation
                    </span>
                  </span>

                  <span className="chat__main-title_mobile" aria-hidden="true">
                    <span>Ask a question</span>
                    <span>below to start</span>
                    <span>the conversation</span>
                  </span>
                </h1>
              </div>
            ) : (
              <ul className="chat__messages">
                {messages.map((msg) => (
                  <li
                    key={msg._id}
                    className={
                      msg.role === "user"
                        ? "chat__message chat__message_user"
                        : "chat__message chat__message_assistant"
                    }
                  >
                    <div className="chat__message-content">
                      <div className="chat__message-text">
                        {msg.role === "assistant" ? (
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        ) : (
                          msg.content
                        )}
                      </div>
                    </div>
                    <div className="chat__message-meta">
                      <time
                        dateTime={msg.createdAt}
                        className="chat__message-time"
                      >
                        {formatMessageTime(msg.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
                {isSending && (
                  <li className="chat__message chat__message_assistant chat__message_thinking">
                    Thinking…
                  </li>
                )}
                <li ref={messagesEndRef} />
              </ul>
            )}

            <div className="chat__input-bar">
              <textarea
                className="chat__input"
                placeholder={isSending ? "Loading..." : "Ask any question"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isSending}
                onKeyDown={handleKeyDown}
              />
              <button
                className={
                  isSending ? "chat__send chat__send_sending" : "chat__send"
                }
                aria-label="Send Message"
                onClick={handleSend}
                disabled={isSending || !input.trim()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
