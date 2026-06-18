### 25.7.3 Problemas Conhecidos na Replicação em NDB Cluster

Esta seção discute problemas ou questões conhecidas ao usar a replicação com o NDB Cluster.

**Perda da conexão entre a fonte e a réplica.**

Uma perda de conexão pode ocorrer entre o nó SQL do cluster de origem e o nó SQL do cluster de replica, ou entre o nó SQL de origem e os nós de dados do cluster de origem. Neste último caso, isso pode ocorrer não apenas como resultado da perda de conexão física (por exemplo, um cabo de rede quebrado), mas devido ao excesso de buffers de eventos dos nós de dados; se o nó SQL for muito lento para responder, ele pode ser descartado pelo cluster (isso pode ser controlado até certo ponto ajustando os parâmetros de configuração `MaxBufferedEpochs` e `TimeBetweenEpochs`). Se isso ocorrer, *é totalmente possível que novos dados sejam inseridos no cluster de origem sem serem registrados no log binário do nó SQL de origem*. Por essa razão, para garantir alta disponibilidade, é extremamente importante manter um canal de replicação de backup, monitorar o canal primário e realizar a transição para o canal de replicação secundário, quando necessário, para manter o cluster de replica sincronizado com o de origem. O NDB Cluster não foi projetado para realizar esse monitoramento por conta própria; para isso, é necessário um aplicativo externo.

O nó SQL de origem emite um evento "lacuna" ao se conectar ou reconectar ao clúster de origem. (Um evento de lacuna é um tipo de "evento de incidente", que indica um incidente que ocorre e afeta o conteúdo do banco de dados, mas que não pode ser facilmente representado como um conjunto de alterações. Exemplos de incidentes são falhas no servidor, ressonância do banco de dados, algumas atualizações de software e algumas mudanças de hardware.) Quando a replica encontra uma lacuna no log de replicação, ela para com uma mensagem de erro. Essa mensagem está disponível na saída de `SHOW REPLICA STATUS` (antes da versão NDB 8.0.22, use `SHOW SLAVE STATUS`), e indica que o thread SQL parou devido a um incidente registrado na corrente de replicação, e que uma intervenção manual é necessária. Consulte a Seção 25.7.8, “Implementando Failover com Replicação de Clúster NDB”, para obter mais informações sobre o que fazer nessas circunstâncias.

Importante

Como o NDB Cluster não é projetado para monitorar o status da replicação ou fornecer falha de replicação por conta própria, se a alta disponibilidade for uma exigência para o servidor ou cluster de replicação, você deve configurar várias linhas de replicação, monitorar o **mysqld** da linha de replicação primária e estar preparado para fazer a transição para uma linha secundária, se e quando necessário. Isso deve ser feito manualmente ou, possivelmente, por meio de um aplicativo de terceiros. Para obter informações sobre a implementação desse tipo de configuração, consulte a Seção 25.7.7, “Usando Dois Canais de Replicação para a Replicação do NDB Cluster”, e a Seção 25.7.8, “Implementando a Falha de Replicação com a Replicação do NDB Cluster”.

Se você estiver replicando de um servidor MySQL autônomo para um NDB Cluster, um canal geralmente é suficiente.

**Replicação circular.**

A replicação em cluster do NDB suporta a replicação circular, como mostrado no próximo exemplo. A configuração da replicação envolve três clusters NDB numerados 1, 2 e 3, nos quais o cluster 1 atua como a fonte de replicação para o cluster 2, o cluster 2 atua como a fonte para o cluster 3 e o cluster 3 atua como a fonte para o cluster 1, completando assim o círculo. Cada cluster NDB tem dois nós SQL, com os nós SQL A e B pertencentes ao cluster 1, os nós SQL C e D pertencentes ao cluster 2 e os nós SQL E e F pertencentes ao cluster 3.

A replicação circular usando esses clusters é suportada desde que as seguintes condições sejam atendidas:

