### 25.7.3 Problemas Conhecidos na Replicação de NDB Cluster

Esta seção discute problemas ou questões conhecidas ao usar a replicação com o NDB Cluster.

**Perda de conexão entre o nó SQL do cluster de origem e o nó SQL do cluster de replica.**

Uma perda de conexão pode ocorrer entre o nó SQL do cluster de origem e o nó SQL do cluster de replica, ou entre o nó SQL do cluster de origem e os nós de dados do cluster de origem. No último caso, isso pode ocorrer não apenas como resultado da perda de conexão física (por exemplo, um cabo de rede quebrado), mas devido ao esvaziamento dos buffers de eventos dos nós de dados; se o nó SQL for muito lento para responder, ele pode ser descartado pelo cluster (isso pode ser controlado até certo ponto ajustando os parâmetros de configuração `MaxBufferedEpochs` e `TimeBetweenEpochs`). Se isso ocorrer, *é totalmente possível que novos dados sejam inseridos no cluster de origem sem serem registrados no log binário do nó SQL de origem*. Por essa razão, para garantir alta disponibilidade, é extremamente importante manter um canal de replicação de backup, monitorar o canal primário e realizar a transição para o canal de replicação secundário quando necessário para manter o cluster de replica sincronizado com o de origem. O NDB Cluster não é projetado para realizar esse monitoramento por conta própria; para isso, é necessário um aplicativo externo.

O nó SQL de origem emite um evento de "lacuna" ao se conectar ou reconectar ao clúster de origem. (Um evento de lacuna é um tipo de "evento de incidente", que indica um incidente que ocorre e afeta o conteúdo do banco de dados, mas que não pode ser facilmente representado como um conjunto de alterações. Exemplos de incidentes são falhas no servidor, ressonância do banco de dados, algumas atualizações de software e algumas mudanças de hardware.) Quando a replica encontra uma lacuna no log de replicação, ela para com uma mensagem de erro. Essa mensagem está disponível na saída de `SHOW REPLICA STATUS` e indica que o thread SQL parou devido a um incidente registrado na corrente de replicação, e que uma intervenção manual é necessária. Consulte a Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”, para obter mais informações sobre o que fazer nessas circunstâncias.

Importante

Como o NDB Cluster não é projetado por si só para monitorar o status da replicação ou fornecer failover, se a alta disponibilidade é um requisito para o servidor ou clúster de replica, então você deve configurar várias linhas de replicação, monitorar o **mysqld** da linha de replicação primária e estar preparado para fazer o failover para uma linha secundária, se e quando necessário. Isso deve ser feito manualmente ou possivelmente por meio de um aplicativo de terceiros. Para obter informações sobre a implementação desse tipo de configuração, consulte a Seção 25.7.7, “Usando Dois Canais de Replicação para Replicação de NDB Cluster”, e a Seção 25.7.8, “Implementando Failover com Replicação de NDB Cluster”.

Se você está replicando de um servidor MySQL autônomo para um NDB Cluster, um canal geralmente é suficiente.

**Replicação circular.**

A replicação em anel do NDB Cluster suporta a replicação em anel, como mostrado no próximo exemplo. A configuração da replicação envolve três NDB Clusters numerados 1, 2 e 3, nos quais o Cluster 1 atua como a fonte de replicação para o Cluster 2, o Cluster 2 atua como a fonte para o Cluster 3 e o Cluster 3 atua como a fonte para o Cluster 1, completando assim o círculo. Cada NDB Cluster tem dois nós SQL, com os nós SQL A e B pertencentes ao Cluster 1, os nós SQL C e D pertencentes ao Cluster 2 e os nós SQL E e F pertencentes ao Cluster 3.

A replicação em anel usando esses clusters é suportada desde que as seguintes condições sejam atendidas:

* Os nós SQL em todos os clusters de origem e replicação sejam os mesmos.
* Todos os nós SQL que atuam como fontes e réplicas sejam iniciados com a variável de sistema `log_replica_updates` habilitada.

Esse tipo de configuração de replicação em anel é mostrado no diagrama a seguir:

**Figura 25.11 Replicação em Anel de NDB Cluster Com Todas as Fontes Como Replicação**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três clusters, cada um com dois nós. As setas conectando os nós SQL em diferentes clusters ilustram que todas as fontes também são réplicas.](images/cluster-circular-replication-1.png)

