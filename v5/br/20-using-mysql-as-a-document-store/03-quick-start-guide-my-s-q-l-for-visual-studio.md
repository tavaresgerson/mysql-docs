## 19.3 Guia de início rápido: MySQL para Visual Studio

Esta seção explica como usar o MySQL Shell para criar um script de servidor usando o MySQL para o Visual Studio.

### Introdução

O MySQL para o Visual Studio oferece acesso a objetos e dados do MySQL sem forçar os desenvolvedores a sair do Visual Studio. Projetado e desenvolvido como um pacote do Visual Studio, o MySQL para o Visual Studio se integra diretamente ao Explorador do Servidor, proporcionando uma experiência contínua para configurar novas conexões e trabalhar com objetos do banco de dados.

As seguintes funcionalidades do MySQL para o Visual Studio estão disponíveis a partir da versão 2.0.2:

- Editores de código em JavaScript e Python, onde scripts nesses idiomas podem ser executados para consultar dados de um banco de dados MySQL.

- Melhoria da integração com o Explorador de Servidor para abrir editores de código MySQL, JavaScript e Python diretamente a partir de uma instância MySQL conectada.

- Uma interface de usuário mais recente para exibir os resultados das consultas, onde diferentes visualizações são apresentadas a partir dos conjuntos de resultados retornados por um servidor MySQL, como:

  - Várias abas para cada conjunto de resultados retornados por uma consulta executada.

  - Visualização dos resultados, onde as informações podem ser exibidas em grade, árvore ou representação de texto para resultados JSON.

  - Exibição do tipo de campo, onde são exibidas informações sobre as colunas de um conjunto de resultados, como nomes, tipos de dados, conjuntos de caracteres e muito mais.

  - Visualização de estatísticas de consulta, exibindo informações sobre a consulta executada, como tempos de execução, linhas processadas, uso de tabelas indexadas e temporárias, entre outros.

  - Visualização do plano de execução, exibindo uma explicação da execução da consulta realizada internamente pelo MySQL Server.

### Começando

Os requisitos são MySQL para o Visual Studio 2.0.2 ou superior e o Visual Studio 2010 ou superior. O suporte ao X DevAPI requer o MySQL Server 5.7.12 ou superior com o plugin X ativado.

### Abrir um Editor de Código

Antes de abrir um editor de código que possa executar consultas contra um servidor MySQL, é necessário estabelecer uma conexão:

1. Abra o painel Explorador de Servidor através do menu Exibir, ou com **Ctrl** + **W**, **K**.

2. Clique com o botão direito no nó Conexões de Dados, selecione Adicionar Conexão....

3. Na caixa de diálogo Adicionar Conexão, certifique-se de que o provedor de dados MySQL está sendo usado e preencha todas as informações.

   Nota

   Para inserir o número do porto, clique em Avançado... e defina o porto entre a lista de propriedades de conexão.

4. Clique em Testar Conexão para garantir que você tenha uma conexão válida, em seguida, clique em OK.

5. Clique com o botão direito do mouse na conexão recém-criada, selecione Novo Script MySQL e, em seguida, a linguagem do editor de código que você deseja abrir.

Para conexões MySQL existentes, para criar um novo editor, você só precisa fazer o último passo.

### Usando o Editor de Código

Os editores de scripts do MySQL têm uma barra de ferramentas no início, onde as informações sobre a sessão são exibidas, juntamente com as ações que podem ser executadas.

Nota

Observe que os dois primeiros botões na barra de ferramentas representam uma maneira de se conectar ou desconectar de um servidor MySQL. Se o editor foi aberto a partir do Explorador de Servidor, a conexão já deve estar estabelecida para a nova janela do editor.

O terceiro botão é o botão Executar, o script contido na janela do editor é executado clicando nele e os resultados da execução do script são exibidos abaixo da janela do script.

Nota

Alguns comandos no MySQL Shell podem ser executados sem adicionar **execute()** no modo interativo. No MySQL para o Visual Studio, esses comandos exigem **execute()**. Em outras palavras, adicione ".execute()" para executar comandos.
