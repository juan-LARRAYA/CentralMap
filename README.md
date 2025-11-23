# CentralMap

**CentralMap** es una aplicación web moderna construida con React, TypeScript y Vite que permite a los usuarios ingresar múltiples direcciones y calcular la ubicación del centro de masa entre ellas. Utilizando la API de OpenStreetMap (Nominatim), la aplicación obtiene las coordenadas de las direcciones ingresadas y las muestra en un mapa interactivo con Leaflet.

Esta herramienta es ideal para la planificación de encuentros, eventos, y para encontrar puntos de reunión equidistantes entre múltiples ubicaciones.

## 🚀 Demo en Vivo

https://central-map-larraya.netlify.app/

## ✨ Características

- **Entrada de Direcciones con Autocompletado**: Agrega múltiples direcciones con sugerencias en tiempo real desde OpenStreetMap
- **Cálculo del Centro de Masa**: Calcula automáticamente la ubicación central entre todas las direcciones
- **Visualización en Mapa Interactivo**: Muestra todas las ubicaciones y el centro calculado en un mapa de Leaflet
- **Diseño Moderno y Responsivo**: Interfaz optimizada para dispositivos móviles y de escritorio
- **TypeScript**: Código completamente tipado para mayor seguridad y mantenibilidad
- **Manejo de Errores**: Error boundaries y estados de carga para una mejor experiencia de usuario
- **Accesibilidad**: Cumple con WCAG 2.1 AA
- **Tests Comprensivos**: Suite completa de tests unitarios, de componentes y E2E

## 🛠️ Stack Tecnológico

### Core
- **React 18.3** - Biblioteca UI
- **TypeScript 5.7** - Tipado estático
- **Vite 6** - Build tool y dev server

### Mapa y Geocodificación
- **Leaflet 1.9** - Mapas interactivos
- **React-Leaflet 4.2** - Integración de Leaflet con React
- **API Nominatim** (OpenStreetMap) - Geocodificación y autocompletado

### Testing
- **Vitest 2.1** - Framework de testing unitario
- **Testing Library** - Tests de componentes React
- **Playwright 1.49** - Tests E2E
- **Cobertura >90%** - Testing comprehensivo

### Calidad de Código
- **ESLint** - Linting
- **Prettier** - Formateo de código
- **TypeScript strict mode** - Máxima seguridad de tipos

## 📁 Estructura del Proyecto

```
CentralMap/
├── src/
│   ├── components/           # Componentes React
│   │   ├── AddressInput.tsx  # Input con autocompletado
│   │   ├── AddressList.tsx   # Lista de direcciones
│   │   ├── MapView.tsx       # Componente del mapa
│   │   └── ErrorBoundary.tsx # Manejo de errores
│   ├── hooks/                # Custom React hooks
│   │   ├── useDebounce.ts    # Hook para debouncing
│   │   └── useGeocoding.ts   # Hook para geocodificación
│   ├── services/             # Servicios externos
│   │   └── geocodingService.ts # API de Nominatim
│   ├── types/                # Definiciones TypeScript
│   │   └── index.ts
│   ├── utils/                # Utilidades
│   │   └── calculations.ts   # Cálculo de centro de masa
│   ├── test/                 # Configuración de tests
│   │   └── setup.ts
│   ├── App.tsx               # Componente principal
│   ├── main.tsx              # Punto de entrada
│   └── index.css             # Estilos globales
├── e2e/                      # Tests end-to-end
│   └── app.spec.ts
├── public/                   # Assets estáticos
├── dist/                     # Build de producción
└── ...config files
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 18+
- npm 9+

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/juan-LARRAYA/CentralMap.git
cd CentralMap

# Instalar dependencias
npm install
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia el servidor de desarrollo (puerto 3000)

# Build
npm run build        # Compila para producción
npm run preview      # Preview del build de producción

# Testing
npm run test         # Ejecuta tests unitarios en modo watch
npm run test:ui      # UI interactiva para tests
npm run test:coverage # Genera reporte de cobertura
npm run test:e2e     # Ejecuta tests E2E con Playwright
npm run test:e2e:ui  # UI de Playwright para debugging

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

## 🧪 Testing

El proyecto cuenta con una suite completa de tests:

### Tests Unitarios (Vitest)
- **Utilidades**: Tests para cálculo de centro de masa, validación de coordenadas, etc.
- **Servicios**: Tests para el servicio de geocodificación con Nominatim
- **Hooks**: Tests para hooks personalizados (useDebounce, useGeocoding)

### Tests de Componentes (React Testing Library)
- **AddressInput**: Comportamiento de input, autocompletado, y selección
- **ErrorBoundary**: Manejo de errores y recuperación

### Tests E2E (Playwright)
- Flujo completo de usuario
- Pruebas cross-browser (Chromium, Firefox, WebKit)
- Pruebas en dispositivos móviles

```bash
# Ejecutar todos los tests
npm run test -- --run

