#### 25.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster

Algumas instruções SQL relacionadas a certas funcionalidades do MySQL produzem erros quando usadas com tabelas `NDB`, conforme descrito na lista a seguir:

- **Tabelas temporárias.** As tabelas temporárias não são suportadas. Tentar criar uma tabela temporária que use o mecanismo de armazenamento `NDB` ou alterar uma tabela temporária existente para usar `NDB` falha com o erro: "O mecanismo de armazenamento de tabela 'ndbcluster' não suporta a opção 'TEMPORARY'."

- **Índices e chaves em tabelas NDB.** As chaves e índices em tabelas de NDB Cluster estão sujeitos às seguintes limitações:

  - **Largura da coluna.** Tentando criar um índice em uma coluna de tabela `NDB` cuja largura é maior que 3072 bytes, é rejeitado com `ER_TOO_LONG_KEY`: A chave especificada era muito longa; o comprimento máximo da chave é de 3072 bytes.

    Tentar criar um índice em uma coluna de tabela `NDB` cujo comprimento é maior que 3056 bytes tem sucesso com um aviso. Nesse caso, as informações estatísticas não são geradas, o que significa que um plano de execução não ótimo pode ser selecionado. Por essa razão, você deve considerar reduzir o comprimento do índice para menos de 3056 bytes, se possível.

  - Colunas **TEXT e BLOB**. Você não pode criar índices nas colunas da tabela `NDB` que utilizam qualquer um dos tipos de dados `TEXT` ou `BLOB`.

  - **Índices FULLTEXT.** O mecanismo de armazenamento `NDB` não suporta índices `FULLTEXT`, que são possíveis apenas para as tabelas `MyISAM` e `InnoDB`.

    No entanto, você pode criar índices nas colunas `VARCHAR` das tabelas `NDB`.

  - **USANDO chaves HASH e NULL.** Usar colunas anuláveis em chaves únicas e chaves primárias significa que as consultas que usam essas colunas são tratadas como varreduras completas da tabela. Para contornar esse problema, faça com que a coluna `NOT NULL` seja usada, ou recrie o índice sem a opção `USING HASH`.

  - **Prefixos.** Não há índices de prefixo; apenas colunas inteiras podem ser indexadas. (O tamanho de um índice de coluna `NDB` é sempre o mesmo que a largura da coluna em bytes, até e incluindo 3072 bytes, conforme descrito anteriormente nesta seção. Consulte também a Seção 25.2.7.6, “Recursos não suportados ou ausentes no NDB Cluster”, para obter informações adicionais.)

  - Colunas BIT. Uma coluna `BIT` não pode ser uma chave primária, chave única ou índice, nem pode fazer parte de uma chave primária, chave única ou índice composto.

  - Colunas **AUTO\_INCREMENT.** Como outros motores de armazenamento do MySQL, o motor de armazenamento `NDB` pode lidar com no máximo uma coluna `AUTO_INCREMENT` por tabela, e essa coluna deve ser indexada. No entanto, no caso de uma tabela NDB sem uma chave primária explícita, uma coluna `AUTO_INCREMENT` é definida automaticamente e usada como uma chave primária “oculta”. Por essa razão, você não pode criar uma tabela `NDB` com uma coluna `AUTO_INCREMENT` e sem uma chave primária explícita.

    As seguintes declarações `CREATE TABLE` não funcionam, conforme mostrado aqui:

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

    A seguinte declaração cria uma tabela com uma chave primária, uma coluna `AUTO_INCREMENT` e um índice nesta coluna, e tem sucesso:

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