- Os nós SQL em todos os clusters de origem e replicação são os mesmos.
- Todos os nós SQL que atuam como fontes e réplicas são iniciados com a variável de sistema `log_replica_updates` (NDB 8.0.26 e versões posteriores) ou `log_slave_updates` (antes da versão 8.0.26) habilitada.

Esse tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 25.11 Replicação Circular de Clusters NDB com Todas as Fontes como Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that all sources are also replicas.](images/cluster-circular-replication-1.png)

Nesse cenário, o nó SQL A do Cluster 1 replica para o nó SQL C do Cluster 2; o nó SQL C replica para o nó SQL E do Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas.

Também deve ser possível configurar a replicação circular, na qual nem todos os nós de SQL de origem são também réplicas, como mostrado aqui:

**Figura 25.12 Replicação Circular de Clusters do NDB Onde Nem Todas as Fontes São Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that not all sources are replicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada clúster são usados como fontes e réplicas. No entanto, você *não* deve iniciar nenhum dos nós SQL com a variável de sistema `log_replica_updates` ou `log_slave_updates` habilitada. Esse tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi testado completamente e, portanto, ainda deve ser considerado experimental.

Nota

O mecanismo de armazenamento `NDB` utiliza o modo de execução idempotente, que suprime erros de chave duplicada e outros erros que, de outra forma, interromperiam a replicação circular do NDB Cluster. Isso é equivalente a definir o valor global da variável de sistema `replica_exec_mode` ou `slave_exec_mode` para `IDEMPOTENT`, embora isso não seja necessário na replicação do NDB Cluster, uma vez que o NDB Cluster define essa variável automaticamente e ignora quaisquer tentativas de defini-la explicitamente.

**Replicação do cluster do NDB e chaves primárias.**

Em caso de falha de um nó, ainda podem ocorrer erros na replicação das tabelas `NDB` sem chaves primárias, devido à possibilidade de duplicatas serem inseridas nesses casos. Por essa razão, é altamente recomendável que todas as tabelas `NDB` que estão sendo replicadas tenham chaves primárias explícitas.

**Replicação em cluster do NDB e chaves únicas.**

Em versões mais antigas do NDB Cluster, operações que atualizavam os valores de colunas de chave única das tabelas `NDB` podiam resultar em erros de chave duplicada durante a replicação. Esse problema é resolvido para a replicação entre as tabelas `NDB` ao adiar as verificações de chave única até que todas as atualizações das linhas da tabela tenham sido realizadas.

A adição de restrições dessa forma é atualmente suportada apenas pelo `NDB`. Portanto, as atualizações de chaves únicas ao replicar de `NDB` para um motor de armazenamento diferente, como `InnoDB` ou `MyISAM`, ainda não são suportadas.

O problema encontrado ao replicar sem verificação diferida de atualizações de chave única pode ser ilustrado usando a tabela `NDB`, como `t`, que é criada e preenchida na fonte (e transmitida para uma réplica que não suporta atualizações de chave única diferidas), conforme mostrado aqui:

```
CREATE TABLE t (
    p INT PRIMARY KEY,
    c INT,
    UNIQUE KEY u (c)
)   ENGINE NDB;

INSERT INTO t
    VALUES (1,1), (2,2), (3,3), (4,4), (5,5);
```

A seguinte declaração `UPDATE` em `t` tem sucesso na fonte, uma vez que as linhas afetadas são processadas na ordem determinada pela opção `ORDER BY`, realizada em toda a tabela:

```
UPDATE t SET c = c - 1 ORDER BY p;
```

A mesma declaração falha com um erro de chave duplicada ou outra violação de restrição na replica, porque a ordenação das atualizações da linha é realizada uma vez por partição, em vez de para a tabela como um todo.

Nota

Cada tabela `NDB` é implicitamente particionada por chave quando é criada. Consulte a Seção 26.2.5, “Particionamento por Chave”, para obter mais informações.

**GTIDs não são suportados.** A replicação usando IDs de transação global não é compatível com o mecanismo de armazenamento `NDB` e não é suportada. A ativação de GTIDs provavelmente fará com que a replicação do NDB Cluster falhe.

