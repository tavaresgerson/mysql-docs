### 7.1.1 Configuração do servidor

O servidor MySQL, `mysqld`, tem muitas opções de comando e variáveis do sistema que podem ser definidas no início para configurar sua operação. Para determinar a opção de comando padrão e os valores de variáveis do sistema usados pelo servidor, execute este comando:

```
$> mysqld --verbose --help
```

O comando produz uma lista de todas as opções `mysqld` e variáveis do sistema configuráveis. Sua saída inclui a opção padrão e valores de variáveis e parece algo assim:

```
activate-all-roles-on-login                                  FALSE
admin-address                                                (No default value)
admin-port                                                   33062
admin-ssl                                                    TRUE
admin-ssl-ca                                                 (No default value)
admin-ssl-capath                                             (No default value)
admin-ssl-cert                                               (No default value)
admin-ssl-cipher                                             (No default value)
admin-ssl-crl                                                (No default value)

...

transaction-prealloc-size                                    4096
transaction-read-only                                        FALSE
updatable-views-with-limit                                   YES
upgrade                                                      AUTO
validate-config                                              FALSE
validate-user-plugins                                        TRUE
verbose                                                      TRUE
wait-timeout                                                 28800
windowing-use-high-precision                                 TRUE
xa-detach-on-prepare                                         TRUE
```

Para ver os valores de variáveis do sistema atualmente usados pelo servidor enquanto ele é executado, conecte-se a ele e execute esta instrução:

```
mysql> SHOW VARIABLES;
```

Para ver alguns indicadores estatísticos e de status para um servidor em execução, execute esta instrução:

```
mysql> SHOW STATUS;
```

As informações sobre variáveis e status do sistema também estão disponíveis usando o comando `mysqladmin`:

```
$> mysqladmin variables
$> mysqladmin extended-status
```

Para uma descrição completa de todas as opções de comando, variáveis do sistema e variáveis de estado, ver estas seções:

- Secção 7.1.7, "Opções de comando do servidor"
- Secção 7.1.8, "Variaveis do sistema do servidor"
- Secção 7.1.10, "Variaveis de estado do servidor"

Informações mais detalhadas de monitoramento estão disponíveis no Performance Schema; ver Capítulo 29, *MySQL Performance Schema*. Além disso, o MySQL `sys` esquema é um conjunto de objetos que fornece acesso conveniente aos dados coletados pelo Performance Schema; ver Capítulo 30, *MySQL sys Schema*.

Se você especificar uma opção na linha de comando para `mysqld` ou `mysqld_safe`, ela permanece em vigor apenas para essa invocação do servidor. Para usar a opção toda vez que o servidor é executado, coloque-a em um arquivo de opções. Veja a Seção 6.2.2.2, "Utilizar Arquivos de Opções".

Os usuários do Windows podem executar a Seção 2.3.2, "Configuração: Usando o Configurador MySQL" para ajudar a configurar uma instalação de servidor MySQL. Isso inclui tarefas como a configuração de usuários MySQL, arquivos de log, o nome do serviço do Windows e bancos de dados de amostra.
