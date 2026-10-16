// File: src/i18n/dictionaries/pt.ts
import type { Dictionary } from "./en";

export const pt: Dictionary = {
  meta: {
    title: "Calebe Dev",
    description:
      "Calebe Rodrigues Rolim, engenheiro de software e desenvolvedor full-stack na LetsPic. Construo produtos web e mobile de ponta a ponta.",
  },
  nav: {
    home: "Início",
    experience: "Experiência",
    projects: "Projetos",
    skills: "Skills",
    contact: "Contato",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    toLight: "Mudar para o tema claro",
    toDark: "Mudar para o tema escuro",
    language: "Mudar idioma",
  },
  hero: {
    greeting: "Oi, eu sou o",
    role: "Desenvolvedor full-stack na LetsPic",
    tagline:
      "Construo produtos web e mobile de ponta a ponta, do banco de dados ao último pixel da interface.",
    bio: "Gosto de UI limpa, UX prática e de desatar problemas difíceis. Fora da tela, você me encontra numa quadra de basquete, assistindo anime ou planejando a próxima viagem. A meta é conhecer todos os países um dia.",
    nowLabel: "Agora",
    now: "Construindo ferramentas de fotos e álbuns na LetsPic",
    open: "Aberto a ouvir propostas",
    ctaWork: "Ver meu trabalho",
    ctaContact: "Fale comigo",
    portraitAlt: "Retrato do Calebe",
    ringsCaption: "Cada anel é um ano construindo",
  },
  experience: {
    title: "Experiência",
    subtitle: "Onde tenho construído, do mais recente ao mais antigo.",
    current: "Atual",
    builtLabel: "O que construí",
    stackLabel: "Stack",
    jobs: {
      letspic: {
        org: "LetsPic",
        role: "Desenvolvedor full-stack júnior",
        period: "Fev 2026 — atual",
        kind: "Startup de fotografia e eventos",
        summary:
          "A LetsPic atende empresas de fotografia e eventos, principalmente de formaturas. Com reconhecimento facial, backup online e tratamento de imagens, automatizamos o trabalho pesado para que elas entreguem mais rápido e surpreendam seus clientes.",
        detail:
          "Trabalho na stack inteira: backend, banco de dados e frontend, com deploy no Azure Static Web Apps e no Google Cloud.",
      },
      freelance: {
        org: "Freelance",
        role: "Desenvolvedor web",
        period: "Dez 2025 — Jan 2026",
        kind: "Independente",
        summary:
          "Logo depois de me formar, desenhei, desenvolvi, vendi e coloquei no ar dois sites do zero em dois meses: um para uma igreja no Uruguai e outro para uma farmácia de manipulação no Brasil.",
      },
      university: {
        org: "Engenharia de Software",
        role: "Bacharelado",
        period: "Formado em dez 2025",
        kind: "Universidade",
        summary:
          "Meu TCC foi o MobTech, um aplicativo de mobilidade urbana baseado em dados geoespaciais, com rastreamento em tempo real e fluxos de viagem no mapa. O app ainda não está finalizado.",
      },
    },
    products: {
      album: {
        name: "Diagramador de álbuns",
        description:
          "Diagrama e edita álbuns de fotos: crop e as edições do dia a dia, uma prévia interativa de como cada lâmina está ficando e a montagem automática do álbum com IA.",
      },
      crm: {
        name: "CRM interno",
        description:
          "Um funil de vendas para o time, inspirado no Pipedrive, para acompanhar cada negócio do primeiro contato ao fechamento.",
      },
    },
    album: {
      autoLayout: "Organizar com IA",
      reset: "Bagunçar",
      arranging: "Organizando…",
      arranged: "Lâmina organizada",
      spread: "Lâmina",
    },
    crm: {
      stages: ["Lead", "Contatado", "Proposta", "Ganho"],
      deals: ["Turma 2026", "Estúdio Luz", "Medicina"],
      advance: "Avançar um negócio",
    },
  },
  projects: {
    title: "Projetos",
    subtitle: "Coisas que desenhei, construí e coloquei no ar.",
    production: "No ar",
    development: "Em desenvolvimento",
    roleLabel: "Meu papel",
    repo: "Ver repositório",
    visit: "Visitar site",
    playVideo: "Reproduzir vídeo",
    closeVideo: "Fechar vídeo",
    close: "Fechar",
    items: {
      voltaaflora: {
        title: "Volta à Flora",
        tagline: "Site para uma farmácia de manipulação",
        description:
          "Uma farmácia de Anápolis com mais de 40 anos de história precisava de um lugar na internet. Eu desenhei, desenvolvi, vendi e fiz o deploy: a história e a equipe, um fluxo de solicitação de fórmulas e contato direto por WhatsApp, telefone e e-mail.",
        role: "Freelance, do design ao deploy",
        year: "2026",
      },
      ipuy: {
        title: "IPUY",
        tagline: "Site institucional com tema claro e escuro",
        description:
          "Site da Iglesia Presbiteriana del Uruguay, com layouts responsivos, temas completos e seções de conteúdo claras. Pensado para clareza e acessibilidade em qualquer dispositivo.",
        role: "Freelance, desenvolvedor frontend",
        year: "2025",
      },
      mobtech: {
        title: "MobTech",
        tagline: "App de mobilidade urbana para iOS e Android",
        description:
          "Meu TCC: um app multiplataforma de rastreamento em tempo real e fluxos de viagem, movido por dados geoespaciais. Feito com React Native e Expo, com interações no mapa e sensação nativa nas duas plataformas.",
        role: "Desenvolvedor mobile, TCC",
        year: "2024 — 2025",
      },
    },
    videos: {
      "voltaaflora-mobile": {
        title: "Volta à Flora no celular",
        description: "A página inteira, do início ao fim, num iPhone.",
        tag: "iPhone",
      },
      "mobtech-ios": {
        title: "MobTech no iOS",
        description: "Fluxo principal, navegação e rastreamento no mapa.",
        tag: "iOS",
      },
      "mobtech-android": {
        title: "MobTech no Android",
        description: "Interações, status da viagem e rastreamento em tempo real.",
        tag: "Android",
      },
      "ipuy-light": {
        title: "IPUY no tema claro",
        description: "Layout, responsividade e detalhes de UI.",
        tag: "Claro",
      },
      "ipuy-dark": {
        title: "IPUY no tema escuro",
        description: "Consistência do tema em todas as seções.",
        tag: "Escuro",
      },
    },
  },
  skills: {
    title: "Skills",
    subtitle: "As ferramentas que mais uso, e como trabalho com pessoas.",
    legend: "Legenda",
    groups: {
      frontend: "Frontend",
      mobile: "Mobile",
      backend: "Backend",
      data: "Dados",
      cloud: "Cloud e ferramentas",
    },
    softTitle: "Como eu trabalho",
    soft: {
      collaboration: {
        label: "Colaboração",
        description: "Trabalhando com outras pessoas",
        items: ["Comunicação", "Trabalho em equipe", "Empatia", "Compartilhar conhecimento", "Consciência multicultural"],
      },
      mindset: {
        label: "Mentalidade",
        description: "Como eu me posiciono",
        items: ["Senso de dono", "Responsabilidade", "Resiliência", "Proatividade", "Atenção aos detalhes"],
      },
      growth: {
        label: "Crescimento",
        description: "Como continuo melhorando",
        items: ["Resolução de problemas", "Aprendo rápido", "Adaptabilidade", "Pensamento crítico", "Criatividade"],
      },
    },
  },
  contact: {
    title: "Vamos construir algo bom juntos.",
    subtitle:
      "Estou construindo na LetsPic e continuo aberto a ouvir propostas, projetos freelance ou simplesmente uma boa conversa.",
    copyEmail: "Copiar e-mail",
    copied: "Copiado",
    labels: {
      linkedin: "LinkedIn",
      whatsapp: "WhatsApp",
      email: "E-mail",
      instagram: "Instagram",
      github: "GitHub",
    },
  },
  footer: {
    made: "Desenhado e desenvolvido pelo Calebe",
    top: "Voltar ao topo",
  },
};
