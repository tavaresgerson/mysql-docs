### 7.1.9 Uso de Variáveis de Sistema

O servidor MySQL mantém muitas variáveis de sistema que configuram sua operação. A seção 7.1.8, “Variáveis de Sistema do Servidor”, descreve o significado dessas variáveis. Cada variável de sistema tem um valor padrão. As variáveis de sistema podem ser definidas na inicialização do servidor usando opções na linha de comando ou em um arquivo de opções. A maioria delas pode ser alterada dinamicamente enquanto o servidor estiver em execução por meio da instrução `SET`, que permite modificar a operação do servidor sem precisar parar e reiniciar. Você também pode usar os valores das variáveis de sistema em expressões.

Muitas variáveis de sistema são integradas. As variáveis de sistema também podem ser instaladas por plugins ou componentes do servidor:

* Variáveis de sistema implementadas por um plugin do servidor são exibidas quando o plugin é instalado e têm nomes que começam com o nome do plugin. Por exemplo, o plugin `audit_log` implementa uma variável de sistema chamada `audit_log_policy`.
* Variáveis de sistema implementadas por um componente são exibidas quando o componente é instalado e têm nomes que começam com um prefixo específico do componente. Por exemplo, o componente de filtro de log de erro `log_filter_dragnet` implementa uma variável de sistema chamada `log_error_filter_rules`, cujo nome completo é `dragnet.log_error_filter_rules`. Para referenciar essa variável, use o nome completo.

Existem dois escopos nos quais as variáveis de sistema existem. Variáveis globais afetam a operação geral do servidor. Variáveis de sessão afetam sua operação para conexões individuais de clientes. Uma dada variável de sistema pode ter um valor global e uma sessão. Variáveis de sistema globais e de sessão estão relacionadas da seguinte forma:

* Quando o servidor é iniciado, ele inicializa cada variável global com seu valor padrão. Esses valores padrão podem ser alterados por opções especificadas na linha de comando ou em um arquivo de opções. (Veja a Seção 6.2.2, “Especificação de Opções do Programa”.)
* O servidor também mantém um conjunto de variáveis de sessão para cada cliente que se conecta. As variáveis de sessão do cliente são inicializadas no momento da conexão usando os valores atuais das variáveis globais correspondentes. Por exemplo, o modo SQL de um cliente é controlado pelo valor da variável de sessão `sql_mode`, que é inicializado quando o cliente se conecta ao valor do valor global `sql_mode`.

Para algumas variáveis de sistema, o valor da sessão não é inicializado a partir do valor global correspondente; se assim for, isso é indicado na descrição da variável.

Os valores das variáveis de sistema podem ser definidos globalmente ao iniciar o servidor usando opções na linha de comando ou em um arquivo de opções. Ao iniciar, a sintaxe para variáveis de sistema é a mesma que para opções de comando, então, dentro dos nomes das variáveis, travessões e sublinhados podem ser usados de forma intercambiável. Por exemplo, `--general_log=ON` e `--general-log=ON` são equivalentes.

Quando você usa uma opção de inicialização para definir uma variável que aceita um valor numérico, o valor pode ser fornecido com um sufixo de `K`, `M`, `G`, `T`, `P` ou `E` (semelhante ou maiúscula) para indicar um multiplicador de 1024, 10242, 10243, 10244, 10245 ou 10246; ou seja, unidades de kilobytes, megabytes, gigabytes, terabytes, petabytes ou ettabytes, respectivamente. Assim, o seguinte comando inicia o servidor com um tamanho de buffer de ordenação de 256 kilobytes e um tamanho máximo de pacote de um gigabyte:

```
mysqld --sort-buffer-size=256K --max-allowed-packet=1G
```

Dentro de um arquivo de opções, essas variáveis são definidas assim:

```
[mysqld]
sort_buffer_size=256K
max_allowed_packet=1G
```

A letracase das letras do sufixo não importa; `256K` e `256k` são equivalentes, assim como `1G` e `1g`.

