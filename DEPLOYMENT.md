# FxBlox Signature Generator - Deployment Guide

## Overview

This guide covers all deployment options for the FxBlox Signature Generator web portal.

## Prerequisites

- Node.js 16+ and npm/yarn
- Git (for GitHub deployment)
- A GitHub account (for GitHub Pages)

## Deployment Options

### Option 1: GitHub Pages (Recommended)

#### Automatic Deployment via GitHub Actions

**Setup (One-time)**

1. Ensure `.github/workflows/deploy.yml` exists in the repository
2. Push to the main branch
3. GitHub Actions automatically builds and deploys

**Deployment Process**

```bash
# 1. Make changes to code
# 2. Commit changes
git add .
git commit -m "Update signature generator"

# 3. Push to main branch
git push origin main

# 4. GitHub Actions automatically:
#    - Builds the project
#    - Deploys to gh-pages branch
#    - Website is live in ~2 minutes
```

**Access the Website**

- Default: `https://functionland.github.io/fx/fxblox-signature/`
- Custom domain: Configure DNS and CNAME file

**Custom Domain Setup**

1. Update `vite.config.js`:
```javascript
export default defineConfig({
  base: '/',  // Change from '/fxblox-signature/'
  // ... rest of config
});
```

2. Create `CNAME` file in root:
```
fxblox-signature.fx.land
```

3. Configure DNS:
   - Add CNAME record pointing to `functionland.github.io`

4. Push changes:
```bash
git add CNAME vite.config.js
git commit -m "Add custom domain"
git push origin main
```

#### Manual Deployment to GitHub Pages

```bash
# 1. Build the project
npm run build

# 2. Deploy using gh-pages
npm run deploy

# 3. Website is live at GitHub Pages URL
```

**Troubleshooting GitHub Pages**

- Check GitHub Pages settings in repository
- Verify gh-pages branch exists
- Check GitHub Actions logs for build errors
- Clear browser cache if changes don't appear

### Option 2: Netlify

#### Automatic Deployment

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Select GitHub and authorize
   - Choose `functionland/fx` repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: 18

3. **Deploy**
   - Every push to main automatically deploys
   - Website is live in ~1 minute

#### Manual Deployment

```bash
# 1. Build the project
npm run build

# 2. Install Netlify CLI
npm install -g netlify-cli

# 3. Deploy
netlify deploy --prod --dir=dist
```

**Custom Domain on Netlify**

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Update DNS records as instructed

### Option 3: Vercel

#### Automatic Deployment

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import GitHub repository

2. **Configure**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Deploy**
   - Every push to main automatically deploys
   - Website is live in ~30 seconds

#### Manual Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

### Option 4: AWS S3 + CloudFront

#### Setup

1. **Create S3 Bucket**
```bash
aws s3 mb s3://fxblox-signature
```

2. **Enable Static Website Hosting**
```bash
aws s3 website s3://fxblox-signature \
  --index-document index.html \
  --error-document index.html
```

3. **Build Project**
```bash
npm run build
```

4. **Upload to S3**
```bash
aws s3 sync dist/ s3://fxblox-signature --delete
```

5. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Cache behavior: Compress objects automatically

#### Deployment Script