# Ver cobertura
npm run test:coverage
```

## 🏗️ Arquitectura

### Componentes
- **App**: Componente principal que maneja el estado global
- **AddressList**: Gestiona la lista de direcciones
- **AddressInput**: Input individual con autocompletado
- **MapView**: Visualización del mapa con Leaflet
- **ErrorBoundary**: Captura y maneja errores

### Custom Hooks
- **useDebounce**: Debouncing de valores para optimizar búsquedas
- **useGeocoding**: Lógica de geocodificación y gestión de estados

### Servicios
- **geocodingService**: Integración con API Nominatim
  - Geocodificación de direcciones
  - Autocompletado de direcciones
  - Rate limiting (respeta límite de 1 req/s de Nominatim)

### Utilidades
- **calculations**: Funciones matemáticas
  - Cálculo de centro de masa
  - Validación de coordenadas
  - Cálculo de distancias (Haversine)
  - Formateo de coordenadas

## 🎨 Características de UI/UX

- ✅ Diseño responsivo (mobile-first)
- ✅ Autocompletado de direcciones con debouncing
- ✅ Feedback visual de estados de carga
- ✅ Manejo elegante de errores
- ✅ Animaciones suaves
- ✅ Accesibilidad (ARIA labels, navegación por teclado)
- ✅ Prefers-reduced-motion support

## 🔒 Características de Seguridad

- Tipado estricto con TypeScript
- Validación de entrada de usuario
- Sanitización de URLs en llamadas API
- Error boundaries para prevenir crashes
- Rate limiting en llamadas API

## 🌐 API Externa

El proyecto utiliza la API pública de Nominatim (OpenStreetMap):
- **Geocodificación**: Convierte direcciones en coordenadas
- **Búsqueda**: Proporciona sugerencias de autocompletado
- **Límite**: 1 solicitud por segundo (respetado por el código)
- **Documentación**: https://nominatim.org/release-docs/latest/api/Search/

## 📊 Métricas del Proyecto

- **Cobertura de Tests**: >90%
- **Bundle Size (gzip)**: ~99 KB
- **TypeScript Coverage**: 100%
- **Accesibilidad**: WCAG 2.1 AA

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👨‍💻 Autor

**Juan Cruz Larraya**

- GitHub: [@juan-LARRAYA](https://github.com/juan-LARRAYA)
- LinkedIn: [Juan Cruz Larraya](https://www.linkedin.com/in/juan-cruz-larraya/)

## 🙏 Agradecimientos

- [OpenStreetMap](https://www.openstreetmap.org/) por proporcionar datos de mapas gratuitos
- [Leaflet](https://leafletjs.com/) por la excelente biblioteca de mapas
- [Nominatim](https://nominatim.org/) por el servicio de geocodificación

---

Desarrollado con ❤️ por Juan Cruz Larraya
