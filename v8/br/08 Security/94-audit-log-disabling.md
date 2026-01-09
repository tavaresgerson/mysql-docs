#### 8.4.5.9 Desativando o Registro de Auditoria

A variável `audit_log_disable` permite desativar o registro de auditoria para todas as sessões de conexão e conectadas. A variável `audit_log_disable` pode ser definida em um arquivo de opção do MySQL Server, em uma string de inicialização de linha de comando ou em tempo de execução usando uma instrução `SET`; por exemplo:

```
SET GLOBAL audit_log_disable = true;
```

Definir `audit_log_disable` para `true` desativa o plugin de registro de auditoria. O plugin é reativado quando `audit_log_disable` é definido de volta para `false`, que é o valor padrão.

Iniciar o plugin de registro de auditoria com `audit_log_disable = true` gera um aviso ( `ER_WARN_AUDIT_LOG_DISABLED`) com a seguinte mensagem: O registro de auditoria está desativado. Ative-o com audit_log_disable = false. Definir `audit_log_disable` para `false` também gera um aviso. Quando `audit_log_disable` é definido para `true`, as chamadas de função do registro de auditoria e as alterações de variáveis geram um aviso de sessão.

Definir o valor de tempo de execução de `audit_log_disable` requer o privilégio `AUDIT_ADMIN`, além do privilégio `SYSTEM_VARIABLES_ADMIN` (ou o privilégio `SUPER` desatualizado) normalmente necessário para definir o valor de tempo de execução de uma variável de sistema global.