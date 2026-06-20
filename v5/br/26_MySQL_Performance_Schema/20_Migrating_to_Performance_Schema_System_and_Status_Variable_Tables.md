## 25.20 Migrando para o Sistema de Schema de Desempenho e Tabelas de Variáveis de Status

O `INFORMATION_SCHEMA` possui tabelas que contêm informações sobre variáveis de sistema e status (consulte a Seção 24.3.11, “As tabelas GLOBAL\_VARIABLES e SESSION\_VARIABLES do INFORMATION_SCHEMA”, e a Seção 24.3.10, “As tabelas GLOBAL\_STATUS e SESSION\_STATUS do INFORMATION_SCHEMA”). O Schema de Desempenho também contém tabelas de variáveis de sistema e status (consulte a Seção 25.12.13, “Tabelas de variáveis de sistema do Schema de Desempenho”, e a Seção 25.12.14, “Tabelas de variáveis de status do Schema de Desempenho”). As tabelas do Schema de Desempenho são destinadas a substituir as tabelas `INFORMATION_SCHEMA`, que são descontinuadas a partir do MySQL 5.7.6 e são removidas no MySQL 8.0.

Esta seção descreve o caminho de migração pretendido para se afastar das tabelas de variáveis de status e do sistema `INFORMATION_SCHEMA` para as tabelas correspondentes do Schema de Desempenho. Os desenvolvedores de aplicativos devem usar essas informações como orientação em relação às mudanças necessárias para acessar as variáveis de sistema e status no MySQL 5.7.6 e versões posteriores, uma vez que as tabelas `INFORMATION_SCHEMA` serão descontinuadas e, eventualmente, serão removidas.

**MySQL 5.6**

Em MySQL 5.6, as informações das variáveis de sistema e status estão disponíveis a partir dessas declarações `SHOW`:

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

A partir do MySQL 5.7.6, o Gerador de Desempenho inclui essas tabelas como novas fontes de informações sobre variáveis de sistema e status:

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

Quando `show_compatibility_56` é `ON`, a compatibilidade com o MySQL 5.6 é habilitada. As fontes de sistema e variáveis de status mais antigas (`SHOW` e `INFORMATION_SCHEMA` tabelas) estão disponíveis com semântica idêntica ao MySQL 5.6. As aplicações devem ser executadas como estão, sem alterações de código, e devem ver os mesmos nomes de variáveis e valores que no MySQL 5.6. As advertências ocorrem nessas circunstâncias:

* Um aviso de depreciação é exibido ao selecionar a partir das tabelas `INFORMATION_SCHEMA`.

* Em MySQL 5.7.6 e 5.7.7, um aviso de depreciação é exibido ao usar uma cláusula `WHERE` com as instruções `SHOW`. Esse comportamento não ocorre a partir do MySQL 5.7.8.

Quando `show_compatibility_56` é `OFF`, a compatibilidade com o MySQL 5.6 é desativada e várias alterações resultam. As aplicações devem ser revisadas da seguinte forma para funcionar corretamente:

* A seleção das tabelas do `INFORMATION_SCHEMA` produz um erro. As aplicações que acessam as tabelas do `INFORMATION_SCHEMA` devem ser revisadas para usar as tabelas correspondentes do Schema de Desempenho.

Antes do MySQL 5.7.9, selecionar as tabelas `INFORMATION_SCHEMA` produz um conjunto de resultados vazio, além de um aviso de depreciação. Isso não foi um aviso suficiente para sinalizar a necessidade de migrar para as tabelas correspondentes do Sistema de Desempenho e das variáveis de status para o caso do `show_compatibility_56=OFF`. Produzir um erro no MySQL 5.7.9 e superior torna mais evidente que uma aplicação está operando sob condições que requerem modificação, bem como onde o problema está localizado.

Em MySQL 5.7.6 e 5.7.7, as tabelas `session_variables` e `session_status` do Schema de Desempenho não refletem totalmente todos os valores de variáveis em vigor para a sessão atual; elas não incluem strings para variáveis globais que não têm correspondência em sessão. Isso é corrigido no MySQL 5.7.8.

* A saída para as declarações `SHOW` é produzida usando as tabelas do Schema de Desempenho subjacente. As aplicações que são escritas para usar essas declarações ainda podem usá-las, mas é melhor usar o MySQL 5.7.8 ou superior. No MySQL 5.7.6 e 5.7.7, os resultados podem diferir:

+ A saída do `SHOW [SESSION] VARIABLES` não inclui variáveis globais que não têm correspondência em sessão.

+ O uso de uma cláusula `WHERE` com as declarações `SHOW` produz um erro.

* Essas variáveis de status `Slave_xxx` tornam-se indisponíveis através de `SHOW STATUS`:

  ```sql
  Slave_heartbeat_period
  Slave_last_heartbeat
  Slave_received_heartbeats
  Slave_retried_transactions
  Slave_running
  ```

As aplicações que utilizam essas variáveis de status devem ser revisadas para obter essas informações usando as tabelas do Schema de desempenho relacionadas à replicação. Para obter detalhes, consulte o efeito de show\_compatibility\_56 nas variáveis de status do escravo.

* O Schema de Desempenho não coleta estatísticas para as variáveis de status `Com_xxx` nas tabelas de variáveis de status. Para obter contagens globais e por execução de declarações de sessão, use as tabelas `events_statements_summary_global_by_event_name` e `events_statements_summary_by_thread_by_event_name`, respectivamente.

**Migração e Privilegios**

Inicialmente, com a introdução do sistema de Schema de Desempenho e das tabelas de variáveis de status no MySQL 5.7.6, o acesso a essas tabelas exigia o privilégio `SELECT`, assim como para outras tabelas do Schema de Desempenho. No entanto, isso teve a consequência de que, quando as declarações `show_compatibility_56=OFF`, `SHOW VARIABLES` e `SHOW STATUS` também exigiam o privilégio `SELECT`: Com a compatibilidade desativada, a saída para essas declarações foi tirada das tabelas do Schema de Desempenho `global_variables`, `session_variables`, `global_status` e `session_status`.

A partir do MySQL 5.7.9, essas tabelas do Schema de Desempenho são legíveis e acessíveis mundialmente sem o privilégio `SELECT`. Consequentemente, `SHOW VARIABLES` e `SHOW STATUS` não exigem privilégios nas tabelas subjacentes do Schema de Desempenho, das quais sua saída é produzida quando `show_compatibility_56=OFF`.

**Além do MySQL 5.7**

Em um MySQL 8.0, as tabelas de variáveis `INFORMATION_SCHEMA` e a variável de sistema `show_compatibility_56` são removidas, e a saída das declarações `SHOW` sempre é baseada nas tabelas subjacentes do Schema de Desempenho.

As aplicações que foram revisadas para funcionar no MySQL 5.7 quando `show_compatibility_56=OFF` devem funcionar sem mais alterações, exceto que não é possível testar ou definir `show_compatibility_56`, porque ele não existe.