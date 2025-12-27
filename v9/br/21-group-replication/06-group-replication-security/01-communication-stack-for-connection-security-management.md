### 20.6.1 Pilha de Comunicação para Gerenciamento de Segurança de Conexão

A Replicação por Grupo do MySQL 9.5 pode garantir a segurança das conexões de comunicação de grupo entre os membros por um dos seguintes métodos:

* Usando sua própria implementação dos protocolos de segurança, incluindo TLS/SSL e o uso de uma lista de permissão para conexões do Sistema de Comunicação do Grupo (GCS) de entrada.

* Usando a própria segurança de conexão do MySQL Server em vez da implementação da Replicação por Grupo. O uso do protocolo MySQL significa que métodos padrão de autenticação de usuário podem ser usados para conceder (ou revogar) acesso ao grupo em vez da lista de permissão, e a funcionalidade mais recente do protocolo do servidor está sempre disponível na versão lançada.

A escolha é feita definindo a variável de sistema `group_replication_communication_stack` para `XCOM` para usar a implementação própria da Replicação por Grupo (esta é a escolha padrão), ou para `MYSQL` para usar a segurança de conexão do MySQL Server.

A seguinte configuração adicional é necessária para que um grupo de replicação use a pilha de comunicação MySQL. É especialmente importante garantir que todos esses requisitos estejam cumpridos quando você mudar de usar a pilha de comunicação XCom para a pilha de comunicação MySQL para seu grupo.

**Requisitos da Replicação por Grupo para a Pilha de Comunicação MySQL**

* O endereço de rede configurado pela variável de sistema `group_replication_local_address` para cada membro do grupo deve ser definido como um dos endereços IP e portas que o MySQL Server está ouvindo, conforme especificado pela variável de sistema `bind_address` do servidor. A combinação de endereço IP e porta para cada membro deve ser única no grupo. É recomendável que a variável de sistema `group_replication_group_seeds` para cada membro do grupo seja configurada para conter todos os endereços locais de todos os membros do grupo.

* A pilha de comunicação do MySQL suporta namespaces de rede, que a pilha de comunicação XCom não suporta. Se namespaces de rede forem usados com os endereços locais de grupo para os membros do grupo (`group_replication_local_address`), esses devem ser configurados para cada membro do grupo usando a instrução `CHANGE REPLICATION SOURCE TO`. Além disso, a variável de sistema `report_host` para cada membro do grupo deve ser definida para relatar o namespace. Todos os membros do grupo devem usar o mesmo namespace para evitar possíveis problemas com a resolução de endereços durante a recuperação distribuída.

* A variável de sistema `group_replication_ssl_mode` deve ser definida para a configuração necessária para as comunicações do grupo. Esta variável de sistema controla se o TLS/SSL está habilitado ou desabilitado para as comunicações do grupo. Quando a pilha de comunicação do MySQL é usada, a configuração TLS/SSL é tirada das configurações de recuperação distribuída do Grupo de Replicação. Este ajuste deve ser o mesmo em todos os membros do grupo, para evitar conflitos potenciais.

* O valor da variável de sistema `require_secure_transport` deve ser o mesmo em todos os membros do grupo, para evitar potenciais conflitos. Se `group_replication_ssl_mode` estiver definido como `REQUIRED`, `VERIFY_CA` ou `VERIFY_IDENTITY`, use `require_secure_transport=ON`. Se `group_replication_ssl_mode` estiver definido como `DISABLED`, use `require_secure_transport=OFF`.

