## 1.5 Como Reportar Bugs ou Problemas

Antes de postar um relatório de bug sobre um problema, tente verificar se é realmente um bug e se ele já não foi reportado:

* Comece pesquisando o manual online do MySQL em https://dev.mysql.com/doc/. Tentamos manter o manual atualizado, revisando-o frequentemente com soluções para problemas recém-descobertos. Além disso, as *release notes* (notas de lançamento) que acompanham o manual podem ser particularmente úteis, pois é bem possível que uma versão mais nova contenha uma solução para o seu problema. As *release notes* estão disponíveis no local indicado para o manual.

* Se você receber um *parse error* (erro de análise) para uma instrução SQL, verifique sua sintaxe atentamente. Se você não conseguir encontrar nada de errado, é extremamente provável que sua versão atual do MySQL Server não suporte a sintaxe que você está usando. Se você estiver usando a versão atual e o manual não cobrir a sintaxe que você está usando, o MySQL Server não suporta sua instrução.

  Se o manual cobrir a sintaxe que você está usando, mas você tiver uma versão mais antiga do MySQL Server, você deve verificar o histórico de mudanças do MySQL para ver quando a sintaxe foi implementada. Neste caso, você tem a opção de fazer um *upgrade* para uma versão mais nova do MySQL Server.

* Para soluções para alguns problemas comuns, veja Seção B.3, “Problemas e Erros Comuns”.

* Pesquise no *bugs database* (banco de dados de bugs) em <http://bugs.mysql.com/> para ver se o bug foi reportado e corrigido.

* Você também pode usar <http://www.mysql.com/search/> para pesquisar todas as páginas Web (incluindo o manual) que estão localizadas no *website* do MySQL.

Se você não conseguir encontrar uma resposta no manual, no *bugs database* ou nos arquivos da lista de e-mail, consulte seu especialista local em MySQL. Se você ainda não conseguir encontrar uma resposta para sua pergunta, use as seguintes diretrizes para reportar o bug.

A maneira normal de reportar bugs é visitando <http://bugs.mysql.com/>, que é o endereço do nosso *bugs database*. Este Database é público e pode ser navegado e pesquisado por qualquer pessoa. Se você fizer *login* no sistema, poderá inserir novos relatórios.

Os bugs postados no *bugs database* em <http://bugs.mysql.com/> que são corrigidos para um determinado lançamento são observados nas *release notes*.

Se você encontrar um *security bug* (bug de segurança) no MySQL Server, informe-nos imediatamente enviando um e-mail para `<secalert_us@oracle.com>`. Exceção: Clientes de Suporte devem reportar todos os problemas, incluindo *security bugs*, ao Oracle Support em <http://support.oracle.com/>.

