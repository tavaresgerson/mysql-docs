## 1.5 Como relatar bugs ou problemas

Antes de enviar um relatório de erro sobre um problema, tente verificar se ele é um erro e se não foi relatado anteriormente:

- Comece pesquisando o manual online do MySQL em <https://dev.mysql.com/doc/>. Tentamos manter o manual atualizado, atualizando-o frequentemente com soluções para problemas recém-descobertos. Além disso, as notas de lançamento que acompanham o manual podem ser particularmente úteis, pois é bem possível que uma versão mais recente contenha uma solução para o seu problema. As notas de lançamento estão disponíveis na localização fornecida para o manual.

- Se você receber um erro de análise para uma instrução SQL, verifique a sintaxe cuidadosamente. Se não conseguir encontrar algo errado, é extremamente provável que sua versão atual do MySQL Server não suporte a sintaxe que você está usando. Se você estiver usando a versão atual e o manual não cubra a sintaxe que você está usando, o MySQL Server não suporta a instrução.

  Se o manual abrange a sintaxe que você está usando, mas você tem uma versão mais antiga do MySQL Server, você deve verificar o histórico de alterações do MySQL para ver quando a sintaxe foi implementada. Nesse caso, você tem a opção de atualizar para uma versão mais recente do MySQL Server.

- Para soluções para alguns problemas comuns, consulte a Seção B.3, “Problemas e Erros Comuns”.

- Procure na base de dados de bugs em <http://bugs.mysql.com/> para verificar se o bug foi relatado e corrigido.

- Você também pode usar <http://www.mysql.com/search/> para pesquisar todas as páginas da Web (incluindo o manual) que estão localizadas no site da MySQL.

Se você não encontrar uma resposta no manual, no banco de dados de bugs ou nos arquivos da lista de correio, consulte seu especialista local em MySQL. Se ainda não encontrar uma resposta para sua pergunta, use as seguintes diretrizes para relatar o bug.

A maneira normal de relatar bugs é visitar <http://bugs.mysql.com/>, que é o endereço para nossa base de dados de bugs. Essa base de dados é pública e pode ser consultada e pesquisada por qualquer pessoa. Se você fizer login no sistema, poderá inserir novos relatórios.

Os bugs postados no banco de dados de bugs em <http://bugs.mysql.com/> que são corrigidos para uma determinada versão são mencionados nas notas de lançamento.

Se você encontrar um erro de segurança no MySQL Server, por favor, informe-nos imediatamente enviando uma mensagem de e-mail para `<secalert_us@oracle.com>`. Exceção: os clientes de suporte devem relatar todos os problemas, incluindo erros de segurança, ao Suporte da Oracle em <http://support.oracle.com/>.

