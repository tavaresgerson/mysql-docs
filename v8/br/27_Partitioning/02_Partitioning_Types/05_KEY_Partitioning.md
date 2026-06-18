### 26.2.5 Partição de chave

A partição por chave é semelhante à partição por hash, exceto que, enquanto a partição por hash utiliza uma expressão definida pelo usuário, a função de hashing para a partição por chave é fornecida pelo servidor MySQL. O NDB Cluster utiliza `MD5()` para esse propósito; para tabelas que utilizam outros motores de armazenamento, o servidor emprega sua própria função de hashing interna.

As regras de sintaxe para `CREATE TABLE ... PARTITION BY KEY` são semelhantes às usadas para criar uma tabela particionada por hash. As principais diferenças estão listadas aqui:

- É usado `KEY` em vez de `HASH`.

- `KEY` aceita apenas uma lista de zero ou mais nomes de coluna. Quaisquer colunas usadas como chave de particionamento devem compor parte ou toda a chave primária da tabela, se a tabela tiver uma. Se nenhum nome de coluna for especificado como chave de particionamento, a chave primária da tabela será usada, se houver uma. Por exemplo, a seguinte instrução `CREATE TABLE` é válida no MySQL 8.0:

  ```
  CREATE TABLE k1 (
      id INT NOT NULL PRIMARY KEY,
      name VARCHAR(20)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

  Se não houver uma chave primária, mas houver uma chave única, então a chave única será usada como chave de partição:

  ```
  CREATE TABLE k1 (
      id INT NOT NULL,
      name VARCHAR(20),
      UNIQUE KEY (id)
  )
  PARTITION BY KEY()
  PARTITIONS 2;
  ```

  No entanto, se a coluna de chave única não fosse definida como `NOT NULL`, a declaração anterior falharia.

  Em ambos os casos, a chave de partição é a coluna `id`, embora ela não esteja exibida na saída de `SHOW CREATE TABLE` ou na coluna `PARTITION_EXPRESSION` da tabela do esquema de informações `PARTITIONS`.

  Ao contrário do que ocorre com outros tipos de particionamento, as colunas usadas para particionar por `KEY` não são restritas a valores inteiros ou `NULL`. Por exemplo, a seguinte declaração `CREATE TABLE` é válida:

  ```
  CREATE TABLE tm1 (
      s1 CHAR(32) PRIMARY KEY
  )
  PARTITION BY KEY(s1)
  PARTITIONS 10;
  ```

  A afirmação anterior não seria válida se um tipo de particionamento diferente fosse especificado. (Neste caso, simplesmente usar `PARTITION BY KEY()` também seria válido e teria o mesmo efeito que `PARTITION BY KEY(s1)`, já que `s1` é a chave primária da tabela.)

  Para obter informações adicionais sobre este assunto, consulte a Seção 26.6, “Restrições e Limitações na Partição”.

  Colunas com prefixos de índice não são suportadas em chaves de particionamento. Isso significa que as colunas `CHAR`, `VARCHAR`, `BINARY` e `VARBINARY` podem ser usadas em uma chave de particionamento, desde que não utilizem prefixos; porque um prefixo deve ser especificado para as colunas `BLOB` e `TEXT` nas definições de índice, não é possível usar colunas desses dois tipos em chaves de particionamento. Antes do MySQL 8.0.21, colunas que usavam prefixos eram permitidas ao criar, alterar ou atualizar uma tabela particionada, mesmo que não estivessem incluídas na chave de particionamento da tabela; no MySQL 8.0.21 e versões posteriores, esse comportamento permissivo é desaconselhado, e o servidor exibe avisos ou erros apropriados quando uma ou mais dessas colunas são usadas. Consulte Prefixos de índice de coluna não suportados para particionamento de chave, para obter mais informações e exemplos.

  Nota

  As tabelas que usam o mecanismo de armazenamento `NDB` são implicitamente particionadas por `KEY`, usando a chave primária da tabela como chave de particionamento (como em outros mecanismos de armazenamento do MySQL). No caso de a tabela do NDB Cluster não ter uma chave primária explícita, a chave primária "oculta" gerada pelo mecanismo de armazenamento `NDB` para cada tabela do NDB Cluster é usada como chave de particionamento.

  Se você definir um esquema de particionamento explícito para uma tabela `NDB`, a tabela deve ter uma chave primária explícita, e quaisquer colunas usadas na expressão de particionamento devem fazer parte dessa chave. No entanto, se a tabela usar uma expressão de particionamento “vazia” — ou seja, `PARTITION BY KEY()` sem referências de colunas — então não é necessário uma chave primária explícita.

  Você pode observar essa partição usando o utilitário **ndb\_desc** (com a opção `-p`).

  Importante

  Para uma tabela com partição por chave, você não pode executar um `ALTER TABLE DROP PRIMARY KEY`, pois isso gera o erro ERRO 1466 (HY000): Campo na lista de campos para a função de partição não encontrado na tabela. Isso não é um problema para tabelas do NDB Cluster que são particionadas por `KEY`; nesse caso, a tabela é reorganizada usando a chave primária “oculta” como a nova chave de partição da tabela. Veja o Capítulo 25, *MySQL NDB Cluster 8.0*.

É também possível particionar uma tabela por chave linear. Aqui está um exemplo simples:

```
CREATE TABLE tk (
    col1 INT NOT NULL,
    col2 CHAR(5),
    col3 DATE
)
PARTITION BY LINEAR KEY (col1)
PARTITIONS 3;
```

A palavra-chave `LINEAR` tem o mesmo efeito na partição `KEY` que na partição `HASH`, com o número de partição sendo derivado usando um algoritmo de potências de dois em vez de aritmética de módulo. Consulte a Seção 26.2.4.1, “Partição Hash LINEAR”, para uma descrição desse algoritmo e suas implicações.
