## 26.3 Gerenciamento de Partições

Existem várias maneiras de usar declarações SQL para modificar tabelas particionadas; é possível adicionar, excluir, redefinir, mesclar ou dividir partições existentes usando as extensões de particionamento para a declaração `ALTER TABLE`. Também existem maneiras de obter informações sobre tabelas e partições particionadas. Discutimos esses tópicos nas seções a seguir.

* Para informações sobre a gestão de partições em tabelas particionadas por `RANGE` ou `LIST`, consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”.

* Para uma discussão sobre a gestão das partições `HASH` e `KEY`, consulte a Seção 26.3.2, “Gestão das partições HASH e KEY”.

* Consulte a Seção 26.3.5, “Obtenção de Informações sobre Partições”, para uma discussão sobre os mecanismos fornecidos no MySQL 8.0 para obter informações sobre tabelas e partições particionadas.

* Para uma discussão sobre a realização de operações de manutenção em partições, consulte a Seção 26.3.4, “Manutenção de Partições”.

Nota

Todas as partições de uma tabela particionada devem ter o mesmo número de subpartições; não é possível alterar a subpartição uma vez que a tabela tenha sido criada.

Para alterar o esquema de particionamento de uma tabela, é necessário apenas usar a declaração `ALTER TABLE` com uma opção *`partition_options`*, que tem a mesma sintaxe que a usada com `CREATE TABLE` para criar uma tabela particionada; essa opção (também) sempre começa com as palavras-chave `PARTITION BY`. Suponha que a seguinte declaração `CREATE TABLE` tenha sido usada para criar uma tabela que é particionada por intervalo:

```
CREATE TABLE trb3 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE( YEAR(purchased) ) (
        PARTITION p0 VALUES LESS THAN (1990),
        PARTITION p1 VALUES LESS THAN (1995),
        PARTITION p2 VALUES LESS THAN (2000),
        PARTITION p3 VALUES LESS THAN (2005)
    );
```

Para repartir essa tabela de modo que ela seja dividida por chave em duas partições, usando o valor da coluna `id` como base para a chave, você pode usar esta declaração:

```
ALTER TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;
```

Isso tem o mesmo efeito na estrutura da tabela como descartar a tabela e recriá-la usando `CREATE TABLE trb3 PARTITION BY KEY(id) PARTITIONS 2;`.

`ALTER TABLE ... ENGINE = ...` altera apenas o mecanismo de armazenamento usado pela tabela e deixa o esquema de particionamento da tabela intacto. A declaração só é bem-sucedida se o mecanismo de armazenamento alvo fornecer suporte a particionamento. Você pode usar `ALTER TABLE ... REMOVE PARTITIONING` para remover o particionamento de uma tabela; veja Seção 15.1.9, “Declaração ALTER TABLE”.

Importante

Apenas uma única cláusula `PARTITION BY`, `ADD PARTITION`, `DROP PARTITION`, `REORGANIZE PARTITION` ou `COALESCE PARTITION` pode ser usada em uma declaração específica `ALTER TABLE`. Se você (por exemplo) deseja descartar uma partição e reorganizar as partições restantes de uma tabela, você deve fazer isso em duas declarações separadas `ALTER TABLE` (uma usando `DROP PARTITION` e, em seguida, uma segunda usando `REORGANIZE PARTITION`).

Você pode excluir todas as linhas de uma ou mais partições selecionadas usando `ALTER TABLE ... TRUNCATE PARTITION`.

### 26.3.1 Gestão de Partições RANGE e LIST

A adição e a remoção de partições de intervalo e de listas são tratadas de maneira semelhante, portanto, discutiremos a gestão de ambos os tipos de partição nesta seção. Para informações sobre o trabalho com tabelas que são particionadas por hash ou chave, consulte a Seção 26.3.2, “Gestão de Partições HASH e KEY”.

A remoção de uma partição de uma tabela que é particionada por `RANGE` ou por `LIST` pode ser realizada usando a declaração `ALTER TABLE` com a opção `DROP PARTITION`. Suponha que você tenha criado uma tabela que é particionada por intervalo e, em seguida, preenchida com 10 registros usando as seguintes declarações `CREATE TABLE` e `INSERT`:

```
mysql> CREATE TABLE tr (id INT, name VARCHAR(50), purchased DATE)
    ->     PARTITION BY RANGE( YEAR(purchased) ) (
    ->         PARTITION p0 VALUES LESS THAN (1990),
    ->         PARTITION p1 VALUES LESS THAN (1995),
    ->         PARTITION p2 VALUES LESS THAN (2000),
    ->         PARTITION p3 VALUES LESS THAN (2005),
    ->         PARTITION p4 VALUES LESS THAN (2010),
    ->         PARTITION p5 VALUES LESS THAN (2015)
    ->     );
Query OK, 0 rows affected (0.28 sec)

mysql> INSERT INTO tr VALUES
    ->     (1, 'desk organiser', '2003-10-15'),
    ->     (2, 'alarm clock', '1997-11-05'),
    ->     (3, 'chair', '2009-03-10'),
    ->     (4, 'bookcase', '1989-01-10'),
    ->     (5, 'exercise bike', '2014-05-09'),
    ->     (6, 'sofa', '1987-06-05'),
    ->     (7, 'espresso maker', '2011-11-22'),
    ->     (8, 'aquarium', '1992-08-04'),
    ->     (9, 'study desk', '2006-09-16'),
    ->     (10, 'lava lamp', '1998-12-25');
Query OK, 10 rows affected (0.05 sec)
Records: 10  Duplicates: 0  Warnings: 0
```

Você pode ver quais itens deveriam ter sido inseridos na partição `p2` como mostrado aqui:

```
mysql> SELECT * FROM tr
    ->     WHERE purchased BETWEEN '1995-01-01' AND '1999-12-31';
+------+-------------+------------+
| id   | name        | purchased  |
+------+-------------+------------+
|    2 | alarm clock | 1997-11-05 |
|   10 | lava lamp   | 1998-12-25 |
+------+-------------+------------+
2 rows in set (0.00 sec)
```

Você também pode obter essas informações usando a seleção de partição, como mostrado aqui:

```
mysql> SELECT * FROM tr PARTITION (p2);
+------+-------------+------------+
| id   | name        | purchased  |
+------+-------------+------------+
|    2 | alarm clock | 1997-11-05 |
|   10 | lava lamp   | 1998-12-25 |
+------+-------------+------------+
2 rows in set (0.00 sec)
```

Veja a Seção 26.5, “Seleção de Partição”, para mais informações.

Para excluir a partição denominada `p2`, execute o seguinte comando:

```
mysql> ALTER TABLE tr DROP PARTITION p2;
Query OK, 0 rows affected (0.03 sec)
```

Nota

