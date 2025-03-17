// assets/icons.js

const modules = import.meta.glob('./icons/**/*.webp', { eager: true });

const icons = {};
for (const path in modules) {
  const name = path.replace('./icons/', '').replace('.webp', '');
  icons[name] = modules[path].default; // Extrait la propriété default
}

export default icons;
