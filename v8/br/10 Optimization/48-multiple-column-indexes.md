### 10.3.6 Índices de múltiplas colunas

O MySQL pode criar índices compostos (ou seja, índices em múltiplas colunas). Um índice pode consistir em até 16 colunas. Para certos tipos de dados, você pode indexar um prefixo da coluna (veja a Seção 10.3.5, “Índices de Colunas”).

O MySQL pode usar índices de múltiplas colunas para consultas que testam todas as colunas do índice ou consultas que testam apenas a primeira coluna, as duas primeiras colunas, as três primeiras colunas e assim por diante. Se você especificar as colunas na ordem correta na definição do índice, um único índice composto pode acelerar vários tipos de consultas na mesma tabela.

Um índice de múltiplas colunas pode ser considerado um array ordenado, cujas linhas contêm valores criados concatenando os valores das colunas indexadas.

::: info Nota

Como alternativa a um índice composto, você pode introduzir uma coluna que seja “hashada” com base em informações de outras colunas. Se essa coluna for curta, razoavelmente única e indexada, ela pode ser mais rápida do que um índice “largo” em muitas colunas. No MySQL, é muito fácil usar essa coluna extra:

```
SELECT * FROM tbl_name
  WHERE hash_col=MD5(CONCAT(val1,val2))
  AND col1=val1 AND col2=val2;
```


:::

Suponha que uma tabela tenha a seguinte especificação:

```
CREATE TABLE test (
    id         INT NOT NULL,
    last_name  CHAR(30) NOT NULL,
    first_name CHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX name (last_name,first_name)
);
```

O índice `name` é um índice sobre as colunas `last_name` e `first_name`. O índice pode ser usado para consultas que especificam valores em um intervalo conhecido para combinações de valores de `last_name` e `first_name`. Ele também pode ser usado para consultas que especificam apenas um valor de `last_name` porque essa coluna é um prefixo da esquerda do índice (como descrito mais adiante nesta seção). Portanto, o índice `name` é usado para consultas que especificam valores em:

```
SELECT * FROM test WHERE last_name='Jones';

SELECT * FROM test
  WHERE last_name='Jones' AND first_name='John';

SELECT * FROM test
  WHERE last_name='Jones'
  AND (first_name='John' OR first_name='Jon');

SELECT * FROM test
  WHERE last_name='Jones'
  AND first_name >='M' AND first_name < 'N';
```

No entanto, o índice `name` *não* é usado para consultas que especificam valores em:

```
SELECT * FROM test WHERE first_name='John';

SELECT * FROM test
  WHERE last_name='Jones' OR first_name='John';
```

Suponha que você emita a seguinte instrução `SELECT`:

```
SELECT * FROM tbl_name
  WHERE col1=val1 AND col2=val2;
```

Se um índice de múltiplas colunas existir em `col1` e `col2`, as linhas apropriadas podem ser recuperadas diretamente. Se existirem índices separados de uma única coluna em `col1` e `col2`, o otimizador tenta usar a otimização de fusão de índice (consulte a Seção 10.2.1.3, “Otimização de Fusão de Índices”) ou tenta encontrar o índice mais restritivo, decidindo qual índice exclui mais linhas e usando esse índice para recuperar as linhas.

Se a tabela tiver um índice de múltiplas colunas, qualquer prefixo mais à esquerda do índice pode ser usado pelo otimizador para buscar linhas. Por exemplo, se você tiver um índice de três colunas em `(col1, col2, col3)`, você indexou as capacidades de busca em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`.

O MySQL não pode usar o índice para realizar buscas se as colunas não formarem um prefixo mais à esquerda do índice. Suponha que você tenha as instruções `SELECT` mostradas aqui:

```
SELECT * FROM tbl_name WHERE col1=val1;
SELECT * FROM tbl_name WHERE col1=val1 AND col2=val2;

SELECT * FROM tbl_name WHERE col2=val2;
SELECT * FROM tbl_name WHERE col2=val2 AND col3=val3;
```

Se existir um índice em `(col1, col2, col3)`, apenas as duas primeiras consultas usam o índice. As três e quatro consultas envolvem colunas indexadas, mas não usam um índice para realizar buscas porque `(col2)` e `(col2, col3)` não são prefixos mais à esquerda de `(col1, col2, col3)`.