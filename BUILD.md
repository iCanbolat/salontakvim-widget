# Build & Deployment Guide

## Development

### Local Development

```bash
# Start development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint
```

Environment files:

- `.env.development` - Local development settings
- `.env.production` - Production build settings

## Building

### Production Build

```bash
# Build with production environment
npm run build:prod
```

Output structure:

```
dist/
├── assets/
│   ├── js/
│   │   ├── react-vendor-[hash].js
│   │   ├── ui-vendor-[hash].js
│   │   ├── date-vendor-[hash].js
│   │   └── index-[hash].js
│   ├── images/
│   └── fonts/
├── index.html
└── widget-loader.js (copied from public/)
```

### Development Build (with sourcemaps)

```bash
npm run build:dev
```

## Deployment

### CDN Deployment

1. Build for production:

```bash
npm run build:prod
```

2. Upload dist/ folder to CDN:

```bash
# Example with AWS S3
aws s3 sync dist/ s3://your-bucket/widget/ --acl public-read

# Example with Cloudflare Pages
wrangler pages publish dist/
```

3. Set CDN cache headers:

```
assets/js/*.js     -> Cache-Control: public, max-age=31536000, immutable
assets/css/*.css   -> Cache-Control: public, max-age=31536000, immutable
assets/images/*    -> Cache-Control: public, max-age=31536000, immutable
index.html         -> Cache-Control: public, max-age=3600
widget-loader.js   -> Cache-Control: public, max-age=86400
```

### Version Management

Update version in `package.json`:

```json
{
  "version": "1.0.0"
}
```

The version is automatically embedded in the build via `__APP_VERSION__` global.

### Environment Variables

Set these variables in your deployment platform:

**Required:**

- `VITE_API_BASE_URL` - API endpoint (e.g., https://api.salontakvim.com)

**Optional:**

- `VITE_WIDGET_VERSION` - Override version from package.json
- `VITE_CDN_URL` - CDN base URL for assets
- `VITE_ENV` - Environment name (production, staging, etc.)

### CI/CD Example (GitHub Actions)

```yaml
name: Build and Deploy Widget

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: "20"
          cache: "pnpm"

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: pnpm run type-check

      - name: Lint
        run: pnpm run lint

      - name: Build
        run: pnpm run build:prod
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}

      - name: Deploy to CDN
        run: |
          # Your CDN deployment command
          aws s3 sync dist/ s3://your-bucket/widget/
```

## Performance Optimization

### Bundle Analysis

```bash
# Install bundle analyzer
npm install -D rollup-plugin-visualizer

# Analyze bundle
npm run build:prod
# Open stats.html in browser
```

### Code Splitting

The build automatically splits code into vendor chunks:

- `react-vendor` - React & React DOM
- `ui-vendor` - Radix UI components
- `date-vendor` - Date handling libraries

### Asset Optimization

- Images: Use WebP format where possible
- Fonts: Subset Google Fonts to required characters
- CSS: Automatically minified and extracted

### Loading Strategy

1. Critical CSS inlined in HTML
2. Widget loader script loads asynchronously
3. Widget bundle loads on demand
4. Fonts load with `font-display: swap`

## Monitoring

### Performance Metrics

Monitor these metrics:

- First Contentful Paint (FCP)
- Time to Interactive (TTI)
- Largest Contentful Paint (LCP)
- Cumulative Layout Shift (CLS)

### Error Tracking

Integrate error tracking service:

```typescript
// In src/main.tsx
window.addEventListener("error", (event) => {
  // Send to error tracking service
  console.error("Widget error:", event.error);
});
```

### Analytics

Track widget usage:

```typescript
// Custom events
window.dispatchEvent(new CustomEvent("salontakvim:ready"));
window.dispatchEvent(
  new CustomEvent("salontakvim:appointment-created", {
    detail: { appointmentId: "123" },
  })
);
```

## Testing Production Build

### Local Testing

```bash
# Build and preview
npm run build:prod
npm run preview
```

### Browser Testing

Test on:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### Integration Testing

Test embedding on different platforms:

- Plain HTML
- WordPress
- React apps
- Next.js apps

## Rollback Strategy

Keep previous versions on CDN:

```
/widget/v1.0.0/
/widget/v1.0.1/
/widget/latest/  (symlink to current version)
```

Update widget-loader.js to point to specific versions for gradual rollout.

## Security

### CSP Headers

Ensure your widget works with Content Security Policy:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.salontakvim.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src https://fonts.gstatic.com;
  connect-src https://api.salontakvim.com;
```

### CORS

API must allow widget origin:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Troubleshooting

### Build Fails

1. Clear node_modules and reinstall
2. Check TypeScript errors with `npm run type-check`
3. Check disk space
4. Update dependencies

### Large Bundle Size

1. Check bundle analysis
2. Review dependencies (use lighter alternatives)
3. Implement dynamic imports for heavy components
4. Remove unused code

### CDN Issues

1. Verify CORS headers
2. Check cache headers
3. Test with curl/wget
4. Verify SSL certificates

## Support

- Documentation: https://docs.salontakvim.com
- Issues: GitHub Issues
- Email: dev@salontakvim.com
