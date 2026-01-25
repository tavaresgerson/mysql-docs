#### 6.4.5.9 Desabilitando o Audit Logging

A variável [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable), introduzida no MySQL 5.7.37, permite desabilitar o audit logging para todas as sessões conectando-se e conectadas. A variável [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) pode ser definida em um arquivo de opção do MySQL Server, em uma string de inicialização de linha de comando, ou em tempo de execução (runtime) usando uma instrução [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment"); por exemplo:

```sql
SET GLOBAL audit_log_disable = true;
```

Definir [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) como `true` desabilita o Audit Log Plugin. O Plugin é reativado quando [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) é definido novamente como `false`, que é a configuração padrão.

Iniciar o Audit Log Plugin com [`audit_log_disable = true`](audit-log-reference.html#sysvar_audit_log_disable) gera um warning (`ER_WARN_AUDIT_LOG_DISABLED`) com a seguinte mensagem: Audit Log is disabled. Enable it with audit_log_disable = false. Definir [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) como `false` também gera um warning. Quando [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) é definido como `true`, chamadas de função do audit log e alterações de variável geram um session warning.

A definição do valor de runtime de [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable) exige o privilégio [`SUPER`](privileges-provided.html#priv_super).