**Replicação multiassíncrona.** Anteriormente, o NDB Cluster não suportava replicações multiassíncronas. Essa restrição foi removida no NDB 8.0.33.

Para habilitar o multithreading na replica no NDB 8.0.33 e versões posteriores, é necessário realizar as seguintes etapas:

1. Defina `--ndb-log-transaction-dependency` para `ON` ao iniciar a fonte **mysqld**.

2. Além disso, no **mysqld**, defina `binlog_transaction_dependency_tracking` para `WRITESET`. Isso pode ser feito enquanto o processo **mysqld** estiver em execução.

3. Para garantir que a replica use múltiplas threads de trabalho, defina o valor de `replica_parallel_workers` maior que 1. O valor padrão é 4 e pode ser alterado na replica enquanto ela estiver em execução.

Antes da versão 8.0.26 do NDB, definir quaisquer variáveis de sistema relacionadas a réplicas multithread, como `replica_parallel_workers` ou `slave_parallel_workers` e `replica_checkpoint_group` ou `slave_checkpoint_group` (ou as opções de inicialização equivalentes do **mysqld**) era completamente ignorado e não tinha efeito.

Nas versões NDB 8.0.27 a NDB 8.0.32, `replica_parallel_workers` deve ser definido como 0. Nestas versões, se este for definido para qualquer outro valor ao iniciar, `NDB` o altera para 0 e escreve uma mensagem no arquivo de log do servidor **mysqld**. Esta restrição também é removida na versão NDB 8.0.33.

Reinicie com --initial.

Reiniciar o clúster com a opção `--initial` faz com que a sequência de números de GCI e época comece novamente a partir de `0`. (Isso geralmente é verdadeiro para o NDB Cluster e não se limita a cenários de replicação envolvendo o Cluster.) Os servidores MySQL envolvidos na replicação devem ser reiniciados neste caso. Depois disso, você deve usar as instruções `RESET MASTER` e `RESET REPLICA` (antes da versão 8.0.22 do NDB, use `RESET SLAVE`) para limpar as tabelas inválidas `ndb_binlog_index` e `ndb_apply_status`, respectivamente.

**Replicação de NDB para outros motores de armazenamento.** É possível replicar uma tabela `NDB` na fonte para uma tabela usando um motor de armazenamento diferente na replica, levando em consideração as restrições listadas aqui:

- A replicação múltipla de origem e circular não são suportadas (as tabelas tanto na origem quanto na replica devem usar o motor de armazenamento `NDB` para que isso funcione).

- O uso de um mecanismo de armazenamento que não realiza registro binário para tabelas na replica requer um tratamento especial.

- O uso de um mecanismo de armazenamento não transacional para tabelas na replica também requer um tratamento especial.

