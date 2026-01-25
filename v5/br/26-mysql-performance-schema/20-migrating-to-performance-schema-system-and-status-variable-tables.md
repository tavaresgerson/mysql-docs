## 25.20 Migração para Tabelas de Variáveis de Sistema e Status do Performance Schema

O `INFORMATION_SCHEMA` possui tabelas que contêm informações de variáveis de sistema e status (consulte [Seção 24.3.11, “The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables”](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables") e [Seção 24.3.10, “The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables”](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables")). O Performance Schema também contém tabelas de variáveis de sistema e status (consulte [Seção 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") e [Seção 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables")). As tabelas do Performance Schema destinam-se a substituir as tabelas do `INFORMATION_SCHEMA`, que estão obsoletas (deprecated) a partir do MySQL 5.7.6 e serão removidas no MySQL 8.0.

Esta seção descreve o caminho de migração pretendido das tabelas de variáveis de sistema e status do `INFORMATION_SCHEMA` para as tabelas correspondentes do Performance Schema. Desenvolvedores de aplicações devem usar estas informações como orientação sobre as alterações necessárias para acessar variáveis de sistema e status no MySQL 5.7.6 e superior, à medida que as tabelas do `INFORMATION_SCHEMA` se tornam obsoletas e, eventualmente, são removidas.

**MySQL 5.6**

No MySQL 5.6, as informações de variáveis de sistema e status estão disponíveis nestas instruções `SHOW`:

```sql
SHOW VARIABLES
SHOW STATUS
```

E nestas tabelas do `INFORMATION_SCHEMA`:

```sql
INFORMATION_SCHEMA.GLOBAL_VARIABLES
INFORMATION_SCHEMA.SESSION_VARIABLES

INFORMATION_SCHEMA.GLOBAL_STATUS
INFORMATION_SCHEMA.SESSION_STATUS
```

**MySQL 5.7**

A partir do MySQL 5.7.6, o Performance Schema inclui estas tabelas como novas fontes de informações de variáveis de sistema e status:

```sql
performance_schema.global_variables
performance_schema.session_variables
performance_schema.variables_by_thread

performance_schema.global_status
performance_schema.session_status
performance_schema.status_by_thread
performance_schema.status_by_account
performance_schema.status_by_host
performance_schema.status_by_user
```

O MySQL 5.7.6 também adiciona a variável de sistema [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) para controlar como o servidor disponibiliza informações de variáveis de sistema e status.

Quando [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) é `ON`, a compatibilidade com o MySQL 5.6 é ativada. As fontes mais antigas de variáveis de sistema e status (instruções `SHOW`, tabelas do `INFORMATION_SCHEMA`) estão disponíveis com semântica idêntica à do MySQL 5.6. As aplicações devem ser executadas como estão, sem alterações no código, e devem ver os mesmos nomes e valores de variáveis que no MySQL 5.6. Avisos (Warnings) ocorrem sob estas circunstâncias:

* Um aviso de descontinuação (deprecation warning) é emitido ao selecionar das tabelas do `INFORMATION_SCHEMA`.

* No MySQL 5.7.6 e 5.7.7, um aviso de descontinuação é emitido ao usar uma cláusula `WHERE` com as instruções `SHOW`. Este comportamento não ocorre a partir do MySQL 5.7.8.

Quando [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) é `OFF`, a compatibilidade com o MySQL 5.6 é desativada e várias alterações resultam. As aplicações devem ser revisadas conforme a seguir para funcionar corretamente:

* Selecionar das tabelas do `INFORMATION_SCHEMA` produz um erro. Aplicações que acessam as tabelas do `INFORMATION_SCHEMA` devem ser revisadas para usar as tabelas correspondentes do Performance Schema.

  Antes do MySQL 5.7.9, selecionar das tabelas do `INFORMATION_SCHEMA` produzia um conjunto de resultados vazio mais um aviso de descontinuação. Isso não era um aviso suficiente para sinalizar a necessidade de migrar para as tabelas de variáveis de sistema e status correspondentes do Performance Schema no caso de [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56). A produção de um erro no MySQL 5.7.9 e superior torna mais evidente que uma aplicação está operando sob condições que exigem modificação, bem como onde reside o problema.

  No MySQL 5.7.6 e 5.7.7, as tabelas [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") e [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") do Performance Schema não refletem totalmente todos os valores de variáveis em vigor para a `SESSION` atual; elas não incluem linhas para variáveis `GLOBAL` que não possuem uma contraparte de `SESSION`. Isso foi corrigido no MySQL 5.7.8.

* A saída para as instruções `SHOW` é produzida usando as tabelas subjacentes do Performance Schema. As aplicações escritas para usar essas instruções ainda podem utilizá-las, mas é melhor usar o MySQL 5.7.8 ou superior. No MySQL 5.7.6 e 5.7.7, os resultados podem diferir:

  + A saída de `SHOW [SESSION] VARIABLES` não inclui variáveis `GLOBAL` que não possuem uma contraparte de `SESSION`.

  + Usar uma cláusula `WHERE` com as instruções `SHOW` produz um erro.

* Estas variáveis de status `Slave_xxx` tornam-se indisponíveis através de [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"):

  ```sql
  Slave_heartbeat_period
  Slave_last_heartbeat
  Slave_received_heartbeats
  Slave_retried_transactions
  Slave_running
  ```

  Aplicações que usam estas variáveis de status devem ser revisadas para obter estas informações usando as tabelas do Performance Schema relacionadas à replicação. Para detalhes, consulte [Effect of show_compatibility_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables").

* O Performance Schema não coleta estatísticas para variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagens de execução de *statement* global e por `SESSION`, use as tabelas [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") e [`events_statements_summary_by_thread_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables"), respectivamente.

**Migração e Privilégios**

Inicialmente, com a introdução das tabelas de variáveis de sistema e status do Performance Schema no MySQL 5.7.6, o acesso a essas tabelas exigia o privilégio [`SELECT`], assim como para outras tabelas do Performance Schema. No entanto, isso teve como consequência que, quando [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56), as instruções [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") e [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") também exigiam o privilégio [`SELECT`]: Com a compatibilidade desativada, a saída para essas instruções era retirada das tabelas [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") e [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") do Performance Schema.

A partir do MySQL 5.7.9, essas tabelas do Performance Schema são de leitura global (*world readable*) e acessíveis sem o privilégio [`SELECT`]. Consequentemente, [`SHOW VARIABLES`] e [`SHOW STATUS`] não exigem privilégios nas tabelas subjacentes do Performance Schema das quais sua saída é produzida quando [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56).

**Além do MySQL 5.7**

Em um MySQL 8.0, as tabelas de variáveis do `INFORMATION_SCHEMA` e a variável de sistema [`show_compatibility_56`] são removidas, e a saída das instruções `SHOW` é sempre baseada nas tabelas subjacentes do Performance Schema.

Aplicações que foram revisadas para funcionar no MySQL 5.7 quando [`show_compatibility_56=OFF`] devem funcionar sem alterações adicionais, exceto que não é possível testar ou definir [`show_compatibility_56`] porque ela não existe.