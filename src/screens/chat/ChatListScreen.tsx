/**
 * AI Moving — Chat List Screen
 *
 * List of conversations with movers.
 * Each row: avatar, name, last message preview, time, unread badge.
 * Tap → opens ChatScreen for that mover.
 */

import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { StatusBarMock, DREAMY_BG } from '../../design-system';
import { colors } from '../../design-system/tokens/colors';
import { TabBar, TabId } from '../home/TabBar';

/* ═══════════════════════════════════════════
   Types
   ═══════════════════════════════════════════ */

export interface ChatContact {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
}

interface ChatListScreenProps {
  contacts: ChatContact[];
  onOpenChat: (contactId: string) => void;
  onTabPress: (tab: TabId) => void;
  onBack: () => void;
  role?: 'mover' | 'sales' | 'ceo';
}

/* ═══════════════════════════════════════════
   Icons
   ═══════════════════════════════════════════ */

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="11" cy="11" r="7" stroke={colors.gray[400]} strokeWidth="1.5" />
    <path d="M21 21L16.65 16.65" stroke={colors.gray[400]} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EmptyChatIcon = () => (
  <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
    {/* Outer bubble — white with blue stroke */}
    <rect x="4" y="8" width="54" height="42" rx="16" fill="#FFFFFF" stroke={colors.primary[200]} strokeWidth="1.5" />
    {/* Tail outer */}
    <path d="M16 50L8 62L28 50Z" fill="#FFFFFF" stroke={colors.primary[200]} strokeWidth="1.5" strokeLinejoin="round" />
    {/* Inner bubble — solid primary */}
    <rect x="30" y="32" width="54" height="42" rx="16" fill={colors.primary[500]} />
    {/* Tail inner */}
    <path d="M68 74L78 84L58 74Z" fill={colors.primary[500]} />
    {/* Dots on outer bubble */}
    <circle cx="22" cy="29" r="3.5" fill={colors.primary[300]} />
    <circle cx="31" cy="29" r="3.5" fill={colors.primary[300]} />
    <circle cx="40" cy="29" r="3.5" fill={colors.primary[300]} />
    {/* Dots on inner bubble (white) */}
    <circle cx="48" cy="53" r="3.5" fill="rgba(255,255,255,0.7)" />
    <circle cx="57" cy="53" r="3.5" fill="rgba(255,255,255,0.9)" />
    <circle cx="66" cy="53" r="3.5" fill="rgba(255,255,255,0.7)" />
  </svg>
);

/* ═══════════════════════════════════════════
   Chat Row
   ═══════════════════════════════════════════ */

const ChatRow: React.FC<{
  contact: ChatContact;
  onPress: () => void;
}> = ({ contact, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [s.chatRow, pressed && { opacity: 0.85 }]}
  >
    {/* Avatar */}
    <View style={s.avatarWrap}>
      <View style={s.avatar}>
        {Platform.OS === 'web' ? (
          <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, fontWeight: 700, color: colors.primary[500] } as any}>
            {contact.name[0]}
          </span>
        ) : null}
      </View>
      {contact.online && <View style={s.onlineDot} />}
    </View>

    {/* Content */}
    <View style={s.chatContent}>
      <View style={s.chatTopRow}>
        {Platform.OS === 'web' ? (
          <>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, fontWeight: 600, color: colors.gray[900], flex: 1 } as any}>
              {contact.name}
            </span>
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12, fontWeight: 400, color: colors.gray[400] } as any}>
              {contact.time}
            </span>
          </>
        ) : null}
      </View>
      <View style={s.chatBottomRow}>
        {Platform.OS === 'web' ? (
          <span style={{
            fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, fontWeight: contact.unread > 0 ? 500 : 400,
            color: contact.unread > 0 ? colors.gray[700] : colors.gray[400],
            flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          } as any}>
            {contact.lastMessage}
          </span>
        ) : null}
        {contact.unread > 0 && (
          <View style={s.unreadBadge}>
            {Platform.OS === 'web' ? (
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 700, color: 'white' } as any}>
                {contact.unread}
              </span>
            ) : null}
          </View>
        )}
      </View>
    </View>
  </Pressable>
);

/* ═══════════════════════════════════════════
   Screen
   ═══════════════════════════════════════════ */

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  contacts,
  onOpenChat,
  onTabPress,
  onBack,
  role,
}) => {
  return (
    <SafeAreaView style={s.safeArea}>
      <View style={s.container}>
        <StatusBarMock onTimeTap={onBack} />

        {/* Header */}
        <View style={s.header}>
          {Platform.OS === 'web' ? (
            <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 24, fontWeight: 700, color: colors.gray[900] } as any}>
              Messages
            </span>
          ) : null}
        </View>

        {/* Search bar — matches Input component style */}
        <View style={s.searchWrap}>
          <View style={s.searchBar as any}>
            <SearchIcon />
            {Platform.OS === 'web' ? (
              <span style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 16,
                fontWeight: 400,
                color: colors.gray[400],
                marginLeft: 10,
                flex: 1,
              } as any}>
                Search conversations
              </span>
            ) : null}
          </View>
        </View>

        {/* Chat list */}
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
          {contacts.length === 0 ? (
            <View style={s.emptyState}>
              {Platform.OS === 'web' ? (
                <>
                  <EmptyChatIcon />
                  <View style={{ height: 20 }} />
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 17,
                    fontWeight: 600,
                    color: colors.gray[900],
                    textAlign: 'center',
                    display: 'block',
                  } as any}>
                    No conversations yet
                  </span>
                  <View style={{ height: 8 }} />
                  <span style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    fontSize: 14,
                    fontWeight: 400,
                    color: colors.gray[400],
                    textAlign: 'center',
                    display: 'block',
                    lineHeight: 1.5,
                  } as any}>
                    {role === 'mover' ? 'Your client chats will appear here once a job is assigned' : role === 'sales' ? 'Chats with clients and movers will appear here' : 'All team chats will be listed here'}
                  </span>
                </>
              ) : null}
            </View>
          ) : (
            <View style={s.listContent}>
              {contacts.map((c) => (
                <ChatRow key={c.id} contact={c} onPress={() => onOpenChat(c.id)} />
              ))}
            </View>
          )}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Tab bar */}
        <View style={s.tabBarWrap}>
          <TabBar active="chat" onTabPress={onTabPress} role={role} />
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
  scroll: { flex: 1 },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },

  /* Search — matches Input component: minHeight 62, borderRadius 12, white bg, shadow */
  searchWrap: { paddingHorizontal: 16, paddingBottom: 12, paddingTop: 0 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 62,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    
  },

  /* Chat row — white card */
  listContent: { paddingHorizontal: 16, paddingTop: 4 },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 8,
    ...(Platform.OS === 'web' ? {
      
    } : {
      elevation: 1,
    }),
  } as any,

  avatarWrap: { position: 'relative' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.success[500],
    borderWidth: 2,
    borderColor: colors.white,
  },

  chatContent: { flex: 1, marginLeft: 12 },
  chatTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 3 },
  chatBottomRow: { flexDirection: 'row', alignItems: 'center' },

  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },

  tabBarWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
