### 5.1.8 Usando Variáveis de Sistema

[5.1.8.1 Privilégios de Variável de Sistema](system-variable-privileges.html)

[5.1.8.2 Variáveis de Sistema Dinâmicas](dynamic-system-variables.html)

[5.1.8.3 Variáveis de Sistema Estruturadas](structured-system-variables.html)

O servidor MySQL mantém muitas *system variables* que configuram sua operação. A [Seção 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Variáveis de Sistema do Servidor"), descreve o significado dessas variáveis. Cada *system variable* possui um valor padrão (*default value*). As *system variables* podem ser definidas na inicialização do servidor (*server startup*) usando opções na linha de comando ou em um *option file*. A maioria delas pode ser alterada dinamicamente enquanto o servidor está em execução por meio da instrução [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"), o que permite modificar a operação do servidor sem a necessidade de pará-lo e reiniciá-lo. Você também pode usar valores de *system variables* em expressões.

Muitas *system variables* são *built in* (incorporadas). *System variables* implementadas por um *plugin* de servidor são expostas quando o *plugin* é instalado e têm nomes que começam com o nome do *plugin*. Por exemplo, o *plugin* `audit_log` implementa uma *system variable* chamada [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy).

Existem dois *scopes* nos quais as *system variables* existem. Variáveis *Global* afetam a operação geral do servidor. Variáveis *Session* afetam a operação para conexões de clientes individuais. Uma determinada *system variable* pode ter um valor *Global* e um valor *Session*. As *system variables Global* e *Session* se relacionam da seguinte forma:

* Quando o servidor é iniciado, ele inicializa cada variável *Global* com seu valor padrão. Esses padrões podem ser alterados por opções especificadas na linha de comando ou em um *option file*. (Veja [Seção 4.2.2, “Especificando Opções de Programa”](program-options.html "4.2.2 Especificando Opções de Programa").)

