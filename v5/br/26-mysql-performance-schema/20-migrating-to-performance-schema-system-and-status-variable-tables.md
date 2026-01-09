## 25.20 Migrando para o Sistema de Schema de Desempenho e Tabelas de Variáveis de Status

O `INFORMATION_SCHEMA` possui tabelas que contêm informações sobre variáveis de sistema e status (veja Seção 24.3.11, “As tabelas GLOBAL_VARIABLES e SESSION_VARIABLES do INFORMATION_SCHEMA”, e Seção 24.3.10, “As tabelas GLOBAL_STATUS e SESSION_STATUS do INFORMATION_SCHEMA”). O Schema de Desempenho também contém tabelas de variáveis de sistema e status (veja Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de Desempenho”, e Seção 25.12.14, “Tabelas de variáveis de status do Schema de Desempenho”). As tabelas do Schema de Desempenho são destinadas a substituir as tabelas do `INFORMATION_SCHEMA`, que são desaconselhadas a partir do MySQL 5.7.6 e serão removidas no MySQL 8.0.

Esta seção descreve o caminho de migração previsto para se afastar das tabelas de variáveis do sistema `INFORMATION_SCHEMA` e das variáveis de status para as tabelas correspondentes do Schema de Desempenho. Os desenvolvedores de aplicativos devem usar essas informações como orientação sobre as alterações necessárias para acessar as variáveis de sistema e status no MySQL 5.7.6 e versões posteriores, à medida que as tabelas `INFORMATION_SCHEMA` se tornam desatualizadas e, eventualmente, serão removidas.

**MySQL 5.6**

No MySQL 5.6, as informações das variáveis de sistema e status estão disponíveis a partir dessas instruções `SHOW`:

```sql
SHOW VARIABLES
SHOW STATUS
```

E a partir dessas tabelas `INFORMATION_SCHEMA`:

```sql
INFORMATION_SCHEMA.GLOBAL_VARIABLES
INFORMATION_SCHEMA.SESSION_VARIABLES

INFORMATION_SCHEMA.GLOBAL_STATUS
INFORMATION_SCHEMA.SESSION_STATUS
```

**MySQL 5.7**

A partir do MySQL 5.7.6, o Gerenciamento de Desempenho inclui essas tabelas como novas fontes de informações sobre variáveis de sistema e status:

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

O MySQL 5.7.6 também adiciona uma variável de sistema `show_compatibility_56` para controlar como o servidor disponibiliza informações de variáveis de sistema e status.

Quando `show_compatibility_56` está ativado, a compatibilidade com o MySQL 5.6 é habilitada. As fontes de variáveis de sistema e status mais antigas (`instruções SHOW`, tabelas `INFORMATION_SCHEMA`) estão disponíveis com semântica idêntica ao MySQL 5.6. As aplicações devem ser executadas como estão, sem alterações no código, e devem exibir os mesmos nomes e valores de variáveis que no MySQL 5.6. As advertências ocorrem nessas circunstâncias:

- Um aviso de depreciação é exibido ao selecionar as tabelas do `INFORMATION_SCHEMA`.

- No MySQL 5.7.6 e 5.7.7, um aviso de depreciação é exibido ao usar uma cláusula `WHERE` com as instruções `SHOW`. Esse comportamento não ocorre a partir do MySQL 5.7.8.

Quando `show_compatibility_56` está em `OFF`, a compatibilidade com o MySQL 5.6 é desativada e várias alterações são realizadas. As aplicações devem ser revisadas da seguinte forma para funcionar corretamente:

- A seleção das tabelas do `INFORMATION_SCHEMA` produz um erro. As aplicações que acessam as tabelas do `INFORMATION_SCHEMA` devem ser revisadas para usar as tabelas correspondentes do Performance Schema.

  Antes do MySQL 5.7.9, a seleção das tabelas do `INFORMATION_SCHEMA` produz um conjunto de resultados vazio, além de um aviso de depreciação. Isso não foi um aviso suficiente para sinalizar a necessidade de migrar para as tabelas correspondentes do sistema Performance Schema e das variáveis de status, no caso de `show_compatibility_56=OFF`. Produzir um erro no MySQL 5.7.9 e versões posteriores torna mais evidente que uma aplicação está operando em condições que exigem modificações, bem como onde está o problema.

  Nos MySQL 5.7.6 e 5.7.7, as tabelas `session_variables` (performance-schema-system-variable-tables.html) e `session_status` (performance-schema-status-variable-tables.html) do Schema de Desempenho não refletem completamente todos os valores de variáveis em vigor para a sessão atual; elas não incluem linhas para variáveis globais que não têm contraparte de sessão. Isso é corrigido no MySQL 5.7.8.

- A saída das declarações `SHOW` é gerada a partir das tabelas do Gerenciamento de Desempenho subjacente. As aplicações que são escritas para usar essas declarações ainda podem usá-las, mas é melhor usar o MySQL 5.7.8 ou superior. No MySQL 5.7.6 e 5.7.7, os resultados podem ser diferentes:

  - A saída `SHOW [SESSION] VARIABLES` não inclui variáveis globais que não têm correspondência em sessão.

  - Usar uma cláusula `WHERE` com as instruções `SHOW` produz um erro.

- Essas variáveis de status `Slave_xxx` tornam-se indisponíveis através de `SHOW STATUS` (show-status.html):

  ```sql
  Slave_heartbeat_period
  Slave_last_heartbeat
  Slave_received_heartbeats
  Slave_retried_transactions
  Slave_running
  ```

  As aplicações que utilizam essas variáveis de status devem ser revisadas para obter essas informações usando as tabelas do Schema de Desempenho relacionadas à replicação. Para obter detalhes, consulte Efeito do show_compatibility_56 nas variáveis de status do Slave.

- O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagem de execução de declarações globais e por sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente.

**Migração e privilégios**

Inicialmente, com a introdução do sistema Performance Schema e das tabelas de variáveis de status no MySQL 5.7.6, o acesso a essas tabelas exigia o privilégio `SELECT`, assim como para outras tabelas do Performance Schema. No entanto, isso teve a consequência de que, quando `show_compatibility_56=OFF`, as instruções `SHOW VARIABLES` e `SHOW STATUS` também exigiam o privilégio `SELECT`: Com a compatibilidade desativada, a saída dessas instruções era tirada das tabelas do Performance Schema `global_variables`, `session_variables`, `global_status` e `session_status`.

A partir do MySQL 5.7.9, essas tabelas do Schema de Desempenho são legíveis por todo o mundo e acessíveis sem o privilégio `SELECT`. Consequentemente, `SHOW VARIABLES` e `SHOW STATUS` não exigem privilégios nas tabelas subjacentes do Schema de Desempenho a partir das quais sua saída é produzida quando `show_compatibility_56=OFF`.

**Além do MySQL 5.7**

No MySQL 8.0, as tabelas variáveis `INFORMATION_SCHEMA` e a variável de sistema `show_compatibility_56` são removidas, e o resultado das instruções `SHOW` sempre é baseado nas tabelas do Schema de Desempenho subjacente.

Aplicações que foram revisadas para funcionar no MySQL 5.7 quando `show_compatibility_56=OFF` devem funcionar sem alterações adicionais, exceto que não é possível testar ou definir `show_compatibility_56` porque ele não existe.
