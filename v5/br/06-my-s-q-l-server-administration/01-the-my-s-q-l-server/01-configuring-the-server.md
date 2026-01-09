### 5.1.1 Configurando o servidor

O servidor MySQL, **mysqld**, possui muitas opções de comando e variáveis de sistema que podem ser configuradas durante o início para configurar sua operação. Para determinar os valores padrão das opções de comando e variáveis de sistema usadas pelo servidor, execute este comando:

```sql
$> mysqld --verbose --help
```

O comando exibe uma lista de todas as opções do **mysqld** e variáveis de sistema configuráveis. Sua saída inclui as opções e valores das variáveis padrão e parece assim:

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

Para ver os valores atuais das variáveis do sistema realmente usados pelo servidor enquanto ele está em execução, conecte-se a ele e execute a seguinte instrução:

```sql
mysql> SHOW VARIABLES;
```

Para ver alguns indicadores estatísticos e de status de um servidor em execução, execute a seguinte instrução:

```sql
mysql> SHOW STATUS;
```

As informações sobre variáveis do sistema e status também estão disponíveis usando o comando **mysqladmin**:

```sql
$> mysqladmin variables
$> mysqladmin extended-status
```

Para uma descrição completa de todas as opções de comando, variáveis de sistema e variáveis de status, consulte estas seções:

- Seção 5.1.6, “Opções de comando do servidor”
- Seção 5.1.7, “Variáveis do Sistema do Servidor”
- Seção 5.1.9, “Variáveis de Status do Servidor”

Informações mais detalhadas sobre o monitoramento estão disponíveis no Schema de Desempenho; veja Capítulo 25, *Schema de Desempenho MySQL*. Além disso, o esquema `sys` do MySQL é um conjunto de objetos que oferece acesso conveniente aos dados coletados pelo Schema de Desempenho; veja Capítulo 26, *Esquema sys MySQL*.

O MySQL utiliza algoritmos que são muito escaláveis, então você geralmente pode executar com muito pouca memória. No entanto, normalmente, melhores resultados de desempenho são obtidos ao fornecer mais memória ao MySQL.

Ao sintonizar um servidor MySQL, as duas variáveis mais importantes a serem configuradas são `key_buffer_size` e `table_open_cache`. Você deve ter certeza de que essas variáveis estão configuradas corretamente antes de tentar alterar outras variáveis.

Os exemplos a seguir indicam alguns valores variáveis típicos para diferentes configurações de execução.

- Se você tiver pelo menos 1 a 2 GB de memória e muitas tabelas e deseja o máximo de desempenho com um número moderado de clientes, use algo como o seguinte:

  ```sql
  $> mysqld_safe --key_buffer_size=384M --table_open_cache=4000 \
             --sort_buffer_size=4M --read_buffer_size=1M &
  ```

- Se você tem apenas 256 MB de memória e apenas algumas tabelas, mas ainda faz muitas ordenações, você pode usar algo como isso:

  ```sql
  $> mysqld_safe --key_buffer_size=64M --sort_buffer_size=1M
  ```

  Se houver muitas conexões simultâneas, problemas de troca podem ocorrer, a menos que o **mysqld** tenha sido configurado para usar muito pouca memória para cada conexão. O **mysqld** funciona melhor se você tiver memória suficiente para todas as conexões.

- Com pouca memória e muitas conexões, use algo como isso:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=100K \
             --read_buffer_size=100K &
  ```

  Ou até mesmo:

  ```sql
  $> mysqld_safe --key_buffer_size=512K --sort_buffer_size=16K \
             --table_open_cache=32 --read_buffer_size=8K \
             --net_buffer_length=1K &
  ```

Se você estiver executando operações de `GROUP BY` ou `ORDER BY` em tabelas muito maiores do que a memória disponível, aumente o valor de `read_rnd_buffer_size` para acelerar a leitura de linhas após operações de ordenação.

Se você especificar uma opção na linha de comando para **mysqld** ou **mysqld_safe**, ela permanecerá em vigor apenas para essa invocação do servidor. Para usar a opção toda vez que o servidor for executado, coloque-a em um arquivo de opção. Veja Seção 4.2.2.2, “Usando Arquivos de Opção”.
