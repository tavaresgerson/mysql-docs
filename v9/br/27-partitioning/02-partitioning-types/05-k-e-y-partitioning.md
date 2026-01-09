### 26.2.5 Partição por Chave

A partição por chave é semelhante à partição por hash, exceto que, enquanto a partição por hash emprega uma expressão definida pelo usuário, a função de hashing para a partição por chave é fornecida pelo servidor MySQL. O NDB Cluster usa `MD5()` para esse propósito; para tabelas que utilizam outros motores de armazenamento, o servidor emprega sua própria função de hashing interna.

As regras de sintaxe para `CREATE TABLE ... PARTITION BY KEY` são semelhantes às para a criação de uma tabela que é particionada por hash. As principais diferenças estão listadas aqui:

* `KEY` é usado em vez de `HASH`.

* `KEY` aceita apenas uma lista de zero ou mais nomes de colunas. Quaisquer colunas usadas como chave de partição devem compor parte ou toda a chave primária da tabela, se a tabela tiver uma. Quando nenhum nome de coluna é especificado como chave de partição, a chave primária da tabela é usada, se houver uma. Por exemplo, a seguinte instrução `CREATE TABLE` é válida no MySQL 9.5:

  ```
  CREATE TABLE k1 (
      id INT NOT NULL PRIMARY KEY,
      name VARCHAR(20)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

  Se não houver chave primária, mas houver uma chave única, então a chave única é usada como chave de partição:

  ```
  CREATE TABLE k1 (
      id INT NOT NULL,
      name VARCHAR(20),
      UNIQUE KEY (id)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

  No entanto, se a coluna da chave única não fosse definida como `NOT NULL`, então a instrução anterior falharia.

  Em ambos os casos, a chave de partição é a coluna `id`, embora ela não seja exibida na saída de `SHOW CREATE TABLE` ou na coluna `PARTITION_EXPRESSION` da tabela `PARTITIONS` do Schema de Informações.

Ao contrário do caso com outros tipos de partição, as colunas usadas para partição por `KEY` não são restritas a valores inteiros ou `NULL`. Por exemplo, a seguinte instrução `CREATE TABLE` é válida:

  ```
  CREATE TABLE tm1 (
      s1 CHAR(32) PRIMARY KEY
  )
  PARTITION BY KEY(s1)
  PARTITIONS 10;
  ```

A afirmação anterior não seria válida se um tipo de particionamento diferente fosse especificado. (Neste caso, simplesmente usar `PARTITION BY KEY()` também seria válido e teria o mesmo efeito que `PARTITION BY KEY(s1)`, já que `s1` é a chave primária da tabela.)

Para obter informações adicionais sobre este problema, consulte a Seção 26.6, “Restrições e Limitações de Particionamento”.

Colunas com prefixos de índice não são suportadas em chaves de particionamento. Isso significa que colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY` podem ser usadas em uma chave de particionamento, desde que não empreguem prefixos; porque um prefixo deve ser especificado para colunas `BLOB` e `TEXT` em definições de índice, não é possível usar colunas desses dois tipos em chaves de particionamento. O servidor rejeita qualquer declaração `CREATE TABLE` ou `ALTER TABLE` que afete uma tabela particionada em que uma ou mais colunas com prefixos ocorrem com um erro. Veja Prefixos de índice de coluna não suportados para particionamento por chave.

Nota

Tabelas que usam o motor de armazenamento `NDB` são implicitamente particionadas por `KEY`, usando a chave primária da tabela como a chave de particionamento (como com outros motores de armazenamento MySQL). No caso de a tabela do NDB Cluster não ter uma chave primária explícita, a “chave primária oculta” gerada pelo motor de armazenamento `NDB` para cada tabela do NDB Cluster é usada como a chave de particionamento.

Se você definir um esquema de particionamento explícito para uma tabela `NDB`, a tabela deve ter uma chave primária explícita, e quaisquer colunas usadas na expressão de particionamento devem fazer parte desta chave. No entanto, se a tabela usar uma expressão de particionamento “vazia” — ou seja, `PARTITION BY KEY()` sem referências de coluna — então nenhuma chave primária explícita é necessária.

Você pode observar essa particionamento usando o utilitário **ndb_desc** (com a opção `-p`).

Importante

Para uma tabela com partição por chave, você não pode executar uma instrução `ALTER TABLE DROP PRIMARY KEY`, pois isso gera o erro ERROR 1466 (HY000): Campo na lista de campos para a função de partição não encontrado na tabela. Isso não é um problema para tabelas do NDB Cluster que são particionadas por `KEY`; nesses casos, a tabela é reorganizada usando a chave primária "oculta" como a nova chave de partição da tabela. Veja o Capítulo 25, *MySQL NDB Cluster 9.5*.

Também é possível particionar uma tabela por chave linear. Aqui está um exemplo simples:

```
CREATE TABLE tk (
    col1 INT NOT NULL,
    col2 CHAR(5),
    col3 DATE
)
PARTITION BY LINEAR KEY (col1)
PARTITIONS 3;
```

A palavra-chave `LINEAR` tem o mesmo efeito na partição por `KEY` que na partição por `HASH`, com o número de partição derivado usando um algoritmo de potências de dois em vez de aritmética de módulo. Veja a Seção 26.2.4.1, “Partição Linear HASH”, para uma descrição desse algoritmo e suas implicações.