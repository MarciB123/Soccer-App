import { useState, useRef, useEffect } from 'react'
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Animated } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../stores/auth'
import { ChatMessage } from '../../types'

const COACH_NAME = 'Coach Alex'
const COACH_INITIAL = 'A'

function TypingDots() {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: -5, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600),
        ])
      ).start()

    animate(dot1, 0)
    animate(dot2, 150)
    animate(dot3, 300)
  }, [])

  return (
    <View className="flex-row items-center gap-1" style={{ height: 20 }}>
      {[dot1, dot2, dot3].map((dot, i) => (
        <Animated.View
          key={i}
          style={{ transform: [{ translateY: dot }] }}
          className="w-2 h-2 bg-slate-400 rounded-full"
        />
      ))}
    </View>
  )
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <View className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
      {!isUser && <Text className="text-slate-500 text-xs mb-1 ml-1">{COACH_NAME}</Text>}
      <View className={`max-w-[82%] px-4 py-3 rounded-2xl ${isUser ? 'bg-brand-blue rounded-tr-sm' : 'bg-coach-card border border-coach-border rounded-tl-sm'}`}>
        <Text className={`text-sm leading-5 ${isUser ? 'text-white' : 'text-slate-700'}`}>
          {message.content}
        </Text>
      </View>
      <Text className="text-slate-600 text-xs mt-1 mx-1">
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  )
}

const STARTER_PROMPTS = [
  'What drills should I focus on today?',
  'How can I improve my first touch?',
  'What should I eat before training?',
  'How do I increase my sprint speed?',
]

export default function CoachScreen() {
  const { user, profile } = useAuthStore()
  const [input, setInput] = useState('')
  const flatListRef = useRef<FlatList>(null)
  const queryClient = useQueryClient()

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['chat-messages', user?.id],
    queryFn: async () => {
      if (!user) return []
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(100)
      if (error) throw error
      return data as ChatMessage[]
    },
    enabled: !!user,
  })

  const { mutate: sendMessage, isPending } = useMutation({
    mutationFn: async (message: string) => {
      if (!user) throw new Error('Not authenticated')
      const tempMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        user_id: user.id,
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      }
      queryClient.setQueryData(['chat-messages', user.id], (old: ChatMessage[] = []) => [...old, tempMsg])
      const { data, error } = await supabase.functions.invoke('ai-coach', { body: { message, userId: user.id } })
      if (error) throw error
      return data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['chat-messages', user?.id] }),
    onError: () => queryClient.invalidateQueries({ queryKey: ['chat-messages', user?.id] }),
  })

  const handleSend = () => {
    const msg = input.trim()
    if (!msg || isPending) return
    setInput('')
    sendMessage(msg)
  }

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100)
    }
  }, [messages])

  return (
    <SafeAreaView className="flex-1 bg-coach-bg">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1" keyboardVerticalOffset={0}>
        {/* Header */}
        <View className="px-6 py-4 border-b border-coach-border">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-brand-blue rounded-full items-center justify-center">
              <Text className="text-white font-poppins-semibold text-sm">{COACH_INITIAL}</Text>
            </View>
            <View>
              <Text className="text-slate-900 font-poppins-bold">{COACH_NAME}</Text>
              <View className="flex-row items-center gap-1">
                <View className="w-2 h-2 bg-brand-blue rounded-full" />
                <Text className="text-slate-400 text-xs">AI Soccer Coach • Always available</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Messages */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#2563EB" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <MessageBubble message={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            ListEmptyComponent={
              <View className="flex-1 pt-8 px-4">
                <View className="items-center mb-4">
                  <Ionicons name="hand-right" size={40} color="#2563EB" />
                </View>
                <Text className="text-slate-900 text-xl font-poppins-semibold text-center mb-2">
                  Hey {profile?.first_name || 'there'}!
                </Text>
                <Text className="text-slate-400 text-center text-sm mb-8 leading-5">
                  I'm {COACH_NAME}, your personal AI soccer coach. Ask me anything about drills, tactics, nutrition, or mindset.
                </Text>
                <Text className="text-slate-500 text-xs text-center mb-4">Try asking:</Text>
                <View className="gap-2">
                  {STARTER_PROMPTS.map((prompt) => (
                    <TouchableOpacity
                      key={prompt}
                      onPress={() => sendMessage(prompt)}
                      className="bg-coach-card border border-coach-border rounded-2xl px-4 py-3"
                    >
                      <Text className="text-slate-600 text-sm">{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            }
          />
        )}

        {/* Typing indicator */}
        {isPending && (
          <View className="px-4 pb-2">
            <View className="bg-coach-card border border-coach-border rounded-2xl rounded-tl-sm px-4 py-3 self-start">
              <TypingDots />
            </View>
          </View>
        )}

        {/* Input */}
        <View className="flex-row items-end px-4 py-3 border-t border-coach-border gap-2">
          <TextInput
            className="flex-1 bg-coach-card border border-coach-border text-slate-900 rounded-2xl px-4 py-3 text-sm max-h-24"
            placeholder="Ask Coach Alex..."
            placeholderTextColor="#475569"
            value={input}
            onChangeText={setInput}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            disabled={!input.trim() || isPending}
            className={`w-10 h-10 rounded-full items-center justify-center ${input.trim() && !isPending ? 'bg-brand-blue' : 'bg-coach-card border border-coach-border'}`}
          >
            <Ionicons name="arrow-up" size={18} color={input.trim() && !isPending ? 'white' : '#475569'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
