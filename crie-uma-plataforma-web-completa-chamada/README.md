# EJMC Vendas

Plataforma web interna para gestão de performance comercial, acompanhamento de evolução, roleplays, competências e feedbacks individuais da EJMC.

## Acesso

- Usuário: `gestor@ejmc.com`
- Senha: `hunter123`
- Também existe o botão `Entrar em modo demonstração`.

## Como abrir

Abra `index.html` no navegador ou rode o servidor local opcional:

```bash
node server.js
```

Depois acesse `http://127.0.0.1:4173`.

## TV Comercial

A TV Comercial fica disponível em:

```text
http://127.0.0.1:4173/tv-comercial
```

Se você estiver com um servidor antigo já aberto, reinicie com `node server.js` para habilitar a rota limpa. Durante o desenvolvimento também é possível abrir `http://127.0.0.1:4173/#tv`.

A tela possui slides automáticos, pausa/continuação, tela cheia, modo escuro, metas mensais, plano de ação da área e alertas coletivos.

## Dados

A primeira versão usa `localStorage` como banco local. Os membros reais já estão cadastrados, com métricas, notas, reuniões e roleplays vazios ou zerados.

## Estrutura

- `index.html`: entrada da aplicação.
- `src/app.js`: estado, rotas, componentes e regras de diagnóstico.
- `src/styles.css`: identidade visual e layout.
- `server.js`: servidor local simples, sem dependências externas.
