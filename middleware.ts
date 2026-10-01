// Portero temporal de pre-lanzamiento (Vercel Routing Middleware).
//
// El público ve una página "Próximamente"; quien entra una vez por
// /?acceso=<PREVIEW_KEY> queda autorizado con una cookie y ve el sitio real.
// La clave vive en la env var PREVIEW_KEY de Vercel. Si falta, nadie entra
// (falla cerrado).
//
// PARA LANZAR: borrar este archivo y hacer push. Nada más depende de él.

export const config = {
  // Solo páginas: las rutas sin extensión más /index.html. Los ficheros
  // estáticos (assets, favicon, robots.txt…) pasan sin tocar.
  matcher: ['/', '/index.html', '/((?!.*\\.).*)'],
}

const COOKIE = 'gc_preview'
const PARAM = 'acceso'
// Dominio de Vercel que usa el cliente para revisar: queda abierto (su noindex
// va en vercel.json, para que Google no lo indexe como duplicado).
const OPEN_HOSTS = ['casasgroup.vercel.app']

export default function middleware(request: Request): Response | undefined {
  const key = process.env.PREVIEW_KEY
  const url = new URL(request.url)

  if (OPEN_HOSTS.includes(url.hostname)) return undefined

  if (key) {
    // Entrada por el link secreto: guarda la cookie y limpia la URL.
    if (url.searchParams.get(PARAM) === key) {
      url.searchParams.delete(PARAM)
      const secure = url.protocol === 'https:' ? '; Secure' : ''
      return new Response(null, {
        status: 302,
        headers: {
          Location: url.pathname + url.search,
          'Set-Cookie': `${COOKIE}=${key}; Path=/; Max-Age=2592000; HttpOnly; SameSite=Lax${secure}`,
          'Cache-Control': 'no-store',
        },
      })
    }

    const cookies = request.headers.get('cookie') ?? ''
    if (cookies.split(/;\s*/).includes(`${COOKIE}=${key}`)) return undefined
  }

  return new Response(COMING_SOON_HTML, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}

// Autocontenida (CSS inline) para no depender del bundle de la app.
// Logo replicado de .logo en src/index.css: GROUP con filetes arriba, CASAS debajo.
const COMING_SOON_HTML = `<!doctype html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex, nofollow" />
<meta name="theme-color" content="#f7f5f0" />
<title>Group Casas · Próximamente</title>
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&display=swap" />
<style>
  :root { --gold: #a47b36; --warm: #f7f5f0; }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body {
    background: var(--warm);
    color: var(--gold);
    font-family: 'Cormorant Garamond', Georgia, serif;
    display: grid;
    place-items: center;
    padding: 24px 16px;
    text-align: center;
  }
  main { display: flex; flex-direction: column; align-items: center; gap: 40px; }
  h1 {
    margin: 0;
    font-style: italic;
    font-weight: 300;
    font-size: clamp(44px, 9vw, 96px);
    letter-spacing: 0.02em;
    line-height: 1;
    opacity: 0;
    animation: rise 1.4s ease-out 0.2s forwards;
  }
  .logo {
    display: inline-flex;
    flex-direction: column;
    font-weight: 300;
    line-height: 0.95;
    opacity: 0;
    animation: rise 1.4s ease-out 0.7s forwards;
  }
  .logo small {
    display: flex;
    align-items: center;
    font-size: clamp(11px, 1.6vw, 14px);
    letter-spacing: 0.3em;
    margin-bottom: 6px;
  }
  .logo small::before, .logo small::after {
    content: '';
    flex: 1;
    height: 1px;
    background: currentColor;
    opacity: 0.4;
  }
  .logo small::before { margin-right: 8px; }
  .logo small::after { margin-left: 8px; }
  .logo span {
    font-size: clamp(24px, 3.6vw, 32px);
    letter-spacing: 0.34em;
    padding-left: 0.34em;
  }
  @keyframes rise {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    h1, .logo { animation: none; opacity: 1; }
  }
</style>
</head>
<body>
<main>
  <h1>Próximamente</h1>
  <div class="logo" aria-label="Group Casas">
    <small>GROUP</small>
    <span>CASAS</span>
  </div>
</main>
</body>
</html>`
