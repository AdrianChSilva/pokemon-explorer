# Pokémon Explorer 🧭

Aplicación web construida con React + TypeScript que permite explorar Pokémon utilizando la [PokeAPI](https://pokeapi.co). 
Puedes compilar la aplicación y correrla en local o puedes acceder desde aqui https://pokemon-explorer-acs.vercel.app/

---

## 🛠️ Tecnologías utilizadas

- ⚡️ [Vite](https://vitejs.dev/) — build rápido moderno
- ⚛️ [React](https://reactjs.org/) + [React Router](https://reactrouter.com/)
- 🔐 [TypeScript](https://www.typescriptlang.org/)
- 🎨 [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — diseño moderno, accesible y composable
- 💾 [Zustand](https://zustand-demo.pmnd.rs/) — gestión de estado ligera y persistente (favoritos con `localStorage`)
- 🌐 [Axios](https://axios-http.com/) — llamadas a la API
- 🧪 Eslint + Prettier + TS strict

---


## ✨ Funcionalidades

- ✅ Listado de Pokémon con imagen, número, tipos y fondo degradado según tipos
- ✅ Scroll infinito
- ✅ Vista de detalle con estadísticas, movimientos y botón de favoritos
- ✅ Marcado y desmarcado de favoritos desde cualquier parte
- ✅ Página de favoritos persistente (localStorage)
- ✅ Página 404 y manejo de errores personalizados
- ✅ Mobile-first y 100% responsive

---

## ▶️ Cómo ejecutar el proyecto

```bash
# Clona el repositorio
git clone https://github.com/AdrianChSilva/pokemon-explorer.git
cd pokemon-explorer

# Instala dependencias
pnpm install

# Haz el build
pnpm build

# Ejecuta en entorno local
pnpm dev
