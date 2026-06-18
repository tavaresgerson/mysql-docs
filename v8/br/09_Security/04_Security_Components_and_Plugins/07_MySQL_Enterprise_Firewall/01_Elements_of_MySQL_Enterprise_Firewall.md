#### 8.4.7.1 Elementos do Firewall Empresarial MySQL

O MySQL Enterprise Firewall é baseado em uma biblioteca de plugins que inclui esses elementos:

- Um plugin do lado do servidor chamado `MYSQL_FIREWALL` examina as instruções SQL antes de serem executadas e, com base nos perfis de firewall registrados, toma uma decisão sobre a execução ou rejeição de cada instrução.

- O plugin `MYSQL_FIREWALL`, juntamente com os plugins do lado do servidor chamados `MYSQL_FIREWALL_USERS` e `MYSQL_FIREWALL_WHITELIST`, implementam o Schema de Desempenho e as tabelas `INFORMATION_SCHEMA` que fornecem visualizações dos perfis registrados.

- Os perfis são armazenados em cache na memória para melhor desempenho. As tabelas no banco de dados do sistema `mysql` fornecem armazenamento de suporte dos dados do firewall para a persistência dos perfis após reinicializações do servidor.

- Os procedimentos armazenados realizam tarefas como registrar perfis de firewall, estabelecer seu modo operacional e gerenciar a transferência de dados do firewall entre o cache e o armazenamento persistente.

- As funções administrativas fornecem uma API para tarefas de nível inferior, como sincronizar o cache com o armazenamento persistente.

- As variáveis do sistema permitem a configuração do firewall e as variáveis de status fornecem informações operacionais em tempo de execução.

- Os privilégios `FIREWALL_ADMIN` e `FIREWALL_USER` permitem que os usuários administrem regras de firewall para qualquer usuário e, respectivamente, suas próprias regras de firewall.

- O privilégio `FIREWALL_EXEMPT` (disponível a partir do MySQL 8.0.27) isenta um usuário das restrições do firewall. Isso é útil, por exemplo, para qualquer administrador de banco de dados que configure o firewall, para evitar a possibilidade de uma configuração incorreta causar até mesmo o bloqueio do administrador e sua incapacidade de executar instruções.