O motor de armazenamento `NDBCLUSTER` não suporta `ALTER TABLE ... DROP PARTITION`. No entanto, ele suporta as outras extensões relacionadas a particionamento para `ALTER TABLE`, que são descritas neste capítulo.

É muito importante lembrar que, *quando você exclui uma partição, você também exclui todos os dados que estavam armazenados nessa partição*. Você pode ver que esse é o caso ao executar novamente a consulta anterior `SELECT`:

```
mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '1999-12-31';
Empty set (0.00 sec)
```

Nota

`DROP PARTITION` é suportado por APIs de particionamento nativo em local e pode ser usado com `ALGORITHM={COPY|INPLACE}`. `DROP PARTITION` com `ALGORITHM=INPLACE` exclui os dados armazenados na partição e descarta a partição. No entanto, `DROP PARTITION` com `ALGORITHM=COPY` ou `old_alter_table=ON` reconstrui a tabela particionada e tenta mover os dados da partição descartada para outra partição com uma definição `PARTITION ... VALUES` compatível. Os dados que não podem ser movidos para outra partição são excluídos.

Por isso, você deve ter o privilégio `DROP` para uma tabela antes de poder executar `ALTER TABLE ... DROP PARTITION` nessa tabela.

Se você deseja excluir todos os dados de todas as partições, preservando a definição da tabela e seu esquema de particionamento, use a declaração `TRUNCATE TABLE` (Consulte a Seção 15.1.37, “Declaração TRUNCATE TABLE”).

Se você pretende alterar a partição de uma tabela *sem* perder dados, use `ALTER TABLE ... REORGANIZE PARTITION` em vez disso. Consulte abaixo ou na Seção 15.1.9, “Instrução ALTER TABLE”, para obter informações sobre `REORGANIZE PARTITION`.

Se você executar agora uma declaração `SHOW CREATE TABLE`, você pode ver como a composição de particionamento da tabela foi alterada:

```
mysql> SHOW CREATE TABLE tr\G
*************************** 1. row ***************************
       Table: tr
Create Table: CREATE TABLE `tr` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `purchased` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE ( YEAR(purchased))
(PARTITION p0 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2005) ENGINE = InnoDB,
 PARTITION p4 VALUES LESS THAN (2010) ENGINE = InnoDB,
 PARTITION p5 VALUES LESS THAN (2015) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Quando você inserir novas linhas na tabela alterada com os valores da coluna `purchased` entre `'1995-01-01'` e `'2004-12-31'`, essas linhas são armazenadas na partição `p3`. Você pode verificar isso da seguinte forma:

```
mysql> INSERT INTO tr VALUES (11, 'pencil holder', '1995-07-12');
Query OK, 1 row affected (0.00 sec)

mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '2004-12-31';
+------+----------------+------------+
| id   | name           | purchased  |
+------+----------------+------------+
|    1 | desk organiser | 2003-10-15 |
|   11 | pencil holder  | 1995-07-12 |
+------+----------------+------------+
2 rows in set (0.00 sec)

mysql> ALTER TABLE tr DROP PARTITION p3;
Query OK, 0 rows affected (0.03 sec)

mysql> SELECT * FROM tr WHERE purchased
    -> BETWEEN '1995-01-01' AND '2004-12-31';
Empty set (0.00 sec)
```

O número de linhas que caíram da tabela como resultado de `ALTER TABLE ... DROP PARTITION` não é reportado pelo servidor, como seria no caso da consulta equivalente `DELETE`.

A remoção das partições `LIST` usa exatamente a mesma sintaxe `ALTER TABLE ... DROP PARTITION` usada para a remoção das partições `RANGE`. No entanto, há uma diferença importante no efeito que isso tem no uso da tabela posteriormente: você não pode mais inserir na tabela quaisquer linhas que tenham algum dos valores que foram incluídos na lista de valores que definem a partição excluída. (Veja a Seção 26.2.2, “LIST Partitioning”, para um exemplo.)

Para adicionar uma nova faixa ou partição de lista a uma tabela previamente particionada, use a declaração `ALTER TABLE ... ADD PARTITION`. Para tabelas que são particionadas por `RANGE`, isso pode ser usado para adicionar uma nova faixa ao final da lista de partições existentes. Suponha que você tenha uma tabela particionada que contém dados de filiação para sua organização, definida da seguinte forma:

```
CREATE TABLE members (
    id INT,
    fname VARCHAR(25),
    lname VARCHAR(25),
    dob DATE
)
PARTITION BY RANGE( YEAR(dob) ) (
    PARTITION p0 VALUES LESS THAN (1980),
    PARTITION p1 VALUES LESS THAN (1990),
    PARTITION p2 VALUES LESS THAN (2000)
);
```

Suponha que a idade mínima para os membros seja de 16 anos. À medida que o calendário se aproxima do final de 2015, você percebe que deve estar pronto para admitir membros que nasceram em 2000 (e posteriormente). Você pode modificar a tabela `members` para acomodar novos membros nascidos nos anos de 2000 a 2010, conforme mostrado aqui:

```
ALTER TABLE members ADD PARTITION (PARTITION p3 VALUES LESS THAN (2010));
```

Com tabelas que são divididas por faixa, você pode usar `ADD PARTITION` para adicionar novas partições apenas no alto da lista de partições. Tentar adicionar uma nova partição dessa maneira entre ou antes das partições existentes resulta em um erro, conforme mostrado aqui:

```
mysql> ALTER TABLE members
     >     ADD PARTITION (
     >     PARTITION n VALUES LESS THAN (1970));
ERROR 1463 (HY000): VALUES LESS THAN value must be strictly »
   increasing for each partition
```

Você pode resolver esse problema reorganizando a primeira partição em duas novas, que dividem a faixa entre elas, como este:

```
ALTER TABLE members
    REORGANIZE PARTITION p0 INTO (
        PARTITION n0 VALUES LESS THAN (1970),
        PARTITION n1 VALUES LESS THAN (1980)
);
```

Usando `SHOW CREATE TABLE`, você pode ver que a declaração `ALTER TABLE` teve o efeito desejado:

```
mysql> SHOW CREATE TABLE members\G
*************************** 1. row ***************************
       Table: members
