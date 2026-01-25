### 5.1.1 Configurando o Servidor

O servidor MySQL, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), possui muitas opções de comando e System Variables que podem ser definidas na inicialização para configurar sua operação. Para determinar os valores padrão das opções de comando e System Variables usadas pelo servidor, execute este comando:

```sql
$> mysqld --verbose --help
```

O comando produz uma lista de todas as opções e System Variables configuráveis do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). Sua saída inclui os valores padrão de opções e variáveis e se parece com o seguinte:

```sql
abort-slave-event-count           0
allow-suspicious-udfs             FALSE
archive                           ON
auto-increment-increment          1
auto-increment-offset             1
autocommit                        TRUE
automatic-sp-privileges           TRUE
avoid-temporal-upgrade            FALSE
back-log                          80
basedir                           /home/jon/bin/mysql-5.7/
...
tmpdir                            /tmp
transaction-alloc-block-size      8192
transaction-isolation             REPEATABLE-READ
transaction-prealloc-size         4096
transaction-read-only             FALSE
transaction-write-set-extraction  OFF
updatable-views-with-limit        YES
validate-user-plugins             TRUE
verbose                           TRUE
wait-timeout                      28800
```

Para ver os valores atuais das System Variables realmente usados pelo servidor enquanto ele está em execução, conecte-se a ele e execute esta instrução:

```sql
mysql> SHOW VARIABLES;
```

Para ver alguns indicadores estatísticos e de Status para um servidor em execução, execute esta instrução:

```sql
mysql> SHOW STATUS;
```

Informações sobre System Variable e Status também estão disponíveis usando o comando [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"):

```sql
$> mysqladmin variables
$> mysqladmin extended-status
```

Para uma descrição completa de todas as opções de comando, System Variables e Status Variables, consulte as seguintes seções:

* [Seção 5.1.6, “Opções de Comando do Servidor”](server-options.html "5.1.6 Opções de Comando do Servidor")
* [Seção 5.1.7, “System Variables do Servidor”](server-system-variables.html "5.1.7 System Variables do Servidor")
* [Seção 5.1.9, “Status Variables do Servidor”](server-status-variables.html "5.1.9 Status Variables do Servidor")

Informações de monitoramento mais detalhadas estão disponíveis no Performance Schema; consulte [Capítulo 25, *MySQL Performance Schema*](performance-schema.html "Chapter 25 MySQL Performance Schema"). Além disso, o `sys` schema do MySQL é um conjunto de objetos que fornece acesso conveniente aos dados coletados pelo Performance Schema; consulte [Capítulo 26, *MySQL sys Schema*](sys-schema.html "Chapter 26 MySQL sys Schema").

O MySQL usa algoritmos muito escaláveis, de modo que geralmente é possível executá-lo com pouca memória. No entanto, o desempenho geralmente melhora ao fornecer mais memória ao MySQL.

Ao ajustar um servidor MySQL, as duas variáveis mais importantes a serem configuradas são [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) e [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache). Você deve primeiro ter certeza de que estas estão definidas adequadamente antes de tentar alterar quaisquer outras variáveis.

Os exemplos a seguir indicam alguns valores típicos de variáveis para diferentes configurações de tempo de execução.

* Se você tiver pelo menos 1-2GB de memória e muitas tabelas, e desejar desempenho máximo com um número moderado de clientes, use algo como isto:

  ```sql
  $> mysqld_safe --key_buffer_size=384M --table_open_cache=4000 \
             --sort_buffer_size=4M --read_buffer_size=1M &
  ```

* Se você tiver apenas 256MB de memória e apenas algumas tabelas, mas ainda realizar muitas operações de ordenação (sorting), você pode usar algo como isto:

  ```sql
  $> mysqld_safe --key_buffer_size=64M --sort_buffer_size=1M
  ```

  Se houver muitas conexões simultâneas, problemas de *swapping* podem ocorrer, a menos que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") tenha sido configurado para usar muito pouca memória para cada conexão. O [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") tem um desempenho melhor se você tiver memória suficiente para todas as conexões.

* Com pouca memória e muitas conexões, use algo como isto:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=100K \
             --read_buffer_size=100K &
  ```

  Ou mesmo isto:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=16K \
             --table_open_cache=32 --read_buffer_size=8K \
             --net_buffer_length=1K &
  ```

Se você estiver realizando operações `GROUP BY` ou `ORDER BY` em tabelas que são muito maiores do que a sua memória disponível, aumente o valor de [`read_rnd_buffer_size`](server-system-variables.html#sysvar_read_rnd_buffer_size) para acelerar a leitura de linhas após as operações de ordenação.

Se você especificar uma opção na linha de comando para [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") ou [**mysqld_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), ela permanece em vigor apenas para aquela invocação do servidor. Para usar a opção toda vez que o servidor for executado, coloque-a em um arquivo de opções (option file). Consulte [Seção 4.2.2.2, “Usando Arquivos de Opções”](option-files.html "4.2.2.2 Usando Arquivos de Opções").