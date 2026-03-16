export type UserRole = 'admin' | 'director' | 'master' | 'jugador' | 'miembro'
export type RoomStatus = 'active' | 'paused' | 'closed' | 'archived'
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed'
export type NotificationType = 'mention' | 'reply' | 'message' | 'report' | 'system' | 'points' | 'warning' | 'info'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  role: UserRole
  points: number
  level: number
  status: string
  last_ip: string | null
  ultimo_acceso: string
  created_at: string
  updated_at: string
}

export interface Character {
  id: string
  user_id: string
  name: string
  avatar_url: string | null
  description: string | null
  sheet: Record<string, unknown>
  is_active: boolean
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  slug: string
  title: string
  description: string | null
  cover_url: string | null
  status: RoomStatus
  owner_id: string | null
  custom_css: string | null
  tags: string[]
  moderation_status: string | null
  moderation_message: string | null
  moderated_by: string | null
  moderated_at: string | null
  ultima_actividad: string
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  room_id: string
  title: string
  starter: string | null
  author_id: string | null
  character_id: string | null
  is_pinned: boolean
  is_locked: boolean
  view_count: number
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  topic_id: string
  author_id: string | null
  character_id: string | null
  content: string
  post_number: number
  dice_result: { type: string; result: number; verified: boolean } | null
  edited_at: string | null
  blocked_at: string | null
  blocked_by: string | null
  deleted_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  body: string | null
  link: string | null
  read_at: string | null
  created_at: string
}

export interface Report {
  id: string
  reporter_id: string | null
  target_user_id: string | null
  target_post_id: string | null
  target_room_id: string | null
  reason: string
  status: ReportStatus
  resolved_by: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface DiceType {
  id: string
  name: string
  faces: number
  description: string | null
  created_at: string
}

export interface Tag {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  author_id: string
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface BannedIp {
  id: string
  ip_address: string
  banned_by: string | null
  reason: string | null
  created_at: string
}

export interface RoleColor {
  role: string
  color: string
  updated_at: string
}

// Tipo auxiliar para joins comunes
export interface PostWithAuthor extends Post {
  profiles: Pick<Profile, 'id' | 'username' | 'display_name' | 'avatar_url'> | null
  characters: Pick<Character, 'id' | 'name' | 'avatar_url'> | null
}

export type Database = {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Partial<Profile>; Update: Partial<Profile> }
      characters: {
        Row: Character
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Insert: any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Update: any
      }
      rooms:         { Row: Room;         Insert: Partial<Room>;         Update: Partial<Room> }
      topics:        { Row: Topic;        Insert: Partial<Topic>;        Update: Partial<Topic> }
      posts:         { Row: Post;         Insert: Partial<Post>;         Update: Partial<Post> }
      notifications: { Row: Notification; Insert: Partial<Notification>; Update: Partial<Notification> }
      reports:       { Row: Report;       Insert: Partial<Report>;       Update: Partial<Report> }
      dice_types:    { Row: DiceType;     Insert: Partial<DiceType>;     Update: Partial<DiceType> }
      tags:          { Row: Tag;          Insert: Partial<Tag>;          Update: Partial<Tag> }
      announcements: { Row: Announcement; Insert: Partial<Announcement>; Update: Partial<Announcement> }
      banned_ips:    { Row: BannedIp;     Insert: Partial<BannedIp>;     Update: Partial<BannedIp> }
      role_colors:   { Row: RoleColor;    Insert: Partial<RoleColor>;    Update: Partial<RoleColor> }
    }
  }
}