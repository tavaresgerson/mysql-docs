#### 25.2.7.1 Desconexão com a Sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certas funcionalidades do MySQL geram erros quando usadas com tabelas `NDB`, conforme descrito na lista a seguir:

* **Tabelas temporárias.** Tabelas temporárias não são suportadas. Tentar criar uma tabela temporária que use o mecanismo de armazenamento `NDB` ou alterar uma tabela temporária existente para usar `NDB` falha com o erro "O mecanismo de armazenamento de tabela 'ndbcluster' não suporta a opção 'TEMPORARY'".

* **Chaves e índices nas tabelas NDB.** Chaves e índices nas tabelas do NDB Cluster estão sujeitos às seguintes limitações:

  + **Largura do colunado.** Tentativa de criar um índice em uma coluna de uma tabela `NDB` cuja largura é maior que 3072 bytes é rejeitada com `ER_TOO_LONG_KEY`: Chave especificada era muito longa; o máximo de comprimento de chave é de 3072 bytes.

    Tentativa de criar um índice em uma coluna de uma tabela `NDB` cuja largura é maior que 3056 bytes é bem-sucedida com um aviso. Nesse caso, as informações estatísticas não são geradas, o que significa que um plano de execução não ótimo pode ser selecionado. Por essa razão, você deve considerar reduzir o comprimento do índice para menos de 3056 bytes, se possível.

  + **Colunas TEXT e BLOB.** Não é possível criar índices em colunas de tabelas `NDB` que utilizam qualquer um dos tipos de dados `TEXT` ou `BLOB`.

  + **Índices FULLTEXT.** O mecanismo de armazenamento `NDB` não suporta índices `FULLTEXT`, que são possíveis apenas para tabelas `MyISAM` e `InnoDB`.

    No entanto, é possível criar índices em colunas `VARCHAR` de tabelas `NDB`.

  + **Chaves USING HASH e NULL.** Usar colunas nulos em chaves únicas e chaves primárias significa que as consultas que utilizam essas colunas são tratadas como varreduras completas da tabela. Para contornar esse problema, faça a coluna `NOT NULL` ou recrie o índice sem a opção `USING HASH`.

+ **Prefixos.** Não há índices de prefixos; apenas colunas inteiras podem ser indexadas. (O tamanho de um índice de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Veja também a Seção 25.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”, para informações adicionais.)

  + **Colunas BIT.** Uma coluna `BIT` não pode ser uma chave primária, chave única ou índice, nem pode fazer parte de uma chave primária, chave única ou índice composto.

  + **Colunas AUTO_INCREMENT.** Como outros motores de armazenamento do MySQL, o motor de armazenamento `NDB` pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem uma chave primária explícita, uma coluna `AUTO_INCREMENT` é definida automaticamente e usada como uma chave primária “oculta”. Por essa razão, você não pode criar uma tabela `NDB` com uma coluna `AUTO_INCREMENT` e sem uma chave primária explícita.

    As seguintes instruções `CREATE TABLE` não funcionam, conforme mostrado aqui:

    ```
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

    A seguinte instrução cria uma tabela com uma chave primária, uma coluna `AUTO_INCREMENT` e um índice nesta coluna, e tem sucesso:

    ```
    # Index on AUTO_INCREMENT column; table has a primary key
    mysql> CREATE TABLE n (
        ->     a INT PRIMARY KEY,
        ->     b INT AUTO_INCREMENT,
        ->     KEY k (b)
        ->     )
        -> ENGINE=NDB;
    Query OK, 0 rows affected (0.38 sec)
    ```

* **Restrições sobre chaves estrangeiras.** O suporte para restrições de chave estrangeira no NDB 9.5 é comparável ao fornecido pelo `InnoDB`, sujeito às seguintes restrições:

  + Cada coluna referenciada como chave estrangeira requer uma chave única explícita, se não for a chave primária da tabela.

  + O `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

Isso ocorre porque uma atualização de uma chave primária é implementada como uma exclusão da linha antiga (contendo a antiga chave primária) mais uma inserção da nova linha (com uma nova chave primária). Isso não é visível para o kernel `NDB`, que considera essas duas linhas como sendo a mesma, e, portanto, não tem como saber que essa atualização deve ser casca.

+ `ON DELETE CASCADE` também não é suportado quando a tabela filha contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

