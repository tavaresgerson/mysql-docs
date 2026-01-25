### 21.7.3 Problemas Conhecidos na Replicação NDB Cluster

Esta seção discute problemas ou questões conhecidas ao usar replicação com o NDB Cluster.

**Perda de conexão entre o Source e a Replica.**

Uma perda de conexão pode ocorrer entre o nó SQL do cluster Source e o nó SQL do cluster Replica, ou entre o nó SQL do Source e os *data nodes* do cluster Source. No último caso, isso pode ocorrer não apenas como resultado da perda de conexão física (por exemplo, um cabo de rede rompido), mas devido ao estouro dos *event buffers* dos *data nodes*; se o nó SQL for muito lento para responder, ele pode ser desconectado (*dropped*) pelo cluster (isso é controlável até certo ponto ajustando os parâmetros de configuração [`MaxBufferedEpochs`] e [`TimeBetweenEpochs`]). Se isso ocorrer, *é totalmente possível que novos dados sejam inseridos no cluster Source sem serem registrados no binary log do nó SQL do Source*. Por esse motivo, para garantir a alta disponibilidade, é extremamente importante manter um canal de replicação de backup, monitorar o canal primário e realizar o *failover* para o canal de replicação secundário quando necessário para manter o cluster Replica sincronizado com o Source. O NDB Cluster não foi projetado para realizar tal monitoramento por conta própria; para isso, é necessária uma aplicação externa.

O nó SQL do Source emite um evento "gap" ao se conectar ou reconectar ao cluster Source. (Um evento *gap* é um tipo de “incident event”, que indica um incidente que ocorre que afeta o conteúdo do Database, mas que não pode ser facilmente representado como um conjunto de mudanças. Exemplos de incidentes são falhas de servidor, ressincronização do Database, algumas atualizações de software e algumas alterações de hardware.) Quando a Replica encontra um *gap* no log de replicação, ela para com uma mensagem de erro. Esta mensagem está disponível na saída de [`SHOW SLAVE STATUS`], e indica que o *SQL thread* parou devido a um incidente registrado no fluxo de replicação, e que é necessária intervenção manual. Consulte [Seção 21.7.8, “Implementando Failover com Replicação NDB Cluster”](mysql-cluster-replication-failover.html "21.7.8 Implementando Failover com Replicação NDB Cluster"), para obter mais informações sobre o que fazer em tais circunstâncias.

Importante

Como o NDB Cluster não foi projetado para monitorar o status da replicação ou fornecer *failover* por conta própria, se a alta disponibilidade for um requisito para o servidor ou cluster Replica, você deve configurar múltiplas linhas de replicação, monitorar o [**mysqld**] Source na linha de replicação primária e estar preparado para fazer o *failover* para uma linha secundária se e quando necessário. Isso deve ser feito manualmente ou, possivelmente, por meio de uma aplicação de terceiros. Para obter informações sobre a implementação desse tipo de configuração, consulte [Seção 21.7.7, “Usando Dois Canais de Replicação para Replicação NDB Cluster”](mysql-cluster-replication-two-channels.html "21.7.7 Usando Dois Canais de Replicação para Replicação NDB Cluster"), e [Seção 21.7.8, “Implementando Failover com Replicação NDB Cluster”](mysql-cluster-replication-failover.html "21.7.8 Implementando Failover com Replicação NDB Cluster").

Se você estiver replicando de um MySQL Server *standalone* para um NDB Cluster, um canal geralmente é suficiente.

**Replicação circular.**

A Replicação NDB Cluster suporta replicação circular, conforme mostrado no próximo exemplo. A configuração de replicação envolve três Clusters NDB numerados 1, 2 e 3, nos quais o Cluster 1 atua como Source de replicação para o Cluster 2, o Cluster 2 atua como Source para o Cluster 3, e o Cluster 3 atua como Source para o Cluster 1, completando assim o círculo. Cada NDB Cluster possui dois nós SQL, com os nós SQL A e B pertencentes ao Cluster 1, nós SQL C e D pertencentes ao Cluster 2, e nós SQL E e F pertencentes ao Cluster 3.

