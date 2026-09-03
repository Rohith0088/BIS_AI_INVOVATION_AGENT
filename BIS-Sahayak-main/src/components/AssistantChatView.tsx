import React, { useState, useRef, useEffect } from 'react';
import { AppMode, ChatMessage, StandardItem } from '../types';
import { BIS_STANDARDS } from '../data/bisDatabase';

export type RagCitation = {
  source_id?: string;
  title?: string;
  url?: string;
  score?: number;
  retrieved_at?: string;
  clause_ref?: string | null;
  text?: string;
};

export type RagResponse = {
  status: 'ANSWERED' | 'INSUFFICIENT_EVIDENCE';
  answer: string;
  citations: RagCitation[];
  confidence?: number;
};

export async function askBISRag(
  question: string,
  mode: 'consumer' | 'industry' = 'consumer',
): Promise<RagResponse> {
  const response = await fetch('/api/gemini/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: question.trim(),
      mode,
      history: [],
    }),
  });

  if (!response.ok) {
    throw new Error(`RAG API returned HTTP ${response.status}`);
  }

  const data = await response.json();
  return {
    status: 'ANSWERED',
    answer: data.text || data.answer || '',
    citations: data.citations || [],
    confidence: typeof data.confidence === 'number' ? data.confidence : 0.9,
  };
}

async function saveChatMessage(payload: {
  conversationId: string;
  userId: number;
  sender: 'user' | 'assistant';
  messageText: string;
  mode: 'consumer' | 'industry';
  confidence?: string;
  citedClauses?: unknown;
  sourceCard?: unknown;
  suggestedActions?: unknown;
}) {
  const response = await fetch('/api/chat/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Chat message save failed with HTTP ${response.status}`);
  }
}

interface AssistantChatViewProps {
  appMode: AppMode;
  userId?: number;
  initialPrompt?: string;
  onOpenStandardModal: (standard: StandardItem) => void;
  onOpenCompareModal: (isCode: string) => void;
  onOpenExcerptModal: (isCode: string) => void;
  onOpenLicenceVerifier: () => void;
  onOpenFeedback: () => void;
}