Neste cenário, o nó SQL A no Cluster 1 replica para o nó SQL C no Cluster 2; o nó SQL C replica para o nó SQL E no Cluster 3; o nó SQL E replica para o nó SQL A. Em outras palavras, a linha de replicação (indicada pelas setas curvas no diagrama) conecta diretamente todos os nós SQL usados como fontes e réplicas.

Também deve ser possível configurar a replicação em anel em que nem todos os nós SQL de origem são também réplicas, como mostrado aqui:

**Figura 25.12 Replicação em Anel de NDB Cluster Onde Nem Todas as Fontes São Replicação**

![Alguns conteúdos são descritos no texto ao redor. O diagrama mostra três aglomerados, cada um com dois nós. As setas conectando os nós SQL em diferentes aglomerados ilustram que nem todas as fontes são réplicas.](images/cluster-circular-replication-2.png)

Neste caso, diferentes nós SQL em cada aglomerado são usados como fontes e réplicas. No entanto, você *não* deve iniciar nenhum dos nós SQL com a variável de sistema `log_replica_updates` habilitada. Esse tipo de esquema de replicação circular para o NDB Cluster, no qual a linha de replicação (novamente indicada pelas setas curvas no diagrama) é descontínua, deve ser possível, mas deve-se notar que ainda não foi testado completamente e, portanto, ainda deve ser considerado experimental.

Nota

O motor de armazenamento `NDB` usa o modo de execução idempotente, que suprime erros de chave duplicada e outros erros que, de outra forma, interromperiam a replicação circular do NDB Cluster. Isso é equivalente a definir o valor global da variável de sistema `replica_exec_mode` para `IDEMPOTENT`, embora isso não seja necessário na replicação do NDB Cluster, uma vez que o NDB Cluster define essa variável automaticamente e ignora quaisquer tentativas de defini-la explicitamente.

**Replicação do NDB Cluster e chaves primárias.**

No caso de uma falha de nó, erros na replicação de tabelas `NDB` sem chaves primárias ainda podem ocorrer, devido à possibilidade de linhas duplicadas serem inseridas nesses casos. Por essa razão, é altamente recomendável que todas as tabelas `NDB` sendo replicadas tenham chaves primárias explícitas.

**Replicação do NDB Cluster e chaves únicas.**

Em versões mais antigas do NDB Cluster, operações que atualizavam valores de colunas de chave única das tabelas `NDB` podiam resultar em erros de chave duplicada durante a replicação. Esse problema é resolvido para a replicação entre tabelas `NDB` ao adiar os verificações de chave única até que todas as atualizações de linhas de tabela tenham sido realizadas.

A adição de restrições dessa maneira é atualmente suportada apenas pelo `NDB`. Assim, as atualizações de chaves únicas ao replicar de `NDB` para um motor de armazenamento diferente, como `InnoDB` ou `MyISAM`, ainda não são suportadas.

O problema encontrado ao replicar sem verificação adiada de atualizações de chaves únicas pode ser ilustrado usando uma tabela `NDB`, como `t`, criada e preenchida na fonte (e transmitida para uma replica que não suporta atualizações adiadas de chaves únicas) como mostrado aqui:

```
CREATE TABLE t (
    p INT PRIMARY KEY,
    c INT,
    UNIQUE KEY u (c)
)   ENGINE NDB;

INSERT INTO t
    VALUES (1,1), (2,2), (3,3), (4,4), (5,5);
```

A seguinte instrução `UPDATE` em `t` é bem-sucedida na fonte, pois as linhas afetadas são processadas na ordem determinada pela opção `ORDER BY`, realizada sobre toda a tabela:

```
UPDATE t SET c = c - 1 ORDER BY p;
```

A mesma instrução falha com um erro de chave duplicada ou outra violação de restrição na replica, porque a ordenação das atualizações de linhas é realizada para uma partição de cada vez, em vez de para a tabela como um todo.

Observação

Cada tabela `NDB` é implicitamente particionada por chave quando é criada. Veja a Seção 26.2.5, “Particionamento por Chave”, para mais informações.

**GTIDs não suportados.** A replicação usando IDs de transação globais não é compatível com o motor de armazenamento `NDB` e não é suportada. Habilitar GTIDs provavelmente fará com que a Replicação do NDB Cluster falhe.

**Reinicialização com --initial.**

