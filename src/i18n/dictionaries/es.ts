// File: src/i18n/dictionaries/es.ts
import type { Dictionary } from "./en";

export const es: Dictionary = {
  meta: {
    title: "Calebe Dev",
    description:
      "Calebe Rodrigues Rolim, ingeniero de software y desarrollador full-stack en LetsPic. Construyo productos web y móviles de punta a punta.",
  },
  nav: {
    home: "Inicio",
    experience: "Experiencia",
    projects: "Proyectos",
    skills: "Habilidades",
    contact: "Contacto",
    openMenu: "Abrir menú",
    closeMenu: "Cerrar menú",
    toLight: "Cambiar al tema claro",
    toDark: "Cambiar al tema oscuro",
    language: "Cambiar idioma",
  },
  hero: {
    greeting: "Hola, soy",
    role: "Desarrollador full-stack en LetsPic",
    tagline:
      "Construyo productos web y móviles de punta a punta, desde la base de datos hasta el último píxel de la interfaz.",
    bio: "Me gusta la UI limpia, la UX práctica y desenredar problemas difíciles. Fuera de la pantalla me encontrarás en una cancha de básquet, viendo anime o planeando el próximo viaje. La meta es conocer todos los países algún día.",
    nowLabel: "Ahora",
    now: "Construyendo herramientas de fotos y álbumes en LetsPic",
    open: "Abierto a escuchar propuestas",
    ctaWork: "Ver mi trabajo",
    ctaContact: "Hablemos",
    portraitAlt: "Retrato de Calebe",
    ringsCaption: "Cada anillo es un año construyendo",
  },
  experience: {
    title: "Experiencia",
    subtitle: "Dónde he estado construyendo, de lo más reciente a lo más antiguo.",
    current: "Actual",
    builtLabel: "Lo que construí",
    stackLabel: "Stack",
    jobs: {
      letspic: {
        org: "LetsPic",
        role: "Desarrollador full-stack junior",
        period: "Feb 2026 — actualidad",
        kind: "Startup de fotografía y eventos",
        summary:
          "LetsPic trabaja con empresas de fotografía y eventos, sobre todo de graduaciones. Con reconocimiento facial, respaldo en línea y procesamiento de imágenes, automatizamos el trabajo pesado para que entreguen más rápido y sorprendan a sus clientes.",
        detail:
          "Trabajo en todo el stack: backend, base de datos y frontend, con despliegues en Azure Static Web Apps y Google Cloud.",
      },
      freelance: {
        org: "Freelance",
        role: "Desarrollador web",
        period: "Dic 2025 — Ene 2026",
        kind: "Independiente",
        summary:
          "Apenas me gradué, diseñé, desarrollé, vendí y publiqué dos sitios web desde cero en dos meses: uno para una iglesia en Uruguay y otro para una farmacia de fórmulas magistrales en Brasil.",
      },
      university: {
        org: "Ingeniería de Software",
        role: "Licenciatura",
        period: "Graduado en dic 2025",
        kind: "Universidad",
        summary:
          "Mi proyecto de fin de carrera (TCC) fue MobTech, una app de movilidad urbana basada en datos geoespaciales, con seguimiento en tiempo real y flujos de viaje sobre el mapa. La app todavía no está terminada.",
      },
    },
    products: {
      album: {
        name: "Diseñador de álbumes",
        description:
          "Diagrama y edita álbumes de fotos: recorte y ediciones del día a día, una vista previa interactiva de cómo va quedando cada página y el armado automático del álbum con IA.",
      },
      crm: {
        name: "CRM interno",
        description:
          "Un embudo de ventas para el equipo, inspirado en Pipedrive, para seguir cada negocio desde el primer contacto hasta el cierre.",
      },
    },
    album: {
      autoLayout: "Ordenar con IA",
      reset: "Desordenar",
      arranging: "Ordenando…",
      arranged: "Página ordenada",
      spread: "Página",
    },
    crm: {
      stages: ["Lead", "Contactado", "Propuesta", "Ganado"],
      deals: ["Promo 2026", "Estudio Luz", "Medicina"],
      advance: "Avanzar un negocio",
    },
  },
  projects: {
    title: "Proyectos",
    subtitle: "Cosas que diseñé, construí y publiqué.",
    production: "En línea",
    development: "En desarrollo",
    roleLabel: "Mi rol",
    repo: "Ver repositorio",
    visit: "Visitar sitio",
    playVideo: "Reproducir video",
    closeVideo: "Cerrar video",
    close: "Cerrar",
    items: {
      voltaaflora: {
        title: "Volta à Flora",
        tagline: "Sitio para una farmacia de fórmulas magistrales",
        description:
          "Una farmacia de Anápolis con más de 40 años de historia necesitaba un lugar en internet. La diseñé, desarrollé, vendí y publiqué: la historia y el equipo, un flujo para pedir fórmulas y contacto directo por WhatsApp, teléfono y correo.",
        role: "Freelance, del diseño al despliegue",
        year: "2026",
      },
      ipuy: {
        title: "IPUY",
        tagline: "Sitio institucional con tema claro y oscuro",
        description:
          "Sitio de la Iglesia Presbiteriana del Uruguay, con diseños responsivos, temas completos y secciones de contenido claras. Pensado para la claridad y la accesibilidad en cualquier dispositivo.",
        role: "Freelance, desarrollador frontend",
        year: "2025",
      },
      mobtech: {
        title: "MobTech",
        tagline: "App de movilidad urbana para iOS y Android",
        description:
          "Mi proyecto de fin de carrera: una app multiplataforma de seguimiento en tiempo real y flujos de viaje, impulsada por datos geoespaciales. Hecha con React Native y Expo, con interacciones sobre el mapa y sensación nativa en ambas plataformas.",
        role: "Desarrollador mobile, proyecto de fin de carrera",
        year: "2024 — 2025",
      },
    },
    videos: {
      "voltaaflora-mobile": {
        title: "Volta à Flora en el celular",
        description: "La página completa, de principio a fin, en un iPhone.",
        tag: "iPhone",
      },
      "mobtech-ios": {
        title: "MobTech en iOS",
        description: "Flujo principal, navegación y seguimiento en el mapa.",
        tag: "iOS",
      },
      "mobtech-android": {
        title: "MobTech en Android",
        description: "Interacciones, estado del viaje y seguimiento en tiempo real.",
        tag: "Android",
      },
      "ipuy-light": {
        title: "IPUY en tema claro",
        description: "Diseño, responsividad y detalles de UI.",
        tag: "Claro",
      },
      "ipuy-dark": {
        title: "IPUY en tema oscuro",
        description: "Consistencia del tema en todas las secciones.",
        tag: "Oscuro",
      },
    },
  },
  skills: {
    title: "Habilidades",
    subtitle: "Las herramientas que más uso, y cómo trabajo con las personas.",
    legend: "Leyenda",
    groups: {
      frontend: "Frontend",
      mobile: "Mobile",
      backend: "Backend",
      data: "Datos",
      cloud: "Cloud y herramientas",
    },
    softTitle: "Cómo trabajo",
    soft: {
      collaboration: {
        label: "Colaboración",
        description: "Trabajando con otras personas",
        items: ["Comunicación", "Trabajo en equipo", "Empatía", "Compartir conocimiento", "Conciencia multicultural"],
      },
      mindset: {
        label: "Mentalidad",
        description: "Cómo me presento",
        items: ["Sentido de dueño", "Responsabilidad", "Resiliencia", "Proactividad", "Atención al detalle"],
      },
      growth: {
        label: "Crecimiento",
        description: "Cómo sigo mejorando",
        items: ["Resolución de problemas", "Aprendo rápido", "Adaptabilidad", "Pensamiento crítico", "Creatividad"],
      },
    },
  },
  contact: {
    title: "Construyamos algo bueno juntos.",
    subtitle:
      "Estoy construyendo en LetsPic y sigo abierto a escuchar propuestas, proyectos freelance o simplemente una buena charla.",
    copyEmail: "Copiar correo",
    copied: "Copiado",
    labels: {
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
      email: "Correo",
      instagram: "Instagram",
      github: "GitHub",
    },
  },
  footer: {
    made: "Diseñado y desarrollado por Calebe",
    top: "Volver arriba",
  },
};
