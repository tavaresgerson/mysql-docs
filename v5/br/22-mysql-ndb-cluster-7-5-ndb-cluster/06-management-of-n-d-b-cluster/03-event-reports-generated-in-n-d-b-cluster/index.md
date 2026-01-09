### 21.6.3 Relatórios de eventos gerados no NDB Cluster

21.6.3.1 Comandos de Gerenciamento de Registro do NDB Cluster

21.6.3.2 Eventos de log do cluster NDB

21.6.3.3 Uso das estatísticas do CLUSTERLOG no cliente de gerenciamento de clusters NDB

Nesta seção, discutimos os tipos de registros de eventos fornecidos pelo NDB Cluster e os tipos de eventos registrados.

O NDB Cluster oferece dois tipos de registro de eventos:

- O log do cluster, que inclui eventos gerados por todos os nós do cluster. O log do cluster é o log recomendado para a maioria dos usos, pois fornece informações de registro para todo o cluster em um único local.

  Por padrão, o log do clúster é salvo em um arquivo chamado `ndb_node_id_cluster.log`, (onde *`node_id`* é o ID do nó do servidor de gerenciamento) na pasta de dados do servidor de gerenciamento `DataDir`.

  As informações de registro do cluster também podem ser enviadas para `stdout` ou uma instalação `syslog`, além de serem salvas em um arquivo, conforme determinado pelos valores definidos para os parâmetros de configuração `DataDir` e `LogDestination`. Consulte Seção 21.4.3.5, “Definindo um Servidor de Gerenciamento de NDB Cluster” para obter mais informações sobre esses parâmetros.

- Os logs do nó são locais para cada nó.

  A saída gerada pelo registro de eventos do nó é escrita no arquivo `ndb_node_id_out.log` (onde *`node_id`* é o ID do nó) na pasta de dados do nó `DataDir`. Os registros de eventos do nó são gerados tanto para nós de gerenciamento quanto para nós de dados.

  Os logs do nó devem ser usados apenas durante o desenvolvimento da aplicação ou para depuração do código da aplicação.

Cada evento que deve ser relatado pode ser distinguido de acordo com três critérios diferentes:

- *Categoria*: Pode ser qualquer um dos seguintes valores: `STARTUP`, `SHUTDOWN`, `STATISTICS`, `CHECKPOINT`, `NODERESTART`, `CONNECTION`, `ERROR` ou `INFO`.

- *Prioridade*: Isso é representado por um dos números de 0 a 15, inclusive, onde 0 indica “mais importante” e 15 “menos importante”.

- *Nível de gravidade*: Pode ser qualquer um dos seguintes valores: `ALERT`, `CRITICAL`, `ERROR`, `WARNING`, `INFO` ou `DEBUG`.

O log do cluster pode ser filtrado nessas propriedades usando o comando do cliente de gerenciamento do NDB `CLUSTERLOG`. Esse comando afeta apenas o log do cluster e não tem efeito nos logs dos nós; o registro de depuração em um ou mais logs de nós pode ser ativado ou desativado usando o comando **ndb_mgm** `NODELOG DEBUG`.

O formato usado no log do cluster é o seguinte:

```sql
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 1: Data usage is 2%(60 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 1: Index usage is 1%(24 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 1: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 2: Data usage is 2%(76 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 2: Index usage is 1%(24 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 2: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 3: Data usage is 2%(58 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 3: Index usage is 1%(25 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 3: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 4: Data usage is 2%(74 32K pages of total 2560)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 4: Index usage is 1%(25 8K pages of total 2336)
2007-01-26 19:35:55 [MgmSrvr] INFO     -- Node 4: Resource 0 min: 0 max: 639 curr: 0
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 4: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 1: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 1: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 2: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 2: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 3: Node 9 Connected
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 3: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:39:42 [MgmSrvr] INFO     -- Node 4: Node 9: API 5.7.44-ndb-7.5.36
2007-01-26 19:59:22 [MgmSrvr] ALERT    -- Node 2: Node 7 Disconnected
2007-01-26 19:59:22 [MgmSrvr] ALERT    -- Node 2: Node 7 Disconnected
```

Cada linha no log de cluster contém as seguintes informações:

- Um marcador de tempo no formato `YYYY-MM-DD HH:MM:SS`.

- O tipo de nó que está realizando o registro. No log do cluster, isso é sempre `[MgmSrvr]`.

- A gravidade do evento.

- O ID do nó que relata o evento.

- Uma descrição do evento. Os tipos mais comuns de eventos que aparecem no log são as conexões e desconexões entre diferentes nós no clúster e quando os pontos de verificação ocorrem. Em alguns casos, a descrição pode conter informações de status.

Para obter informações adicionais, consulte Seção 21.6.3.2, “Eventos de log do cluster NDB”.