Para discutir problemas com outros usuários, você pode usar o [MySQL Community Slack](https://mysqlcommunity.slack.com/).

Escrever um bom relatório de bug requer paciência, mas fazê-lo corretamente na primeira vez economiza tempo tanto para nós quanto para você. Um bom relatório de bug, contendo um *test case* completo para o bug, torna muito provável que corrigiremos o bug no próximo lançamento. Esta seção ajuda você a escrever seu relatório corretamente, para que você não perca tempo fazendo coisas que podem não nos ajudar muito ou em nada. Por favor, leia esta seção cuidadosamente e certifique-se de que todas as informações descritas aqui estejam incluídas em seu relatório.

De preferência, você deve testar o problema usando a versão de produção ou desenvolvimento mais recente do MySQL Server antes de postar. Qualquer pessoa deve ser capaz de repetir o bug usando apenas `mysql test < script_file` no seu *test case* ou executando o *script* shell ou Perl que você incluir no relatório de bug. Qualquer bug que pudermos repetir tem uma grande chance de ser corrigido no próximo lançamento do MySQL.

É muito útil que uma boa descrição do problema seja incluída no relatório de bug. Ou seja, forneça um bom exemplo de tudo o que você fez que levou ao problema e descreva, em detalhes exatos, o problema em si. Os melhores relatórios são aqueles que incluem um exemplo completo mostrando como reproduzir o bug ou problema. Consulte a Seção 5.8, “Debugging MySQL”.

Lembre-se de que é possível respondermos a um relatório que contém informações demais, mas não a um que contenha informações de menos. As pessoas frequentemente omitem fatos porque pensam saber a causa de um problema e presumem que alguns detalhes não importam. Um bom princípio a seguir é que, se você tiver dúvidas sobre declarar algo, declare-o. É mais rápido e menos problemático escrever mais algumas linhas em seu relatório do que esperar mais tempo pela resposta se precisarmos solicitar que você forneça informações que estavam faltando no relatório inicial.

Os erros mais comuns cometidos em relatórios de bug são (a) não incluir o número da versão da distribuição MySQL que você usa e (b) não descrever totalmente a *platform* na qual o MySQL Server está instalado (incluindo o tipo e o número da versão da *platform*). Estas são informações altamente relevantes e, em 99 casos em 100, o relatório de bug é inútil sem elas. Muitas vezes recebemos perguntas como: “Por que isso não funciona para mim?” Então, descobrimos que o recurso solicitado não foi implementado naquela versão do MySQL, ou que um bug descrito em um relatório foi corrigido em versões mais novas do MySQL. Os erros geralmente dependem da *platform*. Nesses casos, é quase impossível corrigirmos algo sem saber o *operating system* e o número da versão da *platform*.

Se você compilou o MySQL a partir do *source*, lembre-se também de fornecer informações sobre o seu *compiler* se isso estiver relacionado ao problema. Frequentemente, as pessoas encontram bugs nos *compilers* e pensam que o problema está relacionado ao MySQL. A maioria dos *compilers* está em desenvolvimento o tempo todo e melhoram versão após versão. Para determinar se o seu problema depende do seu *compiler*, precisamos saber qual *compiler* você usou. Observe que todo problema de compilação deve ser considerado um bug e reportado como tal.

Se um programa produzir uma *error message* (mensagem de erro), é muito importante incluir a mensagem em seu relatório. Se tentarmos pesquisar algo nos arquivos, é melhor que a *error message* reportada corresponda exatamente àquela que o programa produz. (Até mesmo o uso de maiúsculas e minúsculas deve ser observado.) É melhor copiar e colar toda a *error message* em seu relatório. Você nunca deve tentar reproduzir a mensagem de memória.

Se você tiver um problema com o Connector/ODBC (MyODBC), tente gerar um *trace file* e envie-o com seu relatório. Consulte Como Reportar Problemas ou Bugs do Connector/ODBC.

Se o seu relatório incluir longas linhas de saída de Query de *test cases* que você executa com a ferramenta de linha de comando **mysql**, você pode tornar a saída mais legível usando a opção `--vertical` ou o terminador de instrução `\G`. O exemplo `EXPLAIN SELECT` mais adiante nesta seção demonstra o uso de `\G`.

Por favor, inclua as seguintes informações em seu relatório:

* O número da versão da distribuição MySQL que você está usando (por exemplo, MySQL 5.7.10). Você pode descobrir qual versão está executando ao executar **mysqladmin version**. O programa **mysqladmin** pode ser encontrado no diretório `bin` sob seu diretório de instalação do MySQL.

* O fabricante e o modelo da máquina na qual você está experimentando o problema.

* O nome e a versão do *operating system*. Se você trabalha com Windows, geralmente pode obter o nome e o número da versão clicando duas vezes no ícone Meu Computador e acessando o menu “Ajuda/Sobre o Windows”. Para a maioria dos *operating systems* tipo Unix, você pode obter esta informação executando o comando `uname -a`.

* Às vezes, a quantidade de *memory* (real e virtual) é relevante. Em caso de dúvida, inclua esses valores.

* O conteúdo do arquivo `docs/INFO_BIN` da sua instalação do MySQL. Este arquivo contém informações sobre como o MySQL foi configurado e compilado.

* Se você estiver usando uma distribuição *source* do software MySQL, inclua o nome e o número da versão do *compiler* que você usou. Se você tiver uma distribuição *binary*, inclua o nome da distribuição.

* Se o problema ocorrer durante a compilação, inclua as *error messages* exatas e também algumas linhas de contexto ao redor do código problemático no arquivo onde o erro ocorre.

* Se o **mysqld** falhou (*died*), você também deve reportar a instrução que fez com que o **mysqld** fosse encerrado inesperadamente. Você geralmente pode obter esta informação executando o **mysqld** com o *query logging* ativado e, em seguida, verificando o *log* após o encerramento do **mysqld**. Consulte a Seção 5.8, “Debugging MySQL”.

* Se uma *Database Table* estiver relacionada ao problema, inclua a saída da instrução `SHOW CREATE TABLE db_name.tbl_name` no relatório de bug. Esta é uma maneira muito fácil de obter a definição de qualquer *table* em um *Database*. A informação nos ajuda a criar uma situação correspondente à que você experimentou.

* O *SQL mode* em vigor quando o problema ocorreu pode ser significativo, portanto, reporte o valor da variável de sistema `sql_mode`. Para objetos de *stored procedure*, *stored function* e *trigger*, o valor `sql_mode` relevante é aquele em vigor quando o objeto foi criado. Para uma *stored procedure* ou *function*, a instrução `SHOW CREATE PROCEDURE` ou `SHOW CREATE FUNCTION` mostra o *SQL mode* relevante, ou você pode consultar o `INFORMATION_SCHEMA` para obter a informação:

  ```sql
  SELECT ROUTINE_SCHEMA, ROUTINE_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.ROUTINES;
  ```

  Para *triggers*, você pode usar esta instrução:

  ```sql
  SELECT EVENT_OBJECT_SCHEMA, EVENT_OBJECT_TABLE, TRIGGER_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.TRIGGERS;
  ```

* Para bugs relacionados a *performance* ou problemas com instruções `SELECT`, você deve sempre incluir a saída de `EXPLAIN SELECT ...`, e pelo menos o número de linhas que a instrução `SELECT` produz. Você também deve incluir a saída de `SHOW CREATE TABLE tbl_name` para cada *table* envolvida. Quanto mais informações você fornecer sobre sua situação, maior a probabilidade de que alguém possa ajudá-lo.

  O seguinte é um exemplo de um relatório de bug muito bom. As instruções são executadas usando a ferramenta de linha de comando **mysql**. Observe o uso do terminador de instrução `\G` para instruções que, de outra forma, forneceriam linhas de saída muito longas e difíceis de ler.

  ```sql
  mysql> SHOW VARIABLES;
  mysql> SHOW COLUMNS FROM ...\G
         <output from SHOW COLUMNS>
  mysql> EXPLAIN SELECT ...\G
         <output from EXPLAIN>
  mysql> FLUSH STATUS;
  mysql> SELECT ...;
         <A short version of the output from SELECT,
         including the time taken to run the query>
  mysql> SHOW STATUS;
         <output from SHOW STATUS>
  ```

* Se um bug ou problema ocorrer enquanto o **mysqld** estiver sendo executado, tente fornecer um *input script* que reproduza a anomalia. Este *script* deve incluir quaisquer arquivos *source* necessários. Quanto mais de perto o *script* puder reproduzir sua situação, melhor. Se você puder criar um *test case* reproduzível, você deve fazer o *upload* dele para ser anexado ao relatório de bug.

  Se você não puder fornecer um *script*, você deve incluir pelo menos a saída de **mysqladmin variables extended-status processlist** em seu relatório para fornecer algumas informações sobre como seu sistema está performando.

* Se você não puder produzir um *test case* com apenas algumas linhas, ou se a *test table* for muito grande para ser incluída no relatório de bug (mais de 10 linhas), você deve fazer um *dump* de suas *tables* usando **mysqldump** e criar um arquivo `README` que descreva seu problema. Crie um arquivo compactado de seus arquivos usando **tar** e **gzip** ou **zip**. Depois de iniciar um relatório de bug para o nosso *bugs database* em <http://bugs.mysql.com/>, clique na aba Files no relatório de bug para obter instruções sobre como fazer o *upload* do arquivo para o *bugs database*.

* Se você acredita que o MySQL Server produz um resultado estranho a partir de uma instrução, inclua não apenas o resultado, mas também sua opinião sobre qual deveria ser o resultado, e uma explicação descrevendo a base para sua opinião.

* Ao fornecer um exemplo do problema, é melhor usar os *table names*, *variable names* e assim por diante que existem em sua situação real, em vez de criar novos nomes. O problema pode estar relacionado ao nome de uma *table* ou *variable*. Estes casos são raros, talvez, mas é melhor prevenir do que remediar. Afinal, deve ser mais fácil para você fornecer um exemplo que use sua situação real, e é, sem dúvida, melhor para nós. Se você tiver *data* que não deseja que seja visível para outros no relatório de bug, você pode fazer o *upload* usando a aba Files, conforme descrito anteriormente. Se a informação for realmente ultrassecreta e você não quiser mostrá-la nem mesmo para nós, siga em frente e forneça um exemplo usando outros nomes, mas por favor, considere esta como a última opção.

* Inclua todas as opções fornecidas aos programas relevantes, se possível. Por exemplo, indique as opções que você usa ao iniciar o servidor **mysqld**, bem como as opções que você usa para executar quaisquer programas *client* MySQL. As opções para programas como **mysqld** e **mysql**, e para o *script* **configure**, são frequentemente a chave para resolver problemas e são muito relevantes. Nunca é uma má ideia incluí-las. Se o seu problema envolver um programa escrito em uma linguagem como Perl ou PHP, inclua o número da versão do processador da linguagem, bem como a versão de quaisquer *modules* que o programa utilize. Por exemplo, se você tem um *script* Perl que usa os *modules* `DBI` e `DBD::mysql`, inclua os números de versão para Perl, `DBI` e `DBD::mysql`.

* Se sua pergunta estiver relacionada ao *privilege system* (sistema de privilégios), inclua a saída de **mysqladmin reload** e todas as *error messages* que você obtiver ao tentar se conectar. Ao testar seus privilégios, você deve executar **mysqladmin reload version** e tentar se conectar com o programa que está lhe causando problemas.

* Se você tiver um *patch* para um bug, inclua-o. Mas não presuma que o *patch* é tudo de que precisamos, ou que podemos usá-lo, se você não fornecer algumas informações necessárias, como *test cases* mostrando o bug que seu *patch* corrige. Podemos encontrar problemas com o seu *patch* ou podemos não entendê-lo de forma alguma. Se for esse o caso, não poderemos usá-lo.

  Se não pudermos verificar o propósito exato do *patch*, não o usaremos. Os *test cases* nos ajudam nisso. Mostre que o *patch* lida com todas as situações que podem ocorrer. Se encontrarmos um caso limite (mesmo que raro) em que o *patch* não funcionará, ele pode ser inútil.

* Palpites sobre o que é o bug, por que ele ocorre ou do que ele depende geralmente estão errados. Mesmo a equipe MySQL não consegue adivinhar tais coisas sem primeiro usar um *debugger* para determinar a causa real de um bug.

* Indique em seu relatório de bug que você verificou o manual de referência e o arquivo de e-mail para que outros saibam que você tentou resolver o problema por conta própria.

* Se seus *data* parecerem corrompidos ou você receber *errors* ao acessar uma *table* específica, primeiro verifique suas *tables* com `CHECK TABLE`. Se esta instrução reportar quaisquer *errors*:

  + O mecanismo de *crash recovery* do `InnoDB` lida com a limpeza quando o *server* é reiniciado após ser encerrado, portanto, na operação típica, não há necessidade de "reparar" *tables*. Se você encontrar um *error* com *tables* `InnoDB`, reinicie o *server* e veja se o problema persiste ou se o *error* afetou apenas *data* em *memory* armazenados em *cache*. Se os *data* estiverem corrompidos no disco, considere reiniciar com a opção `innodb_force_recovery` ativada para que você possa fazer o *dump* das *tables* afetadas.

  + Para *tables* não transacionais, tente repará-las com `REPAIR TABLE` ou com **myisamchk**. Consulte o Capítulo 5, *MySQL Server Administration*.

  Se você estiver executando Windows, verifique o valor de `lower_case_table_names` usando a instrução `SHOW VARIABLES LIKE 'lower_case_table_names'`. Esta *variable* afeta como o *server* lida com o uso de maiúsculas e minúsculas em nomes de *Database* e *table*. Seu efeito para um determinado valor deve ser conforme descrito na Seção 9.2.3, “Identifier Case Sensitivity”.

* Se você frequentemente obtém *tables* corrompidas, você deve tentar descobrir quando e por que isso acontece. Neste caso, o *error log* no diretório de *data* do MySQL pode conter algumas informações sobre o que aconteceu. (Este é o arquivo com o sufixo `.err` no nome.) Consulte a Seção 5.4.2, “The Error Log”. Por favor, inclua qualquer informação relevante deste arquivo em seu relatório de bug. Normalmente, o **mysqld** *nunca* deve corromper uma *table* se nada o tiver encerrado no meio de um *update*. Se você puder encontrar a causa da falha do **mysqld**, é muito mais fácil para nós fornecer uma correção para o problema. Consulte a Seção B.3.1, “How to Determine What Is Causing a Problem”.

* Se possível, faça o *download* e instale a versão mais recente do MySQL Server e verifique se ela resolve seu problema. Todas as versões do software MySQL são testadas exaustivamente e devem funcionar sem problemas. Acreditamos em tornar tudo o mais *backward-compatible* possível, e você deve ser capaz de alternar as versões do MySQL sem dificuldade. Consulte a Seção 2.1.2, “Which MySQL Version and Distribution to Install”.