## 5.6 Exemplos de Perguntas Comuns

Aqui estão exemplos de como resolver alguns problemas comuns com o MySQL.

Alguns dos exemplos utilizam a tabela `shop` para armazenar o preço de cada artigo (número de item) para certos comerciantes (distribuidores). Supondo que cada comerciante tenha um preço fixo único por artigo, então (`article`, `dealer`) é uma chave primária para os registros.

Inicie a ferramenta de linha de comando **mysql** e selecione um banco de dados:

```
$> mysql your-database-name
```

Para criar e povoar a tabela de exemplo, use essas declarações:

```
CREATE TABLE shop (
    article INT UNSIGNED  DEFAULT '0000' NOT NULL,
    dealer  CHAR(20)      DEFAULT ''     NOT NULL,
    price   DECIMAL(16,2) DEFAULT '0.00' NOT NULL,
    PRIMARY KEY(article, dealer));
INSERT INTO shop VALUES
    (1,'A',3.45),(1,'B',3.99),(2,'A',10.99),(3,'B',1.45),
    (3,'C',1.69),(3,'D',1.25),(4,'D',19.95);
```

Após a emissão das declarações, a tabela deve ter o seguinte conteúdo:

```
SELECT * FROM shop ORDER BY article;

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|       1 | A      |  3.45 |
|       1 | B      |  3.99 |
|       2 | A      | 10.99 |
|       3 | B      |  1.45 |
|       3 | C      |  1.69 |
|       3 | D      |  1.25 |
|       4 | D      | 19.95 |
+---------+--------+-------+
```

### 5.6.1 O Valor Máximo para uma Coluna

“Qual é o número do item mais alto?”

```
SELECT MAX(article) AS article FROM shop;

+---------+
| article |
+---------+
|       4 |
+---------+
```

### 5.6.2 A linha que contém o máximo de uma determinada coluna

*Tarefa: Encontre o número, o revendedor e o preço do artigo mais caro.*

Isso é facilmente feito com uma subconsulta:

```
SELECT article, dealer, price
FROM   shop
WHERE  price=(SELECT MAX(price) FROM shop);

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

Outra solução é usar um `LEFT JOIN`, como mostrado aqui:

```
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.price < s2.price
WHERE s2.article IS NULL;
```

Você também pode fazer isso, classificando todas as linhas em ordem decrescente de preço e obtendo apenas a primeira linha usando a cláusula específica do MySQL `LIMIT`, como este:

```
SELECT article, dealer, price
FROM shop
ORDER BY price DESC
LIMIT 1;
```

Nota

Se houvesse vários artigos mais caros, cada um com um preço de R$ 19,95, a solução `LIMIT` mostraria apenas um deles.

### 5.6.3 Máximo de Colunas por Grupo

*Tarefa: Encontre o preço mais alto por artigo.*

```
SELECT article, MAX(price) AS price
FROM   shop
GROUP BY article
ORDER BY article;

+---------+-------+
| article | price |
+---------+-------+
|    0001 |  3.99 |
|    0002 | 10.99 |
|    0003 |  1.69 |
|    0004 | 19.95 |
+---------+-------+
```

### 5.6.4 As filas que retêm o máximo por grupo de uma determinada coluna

*Tarefa: Para cada artigo, encontre o revendedor ou revendedores com o preço mais caro.*

Esse problema pode ser resolvido com uma subconsulta como esta:

```
SELECT article, dealer, price
FROM   shop s1
WHERE  price=(SELECT MAX(s2.price)
              FROM shop s2
              WHERE s1.article = s2.article)
ORDER BY article;

+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0001 | B      |  3.99 |
|    0002 | A      | 10.99 |
|    0003 | C      |  1.69 |
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

O exemplo anterior usa uma subconsulta correlacionada, que pode ser ineficiente (consulte a Seção 15.2.15.7, “Subconsultas Correlacionadas”). Outras possibilidades para resolver o problema são usar uma subconsulta não correlacionada na cláusula `FROM`, um `LEFT JOIN` ou uma expressão comum de tabela com uma função de janela.

Subconsulta não correlacionada:

