import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { transform as lightningTransform } from 'lightningcss';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

function lowerCssForLegacyChrome(rawCss: string, filename: string): string {
  // 1. Lower oklch/oklab color literals to standard hex/rgb compatible with Chrome 109+ (Win 7 / older Safari)
  let css = lightningTransform({
    filename,
    code: Buffer.from(rawCss),
    targets: { chrome: 109 << 16 },
    minify: false,
  }).code.toString();

  // 2. Collect resolved --color-* hex/rgb tokens from the theme layer
  const colorVars: Record<string, string> = {};
  for (const m of css.matchAll(
    /(--color-[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8}|rgba?\([^)]+\))/g
  )) {
    colorVars[m[1]] = m[2];
  }

  const parseRgb = (colorStr: string): [number, number, number] | null => {
    const c = colorStr.trim();
    if (c.startsWith('#')) {
      let h = c.slice(1);
      if (h.length === 3 || h.length === 4) {
        h = h
          .slice(0, 3)
          .split('')
          .map((x) => x + x)
          .join('');
      }
      if (h.length >= 6) {
        return [
          parseInt(h.slice(0, 2), 16),
          parseInt(h.slice(2, 4), 16),
          parseInt(h.slice(4, 6), 16),
        ];
      }
    }
    const rgb = c.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/i);
    if (rgb) {
      return [Math.round(+rgb[1]), Math.round(+rgb[2]), Math.round(+rgb[3])];
    }
    return null;
  };

  // 3. Lower color-mix(in oklab|srgb|oklch, <color> <pct>%, transparent) -> rgba(...)
  css = css.replace(
    /color-mix\(\s*in\s+(?:oklab|srgb|oklch)\s*,\s*([^,]+?)\s+(\d+(?:\.\d+)?)%\s*,\s*transparent\s*\)/gi,
    (full, colorExpr: string, pctStr: string) => {
      const alpha = Math.max(0, Math.min(1, parseFloat(pctStr) / 100));
      const trimmed = colorExpr.trim();
      let resolved = trimmed;
      const varMatch = trimmed.match(/^var\((--color-[a-z0-9-]+)\)$/i);
      if (varMatch && colorVars[varMatch[1]]) {
        resolved = colorVars[varMatch[1]];
      }
      const rgb = parseRgb(resolved);
      if (rgb) {
        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Number(alpha.toFixed(3))})`;
      }
      return full;
    }
  );

  // 4. Unwrap @supports (color: color-mix(...)) blocks whose inner color-mix became rgba()
  css = css.replace(
    /@supports\s*\(color:\s*color-mix\([^)]+\)\)\s*\{([\s\S]*?\})\s*\}/g,
    (full, inner: string) => {
      return inner.includes('color-mix(') ? full : inner;
    }
  );

  // 5. Strip CSS Color 4 gradient interpolation hints ("in oklab", "in oklch")
  css = css.replace(/\s+in\s+(?:oklab|oklch|srgb)\b/gi, '');

  return css;
}

function chrome109CssCompatPlugin(): Plugin {
  return {
    name: 'xelvion-chrome109-css-compat',
    transform(code, id) {
      const cleanId = id.split('?')[0];
      if (!cleanId.endsWith('.css') && !id.includes('&lang.css')) return;
      if (code.includes('__vite__css')) return;
      return {
        code: lowerCssForLegacyChrome(code, cleanId || 'style.css'),
        map: null,
      };
    },
    generateBundle(_options, bundle) {
      for (const chunk of Object.values(bundle)) {
        if (
          chunk.type === 'asset' &&
          chunk.fileName.endsWith('.css') &&
          typeof chunk.source === 'string'
        ) {
          chunk.source = lowerCssForLegacyChrome(chunk.source, chunk.fileName);
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      chrome109CssCompatPlugin(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'apple-touch-icon.png',
          'icon.svg',
          'pwa-192x192.png',
          'pwa-512x512.png',
          'pwa-maskable-512x512.png',
        ],
        manifest: {
          id: '/',
          name: 'Xelvion Innova Tech Portal',
          short_name: 'Xelvion',
          description:
            'Engineering portal for Indian SMEs — Cloud infrastructure, logistics software, WhatsApp chatbots, databases, and client admin management.',
          theme_color: '#0f172a',
          background_color: '#F3F2EE',
          display: 'standalone',
          start_url: '/',
          scope: '/',
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
          navigateFallback: '/index.html',
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\/(?:og|services|assets)\/.+\.(?:png|jpg|jpeg|webp|svg)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'xelvion-media-cache',
                expiration: {
                  maxEntries: 40,
                  maxAgeSeconds: 60 * 60 * 24 * 30,
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