A replicação circular usando esses clusters é suportada, desde que as seguintes condições sejam atendidas:

* Os nós SQL em todos os clusters Source e Replica são os mesmos.
* Todos os nós SQL que atuam como Sources e Replicas são iniciados com a variável de sistema [`log_slave_updates`] habilitada.

Este tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 21.13 Replicação Circular NDB Cluster Com Todos os Sources Como Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that all sources are also replicas.](images/cluster-circular-replication-1.png)

Neste cenário, o nó SQL A no Cluster 1 replica para o nó SQL C no Cluster 2; o nó SQL C replica para o nó SQL E no Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como Sources e Replicas.

Também deve ser possível configurar a replicação circular na qual nem todos os nós SQL Source são também Replicas, conforme mostrado aqui:

**Figura 21.14 Replicação Circular NDB Cluster Onde Nem Todos os Sources São Replicas**

![Some content is described in the surrounding text. The diagram shows three clusters, each with two nodes. Arrows connecting SQL nodes in different clusters illustrate that not all sources are replicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada cluster são usados como Sources e Replicas. No entanto, você *não* deve iniciar nenhum dos nós SQL com a variável de sistema [`log_slave_updates`] habilitada. Este tipo de esquema de replicação circular para NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi totalmente testado e, portanto, deve ser considerado experimental.

Nota

O storage engine [`NDB`] usa o modo de execução *idempotent*, que suprime erros de chave duplicada (*duplicate-key*) e outros erros que, de outra forma, interromperiam a replicação circular do NDB Cluster. Isso é equivalente a definir a variável de sistema global [`slave_exec_mode`] como `IDEMPOTENT`, embora isso não seja necessário na replicação NDB Cluster, visto que o NDB Cluster define essa variável automaticamente e ignora qualquer tentativa de defini-la explicitamente.

**Replicação NDB Cluster e Primary Keys.**

No caso de uma falha de nó, erros na replicação de tabelas [`NDB`] sem Primary Keys ainda podem ocorrer, devido à possibilidade de linhas duplicadas serem inseridas em tais casos. Por esse motivo, é altamente recomendado que todas as tabelas [`NDB`] sendo replicadas tenham Primary Keys explícitas.

**Replicação NDB Cluster e Unique Keys.**

Em versões mais antigas do NDB Cluster, operações que atualizavam valores de colunas de Unique Key de tabelas [`NDB`] podiam resultar em erros de chave duplicada (*duplicate-key errors*) quando replicadas. Este problema é resolvido para replicação entre tabelas [`NDB`] adiando as verificações de Unique Key até depois que todas as atualizações de linhas da tabela terem sido executadas.

O adiamento de Constraints dessa forma é atualmente suportado apenas pelo [`NDB`]. Assim, atualizações de Unique Keys ao replicar de [`NDB`] para um *storage engine* diferente, como [`InnoDB`] ou [`MyISAM`], ainda não são suportadas.

O problema encontrado ao replicar sem a verificação adiada de atualizações de Unique Key pode ser ilustrado usando uma tabela [`NDB`], como `t`, que é criada e preenchida no Source (e transmitida para uma Replica que não suporta atualizações adiadas de Unique Key) conforme mostrado aqui:

```sql
CREATE TABLE t (
    p INT PRIMARY KEY,
    c INT,
    UNIQUE KEY u (c)
)   ENGINE NDB;

INSERT INTO t
    VALUES (1,1), (2,2), (3,3), (4,4), (5,5);
```

A seguinte instrução [`UPDATE`] em `t` é bem-sucedida no Source, já que as linhas afetadas são processadas na ordem determinada pela opção `ORDER BY`, realizada em toda a tabela:

```sql
UPDATE t SET c = c - 1 ORDER BY p;
```

A mesma instrução falha com um erro de chave duplicada ou outra violação de Constraint na Replica, porque a ordenação das atualizações de linha é realizada para uma *Partition* de cada vez, em vez de para a tabela como um todo.

Nota

Toda tabela [`NDB`] é implicitamente particionada por Key quando é criada. Consulte [Seção 22.2.5, “Partitioning KEY”](partitioning-key.html "22.2.5 KEY Partitioning"), para obter mais informações.

**GTIDs não suportados.** A replicação usando Global Transaction IDs (GTIDs) não é compatível com o *storage engine* `NDB` e não é suportada. Habilitar GTIDs provavelmente fará com que a Replicação NDB Cluster falhe.

**Replicas Multithread não suportadas.** O NDB Cluster não suporta Replicas multithread. Isso ocorre porque a Replica pode não ser capaz de separar *Transactions* que ocorrem em um Database daquelas em outro se elas forem escritas dentro do mesmo *epoch*. Além disso, toda *Transaction* tratada pelo *storage engine* [`NDB`] envolve pelo menos dois Databases — o Database alvo e o Database de sistema `mysql` — devido ao requisito de atualização da tabela `mysql.ndb_apply_status` (consulte [Seção 21.7.4, “Schema e Tabelas de Replicação NDB Cluster”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables")). Isso, por sua vez, quebra o requisito para *multithreading* de que a *Transaction* seja específica para um determinado Database.

Antes do NDB 7.5.7 e NDB 7.6.3, a definição de quaisquer variáveis de sistema relacionadas a *slaves* multithread, como [`slave_parallel_workers`] e [`slave_checkpoint_group`] (ou as opções de inicialização [**mysqld**] equivalentes), era completamente ignorada e não tinha efeito.

A partir do NDB 7.5.7 e NDB 7.6.3, `slave_parallel_workers` é sempre 0. Se definido para qualquer outro valor na inicialização, o `NDB` o altera para 0 e escreve uma mensagem no arquivo de log do servidor [**mysqld**].

**Reiniciando com --initial.**

Reiniciar o cluster com a opção [`--initial`] faz com que a sequência de números GCI e *epoch* recomece do `0`. (Isso é geralmente verdade para o NDB Cluster e não se limita a cenários de replicação envolvendo o Cluster.) Os MySQL Servers envolvidos na replicação devem ser reiniciados neste caso. Depois disso, você deve usar as instruções [`RESET MASTER`] e [`RESET SLAVE`] para limpar as tabelas `ndb_binlog_index` e `ndb_apply_status` inválidas, respectivamente.

**Replicação de NDB para outros storage engines.** É possível replicar uma tabela [`NDB`] no Source para uma tabela usando um *storage engine* diferente na Replica, levando em conta as restrições listadas aqui:

* Replicação Multi-source e circular não são suportadas (as tabelas tanto no Source quanto na Replica devem usar o *storage engine* [`NDB`] para que isso funcione).

* Usar um *storage engine* que não executa *binary logging* para tabelas na Replica requer tratamento especial.

* O uso de um *storage engine* não-transactional para tabelas na Replica também requer tratamento especial.

* O [**mysqld**] Source deve ser iniciado com [`--ndb-log-update-as-write=0`] ou `--ndb-log-update-as-write=OFF`.

Os próximos parágrafos fornecem informações adicionais sobre cada uma das questões acabadas de descrever.

**Múltiplos Sources não suportados ao replicar NDB para outros storage engines.** Para replicação de [`NDB`] para um *storage engine* diferente, o relacionamento entre os dois Databases deve ser de um-para-um. Isso significa que a replicação bidirecional ou circular não é suportada entre o NDB Cluster e outros *storage engines*.

Além disso, não é possível configurar mais de um canal de replicação ao replicar entre [`NDB`] e um *storage engine* diferente. (Um Database NDB Cluster *pode* replicar simultaneamente para múltiplos Databases NDB Cluster.) Se o Source usar tabelas [`NDB`], ainda é possível que mais de um MySQL Server mantenha um *binary log* de todas as mudanças, mas para a Replica mudar de Sources (*failover*), o novo relacionamento Source-Replica deve ser explicitamente definido na Replica.

**Replicando tabelas NDB para um storage engine que não executa binary logging.**

Se você tentar replicar de um NDB Cluster para uma Replica que usa um *storage engine* que não gerencia seu próprio *binary logging*, o processo de replicação é abortado com o erro *Binary logging not possible ... Statement cannot be written atomically since more than one engine involved and at least one engine is self-logging (Error 1595)*. É possível contornar esse problema de uma das seguintes maneiras:

* **Desligar o binary logging na Replica.** Isso pode ser realizado definindo [`sql_log_bin = 0`].

* **Alterar o storage engine usado para a tabela mysql.ndb_apply_status.** Fazer com que esta tabela use um *engine* que não gerencia seu próprio *binary logging* também pode eliminar o conflito. Isso pode ser feito emitindo uma instrução como [`ALTER TABLE mysql.ndb_apply_status ENGINE=MyISAM`] na Replica. É seguro fazer isso ao usar um *storage engine* diferente de [`NDB`] na Replica, já que você não precisa se preocupar em manter múltiplas Replicas sincronizadas.

* **Filtrar alterações na tabela mysql.ndb_apply_status na Replica.** Isso pode ser feito iniciando a Replica com [`--replicate-ignore-table=mysql.ndb_apply_status`]. Se você precisar que outras tabelas sejam ignoradas pela replicação, você pode usar uma opção [`--replicate-wild-ignore-table`] apropriada.

Importante

Você *não* deve desabilitar a replicação ou o *binary logging* de `mysql.ndb_apply_status` ou alterar o *storage engine* usado para esta tabela ao replicar de um NDB Cluster para outro. Consulte [Replicação e regras de filtragem de binary log na replicação entre NDB Clusters](mysql-cluster-replication-issues.html#mysql-cluster-replication-issues-filtering "Replication and binary log filtering rules with replication between NDB Clusters"), para obter detalhes.

**Replicação de NDB para um storage engine não-transactional.** Ao replicar de [`NDB`] para um *storage engine* não-transactional como [`MyISAM`], você pode encontrar erros de chave duplicada desnecessários ao replicar instruções [`INSERT ... ON DUPLICATE KEY UPDATE`]. Você pode suprimi-los usando [`--ndb-log-update-as-write=0`], que força as atualizações a serem registradas como *writes* (escritas), em vez de como atualizações.

**Regras de filtragem de Replicação e Binary Log na replicação entre NDB Clusters.** Se você estiver usando qualquer uma das opções `--replicate-do-*`, `--replicate-ignore-*`, [`--binlog-do-db`], ou [`--binlog-ignore-db`] para filtrar Databases ou tabelas sendo replicadas, você deve tomar cuidado para não bloquear a replicação ou o *binary logging* da tabela `mysql.ndb_apply_status`, que é necessária para que a replicação entre NDB Clusters funcione corretamente. Em particular, você deve ter em mente o seguinte:

1. Usar [`--replicate-do-db=db_name`] (e nenhuma outra opção `--replicate-do-*` ou `--replicate-ignore-*`) significa que *apenas* as tabelas no Database *`db_name`* são replicadas. Neste caso, você também deve usar [`--replicate-do-db=mysql`], [`--binlog-do-db=mysql`], ou [`--replicate-do-table=mysql.ndb_apply_status`] para garantir que `mysql.ndb_apply_status` seja populada nas Replicas.

   Usar [`--binlog-do-db=db_name`] (e nenhuma outra opção [`--binlog-do-db`]) significa que as alterações *apenas* nas tabelas no Database *`db_name`* são escritas no *binary log*. Neste caso, você também deve usar [`--replicate-do-db=mysql`], [`--binlog-do-db=mysql`], ou [`--replicate-do-table=mysql.ndb_apply_status`] para garantir que `mysql.ndb_apply_status` seja populada nas Replicas.

2. Usar [`--replicate-ignore-db=mysql`] significa que nenhuma tabela no Database `mysql` é replicada. Neste caso, você também deve usar [`--replicate-do-table=mysql.ndb_apply_status`] para garantir que `mysql.ndb_apply_status` seja replicada.

   Usar [`--binlog-ignore-db=mysql`] significa que nenhuma alteração nas tabelas no Database `mysql` é escrita no *binary log*. Neste caso, você também deve usar [`--replicate-do-table=mysql.ndb_apply_status`] para garantir que `mysql.ndb_apply_status` seja replicada.

Você também deve lembrar que cada regra de replicação exige o seguinte:

1. Sua própria opção `--replicate-do-*` ou `--replicate-ignore-*`, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de replicação. Para obter informações sobre essas regras, consulte [Seção 16.1.6, “Opções e Variáveis de Replicação e Binary Logging”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

2. Sua própria opção [`--binlog-do-db`] ou [`--binlog-ignore-db`], e que múltiplas regras não podem ser expressas em uma única opção de filtragem de *binary log*. Para obter informações sobre essas regras, consulte [Seção 5.4.4, “O Binary Log”](binary-log.html "5.4.4 The Binary Log").

Se você estiver replicando um NDB Cluster para uma Replica que usa um *storage engine* diferente de [`NDB`], as considerações dadas acima podem não se aplicar, conforme discutido em outras partes desta seção.

**Replicação NDB Cluster e IPv6.** Embora o NDB API e o MGM API (e, portanto, os *data nodes* e *management nodes*) não suportem IPv6 no NDB 7.5 e 7.6, os MySQL Servers — incluindo aqueles que atuam como nós SQL em um NDB Cluster — podem usar IPv6 para contatar outros MySQL Servers. Isso significa que você pode replicar entre NDB Clusters usando IPv6 para conectar os nós SQL Source e Replica, conforme mostrado pela seta pontilhada no diagrama a seguir:

**Figura 21.15 Replicação Entre Nós SQL Conectados Usando IPv6**

![Most content is described in the surrounding text. The dotted line representing a MySQL-to-MySQL IPv6 connection is between two nodes, one each from the source and replica clusters. All connections within the cluster, such as data node to data node or data node to management node, are connected with solid lines to indicate IPv4 connections only.](images/cluster-replication-ipv6.png)

Todas as conexões originadas *dentro* do NDB Cluster — representadas no diagrama anterior por setas sólidas — devem usar IPv4. Em outras palavras, todos os *data nodes*, servidores de gerenciamento (*management servers*) e clientes de gerenciamento (*management clients*) do NDB Cluster devem ser acessíveis uns dos outros usando IPv4. Além disso, os nós SQL devem usar IPv4 para se comunicar com o cluster.

Como atualmente não há suporte no NDB e MGM APIs para IPv6, quaisquer aplicações escritas usando esses APIs também devem fazer todas as conexões usando IPv4.

**Promoção e demotion de Atributos.** A Replicação NDB Cluster inclui suporte para promoção e *demotion* de atributos. A implementação desta última distingue entre conversões de tipo *lossy* (com perda de dados) e *non-lossy* (sem perda de dados), e seu uso na Replica pode ser controlado definindo a variável de sistema global de servidor [`slave_type_conversions`].

Para obter mais informações sobre promoção e *demotion* de atributos no NDB Cluster, consulte [Replicação baseada em linha: promoção e demotion de atributos](replication-features-differing-tables.html#replication-features-attribute-promotion "Row-based replication: attribute promotion and demotion").

O `NDB`, ao contrário do [`InnoDB`] ou [`MyISAM`], não escreve alterações em colunas virtuais no *binary log*; no entanto, isso não tem efeitos prejudiciais na Replicação NDB Cluster ou na replicação entre `NDB` e outros *storage engines*. As alterações em colunas geradas armazenadas (*stored generated columns*) são registradas.