Reiniciar o clúster com a opção `--initial` faz com que a sequência de números de GCI e época comece novamente em `0`. (Isso geralmente é verdadeiro para o NDB Cluster e não se limita a cenários de replicação envolvendo o Cluster). Os servidores MySQL envolvidos na replicação devem ser reiniciados neste caso. Depois disso, você deve usar as instruções `RESET BINARY LOGS AND GTIDS` e `RESET REPLICA` para limpar as tabelas `ndb_binlog_index` e `ndb_apply_status`, respectivamente, que são inválidas.

**Replicação de NDB para outros motores de armazenamento.** É possível replicar uma tabela `NDB` na fonte para uma tabela usando um motor de armazenamento diferente na replica, levando em consideração as restrições listadas aqui:

* A replicação de múltiplas fontes e circular não é suportada (as tabelas na fonte e na replica devem usar o motor de armazenamento `NDB` para que isso funcione).

* O uso de um motor de armazenamento que não realiza registro binário para tabelas na replica requer um tratamento especial.

* O uso de um motor de armazenamento não transacional para tabelas na replica também requer um tratamento especial.

O **mysqld** da fonte deve ser iniciado com `--ndb-log-update-as-write=0` ou `--ndb-log-update-as-write=OFF`.

Os próximos parágrafos fornecem informações adicionais sobre cada um dos problemas descritos.

**Múltiplas fontes não são suportadas ao replicar NDB para outros motores de armazenamento.** Para a replicação de `NDB` para um motor de armazenamento diferente, a relação entre as duas bases de dados deve ser um para um. Isso significa que a replicação bidirecional ou circular não é suportada entre o NDB Cluster e outros motores de armazenamento.

Além disso, não é possível configurar mais de um canal de replicação ao replicar entre `NDB` e um motor de armazenamento diferente. (Um banco de dados de NDB Cluster *pode* replicar simultaneamente para múltiplos bancos de dados NDB Cluster.) Se a fonte usa tabelas `NDB`, ainda é possível ter mais de um servidor MySQL mantendo um log binário de todas as alterações, mas para que a replica mude de fonte (fail over), a nova relação fonte-replica deve ser explicitamente definida na replica.

**Replicação de tabelas NDB para um motor de armazenamento que não realiza log binário.**

Se você tentar replicar de um NDB Cluster para uma replica que usa um motor de armazenamento que não gerencia seu próprio log binário, o processo de replicação será interrompido com o erro "Log binário não possível... A declaração não pode ser escrita atomicamente, pois há mais de um motor envolvido e pelo menos um motor está fazendo log de si mesmo (Erro 1595). É possível contornar esse problema de uma das seguintes maneiras:

* **Desative o log binário na replica.** Isso pode ser feito definindo `sql_log_bin = 0`.

* **Altere o motor de armazenamento usado para a tabela mysql.ndb_apply_status.** Fazer com que essa tabela use um motor que não gerencia seu próprio log binário também pode eliminar o conflito. Isso pode ser feito emitindo uma declaração como `ALTER TABLE mysql.ndb_apply_status ENGINE=MyISAM` na replica. É seguro fazer isso quando você está usando um motor de armazenamento diferente de `NDB` na replica, pois você não precisa se preocupar em manter múltiplas réplicas sincronizadas.

* **Filtre as alterações na tabela mysql.ndb_apply_status na replica.** Isso pode ser feito iniciando a replica com `--replicate-ignore-table=mysql.ndb_apply_status`. Se você precisar que outras tabelas sejam ignoradas pela replicação, talvez queira usar uma opção apropriada `--replicate-wild-ignore-table` em vez disso.

Importante

Você *não* deve desativar a replicação ou o registro binário da tabela `mysql.ndb_apply_status` ou alterar o motor de armazenamento usado para essa tabela ao replicar de um NDB Cluster para outro. Consulte as regras de filtragem de replicação e registro binário com replicação entre NDB Clusters para obter detalhes.

**Replicação do NDB para um motor de armazenamento não transacional.** Ao replicar do `NDB` para um motor de armazenamento não transacional, como `MyISAM`, você pode encontrar erros de chave duplicada desnecessários ao replicar declarações `INSERT ... ON DUPLICATE KEY UPDATE`. Você pode suprimir esses erros usando `--ndb-log-update-as-write=0`, que força as atualizações a serem registradas como escritas, em vez de como atualizações.

