#### 13.4.1.3 Declaração SET sql_log_bin

```sql
SET sql_log_bin = {OFF|ON}
```

A variável [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) controla se o logging para o Binary Log está habilitado para a `Session` atual (assumindo que o Binary Log em si esteja habilitado). O valor padrão é `ON`. Para desabilitar ou habilitar o Binary Logging para a `Session` atual, defina a variável de `Session` [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) como `OFF` ou `ON`.

Defina esta variável como `OFF` para uma `Session` a fim de desabilitar temporariamente o Binary Logging enquanto realiza alterações no `Source` que você não deseja que sejam replicadas para a `Replica`.

Definir o valor de `Session` desta variável de sistema é uma operação restrita. O usuário da `Session` deve ter privilégios suficientes para definir variáveis de `Session` restritas. Veja [Seção 5.1.8.1, “Privilégios de Variáveis de Sistema”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

Não é possível definir o valor de `Session` de [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) dentro de uma `Transaction` ou `Subquery`.

*Definir esta variável como `OFF` impede que GTIDs sejam atribuídos a `Transactions` no Binary Log*. Se você estiver usando GTIDs para replicação, isso significa que, mesmo quando o Binary Logging for habilitado novamente, os GTIDs gravados no `Log` a partir deste ponto não contabilizarão nenhuma `Transaction` que ocorreu nesse ínterim; portanto, na prática, essas `Transactions` serão perdidas.

A variável global [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) é somente leitura (`read only`) e não pode ser modificada. O escopo global está obsoleto (`deprecated`); espere que ele seja removido em uma futura versão do MySQL.