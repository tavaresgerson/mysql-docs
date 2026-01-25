#### 6.4.5.1 Elementos do MySQL Enterprise Audit

O MySQL Enterprise Audit é baseado no plugin de log de auditoria (audit log plugin) e elementos relacionados:

* Um plugin server-side chamado `audit_log` examina eventos auditáveis e determina se deve gravá-los no audit log.

* Um conjunto de funções permite a manipulação de definições de filtragem que controlam o comportamento de logging, a senha de criptografia e a leitura do arquivo de log.

* Tabelas no Database de sistema `mysql` fornecem armazenamento persistente de dados de filtro e de contas de usuário.

* Variáveis de sistema permitem a configuração do audit log e variáveis de status fornecem informações operacionais de runtime.

Nota

Antes do MySQL 5.7.13, o MySQL Enterprise Audit consistia apenas no plugin `audit_log` e operava em modo legado. Veja [Seção 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering").