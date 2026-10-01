# SERTÂNIA: DESAFIO DE GESTÃO

Simulador educacional de gestão pública municipal, ambientado em um município fictício inspirado no sertão pernambucano.

> **Aviso:** simulação fictícia e educativa. Não representa a Prefeitura de Sertânia nem pessoas reais. Personagens, partidos, jornal e valores são inventados.

## Como jogar

Governe por 4 anos com recursos limitados: decida diante de eventos aleatórios, negocie com a Câmara, execute projetos e enfrente as consequências, inclusive as que aparecem meses depois. Não existe resposta certa.

## Arquivos (todos na mesma pasta, na raiz do repositório)

| Arquivo | Função |
|---|---|
| `index.html` | telas, modais e carregamento dos scripts |
| `style.css` | visual |
| `game.js` | estado, calendário, interface, balanço, nota e fim do mandato |
| `economy.js` | Economia 2.0: receitas, despesas, déficit, reserva, convênios, emendas, programas |
| `save.js` | salvamento (`sertania_save_v2`, com migração do v1) |
| `news.js` | Tribuna do Mocotó |
| `events.js` | eventos, sorteio e consequências |
| `council.js` | conselheiros, Câmara e votação |
| `projects.js` | projetos e execução |
| `main.js` | botões e inicialização |
| `favicon.svg` | ícone |

A ordem dos scripts no `index.html` importa: `game → economy → save → news → events → council → projects → main`. Não defina o mesmo nome (função ou constante) em dois arquivos: o navegador recusa o arquivo inteiro.

## Executar

Abra o `index.html` no navegador. Não precisa de servidor.

## Publicar no GitHub Pages

1. Envie todos os arquivos para a raiz de um repositório.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. Abra o endereço indicado e use **Ctrl+F5** para limpar o cache.

Se algo falhar ao carregar, uma faixa vermelha no rodapé da página mostra o erro e quais arquivos não carregaram.

Desenvolvido por Serg!n
