## 1.6 Como Relatar Bugs ou Problemas

Antes de postar um relatório de bug sobre um problema, tente verificar se ele é um bug e se já não foi relatado:

* Comece pesquisando o manual online do MySQL em https://dev.mysql.com/doc/. Tentamos manter o manual atualizado, atualizando-o frequentemente com soluções para problemas recém-descobertos. Além disso, as notas de lançamento que acompanham o manual podem ser particularmente úteis, pois é bem possível que uma versão mais recente contenha uma solução para o seu problema. As notas de lançamento estão disponíveis na localização fornecida para o manual.

* Se você receber um erro de parse para uma declaração SQL, verifique a sintaxe cuidadosamente. Se não conseguir encontrar algo errado, é extremamente provável que sua versão atual do MySQL Server não suporte a sintaxe que você está usando. Se você estiver usando a versão atual e o manual não cobrir a sintaxe que você está usando, o MySQL Server não suporta a sua declaração.

* Se o manual cobrir a sintaxe que você está usando, mas você tiver uma versão mais antiga do MySQL Server, você deve verificar o histórico de alterações do MySQL para ver quando a sintaxe foi implementada. Nesse caso, você tem a opção de atualizar para uma versão mais nova do MySQL Server.

* Para soluções para alguns problemas comuns, consulte a Seção B.3, “Problemas e Erros Comuns”.

* Pesquise o banco de bugs em <http://bugs.mysql.com/> para ver se o bug foi relatado e corrigido.

* Você também pode usar <http://www.mysql.com/search/> para pesquisar todas as páginas da Web (incluindo o manual) que estão localizadas no site do MySQL.

Se você não encontrar uma resposta no manual, no banco de dados de bugs ou nos arquivos da lista de correio, consulte seu especialista local em MySQL. Se ainda não encontrar uma resposta para sua pergunta, use as seguintes diretrizes para relatar o bug.

A maneira normal de relatar bugs é visitar <http://bugs.mysql.com/>, que é o endereço do nosso banco de dados de bugs. Este banco de dados é público e pode ser navegado e pesquisado por qualquer pessoa. Se você fizer login no sistema, poderá inserir novos relatórios.

Os bugs publicados no banco de dados de bugs em <http://bugs.mysql.com/> que são corrigidos para uma determinada versão são mencionados nas notas da versão.

Se você encontrar um bug de segurança no MySQL Server, informe-nos imediatamente enviando uma mensagem de e-mail para `<secalert_us@oracle.com>`. Exceção: os clientes de suporte devem relatar todos os problemas, incluindo bugs de segurança, ao Suporte da Oracle em <http://support.oracle.com/>.

