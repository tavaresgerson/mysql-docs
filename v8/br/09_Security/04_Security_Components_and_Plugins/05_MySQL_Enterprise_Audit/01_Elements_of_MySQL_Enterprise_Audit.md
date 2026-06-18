#### 8.4.5.1 Elementos da Auditoria do MySQL Enterprise

O MySQL Enterprise Audit é baseado no plugin de registro de auditoria e nos elementos relacionados:

- Um plugin do lado do servidor chamado `audit_log` examina eventos audíveis e determina se devem ser escritos no log de auditoria.

- Um conjunto de funções permite a manipulação de definições de filtragem que controlam o comportamento de registro, a senha de criptografia e a leitura de arquivos de registro.

- As tabelas no banco de dados do sistema `mysql` fornecem armazenamento persistente de dados de filtro e contas de usuário, a menos que você defina a variável de sistema `audit_log_database` na inicialização do servidor para especificar um banco de dados diferente.

- As variáveis do sistema permitem a configuração do log de auditoria e as variáveis de status fornecem informações operacionais em tempo de execução.

- O privilégio `AUDIT_ADMIN` permite que os usuários administrem o log de auditoria, e (a partir do MySQL 8.0.28) o privilégio `AUDIT_ABORT_EXEMPT` permite que os usuários do sistema executem consultas que, de outra forma, seriam bloqueadas por um item "abort" no filtro do log de auditoria.