* Se o TLS/SSL estiver habilitado para comunicações de grupo, as configurações da Replicação de Grupo para a segurança da recuperação distribuída devem ser configuradas, se ainda não estiverem em vigor, ou validadas, se já estiverem. A pilha de comunicação MySQL usa essas configurações não apenas para conexões de recuperação distribuída membro a membro, mas também para a configuração TLS/SSL em comunicações de grupo em geral. As variáveis de sistema `group_replication_recovery_use_ssl` e as outras `group_replication_recovery_*` são explicadas na Seção 20.6.3.2, “Conexões Secure Socket Layer (SSL) para Recuperação Distribuída” (Conexões para Recuperação Distribuída").

* A lista de permissões de replicação do Grupo não é usada quando o grupo estiver usando a pilha de comunicação MySQL, então a variável de sistema `group_replication_ip_allowlist` é ignorada e não precisa ser definida.

* A conta de usuário de replicação que a Replicação de Grupo usa para a recuperação distribuída, conforme configurada usando a declaração `CHANGE REPLICATION SOURCE TO`, é usada para autenticação pela pilha de comunicação MySQL ao configurar conexões de Replicação de Grupo. Essa conta de usuário, que é a mesma em todos os membros do grupo, deve ter os seguintes privilégios:

  + `GROUP_REPLICATION_STREAM`. Esse privilégio é necessário para que a conta de usuário possa estabelecer conexões para a Replicação de Grupo usando a pilha de comunicação MySQL.

+ `CONNECTION_ADMIN`. Esse privilégio é necessário para que as conexões de replicação em grupo não sejam encerradas se um dos servidores envolvidos for colocado no modo offline. Se a pilha de comunicação MySQL estiver em uso sem esse privilégio, um membro colocado no modo offline é expulso do grupo.

Estes são, além dos privilégios `REPLICATION SLAVE` e `BACKUP_ADMIN` que todas as contas de usuário de replicação devem ter (veja a Seção 20.2.1.3, “Credenciais de Usuário para Recuperação Distribuída”). Ao adicionar os novos privilégios, certifique-se de pular o registro binário em cada membro do grupo, emitindo `SET SQL_LOG_BIN=0` antes de emitir as declarações `GRANT` e `SET SQL_LOG_BIN=1` depois delas, para que a transação local não interfira no reinício da replicação em grupo.

`group_replication_communication_stack` é efetivamente um ajuste de configuração para todo o grupo, e o ajuste deve ser o mesmo em todos os membros do grupo. No entanto, isso não é monitorado pelos próprios controles da Replicação em Grupo para ajustes de configuração para todo o grupo. Um membro com um valor diferente do restante do grupo não pode se comunicar com os outros membros, porque os protocolos de comunicação são incompatíveis, então não pode trocar informações sobre seus ajustes de configuração.

Isso significa que, embora o valor da variável do sistema possa ser alterado enquanto a Replicação em Grupo estiver em execução e tenha efeito após você reiniciar a Replicação em Grupo no membro do grupo, o membro ainda não poderá se reiniciar no grupo até que o ajuste seja alterado em todos os membros. Portanto, você deve parar a Replicação em Grupo em todos os membros e alterar o valor da variável do sistema neles antes de poder reiniciar o grupo. Como todos os membros estão parados, é necessário um reinício completo do grupo (um bootstrap por um servidor com `group_replication_bootstrap_group=ON`) para que a alteração de valor tenha efeito. Você pode fazer as outras alterações necessárias nos ajustes dos membros do grupo enquanto eles estão parados.

Para um grupo em execução, siga este procedimento para alterar o valor de `group_replication_communication_stack` e as outras configurações necessárias para migrar um grupo da pilha de comunicação XCom para a pilha de comunicação MySQL, ou da pilha de comunicação MySQL para a pilha de comunicação XCom:

1. Parar a Replicação em Grupo em cada um dos membros do grupo, usando uma declaração `STOP GROUP_REPLICATION`. Parar o membro primário por último, para não desencadear uma nova eleição primária e ter que esperar para que isso seja concluído.

2. Em cada um dos membros do grupo, definir a variável do sistema `group_replication_communication_stack` para a nova pilha de comunicação, `MYSQL` ou `XCOM`, conforme apropriado. Você pode fazer isso editando o arquivo de configuração do Servidor MySQL (tipicamente nomeado `my.cnf` em sistemas Linux e Unix, ou `my.ini` em sistemas Windows), ou usando uma declaração `SET`. Por exemplo:

   ```
   SET PERSIST group_replication_communication_stack="MYSQL";
   ```

3. Se você estiver migrando o grupo de replicação da pilha de comunicação XCom (padrão) para a pilha de comunicação MySQL, em cada um dos membros do grupo, configure ou reconfigure as variáveis de sistema necessárias para configurações apropriadas, conforme descrito na lista acima. Por exemplo, a variável de sistema `group_replication_local_address` deve ser definida para um dos endereços IP e portas nos quais o MySQL Server está ouvindo. Além disso, configure quaisquer namespaces de rede usando uma declaração `CHANGE REPLICATION SOURCE TO`.

4. Se você estiver migrando o grupo de replicação da pilha de comunicação XCom (padrão) para a pilha de comunicação MySQL, em cada um dos membros do grupo, emita declarações `GRANT` para dar à conta de usuário de replicação os privilégios `GROUP_REPLICATION_STREAM` e `CONNECTION_ADMIN`. Você precisará tirar os membros do grupo do estado de leitura somente que é aplicado quando a Replicação de Grupo é parada. Além disso, certifique-se de que você pule o registro binário em cada membro do grupo emitindo `SET SQL_LOG_BIN=0` antes de emitir as declarações `GRANT`, e `SET SQL_LOG_BIN=1` depois delas, para que a transação local não interfira no reinício da Replicação de Grupo. Por exemplo:

   ```
   SET GLOBAL SUPER_READ_ONLY=OFF;
   SET SQL_LOG_BIN=0;
   GRANT GROUP_REPLICATION_STREAM ON *.* TO rpl_user@'%';
   GRANT CONNECTION_ADMIN ON *.* TO rpl_user@'%';
   SET SQL_LOG_BIN=1;
   ```

5. Se você estiver migrando o grupo de replicação da pilha de comunicação MySQL de volta para a pilha de comunicação XCom, em cada um dos membros do grupo, reconfigure as variáveis de sistema na lista de requisitos acima para configurações adequadas para a pilha de comunicação XCom. A seção 20.9, “Variáveis de Replicação de Grupo”, lista as variáveis de sistema com seus padrões e requisitos para a pilha de comunicação XCom.

Nota

* A pilha de comunicação XCom não suporta namespaces de rede, portanto, o endereço local de replicação de grupo (`variable_system_group_replication_local_address`) não pode usá-los. Desative-os emitindo uma declaração `CHANGE REPLICATION SOURCE TO`.

* Quando você voltar para a pilha de comunicação XCom, as configurações especificadas por `group_replication_recovery_use_ssl` e as outras variáveis de sistema `group_replication_recovery_*` não serão usadas para proteger as comunicações do grupo. Em vez disso, a variável de sistema do Grupo de Replicação `group_replication_ssl_mode` será usada para ativar o uso do SSL para conexões de comunicação de grupo e especificar o modo de segurança para as conexões, e o restante da configuração será obtido da configuração SSL do servidor. Para detalhes, consulte a Seção 20.6.2, “Proteger Conexões de Comunicação de Grupo com Secure Socket Layer (SSL”)”).

6. Para reiniciar o grupo, siga o processo na Seção 20.5.2, “Reiniciar um Grupo”, que explica como inicializar com segurança um grupo onde as transações foram executadas e certificadas. Uma inicialização por um servidor com `group_replication_bootstrap_group=ON` é necessária para mudar a pilha de comunicação, porque todos os membros devem ser desligados.

7. Os membros agora se conectam uns aos outros usando a nova pilha de comunicação. Qualquer servidor que tenha `group_replication_communication_stack` definido (ou padrão, no caso do XCom) para a pilha de comunicação anterior não poderá mais se juntar ao grupo. É importante notar que, como o Grupo de Replicação nem sequer pode ver a tentativa de junção, ele não verifica e rejeita o membro que está tentando se juntar com uma mensagem de erro. Em vez disso, a tentativa de junção falha silenciosamente quando a pilha de comunicação anterior desiste de tentar contatá-la.