* O servidor também mantém um conjunto de variáveis *Session* para cada cliente que se conecta. As variáveis *Session* do cliente são inicializadas no momento da conexão usando os valores atuais das variáveis *Global* correspondentes. Por exemplo, o *SQL mode* de um cliente é controlado pelo valor da *Session* [`sql_mode`](server-system-variables.html#sysvar_sql_mode), que é inicializado quando o cliente se conecta ao valor da *Global* [`sql_mode`](server-system-variables.html#sysvar_sql_mode).

  Para algumas *system variables*, o valor *Session* não é inicializado a partir do valor *Global* correspondente; se for o caso, isso é indicado na descrição da variável.

Os valores das *system variables* podem ser definidos *Globalmente* na inicialização do servidor, usando opções na linha de comando ou em um *option file*. Na inicialização, a sintaxe para *system variables* é a mesma que para opções de comando, portanto, dentro dos nomes das variáveis, traços (*dashes*) e sublinhados (*underscores*) podem ser usados de forma intercambiável. Por exemplo, [`--general_log=ON`](server-system-variables.html#sysvar_general_log) e [`--general-log=ON`](server-system-variables.html#sysvar_general_log) são equivalentes.

Ao usar uma opção de inicialização para definir uma variável que aceita um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` (maiúsculo ou minúsculo) para indicar um multiplicador de 1024, $1024^2$ ou $1024^3$; ou seja, unidades de *kilobytes*, *megabytes* ou *gigabytes*, respectivamente. Assim, o seguinte comando inicia o servidor com um tamanho de arquivo de *log* do `InnoDB` de 16 *megabytes* e um tamanho máximo de *packet* de um *gigabyte*:

```sql
mysqld --innodb-log-file-size=16M --max-allowed-packet=1G
```

Dentro de um *option file*, essas variáveis são definidas desta forma:

```sql
[mysqld]
innodb_log_file_size=16M
max_allowed_packet=1G
```

O uso de maiúsculas ou minúsculas nas letras do sufixo não importa; `16M` e `16m` são equivalentes, assim como `1G` e `1g`.

Para restringir o valor máximo para o qual uma *system variable* pode ser definida em tempo de execução (*runtime*) com a instrução [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"), especifique este máximo usando uma opção no formato `--maximum-var_name=value` na inicialização do servidor. Por exemplo, para evitar que o valor de [`innodb_log_file_size`](innodb-parameters.html#sysvar_innodb_log_file_size) seja aumentado para mais de 32MB em *runtime*, use a opção `--maximum-innodb-log-file-size=32M`.

Muitas *system variables* são dinâmicas e podem ser alteradas em tempo de execução (*runtime*) usando a instrução [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"). Para uma lista, veja [Seção 5.1.8.2, “Variáveis de Sistema Dinâmicas”](dynamic-system-variables.html "5.1.8.2 Variáveis de Sistema Dinâmicas"). Para alterar uma *system variable* com [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"), faça referência a ela pelo nome, opcionalmente precedido por um modificador. Em *runtime*, os nomes das *system variables* devem ser escritos usando sublinhados (*underscores*), e não traços (*dashes*). Os exemplos a seguir ilustram brevemente esta sintaxe:

* Define uma *system variable Global*:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* Define uma *system variable Session*:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

Para detalhes completos sobre a sintaxe [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"), veja [Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"). Para uma descrição dos requisitos de privilégio para definir *system variables*, veja [Seção 5.1.8.1, “Privilégios de Variável de Sistema”](system-variable-privileges.html "5.1.8.1 Privilégios de Variável de Sistema").

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável na inicialização do servidor, mas não para definir o valor com [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis") em tempo de execução (*runtime*). Por outro lado, com [`SET`](set-variable.html "13.7.4.1 Sintaxe SET para Atribuição de Variáveis"), você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável na inicialização do servidor. Por exemplo, a primeira das linhas a seguir é legal na inicialização do servidor, mas a segunda não é:

```sql
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal em *runtime*, mas a primeira não é:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

Para exibir nomes e valores de *system variables*, use a instrução [`SHOW VARIABLES`](show-variables.html "13.7.5.39 Instrução SHOW VARIABLES"):

```sql
mysql> SHOW VARIABLES;
+---------------------------------+-----------------------------------+
| Variable_name                   | Value                             |
+---------------------------------+-----------------------------------+
| auto_increment_increment        | 1                                 |
| auto_increment_offset           | 1                                 |
| automatic_sp_privileges         | ON                                |
| back_log                        | 50                                |
| basedir                         | /home/mysql/                      |
| binlog_cache_size               | 32768                             |
| bulk_insert_buffer_size         | 8388608                           |
| character_set_client            | utf8                              |
| character_set_connection        | utf8                              |
| character_set_database          | latin1                            |
| character_set_filesystem        | binary                            |
| character_set_results           | utf8                              |
| character_set_server            | latin1                            |
| character_set_system            | utf8                              |
| character_sets_dir              | /home/mysql/share/mysql/charsets/ |
| collation_connection            | utf8_general_ci                   |
| collation_database              | latin1_swedish_ci                 |
| collation_server                | latin1_swedish_ci                 |
...
| innodb_autoextend_increment     | 8                                 |
| innodb_buffer_pool_size         | 8388608                           |
| innodb_checksums                | ON                                |
| innodb_commit_concurrency       | 0                                 |
| innodb_concurrency_tickets      | 500                               |
| innodb_data_file_path           | ibdata1:10M:autoextend            |
| innodb_data_home_dir            |                                   |
...
| version                         | 5.7.18-log                        |
| version_comment                 | Source distribution               |
| version_compile_machine         | i686                              |
| version_compile_os              | suse-linux                        |
| wait_timeout                    | 28800                             |
+---------------------------------+-----------------------------------+
```

Com uma cláusula [`LIKE`](string-comparison-functions.html#operator_like), a instrução exibe apenas as variáveis que correspondem ao padrão (*pattern*). Para obter o nome de uma variável específica, use uma cláusula [`LIKE`](string-comparison-functions.html#operator_like) conforme mostrado:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujos nomes correspondem a um padrão, use o caractere *wildcard* `%` em uma cláusula [`LIKE`](string-comparison-functions.html#operator_like):

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Caracteres *wildcard* podem ser usados em qualquer posição dentro do padrão a ser correspondido. Estritamente falando, como `_` é um *wildcard* que corresponde a qualquer caractere único, você deve fazer o *escape* dele como `\_` para corresponder literalmente a ele. Na prática, isso raramente é necessário.

Para [`SHOW VARIABLES`](show-variables.html "13.7.5.39 Instrução SHOW VARIABLES"), se você não especificar nem `GLOBAL` nem `SESSION`, o MySQL retorna valores `SESSION`.

A razão pela qual é necessário o *keyword* `GLOBAL` ao definir variáveis somente `GLOBAL`, mas não ao recuperá-las, é prevenir problemas futuros:

* Caso uma variável `SESSION` com o mesmo nome de uma variável `GLOBAL` seja removida, um cliente com privilégios suficientes para modificar variáveis *Global* pode acidentalmente alterar a variável `GLOBAL` em vez de apenas a variável `SESSION` para sua própria *session*.

* Caso uma variável `SESSION` seja adicionada com o mesmo nome de uma variável `GLOBAL`, um cliente que pretende alterar a variável `GLOBAL` pode descobrir que apenas sua própria variável `SESSION` foi alterada.