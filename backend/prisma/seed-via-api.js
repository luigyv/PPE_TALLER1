// Seed vía API: en vez de hablarle a Prisma directamente (lo cual choca con
// el resolutor de módulos de ts-node en este proyecto), este script llama a
// tu propio backend por HTTP, tal como lo haría el frontend o Thunder Client.
//
// Requisito: el backend debe estar CORRIENDO (npm run start:dev) en otra
// terminal antes de correr este script.
//
// Uso: node prisma/seed-via-api.js

const API_URL = 'http://localhost:3000';

// Usuario "de prueba" solo para poder generar un token y poder crear los
// juegos (las rutas de escritura están protegidas con JWT). Si ya existe,
// el script sigue igual con el login.
const TEST_USER = { nombre: 'Seed Script', email: 'seed@taller.com', password: 'Seed12345!' };

const juegos = [
  { nombre: 'Hollow Knight', imagen: 'https://upload.wikimedia.org/wikipedia/en/d/de/Hollow_Knight_2026_cover_art.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original', categoria: 'Aventura' },
  { nombre: 'Celeste', imagen: 'https://assets.nintendo.com/image/upload/q_auto/f_auto/store/software/switch/70010000006442/691ba3e0801180a9864cc8a7694b6f98097f9d9799bc7e3dc6db92f086759252', categoria: 'Plataformas' },
  { nombre: 'FIFA 22', imagen: 'https://media.gq.com.mx/photos/60e9cc9c33c54bdef6761922/1:1/w_2125,h_2125,c_limit/E53RdQ5WQAIs7HC-scaled.jpg', categoria: 'Deportes' },
  { nombre: 'Civilization VI', imagen: 'https://assets.nintendo.com/image/upload/c_fill,w_1200/q_auto:best/f_auto/dpr_2.0/store/software/switch/70010000013704/918c0badde3aeba760e2185f382a2402248a1292322cf540fd8d098eeb292e1e', categoria: 'Estrategia' },
  { nombre: 'Doom Eternal', imagen: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/782330/3efb12f884eaee39b4853721f5cf1c6e2b706495/capsule_616x353.jpg?t=1783432602', categoria: 'Acción' },
  { nombre: 'Stardew Valley', imagen: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/413150/capsule_616x353.jpg?t=1786554168', categoria: 'Simulación' },
  { nombre: 'League of Legends', imagen: 'https://cdn1.epicgames.com/offer/24b9b5e323bc40eea252a10cdd3b2f10/EGS_LeagueofLegends_RiotGames_S1_2560x1440-47eb328eac5ddd63ebd096ded7d0d5ab', categoria: 'Estrategia' },
  { nombre: 'God of War Ragnarök', imagen: 'https://i.blogs.es/eadb27/1366_2000/1200_630.jpeg', categoria: 'Acción' },
  { nombre: 'Among Us', imagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch/70010000036098/758ab0b61205081da2466386940752c70e0e5ea43bd39e8b9b13eaa455c69b7e', categoria: 'Fiesta' },
  { nombre: 'The Sims 4', imagen: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222670/capsule_616x353.jpg?t=1787850077', categoria: 'Simulación' },
  { nombre: 'Fortnite', imagen: 'https://cms-assets.unrealengine.com/cm6l5gfpm05kr07my04cqgy2x/cmt14h2ardvpq07o76t76zt0m', categoria: 'Acción' },
  { nombre: 'Minecraft', imagen: 'https://www.nintendo.com/eu/media/images/news_12/2026/march_42/tiny_takeover_drop_is_now_available_for_minecraft_on_nintendo_switch/16x9_MinecraftTinyTakeover_Textless.png', categoria: 'Aventura' },
  { nombre: 'Hollow Knight: Silksong', imagen: 'https://assets.nintendo.com/image/upload/ar_16:9,c_lpad,w_1240/b_white/f_auto/q_auto/store/software/switch2/70010000105851/8787627be7f26ae7984456ffd9af17bea845032cebbf59fe6eeb596dea6bb20e', categoria: 'Aventura' },
];

async function main() {
  // 1) Intenta registrar el usuario de prueba (si ya existe, da 409 y seguimos igual)
  const registerRes = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  });

  if (!registerRes.ok && registerRes.status !== 409) {
    const body = await registerRes.text();
    console.log(`Aviso: el registro respondió ${registerRes.status}: ${body}`);
  }

  // 2) Login para obtener el token
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER),
  });

  if (!loginRes.ok) {
    throw new Error(
      `No se pudo hacer login (status ${loginRes.status}). ¿El backend está corriendo en ${API_URL}?`,
    );
  }

  const { access_token } = await loginRes.json();
  console.log('Login OK, token obtenido.');

  // 3) Crear cada juego
  let creados = 0;
  for (const juego of juegos) {
    const res = await fetch(`${API_URL}/juegos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify(juego),
    });

    if (res.ok) {
      creados++;
      console.log(`✔ Creado: ${juego.nombre}`);
    } else {
      console.log(`✘ Falló ${juego.nombre} (status ${res.status})`);
    }
  }

  console.log(`\nListo: ${creados}/${juegos.length} juegos creados.`);
}

main().catch((err) => {
  console.error('Error corriendo el seed:', err.message);
  process.exit(1);
});
