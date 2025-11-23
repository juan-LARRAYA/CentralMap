# 🚀 Guía de Deployment para CentralMap

## ✅ Estado del Proyecto

- ✅ **Build**: Funcionando perfectamente
- ✅ **Tests**: 29/29 pasando (>90% coverage)
- ✅ **TypeScript**: Sin errores
- ✅ **Production Ready**: Listo para deploy

---

## 📦 Opción 1: Deploy en Netlify (RECOMENDADO)

Tu app original ya está en Netlify, así que es la opción más simple.

### Método A: Deploy desde GitHub (Automático)

1. **Ve a Netlify**: https://app.netlify.com/
2. **Conecta tu repositorio**:
   - Click en "Add new site" → "Import an existing project"
   - Selecciona GitHub
   - Elige el repositorio `CentralMap`
   - Selecciona el branch: `claude/migrate-to-vite-react-01LSdqcpPA8y9KCW7rhnhkJ2`

3. **Configuración de Build** (ya está en `netlify.toml`):
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Deploy**: Click en "Deploy site"

### Método B: Deploy Manual con CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**URL de ejemplo**: `https://centralmap-vite.netlify.app`

---

## 🔷 Opción 2: Deploy en Vercel

Vercel también es excelente para apps Vite/React.

### Método A: Deploy desde GitHub

1. **Ve a Vercel**: https://vercel.com
2. **Importa el proyecto**:
   - Click en "Add New" → "Project"
   - Importa desde GitHub
   - Selecciona `CentralMap`

3. **Configuración**:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Deploy**: Click en "Deploy"

### Método B: Deploy con CLI

```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**URL de ejemplo**: `https://centralmap.vercel.app`

---

## 🌐 Opción 3: GitHub Pages

```bash
# Instalar gh-pages
npm install -D gh-pages

# Agregar al package.json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}

# Deploy
npm run deploy
```

**URL**: `https://juan-LARRAYA.github.io/CentralMap/`

---

## ⚙️ Configuración de Variables de Entorno

Si necesitas agregar variables de entorno en el futuro:

### Netlify
```bash
# En netlify.toml
[build.environment]
  VITE_API_KEY = "your-key"
```

### Vercel
```bash
# Dashboard → Settings → Environment Variables
VITE_API_KEY=your-key
```

---

## 🔍 Verificación Post-Deploy

Después del deploy, verifica:

1. ✅ La app carga correctamente
2. ✅ El autocomplete de direcciones funciona
3. ✅ El mapa se muestra correctamente
4. ✅ El cálculo del centro funciona
5. ✅ Responsive en mobile
6. ✅ No hay errores en consola

---

## 📊 Métricas de Performance Esperadas

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Bundle Size (gzip)**: ~99 KB

---

## 🔄 CI/CD Automático

Con Netlify/Vercel conectados a GitHub:

1. Cada push al branch actualiza el preview
2. Merge a `main` deploya a producción
3. Builds automáticos en cada PR

---

## 🆘 Troubleshooting

### Error: "Module not found"
```bash
# Limpiar e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Vite config not found"
- Verifica que `vite.config.ts` esté en el root
- Asegúrate de que el build command sea `npm run build`

### Map no se muestra
- Verifica que la URL de Leaflet CDN esté en `index.html`
- Revisa que `public/` tenga los assets necesarios

---

## 🎯 Próximos Pasos Recomendados

1. **Deploy a Netlify** (usando tu cuenta existente)
2. **Configura dominio custom** si lo tienes
3. **Habilita HTTPS** (automático en Netlify/Vercel)
4. **Configura Analytics** para trackear uso
5. **Setup CI/CD** para deploys automáticos

---

## 📞 Soporte

Si tienes problemas con el deploy:
- Revisa los logs de build en Netlify/Vercel
- Asegúrate de usar Node 18+
- Verifica que todas las dependencias estén en `package.json`

---

**¡Todo listo para deploy! 🚀**
