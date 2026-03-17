-- ============================================================
-- TALESROL — Schema completo
-- Última actualización: moderación de salas + reportes
-- ============================================================

-- EXTENSIONES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMS
CREATE TYPE user_role AS ENUM ('player', 'master', 'admin');
CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');
-- Nota: el enum de notifications (type) se crea aparte si hace falta

-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id             uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username       text NOT NULL UNIQUE,
  display_name   text,
  avatar_url     text,
  banner_url     text,
  bio            text,
  role           user_role DEFAULT 'player',
  points         integer DEFAULT 0,
  level          integer DEFAULT 1,
  status         text DEFAULT 'Disponible',
  ultimo_acceso  timestamptz DEFAULT now(),
  last_ip        text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ============================================================
-- ROOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS rooms (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id            uuid REFERENCES profiles(id),
  title               text NOT NULL,
  slug                text NOT NULL UNIQUE,
  description         text,
  cover_url           text,
  status              text DEFAULT 'pending',
  tags                text[],
  deleted_at          timestamptz,
  -- Moderación
  moderation_status   text DEFAULT NULL,       -- 'temp_closed' | 'perm_closed'
  moderation_message  text DEFAULT NULL,
  moderated_by        uuid REFERENCES profiles(id),
  moderated_at        timestamptz DEFAULT NULL,
  created_at          timestamptz DEFAULT now(),
  updated_at          timestamptz DEFAULT now(),
  custom_css        text,
ultima_actividad  timestamptz,
);

