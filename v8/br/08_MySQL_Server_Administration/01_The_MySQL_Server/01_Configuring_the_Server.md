### 7.1.1 Configurando o servidor

O servidor MySQL, **mysqld**, possui muitas opções de comando e variáveis de sistema que podem ser configuradas durante a inicialização para configurar sua operação. Para determinar os valores padrão das opções de comando e variáveis de sistema usadas pelo servidor, execute este comando:

```
$> mysqld --verbose --help
```

O comando exibe uma lista de todas as opções do **mysqld** e variáveis de sistema configuráveis. Sua saída inclui as opções e valores das variáveis padrão e parece assim:

```
abort-slave-event-count           0
allow-suspicious-udfs             FALSE
archive                           ON
auto-increment-increment          1
auto-increment-offset             1
autocommit                        TRUE
automatic-sp-privileges           TRUE
avoid-temporal-upgrade            FALSE
back-log                          80
basedir                           /home/jon/bin/mysql-8.0/
...
tmpdir                            /tmp
transaction-alloc-block-size      8192
transaction-isolation             REPEATABLE-READ
transaction-prealloc-size         4096
transaction-read-only             FALSE
transaction-write-set-extraction  XXHASH64
updatable-views-with-limit        YES
validate-user-plugins             TRUE
verbose                           TRUE
wait-timeout                      28800
```

Para ver os valores atuais das variáveis do sistema realmente usados pelo servidor enquanto ele está em execução, conecte-se a ele e execute a seguinte instrução:

```
mysql> SHOW VARIABLES;
```

Para ver alguns indicadores estatísticos e de status de um servidor em execução, execute a seguinte instrução:

```
mysql> SHOW STATUS;
```

As informações sobre variáveis do sistema e status também estão disponíveis usando o comando **mysqladmin**:

```
$> mysqladmin variables
$> mysqladmin extended-status
```

Para uma descrição completa de todas as opções de comando, variáveis de sistema e variáveis de status, consulte estas seções:

- Seção 7.1.7, “Opções de comando do servidor”
- Seção 7.1.8, “Variáveis do Sistema do Servidor”
- Seção 7.1.10, “Variáveis de Status do Servidor”

Informações mais detalhadas sobre o monitoramento estão disponíveis no Schema de Desempenho; veja o Capítulo 29, *Schema de Desempenho MySQL*. Além disso, o esquema MySQL `sys` é um conjunto de objetos que oferece acesso conveniente aos dados coletados pelo Schema de Desempenho; veja o Capítulo 30, *Schema sys MySQL*.

Se você especificar uma opção na linha de comando para **mysqld** ou **mysqld\_safe**, ela permanecerá em vigor apenas para essa invocação do servidor. Para usar a opção toda vez que o servidor for executado, coloque-a em um arquivo de opção. Veja a Seção 6.2.2.2, “Usando arquivos de opção”.
