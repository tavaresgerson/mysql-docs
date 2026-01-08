### 3.6.9 Usando AUTO_INCREMENT

O atributo `AUTO_INCREMENT` pode ser usado para gerar uma identidade única para novas linhas:

```sql
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

```sql
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

Não foi especificado nenhum valor para a coluna `AUTO_INCREMENT`, então o MySQL atribuiu automaticamente os números de sequência. Você também pode atribuir explicitamente 0 à coluna para gerar números de sequência, a menos que o modo SQL `NO_AUTO_VALUE_ON_ZERO` esteja habilitado. Por exemplo:

```sql
INSERT INTO animals (id,name) VALUES(0,'groundhog');
```

Se a coluna for declarada como `NOT NULL`, também é possível atribuir `NULL` à coluna para gerar números de sequência. Por exemplo:

```sql
INSERT INTO animals (id,name) VALUES(NULL,'squirrel');
```

Quando você inserir qualquer outro valor em uma coluna `AUTO_INCREMENT`, a coluna é definida com esse valor e a sequência é redefinida para que o próximo valor gerado automaticamente siga sequencialmente a partir do maior valor da coluna. Por exemplo:

```sql
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

Atualizar o valor de uma coluna `AUTO_INCREMENT` existente em uma tabela `InnoDB` não redefiniu a sequência `AUTO_INCREMENT`, como acontece com as tabelas `MyISAM` e `NDB`.

Você pode recuperar o valor mais recente gerado automaticamente pelo `AUTO_INCREMENT` com a função SQL `LAST_INSERT_ID()` ou a função C API `mysql_insert_id()`. Essas funções são específicas da conexão, portanto, seus valores de retorno não são afetados por outra conexão que também esteja realizando inserções.

Use o menor tipo de dado inteiro para a coluna `AUTO_INCREMENT` que seja grande o suficiente para armazenar o valor máximo da sequência que você precisa. Quando a coluna atingir o limite superior do tipo de dados, a próxima tentativa de gerar um número de sequência falhará. Use o atributo `UNSIGNED` se possível para permitir uma faixa maior. Por exemplo, se você usar `TINYINT`, o número máximo de sequência permitido é 127. Para `TINYINT UNSIGNED`, o máximo é 255. Consulte Seção 11.1.2, “Tipos de Inteiro (Valor Exato) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT” para as faixas de todos os tipos de inteiros.

Nota

Para uma inserção de várias linhas, `LAST_INSERT_ID()` e `mysql_insert_id()` na verdade retornam a chave `AUTO_INCREMENT` do *primeiro* da(s) linha(s) inserida(s). Isso permite que as inserções de várias linhas sejam reproduzidas corretamente em outros servidores em uma configuração de replicação.

Para começar com um valor `AUTO_INCREMENT` diferente de 1, defina esse valor com `CREATE TABLE` (create-table.html) ou `ALTER TABLE` (alter-table.html), da seguinte forma:

```sql
mysql> ALTER TABLE tbl AUTO_INCREMENT = 100;
```

#### Notas do InnoDB

Para informações sobre o uso de `AUTO_INCREMENT` específico para `InnoDB`, consulte Seção 14.6.1.6, “Tratamento de `AUTO_INCREMENT` em InnoDB”.

#### Notas do MyISAM

- Para tabelas `MyISAM`, você pode especificar `AUTO_INCREMENT` em uma coluna secundária em um índice de múltiplas colunas. Nesse caso, o valor gerado para a coluna `AUTO_INCREMENT` é calculado como `MAX(auto_increment_column)`

  - 1 `WHERE prefix=given-prefix`. Isso é útil quando você deseja colocar dados em grupos ordenados.

  ```sql
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

  Retornos:

  ```sql
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

  Neste caso (quando a coluna `AUTO_INCREMENT` faz parte de um índice de múltiplas colunas), os valores `AUTO_INCREMENT` são reutilizados se você excluir a linha com o maior valor `AUTO_INCREMENT` em qualquer grupo. Isso acontece mesmo para tabelas `MyISAM`, para as quais os valores `AUTO_INCREMENT` normalmente não são reutilizados.

- Se a coluna `AUTO_INCREMENT` faz parte de vários índices, o MySQL gera valores de sequência usando o índice que começa com a coluna `AUTO_INCREMENT`, se houver um. Por exemplo, se a tabela `animais` contivesse os índices `PRIMARY KEY (grp, id)` e `INDEX (id)`, o MySQL ignoraria o `PRIMARY KEY` ao gerar valores de sequência. Como resultado, a tabela conterá uma única sequência, e não uma sequência por valor de `grp`.

#### Leia mais

Mais informações sobre `AUTO_INCREMENT` estão disponíveis aqui:

- Como atribuir o atributo `AUTO_INCREMENT` a uma coluna: Seção 13.1.18, "Instrução CREATE TABLE", e Seção 13.1.8, "Instrução ALTER TABLE".
- Como o `AUTO_INCREMENT` se comporta dependendo do modo SQL `NO_AUTO_VALUE_ON_ZERO`: Seção 5.1.10, "Modos SQL do Servidor".
- Como usar a função `LAST_INSERT_ID()` para encontrar a linha que contém o valor `AUTO_INCREMENT` mais recente: Seção 12.15, "Funções de Informação".
- Definindo o valor `AUTO_INCREMENT` a ser usado: Seção 5.1.7, "Variáveis do Sistema do Servidor".
- Seção 14.6.1.6, “Tratamento de AUTO_INCREMENT no InnoDB”
- `AUTO_INCREMENT` e replicação: Seção 16.4.1.1, “Replicação e AUTO_INCREMENT”.
- Variáveis do sistema do servidor relacionadas ao `AUTO_INCREMENT` (`auto_increment_increment` e `auto_increment_offset`) que podem ser usadas para replicação: Seção 5.1.7, “Variáveis do Sistema do Servidor”.