Create Table: CREATE TABLE `members` (
  `id` int(11) DEFAULT NULL,
  `fname` varchar(25) DEFAULT NULL,
  `lname` varchar(25) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE ( YEAR(dob))
(PARTITION n0 VALUES LESS THAN (1970) ENGINE = InnoDB,
 PARTITION n1 VALUES LESS THAN (1980) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2010) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Veja também a Seção 15.1.9.1, “Operações de Partição de Tabela”.

Você também pode usar `ALTER TABLE ... ADD PARTITION` para adicionar novas partições a uma tabela que está particionada por `LIST`. Suponha que uma tabela `tt` seja definida usando a seguinte declaração `CREATE TABLE`:

```
CREATE TABLE tt (
    id INT,
    data INT
)
PARTITION BY LIST(data) (
    PARTITION p0 VALUES IN (5, 10, 15),
    PARTITION p1 VALUES IN (6, 12, 18)
);
```

Você pode adicionar uma nova partição para armazenar linhas com os valores da coluna `data`, `7`, e `14` como mostrado:

```
ALTER TABLE tt ADD PARTITION (PARTITION p2 VALUES IN (7, 14, 21));
```

Tenha em mente que você *não pode* adicionar uma nova partição `LIST` que abranja quaisquer valores que já estejam incluídos na lista de valores de uma partição existente. Se você tentar fazer isso, um erro será gerado:

```
mysql> ALTER TABLE tt ADD PARTITION
     >     (PARTITION np VALUES IN (4, 8, 12));
ERROR 1465 (HY000): Multiple definition of same constant »
                    in list partitioning
```

Como todas as linhas com o valor da coluna `data` `12` já foram atribuídas à partição `p1`, você não pode criar uma nova partição na tabela `tt` que inclua `12` na sua lista de valores. Para realizar isso, você pode descartar `p1`, e adicionar `np` e, em seguida, uma nova `p1` com uma definição modificada. No entanto, como discutido anteriormente, isso resultaria na perda de todos os dados armazenados em `p1`—e muitas vezes é o caso de que isso não é o que você realmente quer fazer. Outra solução pode parecer ser fazer uma cópia da tabela com a nova partição e copiar os dados nela usando `CREATE TABLE ... SELECT ...`, em seguida, descartar a tabela antiga e renomear a nova, mas isso pode ser muito demorado ao lidar com grandes quantidades de dados. Isso também pode não ser viável em situações onde a alta disponibilidade é um requisito.

Você pode adicionar várias partições em uma única declaração `ALTER TABLE ... ADD PARTITION` como mostrado aqui:

```
CREATE TABLE employees (
  id INT NOT NULL,
  fname VARCHAR(50) NOT NULL,
  lname VARCHAR(50) NOT NULL,
  hired DATE NOT NULL
)
PARTITION BY RANGE( YEAR(hired) ) (
  PARTITION p1 VALUES LESS THAN (1991),
  PARTITION p2 VALUES LESS THAN (1996),
  PARTITION p3 VALUES LESS THAN (2001),
  PARTITION p4 VALUES LESS THAN (2005)
);

ALTER TABLE employees ADD PARTITION (
    PARTITION p5 VALUES LESS THAN (2010),
    PARTITION p6 VALUES LESS THAN MAXVALUE
);
```

Felizmente, a implementação de particionamento do MySQL oferece maneiras de redefinir particionamentos sem perder dados. Vamos primeiro analisar alguns exemplos simples envolvendo particionamento do `RANGE`. Lembre-se da tabela `members` que agora está definida como mostrado aqui:

```
mysql> SHOW CREATE TABLE members\G
*************************** 1. row ***************************
       Table: members
Create Table: CREATE TABLE `members` (
  `id` int(11) DEFAULT NULL,
  `fname` varchar(25) DEFAULT NULL,
  `lname` varchar(25) DEFAULT NULL,
  `dob` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
/*!50100 PARTITION BY RANGE ( YEAR(dob))
(PARTITION n0 VALUES LESS THAN (1970) ENGINE = InnoDB,
 PARTITION n1 VALUES LESS THAN (1980) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2010) ENGINE = InnoDB) */
1 row in set (0.00 sec)
```

Suponha que você queira mover todas as linhas que representam membros nascidos antes de 1960 para uma partição separada. Como já vimos, isso não pode ser feito usando `ALTER TABLE ... ADD PARTITION`. No entanto, você pode usar outra extensão relacionada a partições para `ALTER TABLE` para realizar isso:

```
ALTER TABLE members REORGANIZE PARTITION n0 INTO (
    PARTITION s0 VALUES LESS THAN (1960),
    PARTITION s1 VALUES LESS THAN (1970)
);
```

Na verdade, este comando divide a partição `n0` em duas novas partições `s0` e `s1`. Também move os dados que estavam armazenados em `n0` para as novas partições de acordo com as regras contidas nas duas cláusulas `PARTITION ... VALUES ...`, de modo que `s0` contenha apenas aqueles registros para os quais `YEAR(dob)` é menor que 1960 e `s1` contenha as linhas nas quais `YEAR(dob)` é maior ou igual a 1960, mas menor que 1970.

Uma cláusula `REORGANIZE PARTITION` também pode ser usada para mesclar partições adjacentes. Você pode reverter o efeito da declaração anterior na tabela `members` como mostrado aqui:

```
ALTER TABLE members REORGANIZE PARTITION s0,s1 INTO (
    PARTITION p0 VALUES LESS THAN (1970)
);
```

Nenhum dado é perdido ao dividir ou combinar partições usando `REORGANIZE PARTITION`. Ao executar a declaração acima, o MySQL move todos os registros que foram armazenados nas partições `s0` e `s1` para a partição `p0`.

A sintaxe geral para `REORGANIZE PARTITION` é mostrada aqui:

```
ALTER TABLE tbl_name
    REORGANIZE PARTITION partition_list
    INTO (partition_definitions);
```

Aqui, *`tbl_name`* é o nome da tabela particionada, e *`partition_list`* é uma lista de nomes de uma ou mais partições existentes, separados por vírgula, que serão alteradas. *`partition_definitions`* é uma lista de novas definições de partições, separadas por vírgula, que seguem as mesmas regras que a lista *`partition_definitions`* usada em `CREATE TABLE`. Ao usar *`REORGANIZE PARTITION`*, você não está limitado a unir várias partições em uma, ou a dividir uma partição em muitas, por exemplo, você pode reorganizar as quatro partições da tabela *`members`* em duas, assim:

```
ALTER TABLE members REORGANIZE PARTITION p0,p1,p2,p3 INTO (
    PARTITION m0 VALUES LESS THAN (1980),
    PARTITION m1 VALUES LESS THAN (2000)
);
```

Você também pode usar `REORGANIZE PARTITION` com tabelas que são particionadas por `LIST`. Vamos voltar ao problema de adicionar uma nova partição à tabela particionada por lista `tt` e falhar porque a nova partição tinha um valor que já estava presente na lista de valores de uma das partições existentes. Podemos lidar com isso adicionando uma partição que contém apenas valores não conflitantes e, em seguida, reorganizando a nova partição e a existente para que o valor que foi armazenado na existente agora seja movido para a nova:

```
ALTER TABLE tt ADD PARTITION (PARTITION np VALUES IN (4, 8));
ALTER TABLE tt REORGANIZE PARTITION p1,np INTO (
    PARTITION p1 VALUES IN (6, 18),
    PARTITION np VALUES in (4, 8, 12)
);
```

Aqui estão alguns pontos importantes a serem considerados ao usar `ALTER TABLE ... REORGANIZE PARTITION` para repartir tabelas que estão particionadas por `RANGE` ou `LIST`:

* As opções `PARTITION` usadas para determinar o novo esquema de particionamento estão sujeitas às mesmas regras que as usadas com uma declaração `CREATE TABLE`.

Um novo esquema de particionamento `RANGE` não pode ter nenhum intervalo sobreposto; um novo esquema de particionamento `LIST` não pode ter nenhum conjunto de valores sobreposto.

* A combinação das divisões na lista *`partition_definitions`* deve considerar a mesma faixa ou conjunto de valores no geral, como as divisões combinadas mencionadas no *`partition_list`*.

Por exemplo, as partições `p1` e `p2` cobrem juntas os anos de 1980 a 1999 na tabela `members`, usada como exemplo nesta seção. Qualquer reorganização dessas duas partições deve cobrir o mesmo intervalo de anos no geral.

* Para tabelas particionadas por `RANGE`, você pode reorganizar apenas as partições adjacentes; não é possível pular partições de intervalo.

Por exemplo, você não poderia reorganizar a tabela `members` usando uma declaração que comece com `ALTER TABLE members REORGANIZE PARTITION p0,p2 INTO ...`, porque `p0` cobre os anos anteriores a 1970 e `p2` os anos de 1990 a 1999 inclusive, portanto, essas não são partições adjacentes. (Você não pode pular a partição `p1` neste caso.)

* Você não pode usar `REORGANIZE PARTITION` para alterar o tipo de particionamento usado pela tabela (por exemplo, você não pode alterar as partições `RANGE` para partições `HASH` ou vice-versa). Além disso, você não pode usar essa declaração para alterar a expressão de particionamento ou coluna. Para realizar qualquer uma dessas tarefas sem descartar e recriar a tabela, você pode usar `ALTER TABLE ... PARTITION BY ...`, como mostrado aqui:

  ```
  ALTER TABLE members
      PARTITION BY HASH( YEAR(dob) )
      PARTITIONS 8;
  ```

### 26.3.2 Gestão de Partições HASH e KEY

As tabelas que são particionadas por hash ou por chave são muito semelhantes entre si em relação à realização de alterações em uma configuração de particionamento, e ambas diferem de várias maneiras das tabelas que foram particionadas por faixa ou lista. Por esse motivo, esta seção aborda a modificação de tabelas particionadas por hash ou por chave apenas. Para uma discussão sobre a adição e remoção de particionamentos de tabelas que são particionadas por faixa ou lista, consulte a Seção 26.3.1, “Gestão de Partições RANGE e LIST”.

Você não pode excluir partições de tabelas que estão particionadas por `HASH` ou `KEY` da mesma maneira que você pode fazer com tabelas que estão particionadas por `RANGE` ou `LIST`. No entanto, você pode combinar as partições de `HASH` ou `KEY` usando `ALTER TABLE ... COALESCE PARTITION`. Suponha que uma tabela `clients` contendo dados sobre clientes esteja dividida em 12 partições, criadas como mostrado aqui:

```
CREATE TABLE clients (
    id INT,
    fname VARCHAR(30),
    lname VARCHAR(30),
    signed DATE
)
PARTITION BY HASH( MONTH(signed) )
PARTITIONS 12;
```

Para reduzir o número de partições de 12 para 8, execute a seguinte instrução `ALTER TABLE`:

```
mysql> ALTER TABLE clients COALESCE PARTITION 4;
Query OK, 0 rows affected (0.02 sec)
```

`COALESCE` funciona igualmente bem com tabelas que são particionadas por `HASH`, `KEY`, `LINEAR HASH` ou `LINEAR KEY`. Aqui está um exemplo semelhante ao anterior, diferindo apenas no fato de que a tabela é particionada por `LINEAR KEY`:

```
mysql> CREATE TABLE clients_lk (
    ->     id INT,
    ->     fname VARCHAR(30),
    ->     lname VARCHAR(30),
    ->     signed DATE
    -> )
    -> PARTITION BY LINEAR KEY(signed)
    -> PARTITIONS 12;
Query OK, 0 rows affected (0.03 sec)

mysql> ALTER TABLE clients_lk COALESCE PARTITION 4;
Query OK, 0 rows affected (0.06 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

O número que segue `COALESCE PARTITION` é o número de partições a serem reunidas no restante — em outras palavras, é o número de partições a serem removidas da tabela.

Tentar remover mais partições do que as que estão na tabela resulta em um erro como este:

```
mysql> ALTER TABLE clients COALESCE PARTITION 18;
ERROR 1478 (HY000): Cannot remove all partitions, use DROP TABLE instead
```

Para aumentar o número de partições para a tabela `clients` de 12 para 18, use `ALTER TABLE ... ADD PARTITION` conforme mostrado aqui:

```
ALTER TABLE clients ADD PARTITION PARTITIONS 6;
```

### 26.3.3 Trocando Partições e Subpartições com Tabelas

Em MySQL 8.0, é possível trocar uma partição ou subpartição de uma tabela com uma tabela usando `ALTER TABLE pt EXCHANGE PARTITION p WITH TABLE nt`, onde *`pt`* é a tabela particionada e *`p`* é a partição ou subpartição de *`pt`* a ser trocada com a tabela não particionada *`nt`*, desde que as seguintes afirmações sejam verdadeiras:

A tabela *`nt`* não é ela mesma particionada.

2. A tabela *`nt`* não é uma tabela temporária.

3. As estruturas das tabelas *`pt`* e *`nt`* são, de outra forma, idênticas.

4. A tabela `nt` não contém referências de chave estrangeira, e nenhuma outra tabela tem chaves estrangeiras que se referem a `nt`.

5. Não há linhas em *`nt`* que estejam fora dos limites da definição de partição para *`p`*. Esta condição não se aplica se `WITHOUT VALIDATION` for utilizado.

6. Ambas as tabelas devem usar o mesmo conjunto de caracteres e ordenação.
7. Para as tabelas `InnoDB`, ambas as tabelas devem usar o mesmo formato de linha. Para determinar o formato de linha de uma tabela `InnoDB`, consulte `INFORMATION_SCHEMA.INNODB_TABLES`.

8. Qualquer configuração de nível de partição `MAX_ROWS` para `p` deve ser a mesma que o valor de nível de tabela `MAX_ROWS` definido para `nt`. A configuração de qualquer configuração de nível de partição `MIN_ROWS` para `p` também deve ser a mesma que qualquer valor de nível de tabela `MIN_ROWS` definido para `nt`.

Isso é verdadeiro em qualquer caso, independentemente de o `pt` ter uma opção explícita de nível de tabela `MAX_ROWS` ou `MIN_ROWS` em vigor.

9. O `AVG_ROW_LENGTH` não pode diferenciar entre as duas tabelas `pt` e `nt`.

10. `pt` não tem nenhuma partição que utilize a opção `DATA DIRECTORY`. Essa restrição é levantada para as tabelas `InnoDB` no MySQL 8.0.14 e versões posteriores.

11. `INDEX DIRECTORY` não pode diferenciar a tabela da partição que será trocada com ela.

12. Nenhuma opção da tabela ou da partição `TABLESPACE` pode ser usada em nenhuma das tabelas.

Além dos privilégios `ALTER`, `INSERT` e `CREATE` geralmente necessários para as declarações `ALTER TABLE`, você deve ter o privilégio `DROP` para realizar `ALTER TABLE ... EXCHANGE PARTITION`.

Você também deve estar ciente dos seguintes efeitos do `ALTER TABLE ... EXCHANGE PARTITION`:

* A execução de `ALTER TABLE ... EXCHANGE PARTITION` não invoca nenhum gatilho na tabela particionada ou na tabela que será trocada.

* Quaisquer colunas `AUTO_INCREMENT` na tabela trocada são redefinidas.

* A palavra-chave `IGNORE` não tem efeito quando usada com `ALTER TABLE ... EXCHANGE PARTITION`.

A sintaxe para `ALTER TABLE ... EXCHANGE PARTITION` é mostrada aqui, onde *`pt`* é a tabela particionada, *`p`* é a partição (ou subpartição) a ser trocada e *`nt`* é a tabela não particionada a ser trocada com *`p`*:

```
ALTER TABLE pt
    EXCHANGE PARTITION p
    WITH TABLE nt;
```

Opcionalmente, você pode adicionar `WITH VALIDATION` ou `WITHOUT VALIDATION`. Quando `WITHOUT VALIDATION` é especificado, a operação `ALTER TABLE ... EXCHANGE PARTITION` não realiza validação linha a linha ao trocar uma tabela não particionada, permitindo que os administradores de banco de dados assumam a responsabilidade de garantir que as linhas estejam dentro dos limites da definição da partição. `WITH VALIDATION` é o padrão.

Uma e apenas uma partição ou subpartição pode ser trocada com uma e apenas uma tabela não particionada em uma única declaração `ALTER TABLE EXCHANGE PARTITION`. Para trocar múltiplas partições ou subpartições, use múltiplas declarações `ALTER TABLE EXCHANGE PARTITION`. `EXCHANGE PARTITION` não pode ser combinado com outras opções `ALTER TABLE`. A partição e (se aplicável) a subpartição usadas pela tabela particionada podem ser de qualquer tipo ou tipos suportados no MySQL 8.0.

#### Trocando uma partição com uma tabela não particionada

Suponha que uma tabela dividida `e` tenha sido criada e preenchida usando os seguintes comandos SQL:

```
CREATE TABLE e (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
)
    PARTITION BY RANGE (id) (
        PARTITION p0 VALUES LESS THAN (50),
        PARTITION p1 VALUES LESS THAN (100),
        PARTITION p2 VALUES LESS THAN (150),
        PARTITION p3 VALUES LESS THAN (MAXVALUE)
);

INSERT INTO e VALUES
    (1669, "Jim", "Smith"),
    (337, "Mary", "Jones"),
    (16, "Frank", "White"),
    (2005, "Linda", "Black");
```

Agora, criamos uma cópia não particionada de `e` chamada `e2`. Isso pode ser feito usando o cliente **mysql** como mostrado aqui:

```
mysql> CREATE TABLE e2 LIKE e;
Query OK, 0 rows affected (0.04 sec)

mysql> ALTER TABLE e2 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.07 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Você pode ver quais partições na tabela `e` contêm linhas fazendo uma consulta à tabela do esquema de informações `PARTITIONS`, assim:

```
mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Nota

Para tabelas `InnoDB` particionadas, o número de linhas fornecido na coluna `TABLE_ROWS` da tabela do Esquema de Informações `PARTITIONS` é apenas um valor estimado utilizado na otimização do SQL e nem sempre é exato.

Para trocar a partição `p0` na tabela `e` com a tabela `e2`, você pode usar `ALTER TABLE`, conforme mostrado aqui:

```
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
Query OK, 0 rows affected (0.04 sec)
```

Mais precisamente, a declaração que acabou de ser emitida faz com que as linhas encontradas na partição sejam trocadas com as encontradas na tabela. Você pode observar como isso aconteceu consultando a tabela do esquema de informações `PARTITIONS`, como antes. A linha da tabela que estava anteriormente encontrada na partição `p0` não está mais presente:

```
mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)
```

Se você consultar a tabela `e2`, poderá ver que a linha “desaparecida” agora pode ser encontrada lá:

```
mysql> SELECT * FROM e2;
+----+-------+-------+
| id | fname | lname |
+----+-------+-------+
| 16 | Frank | White |
+----+-------+-------+
1 row in set (0.00 sec)
```

A tabela que será trocada com a partição não precisa necessariamente estar vazia. Para demonstrar isso, primeiro inserimos uma nova linha na tabela `e`, garantindo que essa linha seja armazenada na partição `p0` escolhendo um valor da coluna `id` que seja menor que 50, e verificando isso posteriormente, fazendo uma consulta à tabela `PARTITIONS`:

```
mysql> INSERT INTO e VALUES (41, "Michael", "Green");
Query OK, 1 row affected (0.05 sec)

mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)
```

Agora, trocamos novamente a partição `p0` com a tabela `e2` usando a mesma declaração `ALTER TABLE` que foi usada anteriormente:

```
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
Query OK, 0 rows affected (0.28 sec)
```

A saída das seguintes consultas mostra que a linha da tabela que foi armazenada na partição `p0` e a linha da tabela que foi armazenada na tabela `e2`, antes de emitir a declaração `ALTER TABLE`, agora trocou de lugar:

```
mysql> SELECT * FROM e;
+------+-------+-------+
| id   | fname | lname |
+------+-------+-------+
|   16 | Frank | White |
| 1669 | Jim   | Smith |
|  337 | Mary  | Jones |
| 2005 | Linda | Black |
+------+-------+-------+
4 rows in set (0.00 sec)

mysql> SELECT PARTITION_NAME, TABLE_ROWS
           FROM INFORMATION_SCHEMA.PARTITIONS
           WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          1 |
| p1             |          0 |
| p2             |          0 |
| p3             |          3 |
+----------------+------------+
4 rows in set (0.00 sec)

mysql> SELECT * FROM e2;
+----+---------+-------+
| id | fname   | lname |
+----+---------+-------+
| 41 | Michael | Green |
+----+---------+-------+
1 row in set (0.00 sec)
```

#### Linhas não correspondentes

Você deve ter em mente que quaisquer linhas encontradas na tabela não particionada antes de emitir a declaração `ALTER TABLE ... EXCHANGE PARTITION` devem atender às condições necessárias para que elas sejam armazenadas na partição de destino; caso contrário, a declaração falha. Para ver como isso ocorre, primeiro insira uma linha no `e2` que esteja fora dos limites da definição de partição para a partição `p0` da tabela `e`. Por exemplo, insira uma linha com um valor na coluna `id` que seja muito grande; então, tente trocar a tabela com a partição novamente:

```
mysql> INSERT INTO e2 VALUES (51, "Ellen", "McDonald");
Query OK, 1 row affected (0.08 sec)

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2;
ERROR 1707 (HY000): Found row that does not match the partition
```

Somente a opção `WITHOUT VALIDATION` permitiria que essa operação tivesse sucesso:

```
mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2 WITHOUT VALIDATION;
Query OK, 0 rows affected (0.02 sec)
```

Quando uma partição é trocada por uma tabela que contém linhas que não correspondem à definição da partição, é responsabilidade do administrador do banco de dados corrigir as linhas que não correspondem, o que pode ser feito usando `REPAIR TABLE` ou `ALTER TABLE ... REPAIR PARTITION`.

#### Trocando Partições sem Validação Linha a Linha

Para evitar a validação demorada ao trocar uma partição com uma tabela que tem muitas linhas, é possível pular a etapa de validação linha por linha, anexando `WITHOUT VALIDATION` à declaração `ALTER TABLE ... EXCHANGE PARTITION`.

O exemplo a seguir compara a diferença nos tempos de execução ao trocar uma partição com uma tabela não particionada, com e sem validação. A tabela particionada (tabela `e`) contém duas partições de 1 milhão de linhas cada uma. As linhas de p0 da tabela e são removidas e p0 é trocado por uma tabela não particionada de 1 milhão de linhas. A operação `WITH VALIDATION` leva 0,74 segundos. Em comparação, a operação `WITHOUT VALIDATION` leva 0,01 segundos.

```
# Create a partitioned table with 1 million rows in each partition