export const AssistantChatView: React.FC<AssistantChatViewProps> = ({
  appMode,
  userId,
  initialPrompt,
  onOpenStandardModal,
  onOpenCompareModal,
  onOpenExcerptModal,
  onOpenLicenceVerifier,
  onOpenFeedback,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const conversationIdRef = useRef((() => {
    const storageKey = userId ? `bis_active_conversation_${userId}` : 'bis_active_conversation_guest';
    const storedConversationId = sessionStorage.getItem(storageKey);
    const conversationId = storedConversationId || crypto.randomUUID();
    sessionStorage.setItem(storageKey, conversationId);
    return conversationId;
  })());
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial-user-msg',
      sender: 'user',
      text: 'What are the standard requirements for packaged drinking water in India?',
      timestamp: '10:42 AM',
    },
    {
      id: 'initial-ai-msg',
      sender: 'assistant',
      text: `In India, packaged drinking water (other than natural mineral water) is strictly regulated by the Bureau of Indian Standards (BIS) under **IS 14543**. It is a mandatory certification product under Quality Control Orders (QCOs).\n\nThe standard specifies rigorous requirements for physical, chemical, and microbiological parameters to ensure human safety. Key requirements include mandatory multi-stage treatment (reverse osmosis, ozonation, UV treatment), zero tolerance for coliform bacteria and pathogens, and strict limits on pesticide residues (max 0.0001 mg/L individual, max 0.0005 mg/L total).`,
      timestamp: '10:42 AM',
      confidence: 'high',
      intent: 'Standards guidance',
      warnings: ['Informational explanation only. Confirm current requirements in the applicable BIS notification before making a compliance decision.'],
      nextActions: ['Review the cited clauses', 'Confirm the applicable product scope', 'Use the official BIS route for certification decisions'],
      citedClauses: [
        {
          clause: 'Clause 4.1',
          description: 'Treatment requirements (filtration, reverse osmosis, ozonation, and UV disinfection).',
        },
        {
          clause: 'Table 2 & 3',
          description: 'Chemical requirements (toxic substances, bromate limits, and pesticide residues).',
        },
        {
          clause: 'Table 4',
          description: 'Microbiological parameters (zero E. coli, Coliform, Pseudomonas aeruginosa).',
        },
      ],
      sourceCard: {
        isCode: 'IS 14543:2016',
        title: 'Packaged Drinking Water (Other than Natural Mineral Water) — Specification',
        category: 'Food & Agriculture / Mandatory QCO',
      },
      suggestedActions: [
        { label: 'Download Excerpt', actionType: 'download', payload: 'IS 14543:2016' },
        { label: 'Compare with ISO', actionType: 'compare', payload: 'IS 14543:2016' },
      ],
    },
  ]);

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [citations, setCitations] = useState<RagCitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeAttachment, setActiveAttachment] = useState<{ name: string; size: string; type: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    let cancelled = false;
    void fetch(`/api/chat/messages/${conversationIdRef.current}?userId=${encodeURIComponent(userId)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Chat history fetch failed with HTTP ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (cancelled || !Array.isArray(data.messages) || data.messages.length === 0) {
          return;
        }

        setMessages(data.messages.map((message: any) => ({
          id: String(message.id),
          sender: message.sender,
          text: message.message_text,
          timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          mode: message.mode,
          confidence: message.confidence || undefined,
          citedClauses: message.cited_clauses || undefined,
          sourceCard: message.source_card || undefined,
          suggestedActions: message.suggested_actions || undefined,
        })));
      })
      .catch((error) => console.warn('Unable to load chat history:', error));

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Handle initial prompt passed from Dashboard
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      void handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSendMessage = async (promptToSend?: string) => {
    const cleanQuestion = (promptToSend ?? question).trim();

    if (!cleanQuestion || loading) {
      return;
    }

    setQuestion(cleanQuestion);
    setLoading(true);
    setAnswer('');
    setCitations([]);

    const userMessageTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: cleanQuestion || `[Attached Document: ${activeAttachment?.name}]`,
      timestamp: userMessageTime,
      attachment: activeAttachment ? { ...activeAttachment } : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (userId) {
      void saveChatMessage({
        conversationId: conversationIdRef.current,
        userId,
        sender: 'user',
        messageText: userMsg.text,
        mode: appMode,
      }).catch((error) => console.warn('Unable to save user chat message:', error));
    }
    setActiveAttachment(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const result = await askBISRag(cleanQuestion, appMode);

      setAnswer(result.answer);
      setCitations(result.citations || []);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: result.answer,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        confidence: result.confidence && result.confidence >= 0.8 ? 'high' : 'medium',
        citedClauses: result.citations?.map((citation) => ({
          clause: citation.clause_ref || 'Source',
          description: citation.title || citation.text || citation.url || 'Retrieved BIS source',
        })),
        mode: appMode,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (userId) {
        void saveChatMessage({
          conversationId: conversationIdRef.current,
          userId,
          sender: 'assistant',
          messageText: result.answer,
          mode: appMode,
          confidence: result.confidence?.toString(),
          citedClauses: result.citations,
        }).catch((error) => console.warn('Unable to save assistant chat message:', error));
      }
    } catch (error) {
      console.error('BIS RAG error:', error);
      setAnswer('The BIS RAG service is unavailable. Please start the Python API and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveAttachment({
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        type: file.type || 'Document/PDF',
      });
    }
  };

  const handleSourceCardClick = (isCode: string) => {
    const found = BIS_STANDARDS.find((s) => s.isCode.toLowerCase().includes(isCode.toLowerCase().split(':')[0]));
    if (found) {
      onOpenStandardModal(found);
    } else {
      onOpenExcerptModal(isCode);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#152031]/50 via-[#081425] to-[#081425]">
      {/* Scanning Progress Bar Animation (when searching/analyzing) */}
      {loading && (
        <div className="absolute top-0 left-0 w-full h-[2.5px] bg-white/5 z-20 overflow-hidden">
          <div className="h-full bg-[#72de5c] w-1/3 animate-scanner shadow-[0_0_10px_#72de5c]" />
        </div>
      )}

      {/* Chat Messages Canvas */}
      <div className="flex-1 overflow-y-auto chat-scroll p-4 md:p-8 pb-40 flex justify-center" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
        <div className="w-full max-w-[800px] flex flex-col gap-6 pb-6" ref={messagesEndRef}>
          {/* Welcome / System Status Message */}
          <div className="text-center text-[#7b8394] font-mono-code text-xs opacity-80 my-2 py-1.5 px-4 bg-[#111c2d]/80 rounded-full border border-white/5 mx-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#72de5c] animate-pulse"></span>
            <span>Session initialized. BIS Standards Database connected.</span>
          </div>

          {/* Messages Loop */}
          {messages.map((msg) => {
            if (msg.sender === 'user') {
              return (
                <div key={msg.id} className="flex flex-col items-end gap-1 w-full animate-fadeIn">
                  <div className="bg-[#2a3548] text-[#d8e3fb] px-5 py-3.5 rounded-2xl rounded-tr-sm border border-white/10 max-w-[85%] shadow-sm font-hanken text-sm md:text-base leading-relaxed">
                    {msg.attachment && (
                      <div className="mb-2 p-2 rounded bg-[#1f2a3c] border border-white/10 flex items-center gap-2 text-xs font-mono-code text-[#ffb77a]">
                        <span className="material-symbols-outlined text-sm">attach_file</span>
                        <span className="truncate">{msg.attachment.name}</span>
                        <span className="text-[10px] text-[#7b8394]">({msg.attachment.size})</span>
                      </div>
                    )}
                    {msg.text}
                  </div>
                  <span className="font-space text-[10px] text-[#7b8394] mr-1 mt-0.5 tracking-wider font-semibold">
                    You • {msg.timestamp}
                  </span>
                </div>
              );
            }

            // Assistant Response
            return (
              <div key={msg.id} className="flex flex-col items-start gap-1 w-full animate-fadeIn">
                {/* Confidence Indicator Segmented Bar */}
                {msg.confidence && (
                  <div className="flex items-center gap-2 mb-1.5 ml-1">
                    <span className="material-symbols-outlined text-[#72de5c] text-sm">
                      verified
                    </span>
                    <span className="font-space text-[11px] text-[#72de5c] font-bold tracking-wider uppercase">
                      {msg.confidence === 'high' ? 'HIGH CONFIDENCE' : 'VERIFIED'}
                    </span>
                    <div className="flex gap-[3px] h-2.5 ml-1.5 items-center">
                      <div className="w-2.5 h-2 bg-[#72de5c] rounded-xs shadow-[0_0_8px_rgba(114,222,92,0.6)]" />
                      <div className="w-2.5 h-2 bg-[#72de5c] rounded-xs shadow-[0_0_8px_rgba(114,222,92,0.6)]" />
                      <div className="w-2.5 h-2 bg-[#72de5c] rounded-xs shadow-[0_0_8px_rgba(114,222,92,0.6)]" />
                    </div>
                  </div>
                )}

                {/* Main AI Bubble */}
                <div className="bg-[#121a28] text-[#d8e3fb] px-5 md:px-6 py-5 rounded-2xl rounded-tl-sm border border-white/10 max-w-[95%] md:max-w-[92%] shadow-md w-full relative group">
                  <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-white/10 flag-accent pl-3">
                    <span className="eyebrow">Verified response brief</span>
                    {msg.intent && <span className="px-2 py-1 rounded bg-[#1f2a3c] border border-white/10 text-[10px] font-mono-code text-[#bfc6da]">{msg.intent}</span>}
                    {msg.clarificationNeeded && <span className="px-2 py-1 rounded bg-[#d7790d]/15 border border-[#d7790d]/30 text-[10px] font-mono-code text-[#ffb77a]">Clarification needed</span>}
                  </div>
                  <div className="eyebrow mb-2">Summary</div>
                  {/* Explanation Text formatted with line breaks */}
                  <div className="font-hanken text-sm md:text-base text-[#d8e3fb] mb-4 leading-relaxed whitespace-pre-line">
                    {msg.text.split('\n').map((paragraph, pIdx) => {
                      if (!paragraph.trim()) return <div key={pIdx} className="h-2" />;
                      
                      // Highlight bold words like **IS 14543**
                      const parts = paragraph.split(/(\*\*.*?\*\*)/g);
                      return (
                        <p key={pIdx} className="mb-2 last:mb-0">
                          {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              const clean = part.slice(2, -2);
                              return (
                                <strong key={partIdx} className="font-bold text-[#ffb77a] font-space">
                                  {clean}
                                </strong>
                              );
                            }
                            return part;
                          })}
                        </p>
                      );
                    })}
                  </div>

                  {(msg.warnings && msg.warnings.length > 0) && (
                    <div className="mt-4 border border-[#f2a65a]/30 bg-[#f2a65a]/[0.07] rounded-lg p-3">
                      <div className="eyebrow text-[#f2a65a] mb-1 flex items-center gap-1.5"><span className="material-symbols-outlined text-sm">warning</span> Verification note</div>
                      {msg.warnings.map((warning, idx) => <p key={idx} className="text-xs text-[#d8c5ad] leading-relaxed">{warning}</p>)}
                    </div>
                  )}

                  {(msg.nextActions && msg.nextActions.length > 0) && (
                    <div className="mt-4">
                      <div className="eyebrow mb-2">Next actions</div>
                      <div className="grid gap-2 sm:grid-cols-3">
                        {msg.nextActions.map((action, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-[#c6c6cc] bg-[#152031]/70 border border-white/5 rounded-md p-2.5">
                            <span className="text-[#77d99b] font-mono-code">0{idx + 1}</span>{action}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cited Clauses Section */}
                  {msg.citedClauses && msg.citedClauses.length > 0 && (
                    <div className="mt-4 border-t border-white/10 pt-3">
                      <h4 className="font-space text-xs text-[#c6c6cc] mb-2.5 flex items-center gap-1.5 font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[16px] text-[#ffb77a]">
                          menu_book
                        </span>
                        CITED CLAUSES
                      </h4>
                      <ul className="flex flex-col gap-2 font-mono-code text-xs text-[#bfc6da]">
                        {msg.citedClauses.map((c, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 bg-[#152031]/70 p-2.5 rounded-md border border-white/5"
                          >
                            <span className="text-[#ffb77a] font-bold text-sm leading-none">•</span>
                            <div>
                              <span className="text-[#ffb77a] font-bold mr-1.5">{c.clause}:</span>
                              <span className="text-[#d8e3fb] font-hanken text-xs">{c.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Source Card */}
                  {msg.sourceCard && (
                    <div
                      onClick={() => handleSourceCardClick(msg.sourceCard?.isCode || '')}
                      className="mt-4 bg-[#1f2a3c] border-l-4 border-l-[#d7790d] border border-white/10 rounded-r-lg p-3.5 hover:bg-[#2a3548] transition-all cursor-pointer group/card flex justify-between items-center shadow-sm"
                    >
                      <div className="pr-2">
                        <div className="font-mono-code text-xs text-[#ffb77a] font-bold mb-0.5 flex items-center gap-2">
                          <span>{msg.sourceCard.isCode}</span>
                          {msg.sourceCard.category && (
                            <span className="text-[10px] text-[#7b8394] font-normal font-hanken">
                              • {msg.sourceCard.category}
                            </span>
                          )}
                        </div>
                        <div className="font-hanken text-xs md:text-sm text-[#d8e3fb] line-clamp-1 font-medium">
                          {msg.sourceCard.title}
                        </div>
                      </div>
                      <button
                        className="text-[#bfc6da] group-hover/card:text-[#ffb77a] p-1.5 rounded-full hover:bg-white/10 transition-colors flex-shrink-0"
                        title="View Standard Details"
                      >
                        <span className="material-symbols-outlined text-sm group-hover/card:translate-x-0.5 transition-transform">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  )}

                  {/* Action Buttons specific to this response */}
                  <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/10">
                    <button
                      onClick={() => onOpenExcerptModal(msg.sourceCard?.isCode || 'IS 14543:2016')}
                      className="px-3.5 py-1.5 rounded-full border border-white/20 text-[#d8e3fb] font-space text-xs font-bold hover:border-[#ffb77a] hover:text-[#ffb77a] transition-all flex items-center gap-1.5 bg-[#081425]/50 hover:bg-[#1f2a3c]"
                    >
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      Download Excerpt
                    </button>
                    <button
                      onClick={() => onOpenCompareModal(msg.sourceCard?.isCode || 'IS 14543:2016')}
                      className="px-3.5 py-1.5 rounded-full border border-white/20 text-[#d8e3fb] font-space text-xs font-bold hover:border-[#ffb77a] hover:text-[#ffb77a] transition-all flex items-center gap-1.5 bg-[#081425]/50 hover:bg-[#1f2a3c]"
                    >
                      <span className="material-symbols-outlined text-[15px]">compare_arrows</span>
                      Compare with ISO
                    </button>
                  </div>
                </div>

                <span className="font-space text-[10px] text-[#7b8394] ml-1 mt-0.5 tracking-wider font-semibold">
                  BIS Sahayak • {msg.timestamp}
                </span>
              </div>
            );
          })}

          {answer && (
            <div className="assistant-answer bg-[#121a28] text-[#d8e3fb] px-5 py-4 rounded-2xl border border-white/10 max-w-[800px] w-full">
              <h3 className="font-space text-sm text-[#ffb77a] uppercase tracking-wider mb-2">BIS Assistant</h3>
              <p className="font-hanken text-sm md:text-base leading-relaxed whitespace-pre-line">{answer}</p>
            </div>
          )}

          {citations.length > 0 && (
            <div className="citation-list bg-[#121a28] text-[#d8e3fb] px-5 py-4 rounded-2xl border border-white/10 max-w-[800px] w-full">
              <h4 className="font-space text-xs text-[#c6c6cc] uppercase tracking-wider mb-3">Retrieved BIS sources</h4>
              <div className="flex flex-col gap-2">
                {citations.map((citation, index) => (
                  <a
                    key={`${citation.url ?? citation.title ?? 'citation'}-${index}`}
                    href={citation.url || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#7ecbff] hover:text-[#ffb77a] underline text-sm"
                  >
                    [{index + 1}] {citation.title || 'BIS source'}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Loading Indicator Bubble */}
          {loading && (
            <div className="flex flex-col items-start gap-1 w-full animate-fadeIn">
              <div className="flex items-center gap-2 mb-1 ml-1 text-[#72de5c] font-space text-xs">
                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                <span>Searching BIS repository & Gazette QCO databases...</span>
              </div>
              <div className="bg-[#121a28] text-[#c6c6cc] px-5 py-4 rounded-2xl rounded-tl-sm border border-white/10 max-w-[80%] flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#72de5c] animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#72de5c] animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-[#72de5c] animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="font-mono-code text-xs">Formulating clause references...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area Anchored to Bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-transparent pt-6 pb-4 md:pb-6 px-4 md:px-8 z-20">
        <div className="max-w-[800px] mx-auto w-full flex flex-col gap-2.5">
          {/* Floating Next Actions Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-2 px-2">
            <button
              onClick={() => handleSendMessage('What are the mandatory testing standards for toys under IS 9873?')}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-white/20 text-[#c6c6cc] font-space text-xs font-bold hover:border-[#ffb77a] hover:text-[#ffb77a] transition-all bg-[#1f2a3c]/80 backdrop-blur-md flex-shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">toys</span>
              Find Standard for Toys
            </button>
            <button
              onClick={onOpenLicenceVerifier}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-white/20 text-[#c6c6cc] font-space text-xs font-bold hover:border-[#ffb77a] hover:text-[#ffb77a] transition-all bg-[#1f2a3c]/80 backdrop-blur-md flex-shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">verified</span>
              Verify Licence Number
            </button>
            <button
              onClick={onOpenFeedback}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-white/20 text-[#c6c6cc] font-space text-xs font-bold hover:border-[#ffb77a] hover:text-[#ffb77a] transition-all bg-[#1f2a3c]/80 backdrop-blur-md flex-shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">gavel</span>
              File Complaint
            </button>
            <button
              onClick={() => handleSendMessage('Explain concrete grade classification and durability criteria under IS 456:2000')}
              className="whitespace-nowrap px-3.5 py-1.5 rounded-full border border-white/20 text-[#c6c6cc] font-space text-xs font-bold hover:border-[#ffb77a] hover:text-[#ffb77a] transition-all bg-[#1f2a3c]/80 backdrop-blur-md flex-shrink-0 flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">foundation</span>
              IS 456 Concrete Code
            </button>
          </div>

          {/* Active Attachment Chip */}
          {activeAttachment && (
            <div className="flex items-center gap-2 p-2 bg-[#1f2a3c] rounded-lg border border-[#72de5c]/40 text-xs font-mono-code text-[#72de5c]">
              <span className="material-symbols-outlined text-sm">attach_file</span>
              <span>Attached: {activeAttachment.name} ({activeAttachment.size})</span>
              <button
                onClick={() => setActiveAttachment(null)}
                className="ml-auto text-[#c6c6cc] hover:text-white p-0.5"
              >
                <span className="material-symbols-outlined text-xs">close</span>
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
          />

          {/* Chat Input Field */}
          <div className="relative flex items-end w-full bg-[#152031] rounded-2xl md:rounded-3xl border border-white/10 shadow-lg focus-within:border-[#72de5c] focus-within:shadow-[0_0_15px_rgba(114,222,92,0.2)] transition-all overflow-hidden group">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-3.5 md:p-4 text-[#c6c6cc] hover:text-[#ffb77a] transition-colors flex-shrink-0 self-end"
              title="Attach Specification or Certificate File"
            >
              <span className="material-symbols-outlined text-[22px]">add_circle</span>
            </button>

            <textarea
              ref={textareaRef}
              value={question}
              onChange={(event) => {
                setQuestion(event.target.value);
                event.target.style.height = 'auto';
                event.target.style.height = `${Math.min(event.target.scrollHeight, 120)}px`;
              }}
              placeholder="Ask a BIS standards question..."
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSendMessage();
                }
              }}
              rows={1}
              className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-[#d8e3fb] font-hanken text-sm md:text-base py-3.5 px-2 resize-none max-h-32 min-h-[50px] w-full"
            />

            <div className="p-2 self-end">
              <button
                onClick={() => void handleSendMessage()}
                disabled={loading || (!question.trim() && !activeAttachment)}
                className={`p-2.5 md:p-3 rounded-full transition-all shadow-md flex items-center justify-center transform active:scale-95 ${
                  question.trim() || activeAttachment
                    ? 'bg-[#d7790d] text-[#141c2a] hover:bg-[#ffb77a]'
                    : 'bg-[#2a3548] text-[#7b8394] cursor-not-allowed'
                }`}
                title="Send Inquiry"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {loading ? 'sync' : 'send'}
                </span>
              </button>
            </div>
          </div>

          <div className="text-center font-space text-[10px] text-[#7b8394] opacity-70">
            Official BIS Knowledge Grounding. Verify critical specifications with Gazette QCO notifications.
          </div>
        </div>
      </div>
    </div>
  );
};