```
SELECT s1.article, dealer, s1.price
FROM shop s1
JOIN (
  SELECT article, MAX(price) AS price
  FROM shop
  GROUP BY article) AS s2
  ON s1.article = s2.article AND s1.price = s2.price
ORDER BY article;
```

`LEFT JOIN`:

```
SELECT s1.article, s1.dealer, s1.price
FROM shop s1
LEFT JOIN shop s2 ON s1.article = s2.article AND s1.price < s2.price
WHERE s2.article IS NULL
ORDER BY s1.article;
```

O `LEFT JOIN` funciona com base no princípio de que, quando o `s1.price` está em seu valor máximo, não há nenhum `s2.price` com um valor maior e, portanto, o valor correspondente ao `s2.article` é `NULL`. Veja a Seção 15.2.13.2, “Cláusula JOIN”.

Expressão comum de tabela com função de janela:

```
WITH s1 AS (
   SELECT article, dealer, price,
          RANK() OVER (PARTITION BY article
                           ORDER BY price DESC
                      ) AS `Rank`
     FROM shop
)
SELECT article, dealer, price
  FROM s1
  WHERE `Rank` = 1
ORDER BY article;
```

### 5.6.5 Usando variáveis definidas pelo usuário

Você pode utilizar variáveis de usuário do MySQL para lembrar resultados sem precisar armazená-los em variáveis temporárias no cliente. (Veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.)

Por exemplo, para encontrar os artigos com o preço mais alto e mais baixo, você pode fazer o seguinte:

```
mysql> SELECT @min_price:=MIN(price),@max_price:=MAX(price) FROM shop;
mysql> SELECT * FROM shop WHERE price=@min_price OR price=@max_price;
+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0003 | D      |  1.25 |
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

Nota

Também é possível armazenar o nome de um objeto de banco de dados, como uma tabela ou uma coluna, em uma variável do usuário e, em seguida, usar essa variável em uma declaração SQL; no entanto, isso requer o uso de uma declaração preparada. Consulte a Seção 15.5, “Declarações Preparadas”, para obter mais informações.

### 5.6.6 Usando Chaves Estrangeiras

O MySQL suporta chaves estrangeiras, que permitem a correlação de dados relacionados entre tabelas, e restrições de chave estrangeira, que ajudam a manter os dados relacionados consistentes.

Uma relação de chave estrangeira envolve uma tabela pai que contém os valores iniciais da coluna e uma tabela filho com valores de coluna que fazem referência aos valores da coluna pai. Uma restrição de chave estrangeira é definida na tabela filho.

Este exemplo a seguir relaciona as tabelas `parent` e `child` por meio de uma chave estrangeira de uma única coluna e mostra como uma restrição de chave estrangeira garante a integridade referencial.

Crie as tabelas pai e filho usando os seguintes comandos SQL:

```
CREATE TABLE parent (
    id INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=INNODB;


CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
) ENGINE=INNODB;
```

Insira uma linha na tabela principal, assim:

```
mysql> INSERT INTO parent (id) VALUES ROW(1);
```

Verifique se os dados foram inseridos. Isso pode ser feito simplesmente selecionando todas as linhas de `parent`, como mostrado aqui:

```
mysql> TABLE parent;
+----+
| id |
+----+
|  1 |
+----+
```

Insira uma linha na tabela secundária usando a seguinte declaração SQL:

```
mysql> INSERT INTO child (id,parent_id) VALUES ROW(1,1);
```

A operação de inserção foi bem-sucedida porque `parent_id` 1 está presente na tabela principal.

A inserção de uma linha na tabela de crianças com um valor `parent_id` que não está presente na tabela principal é rejeitada com um erro, como você pode ver aqui:

```
mysql> INSERT INTO child (id,parent_id) VALUES ROW(2,2);
ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails
(`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
REFERENCES `parent` (`id`))
```

A operação falha porque o valor especificado `parent_id` não existe na tabela principal.

Tentar excluir a linha inserida anteriormente da tabela pai também falha, conforme mostrado aqui:

```
mysql> DELETE FROM parent WHERE id = 1;
ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key constraint fails
(`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY (`parent_id`)
REFERENCES `parent` (`id`))
```

Esta operação falha porque o registro na tabela de crianças contém o valor do ID referenciado (`parent_id`).

Quando uma operação afeta um valor chave na tabela principal que tem linhas correspondentes na tabela secundária, o resultado depende da ação referencial especificada pelos subcláusulas `ON UPDATE` e `ON DELETE` da cláusula `FOREIGN KEY`. O omitindo das cláusulas `ON DELETE` e `ON UPDATE` (como na definição atual da tabela secundária) é o mesmo que especificar a opção `RESTRICT`, que rejeita operações que afetam um valor chave na tabela principal que tem linhas correspondentes na tabela principal.

Para demonstrar as ações referenciais `ON DELETE` e `ON UPDATE`, descarte a tabela de filhos e recriá-la para incluir as subcláusulas `ON UPDATE` e `ON DELETE` com a opção `CASCADE`. A opção `CASCADE` exclui ou atualiza automaticamente as linhas correspondentes na tabela de filhos ao excluir ou atualizar as linhas na tabela principal.

```
DROP TABLE child;

