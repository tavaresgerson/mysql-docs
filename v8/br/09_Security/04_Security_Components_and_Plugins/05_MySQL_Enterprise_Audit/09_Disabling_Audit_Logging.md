#### 8.4.5.9 Desativar o registro de auditoria

A variável `audit_log_disable`, introduzida no MySQL 8.0.28, permite desabilitar o registro de auditoria para todas as sessões de conexão e conectadas. A variável `audit_log_disable` pode ser definida em um arquivo de opção do MySQL Server, em uma string de inicialização de linha de comando ou em tempo de execução usando uma instrução `SET`; por exemplo:

```
SET GLOBAL audit_log_disable = true;
```

Definir `audit_log_disable` para verdadeiro desabilita o plugin de log de auditoria. O plugin é reativado quando `audit_log_disable` é definido novamente para `false`, que é o ajuste padrão.

Iniciar o plugin do log de auditoria com `audit_log_disable = true` gera um aviso (`ER_WARN_AUDIT_LOG_DISABLED`) com a seguinte mensagem: O log de auditoria está desativado. Ative-o com audit\_log\_disable = false. Definir `audit_log_disable` para false também gera um aviso. Quando `audit_log_disable` é definido para true, as chamadas de função do log de auditoria e as alterações de variáveis geram um aviso de sessão.

Para definir o valor de execução de `audit_log_disable`, é necessário o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou do privilégio desatualizado `SUPER`) normalmente necessário para definir o valor de execução de uma variável de sistema global.