Para discutir problemas com outros usuários, você pode usar o [MySQL Community Slack](https://mysqlcommunity.slack.com/).

Escrever um bom relatório de bug requer paciência, mas fazer corretamente na primeira vez economiza tempo tanto para você quanto para nós. Um bom relatório de bug, contendo um caso de teste completo para o bug, torna muito provável que corrigiremos o bug na próxima versão. Esta seção ajuda você a escrever seu relatório corretamente para que você não perca tempo fazendo coisas que podem não nos ajudar muito ou nada. Por favor, leia esta seção cuidadosamente e certifique-se de que todas as informações descritas aqui estão incluídas em seu relatório.

De preferência, você deve testar o problema usando a versão mais recente de produção ou desenvolvimento do MySQL Server antes de postar. Qualquer pessoa deve ser capaz de repetir o bug usando apenas `mysql test < script_file` no seu caso de teste ou executando o script do shell ou Perl que você inclui no relatório do bug. Qualquer bug que possamos repetir tem uma alta chance de ser corrigido na próxima versão do MySQL.

É muito útil quando uma boa descrição do problema é incluída no relatório do bug. Ou seja, dê um bom exemplo de tudo o que você fez que levou ao problema e descreva, com detalhes exatos, o próprio problema. Os melhores relatórios são aqueles que incluem um exemplo completo mostrando como reproduzir o bug ou o problema. Veja a Seção 7.9, “Depuração do MySQL”.

Lembre-se de que é possível que possamos responder a um relatório que contém muita informação, mas não a um que contém pouca. As pessoas muitas vezes omitem fatos porque acham que sabem a causa de um problema e assumem que alguns detalhes não importam. Um bom princípio a seguir é que, se você estiver em dúvida sobre algo, diga. É mais rápido e menos problemático escrever mais algumas linhas no seu relatório do que esperar mais tempo pela resposta se precisarmos pedir que você forneça informações que estavam faltando no relatório inicial.

Os erros mais comuns cometidos em relatórios de bugs são (a) não incluir o número da versão da distribuição do MySQL que você usa e (b) não descrever completamente a plataforma em que o servidor MySQL está instalado (incluindo o tipo da plataforma e o número da versão). Essas são informações altamente relevantes, e, em 99 casos de cada 100, o relatório de bug é inútil sem elas. Muitas vezes, recebemos perguntas como “Por que isso não funciona para mim?” Então, descobrimos que o recurso solicitado não foi implementado naquela versão do MySQL, ou que um bug descrito em um relatório foi corrigido em versões mais recentes do MySQL. Erros muitas vezes são dependentes da plataforma. Nesses casos, é quase impossível para nós corrigirmos algo sem saber o sistema operacional e o número da versão da plataforma.

Se você compilou o MySQL a partir do código-fonte, lembre-se também de fornecer informações sobre seu compilador, se ele estiver relacionado ao problema. Muitas vezes, as pessoas encontram bugs em compiladores e pensam que o problema está relacionado ao MySQL. A maioria dos compiladores está em desenvolvimento o tempo todo e fica melhor versão a versão. Para determinar se o seu problema depende do seu compilador, precisamos saber qual compilador você usou. Note que todo problema de compilação deve ser considerado um bug e relatado de acordo.

Se um programa produz uma mensagem de erro, é muito importante incluir a mensagem no seu relatório. Se tentarmos procurar algo nos arquivos, é melhor que a mensagem de erro relatada corresponda exatamente àquela que o programa produz. (Até a letra maiúscula deve ser observada.) É melhor copiar e colar toda a mensagem de erro no seu relatório. Você nunca deve tentar reproduzir a mensagem da memória.

Se você tiver um problema com o Connector/ODBC (MyODBC), tente gerar um arquivo de registro e enviá-lo junto com seu relatório. Veja Como relatar problemas ou bugs do Connector/ODBC.

Se o seu relatório incluir linhas de saída de consultas longas de casos de teste que você executa com a ferramenta de linha de comando **mysql**, você pode tornar a saída mais legível usando a opção `--vertical` ou o delimitador de declaração `\G`. O exemplo `EXPLAIN SELECT` mais adiante nesta seção demonstra o uso de `\G`.

Por favor, inclua as seguintes informações em seu relatório:

* O número de versão da distribuição MySQL que você está usando (por exemplo, MySQL 5.7.10). Você pode descobrir qual versão você está executando executando **mysqladmin versão**. O programa **mysqladmin** pode ser encontrado no diretório `bin` sob o diretório de instalação do MySQL.

* O fabricante e o modelo da máquina em que você experimenta o problema.

* O nome e a versão do sistema operacional. Se você trabalha com Windows, geralmente pode obter o nome e o número de versão clicando duas vezes no ícone Meu Computador e puxando para baixo o menu “Ajuda/Sobre o Windows”. Para a maioria dos sistemas operacionais Unix-like, você pode obter essas informações executando o comando `uname -a`.

* Às vezes, a quantidade de memória (real e virtual) é relevante. Se tiver dúvidas, inclua esses valores.

* O conteúdo do arquivo `docs/INFO_BIN` da sua instalação do MySQL. Este arquivo contém informações sobre como o MySQL foi configurado e compilado.

* Se você estiver usando uma distribuição de código-fonte do software MySQL, inclua o nome e o número de versão do compilador que você usou. Se você tiver uma distribuição binária, inclua o nome da distribuição.

* Se o problema ocorrer durante a compilação, inclua as mensagens de erro exatas e também algumas linhas de contexto em torno do código ofensor no arquivo onde o erro ocorre.

* Se o **mysqld** morrer, você também deve relatar a declaração que fez o **mysqld** sair inesperadamente. Geralmente, você pode obter essa informação executando o **mysqld** com o registro de consultas habilitado e, em seguida, procurando no log após o **mysqld** sair. Veja a Seção 7.9, “Depuração do MySQL”.

* Se uma tabela de banco de dados estiver relacionada ao problema, inclua a saída da declaração `SHOW CREATE TABLE db_name.tbl_name` no relatório do bug. Essa é uma maneira muito fácil de obter a definição de qualquer tabela em um banco de dados. As informações ajudam-nos a criar uma situação que corresponda àquela que você experimentou.

* O modo SQL em vigor quando o problema ocorreu pode ser significativo, portanto, por favor, informe o valor da variável de sistema `sql_mode`. Para objetos de procedimentos armazenados, funções armazenadas e gatilhos, o valor relevante de `sql_mode` é o que está em vigor quando o objeto foi criado. Para um procedimento armazenado ou função, a declaração `SHOW CREATE PROCEDURE` ou `SHOW CREATE FUNCTION` mostra o modo SQL relevante, ou você pode consultar o `INFORMATION_SCHEMA` para obter as informações:

  ```
  SELECT ROUTINE_SCHEMA, ROUTINE_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.ROUTINES;
  ```

  Para gatilhos, você pode usar esta declaração:

  ```
  SELECT EVENT_OBJECT_SCHEMA, EVENT_OBJECT_TABLE, TRIGGER_NAME, SQL_MODE
  FROM INFORMATION_SCHEMA.TRIGGERS;
  ```

* Para bugs ou problemas relacionados ao desempenho com declarações `SELECT`, você deve sempre incluir a saída de `EXPLAIN SELECT ...`, e pelo menos o número de linhas que a declaração `SELECT` produz. Você também deve incluir a saída de `SHOW CREATE TABLE tbl_name` para cada tabela envolvida. Quanto mais informações você fornecer sobre sua situação, maior a probabilidade de alguém poder ajudá-lo.

O seguinte é um exemplo de um relatório de bug muito bom. As declarações são executadas usando a ferramenta de linha de comando **mysql**. Observe o uso do delimitador de declaração `\G` para declarações que, de outra forma, fornecem linhas de saída muito longas, difíceis de ler.

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

* Se um bug ou problema ocorrer ao executar o **mysqld**, tente fornecer um script de entrada que reproduza a anomalia. Esse script deve incluir quaisquer arquivos de origem necessários. Quanto mais próximo o script puder reproduzir sua situação, melhor. Se você puder criar um caso de teste reproduzível, deve enviá-lo para anexar ao relatório do bug.

* Se você não puder fornecer um script, deve incluir, pelo menos, a saída do **mysqladmin variables extended-status processlist** em seu relatório para fornecer alguma informação sobre como seu sistema está funcionando.

* Se você não puder produzir um caso de teste com apenas algumas linhas, ou se a tabela de teste for muito grande para ser incluída no relatório do bug (mais de 10 linhas), você deve fazer o dump de suas tabelas usando **mysqldump** e criar um arquivo `README` que descreva seu problema. Crie um arquivo compactado de seus arquivos usando **tar** e **gzip** ou **zip**. Após iniciar um relatório de bug para nossa base de dados de bugs em <http://bugs.mysql.com/>, clique na aba Arquivos no relatório do bug para obter instruções sobre como enviar o arquivo para a base de dados de bugs.

* Se você acredita que o servidor MySQL está produzindo um resultado estranho de uma declaração, inclua não apenas o resultado, mas também sua opinião sobre o que o resultado deveria ser, e uma explicação que descreva a base de sua opinião.

* Quando você fornecer um exemplo do problema, é melhor usar os nomes das tabelas, nomes de variáveis, etc., que existem na sua situação real, em vez de criar novos nomes. O problema pode estar relacionado ao nome de uma tabela ou variável. Esses casos são raros, talvez, mas é melhor ser cauteloso do que arrependido. Afinal, deve ser mais fácil para você fornecer um exemplo que use sua situação real, e é, de qualquer forma, melhor para nós. Se você tiver dados que você não deseja que outros vejam no relatório de bug, você pode fazer o upload usando a aba Arquivos, como descrito anteriormente. Se a informação for realmente de sigilo máximo e você não quiser mostrá-la nem para nós, vá em frente e forneça um exemplo usando outros nomes, mas por favor, considere isso como a última escolha.

* Inclua todas as opções fornecidas aos programas relevantes, se possível. Por exemplo, indique as opções que você usa ao iniciar o servidor **mysqld**, bem como as opções que você usa para executar quaisquer programas de cliente MySQL. As opções para programas como **mysqld** e **mysql**, e para o script **configure**, muitas vezes são chave para resolver problemas e são muito relevantes. Nunca é uma má ideia incluí-las. Se o seu problema envolver um programa escrito em uma linguagem como Perl ou PHP, por favor, inclua o número da versão do processador da linguagem, bem como a versão para quaisquer módulos que o programa use. Por exemplo, se você tiver um script Perl que usa os módulos `DBI` e `DBD::mysql`, inclua os números de versão do Perl, `DBI` e `DBD::mysql`.

* Se sua pergunta estiver relacionada ao sistema de privilégios, inclua o resultado da execução de **mysqladmin reload**, e todas as mensagens de erro que você receber ao tentar se conectar. Ao testar seus privilégios, você deve executar **mysqladmin reload versão** e tentar se conectar com o programa que está causando problemas.

* Se você tiver um patch para um bug, inclua-o. Mas não assuma que o patch é tudo o que precisamos, ou que podemos usá-lo, se você não fornecer algumas informações necessárias, como casos de teste que mostrem o bug que seu patch corrige. Podemos encontrar problemas com seu patch ou talvez não o entendamos nada. Se assim for, não podemos usá-lo.

* Se não pudermos verificar o propósito exato do patch, não o usaremos. Os casos de teste nos ajudam aqui. Mostre que o patch lida com todas as situações que podem ocorrer. Se encontrarmos um caso limite (mesmo que raro) em que o patch não funcionará, ele pode ser inútil.

* Suposições sobre o que é o bug, por que ele ocorre ou o que ele depende geralmente estão erradas. Até a equipe do MySQL não pode adivinhar essas coisas sem primeiro usar um depurador para determinar a causa real de um bug.

* Indique em seu relatório de bug que você verificou o manual de referência e o arquivo de e-mail para que outros saibam que você tentou resolver o problema sozinho.

* Se seus dados parecerem corrompidos ou você receber erros ao acessar uma tabela específica, primeiro verifique suas tabelas com `CHECK TABLE`. Se essa declaração relatar quaisquer erros:

+ O mecanismo de recuperação de falhas do `InnoDB` cuida da limpeza quando o servidor é reiniciado após ser interrompido, portanto, na operação típica, não é necessário "reparar" as tabelas. Se você encontrar um erro com as tabelas do `InnoDB`, reinicie o servidor e veja se o problema persiste ou se o erro afetou apenas os dados em cache na memória. Se os dados estiverem corrompidos no disco, considere reiniciar com a opção `innodb_force_recovery` habilitada para que você possa dumper as tabelas afetadas.

+ Para tabelas não transacionais, tente repará-las com `REPAIR TABLE` ou com **myisamchk**. Veja o Capítulo 7, *Administração do Servidor MySQL*.

Se você estiver executando o Windows, verifique o valor de `lower_case_table_names` usando a instrução `SHOW VARIABLES LIKE 'lower_case_table_names'`. Essa variável afeta como o servidor lida com a maiúscula e minúscula das tabelas e nomes de banco de dados. Seu efeito para um determinado valor deve ser conforme descrito na Seção 11.2.3, “Sensibilidade ao Caso do Identificador”.

* Se você frequentemente recebe tabelas corrompidas, você deve tentar descobrir quando e por que isso acontece. Neste caso, o log de erro no diretório de dados do MySQL pode conter alguma informação sobre o que aconteceu. (Este é o arquivo com o sufixo `.err` no nome.) Veja a Seção 7.4.2, “O Log de Erro”. Inclua qualquer informação relevante deste arquivo em seu relatório de bug. Normalmente, o **mysqld** *nunca* deve corromper uma tabela se nada a interromper no meio de uma atualização. Se você puder encontrar a causa da morte do **mysqld**, é muito mais fácil para nós fornecer uma solução para o problema. Veja a Seção B.3.1, “Como Determinar o Que Está Causing um Problema”.

* Se possível, baixe e instale a versão mais recente do MySQL Server e verifique se isso resolve o seu problema. Todas as versões do software MySQL são testadas minuciosamente e devem funcionar sem problemas. Acreditamos em tornar tudo o mais compatível com versões anteriores possível, e você deve ser capaz de alternar entre as versões do MySQL sem dificuldade. Veja a Seção 2.1.2, “Qual versão e distribuição do MySQL para instalar”.