CREATE TABLE e (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
)
    PARTITION BY RANGE (id) (
        PARTITION p0 VALUES LESS THAN (1000001),
        PARTITION p1 VALUES LESS THAN (2000001),
);

mysql> SELECT COUNT(*) FROM e;
| COUNT(*) |
+----------+
|  2000000 |
+----------+
1 row in set (0.27 sec)

# View the rows in each partition

SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+-------------+
| PARTITION_NAME | TABLE_ROWS  |
+----------------+-------------+
| p0             |     1000000 |
| p1             |     1000000 |
+----------------+-------------+
2 rows in set (0.00 sec)

# Create a nonpartitioned table of the same structure and populate it with 1 million rows

CREATE TABLE e2 (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
);

mysql> SELECT COUNT(*) FROM e2;
+----------+
| COUNT(*) |
+----------+
|  1000000 |
+----------+
1 row in set (0.24 sec)

# Create another nonpartitioned table of the same structure and populate it with 1 million rows

CREATE TABLE e3 (
    id INT NOT NULL,
    fname VARCHAR(30),
    lname VARCHAR(30)
);

mysql> SELECT COUNT(*) FROM e3;
+----------+
| COUNT(*) |
+----------+
|  1000000 |
+----------+
1 row in set (0.25 sec)

# Drop the rows from p0 of table e

