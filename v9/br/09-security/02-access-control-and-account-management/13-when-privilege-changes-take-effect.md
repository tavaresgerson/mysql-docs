### 8.2.13 Quando as Alterações de Privilegios Se Tornam Efetivas

Se o servidor **mysqld** for iniciado sem a opção `--skip-grant-tables`, ele lê todo o conteúdo da tabela de concessão na memória durante sua sequência de inicialização. As tabelas na memória tornam-se efetivas para o controle de acesso nesse ponto.

Se você modificar as tabelas de concessão indiretamente usando uma declaração de gerenciamento de contas, o servidor percebe essas alterações e carrega as tabelas de concessão na memória novamente imediatamente. As declarações de gerenciamento de contas são descritas na Seção 15.7.1, “Declarações de Gerenciamento de Contas”. Exemplos incluem `GRANT`, `REVOKE`, `SET PASSWORD` e `RENAME USER`.

Se você modificar as tabelas de concessão diretamente usando declarações como `INSERT`, `UPDATE` ou `DELETE` (o que não é recomendado), as alterações não têm efeito no verificação de privilégios até que você avise o servidor a recarregar as tabelas ou reinicie-o. Assim, se você alterar as tabelas de concessão diretamente, mas esquecer de recarregá-las, as alterações *não têm efeito* até que você reinicie o servidor. Isso pode deixá-lo se perguntando por que suas alterações parecem não fazer diferença!

Para avisar o servidor a recarregar as tabelas de concessão, execute uma operação de `FLUSH PRIVILEGES`. Isso pode ser feito emitindo uma declaração `FLUSH PRIVILEGES` ou executando um comando **mysqladmin flush-privileges** ou **mysqladmin reload**.

O recarregamento de uma tabela de concessão afeta os privilégios para cada sessão de cliente existente da seguinte forma:

* Alterações de privilégios de tabela e coluna entram em vigor com a próxima solicitação do cliente.

* Alterações de privilégios de banco de dados entram em vigor na próxima vez que o cliente executar uma declaração `USE db_name`.

**Observação**

Os aplicativos cliente podem armazenar o nome do banco de dados; portanto, esse efeito pode não ser visível para eles sem realmente mudar para um banco de dados diferente.

* Os privilégios e senhas globais estáticos não são afetados para um cliente conectado. Essas alterações só entram em vigor em sessões para conexões subsequentes. Alterações nos privilégios globais dinâmicos são aplicadas imediatamente. Para obter informações sobre as diferenças entre privilégios estáticos e dinâmicos, consulte Privilegios estáticos versus dinâmicos.)

As alterações no conjunto de papéis ativos dentro de uma sessão entram em vigor imediatamente, apenas para essa sessão. A instrução `SET ROLE` realiza a ativação e desativação do papel de sessão (consulte Seção 15.7.1.11, “Instrução SET ROLE”).

Se o servidor for iniciado com a opção `--skip-grant-tables`, ele não lê as tabelas de concessão nem implementa qualquer controle de acesso. Qualquer usuário pode se conectar e realizar qualquer operação, *o que é inseguro.* Para fazer com que um servidor assim iniciado leia as tabelas e habilite a verificação de acesso, limpe os privilégios.