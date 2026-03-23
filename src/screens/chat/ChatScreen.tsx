/**
 * AI Moving — Chat Screen (Messenger)
 *
 * iMessage/WhatsApp style: colored bubbles, timestamps,
 * mover avatar on incoming, text input + send button.
 * Demo messages pre-loaded, user can type new ones.
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBarMock, Navbar, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface ChatMessage {
  id: string;
  text: string;
  fromMe: boolean;
  time: string;
}

interface ChatScreenProps {
  contactName: string;
  contactOnline: boolean;
  initialMessages: ChatMessage[];
  onBack: () => void;
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const SendIcon = ({ active }: { active: boolean }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke={active ? 'white' : colors.gray[300]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={active ? 'white' : colors.gray[300]} strokeWidth="1.8" strokeLinejoin="round" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 482.6 482.6" fill="none">
    <path d="M98.339 320.8c47.6 56.9 104.9 101.7 170.3 133.4 24.9 11.8 58.2 25.8 95.3 28.2 2.3.1 4.5.2 6.8.2 24.9 0 44.9-8.6 61.2-26.3.1-.1.3-.3.4-.5 5.8-7 12.4-13.3 19.3-20 4.7-4.5 9.5-9.2 14.1-14 21.3-22.2 21.3-50.4-.2-71.9l-60.1-60.1c-10.2-10.6-22.4-16.2-35.2-16.2-12.8 0-25.1 5.6-35.6 16.1l-35.8 35.8c-3.3-1.9-6.7-3.6-9.9-5.2-4-2-7.7-3.9-11-6-32.6-20.7-62.2-47.7-90.5-82.4-14.3-18.1-23.9-33.3-30.6-48.8 9.4-8.5 18.2-17.4 26.7-26.1 3-3.1 6.1-6.2 9.2-9.3 10.8-10.8 16.6-23.3 16.6-36s-5.7-25.2-16.6-36l-29.8-29.8c-3.5-3.5-6.8-6.9-10.2-10.4-6.6-6.8-13.5-13.8-20.3-20.1-10.3-10.1-22.4-15.4-35.2-15.4-12.7 0-24.9 5.3-35.6 15.5l-37.4 37.4c-13.6 13.6-21.3 30.1-22.9 49.2-1.9 23.9 2.5 49.3 13.9 80 14.6 39.1 41 83.2 80.2 130.3zM25.739 104.2c1.2-13.3 6.3-24.4 15.9-34l37.2-37.2c5.8-5.6 12.2-8.5 18.4-8.5 6.1 0 12.3 2.9 18 8.7 6.7 6.2 13 12.7 19.8 19.6 3.4 3.5 6.9 7 10.4 10.6l29.8 29.8c6.2 6.2 9.4 12.5 9.4 18.7s-3.2 12.5-9.4 18.7c-3.1 3.1-6.2 6.3-9.3 9.4-9.3 9.4-18 18.3-27.6 26.8-.2.2-.3.3-.5.5-8.3 8.3-7 16.2-5 22.2.1.3.2.5.3.8 7.7 18.5 18.4 36.1 35.1 57.1 30 37 61.6 65.7 96.4 87.8 4.3 2.8 8.9 5 13.2 7.2 4 2 7.7 3.9 11 6 .4.2.7.4 1.1.6 3.3 1.7 6.5 2.5 9.7 2.5 8 0 13.2-5.1 14.9-6.8l37.4-37.4c5.8-5.8 12.1-8.9 18.3-8.9 7.6 0 13.8 4.7 17.7 8.9l60.3 60.2c12 12 11.9 25-.3 37.7-4.2 4.5-8.6 8.8-13.3 13.3-7 6.8-14.3 13.8-20.9 21.7-11.5 12.4-25.2 18.2-42.9 18.2-1.7 0-3.5-.1-5.2-.2-32.8-2.1-63.3-14.9-86.2-25.8-62.2-30.1-116.8-72.8-162.1-127-37.3-44.9-62.4-86.7-79-131.5C28.039 146.4 24.139 124.3 25.739 104.2z" fill={colors.gray[500]}/>
  </svg>
);

/* ═══════════════════════════════════════════
   Message Bubble
   ═══════════════════════════════════════════ */