Para restringir o valor máximo ao qual uma variável de sistema pode ser definida em tempo de execução com a instrução `SET`, especifique esse máximo usando uma opção da forma `--maximum-var_name=value` no início do servidor. Por exemplo, para impedir que o valor de `sort_buffer_size` seja aumentado para mais de 32MB em tempo de execução, use a opção `--maximum-sort-buffer-size=32M`.

Muitas variáveis de sistema são dinâmicas e podem ser alteradas em tempo de execução usando a instrução `SET`. Para uma lista, consulte a Seção 7.1.9.2, “Variáveis de Sistema Dinâmicas”. Para alterar uma variável de sistema com `SET`, refira-se a ela pelo nome, opcionalmente precedido por um modificador. Em tempo de execução, os nomes das variáveis de sistema devem ser escritos usando sublinhados, não traços. Os seguintes exemplos ilustram brevemente essa sintaxe:

* Defina uma variável de sistema global:

  ```
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```
* Mantenha uma variável de sistema global no arquivo `mysqld-auto.cnf` (e defina o valor em tempo de execução):

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```
* Mantenha uma variável de sistema global no arquivo `mysqld-auto.cnf` (sem definir o valor em tempo de execução):

  ```
  SET PERSIST_ONLY back_log = 1000;
  SET @@PERSIST_ONLY.back_log = 1000;
  ```
* Defina uma variável de sistema de sessão:

  ```
  SET SESSION sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  ```

Para obter detalhes completos sobre a sintaxe de `SET`, consulte a Seção 15.7.6.1, “Sintaxe de SET para Atribuição de Variáveis”. Para uma descrição dos requisitos de privilégio para definir e manter variáveis de sistema, consulte a Seção 7.1.9.1, “Privilégios de Variáveis de Sistema”

Sufixos para especificar um multiplicador de valor podem ser usados ao definir uma variável no início do servidor, mas não para definir o valor com `SET` em tempo de execução. Por outro lado, com `SET`, você pode atribuir o valor de uma variável usando uma expressão, o que não é verdadeiro ao definir uma variável no início do servidor. Por exemplo, a primeira das linhas a seguir é legal no início do servidor, mas a segunda não é:

```
$> mysql --max_allowed_packet=16M
$> mysql --max_allowed_packet=16*1024*1024
```

Por outro lado, a segunda das linhas a seguir é legal em tempo de execução, mas a primeira não é:

```
mysql> SET GLOBAL max_allowed_packet=16M;
mysql> SET GLOBAL max_allowed_packet=16*1024*1024;
```

Para exibir os nomes e valores das variáveis de sistema, use a instrução `SHOW VARIABLES`:

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

Com uma cláusula `LIKE`, a declaração exibe apenas as variáveis que correspondem ao padrão. Para obter um nome específico de variável, use uma cláusula `LIKE` conforme mostrado:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

Para obter uma lista de variáveis cujo nome corresponda a um padrão, use o caractere curinga `%` em uma cláusula `LIKE`:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Os caracteres curinga podem ser usados em qualquer posição dentro do padrão a ser correspondido. De forma estrita, porque `_` é um curinga que corresponde a qualquer único caractere, você deve escapar `_` como `\_` para correspondê-lo literalmente. Na prática, isso raramente é necessário.

Para `SHOW VARIABLES`, se você não especificar `GLOBAL` nem `SESSION`, o MySQL retorna os valores `SESSION`.

A razão para exigir a palavra-chave `GLOBAL` ao definir variáveis `GLOBAL` apenas e não ao recuperá-las é para evitar problemas no futuro:

* Se uma variável `SESSION` fosse removida que tenha o mesmo nome que uma variável `GLOBAL`, um cliente com privilégios suficientes para modificar variáveis globais poderia acidentalmente alterar a variável `GLOBAL` em vez de apenas a variável `SESSION` para sua própria sessão.
* Se uma variável `SESSION` fosse adicionada com o mesmo nome que uma variável `GLOBAL`, um cliente que pretenda alterar a variável `GLOBAL` poderia encontrar apenas sua própria variável `SESSION` alterada.