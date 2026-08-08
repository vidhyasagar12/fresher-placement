import { useState, useRef, useEffect } from 'react';
import './AiTips.css';

const SYSTEM_PROMPT = `You are FresherAI — a friendly, expert career advisor for fresh graduates and final-year students in India. 
You specialize in:
- Job hunting strategies for freshers
- Interview preparation (DSA, HR, aptitude, system design)
- Resume writing and optimization
- Company-specific tips (TCS, Infosys, Google, Amazon, startups,)
- Career roadmaps for software engineering, data science, and other tech roles
- LinkedIn and portfolio building
- Salary negotiation for first jobs

Keep responses:
- Practical, actionable, and specific (not generic)
- Structured with bullet points or numbered steps when helpful
- Warm and encouraging — freshers need motivation too!
- Concise but thorough (not too long)
- India-focused (company names, salary in INR, relevant platforms like Naukri, LinkedIn, etc.)`;

const SUGGESTIONS = [
  "How to crack TCS NQT 2026?",
  "Top skills freshers need in 2026",
  "How to write a resume with no experience?",
  "Tips to clear Google fresher interview",
  "Best DSA roadmap for beginners",
  "How to negotiate my first salary?",
];

export default function AiTips() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hi! I'm **FresherAI**, your personal career advisor.\n\nAsk me anything about job hunting, interview prep, resume tips, or career advice for freshers. I'm here to help you land your dream job! 🚀"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    if (isNearBottom) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const userMsg = { role: 'user', content: msg };
    const updatedMsgs = [...messages, userMsg];
    setMessages(updatedMsgs);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' });
      }
    }, 50);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...updatedMsgs
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
    ];

    const models = [
      'meta-llama/llama-3-8b-instruct:free',
      'google/gemini-2.5-flash',
      'openai/gpt-3.5-turbo',
    ];

    let response = null;
    let error = null;

    for (const model of models) {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'FresherPlacement AI',
          },
          body: JSON.stringify({
            model,
            messages: apiMessages,
            max_tokens: 500,
            temperature: 0.7,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.choices?.[0]?.message?.content) {
            response = data.choices[0].message.content;
            break;
          }
        } else {
          const err = await res.json().catch(() => ({}));
          error = err.error?.message || `HTTP ${res.status}`;
        }
      } catch (e) {
        error = e.message;
      }
    }

    setLoading(false);
    if (response) {
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } else {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `⚠️ Sorry, I'm having trouble connecting right now. Please try again in a moment.\n\n*Error: ${error || 'Unknown error'}*` }
      ]);
    }
  };

  const formatMessage = (content) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br />');
  };

  return (
    <div className="page-wrapper ai-page">
      <div className="container ai-layout">
        {/* Left Sidebar */}
        <aside className="ai-sidebar">
          <div className="ai-sidebar-header">
            <div className="ai-avatar">🤖</div>
            <div>
              <h3>FresherAI</h3>
              <span className="ai-online"><span className="dot" />Online</span>
            </div>
          </div>

          <p className="ai-sidebar-desc">
            Your personal AI career advisor — trained to help Indian freshers land their dream jobs.
          </p>

          <div className="suggestions-section">
            <p className="suggestions-label">💡 Try asking:</p>
            {SUGGESTIONS.map((s, i) => (
              <button
                key={i}
                className="suggestion-btn"
                onClick={() => sendMessage(s)}
                disabled={loading}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            className="clear-btn"
            onClick={() => setMessages([{
              role: 'assistant',
              content: "Chat cleared! Ask me anything about your placement journey 🚀"
            }])}
          >
            🗑 Clear Chat
          </button>
        </aside>

        {/* Chat Window */}
        <div className="ai-chat-window">
          {/* Chat Header */}
          <div className="ai-chat-header">
            <div className="ai-chat-header-info">
              <span className="ai-header-avatar">🤖</span>
              <div>
                <strong>FresherAI Career Advisor</strong>
                <p>Powered by OpenRouter AI</p>
              </div>
            </div>
            <span className="ai-tag">✨ AI Tips</span>
          </div>

          {/* Messages */}
          <div className="ai-messages" ref={chatContainerRef}>
            {messages.map((msg, i) => (
              <div key={i} className={`ai-message ${msg.role}`}>
                {msg.role === 'assistant' && (
                  <span className="msg-avatar">🤖</span>
                )}
                <div
                  className="msg-bubble"
                  dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                />
              </div>
            ))}

            {loading && (
              <div className="ai-message assistant">
                <span className="msg-avatar">🤖</span>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="ai-input-area">
            <textarea
              ref={inputRef}
              className="ai-input"
              placeholder="Ask anything about placements, interviews, resumes..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
              disabled={loading}
            />
            <button
              className="ai-send-btn"
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
            >
              {loading ? '...' : '➤'}
            </button>
          </div>
          <p className="ai-hint">Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