Create `deploy-aws.sh`:
```bash
#!/bin/bash
npm run build
aws s3 sync dist/ s3://fxblox-signature --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 5: Self-Hosted Server

#### Prerequisites

- Web server (Nginx, Apache, etc.)
- SSH access to server
- Domain name

#### Deployment

1. **Build Locally**
```bash
npm run build
```

2. **Upload to Server**
```bash
scp -r dist/* user@server.com:/var/www/fxblox-signature/
```

3. **Configure Web Server**

**Nginx Configuration**
```nginx
server {
    listen 80;
    server_name fxblox-signature.fx.land;

    root /var/www/fxblox-signature;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Don't cache HTML
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

**Apache Configuration**
```apache
<VirtualHost *:80>
    ServerName fxblox-signature.fx.land
    DocumentRoot /var/www/fxblox-signature

    <Directory /var/www/fxblox-signature>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>

    # Cache static assets
    <FilesMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>

    # Don't cache HTML
    <FilesMatch "\.html$">
        Header set Cache-Control "no-cache, no-store, must-revalidate"
    </FilesMatch>
</VirtualHost>
```

4. **Enable HTTPS**
```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --webroot -w /var/www/fxblox-signature -d fxblox-signature.fx.land
```

5. **Restart Web Server**
```bash
sudo systemctl restart nginx
# or
sudo systemctl restart apache2
```

### Option 6: Docker Container

#### Dockerfile

Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Nginx Configuration for Docker

Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

#### Build and Run

```bash
# Build Docker image
docker build -t fxblox-signature .

# Run container
docker run -p 80:80 fxblox-signature

# Access at http://localhost
```

#### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: always
```

Run:
```bash
docker-compose up -d
```

## Deployment Comparison

| Platform | Setup Time | Cost | Ease | Auto-Deploy | Custom Domain |
|----------|-----------|------|------|-------------|---------------|
| GitHub Pages | 5 min | Free | ⭐⭐⭐⭐⭐ | ✅ | ✅ |
| Netlify | 5 min | Free | ⭐⭐⭐⭐⭐ | ✅ | ✅ |
| Vercel | 5 min | Free | ⭐⭐⭐⭐⭐ | ✅ | ✅ |
| AWS S3 | 15 min | $$ | ⭐⭐⭐ | ❌ | ✅ |
| Self-Hosted | 30 min | $$ | ⭐⭐ | ❌ | ✅ |
| Docker | 20 min | $ | ⭐⭐⭐ | ❌ | ✅ |

## Pre-Deployment Checklist

- [ ] Code tested locally: `npm run dev`
- [ ] Build successful: `npm run build`
- [ ] No console errors: `npm run preview`
- [ ] Mobile responsive tested
- [ ] All wallets tested (MetaMask, Coinbase)
- [ ] Copy-to-clipboard works
- [ ] Error handling works
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Version bumped in package.json

## Post-Deployment Checklist

- [ ] Website accessible at deployment URL
- [ ] All pages load correctly
- [ ] UI renders properly
- [ ] Wallet connections work
- [ ] Signature generation works
- [ ] Copy-to-clipboard works
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable
- [ ] SSL/HTTPS working (if applicable)

## Monitoring

### GitHub Pages
- Check GitHub Actions logs
- Monitor GitHub Pages status
- Set up email notifications

### Netlify/Vercel
- Check deployment logs
- Set up Slack notifications
- Monitor analytics

### Self-Hosted
- Monitor server uptime
- Check error logs
- Monitor resource usage
- Set up alerts

## Rollback Procedures

### GitHub Pages
```bash
# Revert to previous commit
git revert HEAD
git push origin main
# GitHub Actions automatically redeploys
```

### Netlify/Vercel
- Use deployment history
- Click "Rollback" on previous deployment

### Self-Hosted
```bash
# Restore previous version
cd /var/www/fxblox-signature
git checkout previous-commit-hash
npm run build
# Restart web server
```

## Performance Optimization

### Before Deployment

1. **Minification**
   - Vite automatically minifies
   - Check `dist/` folder size

2. **Compression**
   - Enable gzip on server
   - Check response headers

3. **Caching**
   - Set cache headers for static assets
   - Don't cache HTML files

4. **CDN**
   - Use CDN for faster delivery
   - Netlify/Vercel include CDN

### Monitoring Performance

```bash
# Check bundle size
npm run build
ls -lh dist/

# Lighthouse score
# Use Chrome DevTools → Lighthouse
```

## Troubleshooting Deployments

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Website Shows Blank Page

- Check browser console for errors
- Verify `base` path in vite.config.js
- Check server logs

### Wallet Connection Fails

- Verify MetaMask/Coinbase installed
- Check browser console for errors
- Verify HTTPS (if required)

### Slow Performance

- Check bundle size
- Enable compression on server
- Use CDN
- Optimize images

## Security Considerations

### HTTPS

- Always use HTTPS in production
- Use Let's Encrypt for free certificates
- Redirect HTTP to HTTPS

### Headers

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Environment Variables

- Never commit `.env` files
- Use deployment platform's secrets
- Rotate keys regularly

## Maintenance

### Regular Updates

```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update major versions
npm install ethers@latest
```

### Monitoring

- Monitor error logs
- Track user feedback
- Monitor performance metrics
- Check for security updates

## Support

For deployment issues:
1. Check deployment platform documentation
2. Review error logs
3. Check browser console
4. Open GitHub issue with details

---

**Recommended**: Use GitHub Pages for free, automatic deployment with minimal setup.