mysql> DELETE FROM e WHERE id < 1000001;
Query OK, 1000000 rows affected (5.55 sec)

# Confirm that there are no rows in partition p0

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)

# Exchange partition p0 of table e with the table e2 'WITH VALIDATION'

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e2 WITH VALIDATION;
Query OK, 0 rows affected (0.74 sec)

# Confirm that the partition was exchanged with table e2

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |    1000000 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)

# Once again, drop the rows from p0 of table e

mysql> DELETE FROM e WHERE id < 1000001;
Query OK, 1000000 rows affected (5.55 sec)

# Confirm that there are no rows in partition p0

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |          0 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)

# Exchange partition p0 of table e with the table e3 'WITHOUT VALIDATION'

mysql> ALTER TABLE e EXCHANGE PARTITION p0 WITH TABLE e3 WITHOUT VALIDATION;
Query OK, 0 rows affected (0.01 sec)

# Confirm that the partition was exchanged with table e3

mysql> SELECT PARTITION_NAME, TABLE_ROWS FROM INFORMATION_SCHEMA.PARTITIONS WHERE TABLE_NAME = 'e';
+----------------+------------+
| PARTITION_NAME | TABLE_ROWS |
+----------------+------------+
| p0             |    1000000 |
| p1             |    1000000 |
+----------------+------------+
2 rows in set (0.00 sec)
```

Se uma partição for trocada por uma tabela que contém linhas que não correspondem à definição da partição, é responsabilidade do administrador do banco de dados corrigir as linhas que não correspondem, o que pode ser feito usando `REPAIR TABLE` ou `ALTER TABLE ... REPAIR PARTITION`.

#### Trocando uma subpartição com uma tabela não particionada

Você também pode trocar uma subpartição de uma tabela particionada (consulte a Seção 26.2.6, “Subpartição”) por uma tabela não particionada usando uma declaração `ALTER TABLE ... EXCHANGE PARTITION`. No exemplo a seguir, primeiro criamos uma tabela `es` que é particionada por `RANGE` e subparticionada por `KEY`, preenchendo esta tabela como fizemos com a tabela `e`, e depois criamos uma cópia vazia e não particionada `es2` da tabela, como mostrado aqui:

```
mysql> CREATE TABLE es (
    ->     id INT NOT NULL,
    ->     fname VARCHAR(30),
    ->     lname VARCHAR(30)
    -> )
    ->     PARTITION BY RANGE (id)
    ->     SUBPARTITION BY KEY (lname)
    ->     SUBPARTITIONS 2 (
    ->         PARTITION p0 VALUES LESS THAN (50),
    ->         PARTITION p1 VALUES LESS THAN (100),
    ->         PARTITION p2 VALUES LESS THAN (150),
    ->         PARTITION p3 VALUES LESS THAN (MAXVALUE)
    ->     );
Query OK, 0 rows affected (2.76 sec)

mysql> INSERT INTO es VALUES
    ->     (1669, "Jim", "Smith"),
    ->     (337, "Mary", "Jones"),
    ->     (16, "Frank", "White"),
    ->     (2005, "Linda", "Black");
Query OK, 4 rows affected (0.04 sec)
Records: 4  Duplicates: 0  Warnings: 0

mysql> CREATE TABLE es2 LIKE es;
Query OK, 0 rows affected (1.27 sec)

