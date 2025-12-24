## 1.6 Como relatar bugs ou problemas

Antes de postar um relatório de bug sobre um problema, por favor tente verificar se é um bug e que ele não foi relatado já:

- Comece pesquisando o manual on-line do MySQL em \[<https://dev.mysql.com/doc/>]<https://dev.mysql.com/doc/>). Nós tentamos manter o manual atualizado com frequência com soluções para problemas recém-encontrados. Além disso, as notas de lançamento que acompanham o manual podem ser particularmente úteis, pois é bem possível que uma versão mais nova contenha uma solução para o seu problema. As notas de lançamento estão disponíveis no local indicado para o manual.
- Se você receber um erro de análise para uma instrução SQL, por favor verifique sua sintaxe de perto. Se você não puder encontrar algo errado com ele, é extremamente provável que sua versão atual do MySQL Server não suporte a sintaxe que você está usando. Se você estiver usando a versão atual e o manual não cobrir a sintaxe que você está usando, o MySQL Server não suporta sua instrução.

  Se o manual abrange a sintaxe que você está usando, mas você tem uma versão mais antiga do MySQL Server, você deve verificar o histórico de alterações do MySQL para ver quando a sintaxe foi implementada. Neste caso, você tem a opção de atualizar para uma versão mais recente do MySQL Server.
- Para soluções para alguns problemas comuns, ver Secção B.3, "Problemas e erros comuns".
- Pesquise no banco de dados de bugs em \[<http://bugs.mysql.com/>] para ver se o bug foi relatado e corrigido.
- Você também pode usar <http://www.mysql.com/search/> para pesquisar todas as páginas da Web (incluindo o manual) que estão localizadas no site MySQL.

Se você não conseguir encontrar uma resposta no manual, no banco de dados de bugs ou nos arquivos de listas de discussão, verifique com seu especialista local em MySQL. Se você ainda não conseguir encontrar uma resposta para sua pergunta, por favor, use as seguintes diretrizes para relatar o bug.

A maneira normal de relatar bugs é visitar <http://bugs.mysql.com/>, que é o endereço do nosso banco de dados de bugs. Este banco de dados é público e pode ser navegado e pesquisado por qualquer pessoa. Se você entrar no sistema, você pode inserir novos relatórios.

Bugs postados no banco de dados de bugs em \[<http://bugs.mysql.com/>] (<http://bugs.mysql.com/>) que são corrigidos para uma determinada versão são anotados nas notas de lançamento.

Se você encontrar um bug de segurança no MySQL Server, por favor nos avise imediatamente enviando uma mensagem de e-mail para `<secalert_us@oracle.com>`.Exceção: Os clientes de suporte devem relatar todos os problemas, incluindo bugs de segurança, para o suporte da Oracle em \[<http://support.oracle.com/>] (<http://support.oracle.com/>).

Para discutir problemas com outros usuários, você pode usar o \[MySQL Community Slack]<https://mysqlcommunity.slack.com/>).

Escrever um bom relatório de bug requer paciência, mas fazê-lo da primeira vez economiza tempo tanto para nós quanto para você. Um bom relatório de bug, contendo um caso de teste completo para o bug, torna muito provável que corrigiremos o bug na próxima versão. Esta seção ajuda você a escrever seu relatório corretamente para que você não perca seu tempo fazendo coisas que podem não nos ajudar muito ou nada. Por favor, leia esta seção cuidadosamente e certifique-se de que todas as informações descritas aqui estão incluídas em seu relatório.

De preferência, você deve testar o problema usando a versão mais recente de produção ou desenvolvimento do MySQL Server antes de postar. Qualquer um deve ser capaz de repetir o bug usando apenas `mysql test < script_file` em seu caso de teste ou executando o shell ou o script Perl que você inclui no relatório de bug. Qualquer bug que possamos repetir tem uma alta chance de ser corrigido no próximo lançamento do MySQL.

É mais útil quando uma boa descrição do problema é incluída no relatório de bug. Isto é, dê um bom exemplo de tudo o que você fez que levou ao problema e descreva, em detalhes exatos, o problema em si. Os melhores relatórios são aqueles que incluem um exemplo completo mostrando como reproduzir o bug ou problema.

Lembre-se de que é possível para nós responder a um relatório que contém muita informação, mas não a um que contém muito pouco. As pessoas muitas vezes omitem fatos porque pensam que sabem a causa de um problema e assumem que alguns detalhes não importam. Um bom princípio a seguir é que, se você estiver em dúvida sobre afirmar algo, diga-o. É mais rápido e menos incômodo escrever mais algumas linhas em seu relatório do que esperar mais tempo pela resposta se tivermos que pedir que você forneça informações que faltavam no relatório inicial.

Os erros mais comuns feitos em relatórios de bugs são (a) não incluir o número de versão da distribuição MySQL que você usa, e (b) não descrever completamente a plataforma na qual o servidor MySQL está instalado (incluindo o tipo de plataforma e o número de versão). Estas são informações altamente relevantes, e em 99 casos de 100, o relatório de bugs é inútil sem elas. Muitas vezes recebemos perguntas como: "Por que isso não funciona para mim?" Então descobrimos que o recurso solicitado não foi implementado nessa versão do MySQL, ou que um bug descrito em um relatório foi corrigido em versões mais recentes do MySQL. Os erros geralmente são dependentes da plataforma. Em tais casos, é quase impossível para nós corrigir qualquer coisa sem conhecer o sistema operacional e o número de versão da plataforma.

Se você compilou o MySQL a partir da fonte, lembre-se também de fornecer informações sobre o seu compilador se ele estiver relacionado ao problema. Muitas vezes as pessoas encontram bugs em compiladores e pensam que o problema está relacionado ao MySQL. A maioria dos compiladores está em desenvolvimento o tempo todo e se torna melhor versão por versão. Para determinar se o seu problema depende do seu compilador, precisamos saber qual compilador você usou. Observe que cada problema de compilação deve ser considerado como um bug e relatado de acordo.

Se um programa produz uma mensagem de erro, é muito importante incluir a mensagem no seu relatório. Se tentarmos procurar algo nos arquivos, é melhor que a mensagem de erro relatada corresponda exatamente à que o programa produz. (Mesmo o alfabeto deve ser observado.) É melhor copiar e colar a mensagem de erro inteira no seu relatório. Você nunca deve tentar reproduzir a mensagem da memória.

Se você tiver um problema com o Conector/ODBC (MyODBC), tente gerar um arquivo de rastreamento e enviá-lo com o seu relatório.

Se o seu relatório inclui longas linhas de saída de consulta de casos de teste que você executa com a ferramenta de linha de comando `mysql`, você pode tornar a saída mais legível usando a opção `--vertical` ou o terminador de instrução `\G`. O exemplo `EXPLAIN SELECT` mais adiante nesta seção demonstra o uso de `\G`.

Por favor, inclua no seu relatório as seguintes informações:

- O número de versão da distribuição MySQL que você está usando (por exemplo, MySQL 5.7.10). Você pode descobrir qual versão você está executando executando `mysqladmin version`. O programa `mysqladmin` pode ser encontrado no diretório `bin` sob seu diretório de instalação do MySQL.
- O fabricante e o modelo da máquina em que se verifica o problema.
- O nome e versão do sistema operacional. Se você trabalha com o Windows, você geralmente pode obter o nome e o número de versão clicando duas vezes no ícone Meu computador e puxando para baixo o menu "Ajuda/Sobre o Windows". Para a maioria dos sistemas operacionais semelhantes ao Unix, você pode obter essas informações executando o comando `uname -a`.
- Às vezes, a quantidade de memória (real e virtual) é relevante.
- O conteúdo do arquivo `docs/INFO_BIN` da sua instalação do MySQL. Este arquivo contém informações sobre como o MySQL foi configurado e compilado.
- Se você estiver usando uma distribuição de código-fonte do software MySQL, inclua o nome e o número de versão do compilador que você usou. Se você tiver uma distribuição binária, inclua o nome da distribuição.
- Se o problema ocorrer durante a compilação, inclua as mensagens de erro exatas e também algumas linhas de contexto em torno do código ofensivo no arquivo onde ocorre o erro.
- Se `mysqld` morreu, você também deve relatar a instrução que causou a saída inesperada de `mysqld`. Você geralmente pode obter essa informação executando `mysqld` com o registro de consultas ativado e, em seguida, olhando para o log depois que `mysqld` sai. Veja Seção 7.9,  Debug MySQL.
- Se uma tabela de banco de dados estiver relacionada ao problema, inclua a saída da instrução `SHOW CREATE TABLE db_name.tbl_name` no relatório de erro. Esta é uma maneira muito fácil de obter a definição de qualquer tabela em um banco de dados. As informações nos ajudam a criar uma situação correspondente à que você experimentou.
- O modo SQL em vigor quando o problema ocorreu pode ser significativo, então informe o valor da variável de sistema `sql_mode`. Para procedimentos armazenados, funções armazenadas e objetos de gatilho, o valor relevante `sql_mode` é o vigente quando o objeto foi criado. Para um procedimento ou função armazenado, a instrução `SHOW CREATE PROCEDURE` ou `SHOW CREATE FUNCTION` mostra o modo SQL relevante, ou você pode consultar `INFORMATION_SCHEMA` para obter as informações:

  ```
  SELECT ROUTINE_SCHEMA, ROUTINE_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.ROUTINES;
  ```

  Para gatilhos, você pode usar esta afirmação:

  ```
  SELECT EVENT_OBJECT_SCHEMA, EVENT_OBJECT_TABLE, TRIGGER_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.TRIGGERS;
  ```
- Para erros relacionados ao desempenho ou problemas com instruções `SELECT`, você deve sempre incluir a saída de `EXPLAIN SELECT ...`, e pelo menos o número de linhas que a instrução `SELECT` produz. Você também deve incluir a saída de `SHOW CREATE TABLE tbl_name` para cada tabela envolvida. Quanto mais informações você fornecer sobre sua situação, maior a probabilidade de alguém poder ajudá-lo.

  O seguinte é um exemplo de um relatório de erro muito bom. As instruções são executadas usando a ferramenta de linha de comando `mysql`. Observe o uso do terminador de instrução `\G` para instruções que, de outra forma, forneceriam linhas de saída muito longas e difíceis de ler.

  ```
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
- Se ocorrer um bug ou problema durante a execução de `mysqld`, tente fornecer um script de entrada que reproduz a anomalia. Este script deve incluir todos os arquivos de origem necessários. Quanto mais o script puder reproduzir sua situação, melhor. Se você puder fazer um caso de teste reproduzível, você deve enviá-lo para ser anexado ao relatório de bug.

  Se você não pode fornecer um script, você deve pelo menos incluir a saída de `mysqladmin variables extended-status processlist` em seu relatório para fornecer algumas informações sobre como seu sistema está funcionando.
- Se você não pode produzir um caso de teste com apenas algumas linhas, ou se a tabela de teste é muito grande para ser incluída no relatório de bugs (mais de 10 linhas), você deve despejar suas tabelas usando `mysqldump` e criar um `README` arquivo que descreve o seu problema. Crie um arquivo comprimido de seus arquivos usando `tar` e `gzip` ou `zip`. Depois de iniciar um relatório de bugs para o nosso banco de dados de bugs em \[<http://bugs.mysql.com/>]<http://bugs.mysql.com/>], clique nas tabelas no relatório de bugs para instruções sobre o upload do arquivo para o banco de dados de bugs.
- Se você acredita que o servidor MySQL produz um resultado estranho a partir de uma instrução, inclua não apenas o resultado, mas também sua opinião sobre o que o resultado deve ser, e uma explicação descrevendo a base de sua opinião.
- Quando você fornece um exemplo do problema, é melhor usar os nomes de tabelas, nomes de variáveis e assim por diante que existem em sua situação real do que criar novos nomes. O problema pode estar relacionado ao nome de uma tabela ou variável. Esses casos são raros, talvez, mas é melhor prevenir do que remediar. Afinal, deve ser mais fácil para você fornecer um exemplo que use sua situação real, e é melhor para nós. Se você tiver dados que não deseja que sejam visíveis para outros no relatório de bugs, você pode enviá-los usando as tabelas de arquivos como descrito anteriormente. Se a informação é realmente segredo absoluto e você não quer mostrá-la até para nós, vá em frente e forneça um exemplo usando outros nomes, mas considere isso como a última opção.
- Incluir todas as opções dadas aos programas relevantes, se possível. Por exemplo, indique as opções que você usa quando inicia o servidor `mysqld`, bem como as opções que você usa para executar qualquer programa cliente MySQL. As opções para programas como `mysqld` e `mysql`, e para o script `configure`, são muitas vezes a chave para resolver problemas e são muito relevantes. Nunca é uma má idéia incluí-las. Se o seu problema envolve um programa escrito em uma linguagem como Perl ou PHP, por favor inclua o número de versão do processador de linguagem, bem como a versão para quaisquer módulos que o programa usa. Por exemplo, se você tem um script Perl que usa os módulos `DBI` e \[\[PH\_CODE\_CODE\_5]], inclua os números de versão para Perl, `DBI`, e `DBD::mysql`.
- Se a sua pergunta estiver relacionada com o sistema de privilégios, inclua a saída de `mysqladmin reload`, e todas as mensagens de erro que você recebe ao tentar se conectar. Ao testar seus privilégios, você deve executar `mysqladmin reload version` e tentar se conectar com o programa que lhe dá problemas.
- Se você tem um patch para um bug, inclua-o. Mas não presuma que o patch é tudo o que precisamos, ou que podemos usá-lo, se você não fornecer algumas informações necessárias, como casos de teste mostrando o bug que seu patch corrige. Podemos encontrar problemas com o seu patch ou podemos não entendê-lo. Se assim for, não podemos usá-lo.

  Se não pudermos verificar o propósito exato do patch, não o usaremos. Casos de teste nos ajudam aqui. Mostrar que o patch lida com todas as situações que podem ocorrer. Se encontrarmos um caso limite (mesmo um raro) em que o patch não funcionará, pode ser inútil.
- Adivinhamentos sobre o que é o bug, por que ele ocorre ou do que ele depende geralmente são errados. Mesmo a equipe do MySQL não pode adivinhar tais coisas sem primeiro usar um depurador para determinar a verdadeira causa de um bug.
- Indique no seu relatório de erro que você verificou o manual de referência e o arquivo de correio para que os outros saibam que você tentou resolver o problema sozinho.
- Se os seus dados parecerem corrompidos ou você tiver erros quando acessar uma tabela específica, primeiro verifique suas tabelas com `CHECK TABLE`. Se essa instrução relatar algum erro:

  - O mecanismo de recuperação de falha do `InnoDB` lida com a limpeza quando o servidor é reiniciado depois de ser morto, portanto, na operação típica não há necessidade de "reparar" tabelas. Se você encontrar um erro com as tabelas do `InnoDB` , reinicie o servidor e veja se o problema persiste ou se o erro afetou apenas dados em cache na memória. Se os dados estiverem corrompidos no disco, considere reiniciar com a opção do `innodb_force_recovery` ativada para que você possa despejar as tabelas afetadas.
  - Para tabelas não transacionais, tente repará-las com `REPAIR TABLE` ou com `myisamchk`.

  Se você estiver executando o Windows, verifique o valor de `lower_case_table_names` usando a instrução `SHOW VARIABLES LIKE 'lower_case_table_names'`. Esta variável afeta como o servidor lida com letras maiúsculas de nomes de banco de dados e tabelas. Seu efeito para um determinado valor deve ser como descrito na Seção 11.2.3, Case Sensitivity Identifier.
- Se você costuma ter tabelas corrompidas, você deve tentar descobrir quando e por que isso acontece. Neste caso, o registro de erros no diretório de dados MySQL pode conter algumas informações sobre o que aconteceu. (Este é o arquivo com o sufixo `.err` no nome.) Veja Seção 7.4.2, The Error Log. Por favor, inclua qualquer informação relevante deste arquivo em seu relatório de erro. Normalmente, o `mysqld` \* nunca \* corrompe uma tabela se nada a matar no meio de uma atualização. Se você puder encontrar a causa da morte do `mysqld`, é muito mais fácil para nós fornecer uma solução para o problema. Veja Seção B.3.1,  Como determinar o que está causando um problema.
- Se possível, baixe e instale a versão mais recente do MySQL Server e verifique se ela resolve o seu problema. Todas as versões do software MySQL são completamente testadas e devem funcionar sem problemas. Acreditamos em tornar tudo o mais compatível com o passado possível, e você deve ser capaz de mudar de versão do MySQL sem dificuldade. Veja Seção 2.1.2, Qual versão e distribuição do MySQL instalar.
