#### 6.4.5.1 Elementos da Auditoria do MySQL Enterprise

O MySQL Enterprise Audit é baseado no plugin de registro de auditoria e nos elementos relacionados:

- Um plugin do lado do servidor chamado `audit_log` examina eventos audíveis e determina se devem ser escritos no log de auditoria.

- Um conjunto de funções permite a manipulação de definições de filtragem que controlam o comportamento de registro, a senha de criptografia e a leitura de arquivos de registro.

- As tabelas no banco de dados do sistema `mysql` fornecem armazenamento persistente de dados de filtro e contas de usuário.

- As variáveis do sistema permitem a configuração do log de auditoria e as variáveis de status fornecem informações operacionais em tempo de execução.

Nota

Antes do MySQL 5.7.13, o MySQL Enterprise Audit consiste apenas no plugin `audit_log` e opera no modo legado. Veja Seção 6.4.5.10, “Filtragem do Log de Auditoria no Modo Legado”.