mysql> ALTER TABLE es2 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.70 sec)
Records: 0  Duplicates: 0  Warnings: 0
```

Embora não tenhamos explicitamente nomeado nenhuma das subdivisões ao criar a tabela `es`, podemos obter nomes gerados para essas subdivisões incluindo a coluna `SUBPARTITION_NAME` da tabela `PARTITIONS` de `INFORMATION_SCHEMA` ao selecionar dessa tabela, como mostrado aqui:

```
mysql> SELECT PARTITION_NAME, SUBPARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'es';
+----------------+-------------------+------------+
| PARTITION_NAME | SUBPARTITION_NAME | TABLE_ROWS |
+----------------+-------------------+------------+
| p0             | p0sp0             |          1 |
| p0             | p0sp1             |          0 |
| p1             | p1sp0             |          0 |
| p1             | p1sp1             |          0 |
| p2             | p2sp0             |          0 |
| p2             | p2sp1             |          0 |
| p3             | p3sp0             |          3 |
| p3             | p3sp1             |          0 |
+----------------+-------------------+------------+
8 rows in set (0.00 sec)
```

A seguinte declaração `ALTER TABLE` substitui a subpartição `p3sp0` na tabela `es` pela tabela não particionada `es2`:

```
mysql> ALTER TABLE es EXCHANGE PARTITION p3sp0 WITH TABLE es2;
Query OK, 0 rows affected (0.29 sec)
```

Você pode verificar se as linhas foram trocadas executando as seguintes consultas:

```
mysql> SELECT PARTITION_NAME, SUBPARTITION_NAME, TABLE_ROWS
    ->     FROM INFORMATION_SCHEMA.PARTITIONS
    ->     WHERE TABLE_NAME = 'es';
+----------------+-------------------+------------+
| PARTITION_NAME | SUBPARTITION_NAME | TABLE_ROWS |
+----------------+-------------------+------------+
| p0             | p0sp0             |          1 |
| p0             | p0sp1             |          0 |
| p1             | p1sp0             |          0 |
| p1             | p1sp1             |          0 |
| p2             | p2sp0             |          0 |
| p2             | p2sp1             |          0 |
| p3             | p3sp0             |          0 |
| p3             | p3sp1             |          0 |
+----------------+-------------------+------------+
8 rows in set (0.00 sec)

mysql> SELECT * FROM es2;
+------+-------+-------+
| id   | fname | lname |
+------+-------+-------+
| 1669 | Jim   | Smith |
|  337 | Mary  | Jones |
| 2005 | Linda | Black |
+------+-------+-------+
3 rows in set (0.00 sec)
```

Se uma tabela estiver subpartida, você pode trocar apenas uma subpartição da tabela — não uma partição inteira — com uma tabela não particionada, como mostrado aqui:

```
mysql> ALTER TABLE es EXCHANGE PARTITION p3 WITH TABLE es2;
ERROR 1704 (HY000): Subpartitioned table, use subpartition instead of partition
```

As estruturas de tabela são comparadas de forma rigorosa; o número, a ordem, os nomes e os tipos de colunas e índices da tabela particionada e da tabela não particionada devem corresponder exatamente. Além disso, ambas as tabelas devem usar o mesmo mecanismo de armazenamento:

```
mysql> CREATE TABLE es3 LIKE e;
Query OK, 0 rows affected (1.31 sec)

