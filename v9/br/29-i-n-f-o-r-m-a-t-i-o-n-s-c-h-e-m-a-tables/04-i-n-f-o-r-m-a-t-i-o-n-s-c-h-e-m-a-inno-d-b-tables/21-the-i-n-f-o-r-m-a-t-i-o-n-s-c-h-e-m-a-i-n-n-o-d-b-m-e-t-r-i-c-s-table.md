### 28.4.21 A Tabela `INFORMATION_SCHEMA INNODB_METRICS`

A tabela `INNODB_METRICS` fornece uma ampla variedade de informações de desempenho do `InnoDB`, complementando as áreas focadas especificamente das tabelas do Schema de Desempenho para `InnoDB`. Com consultas simples, você pode verificar a saúde geral do sistema. Com consultas mais detalhadas, você pode diagnosticar problemas como gargalos de desempenho, escassez de recursos e problemas de aplicação.

Cada monitor representa um ponto dentro do código-fonte do `InnoDB` que é instrumentado para coletar informações de contador. Cada contador pode ser iniciado, parado e redefinido. Você também pode realizar essas ações para um grupo de contadores usando seu nome de módulo comum.

Por padrão, relativamente pouco dados são coletados. Para iniciar, parar e redefinir contadores, defina uma das variáveis de sistema `innodb_monitor_enable`, `innodb_monitor_disable`, `innodb_monitor_reset` ou `innodb_monitor_reset_all`, usando o nome do contador, o nome do módulo, uma correspondência de wildcard para tal nome usando o caractere “%” ou a palavra-chave especial `all`.

Para informações de uso, consulte a Seção 17.15.6, “Tabela de Metricas do Schema de Informação `INFORMATION_SCHEMA INNODB`”.

A tabela `INNODB_METRICS` tem essas colunas:

* `NAME`

  Um nome único para o contador.

* `SUBSYSTEM`

  O aspecto do `InnoDB` ao qual a métrica se aplica.

* `COUNT`

  O valor desde que o contador foi habilitado.

* `MAX_COUNT`

  O valor máximo desde que o contador foi habilitado.

* `MIN_COUNT`

  O valor mínimo desde que o contador foi habilitado.

* `AVG_COUNT`

  O valor médio desde que o contador foi habilitado.

* `COUNT_RESET`

O valor do contador desde que foi redefinido pela última vez. (As colunas `_RESET` funcionam como o contador de voltas de um cronômetro: você pode medir a atividade durante algum intervalo de tempo, enquanto os valores acumulados ainda estão disponíveis em `COUNT`, `MAX_COUNT`, e assim por diante.)

* `MAX_COUNT_RESET`

  O valor máximo do contador desde que foi redefinido pela última vez.

* `MIN_COUNT_RESET`

  O valor mínimo do contador desde que foi redefinido pela última vez.

* `AVG_COUNT_RESET`

  O valor médio do contador desde que foi redefinido pela última vez.

* `TIME_ENABLED`

  O timestamp do último início.

* `TIME_DISABLED`

  O timestamp do último término.

* `TIME_ELAPSED`

  O tempo decorrido em segundos desde que o contador começou.

* `TIME_RESET`

  O timestamp do último redefinimento.

* `STATUS`

  Se o contador ainda está em execução (`enabled`) ou parado (`disabled`).

* `TYPE`

  Se o item é um contador acumulativo ou mede o valor atual de algum recurso.

* `COMMENT`

  A descrição do contador.

#### Exemplo

```
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

* Você deve ter o privilégio `PROCESS` para consultar esta tabela.

* Use a tabela `COLUMNS` do `INFORMATION_SCHEMA` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

* Os valores do contador de transação `COUNT` podem diferir do número de eventos de transação relatados nas tabelas `EVENTS_TRANSACTIONS_SUMMARY` do Schema de Desempenho. O `InnoDB` conta apenas as transações que ele executa, enquanto o Schema de Desempenho coleta eventos para todas as transações não canceladas iniciadas pelo servidor, incluindo transações vazias.