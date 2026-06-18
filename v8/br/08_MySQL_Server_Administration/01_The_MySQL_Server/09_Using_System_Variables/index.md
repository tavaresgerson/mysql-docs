### 7.1.9 Usando variáveis do sistema

7.1.9.1 Privilegios de variáveis de sistema

7.1.9.2 Variáveis dinâmicas do sistema

7.1.9.3 Variáveis de sistema persistentes

7.1.9.4 Variáveis de sistema não persistidas e restritas à persistência

7.1.9.5 Variáveis de sistema estruturado

O servidor MySQL mantém muitas variáveis de sistema que configuram sua operação. A seção 7.1.8, “Variáveis de sistema do servidor”, descreve o significado dessas variáveis. Cada variável de sistema tem um valor padrão. As variáveis de sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente enquanto o servidor estiver em execução por meio da instrução `SET`, que permite modificar a operação do servidor sem precisar pará-lo e reiniciá-lo. Você também pode usar os valores das variáveis de sistema em expressões.

Muitas variáveis do sistema são pré-instaladas. As variáveis do sistema também podem ser instaladas por plugins ou componentes do servidor:

- As variáveis do sistema implementadas por um plugin do servidor são exibidas quando o plugin é instalado e têm nomes que começam com o nome do plugin. Por exemplo, o plugin `audit_log` implementa uma variável do sistema chamada `audit_log_policy`.

- As variáveis do sistema implementadas por um componente são exibidas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de log de erro `log_filter_dragnet` implementa uma variável do sistema chamada `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para referenciar essa variável, use o nome completo.

Existem dois escopos em que as variáveis de sistema existem. As variáveis globais afetam o funcionamento geral do servidor. As variáveis de sessão afetam seu funcionamento para conexões individuais de clientes. Uma variável de sistema dada pode ter tanto um valor global quanto um valor de sessão. As variáveis de sistema globais e de sessão estão relacionadas da seguinte forma:

- Quando o servidor é iniciado, ele inicializa cada variável global com seu valor padrão. Esses valores padrão podem ser alterados por opções especificadas na linha de comando ou em um arquivo de opções. (Veja a Seção 6.2.2, “Especificação de Opções do Programa”.)

- O servidor também mantém um conjunto de variáveis de sessão para cada cliente que se conecta. As variáveis de sessão do cliente são inicializadas no momento da conexão usando os valores atuais das variáveis globais correspondentes. Por exemplo, o modo SQL de um cliente é controlado pelo valor da sessão `sql_mode`, que é inicializado quando o cliente se conecta ao valor da variável global `sql_mode`.

  Para algumas variáveis do sistema, o valor da sessão não é inicializado a partir do valor global correspondente; se for esse o caso, isso é indicado na descrição da variável.

Os valores das variáveis do sistema podem ser definidos globalmente ao iniciar o servidor usando opções na linha de comando ou em um arquivo de opções. Ao iniciar, a sintaxe para variáveis de sistema é a mesma que para opções de comando, então, dentro dos nomes das variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes.

Quando você usa uma opção de inicialização para definir uma variável que recebe um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M` ou `G` (mayúsculas ou minúsculas) para indicar um multiplicador de 1024, 10242 ou 10243; ou seja, unidades de kilobytes, megabytes ou gigabytes, respectivamente. A partir do MySQL 8.0.14, um sufixo também pode ser `T`, `P` e `E` para indicar um multiplicador de 10244, 10245 ou 10246. Assim, o seguinte comando inicia o servidor com um tamanho de buffer de ordenação de 256 kilobytes e um tamanho máximo de pacote de um gigabyte:

```
mysqld --sort-buffer-size=256K --max-allowed-packet=1G
```

Dentro de um arquivo de opção, essas variáveis são definidas da seguinte forma:

```
[mysqld]
sort_buffer_size=256K
max_allowed_packet=1G
```

A letra maiúscula das letras de sufixo não importa; `256K` e `256k` são equivalentes, assim como `1G` e `1g`.

Para restringir o valor máximo ao qual uma variável do sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção do tipo `--maximum-var_name=value` durante a inicialização do servidor. Por exemplo, para impedir que o valor de `sort_buffer_size` seja aumentado para mais de 32 MB em tempo de execução, use a opção `--maximum-sort-buffer-size=32M`.

