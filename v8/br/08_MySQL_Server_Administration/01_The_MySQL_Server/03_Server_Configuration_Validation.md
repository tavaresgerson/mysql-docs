### 7.1.3 Validação da Configuração do Servidor

A partir do MySQL 8.0.16, o MySQL Server suporta a opção `--validate-config`, que permite verificar a configuração de inicialização em busca de problemas sem executar o servidor no modo operacional normal:

```
mysqld --validate-config
```

Se não forem encontrados erros, o servidor termina com um código de saída de

0. Se um erro for encontrado, o servidor exibe uma mensagem de diagnóstico e termina com um código de saída de 1. Por exemplo:

```
$> mysqld --validate-config --no-such-option
2018-11-05T17:50:12.738919Z 0 [ERROR] [MY-000068] [Server] unknown
option '--no-such-option'.
2018-11-05T17:50:12.738962Z 0 [ERROR] [MY-010119] [Server] Aborting
```

O servidor é encerrado assim que qualquer erro for encontrado. Para que verificações adicionais ocorram, corrija o problema inicial e execute o servidor novamente com \[\[`--validate-config`] ].

Para o exemplo anterior, onde o uso de `--validate-config` resulta na exibição de uma mensagem de erro, o código de saída do servidor é 1. Mensagens de aviso e informações também podem ser exibidas, dependendo do valor de `log_error_verbosity`, mas não produzem a interrupção imediata da validação ou um código de saída de 1. Por exemplo, este comando produz vários avisos, os quais são exibidos. Mas não ocorre nenhum erro, então o código de saída é 0:

```
$> mysqld --validate-config --log_error_verbosity=2
         --read-only=s --transaction_read_only=s
2018-11-05T15:43:18.445863Z 0 [Warning] [MY-000076] [Server] option
'read_only': boolean value 's' was not recognized. Set to OFF.
2018-11-05T15:43:18.445882Z 0 [Warning] [MY-000076] [Server] option
'transaction-read-only': boolean value 's' was not recognized. Set to OFF.
```

Esse comando produz os mesmos avisos, mas também um erro, então a mensagem de erro é exibida junto com os avisos e o código de saída é 1:

```
$> mysqld --validate-config --log_error_verbosity=2
         --no-such-option --read-only=s --transaction_read_only=s
2018-11-05T15:43:53.152886Z 0 [Warning] [MY-000076] [Server] option
'read_only': boolean value 's' was not recognized. Set to OFF.
2018-11-05T15:43:53.152913Z 0 [Warning] [MY-000076] [Server] option
'transaction-read-only': boolean value 's' was not recognized. Set to OFF.
2018-11-05T15:43:53.164889Z 0 [ERROR] [MY-000068] [Server] unknown
option '--no-such-option'.
2018-11-05T15:43:53.165053Z 0 [ERROR] [MY-010119] [Server] Aborting
```

O escopo da opção `--validate-config` é limitado à verificação de configuração para garantir que o servidor possa funcionar sem passar pelo processo de inicialização normal. Como tal, a verificação de configuração não inicializa os motores de armazenamento e outros plugins, componentes, etc., e não valida as opções associadas a esses subsistemas não inicializados.

`--validate-config` pode ser usado a qualquer momento, mas é particularmente útil após uma atualização, para verificar se quaisquer opções anteriormente usadas com o servidor antigo são consideradas pelo servidor atualizado como desatualizadas ou obsoletas. Por exemplo, a variável de sistema `tx_read_only` foi desatualizada no MySQL 5.7 e removida no 8.0. Suponha que um servidor MySQL 5.7 tenha sido executado usando essa variável de sistema em seu arquivo `my.cnf` e depois atualizado para o MySQL 8.0. Executar o servidor atualizado com `--validate-config` para verificar a configuração produz este resultado:

```
$> mysqld --validate-config
2018-11-05T10:40:02.712141Z 0 [ERROR] [MY-000067] [Server] unknown variable
'tx_read_only=ON'.
2018-11-05T10:40:02.712178Z 0 [ERROR] [MY-010119] [Server] Aborting
```

O `--validate-config` pode ser usado com a opção `--defaults-file` para validar apenas as opções em um arquivo específico:

```
$> mysqld --defaults-file=./my.cnf-test --validate-config
2018-11-05T10:40:02.712141Z 0 [ERROR] [MY-000067] [Server] unknown variable
'tx_read_only=ON'.
2018-11-05T10:40:02.712178Z 0 [ERROR] [MY-010119] [Server] Aborting
```

Lembre-se de que `--defaults-file`, se especificado, deve ser a primeira opção na linha de comando. (Executando o exemplo anterior com a ordem de opções invertida produz uma mensagem de que `--defaults-file` em si é desconhecida.)