**Replicação do NDB e Criptografia do Sistema de Arquivos (TDE).** O uso de um sistema de arquivos criptografado não tem efeito na Replicação do NDB. Todos os seguintes cenários são suportados:

* Replicação de um NDB Cluster com um sistema de arquivos criptografado para um NDB Cluster cujo sistema de arquivos não está criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos não está criptografado para um NDB Cluster cujo sistema de arquivos está criptografado.

* Replicação de um NDB Cluster cujo sistema de arquivos está criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` que não estão criptografadas.

* Replicação de um NDB Cluster com um sistema de arquivos não criptografado para um servidor MySQL autônomo usando tabelas `InnoDB` com criptografia de sistema de arquivos.

**Regras de filtragem de replicação e log binário com replicação entre NDB Clusters.** Se você estiver usando alguma das opções `--replicate-do-*`, `--replicate-ignore-*`, `--binlog-do-db` ou `--binlog-ignore-db` para filtrar bancos de dados ou tabelas que estão sendo replicadas, você deve ter cuidado para não bloquear a replicação ou o registro binário do `mysql.ndb_apply_status`, que é necessário para que a replicação entre NDB Clusters funcione corretamente. Em particular, você deve ter em mente o seguinte:

1. Usar `--replicate-do-db=db_name` (e nenhuma outra opção `--replicate-do-*` ou `--replicate-ignore-*`) significa que *apenas* as tabelas no banco de dados *`db_name`* são replicadas. Neste caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que o `mysql.ndb_apply_status` seja preenchido nas réplicas.

   Usar `--binlog-do-db=db_name` (e nenhuma outra opção `--binlog-do-db`) significa que as alterações *apenas* para tabelas no banco de dados *`db_name`* são escritas no log binário. Neste caso, você também deve usar `--replicate-do-db=mysql`, `--binlog-do-db=mysql` ou `--replicate-do-table=mysql.ndb_apply_status` para garantir que o `mysql.ndb_apply_status` seja preenchido nas réplicas.

2. Usar `--replicate-ignore-db=mysql` significa que nenhuma tabela no banco de dados `mysql` é replicada. Neste caso, você também deve usar `--replicate-do-table=mysql.ndb_apply_status` para garantir que o `mysql.ndb_apply_status` seja replicado.

   Usar `--binlog-ignore-db=mysql` significa que nenhuma alteração para tabelas no banco de dados `mysql` é escrita no log binário. Neste caso, você também deve usar `--replicate-do-table=mysql.ndb_apply_status` para garantir que o `mysql.ndb_apply_status` seja replicado.

Você também deve lembrar que cada regra de replicação requer o seguinte:

1. Sua própria opção `--replicate-do-*` ou `--replicate-ignore-*`, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de replicação. Para informações sobre essas regras, consulte a Seção 19.1.6, “Opções e variáveis de registro binário e replicação”.

2. Sua própria opção `--binlog-do-db` ou `--binlog-ignore-db`, e que múltiplas regras não podem ser expressas em uma única opção de filtragem de log binário. Para informações sobre essas regras, consulte a Seção 7.4.4, “O Log Binário”.

Se você está replicando um NDB Cluster para uma replica que usa um motor de armazenamento diferente do `NDB`, as considerações dadas anteriormente podem não se aplicar, conforme discutido em outras partes desta seção.

**Replicação de NDB Cluster e IPv6.** Todos os tipos de nós do NDB Cluster suportam IPv6 no NDB 9.5; isso inclui nós de gerenciamento, nós de dados e nós de API ou SQL.

Nota

No NDB 9.5, você pode desabilitar o suporte ao IPv6 no kernel Linux se não pretender usar endereçamento IPv6 para nenhum dos nós do NDB Cluster.

**Promoção e redução de atributos.** A Replicação de NDB Cluster inclui suporte para promoção e redução de atributos. A implementação da última distingue entre conversões de tipo não-perdidas e perdidas, e seu uso na replica pode ser controlado definindo o valor global da variável de sistema `replica_type_conversions`.

Para mais informações sobre promoção e redução de atributos no NDB Cluster, consulte Replicação baseada em linhas: promoção e redução de atributos.

`NDB`, ao contrário de `InnoDB` ou `MyISAM`, não escreve alterações em colunas virtuais no log binário; no entanto, isso não tem efeitos prejudiciais na Replicação de NDB Cluster ou na replicação entre `NDB` e outros motores de armazenamento. Alterações em colunas geradas armazenadas são registradas.