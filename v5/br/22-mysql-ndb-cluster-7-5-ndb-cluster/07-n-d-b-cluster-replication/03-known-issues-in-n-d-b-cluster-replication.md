### 21.7.3 Problemas Conhecidos na Replicação em NDB Cluster

Esta seção discute problemas ou questões conhecidas ao usar a replicação com o NDB Cluster.

**Perda da conexão entre a fonte e a réplica.**

Uma perda de conexão pode ocorrer entre o nó SQL do cluster de origem e o nó SQL do cluster de replica, ou entre o nó SQL de origem e os nós de dados do cluster de origem. Neste último caso, isso pode ocorrer não apenas como resultado da perda de conexão física (por exemplo, um cabo de rede quebrado), mas devido ao excesso de buffers de eventos dos nós de dados; se o nó SQL for muito lento para responder, ele pode ser descartado pelo cluster (isso pode ser controlado até certo ponto ajustando os parâmetros de configuração `MaxBufferedEpochs` e `TimeBetweenEpochs`). Se isso ocorrer, *é totalmente possível que novos dados sejam inseridos no cluster de origem sem serem registrados no log binário do nó SQL de origem*. Por essa razão, para garantir alta disponibilidade, é extremamente importante manter um canal de replicação de backup, monitorar o canal primário e realizar a transição para o canal de replicação secundário quando necessário para manter o cluster de replica sincronizado com o de origem. O NDB Cluster não foi projetado para realizar esse monitoramento por conta própria; para isso, é necessário um aplicativo externo.

O nó SQL de origem emite um evento "lacuna" ao se conectar ou reconectar ao clúster de origem. (Um evento de lacuna é um tipo de "evento de incidente", que indica um incidente que ocorre e afeta o conteúdo do banco de dados, mas que não pode ser facilmente representado como um conjunto de alterações. Exemplos de incidentes são falhas no servidor, ressonância do banco de dados, algumas atualizações de software e algumas mudanças de hardware.) Quando a replica encontra uma lacuna no log de replicação, ela para com uma mensagem de erro. Essa mensagem está disponível na saída de `SHOW SLAVE STATUS` e indica que o fio SQL parou devido a um incidente registrado na corrente de replicação, e que uma intervenção manual é necessária. Consulte Seção 21.7.8, “Implementando Failover com Replicação de NDB Cluster” para obter mais informações sobre o que fazer nessas circunstâncias.

Importante

Como o NDB Cluster não é projetado para monitorar o status da replicação ou fornecer falha de serviço por conta própria, se a alta disponibilidade for uma exigência para o servidor ou clúster de replicação, você deve configurar várias linhas de replicação, monitorar a fonte **mysqld** na linha de replicação primária e estar preparado para fazer a transição para uma linha secundária, se e quando necessário. Isso deve ser feito manualmente ou, possivelmente, por meio de uma aplicação de terceiros. Para obter informações sobre a implementação desse tipo de configuração, consulte Seção 21.7.7, “Usando Dois Canais de Replicação para a Replicação do NDB Cluster” e Seção 21.7.8, “Implementando Falha de Serviço com a Replicação do NDB Cluster”.

Se você estiver replicando de um servidor MySQL autônomo para um NDB Cluster, um canal geralmente é suficiente.

**Replicação circular.**

A replicação em cluster do NDB suporta a replicação circular, como mostrado no próximo exemplo. A configuração da replicação envolve três clusters NDB numerados 1, 2 e 3, nos quais o cluster 1 atua como a fonte de replicação para o cluster 2, o cluster 2 atua como a fonte para o cluster 3 e o cluster 3 atua como a fonte para o cluster 1, completando assim o círculo. Cada cluster NDB tem dois nós SQL, com os nós SQL A e B pertencentes ao cluster 1, os nós SQL C e D pertencentes ao cluster 2 e os nós SQL E e F pertencentes ao cluster 3.

A replicação circular usando esses clusters é suportada desde que as seguintes condições sejam atendidas:

- Os nós SQL em todos os clusters de origem e replicação são os mesmos.
- Todos os nós SQL que atuam como fontes e réplicas são iniciados com a variável de sistema [`log_slave_updates`](https://pt.wikipedia.org/wiki/Replicação#Op%C3%A7%C3%B5es_bin%C3%A1rias_de_log) habilitada.

Esse tipo de configuração de replicação circular é mostrado no diagrama a seguir:

**Figura 21.13 Replicação Circular de Clusters NDB com Todas as Fontes como Replicas**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três aglomerados, cada um com dois nós. As setas que conectam os nós SQL em diferentes aglomerados ilustram que todas as fontes também são réplicas.](images/cluster-circular-replication-1.png)

Nesse cenário, o nó SQL A do Cluster 1 replica para o nó SQL C do Cluster 2; o nó SQL C replica para o nó SQL E do Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas.

Também deve ser possível configurar a replicação circular, na qual nem todos os nós de SQL de origem são também réplicas, como mostrado aqui:

**Figura 21.14 Replicação Circular de Clusters NDB Onde Nem Todas as Fontes São Replicas**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três aglomerados, cada um com dois nós. As setas que conectam os nós SQL em diferentes aglomerados ilustram que nem todas as fontes são réplicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada clúster são usados como fontes e réplicas. No entanto, você *não* deve iniciar nenhum dos nós SQL com a variável de sistema `log_slave_updates` habilitada. Esse tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi testado completamente e, portanto, ainda deve ser considerado experimental.

Nota

O mecanismo de armazenamento `NDB` usa o modo de execução idempotente, que suprime erros de chave duplicada e outros erros que, de outra forma, interromperiam a replicação circular do NDB Cluster. Isso é equivalente a definir a variável de sistema global `slave_exec_mode` para `IDEMPOTENT`, embora isso não seja necessário na replicação do NDB Cluster, uma vez que o NDB Cluster define essa variável automaticamente e ignora quaisquer tentativas de defini-la explicitamente.

**Replicação do cluster do NDB e chaves primárias.**

Em caso de falha de um nó, ainda podem ocorrer erros na replicação de tabelas de `NDB` sem chaves primárias, devido à possibilidade de duplicatas serem inseridas nesses casos. Por essa razão, é altamente recomendável que todas as tabelas de `NDB` que estão sendo replicadas tenham chaves primárias explícitas.

**Replicação em cluster do NDB e chaves únicas.**

Em versões mais antigas do NDB Cluster, operações que atualizavam valores de colunas de chave única das tabelas de `NDB` podiam resultar em erros de chave duplicada durante a replicação. Esse problema é resolvido para a replicação entre as tabelas de `NDB` ao adiar as verificações de chave única até que todas as atualizações das linhas da tabela tenham sido realizadas.

A adição de restrições dessa maneira é atualmente suportada apenas pelo `NDB`. Portanto, as atualizações de chaves únicas ao replicar do `NDB` para um motor de armazenamento diferente, como `InnoDB` ou `MyISAM`, ainda não são suportadas.

O problema encontrado ao replicar sem verificação diferida de atualizações de chave única pode ser ilustrado usando uma tabela `NDB` como `t`, que é criada e preenchida na fonte (e transmitida para uma réplica que não suporta atualizações de chave única diferidas), conforme mostrado aqui:

```sql
CREATE TABLE t (
    p INT PRIMARY KEY,
    c INT,
    UNIQUE KEY u (c)
)   ENGINE NDB;

INSERT INTO t
    VALUES (1,1), (2,2), (3,3), (4,4), (5,5);
```

A seguinte declaração `UPDATE` em `t` é bem-sucedida na fonte, pois as linhas afetadas são processadas na ordem determinada pela opção `ORDER BY`, realizada em toda a tabela:

```sql
UPDATE t SET c = c - 1 ORDER BY p;
```

A mesma declaração falha com um erro de chave duplicada ou outra violação de restrição na replica, porque a ordenação das atualizações da linha é realizada uma vez por partição, em vez de para a tabela como um todo.

Nota

Cada tabela `NDB` é implicitamente particionada por chave quando é criada. Consulte Seção 22.2.5, “Particionamento por Chave” para obter mais informações.

**GTIDs não são suportados.** A replicação usando IDs de transação global não é compatível com o mecanismo de armazenamento `NDB` e não é suportada. A ativação de GTIDs provavelmente fará com que a replicação do NDB Cluster falhe.

**Replicação multithreading não é suportada.** O NDB Cluster não suporta replicações multithreading. Isso ocorre porque a replica pode não ser capaz de separar transações que ocorrem em um banco de dados de outras que ocorrem em outro se forem escritas dentro da mesma época. Além disso, cada transação gerenciada pelo motor de armazenamento `NDB` envolve pelo menos dois bancos de dados — o banco de dados de destino e o banco de dados do sistema `mysql` — devido à necessidade de atualizar a tabela `mysql.ndb_apply_status` (veja Seção 21.7.4, “Esquema e tabelas de replicação do NDB Cluster”). Isso, por sua vez, quebra o requisito de multithreading de que a transação é específica de um determinado banco de dados.

Antes das versões 7.5.7 e 7.6.3 do NDB, a definição de quaisquer variáveis de sistema relacionadas a escravos multithreads, como `slave_parallel_workers` e `slave_checkpoint_group` (ou as opções de inicialização equivalentes do **mysqld**, não era considerada e não tinha efeito.

A partir do NDB 7.5.7 e do NDB 7.6.3, o `slave_parallel_workers` é sempre 0. Se for definido para qualquer outro valor durante o início, o `NDB` altera para 0 e escreve uma mensagem no arquivo de log do servidor do **mysqld**.

Reinicie com --initial.

Reiniciar o clúster com a opção `--initial` faz com que a sequência de números de GCI e época comece novamente em `0`. (Isso geralmente é verdadeiro para o NDB Cluster e não está limitado a cenários de replicação envolvendo o Cluster.) Os servidores MySQL envolvidos na replicação devem ser reiniciados neste caso. Depois disso, você deve usar as instruções `RESET MASTER` e `RESET SLAVE` para limpar as tabelas `ndb_binlog_index` e `ndb_apply_status`, respectivamente, que são inválidas.

**Replicação de NDB para outros motores de armazenamento.** É possível replicar uma tabela de `NDB` na fonte para uma tabela usando um motor de armazenamento diferente na replica, levando em consideração as restrições listadas aqui:

- A replicação circular e a replicação de múltiplas fontes não são suportadas (as tabelas tanto na fonte quanto na replica devem usar o mecanismo de armazenamento `NDB` para que isso funcione).

- O uso de um mecanismo de armazenamento que não realiza registro binário para tabelas na replica requer um tratamento especial.

- O uso de um mecanismo de armazenamento não transacional para tabelas na replica também requer um tratamento especial.

- A fonte **mysqld** deve ser iniciada com `--ndb-log-update-as-write=0` (mysql-cluster-options-variables.html#option\_mysqld\_ndb-log-update-as-write) ou `--ndb-log-update-as-write=OFF`.

Os próximos parágrafos fornecem informações adicionais sobre cada um dos problemas descritos acima.

**Múltiplas fontes não são suportadas ao replicar NDB para outros motores de armazenamento.** Para a replicação de `NDB` para um motor de armazenamento diferente, a relação entre as duas bases de dados deve ser de um para um. Isso significa que a replicação bidirecional ou circular não é suportada entre o NDB Cluster e outros motores de armazenamento.

Além disso, não é possível configurar mais de um canal de replicação ao replicar entre `NDB` e um motor de armazenamento diferente. (Um banco de dados do NDB Cluster *pode* replicar simultaneamente para múltiplos bancos de dados do NDB Cluster.) Se a fonte usa tabelas do `NDB`, ainda é possível ter mais de um servidor MySQL mantendo um log binário de todas as alterações, mas para que a replica mude de fonte (fail over), a nova relação fonte-replica deve ser explicitamente definida na replica.

**Replicar tabelas NDB para um mecanismo de armazenamento que não realiza registro binário.**

Se você tentar replicar de um NDB Cluster para uma replica que usa um motor de armazenamento que não gerencia seu próprio registro binário, o processo de replicação será interrompido com o erro "Registro binário não possível... A declaração não pode ser escrita atomicamente, pois mais de um motor está envolvido e pelo menos um motor está fazendo registro próprio (Erro 1595). É possível contornar esse problema de uma das seguintes maneiras:

- **Desative o registro binário na replica.** Isso pode ser feito configurando `sql_log_bin = 0`.

- **Altere o motor de armazenamento usado para a tabela mysql.ndb\_apply\_status.** Fazer com que essa tabela use um motor que não gerencie seu próprio registro binário também pode eliminar o conflito. Isso pode ser feito emitindo uma instrução como `ALTER TABLE mysql.ndb_apply_status ENGINE=MyISAM` na replica. É seguro fazer isso ao usar um motor de armazenamento diferente de `NDB` na replica, pois você não precisa se preocupar em manter múltiplas réplicas sincronizadas.

- **Filtre as alterações na tabela mysql.ndb\_apply\_status na replica.** Isso pode ser feito iniciando a replica com `--replicate-ignore-table=mysql.ndb_apply_status`. Se você precisar que outras tabelas sejam ignoradas pela replicação, talvez queira usar uma opção apropriada `--replicate-wild-ignore-table` em vez disso.

Importante

Você *não* deve desativar a replicação ou o registro binário de `mysql.ndb_apply_status` ou alterar o mecanismo de armazenamento usado para esta tabela ao replicar de um NDB Cluster para outro. Consulte Regras de filtragem de replicação e log binário com replicação entre NDB Clusters para obter detalhes.

**Replicação do NDB para um motor de armazenamento não transacional.** Ao replicar do `NDB` para um motor de armazenamento não transacional, como `MyISAM`, você pode encontrar erros de chave duplicada desnecessários ao replicar instruções de `INSERT ... ON DUPLICATE KEY UPDATE` (`insert-on-duplicate.html`). Você pode suprimir esses erros usando `--ndb-log-update-as-write=0` (`mysql-cluster-options-variables.html#option_mysqld_ndb-log-update-as-write`), que força as atualizações a serem registradas como escritas, em vez de como atualizações.

**Regras de filtragem de replicação e log binário com replicação entre NDB Clusters.** Se você estiver usando qualquer uma das opções `--replicate-do-*`, `--replicate-ignore-*`, `--binlog-do-db` ou `--binlog-ignore-db` para filtrar bancos de dados ou tabelas que estão sendo replicados, você deve ter cuidado para não bloquear a replicação ou o registro binário do `mysql.ndb_apply_status`, que é necessário para que a replicação entre NDB Clusters funcione corretamente. Em particular, você deve ter em mente o seguinte:

1. Usar `--replicate-do-db=db_name` (e nenhuma outra opção `--replicate-do-*` ou `--replicate-ignore-*`) significa que *apenas* as tabelas no banco de dados *`db_name`* são replicadas. Nesse caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja preenchido nas réplicas.

   Usar `--binlog-do-db=db_name` (e nenhuma outra opção `--binlog-do-db`) significa que as alterações *apenas* nas tabelas do banco de dados *`db_name`* são escritas no log binário. Nesse caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que `mysql.ndb_apply_status` seja preenchido nas réplicas.

2. Usar [`--replicate-ignore-db=mysql`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%A3o_mysql_replicate-ignore-db) significa que nenhuma tabela no banco de dados `mysql` é replicada. Nesse caso, você também deve usar [`--replicate-do-table=mysql.ndb_apply_status`](https://pt.wikipedia.org/wiki/Replicação_de_dados#Op%C3%A7%C3%A3o_mysql_replicate-do-table) para garantir que `mysql.ndb_apply_status` seja replicada.

   Usar [`--binlog-ignore-db=mysql`](https://pt.wikipedia.org/wiki/Replicação_de_logs_binários#Op%C3%A7%C3%A3o_mysqld_binlog-ignore-db) significa que nenhuma alteração nas tabelas do banco de dados `mysql` será escrita no log binário. Nesse caso, você também deve usar [`--replicate-do-table=mysql.ndb_apply_status`](https://pt.wikipedia.org/wiki/Replicação_de_logs_binários#Op%C3%A7%C3%A3o_mysqld_replicate-do-table) para garantir que o `mysql.ndb_apply_status` seja replicado.

Você também deve lembrar que cada regra de replicação requer o seguinte:

1. Sua própria opção `--replicate-do-*` ou `--replicate-ignore-*`, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de replicação. Para obter informações sobre essas regras, consulte Seção 16.1.6, “Opções e variáveis de replicação e registro binário”.

2. A opção `--binlog-do-db` (replicação-opções-binary-log.html#option\_mysqld\_binlog-do-db) ou `--binlog-ignore-db` (replicação-opções-binary-log.html#option\_mysqld\_binlog-ignore-db) do próprio MySQL, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de log binário. Para obter informações sobre essas regras, consulte Seção 5.4.4, “O Log Binário”.

Se você estiver replicando um NDB Cluster para uma replica que usa um motor de armazenamento diferente de `NDB`, as considerações mencionadas anteriormente podem não se aplicar, conforme discutido em outras partes desta seção.

**Replicação em Nuvem NDB e IPv6.** Embora a API NDB e a API MGM (e, portanto, os nós de dados e os nós de gerenciamento) não suportem IPv6 no NDB 7.5 e 7.6, os Servidores MySQL—incluindo aqueles que atuam como nós SQL em um NDB Cluster—podem usar IPv6 para se conectar a outros Servidores MySQL. Isso significa que você pode replicar entre NDB Clusters usando IPv6 para conectar os nós SQL de origem e replicação, conforme mostrado pela seta pontilhada no diagrama a seguir:

**Figura 21.15 Replicação entre nós SQL conectados usando IPv6**

![A maioria do conteúdo é descrita no texto ao redor. A linha pontilhada que representa uma conexão IPv6 de MySQL para MySQL está entre dois nós, um de cada cluster de origem e replica. Todas as conexões dentro do cluster, como de nó de dados para nó de dados ou de nó de dados para nó de gerenciamento, são conectadas com linhas sólidas para indicar conexões IPv4 apenas.](images/cluster-replication-ipv6.png)

Todas as conexões que tenham origem *dentro* do NDB Cluster — representadas no diagrama anterior por setas sólidas — devem usar IPv4. Em outras palavras, todos os nós de dados do NDB Cluster, servidores de gerenciamento e clientes de gerenciamento devem ser acessíveis uns aos outros usando IPv4. Além disso, os nós SQL devem usar IPv4 para se comunicar com o cluster.

Como atualmente não há suporte nas APIs NDB e MGM para IPv6, quaisquer aplicativos escritos usando essas APIs também devem fazer todas as conexões usando IPv4.

**Promoção e redução de atributos.** A Replicação de NDB Cluster inclui suporte para promoção e redução de atributos. A implementação da última opção diferencia as conversões de tipos com perda e sem perda, e seu uso na replica pode ser controlado definindo a variável de sistema global `slave_type_conversions`.

Para obter mais informações sobre promoção e redução de atributos no NDB Cluster, consulte Replicação baseada em linhas: promoção e redução de atributos.

Ao contrário de `InnoDB` ou `MyISAM`, o `NDB` não escreve alterações em colunas virtuais no log binário; no entanto, isso não tem efeitos prejudiciais na Replicação em NDB Cluster ou na replicação entre o `NDB` e outros motores de armazenamento. As alterações em colunas geradas armazenadas são registradas.