mysql> ALTER TABLE es3 REMOVE PARTITIONING;
Query OK, 0 rows affected (0.53 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> SHOW CREATE TABLE es3\G
*************************** 1. row ***************************
       Table: es3
Create Table: CREATE TABLE `es3` (
  `id` int(11) NOT NULL,
  `fname` varchar(30) DEFAULT NULL,
  `lname` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
1 row in set (0.00 sec)

mysql> ALTER TABLE es3 ENGINE = MyISAM;
Query OK, 0 rows affected (0.15 sec)
Records: 0  Duplicates: 0  Warnings: 0

mysql> ALTER TABLE es EXCHANGE PARTITION p3sp0 WITH TABLE es3;
ERROR 1497 (HY000): The mix of handlers in the partitions is not allowed in this version of MySQL
```

### 26.3.4 Manutenção de Partições

Uma série de tarefas de manutenção de tabela e partição podem ser realizadas em tabelas particionadas usando instruções SQL destinadas a tais propósitos.

A manutenção de tabelas particionadas pode ser realizada usando as declarações `CHECK TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE` e `REPAIR TABLE`, que são suportadas para tabelas particionadas.

Você pode usar várias extensões para `ALTER TABLE` para realizar operações desse tipo em uma ou mais partições diretamente, conforme descrito na lista a seguir:

* **Rebuilding partitions.** Reconstrói a partição; isso tem o mesmo efeito que descartar todos os registros armazenados na partição e, em seguida, reinserí-los. Isso pode ser útil para fins de desfragmentação.

Exemplo:

  ```
  ALTER TABLE t1 REBUILD PARTITION p0, p1;
  ```

* **Otimização de partições.** Se você tiver excluído um grande número de linhas de uma partição ou se tiver feito muitas alterações em uma tabela particionada com linhas de comprimento variável (ou seja, com colunas `VARCHAR`, `BLOB` ou `TEXT`), você pode usar `ALTER TABLE ... OPTIMIZE PARTITION` para recuperar qualquer espaço não utilizado e para defragmentar o arquivo de dados da partição.

Exemplo:

  ```
  ALTER TABLE t1 OPTIMIZE PARTITION p0, p1;
  ```

Usar `OPTIMIZE PARTITION` em uma partição específica é equivalente a executar `CHECK PARTITION`, `ANALYZE PARTITION` e `REPAIR PARTITION` nessa partição.

Alguns motores de armazenamento do MySQL, incluindo `InnoDB`, não suportam otimização por partição; nesses casos, `ALTER TABLE ... OPTIMIZE PARTITION` analisa e reconstrui toda a tabela, e emite um aviso apropriado. (Bug #11751825, Bug #42822) Use `ALTER TABLE ... REBUILD PARTITION` e `ALTER TABLE ... ANALYZE PARTITION` em vez disso, para evitar esse problema.

* **Analisando partições.** Isso lê e armazena as distribuições de chave para as partições.

Exemplo:

  ```
  ALTER TABLE t1 ANALYZE PARTITION p3;
  ```

* **Reparar partições.** Isso conserta partições corrompidas.

Exemplo:

  ```
  ALTER TABLE t1 REPAIR PARTITION p0,p1;
  ```

Normalmente, `REPAIR PARTITION` falha quando a partição contém erros de chave duplicada. Você pode usar `ALTER IGNORE TABLE` com essa opção, nesse caso, todas as linhas que não podem ser movidas devido à presença de chaves duplicadas são removidas da partição (Bug #16900947).

* **Verifique as partições.** Você pode verificar as partições em busca de erros da mesma maneira que pode usar `CHECK TABLE` com tabelas não particionadas.

Exemplo:

  ```
  ALTER TABLE trb3 CHECK PARTITION p1;
  ```

Esta declaração informa se os dados ou índices na partição `p1` da tabela `t1` estão corrompidos. Se este for o caso, use `ALTER TABLE ... REPAIR PARTITION` para reparar a partição.

Normalmente, `CHECK PARTITION` falha quando a partição contém erros de chave duplicada. Você pode usar `ALTER IGNORE TABLE` com essa opção, nesse caso, a declaração retorna o conteúdo de cada linha na partição onde é encontrada uma violação de chave duplicada. Apenas os valores das colunas na expressão de particionamento da tabela são relatados. (Bug #16900947)

Cada uma das declarações na lista mostrada acima também suporta a palavra-chave `ALL` no lugar da lista de nomes de partição. Usar `ALL` faz com que a declaração atue em todas as partições da tabela.

Você também pode truncar partições usando `ALTER TABLE ... TRUNCATE PARTITION`. Essa declaração pode ser usada para excluir todas as linhas de uma ou mais partições da mesma maneira que `TRUNCATE TABLE` exclui todas as linhas de uma tabela.

`ALTER TABLE ... TRUNCATE PARTITION ALL` trunca todas as partições na tabela.

### 26.3.5 Obter informações sobre partições

Esta seção discute a obtenção de informações sobre partições existentes, que podem ser feitas de várias maneiras. Os métodos de obtenção dessas informações incluem os seguintes:

* Use a declaração `SHOW CREATE TABLE` para visualizar as cláusulas de particionamento usadas na criação de uma tabela particionada.

* Utilizando a declaração `SHOW TABLE STATUS` para determinar se uma tabela está particionada.

* Consultando a tabela do esquema de informações `PARTITIONS`.

* Use a declaração `EXPLAIN SELECT` para ver quais partições são usadas por um dado `SELECT`.

A partir do MySQL 8.0.16, quando são feitas inserções, exclusões ou atualizações em tabelas particionadas, os registros do log binário registram informações sobre a partição e (se houver) a subpartição na qual o evento da linha ocorreu. Um novo evento de linha é criado para uma modificação que ocorre em uma partição ou subpartição diferente, mesmo que a tabela envolvida seja a mesma. Portanto, se uma transação envolve três partições ou subpartições, três eventos de linha são gerados. Para um evento de atualização, as informações da partição são registradas tanto para a imagem “antes” quanto para a imagem “depois”. As informações da partição são exibidas se você especificar a opção `-v` ou `--verbose` ao visualizar o log binário usando **mysqlbinlog**. As informações da partição são registradas apenas quando o registro baseado em linha está em uso (`binlog_format=ROW`).

Como discutido em outros lugares deste capítulo, `SHOW CREATE TABLE` inclui em sua saída a cláusula `PARTITION BY`, usada para criar uma tabela particionada. Por exemplo:

```
mysql> SHOW CREATE TABLE trb3\G
*************************** 1. row ***************************
       Table: trb3
Create Table: CREATE TABLE `trb3` (
  `id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `purchased` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
/*!50100 PARTITION BY RANGE (YEAR(purchased))
(PARTITION p0 VALUES LESS THAN (1990) ENGINE = InnoDB,
 PARTITION p1 VALUES LESS THAN (1995) ENGINE = InnoDB,
 PARTITION p2 VALUES LESS THAN (2000) ENGINE = InnoDB,
 PARTITION p3 VALUES LESS THAN (2005) ENGINE = InnoDB) */
0 row in set (0.00 sec)
```

A saída do `SHOW TABLE STATUS` para tabelas particionadas é a mesma que para tabelas não particionadas, exceto que a coluna `Create_options` contém a string `partitioned`. A coluna `Engine` contém o nome do mecanismo de armazenamento usado por todas as partições da tabela. (Consulte a Seção 15.7.7.38, “Declaração SHOW TABLE STATUS”, para obter mais informações sobre essa declaração.)

Você também pode obter informações sobre partições em `INFORMATION_SCHEMA`, que contém uma tabela `PARTITIONS`. Veja a Seção 28.3.21, “A tabela INFORMATION_SCHEMA PARTITIONS”.

É possível determinar quais partições de uma tabela particionada estão envolvidas em uma consulta específica do `SELECT` usando o `EXPLAIN`. A coluna `partitions` no resultado do `EXPLAIN` lista as partições das quais os registros seriam correspondidos pela consulta.

Suponha que uma tabela `trb1` seja criada e preenchida da seguinte forma:

```
CREATE TABLE trb1 (id INT, name VARCHAR(50), purchased DATE)
    PARTITION BY RANGE(id)
    (
        PARTITION p0 VALUES LESS THAN (3),
        PARTITION p1 VALUES LESS THAN (7),
        PARTITION p2 VALUES LESS THAN (9),
        PARTITION p3 VALUES LESS THAN (11)
    );

INSERT INTO trb1 VALUES
    (1, 'desk organiser', '2003-10-15'),
    (2, 'CD player', '1993-11-05'),
    (3, 'TV set', '1996-03-10'),
    (4, 'bookcase', '1982-01-10'),
    (5, 'exercise bike', '2004-05-09'),
    (6, 'sofa', '1987-06-05'),
    (7, 'popcorn maker', '2001-11-22'),
    (8, 'aquarium', '1992-08-04'),
    (9, 'study desk', '1984-09-16'),
    (10, 'lava lamp', '1998-12-25');
```

Você pode ver quais partições estão sendo usadas em uma consulta, como `SELECT * FROM trb1;`, conforme mostrado aqui:

```
mysql> EXPLAIN SELECT * FROM trb1\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: trb1
   partitions: p0,p1,p2,p3
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using filesort
```

Neste caso, todas as quatro partições são pesquisadas. No entanto, quando uma condição limitante que faz uso da chave de partição é adicionada à consulta, você pode ver que apenas aquelas partições que contêm valores correspondentes são analisadas, como mostrado aqui:

```
mysql> EXPLAIN SELECT * FROM trb1 WHERE id < 5\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: trb1
   partitions: p0,p1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 10
        Extra: Using where
```

`EXPLAIN` também fornece informações sobre as chaves utilizadas e possíveis chaves:

```
mysql> ALTER TABLE trb1 ADD PRIMARY KEY (id);
Query OK, 10 rows affected (0.03 sec)
Records: 10  Duplicates: 0  Warnings: 0

mysql> EXPLAIN SELECT * FROM trb1 WHERE id < 5\G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: trb1
   partitions: p0,p1
         type: range
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 4
          ref: NULL
         rows: 7
        Extra: Using where
```

Se o `EXPLAIN` for usado para examinar uma consulta em uma tabela não particionada, não será gerado nenhum erro, mas o valor da coluna `partitions` será sempre `NULL`.

A coluna `rows` do `EXPLAIN` de saída exibe o número total de linhas na tabela.

Veja também a Seção 15.8.2, “Instrução EXPLAIN”.