+ `SET DEFAULT` não é suportado. (Também não é suportado pelo `InnoDB`.

+ A palavra-chave `NO ACTION` é aceita, mas tratada como `RESTRICT`. `NO ACTION`, que é uma palavra-chave padrão do SQL, é o padrão no MySQL 9.5. (Também o mesmo que com o `InnoDB`.

+ Em versões anteriores do NDB Cluster, ao criar uma tabela com uma chave estrangeira referenciando um índice em outra tabela, às vezes parecia possível criar a chave estrangeira mesmo que a ordem das colunas nos índices não coincidisse, devido ao fato de que um erro apropriado não era sempre retornado internamente. Uma correção parcial para esse problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que essa situação ocorra no caso de o índice pai ser um índice único. (Bug #18094360)

Para mais informações, consulte a Seção 15.1.24.5, “Restrições de Chave Estrangeira” e a Seção 1.7.3.2, “Restrições de Chave Estrangeira”.

* **Tipos de dados de geometria do NDB Cluster.** Os tipos de dados de geometria (`WKT` e `WKB`) são suportados para tabelas `NDB`. No entanto, índices espaciais não são suportados.

* **Conjunto de caracteres e arquivos de log binário.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o conjunto de caracteres `latin1` (ASCII). Como os nomes dos arquivos de log binário são registrados nesta tabela, arquivos de log binário com nomes usando caracteres não latinos não são referenciados corretamente nessas tabelas. Esse é um problema conhecido, que estamos trabalhando para corrigir. (Bug #50226)

  Para contornar esse problema, use apenas caracteres latim-1 ao nomear arquivos de log binário ou ao definir qualquer uma das opções `--basedir`, `--log-bin` ou `--log-bin-index`.

* **Criando tabelas NDB com particionamento definido pelo usuário.**

  O suporte ao particionamento definido pelo usuário no NDB Cluster é restrito ao particionamento `LINEAR` de `KEY`. O uso de qualquer outro tipo de particionamento com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma declaração `CREATE TABLE` resulta em um erro.

  É possível ignorar essa restrição, mas isso não é suportado para uso em configurações de produção. Para detalhes, consulte "Particionamento definido pelo usuário e o motor de armazenamento NDB (NDB Cluster)").

  **Esquema de particionamento padrão.** Todas as tabelas do NDB Cluster são, por padrão, particionadas por `KEY` usando a chave primária da tabela como a chave de particionamento. Se nenhuma chave primária for explicitamente definida para a tabela, a chave primária "oculta" criada automaticamente pelo motor de armazenamento `NDB` é usada. Para uma discussão adicional sobre essas e questões relacionadas, consulte a Seção 26.2.5, "Particionamento de KEY".

  As declarações `CREATE TABLE` e `ALTER TABLE` que causariam uma tabela `NDBCLUSTER` particionada pelo usuário a não atender a um ou ambos dos seguintes requisitos não são permitidas e falham com um erro:

  1. A tabela deve ter uma chave primária explícita.
  2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

**Exceção.** Se uma tabela `NDBCLUSTER` particionada por usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`), então não é necessário uma chave primária explícita.

**Número máximo de particionamentos para tabelas NDBCLUSTER.** O número máximo de particionamentos que podem ser definidos para uma tabela `NDBCLUSTER` ao empregar particionamento definido pelo usuário é de 8 por grupo de nós (node group). (Consulte a Seção 25.2.2, “Nós do NDB Cluster, Grupos de Nós, Replicas de Fragmento e Partições”, para obter mais informações sobre os grupos de nós do NDB Cluster.

**DROP PARTITION não é suportado.** Não é possível excluir particionamentos de tabelas `NDB` usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de particionamento para `ALTER TABLE`—`ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION`—são suportadas para tabelas `NDB`, mas usam cópia e, portanto, não são otimizadas. Consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST” e a Seção 15.1.11, “Instrução ALTER TABLE”.

**Seleção de particionamento.** A seleção de particionamento não é suportada para tabelas `NDB`. Consulte a Seção 26.5, “Seleção de Partição”, para obter mais informações.

* **Tipo de dados JSON.** O tipo de dados `JSON` do MySQL é suportado para tabelas `NDB` no **mysqld** fornecido com o NDB 9.5.

Uma tabela `NDB` pode ter um máximo de 3 colunas `JSON`.

A API NDB não tem uma disposição especial para trabalhar com dados `JSON`, que ela vê simplesmente como dados `BLOB`. O tratamento de dados como `JSON` deve ser realizado pelo aplicativo.