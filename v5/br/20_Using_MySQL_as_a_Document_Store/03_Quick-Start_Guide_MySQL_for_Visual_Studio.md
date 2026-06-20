## Guia de Início Rápido: MySQL para Visual Studio

Esta seção explica como usar o MySQL Shell para criar um script de servidor usando MySQL para o Visual Studio.

### Introdução

O MySQL para o Visual Studio oferece acesso a objetos e dados do MySQL sem forçar os desenvolvedores a deixarem o Visual Studio. Projetado e desenvolvido como um pacote do Visual Studio, o MySQL para o Visual Studio se integra diretamente ao Server Explorer, proporcionando uma experiência perfeita para configurar novas conexões e trabalhar com objetos do banco de dados.

As seguintes funcionalidades do MySQL para o Visual Studio estão disponíveis a partir da versão 2.0.2:

* Editores de código em JavaScript e Python, onde scripts nesses idiomas podem ser executados para consultar dados de um banco de dados MySQL.

* Melhor integração com o Explorador de Servidor para abrir editores de código MySQL, JavaScript e Python diretamente a partir de uma instância de MySQL conectada.

* Uma interface de usuário mais recente para exibir resultados de consulta, onde diferentes visualizações são apresentadas a partir de conjuntos de resultados retornados por um servidor MySQL, como:

+ Múltiplas abas para cada conjunto de resultados retornado por uma consulta executada.

+ Visualização dos resultados, onde as informações podem ser exibidas em representação de grade, árvore ou texto para resultados em formato JSON.

+ Visualização dos tipos de campo, onde são exibidas informações sobre as colunas de um conjunto de resultados, como nomes, tipos de dados, conjuntos de caracteres e mais.

+ Visualização de estatísticas de consulta, exibindo informações sobre a consulta executada, como tempos de execução, strings processadas, uso de tabelas indexadas e temporárias, entre outras.

+ Visualização do plano de execução, que exibe uma explicação da execução da consulta realizada internamente pelo servidor MySQL.

### Começando a usar o aplicativo

Os requisitos são MySQL para o Visual Studio 2.0.2 ou superior e o Visual Studio 2010 ou superior. O suporte X DevAPI requer o MySQL Server 5.7.12 ou superior com o plugin X habilitado.

### Abrir um editor de código

Antes de abrir um editor de código que possa executar consultas contra um servidor MySQL, é necessário estabelecer uma conexão:

1. Abra o painel Explorador de servidor através do menu Exibir, ou com **Ctrl** + **W**, **K**.

2. Clique com o botão direito no nó Conexões de dados, selecione Adicionar Conexão....

3. Na caixa de diálogo Adicionar conexão, certifique-se de que o MySQL Data Provider está sendo usado e preencha todas as informações.

Nota

Para inserir o número do port, clique em Avançado... e defina o Port entre a lista de propriedades de conexão.

4. Clique em Testar Conexão para garantir que você tenha uma conexão válida, em seguida, clique em OK.

5. Clique com o botão direito do mouse na conexão recém-criada, selecione Novo (New) Script MySQL e, em seguida, a linguagem do editor de código que você deseja abrir.

Para conexões existentes do MySQL, para criar um novo editor, você só precisa fazer o último passo.

### Usando o Editor de Código

Os editores de scripts do MySQL têm uma barra de ferramentas no início onde são exibidas informações sobre a sessão, juntamente com as ações que podem ser executadas.

Nota

Observe que os dois primeiros botões na barra de ferramentas representam uma maneira de se conectar ou desconectar de um servidor MySQL. Se o editor foi aberto a partir do Explorador de Servidor, a conexão já deve estar estabelecida para a nova janela do editor.

O terceiro botão é o botão Executar, o script contido na janela do editor é executado clicando nele e os resultados da execução do script são exibidos abaixo da janela do script.

Nota

Alguns comandos no MySQL Shell podem ser executados sem adicionar **execute()** enquanto no modo interativo. No MySQL para o Visual Studio, esses comandos exigem **execute()**. Em outras palavras, adicione ".execute()" para executar comandos.