-- ============================================================
-- TOPICS
-- ============================================================
CREATE TABLE IF NOT EXISTS topics (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id     uuid REFERENCES rooms(id) ON DELETE CASCADE,
  author_id   uuid REFERENCES profiles(id),
  title       text NOT NULL,
  is_pinned   boolean DEFAULT false,
  is_locked   boolean DEFAULT false,
  view_count  integer DEFAULT 0,
  deleted_at  timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ============================================================
-- POSTS
-- ============================================================
CREATE TABLE IF NOT EXISTS posts (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id     uuid REFERENCES topics(id) ON DELETE CASCADE,
  author_id    uuid REFERENCES profiles(id),
  character_id uuid REFERENCES characters(id),
  content      text NOT NULL,
  post_number  integer,
  dice_result  jsonb,
  edited_at    timestamptz,
  deleted_at   timestamptz,
  blocked_at   timestamptz,
  blocked_by   uuid REFERENCES profiles(id),
  created_at   timestamptz DEFAULT now()
);

-- ============================================================
-- CHARACTERS
-- ============================================================
CREATE TABLE IF NOT EXISTS characters (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name        text NOT NULL,
  avatar_url  text,
  description text,
  sheet       jsonb DEFAULT '{}',
  is_active   boolean DEFAULT true,
  deleted_at  timestamptz,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

-- ============================================================
-- CONVERSATIONS + MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS conversations (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_a     uuid NOT NULL REFERENCES profiles(id),
  user_b     uuid NOT NULL REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id       uuid NOT NULL REFERENCES profiles(id),
  content         text NOT NULL,
  image_url       text,
  read_at         timestamptz,
  deleted_at      timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS notifications (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type       text NOT NULL,   -- 'reply' | 'mention' | 'new_topic' | 'message' | 'report' | 'warning' | 'info'
  title      text NOT NULL,
  body       text,
  link       text,
  read_at    timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- REPORTS
-- ============================================================
CREATE TABLE IF NOT EXISTS reports (
  id             uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id    uuid NOT NULL REFERENCES profiles(id),
  target_post_id uuid REFERENCES posts(id),
  target_user_id uuid REFERENCES profiles(id),
  target_room_id uuid REFERENCES rooms(id),   -- ← añadido
  reason         text NOT NULL,
  status         report_status DEFAULT 'pending',
  notes          text,
  resolved_by    uuid REFERENCES profiles(id),
  updated_at     timestamptz DEFAULT now(),   -- ← añadido
  created_at     timestamptz DEFAULT now()
);

-- ============================================================
-- DICE TYPES
-- ============================================================
CREATE TABLE IF NOT EXISTS dice_types (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  faces       integer NOT NULL,
  description text,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- ============================================================
-- TAGS
-- ============================================================
CREATE TABLE IF NOT EXISTS tags (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL UNIQUE,
  color      text NOT NULL DEFAULT '#C10606',
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- ANNOUNCEMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS announcements (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title      text NOT NULL,
  content    text NOT NULL,
  author_id  uuid REFERENCES profiles(id),
  is_pinned  boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================================
-- BADGES + USER_BADGES
-- ============================================================
CREATE TABLE IF NOT EXISTS badges (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          text NOT NULL,
  description   text,
  icon_url      text,
  condition_key text
);

CREATE TABLE IF NOT EXISTS user_badges (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id   uuid REFERENCES badges(id) ON DELETE CASCADE,
  granted_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- POINT TRANSACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS point_transactions (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    uuid NOT NULL REFERENCES profiles(id),
  amount     integer NOT NULL,
  reason     text,
  granted_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- TOPIC + ROOM PARTICIPANTS
-- ============================================================
CREATE TABLE IF NOT EXISTS topic_participants (
  topic_id   uuid REFERENCES topics(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (topic_id, user_id)
);

CREATE TABLE IF NOT EXISTS room_participants (
  room_id    uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- ============================================================
-- ROOM PERMISSIONS (RBAC — pendiente de implementar)
-- ============================================================
CREATE TABLE IF NOT EXISTS room_permissions (
  id         uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id    uuid REFERENCES rooms(id) ON DELETE CASCADE,
  user_id    uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role       text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- ============================================================
-- BANNED IPS
-- ============================================================
CREATE TABLE IF NOT EXISTS banned_ips (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text NOT NULL UNIQUE,
  banned_by  uuid REFERENCES profiles(id),
  reason     text,
  created_at timestamptz DEFAULT now()
);

-- ============================================================
-- REALTIME
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;



-- ======================= --
privacy_characters boolean DEFAULT true,
privacy_rooms      boolean DEFAULT true,
privacy_posts      boolean DEFAULT true,



---- ======== ----
-- ============================================================
-- TALESROL — Sistema de badges y puntos
-- ============================================================

-- Tabla de definiciones de badges
CREATE TABLE IF NOT EXISTS badge_definitions (
  id          text PRIMARY KEY,  -- slug: 'primer_post', 'narrador', etc.
  name        text NOT NULL,
  description text NOT NULL,
  icon        text NOT NULL,     -- nombre del heroicon a usar
  category    text NOT NULL,     -- 'posts' | 'salas' | 'personajes' | 'antiguedad' | 'especial'
  threshold   integer NOT NULL,  -- valor necesario para desbloquear
  points_reward integer DEFAULT 0,
  color       text DEFAULT 'default',  -- 'default' | 'gold' | 'purple' | 'crimson'
  is_secret   boolean DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

-- Tabla de badges desbloqueados por usuario
CREATE TABLE IF NOT EXISTS user_badges (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id     text NOT NULL REFERENCES badge_definitions(id) ON DELETE CASCADE,
  unlocked_at  timestamptz DEFAULT now(),
  is_visible   boolean DEFAULT true,  -- el usuario elige si mostrarlo
  UNIQUE (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge ON user_badges(badge_id);

-- RLS
ALTER TABLE badge_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "badge_definitions_select" ON badge_definitions FOR SELECT USING (true);
CREATE POLICY "user_badges_select" ON user_badges FOR SELECT USING (true);
CREATE POLICY "user_badges_update" ON user_badges
  FOR UPDATE USING (user_id = auth.uid());

-- ============================================================
-- DEFINICIONES DE BADGES
-- ============================================================

INSERT INTO badge_definitions (id, name, description, icon, category, threshold, points_reward, color) VALUES

-- Posts
('primer_post',    'Primer trazo',      'Publicaste tu primer post.',                     'PencilIcon',        'posts', 1,   10,  'default'),
('escribano',      'Escribano',         'Alcanzaste 10 posts.',                           'DocumentTextIcon',  'posts', 10,  25,  'default'),
('narrador',       'Narrador',          'Alcanzaste 50 posts.',                           'BookOpenIcon',      'posts', 50,  50,  'default'),
('cronista',       'Cronista',          'Alcanzaste 100 posts.',                          'ArchiveBoxIcon',    'posts', 100, 100, 'gold'),
('leyenda',        'Leyenda',           'Alcanzaste 500 posts.',                          'SparklesIcon',      'posts', 500, 250, 'gold'),

-- Salas
('primera_sala',   'Primer escenario',  'Creaste tu primera sala.',                       'MapIcon',           'salas', 1,  20,  'default'),
('arquitecto',     'Arquitecto',        'Creaste 3 salas.',                               'BuildingLibraryIcon','salas', 3,  50,  'default'),
('maestro_salas',  'Maestro de mundos', 'Creaste 10 salas.',                              'GlobeAltIcon',      'salas', 10, 150, 'gold'),

-- Personajes
('primer_personaje','Primer alter ego', 'Creaste tu primer personaje.',                   'UserIcon',          'personajes', 1,  15,  'default'),
('interprete',     'Intérprete',        'Creaste 3 personajes.',                          'UsersIcon',         'personajes', 3,  40,  'default'),
('multifaceta',    'Multifaceta',       'Creaste 10 personajes.',                         'UserGroupIcon',     'personajes', 10, 100, 'purple'),

-- Antigüedad
('veterano_mes',   'Veterano',          'Llevas más de 30 días en TalesRol.',             'ClockIcon',         'antiguedad', 30,  20,  'default'),
('veterano_año',   'Antiguo',           'Llevas más de un año en TalesRol.',              'CalendarIcon',      'antiguedad', 365, 100, 'gold'),

-- Especiales
('fundador',       'Fundador',          'Eres parte del equipo fundador de TalesRol.',    'ShieldCheckIcon',   'especial', 0,   0,   'crimson')

ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- FUNCIÓN: otorgar puntos y comprobar badges
-- ============================================================

CREATE OR REPLACE FUNCTION award_points_and_badges(
  p_user_id uuid,
  p_action  text  -- 'post' | 'sala' | 'personaje'
)
RETURNS void AS $$
DECLARE
  v_points_to_add  integer;
  v_post_count     integer;
  v_sala_count     integer;
  v_char_count     integer;
  v_days_since     integer;
  v_badge          record;
BEGIN
  -- Puntos por acción
  v_points_to_add := CASE p_action
    WHEN 'post'      THEN 5
    WHEN 'sala'      THEN 20
    WHEN 'personaje' THEN 10
    ELSE 0
  END;

  UPDATE profiles SET points = points + v_points_to_add WHERE id = p_user_id;

  -- Contadores actuales
  SELECT COUNT(*) INTO v_post_count
    FROM posts WHERE author_id = p_user_id AND deleted_at IS NULL;

  SELECT COUNT(*) INTO v_sala_count
    FROM rooms WHERE owner_id = p_user_id AND deleted_at IS NULL;

  SELECT COUNT(*) INTO v_char_count
    FROM characters WHERE user_id = p_user_id AND deleted_at IS NULL AND is_active = true;

  SELECT EXTRACT(DAY FROM now() - created_at)::integer INTO v_days_since
    FROM profiles WHERE id = p_user_id;

  -- Comprobar badges de posts
  FOR v_badge IN SELECT * FROM badge_definitions WHERE category = 'posts' LOOP
    IF v_post_count >= v_badge.threshold THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;

  -- Comprobar badges de salas
  FOR v_badge IN SELECT * FROM badge_definitions WHERE category = 'salas' LOOP
    IF v_sala_count >= v_badge.threshold THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;

  -- Comprobar badges de personajes
  FOR v_badge IN SELECT * FROM badge_definitions WHERE category = 'personajes' LOOP
    IF v_char_count >= v_badge.threshold THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;

  -- Comprobar badges de antigüedad
  FOR v_badge IN SELECT * FROM badge_definitions WHERE category = 'antiguedad' LOOP
    IF v_days_since >= v_badge.threshold THEN
      INSERT INTO user_badges (user_id, badge_id)
      VALUES (p_user_id, v_badge.id)
      ON CONFLICT (user_id, badge_id) DO NOTHING;
    END IF;
  END LOOP;

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- ============================================================
-- TALESROL — Fichas de personaje por sala
-- ============================================================

-- Plantilla de ficha de una sala (una por sala)
CREATE TABLE room_sheet_templates (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id)
);

-- Campos de la plantilla
-- type: 'text_short' | 'text_long' | 'number' | 'skill_list' | 'image_avatar' | 'image_header'
CREATE TABLE room_sheet_fields (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES room_sheet_templates(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('text_short','text_long','number','skill_list','image_avatar','image_header')),
  is_base     BOOLEAN NOT NULL DEFAULT false,   -- true = campo base no borrable
  position    INT NOT NULL DEFAULT 0,
  min_value   INT,                               -- solo para type='number'
  max_value   INT,                               -- solo para type='number'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ficha de un jugador en una sala (una por usuario por sala)
CREATE TABLE room_sheets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (room_id, user_id)
);

-- Valores de cada campo de una ficha
CREATE TABLE room_sheet_values (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sheet_id   UUID NOT NULL REFERENCES room_sheets(id) ON DELETE CASCADE,
  field_id   UUID NOT NULL REFERENCES room_sheet_fields(id) ON DELETE CASCADE,
  value_text TEXT,                               -- text_short, text_long, image_avatar, image_header
  value_num  INT,                                -- number
  value_list JSONB,                              -- skill_list: ["Espada", "Magia", ...]
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (sheet_id, field_id)
);

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE room_sheet_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_sheet_fields    ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_sheets          ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_sheet_values    ENABLE ROW LEVEL SECURITY;

-- room_sheet_templates: lectura pública, escritura solo owner/admin
CREATE POLICY "templates_select" ON room_sheet_templates FOR SELECT USING (true);
CREATE POLICY "templates_insert" ON room_sheet_templates FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "templates_update" ON room_sheet_templates FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "templates_delete" ON room_sheet_templates FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- room_sheet_fields: lectura pública, escritura solo owner/admin
CREATE POLICY "fields_select" ON room_sheet_fields FOR SELECT USING (true);
CREATE POLICY "fields_insert" ON room_sheet_fields FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_sheet_templates t
      JOIN rooms r ON r.id = t.room_id
      WHERE t.id = template_id AND (r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );
CREATE POLICY "fields_update" ON room_sheet_fields FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM room_sheet_templates t
      JOIN rooms r ON r.id = t.room_id
      WHERE t.id = template_id AND (r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );
CREATE POLICY "fields_delete" ON room_sheet_fields FOR DELETE
  USING (
    is_base = false AND
    EXISTS (
      SELECT 1 FROM room_sheet_templates t
      JOIN rooms r ON r.id = t.room_id
      WHERE t.id = template_id AND (r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

-- room_sheets: cada usuario ve/edita la suya; owner/admin ven todas
CREATE POLICY "sheets_select" ON room_sheets FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "sheets_insert" ON room_sheets FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY "sheets_update" ON room_sheets FOR UPDATE
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- room_sheet_values: misma lógica que sheets
CREATE POLICY "values_select" ON room_sheet_values FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM room_sheets s
      WHERE s.id = sheet_id AND (
        s.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM rooms WHERE id = s.room_id AND owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );
CREATE POLICY "values_insert" ON room_sheet_values FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM room_sheets s
      WHERE s.id = sheet_id AND (
        s.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM rooms WHERE id = s.room_id AND owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );
CREATE POLICY "values_update" ON room_sheet_values FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM room_sheets s
      WHERE s.id = sheet_id AND (
        s.user_id = auth.uid()
        OR EXISTS (SELECT 1 FROM rooms WHERE id = s.room_id AND owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );

-- ============================================================
-- Campos base por defecto (se insertan al crear la plantilla)
-- Se hace desde el server action, no con triggers SQL
-- ============================================================

-- Eliminar la policy anterior que bloqueaba campos base
DROP POLICY IF EXISTS "fields_delete" ON room_sheet_fields;

-- Nueva policy: el owner/admin puede borrar cualquier campo, incluidos los base
CREATE POLICY "fields_delete" ON room_sheet_fields FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM room_sheet_templates t
      JOIN rooms r ON r.id = t.room_id
      WHERE t.id = template_id AND (
        r.owner_id = auth.uid()
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
      )
    )
  );




  -- ====================== --

  -- ============================================================
-- TALESROL — Wiki por sala
-- ============================================================

-- Páginas de la wiki
CREATE TABLE wiki_pages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  slug         TEXT NOT NULL,                        -- URL amigable: "lore-del-mundo"
  title        TEXT NOT NULL,
  content      TEXT NOT NULL DEFAULT '',             -- HTML sanitizado
  excerpt      TEXT,                                 -- resumen automático (primeros 200 chars)
  is_home      BOOLEAN NOT NULL DEFAULT false,       -- página de portada
  categories   TEXT[] NOT NULL DEFAULT '{}',         -- etiquetas/categorías
  author_id    UUID NOT NULL REFERENCES profiles(id),
  last_editor_id UUID REFERENCES profiles(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at   TIMESTAMPTZ,
  UNIQUE (room_id, slug)
);

-- Historial de versiones
CREATE TABLE wiki_page_versions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id    UUID NOT NULL REFERENCES wiki_pages(id) ON DELETE CASCADE,
  content    TEXT NOT NULL,
  title      TEXT NOT NULL,
  editor_id  UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para búsqueda de texto completo
CREATE INDEX wiki_pages_search_idx ON wiki_pages
  USING gin(to_tsvector('spanish', title || ' ' || coalesce(content, '')));

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE wiki_pages         ENABLE ROW LEVEL SECURITY;
ALTER TABLE wiki_page_versions ENABLE ROW LEVEL SECURITY;

-- Lectura: cualquiera puede leer páginas no eliminadas
CREATE POLICY "wiki_pages_select" ON wiki_pages FOR SELECT
  USING (deleted_at IS NULL);

-- Insertar: owner, admin, o codirector de la sala
CREATE POLICY "wiki_pages_insert" ON wiki_pages FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM room_members WHERE room_id = wiki_pages.room_id AND user_id = auth.uid() AND rank = 'codirector')
  );

-- Actualizar: misma lógica
CREATE POLICY "wiki_pages_update" ON wiki_pages FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM room_members WHERE room_id = wiki_pages.room_id AND user_id = auth.uid() AND rank = 'codirector')
  );

-- Eliminar (soft): misma lógica
CREATE POLICY "wiki_pages_delete" ON wiki_pages FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM rooms WHERE id = room_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    OR EXISTS (SELECT 1 FROM room_members WHERE room_id = wiki_pages.room_id AND user_id = auth.uid() AND rank = 'codirector')
  );

-- Versiones: lectura pública, inserción solo editores
CREATE POLICY "wiki_versions_select" ON wiki_page_versions FOR SELECT USING (true);
CREATE POLICY "wiki_versions_insert" ON wiki_page_versions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM wiki_pages p
      WHERE p.id = page_id AND (
        EXISTS (SELECT 1 FROM rooms WHERE id = p.room_id AND owner_id = auth.uid())
        OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
        OR EXISTS (SELECT 1 FROM room_members WHERE room_id = p.room_id AND user_id = auth.uid() AND rank = 'codirector')
      )
    )
  );








  CREATE TABLE moderation_logs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_id    uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action      text NOT NULL,
  target_type text NOT NULL CHECK (target_type IN ('user', 'room', 'post', 'ip', 'system')),
  target_id   text,
  target_label text,
  notes       text,
  created_at  timestamptz DEFAULT now()
);

-- Solo admins pueden leer, nadie puede insertar/editar/borrar desde el cliente
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins pueden leer logs" ON moderation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );