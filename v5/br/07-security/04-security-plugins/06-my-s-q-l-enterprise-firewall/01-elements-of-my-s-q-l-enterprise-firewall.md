#### 6.4.6.1 Elementos do Firewall Empresarial MySQL

O MySQL Enterprise Firewall é baseado em uma biblioteca de plugins que inclui esses elementos:

- Um plugin do lado do servidor chamado `MYSQL_FIREWALL` examina as instruções SQL antes de executá-las e, com base nos perfis de firewall registrados, toma uma decisão sobre se executar ou rejeitar cada instrução.

- Os plugins do lado do servidor chamados `MYSQL_FIREWALL_USERS` e `MYSQL_FIREWALL_WHITELIST` implementam tabelas do `INFORMATION_SCHEMA` que fornecem visualizações dos perfis registrados.

- Os perfis são armazenados em cache na memória para melhor desempenho. As tabelas no banco de dados do sistema `mysql` fornecem armazenamento de suporte persistente dos dados do firewall.

- Os procedimentos armazenados realizam tarefas como registrar perfis de firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache em memória e o armazenamento persistente.

- As funções administrativas fornecem uma API para tarefas de nível inferior, como sincronizar o cache com o armazenamento persistente.

- As variáveis do sistema permitem a configuração do firewall e as variáveis de status fornecem informações operacionais em tempo de execução.
