# DevTask Manager – Frontend Client
### 42i Technical Assessment

Cliente web construido con **Next.js (App Router)**, **Tailwind CSS** y **shadcn/ui** para el challenge técnico *"Task System"*. Se conecta a la API de DevTask Manager para gestionar proyectos y tareas de manera jerárquica.

---

## ✨ Características Principales

### 🎨 Diseño "Sovereign IDE"
Interfaz premium en **modo oscuro**, optimizada para la productividad de desarrolladores. Paleta basada en `#0b1326` (fondo) y `#171f33` (contenedores), con tipografías `Manrope` (títulos), `Inter` (UI) y `JetBrains Mono` (datos y metadatos).

### 🌳 UX Jerárquica
Componentes **recursivos** (`TaskItem`) que permiten navegar por infinitos niveles de subtareas de forma fluida. La sangría está matemáticamente limitada a 6 niveles visuales para preservar la legibilidad en pantallas de escritorio, mientras que los datos se siguen anidando sin límite.

### 🗂️ Paneles Contextuales
Uso de **Sheets** (paneles laterales) y modales para editar título, estado, prioridad, esfuerzo y descripción de cada tarea sin perder el contexto visual de la lista principal. Incluye analíticas de esfuerzo en tiempo real consumidas desde la API.

### 📱 Diseño Responsivo
Adaptación pragmática para dispositivos móviles: menú hamburguesa con sidebar deslizable en mobile, y ocultamiento de controles secundarios (`Status`, `Priority`, `Effort`) en pantallas pequeñas, priorizando la lectura limpia del árbol de tareas.

---

## 🚀 Cómo Ejecutar el Proyecto (Docker)

El entorno está **100% contenerizado**.

**Pre-requisito:** Haber levantado previamente el contenedor del Backend, que expone la API en el puerto `3001`. Ver instrucciones en [TaskSystem-Back](https://github.com/martinezmauri/TaskSystem-Back).

```bash
# 1. Clona el repositorio
git clone https://github.com/martinezmauri/TaskSystem-Front.git
cd TaskSystem-Front

# 2. Levanta el contenedor del cliente
docker-compose up --build -d
```

| Servicio | URL |
|---|---|
| Aplicación web (Next.js) | `http://localhost:3000` |
| API requerida (Backend) | `http://localhost:3001` |

---

## 🛠️ Stack Técnico

| Tecnología | Rol |
|---|---|
| Next.js 14 (App Router) | Framework React con SSR/RSC |
| Tailwind CSS | Sistema de estilos utilitario |
| shadcn/ui | Componentes accesibles (Accordion, Sheet, Dialog, AlertDialog) |
| Axios | Cliente HTTP hacia la API |
| lucide-react | Iconografía |
| date-fns | Formateo de fechas |
| Docker | Contenerización |

---

## 🤖 Metodología de Uso de IA

Durante el desarrollo del cliente web, se utilizó un **ecosistema híbrido de herramientas de IA** para maximizar la productividad técnica y visual:

**Google Stitch** *(IA de diseño de Google)*
Se utilizó para la conceptualización visual rápida, la resolución de problemas de distribución espacial (especialmente en la adaptación responsiva de la vista móvil) y la ideación de la estructura base de la UI. Sus maquetas y snippets sirvieron como referencia estructural y de diseño.

**Modelos Conversacionales** *(Claude Sonnet 4.6 y Gemini 3.1 Pro)*
Actuaron como *"agentes programadores"* para convertir las referencias visuales de Stitch en componentes funcionales de React usando Tailwind CSS y shadcn/ui. El ensamblaje final, el manejo complejo de estados recursivos y la conexión a la API mediante Axios fueron **auditados, refactorizados y depurados manualmente** para asegurar la máxima calidad arquitectónica.
