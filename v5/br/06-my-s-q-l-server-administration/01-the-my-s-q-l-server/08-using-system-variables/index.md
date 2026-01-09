### 5.1.8 Usando variáveis do sistema

5.1.8.1 Privilegios de variáveis de sistema

5.1.8.2 Variáveis de sistema dinâmicas

5.1.8.3 Variáveis de sistema estruturado

O servidor MySQL mantém muitas variáveis de sistema que configuram sua operação. Seção 5.1.7, “Variáveis de Sistema do Servidor”, descreve o significado dessas variáveis. Cada variável de sistema tem um valor padrão. As variáveis de sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente enquanto o servidor estiver em execução por meio da instrução `SET`, que permite modificar a operação do servidor sem precisar parar e reiniciá-lo. Você também pode usar os valores das variáveis de sistema em expressões.

Muitas variáveis do sistema são integradas. As variáveis do sistema implementadas por um plugin do servidor são exibidas quando o plugin é instalado e têm nomes que começam com o nome do plugin. Por exemplo, o plugin `audit_log` implementa uma variável do sistema chamada `audit_log_policy`.

Existem dois escopos em que as variáveis de sistema existem. As variáveis globais afetam o funcionamento geral do servidor. As variáveis de sessão afetam seu funcionamento para conexões individuais de clientes. Uma variável de sistema dada pode ter tanto um valor global quanto um valor de sessão. As variáveis de sistema globais e de sessão estão relacionadas da seguinte forma:

- Quando o servidor é iniciado, ele inicializa cada variável global com seu valor padrão. Esses valores padrão podem ser alterados por opções especificadas na linha de comando ou em um arquivo de opções. (Veja Seção 4.2.2, “Especificação de Opções do Programa”.)

- O servidor também mantém um conjunto de variáveis de sessão para cada cliente que se conecta. As variáveis de sessão do cliente são inicializadas no momento da conexão usando os valores atuais das variáveis globais correspondentes. Por exemplo, o modo SQL do cliente é controlado pelo valor da sessão `sql_mode`, que é inicializado quando o cliente se conecta ao valor da variável global `sql_mode`.

  Para algumas variáveis do sistema, o valor da sessão não é inicializado a partir do valor global correspondente; se for esse o caso, isso é indicado na descrição da variável.

Os valores das variáveis do sistema podem ser definidos globalmente ao iniciar o servidor usando opções na linha de comando ou em um arquivo de opções. Ao iniciar, a sintaxe para variáveis de sistema é a mesma que para opções de comando, então, dentro dos nomes das variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes.

Quando você usa uma opção de inicialização para definir uma variável que recebe um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` (mayúsculas ou minúsculas) para indicar um multiplicador de 1024, 10242 ou 10243; ou seja, unidades de kilobytes, megabytes ou gigabytes, respectivamente. Assim, o seguinte comando inicia o servidor com um tamanho de arquivo de log `InnoDB` de 16 megabytes e um tamanho máximo de pacote de um gigabyte:

```sql
mysqld --innodb-log-file-size=16M --max-allowed-packet=1G
```

Dentro de um arquivo de opção, essas variáveis são definidas da seguinte forma:

```sql
[mysqld]
innodb_log_file_size=16M
max_allowed_packet=1G
```

A letra inicial das letras de sufixo não importa; `16M` e `16m` são equivalentes, assim como `1G` e `1g`.

Para restringir o valor máximo ao qual uma variável de sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção da forma `--maximum-var_name=value` no início do servidor. Por exemplo, para impedir que o valor de `innodb_log_file_size` seja aumentado para mais de 32MB em tempo de execução, use a opção `--maximum-innodb-log-file-size=32M`.

Muitas variáveis do sistema são dinâmicas e podem ser alteradas durante a execução usando a instrução `SET`. Para uma lista, consulte Seção 5.1.8.2, “Variáveis de Sistema Dinâmicas”. Para alterar uma variável de sistema com `SET`, consulte-a pelo nome, opcionalmente precedida por um modificador. Durante a execução, os nomes das variáveis de sistema devem ser escritos usando sublinhados, não travessões. Os seguintes exemplos ilustram brevemente essa sintaxe:

- Defina uma variável de sistema global:

  ```sql
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

- Defina uma variável de sistema de sessão:

  ```sql
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

Para obter detalhes completos sobre a sintaxe de `SET`, consulte Seção 13.7.4.1, “Sintaxe SET para Atribuição de Variáveis”. Para uma descrição dos requisitos de privilégio para definir variáveis do sistema, consulte Seção 5.1.8.1, “Privilégios de Variáveis do Sistema”

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no início do servidor, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET` você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável no início do servidor. Por exemplo, a primeira das linhas a seguir é legal no início do servidor, mas a segunda não é:

```sql
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal durante a execução, mas a primeira não:

```sql
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

Para exibir os nomes e valores das variáveis do sistema, use a instrução `SHOW VARIABLES`:

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

Com uma cláusula `LIKE` (funções de comparação de strings.html#operador_like), a instrução exibe apenas as variáveis que correspondem ao padrão. Para obter um nome específico de variável, use uma cláusula `LIKE` (funções de comparação de strings.html#operador_like) conforme mostrado:

```sql
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponda a um padrão, use o caractere curinga `%` em uma cláusula `LIKE` (funções de comparação de strings.html#operador_like):

```sql
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão a ser correspondido. De forma estrita, porque `_` é um caractere curinga que corresponde a qualquer único caractere, você deve escapar dele como `_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.

Para `SHOW VARIABLES`, se você não especificar `GLOBAL` nem `SESSION`, o MySQL retorna os valores de `SESSION`.

A razão para exigir a palavra-chave `GLOBAL` ao definir variáveis `GLOBAL` apenas, mas não ao recuperá-las, é para evitar problemas no futuro:

- Se uma variável `SESSION` fosse removida que tenha o mesmo nome que uma variável `GLOBAL`, um cliente com privilégios suficientes para modificar variáveis globais poderia, acidentalmente, alterar a variável `GLOBAL` em vez de apenas a variável `SESSION` para sua própria sessão.

- Se uma variável `SESSION` fosse adicionada com o mesmo nome que uma variável `GLOBAL`, um cliente que pretenda alterar a variável `GLOBAL` pode encontrar apenas sua própria variável `SESSION` alterada.
