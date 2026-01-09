### 6.2.9 Quando as Alterações de Privilegios Se Tornam Efetivas

Se o servidor **mysqld** for iniciado sem a opção `--skip-grant-tables`, ele lê todo o conteúdo da tabela de concessão na memória durante sua sequência de inicialização. As tabelas na memória tornam-se eficazes para o controle de acesso nesse ponto.

Se você modificar as tabelas de concessão indiretamente usando uma declaração de gerenciamento de contas, o servidor percebe essas alterações e carrega as tabelas de concessão na memória novamente imediatamente. As declarações de gerenciamento de contas são descritas em Seção 13.7.1, “Declarações de Gerenciamento de Contas”. Exemplos incluem `GRANT`, `REVOKE`, `SET PASSWORD` e `RENAME USER`.

Se você modificar as tabelas de concessão diretamente usando instruções como `INSERT`, `UPDATE` ou `DELETE` (o que não é recomendado), as alterações não terão efeito na verificação de privilégios até que você recarregue as tabelas ou reinicie o servidor. Assim, se você alterar as tabelas de concessão diretamente, mas esquecer de recarregá-las, as alterações *não terão efeito* até que você reinicie o servidor. Isso pode deixá-lo se perguntando por que suas alterações parecem não fazer diferença!

Para informar ao servidor para recarregar as tabelas de privilégios, execute uma operação de limpeza de privilégios. Isso pode ser feito emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**.

A recarga de uma tabela de subsídios afeta os privilégios de cada sessão de cliente existente da seguinte forma:

- As alterações de privilégios de tabela e coluna entram em vigor na próxima solicitação do cliente.

- As alterações dos privilégios do banco de dados entram em vigor na próxima vez que o cliente executar a instrução `USE db_name`.

  ::: info Nota
  As aplicações do cliente podem armazenar o nome do banco de dados em cache; portanto, esse efeito pode não ser visível para eles sem realmente mudar para um banco de dados diferente.
  :::

- Os privilégios e senhas globais não são afetados por um cliente conectado. Essas alterações só entram em vigor em sessões para conexões subsequentes.

Se o servidor for iniciado com a opção `--skip-grant-tables`, ele não lê as tabelas de concessão nem implementa nenhum controle de acesso. Qualquer usuário pode se conectar e realizar qualquer operação, *o que é inseguro*. Para fazer com que um servidor assim iniciado leia as tabelas e habilite a verificação de acesso, limpe os privilégios.
