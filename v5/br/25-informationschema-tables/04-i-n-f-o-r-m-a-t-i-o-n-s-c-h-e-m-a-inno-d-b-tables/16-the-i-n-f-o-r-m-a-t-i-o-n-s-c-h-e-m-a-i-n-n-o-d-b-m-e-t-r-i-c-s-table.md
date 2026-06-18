### 24.4.16 A Tabela INNODB_METRICS do INFORMATION_SCHEMA

A tabela [`INNODB_METRICS`] fornece uma ampla variedade de informações de performance do `InnoDB`, complementando as áreas de foco específicas das tabelas do Performance Schema para `InnoDB`. Com Querys simples, você pode verificar a saúde geral do sistema. Com Querys mais detalhadas, você pode diagnosticar problemas como gargalos de performance, escassez de recursos e problemas de aplicação.

Cada monitor representa um ponto dentro do código-fonte do `InnoDB` que é instrumentado para coletar informações de *counter*. Cada *counter* pode ser iniciado, parado e redefinido (*reset*). Você também pode realizar essas ações para um grupo de *counters* usando seu nome de módulo comum.

Por padrão, relativamente poucos dados são coletados. Para iniciar, parar e redefinir *counters*, defina uma das *system variables* [`innodb_monitor_enable`], [`innodb_monitor_disable`], [`innodb_monitor_reset`] ou [`innodb_monitor_reset_all`], usando o nome do *counter*, o nome do módulo, uma correspondência *wildcard* para tal nome usando o caractere “%”, ou a *keyword* especial `all`.

Para informações de uso, consulte [Seção 14.16.6, “InnoDB INFORMATION_SCHEMA Metrics Table”].

A tabela [`INNODB_METRICS`] possui as seguintes colunas:

* `NAME`

  Um nome exclusivo para o *counter*.

* `SUBSYSTEM`

  O aspecto do `InnoDB` ao qual a métrica se aplica.

* `COUNT`

  O valor desde que o *counter* foi habilitado.

* `MAX_COUNT`

  O valor máximo desde que o *counter* foi habilitado.

* `MIN_COUNT`

  O valor mínimo desde que o *counter* foi habilitado.

* `AVG_COUNT`

  O valor médio desde que o *counter* foi habilitado.

* `COUNT_RESET`

  O valor do *counter* desde a última redefinição (*reset*). (As colunas `_RESET` funcionam como o contador de voltas em um cronômetro: você pode medir a atividade durante algum intervalo de tempo, enquanto os valores cumulativos ainda estão disponíveis em `COUNT`, `MAX_COUNT`, e assim por diante.)

* `MAX_COUNT_RESET`

  O valor máximo do *counter* desde a última redefinição (*reset*).

* `MIN_COUNT_RESET`

  O valor mínimo do *counter* desde a última redefinição (*reset*).

* `AVG_COUNT_RESET`

  O valor médio do *counter* desde a última redefinição (*reset*).

* `TIME_ENABLED`

  O *timestamp* da última inicialização (*start*).

* `TIME_DISABLED`

  O *timestamp* da última parada (*stop*).

* `TIME_ELAPSED`

  O tempo decorrido em segundos desde que o *counter* foi iniciado.

* `TIME_RESET`

  O *timestamp* da última redefinição (*reset*).

* `STATUS`

  Indica se o *counter* ainda está em execução (`enabled`) ou parado (`disabled`).

* `TYPE`

  Indica se o item é um *counter* cumulativo ou se mede o valor atual de algum recurso.

* `COMMENT`

  A descrição do *counter*.

#### Exemplo

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_METRICS WHERE NAME='dml_inserts'\G
*************************** 1. row ***************************
           NAME: dml_inserts
      SUBSYSTEM: dml
          COUNT: 3
      MAX_COUNT: 3
      MIN_COUNT: NULL
      AVG_COUNT: 0.046153846153846156
    COUNT_RESET: 3
MAX_COUNT_RESET: 3
MIN_COUNT_RESET: NULL
AVG_COUNT_RESET: NULL
   TIME_ENABLED: 2014-12-04 14:18:28
  TIME_DISABLED: NULL
   TIME_ELAPSED: 65
     TIME_RESET: NULL
         STATUS: enabled
           TYPE: status_counter
        COMMENT: Number of rows inserted
```

#### Notas

* Você deve ter o privilégio [`PROCESS`] para consultar esta tabela.

* Use a tabela [`COLUMNS`] do `INFORMATION_SCHEMA` ou a instrução [`SHOW COLUMNS`] para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Os valores de `COUNT` do *counter* de transações podem diferir do número de eventos de transação relatados nas tabelas `EVENTS_TRANSACTIONS_SUMMARY` do Performance Schema. O `InnoDB` conta apenas as transações que ele executa, enquanto o Performance Schema coleta eventos para todas as transações não abortadas iniciadas pelo servidor, incluindo transações vazias.