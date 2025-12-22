### 7.1.3 Validação da configuração do servidor

O MySQL suporta uma opção `--validate-config` que permite que a configuração de inicialização seja verificada para problemas sem executar o servidor no modo operacional normal:

```
mysqld --validate-config
```

Se nenhum erro for encontrado, o servidor termina com um código de saída de 0. Se um erro for encontrado, o servidor exibe uma mensagem de diagnóstico e termina com um código de saída de 1.

```
$> mysqld --validate-config --no-such-option
2018-11-05T17:50:12.738919Z 0 [ERROR] [MY-000068] [Server] unknown
option '--no-such-option'.
2018-11-05T17:50:12.738962Z 0 [ERROR] [MY-010119] [Server] Aborting
```

O servidor termina assim que qualquer erro é encontrado. Para verificações adicionais ocorrerem, corrija o problema inicial e execute o servidor com `--validate-config` novamente.

Para o exemplo anterior, onde o uso de `--validate-config` resulta na exibição de uma mensagem de erro, o código de saída do servidor é 1. Mensagens de aviso e informações também podem ser exibidas, dependendo do valor `log_error_verbosity`, mas não produzem término imediato de validação ou um código de saída de 1. Por exemplo, este comando produz vários avisos, ambos exibidos. Mas nenhum erro ocorre, então o código de saída é 0:

```
$> mysqld --validate-config --log_error_verbosity=2
         --read-only=s --transaction_read_only=s
2018-11-05T15:43:18.445863Z 0 [Warning] [MY-000076] [Server] option
'read_only': boolean value 's' was not recognized. Set to OFF.
2018-11-05T15:43:18.445882Z 0 [Warning] [MY-000076] [Server] option
'transaction-read-only': boolean value 's' was not recognized. Set to OFF.
```

Este comando produz os mesmos avisos, mas também um erro, de modo que a mensagem de erro é exibida juntamente com os avisos e o código de saída é 1:

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

O escopo da opção `--validate-config` é limitado à verificação de configuração que o servidor pode executar sem passar por seu processo de inicialização normal. Como tal, a verificação de configuração não inicializa motores de armazenamento e outros plugins, componentes e assim por diante, e não valida opções associadas a esses subsistemas não inicializados.

O `--validate-config` pode ser usado a qualquer momento, mas é particularmente útil após uma atualização, para verificar se quaisquer opções usadas anteriormente com o servidor mais antigo são consideradas pelo servidor atualizado como obsoletas ou desatualizadas. Por exemplo, a variável do sistema `tx_read_only` foi removida em 8.0.

```
$> mysqld --validate-config
2018-11-05T10:40:02.712141Z 0 [ERROR] [MY-000067] [Server] unknown variable
'tx_read_only=ON'.
2018-11-05T10:40:02.712178Z 0 [ERROR] [MY-010119] [Server] Aborting
```

`--validate-config` pode ser usado com a `--defaults-file` opção para validar apenas as opções em um arquivo específico:

```
$> mysqld --defaults-file=./my.cnf-test --validate-config
2018-11-05T10:40:02.712141Z 0 [ERROR] [MY-000067] [Server] unknown variable
'tx_read_only=ON'.
2018-11-05T10:40:02.712178Z 0 [ERROR] [MY-010119] [Server] Aborting
```

Lembre-se de que `--defaults-file`, se especificado, deve ser a primeira opção na linha de comando. (A execução do exemplo anterior com a ordem da opção invertida produz uma mensagem de que `--defaults-file` em si é desconhecida.)
