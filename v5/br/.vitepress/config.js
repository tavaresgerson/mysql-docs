import sidebar from "./sidebar";
import { defineConfig } from 'vitepress'

export default defineConfig({
  // site-level options
  title: 'MySQL 5.7',
  description: '',
  lang: 'pt-BR',
  base: '/mysql/5/',
  head: [
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Ubuntu:ital,wght@0,100..900;1,100..900&display=swap', rel: 'stylesheet' }
    ],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  ignoreDeadLinks: true,
  sitemap: {
    hostname: 'https://tavares.in/mysql/5/',
  },
  markdown: {
    config: (md) => {
      // Regra para escapar sintaxe Vue em tokens de texto antes da renderização.
      // Isso protege a maioria dos operadores SQL e chaves de interpolação.
      md.core.ruler.push('escape_vue_syntax', (state) => {
        state.tokens.forEach((token) => {
          if (token.type === 'inline') {
            token.children.forEach((child) => {
              if (child.type === 'text') {
                // Escapa chaves duplas
                child.content = child.content.replace(/{{/g, '&#123;&#123;')
                // Escapa '<' apenas se seguido de letra (potencial tag Vue)
                child.content = child.content.replace(/<([a-zA-Z])/g, '&lt;$1')
              }
            })
          }
        })
      })
    }
  },

  // Injeção de v-pre durante a geração do HTML.
  // Esta é a forma mais segura de evitar que o Vue tente compilar o conteúdo do Markdown
  // sem interferir nos componentes do tema (como Header, Sidebar e Home).
  async transformHtml(code) {
    // Injeta v-pre na div que contém o conteúdo do documento.
    // Isso faz com que o Vue trate o conteúdo traduzido como texto estático.
    return code.replace('<div class="vp-doc"', '<div v-pre class="vp-doc"')
  },

  themeConfig: {
    returnToTopLabel: 'Retornar ao Topo',
    lightModeSwitchTitle: 'Trocar para tema claro',
    darkModeSwitchTitle: 'Trocar para tema escuro',
    darkModeSwitchLabel: 'Aparência',
    editLink: {
      pattern: ({ filePath }) => {
        return `https://github.com/tavaresgerson/mysql-docs/edit/v5/br/${filePath}`
      },
      text: 'Corrigir isso no GitHub'
    },
    outline: {
      label: 'Nesta página',
      level: 'deep'
    },
    // theme-level options
    logo: { light: '/header_logo.svg', dark: '/header_logo.svg' },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/tavaresgerson/mysql-docs' },
    ],
    search: {
      provider: 'local',
      options: {
        placeholder: 'Pesquisar',
      }
    },
    docFooter: {
      prev: 'Página anterior',
      next: 'Próxima página'
    },
    sidebar: sidebar
  },
})
