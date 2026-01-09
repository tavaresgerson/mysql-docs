#### 21.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certas funcionalidades do MySQL produzem erros quando usadas com tabelas de `NDB`, conforme descrito na lista a seguir:

- **Tabelas temporárias.** As tabelas temporárias não são suportadas. Tentar criar uma tabela temporária que use o mecanismo de armazenamento `NDB` ou alterar uma tabela temporária existente para usar `NDB` falha com o erro: "O mecanismo de armazenamento de tabela 'ndbcluster' não suporta a opção 'TEMPORARY'."

- **Índices e chaves em tabelas NDB.** As chaves e índices em tabelas de NDB Cluster estão sujeitos às seguintes limitações:

  - **Largura da coluna.** Tentando criar um índice em uma coluna de tabela `NDB` cuja largura é maior que 3072 bytes é rejeitado com `ER_TOO_LONG_KEY`: A chave especificada foi muito longa; o comprimento máximo da chave é de 3072 bytes.

    Tentar criar um índice em uma coluna de tabela `NDB` cuja largura é maior que 3056 bytes tem sucesso com um aviso. Nesse caso, as informações estatísticas não são geradas, o que significa que um plano de execução não ótimo pode ser selecionado. Por essa razão, você deve considerar reduzir o comprimento do índice para menos de 3056 bytes, se possível.

  - Colunas **TEXT** e **BLOB**. Você não pode criar índices nas colunas da tabela `NDB` que utilizam qualquer um dos tipos de dados `TEXT` ou `BLOB`.

  - **Índices FULLTEXT.** O mecanismo de armazenamento `NDB` não suporta índices `FULLTEXT`, que são possíveis apenas para tabelas `[MyISAM`]\(myisam-storage-engine.html) e `[InnoDB`]\(innodb-storage-engine.html).

    No entanto, você pode criar índices em colunas de tipo `VARCHAR` de tabelas de tipo `NDB`.

  - **USANDO chaves HASH e NULL.** Usar colunas anuláveis em chaves únicas e chaves primárias significa que as consultas que usam essas colunas são tratadas como varreduras completas da tabela. Para contornar esse problema, faça a coluna ficar `NOT NULL` ou recrie o índice sem a opção `USING HASH`.

  - **Prefixos.** Não há índices de prefixo; apenas colunas inteiras podem ser indexadas. (O tamanho de um índice de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Consulte também Seção 21.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”, para obter informações adicionais.)

  - Colunas `BIT`. Uma coluna `BIT` (tipo bit) não pode ser uma chave primária, chave única ou índice, nem pode fazer parte de uma chave primária, chave única ou índice compostos.

  - **Colunas AUTO_INCREMENT.** Como outros motores de armazenamento do MySQL, o motor de armazenamento `NDB` pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem uma chave primária explícita, uma coluna `AUTO_INCREMENT` é definida automaticamente e usada como uma chave primária “oculta”. Por essa razão, você não pode criar uma tabela `NDB` com uma coluna `AUTO_INCREMENT` e sem uma chave primária explícita.

    As seguintes instruções `CREATE TABLE` não funcionam, conforme mostrado aqui:

    ```sql
    # No index on AUTO_INCREMENT column; table has no primary key
    # Raises ER_WRONG_AUTO_KEY
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT
        ->     )
        -> ENGINE=NDB;
    ERROR 1075 (42000): Incorrect table definition; there can be only one auto
    column and it must be defined as a key

    # Index on AUTO_INCREMENT column; table has no primary key
    # Raises NDB error 4335
    mysql> CREATE TABLE n (
        ->     a INT,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    ERROR 1296 (HY000): Got error 4335 'Only one autoincrement column allowed per
    table. Having a table without primary key uses an autoincr' from NDBCLUSTER
    ```

    A seguinte declaração cria uma tabela com uma chave primária, uma coluna `AUTO_INCREMENT` e um índice nesta coluna, e tem sucesso:

    ```sql
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

- **Restrições para chaves estrangeiras.** O suporte para restrições de chaves estrangeiras no NDB 7.5 é comparável ao fornecido pelo `InnoDB`, sujeito às seguintes restrições:

  - Cada coluna referenciada como chave estrangeira deve ter uma chave única explícita, se não for a chave primária da tabela.

  - `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

    Isso ocorre porque uma atualização de uma chave primária é implementada como uma exclusão da linha antiga (que contém a antiga chave primária) mais uma inserção da nova linha (com uma nova chave primária). Isso não é visível para o kernel `NDB`, que considera essas duas linhas como sendo a mesma, e, portanto, não tem como saber que essa atualização deve ser cascada.

  - A partir da NDB 7.5.14 e da NDB 7.6.10: `ON DELETE CASCADE` não é suportado quando a tabela filha contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

  - `SET DEFAULT` não é suportado. (Também não é suportado pelo `InnoDB`.)

  - As palavras-chave `NO ACTION` são aceitas, mas tratadas como `RESTRICT`. (Também o mesmo que com `InnoDB`.

  - Em versões anteriores do NDB Cluster, ao criar uma tabela com uma chave estrangeira que faz referência a um índice em outra tabela, às vezes parecia possível criar a chave estrangeira mesmo que a ordem das colunas nos índices não coincidisse, devido ao fato de que um erro apropriado não sempre fosse retornado internamente. Uma correção parcial para esse problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que essa situação ocorra caso o índice pai seja um índice único. (Bug #18094360)

  - Antes da versão 7.5.6 do NDB, ao adicionar ou remover uma chave estrangeira usando `ALTER TABLE`, os metadados da tabela pai não são atualizados, o que permite que, posteriormente, sejam executadas instruções `ALTER TABLE` na tabela pai que deveriam ser inválidas. Para contornar esse problema, execute `SHOW CREATE TABLE` na tabela pai imediatamente após adicionar ou remover a chave estrangeira; isso força a recarga dos metadados do pai.

    Este problema foi corrigido no NDB 7.5.6. (Bug #82989, Bug #24666177)

  Para obter mais informações, consulte Seção 13.1.18.5, “Restrições de Chave Estrangeira” e Seção 1.6.3.2, “Restrições de Chave Estrangeira”.

- **Tipos de dados de clúster e geometria do NDB.** Os tipos de dados de geometria (`WKT` e `WKB`) são suportados para as tabelas do `NDB`. No entanto, os índices espaciais não são suportados.

- **Conjunto de caracteres e arquivos de log binário.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o conjunto de caracteres `latin1` (ASCII). Como os nomes dos arquivos de log binário são registrados nesta tabela, os arquivos de log binário com nomes que usam caracteres não latinos não são referenciados corretamente nessas tabelas. Esse é um problema conhecido, e estamos trabalhando para corrigi-lo. (Bug #50226)

  Para resolver esse problema, use apenas caracteres latim-1 ao nomear arquivos de log binários ou ao definir as opções `--basedir`, `--log-bin` ou `--log-bin-index`.

- **Criando tabelas NDB com particionamento definido pelo usuário.**

  O suporte para partição definida pelo usuário no NDB Cluster é restrito à partição `LINEAR` de `KEY`. O uso de qualquer outro tipo de partição com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma instrução `CREATE TABLE` resulta em um erro.

  É possível ignorar essa restrição, mas isso não é suportado para uso em configurações de produção. Para obter detalhes, consulte Partição definida pelo usuário e o motor de armazenamento NDB (NDB Cluster).

  **Esquema de particionamento padrão.** Todas as tabelas do NDB Cluster são, por padrão, particionadas por `KEY` usando a chave primária da tabela como chave de particionamento. Se nenhuma chave primária for explicitamente definida para a tabela, a chave primária “oculta” criada automaticamente pelo mecanismo de armazenamento `NDB` é usada. Para uma discussão adicional sobre essas e questões relacionadas, consulte Seção 22.2.5, “Particionamento por KEY”.

  As instruções `CREATE TABLE` e `ALTER TABLE` que causariam uma tabela `NDBCLUSTER` particionada pelo usuário a não atender a um ou ambos dos dois requisitos a seguir não são permitidas e falharão com um erro:

  1. A tabela deve ter uma chave primária explícita.
  2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

  **Exceção.** Se uma tabela `[NDBCLUSTER]` (mysql-cluster.html) com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`), então não é necessário uma chave primária explícita.

  **Número máximo de partições para tabelas NDBCLUSTER.** O número máximo de partições que podem ser definidas para uma tabela `NDBCLUSTER` ao empregar a partição definida pelo usuário é de 8 por grupo de nós. (Para mais informações sobre os grupos de nós do NDB Cluster, consulte Seção 21.2.2, “Grupos de nós, nós, réplicas de fragmentação e partições do NDB Cluster”.

  **DROP PARTITION não é suportado.** Não é possível excluir partições de tabelas de `NDB` usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de particionamento para `ALTER TABLE` — `ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION` — são suportadas para tabelas NDB, mas usam cópia e, portanto, não são otimizadas. Veja Seção 22.3.1, “Gestão de Partições RANGE e LIST” e Seção 13.1.8, “Instrução ALTER TABLE”.

  **Seleção de partições.** A seleção de partições não é suportada para tabelas `NDB`. Consulte Seção 22.5, “Seleção de Partições” para obter mais informações.

- **Tipo de dados JSON.** O tipo de dados MySQL `JSON` é suportado para tabelas `NDB` no **mysqld** fornecido com o NDB 7.5.2 e versões posteriores.

  Uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

  A API do NDB não tem uma disposição especial para trabalhar com dados `JSON`, que ela considera simplesmente dados `BLOB`. O tratamento dos dados como `JSON` deve ser feito pelo aplicativo.

- **Tabelas de informações de CPU e threads ndbinfo.** O NDB 7.5.2 adiciona várias novas tabelas ao banco de dados de informações `ndbinfo`, fornecendo informações sobre a atividade da CPU e das threads por nó, ID de thread e tipo de thread. As tabelas estão listadas aqui:

  - `cpustat`: Fornece estatísticas de CPU por segundo e por thread

  - `cpustat_50ms`: Dados brutos de estatísticas de CPU por fio, coletados a cada 50 ms

  - `cpustat_1sec`: Dados brutos de estatísticas de CPU por fio, coletados a cada segundo

  - `cpustat_20sec`: Dados brutos de estatísticas de CPU por fio, coletados a cada 20 segundos

  - `threads`: Nomes e descrições dos tipos de threads

  Para obter mais informações sobre essas tabelas, consulte Seção 21.6.15, “ndbinfo: A Base de Dados de Informações do NDB Cluster”.

- **Bloquear as tabelas ndbinfo.** O NDB 7.5.3 adiciona novas tabelas ao banco de dados de informações `ndbinfo`, fornecendo informações sobre bloqueios e tentativas de bloqueio em um NDB Cluster em execução. Essas tabelas estão listadas aqui:

  - `cluster_locks`: Solicitações de bloqueio atuais que estão aguardando ou mantendo bloqueios; essa informação pode ser útil ao investigar travamentos e deadlocks. Análogo a `cluster_operations`.

  - `locks_per_fragment`: Contagem de solicitações de bloqueio e seus resultados por fragmento, bem como o tempo total gasto esperando por bloqueios com sucesso e sem sucesso. Análogo a `operations_per_fragment` e `memory_per_fragment`.

  - `server_locks`: Subconjunto de transações de cluster — aquelas que estão em execução no **mysqld** local, mostrando um ID de conexão por transação. Análogo a `server_operations`.
