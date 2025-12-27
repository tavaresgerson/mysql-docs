## Gerenciamento de Partições

26.3.1 Gerenciamento de Partições RANGE e LIST

26.3.2 Gerenciamento de Partições HASH e KEY

26.3.3 Troca de Partições e Subpartições com Tabelas

26.3.4 Manutenção de Partições

26.3.5 Obtenção de Informações sobre Partições

Existem várias maneiras de usar instruções SQL para modificar tabelas particionadas; é possível adicionar, excluir, redefinir, mesclar ou dividir partições existentes usando as extensões de particionamento da instrução `ALTER TABLE`. Há também maneiras de obter informações sobre tabelas e partições particionadas. Discutimos esses tópicos nas seções a seguir.

* Para informações sobre o gerenciamento de partições em tabelas particionadas por `RANGE` ou `LIST`, consulte a Seção 26.3.1, “Gerenciamento de Partições RANGE e LIST”.

* Para uma discussão sobre o gerenciamento de partições `HASH` e `KEY`, consulte a Seção 26.3.2, “Gerenciamento de Partições HASH e KEY”.

* Consulte a Seção 26.3.5, “Obtenção de Informações sobre Partições”, para uma discussão sobre os mecanismos fornecidos no MySQL 9.5 para obter informações sobre tabelas e partições particionadas.

* Para uma discussão sobre a realização de operações de manutenção em partições, consulte a Seção 26.3.4, “Manutenção de Partições”.

Nota

Todas as partições de uma tabela particionada devem ter o mesmo número de subpartições; não é possível alterar a subpartição uma vez que a tabela tenha sido criada.

Para alterar o esquema de particionamento de uma tabela, é necessário usar apenas a instrução `ALTER TABLE` com uma opção `partition_options`, que tem a mesma sintaxe que a usada com `CREATE TABLE` para criar uma tabela particionada; essa opção (também) sempre começa com as palavras-chave `PARTITION BY`. Suponha que a seguinte instrução `CREATE TABLE` tenha sido usada para criar uma tabela que é particionada por intervalo:

```
CREATE TABLE trb3 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (1995),
        PARTITION p2 VALUES LESS THAN (2000),
        PARTITION p3 VALUES LESS THAN (2005)
    );
```

Para repartir essa tabela de modo que ela seja dividida por chave em duas partições usando o valor da coluna `id` como base para a chave, você pode usar essa instrução:

```
ALTER TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;
```

Isso tem o mesmo efeito na estrutura da tabela que a remoção da tabela e sua recriação usando `CREATE TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;`.

`ALTER TABLE ... ENGINE [=] ...` altera apenas o motor de armazenamento usado pela tabela e deixa o esquema de partição da tabela intacto. A instrução só tem sucesso se o motor de armazenamento alvo oferecer suporte à partição. Você pode usar `ALTER TABLE ... REMOVE PARTITIONING` para remover o esquema de partição de uma tabela; veja a Seção 15.1.11, “Instrução ALTER TABLE”.

Importante

Apenas uma única cláusula `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION` pode ser usada em uma dada instrução `ALTER TABLE`. Se você, por exemplo, desejar remover uma partição e reorganizar as partições restantes da tabela, você deve fazer isso em duas instruções `ALTER TABLE` separadas (uma usando `DROP PARTITION` e depois uma segunda usando `REORGANIZE PARTITION`).

Você pode excluir todas as linhas de uma ou mais partições selecionadas usando `ALTER TABLE ... TRUNCATE PARTITION`.