Para discutir problemas com outros usuários, você pode usar o [MySQL Community Slack](https://mysqlcommunity.slack.com/).

Escrever um bom relatório de erro exige paciência, mas fazer isso da primeira vez economiza tempo tanto para nós quanto para você. Um bom relatório de erro, que contenha um caso de teste completo para o erro, aumenta muito a probabilidade de que corrigiremos o erro na próxima versão. Esta seção ajuda você a escrever seu relatório corretamente, para que você não desperdice seu tempo fazendo coisas que podem não nos ajudar muito ou nada. Por favor, leia esta seção cuidadosamente e certifique-se de que todas as informações descritas aqui estejam incluídas em seu relatório.

De preferência, você deve testar o problema usando a versão mais recente de produção ou desenvolvimento do MySQL Server antes de postar. Qualquer pessoa deve ser capaz de repetir o erro usando `mysql test < script_file` no seu caso de teste ou executando o script do shell ou Perl que você incluir no relatório do bug. Qualquer bug que conseguirmos repetir tem uma alta chance de ser corrigido na próxima versão do MySQL.

É muito útil quando há uma boa descrição do problema no relatório do erro. Ou seja, dê um bom exemplo de tudo o que você fez que levou ao problema e descreva, com detalhes exatos, o problema em si. Os melhores relatórios são aqueles que incluem um exemplo completo mostrando como reproduzir o erro ou problema. Veja a Seção 5.8, “Depuração do MySQL”.

Lembre-se de que podemos responder a um relatório que contenha muitas informações, mas não a um que contenha poucas. As pessoas frequentemente omitem fatos porque pensam que sabem a causa de um problema e assumem que alguns detalhes não importam. Um bom princípio a seguir é que, se você tiver dúvidas sobre algo, diga. É mais rápido e menos problemático escrever algumas linhas a mais no seu relatório do que esperar mais tempo pela resposta se precisarmos pedir que você forneça informações que estavam faltando no relatório inicial.

Os erros mais comuns cometidos em relatórios de bugs são (a) não incluir o número da versão da distribuição MySQL que você usa e (b) não descrever completamente a plataforma em que o servidor MySQL está instalado (incluindo o tipo da plataforma e o número da versão). Essas são informações altamente relevantes, e, em 99 casos de cada 100, o relatório de bug é inútil sem elas. Muitas vezes, recebemos perguntas como: “Por que isso não funciona para mim?” Então, descobrimos que o recurso solicitado não foi implementado naquela versão do MySQL, ou que um bug descrito em um relatório foi corrigido em versões mais recentes do MySQL. Os erros muitas vezes dependem da plataforma. Nesses casos, é quase impossível para nós corrigirmos algo sem saber o sistema operacional e o número da versão da plataforma.

Se você compilou o MySQL a partir do código-fonte, lembre-se também de fornecer informações sobre seu compilador, se ele estiver relacionado ao problema. Muitas vezes, as pessoas encontram erros nos compiladores e pensam que o problema está relacionado ao MySQL. A maioria dos compiladores está em desenvolvimento o tempo todo e fica melhor versão a versão. Para determinar se o seu problema depende do seu compilador, precisamos saber qual compilador você usou. Note que todo problema de compilação deve ser considerado um bug e relatado conforme necessário.

Se um programa apresentar uma mensagem de erro, é muito importante incluir essa mensagem no seu relatório. Se tentarmos procurar algo nos arquivos, é melhor que a mensagem de erro relatada coincida exatamente com a que o programa apresenta. (Até mesmo a grafia das letras deve ser observada.) É melhor copiar e colar toda a mensagem de erro no seu relatório. Você nunca deve tentar reproduzir a mensagem da memória.

Se você tiver um problema com o Connector/ODBC (MyODBC), tente gerar um arquivo de registro e envie-o junto com seu relatório. Veja Como relatar problemas ou bugs do Connector/ODBC.

Se o seu relatório incluir linhas de saída de consultas longas de casos de teste que você executa com a ferramenta de linha de comando **mysql**, você pode tornar a saída mais legível usando a opção `--vertical` ou o delimitador de declaração `\G`. O exemplo `EXPLAIN SELECT` mais adiante nesta seção demonstra o uso de `\G`.

Por favor, inclua as seguintes informações em seu relatório:

- O número da versão da distribuição MySQL que você está usando (por exemplo, MySQL 5.7.10). Você pode descobrir qual versão está sendo executada executando **mysqladmin versão**. O programa **mysqladmin** pode ser encontrado no diretório `bin` sob o diretório de instalação do MySQL.

- O fabricante e o modelo da máquina em que você está experimentando o problema.

- O nome e a versão do sistema operacional. Se você trabalha com o Windows, geralmente pode obter o nome e o número da versão clicando duas vezes no ícone Meu Computador e puxando para baixo o menu “Ajuda/Sobre o Windows”. Para a maioria dos sistemas operacionais semelhantes ao Unix, você pode obter essas informações executando o comando `uname -a`.

- Às vezes, a quantidade de memória (física e virtual) é relevante. Se houver dúvida, inclua esses valores.

- O conteúdo do arquivo `docs/INFO_BIN` da sua instalação do MySQL. Este arquivo contém informações sobre como o MySQL foi configurado e compilado.

- Se você estiver usando uma distribuição de origem do software MySQL, inclua o nome e o número da versão do compilador que você usou. Se você tiver uma distribuição binária, inclua o nome da distribuição.

- Se o problema ocorrer durante a compilação, inclua as mensagens de erro exatas e também algumas linhas de contexto em torno do código ofensor no arquivo onde o erro ocorre.

- Se o **mysqld** morrer, você também deve relatar a declaração que fez o **mysqld** sair inesperadamente. Geralmente, você pode obter essas informações executando o **mysqld** com o registro de consultas habilitado e, em seguida, procurando no log após o **mysqld** sair. Veja a Seção 5.8, “Depuração do MySQL”.

- Se uma tabela de banco de dados estiver relacionada ao problema, inclua o resultado da instrução `SHOW CREATE TABLE db_name.tbl_name` no relatório do erro. Esta é uma maneira muito fácil de obter a definição de qualquer tabela em um banco de dados. As informações nos ajudam a criar uma situação que corresponda à que você experimentou.

- O modo SQL em vigor quando o problema ocorreu pode ser significativo, portanto, informe o valor da variável de sistema `sql_mode`. Para objetos de procedimentos armazenados, funções armazenadas e gatilhos, o valor relevante de `sql_mode` é o em vigor quando o objeto foi criado. Para um procedimento ou função armazenada, a instrução `SHOW CREATE PROCEDURE` ou `SHOW CREATE FUNCTION` mostra o modo SQL relevante, ou você pode consultar o `INFORMATION_SCHEMA` para obter as informações:

  ```sql
  SELECT ROUTINE_SCHEMA, ROUTINE_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.ROUTINES;
  ```

  Para gatilhos, você pode usar esta declaração:

  ```sql
  SELECT EVENT_OBJECT_SCHEMA, EVENT_OBJECT_TABLE, TRIGGER_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.TRIGGERS;
  ```

- Para bugs relacionados ao desempenho ou problemas com instruções `SELECT`, você deve sempre incluir a saída da instrução `EXPLAIN SELECT ...`, e pelo menos o número de linhas que a instrução `SELECT` produz. Você também deve incluir a saída da instrução `SHOW CREATE TABLE tbl_name` para cada tabela envolvida. Quanto mais informações você fornecer sobre sua situação, maior a probabilidade de alguém conseguir ajudá-lo.

  O exemplo a seguir é de um relatório de erro muito bom. As declarações são executadas usando a ferramenta de linha de comando **mysql**. Observe o uso do delimitador de declaração `\G` para declarações que, de outra forma, fornecem linhas de saída muito longas, difíceis de ler.

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

- Se um erro ou problema ocorrer durante o **mysqld**, tente fornecer um script de entrada que reproduza a anomalia. Esse script deve incluir todos os arquivos de origem necessários. Quanto mais próximo o script puder reproduzir sua situação, melhor. Se você puder criar um caso de teste reproduzível, você deve enviá-lo para anexar ao relatório do bug.

  Se você não puder fornecer um script, deve incluir, no mínimo, a saída do processo **mysqladmin variables extended-status** no seu relatório para fornecer alguma informação sobre o desempenho do seu sistema.

- Se você não conseguir criar um caso de teste com apenas algumas linhas, ou se a tabela de teste for muito grande para ser incluída no relatório de erro (mais de 10 linhas), você deve dumper suas tabelas usando **mysqldump** e criar um arquivo `README` que descreva seu problema. Crie um arquivo compactado de seus arquivos usando **tar** e **gzip** ou **zip**. Após iniciar um relatório de erro para o nosso banco de dados de bugs em <http://bugs.mysql.com/>, clique na aba Arquivos no relatório de erro para obter instruções sobre como fazer o upload do arquivo para o banco de bugs.

- Se você acredita que o servidor MySQL está produzindo um resultado estranho a partir de uma declaração, inclua não apenas o resultado, mas também sua opinião sobre o que o resultado deveria ser, e uma explicação que descreva a base para sua opinião.

- Quando você fornece um exemplo do problema, é melhor usar os nomes das tabelas, nomes de variáveis, etc., que existem na sua situação real do que criar novos nomes. O problema pode estar relacionado ao nome de uma tabela ou variável. Esses casos são raros, talvez, mas é melhor ser cauteloso do que arrependido. Afinal, deve ser mais fácil para você fornecer um exemplo que use sua situação real, e é melhor para nós. Se você tiver dados que você não deseja que sejam visíveis para outros no relatório de bug, você pode fazer o upload usando a aba Arquivos, como descrito anteriormente. Se a informação for realmente de alto sigilo e você não quiser mostrá-la nem para nós, vá em frente e forneça um exemplo usando outros nomes, mas considere isso como a última escolha.

- Inclua todas as opções fornecidas aos programas relevantes, se possível. Por exemplo, indique as opções que você usa ao iniciar o servidor **mysqld**, bem como as opções que você usa para executar quaisquer programas de cliente MySQL. As opções para programas como **mysqld** e **mysql**, e para o script **configure**, muitas vezes são essenciais para resolver problemas e são muito relevantes. Nunca é uma má ideia incluí-las. Se o seu problema envolver um programa escrito em uma linguagem como Perl ou PHP, inclua o número da versão do processador da linguagem, bem como a versão de quaisquer módulos que o programa use. Por exemplo, se você tiver um script Perl que usa os módulos `DBI` e `DBD::mysql`, inclua os números das versões do Perl, `DBI` e `DBD::mysql`.

- Se sua pergunta estiver relacionada ao sistema de privilégios, inclua o resultado do **mysqladmin reload** e todas as mensagens de erro que você receber ao tentar se conectar. Ao testar seus privilégios, você deve executar **mysqladmin reload versão** e tentar se conectar com o programa que está causando problemas.

- Se você tiver um patch para um bug, inclua-o. Mas não assuma que o patch é tudo o que precisamos ou que podemos usá-lo, se você não fornecer algumas informações necessárias, como casos de teste que mostrem o bug que seu patch corrige. Podemos encontrar problemas com seu patch ou talvez não o entendamos de jeito nenhum. Nesse caso, não podemos usá-lo.

  Se não conseguirmos verificar o propósito exato do patch, não o usaremos. Os casos de teste nos ajudam aqui. Mostre que o patch lida com todas as situações que podem ocorrer. Se encontrarmos um caso limite (mesmo que raro) em que o patch não funcionará, ele pode ser inútil.

- As suposições sobre o que é o bug, por que ele ocorre ou de que depende geralmente estão erradas. Até mesmo a equipe da MySQL não consegue adivinhar essas coisas sem primeiro usar um depurador para determinar a causa real do bug.

- Indique no seu relatório de erro que você verificou o manual de referência e o arquivo de e-mail para que outros saibam que você tentou resolver o problema sozinho.

- Se seus dados parecerem corrompidos ou você receber erros ao acessar uma tabela específica, primeiro verifique suas tabelas com `CHECK TABLE`. Se essa declaração relatar quaisquer erros:

  - O mecanismo de recuperação de falhas do `InnoDB` cuida da limpeza quando o servidor é reiniciado após ser interrompido, portanto, na operação típica, não é necessário "reparar" as tabelas. Se você encontrar um erro com as tabelas do `InnoDB`, reinicie o servidor e veja se o problema persiste ou se o erro afetou apenas os dados em cache na memória. Se os dados estiverem corrompidos no disco, considere reiniciar com a opção `innodb_force_recovery` habilitada para que você possa dumper as tabelas afetadas.

  - Para tabelas não transacionais, tente repará-las com `REPAIR TABLE` ou com **myisamchk**. Veja o Capítulo 5, *Administração do Servidor MySQL*.

  Se você estiver executando o Windows, verifique o valor de `lower_case_table_names` usando a instrução `SHOW VARIABLES LIKE 'lower_case_table_names'`. Essa variável afeta a forma como o servidor lida com a maiúscula e minúscula dos nomes de bancos de dados e tabelas. Seu efeito para um determinado valor deve ser conforme descrito na Seção 9.2.3, “Sensibilidade ao Caso do Identificador”.

- Se você frequentemente recebe tabelas corrompidas, deve tentar descobrir quando e por que isso acontece. Neste caso, o log de erros no diretório de dados do MySQL pode conter algumas informações sobre o que aconteceu. (Este é o arquivo com o sufixo `.err` no nome.) Veja a Seção 5.4.2, “O Log de Erros”. Inclua qualquer informação relevante deste arquivo em seu relatório de bug. Normalmente, o **mysqld** *nunca* deve corromper uma tabela se nada a matar no meio de uma atualização. Se você puder encontrar a causa da morte do **mysqld**, é muito mais fácil para nós fornecer uma solução para o problema. Veja a Seção B.3.1, “Como Determinar o que Está Causing um Problema”.

- Se possível, baixe e instale a versão mais recente do MySQL Server e verifique se isso resolve o seu problema. Todas as versões do software MySQL são testadas minuciosamente e devem funcionar sem problemas. Acreditamos em tornar tudo o mais compatível com versões anteriores possível, e você deve ser capaz de alternar entre as versões do MySQL sem dificuldade. Veja a Seção 2.1.2, “Qual versão e distribuição do MySQL para instalar”.