CREATE TABLE child (
    id INT,
    parent_id INT,
    INDEX par_ind (parent_id),
    FOREIGN KEY (parent_id)
        REFERENCES parent(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=INNODB;
```

Insira algumas linhas na tabela de filhos usando a declaração mostrada aqui:

```
mysql> INSERT INTO child (id,parent_id) VALUES ROW(1,1), ROW(2,1), ROW(3,1);
```

Verifique se os dados foram inseridos, assim:

```
mysql> TABLE child;
+------+-----------+
| id   | parent_id |
+------+-----------+
|    1 |         1 |
|    2 |         1 |
|    3 |         1 |
+------+-----------+
```

Atualize o ID na tabela principal, alterando-o de 1 para 2, usando a declaração SQL mostrada aqui:

```
mysql> UPDATE parent SET id = 2 WHERE id = 1;
```

Verifique se a atualização foi bem-sucedida, selecionando todas as linhas da tabela principal, conforme mostrado aqui:

```
mysql> TABLE parent;
+----+
| id |
+----+
|  2 |
+----+
```

Verifique se a ação de referência `ON UPDATE CASCADE` atualizou a tabela de crianças, da seguinte forma:

```
mysql> TABLE child;
+------+-----------+
| id   | parent_id |
+------+-----------+
|    1 |         2 |
|    2 |         2 |
|    3 |         2 |
+------+-----------+
```

Para demonstrar a ação referencial `ON DELETE CASCADE`, exclua registros da tabela principal onde `parent_id = 2`; isso exclui todos os registros na tabela principal.

```
mysql> DELETE FROM parent WHERE id = 2;
```

Como todos os registros na tabela de crianças estão associados ao `parent_id = 2`, a ação referencial `ON DELETE CASCADE` remove todos os registros da tabela de crianças, conforme mostrado aqui:

```
mysql> TABLE child;
Empty set (0.00 sec)
```

Para mais informações sobre restrições de chave estrangeira, consulte a Seção 15.1.20.5, “Restrições de chave estrangeira”.

### 5.6.7 Pesquisar em duas chaves

Um `OR` que utiliza uma única chave é bem otimizado, assim como o manuseio do `AND`.

O caso complicado é o de procurar em duas chaves diferentes combinadas com `OR`:

```
SELECT field1_index, field2_index FROM test_table
WHERE field1_index = '1' OR  field2_index = '1'
```

Este caso é otimizado. Veja a Seção 10.2.1.3, “Otimização da Mesclagem de Índices”.

Você também pode resolver o problema de forma eficiente usando um `UNION` que combina a saída de duas declarações separadas `SELECT`. Veja a Seção 15.2.18, “Cláusula UNION”.

Cada `SELECT` busca apenas uma chave e pode ser otimizado:

```
SELECT field1_index, field2_index
    FROM test_table WHERE field1_index = '1'
UNION
SELECT field1_index, field2_index
    FROM test_table WHERE field2_index = '1';
```

### 5.6.8 Calcular visitas por dia

O exemplo a seguir mostra como você pode usar as funções de grupo de bits para calcular o número de dias por mês em que um usuário visitou uma página da Web.

```
CREATE TABLE t1 (year YEAR, month INT UNSIGNED,
             day INT UNSIGNED);
INSERT INTO t1 VALUES(2000,1,1),(2000,1,20),(2000,1,30),(2000,2,2),
            (2000,2,23),(2000,2,23);
```

A tabela de exemplo contém valores de ano-mês-dia que representam as visitas dos usuários à página. Para determinar quantos dias diferentes em cada mês essas visitas ocorrem, use esta consulta:

```
SELECT year,month,BIT_COUNT(BIT_OR(1<<day)) AS days FROM t1
       GROUP BY year,month;
```

Quais retornos:

```
+------+-------+------+
| year | month | days |
+------+-------+------+
| 2000 |     1 |    3 |
| 2000 |     2 |    2 |
+------+-------+------+
```

A consulta calcula quantos dias diferentes aparecem na tabela para cada combinação de ano/mês, com remoção automática de entradas duplicadas.

### 5.6.9 Usando AUTO_INCREMENT

O atributo `AUTO_INCREMENT` pode ser usado para gerar uma identidade única para novas linhas:

```
CREATE TABLE animals (
     id MEDIUMINT NOT NULL AUTO_INCREMENT,
     name CHAR(30) NOT NULL,
     PRIMARY KEY (id)
);

INSERT INTO animals (name) VALUES
    ('dog'),('cat'),('penguin'),
    ('lax'),('whale'),('ostrich');

SELECT * FROM animals;
```

Quais retornos:

```
+----+---------+
| id | name    |
+----+---------+
|  1 | dog     |
|  2 | cat     |
|  3 | penguin |
|  4 | lax     |
|  5 | whale   |
|  6 | ostrich |
+----+---------+
```

Não foi especificado nenhum valor para a coluna `AUTO_INCREMENT`, então o MySQL atribuiu números de sequência automaticamente. Você também pode atribuir explicitamente 0 à coluna para gerar números de sequência, a menos que o modo SQL `NO_AUTO_VALUE_ON_ZERO` esteja habilitado. Por exemplo:

```
INSERT INTO animals (id,name) VALUES(0,'groundhog');
```

Se a coluna for declarada como `NOT NULL`, também é possível atribuir `NULL` à coluna para gerar números de sequência. Por exemplo:

```
INSERT INTO animals (id,name) VALUES(NULL,'squirrel');
```

Quando você inserir qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida com esse valor e a sequência é redefinida para que o próximo valor automaticamente gerado siga sequencialmente a partir do maior valor da coluna. Por exemplo:

```
INSERT INTO animals (id,name) VALUES(100,'rabbit');
INSERT INTO animals (id,name) VALUES(NULL,'mouse');
SELECT * FROM animals;
+-----+-----------+
| id  | name      |
+-----+-----------+
|   1 | dog       |
|   2 | cat       |
|   3 | penguin   |
|   4 | lax       |
|   5 | whale     |
|   6 | ostrich   |
|   7 | groundhog |
|   8 | squirrel  |
| 100 | rabbit    |
| 101 | mouse     |
+-----+-----------+
```

Atualizar um valor existente na coluna `AUTO_INCREMENT` também redefiniu a sequência `AUTO_INCREMENT`.

Você pode recuperar o valor mais recente gerado automaticamente pelo `AUTO_INCREMENT` com a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Essas funções são específicas da conexão, portanto, seus valores de retorno não são afetados por outra conexão que também está realizando inserções.

Use o menor tipo de dado inteiro para a coluna `AUTO_INCREMENT` que seja grande o suficiente para conter o valor máximo da sequência que você precisa. Quando a coluna atingir o limite superior do tipo de dados, a próxima tentativa de gerar um número de sequência falhará. Use o atributo `UNSIGNED` se possível para permitir uma faixa maior. Por exemplo, se você usar `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o número de sequência máximo permitido é 127. Para [`TINYINT UNSIGNED`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o máximo é 255. Veja [Seção 13.1.2, “Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") para as faixas de todos os tipos de inteiro.

Nota

Para uma inserção de várias linhas, `LAST_INSERT_ID()` e `mysql_insert_id()` de fato retornam a chave `AUTO_INCREMENT` do *primeiro* das linhas inseridas. Isso permite que as inserções de várias linhas sejam reproduzidas corretamente em outros servidores em uma configuração de replicação.

Para começar com um valor de `AUTO_INCREMENT` diferente de 1, defina esse valor com [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") ou `ALTER TABLE`, da seguinte forma:

```
mysql> ALTER TABLE tbl AUTO_INCREMENT = 100;
```

#### Notas do InnoDB

Para informações sobre o uso de `AUTO_INCREMENT` específico para `InnoDB`, consulte a Seção 17.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”.

#### Notas sobre MyISAM

* Para as tabelas `MyISAM`, você pode especificar `AUTO_INCREMENT` em uma coluna secundária em um índice de múltiplas colunas. Neste caso, o valor gerado para a coluna `AUTO_INCREMENT` é calculado como [`MAX(auto_increment_column]

+ 1 WHERE prefix=prefixo_dado](aggregate-functions.html#function_max). Isso é útil quando você deseja colocar dados em grupos ordenados.

  ```
  CREATE TABLE animals (
      grp ENUM('fish','mammal','bird') NOT NULL,
      id MEDIUMINT NOT NULL AUTO_INCREMENT,
      name CHAR(30) NOT NULL,
      PRIMARY KEY (grp,id)
  ) ENGINE=MyISAM;

  INSERT INTO animals (grp,name) VALUES
      ('mammal','dog'),('mammal','cat'),
      ('bird','penguin'),('fish','lax'),('mammal','whale'),
      ('bird','ostrich');

  SELECT * FROM animals ORDER BY grp,id;
  ```

Que retornos:

  ```
  +--------+----+---------+
  | grp    | id | name    |
  +--------+----+---------+
  | fish   |  1 | lax     |
  | mammal |  1 | dog     |
  | mammal |  2 | cat     |
  | mammal |  3 | whale   |
  | bird   |  1 | penguin |
  | bird   |  2 | ostrich |
  +--------+----+---------+
  ```

Neste caso (quando a coluna `AUTO_INCREMENT` faz parte de um índice de múltiplas colunas), os valores de `AUTO_INCREMENT` são reutilizados se você excluir a linha com o maior valor de `AUTO_INCREMENT` em qualquer grupo. Isso acontece mesmo para as tabelas `MyISAM`, para as quais os valores de `AUTO_INCREMENT` normalmente não são reutilizados.

* Se a coluna `AUTO_INCREMENT` faz parte de vários índices, o MySQL gera valores de sequência usando o índice que começa com a coluna `AUTO_INCREMENT`, se houver uma. Por exemplo, se a tabela `animals` contivesse índices `PRIMARY KEY (grp, id)` e `INDEX (id)`, o MySQL ignoraria o `PRIMARY KEY` para gerar valores de sequência. Como resultado, a tabela conterá uma única sequência, não uma sequência por valor de `grp`.

#### Leitura Adicional

Mais informações sobre `AUTO_INCREMENT` estão disponíveis aqui:

* Como atribuir o atributo `AUTO_INCREMENT` a uma coluna: Seção 15.1.20, “Instrução CREATE TABLE”, e Seção 15.1.9, “Instrução ALTER TABLE”.

* Como o `AUTO_INCREMENT` se comporta dependendo do modo SQL `NO_AUTO_VALUE_ON_ZERO`: Seção 7.1.11, “Modos SQL do servidor”.

* Como usar a função `LAST_INSERT_ID()` para encontrar a linha que contém o valor mais recente do `AUTO_INCREMENT`: Seção 14.15, “Funções de Informação”.

* Definindo o valor `AUTO_INCREMENT` a ser utilizado: Seção 7.1.8, “Variáveis do sistema do servidor”.

* Seção 17.6.1.6, “Tratamento de AUTO_INCREMENT em InnoDB”
* `AUTO_INCREMENT` e replicação: Seção 19.5.1.1, “Replicação e AUTO_INCREMENT”.

* Variáveis do sistema do servidor relacionadas a `AUTO_INCREMENT` (`auto_increment_increment` e `auto_increment_offset`) que podem ser usadas para replicação: Seção 7.1.8, “Variáveis do sistema do servidor”.