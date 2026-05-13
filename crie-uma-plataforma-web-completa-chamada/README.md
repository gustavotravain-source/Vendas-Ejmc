# EJMC Vendas

Plataforma web interna para gestão de performance comercial, acompanhamento de evolução, roleplays, competências e feedbacks individuais da EJMC.

## Acesso

- Usuário: `gestor@ejmc.com`
- Senha: `hunter123`
- Também existe o botão `Entrar em modo demonstração`.

## Como abrir localmente

Você pode abrir `index.html` no navegador ou rodar o servidor local:

```bash
npm start
```

Também continua funcionando com:

```bash
node server.js
```

Depois acesse:

```text
http://127.0.0.1:4173
```

## Scripts

- `npm run dev`: inicia o servidor local.
- `npm start`: inicia o servidor local ou online usando `process.env.PORT`.
- `npm run build`: valida a sintaxe do JavaScript antes do deploy.

## Deploy online recomendado

Para este projeto, a opção mais simples é a Vercel, porque a aplicação é estática e usa `localStorage`. Ela não exige servidor, banco ou instalação no computador do diretor.

Configuração sugerida na Vercel:

- Framework Preset: `Other`
- Build Command: `npm run build`
- Output Directory: `.`

O arquivo `vercel.json` já inclui a rota limpa `/tv-comercial`.

Também é possível publicar no Render como Web Service:

- Build Command: `npm install`
- Start Command: `npm start`
- O servidor já usa `process.env.PORT` e escuta em `0.0.0.0`, como plataformas online exigem.

## TV Comercial

A TV Comercial fica disponível em:

```text
http://127.0.0.1:4173/tv-comercial
```

Durante o desenvolvimento também é possível abrir:

```text
http://127.0.0.1:4173/#tv
```

A tela possui slides automáticos, pausa/continuação, tela cheia, modo escuro, metas mensais, plano de ação da área e alertas coletivos.

## Configurações da Plataforma

A página `Configurações` possui a seção `Nomes das Funcionalidades`, que permite personalizar os nomes visíveis da interface sem mexer no código.

As alterações são salvas em `localStorage`. A estrutura foi separada em:

- configurações padrão: `featureNameDefaults`
- configurações editadas pelo usuário: `state.settings.featureNames`
- função de aplicação visual dos nomes: `featureText`

Essa separação facilita uma futura migração para banco de dados.

## Dados

A primeira versão usa `localStorage` como banco local. Os membros reais já estão cadastrados, com métricas, notas, reuniões e roleplays vazios ou zerados.

## Estrutura

- `index.html`: entrada da aplicação.
- `src/app.js`: estado, rotas, componentes, configurações e regras de diagnóstico.
- `src/styles.css`: identidade visual e layout.
- `server.js`: servidor local/online simples, sem dependências externas.
- `package.json`: scripts para desenvolvimento, start e validação de build.
- `vercel.json`: configuração de rota para deploy estático na Vercel.
