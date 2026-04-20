// tests/helpers.ts
// Credenciales y utilidades compartidas por todos los tests

export const ADMIN = {
  email: 'veinticuatro0792@gmail.com',
  password: 'pilipp22',
  username: 'admin',         // ajusta si el username es diferente
};

export const TEST_USER = {
  email: `testbot_${Date.now()}@mailinator.com`,
  password: 'TestBot1234!',
  username: `testbot${Date.now()}`,
};

// Sala de prueba que se crea durante los tests
export const TEST_ROOM = {
  name: 'Sala de prueba automatizada',
  description: 'Sala creada por el bot de pruebas. Se puede borrar.',
  slug: `sala-prueba-${Date.now()}`,
};

export const TEST_TOPIC = {
  title: 'Tema de prueba automatizada',
  content: 'Este post fue creado por el bot de pruebas automáticas de TalesRol.',
};

export const TEST_CHARACTER = {
  name: 'Personaje Bot',
  description: 'Personaje creado automáticamente para tests.',
};

export const TEST_WIKI = {
  title: 'Página wiki de prueba',
  content: 'Contenido de prueba para la wiki, creado automáticamente.',
  category: 'Pruebas',
};