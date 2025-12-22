### 7.1.9 Utilização de variáveis de sistema

O servidor MySQL mantém muitas variáveis do sistema que configuram sua operação. A seção 7.1.8, "Variáveis do Sistema do Servidor", descreve o significado dessas variáveis. Cada variável do sistema tem um valor padrão. As variáveis do sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente enquanto o servidor está em execução por meio da instrução `SET`, que permite modificar a operação do servidor sem ter que pará-lo e reiniciá-lo. Você também pode usar valores de variáveis do sistema em expressões.

Muitas variáveis de sistema são incorporadas. Variaveis de sistema também podem ser instaladas por plugins ou componentes do servidor:

- As variáveis do sistema implementadas por um plugin de servidor são expostas quando o plugin é instalado e têm nomes que começam com o nome do plugin. Por exemplo, o plugin `audit_log` implementa uma variável do sistema chamada `audit_log_policy`.
- As variáveis de sistema implementadas por um componente são expostas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de registro de erro `log_filter_dragnet` implementa uma variável de sistema chamada `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para se referir a esta variável, use o nome completo.

Existem dois âmbitos em que existem variáveis do sistema. Variaveis globais afetam a operação geral do servidor. Variaveis de sessão afetam sua operação para conexões individuais do cliente. Uma determinada variável do sistema pode ter um valor global e um valor de sessão. Variaveis globais e de sistema de sessão estão relacionadas da seguinte forma:

- Quando o servidor é iniciado, inicializa cada variável global para seu valor padrão. Esses padrões podem ser alterados por opções especificadas na linha de comando ou em um arquivo de opções.
- O servidor também mantém um conjunto de variáveis de sessão para cada cliente que se conecta. As variáveis de sessão do cliente são inicializadas no momento da conexão usando os valores atuais das variáveis globais correspondentes. Por exemplo, o modo SQL de um cliente é controlado pelo valor de sessão `sql_mode`, que é inicializado quando o cliente se conecta ao valor do valor global `sql_mode`.

  Para algumas variáveis do sistema, o valor da sessão não é inicializado a partir do valor global correspondente; se assim for, isso é indicado na descrição da variável.

Os valores das variáveis do sistema podem ser definidos globalmente na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções.

Quando você usa uma opção de inicialização para definir uma variável que toma um valor numérico, o valor pode ser dado com um sufixo de `K`, `M`, `G`, `T`, `P`, ou `E` (maiúsculas ou minúsculas) para indicar um multiplicador de 1024, 10242, 10243, 10244, 10245, ou 10246; isto é, unidades de kilobytes, megabytes, gigabytes, terabytes, petabytes, ou ettabytes, respectivamente. Assim, o seguinte comando inicia o servidor com um tamanho de buffer de classificação de 256 kilobytes e um tamanho máximo de pacote de um gigabyte:

```
mysqld --sort-buffer-size=256K --max-allowed-packet=1G
```

Dentro de um arquivo de opção, essas variáveis são definidas assim:

```
[mysqld]
sort_buffer_size=256K
max_allowed_packet=1G
```

O alfabeto das letras do sufixo não importa; `256K` e `256k` são equivalentes, assim como `1G` e `1g`.

Para restringir o valor máximo para o qual uma variável do sistema pode ser definida em tempo de execução com a instrução `SET`, especifique este valor máximo usando uma opção da forma `--maximum-var_name=value` na inicialização do servidor. Por exemplo, para evitar que o valor de `sort_buffer_size` seja aumentado para mais de 32MB em tempo de execução, use a opção `--maximum-sort-buffer-size=32M`.

Muitas variáveis de sistema são dinâmicas e podem ser alteradas no tempo de execução usando a instrução `SET`. Para uma lista, veja a Seção 7.1.9.2, Variáveis de Sistema Dinâmicas. Para alterar uma variável de sistema com `SET`, refira-se a ela pelo nome, opcionalmente precedido por um modificador. No tempo de execução, os nomes de variáveis de sistema devem ser escritos usando sublinhados, não traços. Os exemplos a seguir ilustram brevemente esta sintaxe:

- Defina uma variável de sistema global:

  ```
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```
- Persiste uma variável de sistema global para o arquivo `mysqld-auto.cnf` (e defina o valor de tempo de execução):

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```
- Persiste uma variável de sistema global para o arquivo `mysqld-auto.cnf` (sem definir o valor de tempo de execução):

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```
- Defina uma variável do sistema de sessão:

  ```
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

