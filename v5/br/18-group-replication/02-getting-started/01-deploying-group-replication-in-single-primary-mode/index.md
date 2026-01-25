### 17.2.1 Implantando o Group Replication no Modo Single-Primary

[17.2.1.1 Implantando Instâncias para Group Replication](group-replication-deploying-instances.html)

[17.2.1.2 Configurando uma Instância para Group Replication](group-replication-configuring-instances.html)

[17.2.1.3 Credenciais de Usuário](group-replication-user-credentials.html)

[17.2.1.4 Iniciando o Group Replication](group-replication-launching.html)

[17.2.1.5 Inicializando o Group (Bootstrapping)](group-replication-bootstrap.html)

[17.2.1.6 Adicionando Instâncias ao Group](group-replication-adding-instances.html)

Cada uma das *server instances* MySQL em um *group* pode ser executada em uma *host machine* física independente, que é a maneira recomendada de implantar o *Group Replication*. Esta seção explica como criar um *replication group* com três *MySQL Server instances*, cada uma executando em uma *host machine* diferente. Consulte [Seção 17.2.2, “Implantando o Group Replication Localmente”](group-replication-deploying-locally.html "17.2.2 Deploying Group Replication Locally") para obter informações sobre a implantação de múltiplas *MySQL server instances* executando o *Group Replication* na mesma *host machine*, por exemplo, para fins de teste.

**Figura 17.4 Arquitetura do Group**

![Três server instances, S1, S2 e S3, são implantadas como um group interconectado, e clients se comunicam com cada uma das server instances.](images/gr-3-server-group.png)

Este tutorial explica como obter e implantar o MySQL Server com o *Group Replication plugin*, como configurar cada *server instance* antes de criar um *group* e como usar o monitoramento do *Performance Schema* para verificar se tudo está funcionando corretamente.