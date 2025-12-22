### 5.6.9 Utilização de AUTO\_INCREMENT

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

Que retorna:

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

Nenhum valor foi especificado para a coluna `AUTO_INCREMENT`, então o MySQL atribuiu números de seqüência automaticamente. Você também pode atribuir explicitamente 0 à coluna para gerar números de seqüência, a menos que o modo `NO_AUTO_VALUE_ON_ZERO` esteja habilitado. Por exemplo:

```
INSERT INTO animals (id,name) VALUES(0,'groundhog');
```

Se a coluna é declarada como `NOT NULL`, também é possível atribuir `NULL` à coluna para gerar números de sequência. Por exemplo:

```
INSERT INTO animals (id,name) VALUES(NULL,'squirrel');
```

Quando você insere qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida para esse valor e a sequência é redefinida para que o próximo valor gerado automaticamente siga sequencialmente a partir do maior valor da coluna. Por exemplo:

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

A atualização de um valor existente da coluna `AUTO_INCREMENT` também redefine a sequência `AUTO_INCREMENT`.

Você pode recuperar o valor mais recente gerado automaticamente `AUTO_INCREMENT` com a função `LAST_INSERT_ID()` SQL ou a função `mysql_insert_id()` C API. Estas funções são específicas de conexão, então seus valores de retorno não são afetados por outra conexão que também está executando inserções.

Use o menor tipo de dados de inteiro para a coluna `AUTO_INCREMENT` que seja grande o suficiente para conter o valor máximo de sequência que você precisa. Quando a coluna atinge o limite superior do tipo de dados, a próxima tentativa de gerar um número de sequência falha. Use o atributo `UNSIGNED` se possível para permitir um intervalo maior. Por exemplo, se você usar `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), o número máximo de sequência permitido é 127. Para `TINYINT UNSIGNED`]]]\(integer-types.html), o máximo é 255.

::: info Note

Para uma inserção de várias linhas, `LAST_INSERT_ID()` e `mysql_insert_id()` retornam a chave `AUTO_INCREMENT` da primeira das linhas inseridas. Isso permite que inserções de várias linhas sejam reproduzidas corretamente em outros servidores em uma configuração de replicação.

:::

Para começar com um valor `AUTO_INCREMENT` diferente de 1, defina esse valor com \[`CREATE TABLE`] ((create-table.html) ou `ALTER TABLE`, assim:

```
mysql> ALTER TABLE tbl AUTO_INCREMENT = 100;
```

#### Notas do InnoDB

Para obter informações sobre o uso específico do `AUTO_INCREMENT` para o `InnoDB`, consulte a Seção 17.6.1.6, AUTO\_INCREMENT Handling in InnoDB.

#### Notas do MyISAM

- Para tabelas `MyISAM`, você pode especificar `AUTO_INCREMENT` em uma coluna secundária em um índice de múltiplas colunas. Neste caso, o valor gerado para a coluna `AUTO_INCREMENT` é calculado como

  - 1 WHERE prefix=given-prefix\`]\(aggregate-functions.html#function\_max). Isso é útil quando você deseja colocar dados em grupos ordenados.

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

  Que retorna:

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

  Neste caso (quando a coluna `AUTO_INCREMENT` é parte de um índice de múltiplas colunas), os valores `AUTO_INCREMENT` são reutilizados se você excluir a linha com o maior valor `AUTO_INCREMENT` em qualquer grupo. Isso acontece mesmo para tabelas `MyISAM`, para as quais os valores `AUTO_INCREMENT` normalmente não são reutilizados.
- Se a coluna `AUTO_INCREMENT` for parte de múltiplos índices, o MySQL gerará valores de sequência usando o índice que começa com a coluna `AUTO_INCREMENT`, se houver um. Por exemplo, se a tabela `animals` conter índices `PRIMARY KEY (grp, id)` e `INDEX (id)`, o MySQL ignoraria o `PRIMARY KEY` para gerar valores de sequência. Como resultado, a tabela conteria uma única sequência, não uma sequência por valor `grp`.

#### Leia mais

Mais informações sobre o `AUTO_INCREMENT` estão disponíveis aqui:

- Como atribuir o atributo `AUTO_INCREMENT` a uma coluna: Seção 15.1.20, CRIAR INFORMAÇÃO TABLAR, e Seção 15.1.9, ALTERAR INFORMAÇÃO TABLAR.
- Como `AUTO_INCREMENT` se comporta dependendo do `NO_AUTO_VALUE_ON_ZERO` modo SQL: Seção 7.1.11, Modos SQL do Servidor.
- Como usar a função `LAST_INSERT_ID()` para encontrar a linha que contém o valor `AUTO_INCREMENT` mais recente: Seção 14.15, Funções de informação.
- Definição do valor de `AUTO_INCREMENT` a utilizar: Secção 7.1.8, Variaveis do sistema do servidor.
- Seção 17.6.1.6, AUTO\_INCREMENT Manuseio no InnoDB
- \[`AUTO_INCREMENT`]] e replicação: Secção 19.5.1.1, Replicação e AUTO\_INCREMENTO.
- Variaveis do sistema do servidor relacionadas com o `AUTO_INCREMENT` (`auto_increment_increment` e `auto_increment_offset`) que podem ser usadas para replicação: Seção 7.1.8, Variaveis do sistema do servidor.