- A fonte **mysqld** deve ser iniciada com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`.

Os próximos parágrafos fornecem informações adicionais sobre cada um dos problemas descritos acima.

**Múltiplas fontes não são suportadas ao replicar NDB para outros motores de armazenamento.** Para a replicação de `NDB` para um motor de armazenamento diferente, a relação entre as duas bases de dados deve ser de um para um. Isso significa que a replicação bidirecional ou circular não é suportada entre o NDB Cluster e outros motores de armazenamento.

Além disso, não é possível configurar mais de um canal de replicação ao replicar entre `NDB` e um motor de armazenamento diferente. (Um banco de dados NDB Cluster *pode* replicar simultaneamente para múltiplos bancos de dados NDB Cluster.) Se a fonte usar tabelas `NDB`, ainda é possível ter mais de um servidor MySQL mantendo um log binário de todas as alterações, mas para que a replica mude de fonte (fail over), a nova relação fonte-replica deve ser explicitamente definida na replica.

**Replicar tabelas NDB para um mecanismo de armazenamento que não realiza registro binário.**

Se você tentar replicar de um NDB Cluster para uma replica que usa um motor de armazenamento que não gerencia seu próprio registro binário, o processo de replicação será interrompido com o erro "Registro binário não possível... A declaração não pode ser escrita atomicamente, pois mais de um motor está envolvido e pelo menos um motor está fazendo registro próprio (Erro 1595). É possível contornar esse problema de uma das seguintes maneiras:

- **Desative o registro binário na replica.** Isso pode ser feito definindo `sql_log_bin = 0`.

- **Altere o motor de armazenamento usado para a tabela mysql.ndb\_apply\_status.** Fazer com que essa tabela use um motor que não gerencie seu próprio registro binário também pode eliminar o conflito. Isso pode ser feito emitindo uma declaração como `ALTER TABLE mysql.ndb_apply_status ENGINE=MyISAM` na replica. É seguro fazer isso ao usar um motor de armazenamento diferente de `NDB` na replica, pois você não precisa se preocupar em manter múltiplas réplicas sincronizadas.

- **Filtre as alterações na tabela mysql.ndb\_apply\_status na replica.** Isso pode ser feito iniciando a replica com `--replicate-ignore-table=mysql.ndb_apply_status`. Se você precisar que outras tabelas sejam ignoradas pela replicação, talvez queira usar uma opção apropriada `--replicate-wild-ignore-table` em vez disso.

Importante

Você *não* deve desativar a replicação ou o registro binário de `mysql.ndb_apply_status` ou alterar o mecanismo de armazenamento usado para essa tabela ao replicar de um NDB Cluster para outro. Consulte as regras de filtragem de replicação e log binário com replicação entre NDB Clusters, para obter detalhes.

**Replicação de NDB para um motor de armazenamento não transacional.** Ao replicar de `NDB` para um motor de armazenamento não transacional, como `MyISAM`, você pode encontrar erros de chave duplicada desnecessários ao replicar instruções `INSERT ... ON DUPLICATE KEY UPDATE`. Você pode suprimir esses erros usando `--ndb-log-update-as-write=0`, que força as atualizações a serem registradas como escritas, em vez de como atualizações.

**Replicação do NDB e Criptografia do Sistema de Arquivos (TDE).** O uso de um sistema de arquivos criptografado não afeta a Replicação do NDB. Todos os seguintes cenários são suportados:

- Replicação de um NDB Cluster com um sistema de arquivos criptografado para um NDB Cluster cujo sistema de arquivos não está criptografado.

- Replicação de um NDB Cluster cujo sistema de arquivos não está criptografado para um NDB Cluster cujo sistema de arquivos está criptografado.

- A replicação de um NDB Cluster cujo sistema de arquivos está criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` que não estão criptografadas.

