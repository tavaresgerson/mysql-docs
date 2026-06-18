## 26.3 Gerenciamento de Partições

26.3.1 Gerenciamento das Partições RANGE e LIST

26.3.2 Gerenciamento das Partições HASH e KEY

26.3.3 Troca de Partições e Subpartições com Tabelas

26.3.4 Manutenção de Partições

26.3.5 Obter informações sobre partições

Existem várias maneiras de usar instruções SQL para modificar tabelas particionadas; é possível adicionar, excluir, redefinir, mesclar ou dividir partições existentes usando as extensões de particionamento da instrução `ALTER TABLE`. Há também maneiras de obter informações sobre tabelas e partições particionadas. Discutimos esses tópicos nas seções a seguir.

- Para obter informações sobre a gestão de partições em tabelas particionadas por `RANGE` ou `LIST`, consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”.

- Para uma discussão sobre a gestão das partições `HASH` e `KEY`, consulte a Seção 26.3.2, “Gestão das partições HASH e KEY”.

- Consulte a Seção 26.3.5, “Obtendo Informações sobre Partições”, para uma discussão sobre os mecanismos fornecidos no MySQL 8.0 para obter informações sobre tabelas e partições particionadas.

- Para uma discussão sobre a realização de operações de manutenção em partições, consulte a Seção 26.3.4, “Manutenção de Partições”.

Nota

Todas as partições de uma tabela particionada devem ter o mesmo número de subpartições; não é possível alterar a particionamento de subpartições uma vez que a tabela tenha sido criada.

Para alterar o esquema de particionamento de uma tabela, é necessário apenas usar a instrução `ALTER TABLE` com a opção `partition_options`, que tem a mesma sintaxe que a usada com `CREATE TABLE` para criar uma tabela particionada; essa opção (também) sempre começa com as palavras-chave `PARTITION BY`. Suponha que a seguinte instrução `CREATE TABLE` tenha sido usada para criar uma tabela particionada por intervalo:

```
CREATE TABLE trb3 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (1995),
        PARTITION p2 VALUES LESS THAN (2000),
        PARTITION p3 VALUES LESS THAN (2005)
    );
```

Para repartir essa tabela de modo que ela seja dividida por chave em duas partições usando o valor da coluna `id` como base para a chave, você pode usar esta instrução:

```
ALTER TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;
```

Isso tem o mesmo efeito na estrutura da tabela quanto a deletar a tabela e recriá-la usando `CREATE TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;`.

`ALTER TABLE ... ENGINE = ...` altera apenas o mecanismo de armazenamento usado pela tabela e deixa o esquema de particionamento da tabela intacto. A instrução só terá sucesso se o mecanismo de armazenamento de destino oferecer suporte à particionamento. Você pode usar `ALTER TABLE ... REMOVE PARTITIONING` para remover o particionamento de uma tabela; veja a Seção 15.1.9, “Instrução ALTER TABLE”.

Importante

Apenas uma única cláusula `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION` pode ser usada em uma determinada declaração `ALTER TABLE`. Se você (por exemplo) deseja excluir uma partição e reorganizar as partições restantes de uma tabela, você deve fazê-lo em duas declarações separadas `ALTER TABLE` (uma usando `DROP PARTITION` e depois uma segunda usando `REORGANIZE PARTITION`).

Você pode excluir todas as linhas de uma ou mais partições selecionadas usando `ALTER TABLE ... TRUNCATE PARTITION`.
