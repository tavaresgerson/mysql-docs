### 24.4.16 A tabela INFORMATION_SCHEMA INNODB_METRICS

A tabela `INNODB_METRICS` fornece uma ampla variedade de informações de desempenho do `InnoDB`, complementando as áreas de foco específicas das tabelas do Schema de Desempenho para `InnoDB`. Com consultas simples, você pode verificar a saúde geral do sistema. Com consultas mais detalhadas, você pode diagnosticar problemas como gargalos de desempenho, escassez de recursos e problemas de aplicação.

Cada monitor representa um ponto dentro do código-fonte do `InnoDB` que é instrumentado para coletar informações de contagem. Cada contador pode ser iniciado, parado e redefinido. Você também pode realizar essas ações para um grupo de contadores usando seu nome de módulo comum.

Por padrão, são coletados dados relativamente baixos. Para iniciar, parar e reiniciar contadores, defina uma das variáveis do sistema `innodb_monitor_enable`, `innodb_monitor_disable`, `innodb_monitor_reset` ou `innodb_monitor_reset_all`, usando o nome do contador, o nome do módulo, uma correspondência de ponto de interrogação para um nome desse tipo usando o caractere “%” ou a palavra-chave especial `all`.

Para informações sobre o uso, consulte Seção 14.16.6, “Tabela de métricas do InnoDB INFORMATION_SCHEMA”.

A tabela `INNODB_METRICS` tem as seguintes colunas:

- `NOME`

  Um nome único para o balcão.

- `SUBSISTEMA`

  O aspecto do `InnoDB` ao qual a métrica se aplica.

- `CONTAR`

  O valor desde que o contador foi habilitado.

- `MAX_COUNT`

  O valor máximo desde que o contador foi ativado.

- `MIN_COUNT`

  O valor mínimo desde que o contador foi ativado.

- `AVG_COUNT`

  O valor médio desde que o contador foi habilitado.

- `COUNT_RESET`

  O valor do contador desde que foi redefinido pela última vez. (As colunas _RESET funcionam como o contador de voltas de um cronômetro: você pode medir a atividade durante algum intervalo de tempo, enquanto os valores acumulados ainda estão disponíveis em COUNT, MAX_COUNT, e assim por diante.)

- `MAX_COUNT_RESET`

  O valor máximo de contagem desde que foi redefinido pela última vez.

- `MIN_COUNT_RESET`

  O valor mínimo de contagem desde que foi redefinido pela última vez.

- `AVG_COUNT_RESET`

  O valor médio do contador desde que foi redefinido pela última vez.

- `TIME_ENABLED`

  O horário de início da última sessão.

- `TIME_DISABLED`

  O horário da última parada.

- `TEMPO_PASSADO`

  O tempo decorrido em segundos desde que o contador começou.

- `TIME_RESET`

  O horário de registro da última reinicialização.

- `STATUS`

  Se o contador ainda está em execução (`enabled`) ou parado (`disabled`).

- `TIPO`

  Se o item for um contador cumulativo ou mede o valor atual de algum recurso.

- `COMENTÁRIO`

  A descrição do contador.

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

- Você deve ter o privilégio `PROCESSO` para consultar esta tabela.

- Use a tabela `INFORMATION_SCHEMA` `COLUMNS` ou a instrução `SHOW COLUMNS` para visualizar informações adicionais sobre as colunas desta tabela, incluindo tipos de dados e valores padrão.

- Os valores do contador de transações `COUNT` podem diferir do número de eventos de transação relatados nas tabelas `EVENTS_TRANSACTIONS_SUMMARY` do Gerenciador de Desempenho. O `InnoDB` conta apenas as transações que ele executa, enquanto o Gerenciador de Desempenho coleta eventos para todas as transações não abortadas iniciadas pelo servidor, incluindo transações vazias.