- Replicação de um NDB Cluster com um sistema de arquivos não criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` com criptografia de sistema de arquivos.

**Regras de replicação e filtragem de log binário com replicação entre NDB Clusters.** Se você estiver usando qualquer uma das opções `--replicate-do-*`, `--replicate-ignore-*`, `--binlog-do-db` ou `--binlog-ignore-db` para filtrar bancos de dados ou tabelas que estão sendo replicados, você deve ter cuidado para não bloquear a replicação ou o registro binário do `mysql.ndb_apply_status`, que é necessário para que a replicação entre NDB Clusters funcione corretamente. Em particular, você deve ter em mente o seguinte:

1. Usar `--replicate-do-db=db_name` (e nenhuma outra opção `--replicate-do-*` ou `--replicate-ignore-*`) significa que *apenas* as tabelas no banco de dados `db_name` são replicadas. Nesse caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja preenchido nas réplicas.

   Usar `--binlog-do-db=db_name` (e nenhuma outra opção `--binlog-do-db`) significa que as alterações *apenas* nas tabelas no banco de dados `db_name` são escritas no log binário. Nesse caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja preenchido nas réplicas.

2. Usar `--replicate-ignore-db=mysql` significa que nenhuma tabela no banco de dados `mysql` é replicada. Nesse caso, você também deve usar `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja replicada.

   Usar `--binlog-ignore-db=mysql` significa que nenhuma alteração nas tabelas no banco de dados `mysql` é escrita no log binário. Nesse caso, você também deve usar `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja replicado.

Você também deve lembrar que cada regra de replicação requer o seguinte:

1. Sua própria opção `--replicate-do-*` ou `--replicate-ignore-*` e que múltiplas regras não podem ser expressas em uma única opção de filtragem de replicação. Para obter informações sobre essas regras, consulte a Seção 19.1.6, “Opções e variáveis de replicação e registro binário”.

2. Sua própria opção `--binlog-do-db` ou `--binlog-ignore-db` e que múltiplas regras não podem ser expressas em uma única opção de filtragem de log binário. Para obter informações sobre essas regras, consulte a Seção 7.4.4, “O Log Binário”.

Se você estiver replicando um NDB Cluster para uma replica que usa um mecanismo de armazenamento diferente do `NDB`, as considerações mencionadas anteriormente podem não se aplicar, conforme discutido em outras partes desta seção.

**Replicação em Nuvem do NDB e IPv6.** A partir do NDB 8.0.22, todos os tipos de nós da Nuvem do NDB suportam IPv6; isso inclui nós de gerenciamento, nós de dados e nós de API ou SQL.

Antes da versão 8.0.22 do NDB, a API NDB e a API MGM (e, portanto, os nós de dados e os nós de gerenciamento) não suportam IPv6, embora os Servidores MySQL — incluindo aqueles que atuam como nós SQL em um NDB Cluster — possam usar IPv6 para se conectar a outros Servidores MySQL. Em versões do NDB Cluster anteriores à 8.0.22, você pode replicar entre clusters usando IPv6 para conectar os nós SQL que atuam como fonte e replica, conforme mostrado pela seta pontilhada no diagrama abaixo:

**Figura 25.13 Replicação entre nós SQL conectados usando IPv6**

![Most content is described in the surrounding text. The dotted line representing a MySQL-to-MySQL IPv6 connection is between two nodes, one each from the source and replica clusters. All connections within the cluster, such as data node to data node or data node to management node, are connected with solid lines to indicate IPv4 connections only.](images/cluster-replication-ipv6.png)

Antes da versão 8.0.22 do NDB, todas as conexões que se originam *dentro* do NDB Cluster — representadas no diagrama anterior por setas sólidas — devem usar IPv4. Em outras palavras, todos os nós de dados, servidores de gerenciamento e clientes de gerenciamento do NDB Cluster devem ser acessíveis uns aos outros usando IPv4. Além disso, os nós SQL devem usar IPv4 para se comunicar com o cluster. No NDB 8.0.22 e versões posteriores, essas restrições não se aplicam mais; além disso, quaisquer aplicativos escritos usando as APIs NDB e MGM podem ser escritos e implantados assumindo um ambiente exclusivo para IPv6.

Nota

Nas versões 8.0.22 a 8.0.33, inclusive, o `NDB` exigia suporte do sistema para o IPv6 para funcionar, independentemente de o clúster realmente usar endereços IPv6 ou não. No NDB Cluster 8.0.34 e versões posteriores, isso não é mais um problema, e você pode desabilitar o IPv6 no kernel do Linux se o endereçamento IPv6 não estiver sendo usado pelo clúster.

**Promoção e redução de atributos.** A Replicação em NDB Cluster inclui suporte para promoção e redução de atributos. A implementação da última opção diferencia as conversões de tipos com perda e sem perda, e seu uso na replica pode ser controlado definindo o valor global da variável de sistema `replica_type_conversions` (NDB 8.0.26 e versões posteriores) ou `slave_type_conversions` (antes de NDB 8.0.26).

Para obter mais informações sobre promoção e redução de atributos no NDB Cluster, consulte Replicação baseada em linhas: promoção e redução de atributos.

`NDB`, ao contrário de `InnoDB` ou `MyISAM`, não escreve alterações em colunas virtuais no log binário; no entanto, isso não tem efeitos prejudiciais na Replicação do NDB Cluster ou na replicação entre `NDB` e outros motores de armazenamento. Alterações em colunas geradas armazenadas são registradas.