Para obter detalhes completos sobre a sintaxe do `SET`, consulte a Seção 15.7.6.1, "SET Syntax for Variable Assignment". Para uma descrição dos requisitos de privilégio para a definição e persistência de variáveis do sistema, consulte a Seção 7.1.9.1, "System Variable Privileges".

Os sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável na inicialização do servidor, mas não para definir o valor com `SET` no tempo de execução. Por outro lado, com `SET` você pode atribuir o valor de uma variável usando uma expressão, o que não é verdade quando você define uma variável na inicialização do servidor. Por exemplo, a primeira das seguintes linhas é legal na inicialização do servidor, mas a segunda não é:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das seguintes linhas é legal em tempo de execução, mas a primeira não é:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

Para exibir nomes e valores de variáveis do sistema, use a instrução `SHOW VARIABLES`:

```
mysql> SHOW VARIABLES;
+-------------------------------------------------------+----------------------+
| Variable_name                                         | Value                |
+-------------------------------------------------------+----------------------+
| activate_all_roles_on_login                           | OFF                  |
| admin_address                                         |                      |
| admin_port                                            | 33062                |
| admin_ssl_ca                                          |                      |
| admin_ssl_capath                                      |                      |
| admin_ssl_cert                                        |                      |
| admin_ssl_cipher                                      |                      |
| admin_ssl_crl                                         |                      |
| admin_ssl_crlpath                                     |                      |
| admin_ssl_key                                         |                      |
| admin_tls_ciphersuites                                |                      |
| admin_tls_version                                     | TLSv1.2,TLSv1.3      |
| authentication_policy                                 | *,,                  |
| auto_generate_certs                                   | ON                   |
| auto_increment_increment                              | 1                    |
| auto_increment_offset                                 | 1                    |
| autocommit                                            | ON                   |
| automatic_sp_privileges                               | ON                   |

...

| version                                               | 8.4.0                |
| version_comment                                       | Source distribution  |
| version_compile_machine                               | x86_64               |
| version_compile_os                                    | Linux                |
| version_compile_zlib                                  | 1.2.13               |
| wait_timeout                                          | 28800                |
| warning_count                                         | 0                    |
| windowing_use_high_precision                          | ON                   |
| xa_detach_on_prepare                                  | ON                   |
+-------------------------------------------------------+----------------------+
```

Com uma cláusula `LIKE`, a instrução exibe apenas as variáveis que correspondem ao padrão. Para obter um nome de variável específico, use uma cláusula `LIKE` como mostrado:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponde a um padrão, use o caractere wildcard `%` em uma cláusula `LIKE`:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres wildcard podem ser usados em qualquer posição dentro do padrão a ser correspondido. Estritamente falando, como \[`_`] é um wildcard que corresponde a qualquer personagem, você deve escapá-lo como \[`\_`]] para combiná-lo literalmente. Na prática, isso raramente é necessário.

Para `SHOW VARIABLES`, se você não especificar nem `GLOBAL` nem `SESSION`, o MySQL retornará valores de `SESSION`.

A razão para exigir a palavra-chave `GLOBAL` ao definir variáveis apenas para `GLOBAL` mas não ao recuperá-las é evitar problemas no futuro:

- Se uma variável `SESSION` fosse removida e tivesse o mesmo nome que uma variável `GLOBAL`, um cliente com privilégios suficientes para modificar variáveis globais poderia acidentalmente alterar a variável `GLOBAL` em vez da variável `SESSION` para sua própria sessão.
- Se uma `SESSION` variável fosse adicionada com o mesmo nome de uma `GLOBAL` variável, um cliente que pretende alterar a `GLOBAL` variável poderia encontrar apenas sua própria `SESSION` variável alterada.