const Bubble: React.FC<{ msg: ChatMessage; showAvatar: boolean; contactName: string }> = ({ msg, showAvatar, contactName }) => {
  const isMe = msg.fromMe;

  return (
    <View style={[s.bubbleRow, isMe ? s.bubbleRowMe : s.bubbleRowThem]}>
      {/* Mover avatar on incoming */}
      {!isMe && showAvatar ? (
        <View style={s.bubbleAvatar}>
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: colors.primary[500] } as any}>
              {contactName[0]}
            </span>
          ) : null}
        </View>
      ) : !isMe ? (
        <View style={{ width: 28 }} />
      ) : null}

      <View style={[
        s.bubble,
        isMe ? s.bubbleMe : s.bubbleThem,
      ]}>
        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 400,
            color: isMe ? 'white' : colors.gray[900],
            lineHeight: '20px',
          } as any}>
            {msg.text}
          </span>
        ) : null}
        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 10, fontWeight: 400,
            color: isMe ? 'rgba(255,255,255,0.55)' : colors.gray[400],
            marginTop: 4, alignSelf: isMe ? 'flex-end' : 'flex-start',
          } as any}>
            {msg.time}
          </span>
        ) : null}
      </View>
    </View>
  );
};

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ChatScreen: React.FC<ChatScreenProps> = ({
  contactName,
  contactOnline,
  initialMessages,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll to bottom on load
    setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: false }), 100);
  }, []);

  const handleSend = () => {
    const text = inputText.trim();
    if (!text) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      text,
      fromMe: true,
      time: timeStr,
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');

    setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: true }), 50);

    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        "Thanks! That's really helpful to know.",
        "Great, I'll make sure everything is ready.",
        "Awesome, appreciate the update!",
        "Sounds good, see you then!",
        "Perfect, thank you so much!",
      ];
      const reply: ChatMessage = {
        id: `msg_${Date.now()}_reply`,
        text: replies[Math.floor(Math.random() * replies.length)],
        fromMe: false,
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, reply]);
      setTimeout(() => scrollRef.current?.scrollToEnd?.({ animated: true }), 50);
    }, 1500);
  };

  // Determine which incoming messages should show avatar (first in a group)
  const shouldShowAvatar = (idx: number) => {
    if (messages[idx].fromMe) return false;
    if (idx === 0) return true;
    return messages[idx - 1].fromMe;
  };

  const hasText = inputText.trim().length > 0;

  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        {/* Custom header with contact info */}
        <View style={s.header}>
          <Pressable onPress={onBack} hitSlop={12} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
            {Platform.OS === 'web' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 18L9 12L15 6" stroke={colors.gray[900]} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : null}
          </Pressable>

          <View style={s.headerAvatar}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, fontWeight: 700, color: colors.primary[500] } as any}>
                {contactName[0]}
              </span>
            ) : null}
          </View>

          <View style={s.headerInfo}>
            {Platform.OS === 'web' ? (
              <>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.gray[900] } as any}>
                  {contactName}
                </span>
                <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: contactOnline ? colors.success[500] : colors.gray[400] } as any}>
                  {contactOnline ? 'Online' : 'Last seen recently'}
                </span>
              </>
            ) : null}
          </View>

          <Pressable hitSlop={12} style={({ pressed }) => [s.headerAction, pressed && { opacity: 0.6 }]}>
            {Platform.OS === 'web' && <PhoneIcon />}
          </Pressable>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollRef}
          style={s.messagesScroll}
          contentContainerStyle={s.messagesContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Date header */}
          <View style={s.dateHeader}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 500, color: colors.gray[400] } as any}>
                Today
              </span>
            ) : null}
          </View>

          {messages.map((msg, idx) => (
            <Bubble
              key={msg.id}
              msg={msg}
              showAvatar={shouldShowAvatar(idx)}
              contactName={contactName}
            />
          ))}
        </ScrollView>

        {/* Input bar */}
        <View style={s.inputBar}>
          <View style={s.inputWrap}>
            {Platform.OS === 'web' ? (
              <input
                type="text"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e: any) => setInputText(e.target.value)}
                onKeyDown={(e: any) => { if (e.key === 'Enter') handleSend(); }}
                style={{
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 14,
                  fontWeight: 400,
                  color: colors.gray[900],
                  border: 'none',
                  outline: 'none',
                  flex: 1,
                  backgroundColor: 'transparent',
                } as any}
              />
            ) : null}
          </View>
          <Pressable
            onPress={handleSend}
            style={({ pressed }) => [
              s.sendBtn,
              hasText ? s.sendBtnActive : s.sendBtnInactive,
              pressed && hasText && { opacity: 0.8 },
            ]}
          >
            {Platform.OS === 'web' && <SendIcon active={hasText} />}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

/* ═══════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════ */

const s = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FAFAFA' } as any,
  container: { flex: 1, backgroundColor: '#FAFAFA' },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 10,
  },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
    marginLeft: 12,
  },
  headerInfo: { flex: 1, marginLeft: 10 },
  headerAction: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },

  /* Messages */
  messagesScroll: { flex: 1, backgroundColor: '#FAFAFA' } as any,
  messagesContent: { paddingHorizontal: 12, paddingBottom: 12 },

  dateHeader: {
    alignItems: 'center', paddingVertical: 14,
  },

  bubbleRow: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-end' },
  bubbleRowMe: { justifyContent: 'flex-end' },
  bubbleRowThem: { justifyContent: 'flex-start' },

  bubbleAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary[50],
    alignItems: 'center', justifyContent: 'center',
    marginRight: 6,
  },

  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: colors.primary[500],
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    
    borderBottomLeftRadius: 4,
  } as any,

  /* Input */
  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10, paddingBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.55)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    
    borderTopWidth: 0,
  } as any,
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255,255,255,0.6)',
    
    borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    marginRight: 8,
  } as any,
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: { backgroundColor: colors.primary[500] },
  sendBtnInactive: { backgroundColor: colors.gray[100] },
});