Muitas variáveis do sistema são dinâmicas e podem ser alteradas durante a execução do programa usando a instrução `SET`. Para uma lista, consulte a Seção 7.1.9.2, “Variáveis de Sistema Dinâmicas”. Para alterar uma variável de sistema com `SET`, consulte-a pelo nome, opcionalmente precedida por um modificador. Durante a execução, os nomes das variáveis de sistema devem ser escritos com underscores, não com hífens. Os seguintes exemplos ilustram brevemente essa sintaxe:

- Defina uma variável de sistema global:

  ```
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

- Persista uma variável de sistema global no arquivo `mysqld-auto.cnf` (e defina o valor de execução):

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

- Persista uma variável de sistema global no arquivo `mysqld-auto.cnf` (sem definir o valor de execução):

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```

- Defina uma variável de sistema de sessão:

  ```
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

Para obter detalhes completos sobre a sintaxe do `SET`, consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. Para uma descrição dos requisitos de privilégio para definir e persistir em variáveis do sistema, consulte a Seção 7.1.9.1, “Privilégios de Variáveis do Sistema”.

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no início do servidor, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável no início do servidor. Por exemplo, a primeira das linhas a seguir é válida no início do servidor, mas a segunda não é:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal durante a execução, mas a primeira não:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

Para exibir os nomes e valores das variáveis do sistema, use a instrução `SHOW VARIABLES`:

```
mysql> SHOW VARIABLES;
+---------------------------------+-----------------------------------+
| Variable_name                   | Value                             |
+---------------------------------+-----------------------------------+
| auto_increment_increment        | 1                                 |
| auto_increment_offset           | 1                                 |
| automatic_sp_privileges         | ON                                |
| back_log                        | 151                               |
| basedir                         | /home/mysql/                      |
| binlog_cache_size               | 32768                             |
| bulk_insert_buffer_size         | 8388608                           |
| character_set_client            | utf8mb4                           |
| character_set_connection        | utf8mb4                           |
| character_set_database          | utf8mb4                           |
| character_set_filesystem        | binary                            |
| character_set_results           | utf8mb4                           |
| character_set_server            | utf8mb4                           |
| character_set_system            | utf8mb3                           |
| character_sets_dir              | /home/mysql/share/charsets/       |
| check_proxy_users               | OFF                               |
| collation_connection            | utf8mb4_0900_ai_ci                |
| collation_database              | utf8mb4_0900_ai_ci                |
| collation_server                | utf8mb4_0900_ai_ci                |
...
| innodb_autoextend_increment     | 8                                 |
| innodb_buffer_pool_size         | 8388608                           |
| innodb_commit_concurrency       | 0                                 |
| innodb_concurrency_tickets      | 500                               |
| innodb_data_file_path           | ibdata1:10M:autoextend            |
| innodb_data_home_dir            |                                   |
...
| version                         | 8.0.31                            |
| version_comment                 | Source distribution               |
| version_compile_machine         | x86_64                            |
| version_compile_os              | Linux                             |
| version_compile_zlib            | 1.2.12                            |
| wait_timeout                    | 28800                             |
+---------------------------------+-----------------------------------+
```

Com uma cláusula `LIKE`, a declaração exibe apenas as variáveis que correspondem ao padrão. Para obter um nome específico de variável, use uma cláusula `LIKE` como mostrado:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponda a um padrão, use o caractere de substituição `%` em uma cláusula `LIKE`:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão a ser correspondido. De forma estrita, porque `_` é um curinga que corresponde a qualquer caractere único, você deve escapar dele como `_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.

Para `SHOW VARIABLES`, se você não especificar nem `GLOBAL` nem `SESSION`, o MySQL retorna os valores de `SESSION`.

A razão para exigir a palavra-chave `GLOBAL` ao definir variáveis apenas para `GLOBAL`, mas não ao recuperá-las, é para evitar problemas no futuro:

- Se uma variável `SESSION` fosse removida que tenha o mesmo nome de uma variável `GLOBAL`, um cliente com privilégios suficientes para modificar variáveis globais poderia, acidentalmente, alterar a variável `GLOBAL` em vez de apenas a variável `SESSION` para sua própria sessão.

- Se uma variável `SESSION` fosse adicionada com o mesmo nome de uma variável `GLOBAL`, um cliente que pretenda alterar a variável `GLOBAL` pode encontrar apenas sua própria variável `SESSION` alterada.
