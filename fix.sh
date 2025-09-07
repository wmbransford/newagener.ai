#!/bin/bash
set -e

# Folders
mkdir -p app/dashboard app/library app/generate/photo app/generate/video app/api/auth/[...nextauth] components prisma src/lib/ai

# Rename configs
[ -f next-config.js ] && mv next-config.js next.config.js
[ -f tailwind-config.js ] && mv tailwind-config.js tailwind.config.js
[ -f env-example.txt ] && mv env-example.txt .env.example

# App router files (rename to .tsx so React/TSX compiles)
[ -f app-layout.ts ] && mv app-layout.ts app/layout.tsx
[ -f root-layout.ts ] && mv root-layout.ts app/layout.tsx
[ -f app-globals-css.css ] && mv app-globals-css.css app/globals.css
[ -f landing-page.ts ] && mv landing-page.ts app/page.tsx
[ -f dashboard-page.ts ] && mv dashboard-page.ts app/dashboard/page.tsx
[ -f library-page.ts ] && mv library-page.ts app/library/page.tsx
[ -f photo-generator-page.ts ] && mv photo-generator-page.ts app/generate/photo/page.tsx
[ -f video-generator-page.ts ] && mv video-generator-page.ts app/generate/video/page.tsx
[ -f nextauth-api-route.ts ] && mv nextauth-api-route.ts app/api/auth/[...nextauth]/route.ts

# Components → components/ (TSX)
[ -f header-component.ts ] && mv header-component.ts components/Header.tsx
[ -f sidebar-component.ts ] && mv sidebar-component.ts components/Sidebar.tsx
[ -f logo-component.ts ] && mv logo-component.ts components/Logo.tsx
[ -f template-card.ts ] && mv template-card.ts components/TemplateCard.tsx
[ -f ui-card.ts ] && mv ui-card.ts components/UiCard.tsx

# Lib / Prisma
[ -f auth-config.ts ] && mkdir -p src/lib && mv auth-config.ts src/lib/auth.ts
[ -f database-config.ts ] && mkdir -p src/lib && mv database-config.ts src/lib/db.ts
[ -f utils.ts ] && mkdir -p src/lib && mv utils.ts src/lib/utils.ts
[ -f ai-providers.ts ] && mv ai-providers.ts src/lib/ai/providers.ts
[ -f ai-types.ts ] && mv ai-types.ts src/lib/ai/types.ts
[ -f prisma-schema.txt ] && mv prisma-schema.txt prisma/schema.prisma
[ -f "prisma-schema (1).txt" ] && mv "prisma-schema (1).txt" prisma/schema.prisma
[ -f prisma-seed.ts ] && mv prisma-seed.ts prisma/seed.ts

# Remove the tiny preview so your real app takes over
if [ -d src/app ]; then
  rm -rf src/app
fi

# tsconfig.json (minimal)
if [ ! -f tsconfig.json ]; then
  cat > tsconfig.json <<'JSON'
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
JSON
fi

# next-env.d.ts (Next adds this, but ensure present)
[ ! -f next-env.d.ts ] && echo '/// <reference types="next" />\n/// <reference types="next/image-types/global" />' > next-env.d.ts

# .gitignore
cat > .gitignore <<'GIT'
node_modules
.next
.DS_Store
.env
GIT

echo "✅ Restructure complete."
