# Documentação Técnica — Corte Rápido Front

## Visão Geral
- **Nome do projeto:** Corte Rápido Front
- **Propósito:** disponibilizar a interface web de agendamento de serviços de corte de cabelo.
- **Função principal:** coletar dados do cliente, selecionar data/horário e tipo de corte, consultar disponibilidade e registrar agendamentos via API backend.

## Stack Tecnológica
- **Linguagens:** TypeScript, JavaScript, CSS, HTML.
- **Front-end:**
  - React 18
  - Vite 5
  - Axios (cliente HTTP)
  - Tailwind CSS + PostCSS + Autoprefixer
  - Radix UI (componentes base)
  - react-day-picker (calendário)
  - react-input-mask (máscara de telefone)
  - sonner (notificações)
  - lucide-react (ícones)
- **Back-end consumido:** API HTTP externa (`https://corte-rapido-api.onrender.com`).
- **Banco de dados:**
  - Este repositório (front-end) não acessa banco diretamente.
  - A persistência de dados é responsabilidade do backend integrado.
- **Build, versionamento e infraestrutura:**
  - Build: Vite + TypeScript (`tsc -b && vite build`)
  - Qualidade: ESLint 9
  - Versionamento: Git (repositório GitHub)
  - Hospedagem frontend: não definida neste repositório.

## Integrações Externas
- **Corte Rápido API (`https://corte-rapido-api.onrender.com`)**
  - `GET /schedule/available?day=YYYY-MM-DD`: consulta horários disponíveis por dia.
  - `GET /hair-style`: lista tipos de corte e preços.
  - `POST /appointment`: cria agendamento com dados do cliente, horário e corte selecionado.

## Arquitetura do Sistema
- **Padrão arquitetural adotado:** SPA (Single Page Application) em React, orientada a componentes, com consumo de API REST.
- **Descrição textual do fluxo de dados:**
  1. O usuário preenche nome e telefone e escolhe data no calendário.
  2. A aplicação consulta a API de disponibilidade para obter horários livres.
  3. A aplicação consulta a API de estilos para carregar opções de corte e preço.
  4. O usuário seleciona horário e corte.
  5. A aplicação envia o agendamento para a API.
  6. Em sucesso, o front atualiza estado local do horário e exibe feedback visual.
- **Justificativa arquitetural (contexto atual):**
  - Estrutura enxuta para fluxo único de negócio (agendamento).
  - Separação clara entre camada de apresentação (React) e integração HTTP (Axios).
  - Baixa complexidade operacional no front-end, com regras de negócio centrais no backend.

## Contato do Desenvolvedor
- **Responsável técnico:** Damaso Magno
- **Contato:** https://github.com/DamasoMagno
