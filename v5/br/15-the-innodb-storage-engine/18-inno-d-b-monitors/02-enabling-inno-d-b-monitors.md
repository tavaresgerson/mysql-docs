### 14.18.2 Habilitando os Monitores InnoDB

Quando os `InnoDB` Monitors são habilitados para Output periódico, o `InnoDB` grava o Output para a saída de erro padrão do **mysqld** Server (`stderr`) a cada 15 segundos, aproximadamente.

O `InnoDB` envia o Output do Monitor para `stderr` em vez de para `stdout` ou para Buffers de memória de tamanho fixo para evitar potenciais *buffer overflows*.

No Windows, `stderr` é direcionado para o arquivo de Log padrão, a menos que configurado de outra forma. Se você quiser direcionar o Output para a janela do console em vez de para o Error Log, inicie o Server a partir de um *command prompt* em uma janela de console com a opção `--console`. Para mais informações, consulte a Seção 5.4.2.1, “Error Logging on Windows”.

Em sistemas Unix e semelhantes ao Unix, `stderr` é tipicamente direcionado para o terminal, a menos que configurado de outra forma. Para mais informações, consulte a Seção 5.4.2.2, “Error Logging on Unix and Unix-Like Systems”.

Os `InnoDB` Monitors devem ser habilitados apenas quando você realmente deseja ver informações de Monitoramento, pois a geração de Output causa alguma diminuição de Performance. Além disso, se o Output do Monitor for direcionado para o Error Log, o Log poderá se tornar bastante grande se você se esquecer de desabilitar o Monitor mais tarde.

Note

Para auxiliar no *troubleshooting*, o `InnoDB` habilita temporariamente o Output padrão do `InnoDB` Monitor sob certas condições. Para mais informações, consulte a Seção 14.22, “InnoDB Troubleshooting”.

O Output do `InnoDB` Monitor começa com um *header* contendo um *timestamp* e o nome do Monitor. Por exemplo:

```sql
=====================================
2014-10-16 18:37:29 0x7fc2a95c1700 INNODB MONITOR OUTPUT
=====================================
```

O *header* para o `InnoDB` Monitor padrão (`INNODB MONITOR OUTPUT`) também é usado para o Lock Monitor porque este último produz o mesmo Output com o acréscimo de informações de Lock extras.

As variáveis de sistema `innodb_status_output` e `innodb_status_output_locks` são usadas para habilitar o `InnoDB` Monitor padrão e o `InnoDB` Lock Monitor.

O `PROCESS` privilege é exigido para habilitar ou desabilitar os `InnoDB` Monitors.

#### Habilitando o InnoDB Monitor Padrão

Habilite o `InnoDB` Monitor padrão definindo a variável de sistema `innodb_status_output` como `ON`.

```sql
SET GLOBAL innodb_status_output=ON;
```

Para desabilitar o `InnoDB` Monitor padrão, defina `innodb_status_output` como `OFF`.

Quando você desliga o Server, a variável `innodb_status_output` é definida para o valor padrão `OFF`.

#### Habilitando o InnoDB Lock Monitor

Os dados do `InnoDB` Lock Monitor são impressos com o Output do `InnoDB` Standard Monitor. Tanto o `InnoDB` Standard Monitor quanto o `InnoDB` Lock Monitor devem estar habilitados para que os dados do `InnoDB` Lock Monitor sejam impressos periodicamente.

Para habilitar o `InnoDB` Lock Monitor, defina a variável de sistema `innodb_status_output_locks` como `ON`. Tanto o `InnoDB` Standard Monitor quanto o `InnoDB` Lock Monitor devem estar habilitados para que os dados do `InnoDB` Lock Monitor sejam impressos periodicamente:

```sql
SET GLOBAL innodb_status_output=ON;
SET GLOBAL innodb_status_output_locks=ON;
```

Para desabilitar o `InnoDB` Lock Monitor, defina `innodb_status_output_locks` como `OFF`. Defina `innodb_status_output` como `OFF` para também desabilitar o `InnoDB` Standard Monitor.

Quando você desliga o Server, as variáveis `innodb_status_output` e `innodb_status_output_locks` são definidas para o valor padrão `OFF`.

Note

Para habilitar o `InnoDB` Lock Monitor para o Output de `SHOW ENGINE INNODB STATUS`, é necessário apenas habilitar `innodb_status_output_locks`.

#### Obtendo o Output do InnoDB Monitor Padrão Sob Demanda

Como alternativa a habilitar o `InnoDB` Monitor padrão para Output periódico, você pode obter o Output do `InnoDB` Monitor padrão sob demanda usando a instrução SQL `SHOW ENGINE INNODB STATUS`, que busca o Output para o seu Client program. Se você estiver usando o Client interativo **mysql**, o Output será mais legível se você substituir o terminador de instrução de ponto e vírgula usual por `\G`:

```sql
mysql> SHOW ENGINE INNODB STATUS\G
```

O Output de `SHOW ENGINE INNODB STATUS` também inclui dados do `InnoDB` Lock Monitor se o `InnoDB` Lock Monitor estiver habilitado.

#### Direcionando o Output do InnoDB Monitor Padrão para um Arquivo de Status

O Output do `InnoDB` Monitor padrão pode ser habilitado e direcionado para um arquivo de Status especificando a opção `--innodb-status-file` na inicialização. Quando esta opção é usada, o `InnoDB` cria um arquivo chamado `innodb_status.pid` no diretório de dados e grava o Output nele a cada 15 segundos, aproximadamente.

O `InnoDB` remove o arquivo de Status quando o Server é desligado normalmente. Se ocorrer um *shutdown* anormal, o arquivo de Status pode ter que ser removido manualmente.

A opção `--innodb-status-file` destina-se ao uso temporário, pois a geração de Output pode afetar a Performance, e o arquivo `innodb_status.pid` pode se tornar bastante grande com o tempo.