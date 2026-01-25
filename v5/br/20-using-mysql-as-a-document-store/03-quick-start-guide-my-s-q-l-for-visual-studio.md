## 19.3 Guia de Início Rápido: MySQL para Visual Studio

Esta seção explica como usar o MySQL Shell para criar scripts de um server usando o MySQL para Visual Studio.

### Introdução

O MySQL para Visual Studio fornece acesso a objetos e dados MySQL sem forçar os desenvolvedores a sair do Visual Studio. Projetado e desenvolvido como um pacote do Visual Studio, o MySQL para Visual Studio integra-se diretamente ao Server Explorer, proporcionando uma experiência contínua para configurar novas Connections e trabalhar com objetos de Database.

Os seguintes recursos do MySQL para Visual Studio estão disponíveis a partir da versão 2.0.2:

* Editores de código JavaScript e Python, onde scripts nessas linguagens podem ser executados para fazer Query de dados de um Database MySQL.

* Melhor integração com o Server Explorer para abrir editores de código MySQL, JavaScript e Python diretamente de uma instância MySQL conectada.

* Uma interface de usuário mais recente para exibir resultados de Query, onde diferentes Views são apresentadas a partir de conjuntos de resultados retornados por um MySQL Server, como:

  + Múltiplas abas para cada conjunto de resultados retornado por uma Query executada.

  + Results view (Visualização de Resultados), onde a informação pode ser vista em representação de grid, tree ou texto para resultados JSON.

  + Field types view (Visualização de Tipos de Campo), onde informações sobre as colunas de um conjunto de resultados são mostradas, tais como nomes, data types, character sets e mais.

  + Query statistics view (Visualização de Estatísticas de Query), exibindo informações sobre a Query executada, como tempos de execução, linhas processadas, uso de Index e tabelas temporárias, e mais.

  + Execution plan view (Visualização de Plano de Execução), exibindo uma explicação da execução da Query feita internamente pelo MySQL Server.

### Primeiros Passos

Os requisitos são MySQL para Visual Studio 2.0.2 ou superior, e Visual Studio 2010 ou superior. O suporte ao X DevAPI requer o MySQL Server 5.7.12 ou superior com o plugin X habilitado.

### Abrindo um Editor de Código

Antes de abrir um editor de código que possa executar Queries em um MySQL server, uma Connection precisa ser estabelecida:

1. Abra o painel Server Explorer através do menu View, ou com **Control** + **W**, **K**.

2. Clique com o botão direito no nó Data Connections, selecione Add Connection....

3. No diálogo Add Connection, certifique-se de que o MySQL Data Provider está sendo usado e preencha todas as informações.

   Nota

   Para inserir o número da porta, clique em Advanced... e defina a Port entre a lista de propriedades de Connection.

4. Clique em Test Connection para garantir que você tenha uma Connection válida, e então clique em OK.

5. Clique com o botão direito em sua Connection recém-criada, selecione New MySQL Script e, em seguida, a linguagem para o editor de código que você deseja abrir.

Para Connections MySQL existentes, para criar um novo editor, você só precisa realizar o último passo.

### Usando o Editor de Código

Os editores de script MySQL têm uma barra de ferramentas no início onde as informações sobre a Session são exibidas, juntamente com as ações que podem ser executadas.

Nota

Note que os primeiros dois botões na barra de ferramentas representam uma forma de conectar ou desconectar de um MySQL server. Se o editor foi aberto a partir do Server Explorer, a Connection já deve estar estabelecida para a nova janela do editor.

O terceiro botão é o botão Run. O script contido na janela do editor é executado ao clicar nele, e os resultados da execução do script são exibidos abaixo da janela do script.

Nota

Alguns comandos no MySQL Shell podem ser executados sem anexar **execute()** enquanto estiverem em modo interativo. No MySQL para Visual Studio, esses comandos exigem **execute()**. Em outras palavras, anexe ".execute()" para executar comandos.
