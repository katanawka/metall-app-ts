
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  sender_id: string;
  sender_email: string;
  content: string;
  created_at: string;
}

export interface ChatUser {
  id: string;
  email: string;
  online: boolean;
  lastSeen?: string;
}

class ChatService {
  private channel: any;
  private roomId = 'global_chat';
  private isSubscribed = false;
  private databaseSubscription: any = null;

  init() {
    if (!this.channel) {
      this.channel = supabase.channel(`room:${this.roomId}`);
    }
    return this;
  }

  async loadPreviousMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true }) as { data: Message[] | null, error: any };
      
      if (error) {
        console.error('Error loading messages:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Failed to load messages:', error);
      return [];
    }
  }

  subscribeToRealtimeMessages(callback: (message: Message) => void) {
    this.unsubscribeFromRealtimeMessages();
    
    console.log('Subscribing to realtime messages');
    
    this.databaseSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages' 
        }, 
        (payload: { new: Message }) => {
          console.log('Received new message from database:', payload.new);
          callback(payload.new);
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return this;
  }

  unsubscribeFromRealtimeMessages() {
    if (this.databaseSubscription) {
      console.log('Unsubscribing from realtime messages');
      supabase.removeChannel(this.databaseSubscription);
      this.databaseSubscription = null;
    }
    return this;
  }

  subscribeToMessages(callback: (message: Message) => void) {
    if (!this.channel) this.init();

    this.channel.on('broadcast', { event: 'message' }, (payload: { message: Message }) => {
      console.log('Received message from broadcast channel:', payload.message);
      callback(payload.message);
    });

    return this;
  }

  async sendMessage(userId: string, userEmail: string, content: string) {
    if (!this.channel) this.init();
    
    this.ensureSubscribed();

    const message: Message = {
      id: crypto.randomUUID(),
      sender_id: userId,
      sender_email: userEmail,
      content,
      created_at: new Date().toISOString()
    };

    try {
      console.log('Saving message to database:', message);
      const { error } = await supabase
        .from('messages')
        .insert([message]) as { error: any };
        
      if (error) {
        console.error('Error saving message to database:', error);
      }
    } catch (error) {
      console.error('Failed to save message:', error);
    }

    await this.channel.send({
      type: 'broadcast',
      event: 'message',
      message
    });

    return message;
  }

  trackPresence(userId: string, userEmail: string) {
    if (!this.channel) this.init();
    
    this.channel.on('presence', { event: 'sync' }, () => {
    });

    this.ensureSubscribed(async () => {
      await this.channel.track({
        user_id: userId,
        email: userEmail,
        online_at: new Date().toISOString(),
      });
    });
    
    return this;
  }

  subscribeToPresence(callback: (users: Record<string, ChatUser[]>) => void) {
    if (!this.channel) this.init();

    this.channel.on('presence', { event: 'sync' }, () => {
      const state = this.channel.presenceState();
      callback(state);
    });

    return this;
  }

  ensureSubscribed(onSubscribed?: () => Promise<void> | void) {
    if (!this.isSubscribed && this.channel) {
      this.isSubscribed = true;
      
      this.channel.subscribe(async (status: string) => {
        console.log('Channel subscription status:', status);
        if (status === 'SUBSCRIBED' && onSubscribed) {
          await onSubscribed();
        }
      });
    }
    
    return this;
  }

  unsubscribe() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
      this.isSubscribed = false;
    }
    this.unsubscribeFromRealtimeMessages();
  }
}

export default new ChatService();
