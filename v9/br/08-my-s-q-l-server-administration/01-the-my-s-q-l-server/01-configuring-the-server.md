### 7.1.1 Configurando o Servidor

O servidor MySQL, **mysqld**, possui muitas opções de comando e variáveis de sistema que podem ser configuradas durante a inicialização para configurar sua operação. Para determinar os valores padrão das opções de comando e variáveis de sistema usadas pelo servidor, execute este comando:

```
$> mysqld --verbose --help
```

O comando produz uma lista de todas as opções do **mysqld** e variáveis de sistema configuráveis. Sua saída inclui os valores padrão da opção e da variável e parece algo assim:

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

Para ver os valores atuais das variáveis de sistema realmente usadas pelo servidor enquanto ele está em execução, conecte-se a ele e execute esta declaração:

```
mysql> SHOW VARIABLES;
```

Para ver alguns indicadores estatísticos e de status para um servidor em execução, execute esta declaração:

```
mysql> SHOW STATUS;
```

As informações sobre variáveis de sistema e status também estão disponíveis usando o comando **mysqladmin**:

```
$> mysqladmin variables
$> mysqladmin extended-status
```

Para uma descrição completa de todas as opções de comando, variáveis de sistema e variáveis de status, consulte estas seções:

* Seção 7.1.7, “Opções de Comando do Servidor”
* Seção 7.1.8, “Variáveis de Sistema do Servidor”
* Seção 7.1.10, “Variáveis de Status do Servidor”

Informações mais detalhadas de monitoramento estão disponíveis no Schema de Desempenho; consulte o Capítulo 29, *MySQL Schema de Desempenho*. Além disso, o esquema `sys` do MySQL é um conjunto de objetos que fornece acesso conveniente aos dados coletados pelo Schema de Desempenho; consulte o Capítulo 30, *MySQL Schema sys*.

Se você especificar uma opção na linha de comando para **mysqld** ou **mysqld\_safe**, ela permanecerá em vigor apenas para essa invocação do servidor. Para usar a opção toda vez que o servidor for executado, coloque-a em um arquivo de opção. Consulte a Seção 6.2.2.2, “Usando Arquivos de Opção”.

Os usuários do Windows podem executar a Seção 2.3.2, “Configuração: Usando o Configurável MySQL”, para ajudar a configurar uma instalação do servidor MySQL. Isso inclui tarefas como configurar usuários do MySQL, arquivos de log, o nome do serviço do Windows e bancos de dados de exemplo.