- **Restrições para chaves estrangeiras.** O suporte para restrições de chaves estrangeiras no NDB 8.0 é comparável ao fornecido pelo `InnoDB`, sujeito às seguintes restrições:

  - Cada coluna referenciada como chave estrangeira deve ter uma chave única explícita, se não for a chave primária da tabela.

  - `ON UPDATE CASCADE` não é suportado quando a referência é à chave primária da tabela pai.

    Isso ocorre porque uma atualização de uma chave primária é implementada como uma exclusão da linha antiga (que contém a antiga chave primária) mais uma inserção da nova linha (com uma nova chave primária). Isso não é visível para o kernel `NDB`, que considera essas duas linhas como sendo a mesma, e, portanto, não tem como saber que essa atualização deve ser cascada.

  - `ON DELETE CASCADE` também não é suportado quando a tabela secundária contém uma ou mais colunas de qualquer um dos tipos `TEXT` ou `BLOB`. (Bug #89511, Bug #27484882)

  - `SET DEFAULT` não é suportado. (Também não é suportado por `InnoDB`.)

  - A palavra-chave `NO ACTION` é aceita, mas tratada como `RESTRICT`. `NO ACTION`, que é uma palavra-chave padrão do SQL, é o padrão no MySQL 8.0. (Também o mesmo que com `InnoDB`.).

  - Em versões anteriores do NDB Cluster, ao criar uma tabela com uma chave estrangeira que faz referência a um índice em outra tabela, às vezes parecia possível criar a chave estrangeira mesmo que a ordem das colunas nos índices não coincidisse, devido ao fato de que um erro apropriado não sempre fosse retornado internamente. Uma correção parcial para esse problema melhorou o erro usado internamente para funcionar na maioria dos casos; no entanto, ainda é possível que essa situação ocorra caso o índice pai seja um índice único. (Bug #18094360)

  Para obter mais informações, consulte a Seção 15.1.20.5, “Restrições de Chave Estrangeira”, e a Seção 1.6.3.2, “Restrições de Chave Estrangeira”.

- **Tipos de dados de clúster e geometria do NDB.** Os tipos de dados de geometria (`WKT` e `WKB`) são suportados para tabelas `NDB`. No entanto, os índices espaciais não são suportados.

- **Conjunto de caracteres e arquivos de log binário.** Atualmente, as tabelas `ndb_apply_status` e `ndb_binlog_index` são criadas usando o conjunto de caracteres `latin1` (ASCII). Como os nomes dos arquivos de log binário são registrados nesta tabela, os arquivos de log binário com nomes que usam caracteres não latinos não são referenciados corretamente nessas tabelas. Esse é um problema conhecido, e estamos trabalhando para corrigi-lo. (Bug #50226)

  Para resolver esse problema, use apenas caracteres latim-1 ao nomear arquivos de log binários ou ao definir as opções `--basedir`, `--log-bin` ou `--log-bin-index`.

- **Criando tabelas NDB com particionamento definido pelo usuário.**

  O suporte para partição definida pelo usuário no NDB Cluster é restrito à partição \[`LINEAR`] `KEY`. O uso de qualquer outro tipo de partição com `ENGINE=NDB` ou `ENGINE=NDBCLUSTER` em uma declaração `CREATE TABLE` resulta em um erro.

  É possível ignorar essa restrição, mas isso não é suportado para uso em configurações de produção. Para obter detalhes, consulte "Partição definida pelo usuário e o motor de armazenamento NDB (NDB Cluster)").

  **Esquema de particionamento padrão.** Todas as tabelas do NDB Cluster são, por padrão, particionadas por `KEY` usando a chave primária da tabela como chave de particionamento. Se nenhuma chave primária for explicitamente definida para a tabela, a chave primária “oculta” criada automaticamente pelo motor de armazenamento `NDB` é usada. Para uma discussão adicional sobre essas e questões relacionadas, consulte a Seção 26.2.5, “Particionamento por Chave”.

  As declarações `CREATE TABLE` e `ALTER TABLE` que causariam uma tabela `NDBCLUSTER` particionada pelo usuário a não atender a um ou ambos dos dois requisitos a seguir não são permitidas e falharão com um erro:

  1. A tabela deve ter uma chave primária explícita.
  2. Todas as colunas listadas na expressão de particionamento da tabela devem fazer parte da chave primária.

  **Exceção.** Se uma tabela `NDBCLUSTER` com partição de usuário for criada usando uma lista de colunas vazia (ou seja, usando `PARTITION BY [LINEAR] KEY()`), então não é necessário uma chave primária explícita.

  **Número máximo de partições para tabelas NDBCLUSTER.** O número máximo de partições que podem ser definidas para uma tabela `NDBCLUSTER` ao empregar a partição definida pelo usuário é de 8 por grupo de nós. (Consulte a Seção 25.2.2, “Nodos do NDB Cluster, Grupos de Nós, Replicas de Fragmento e Partições”, para obter mais informações sobre os grupos de nós do NDB Cluster.

  **DROP PARTITION não é suportado.** Não é possível excluir partições das tabelas `NDB` usando `ALTER TABLE ... DROP PARTITION`. As outras extensões de particionamento para `ALTER TABLE`—`ADD PARTITION`, `REORGANIZE PARTITION` e `COALESCE PARTITION`—são suportadas para tabelas NDB, mas usam cópia e, portanto, não são otimizadas. Veja a Seção 26.3.1, “Gestão de Partições RANGE e LIST” e a Seção 15.1.9, “Instrução ALTER TABLE”.

  **Seleção de partição.** A seleção de partição não é suportada para tabelas `NDB`. Consulte a Seção 26.5, “Seleção de Partição”, para obter mais informações.

- **Tipo de dados JSON.** O tipo de dados `JSON` do MySQL é suportado para as tabelas `NDB` no **mysqld** fornecido com o NDB 8.0.

  Uma tabela `NDB` pode ter no máximo 3 colunas `JSON`.

  A API do NDB não tem uma disposição especial para trabalhar com dados `JSON`, que ela considera simplesmente dados `BLOB`. O manuseio de dados como `JSON` deve ser realizado pelo aplicativo.

- **Expressões de valores padrão.** Expressões de valores padrão explícitas (como implementadas no MySQL 8.0.34 e versões posteriores) para definições de colunas da tabela `NDB` não são suportadas. Isso significa que, por exemplo, a seguinte declaração `CREATE TABLE` é rejeitada com um erro:

  ```
  mysql> CREATE TABLE t (
      ->   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ->   cf FLOAT DEFAULT (RAND() * 10)
      -> ) ENGINE=NDBCLUSTER;
  ERROR 3774 (HY000): 'Specified storage engine' is not supported for default value expressions.
  ```

  O NDB Cluster suporta valores de coluna padrão literais, conforme mostrado aqui:

  ```
  mysql> CREATE TABLE t3 (
      ->   id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      ->   ci INT DEFAULT 0,
      ->   cv VARCHAR(20) DEFAULT ''
      -> ) ENGINE=NDBCLUSTER;
  Query OK, 0 rows affected (0.17 sec)
  ```

  Para obter mais informações, consulte a Seção 13.6, “Valores padrão de tipo de dados”.
