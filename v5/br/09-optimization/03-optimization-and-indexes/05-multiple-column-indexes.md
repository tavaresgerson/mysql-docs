### 8.3.5 Índices de múltiplas colunas

O MySQL pode criar índices compostos (ou seja, índices em múltiplas colunas). Um índice pode consistir em até 16 colunas. Para certos tipos de dados, você pode indexar um prefixo da coluna (consulte a Seção 8.3.4, “Índices de Coluna”).

O MySQL pode usar índices de múltiplos colunas para consultas que testam todas as colunas do índice ou consultas que testam apenas a primeira coluna, as duas primeiras colunas, as três primeiras colunas e assim por diante. Se você especificar as colunas na ordem correta na definição do índice, um único índice composto pode acelerar vários tipos de consultas na mesma tabela.

Um índice de múltiplas colunas pode ser considerado um array ordenado, cujas linhas contêm valores criados pela concatenação dos valores das colunas indexadas.

Nota

Como alternativa a um índice composto, você pode introduzir uma coluna que seja “hashada” com base em informações de outras colunas. Se essa coluna for curta, razoavelmente única e indexada, ela pode ser mais rápida do que um índice “amplo” em muitas colunas. No MySQL, é muito fácil usar essa coluna extra:

```sql
SELECT * FROM tbl_name
  WHERE hash_col=MD5(CONCAT(val1,val2))
  AND col1=val1 AND col2=val2;
```

Suponha que uma tabela tenha as seguintes especificações:

```sql
CREATE TABLE test (
    id         INT NOT NULL,
    last_name  CHAR(30) NOT NULL,
    first_name CHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX name (last_name,first_name)
);
```

O índice `name` é um índice sobre as colunas `last_name` e `first_name`. O índice pode ser usado para consultas que especificam valores em um intervalo conhecido para combinações de valores de `last_name` e `first_name`. Ele também pode ser usado para consultas que especificam apenas um valor de `last_name`, porque essa coluna é um prefixo da esquerda do índice (como descrito mais adiante nesta seção). Portanto, o índice `name` é usado para consultas nas seguintes consultas:

```sql
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

No entanto, o índice `name` *não* é usado para consultas nas seguintes consultas:

```sql
SELECT * FROM test WHERE first_name='John';

SELECT * FROM test
  WHERE last_name='Jones' OR first_name='John';
```

Suponha que você emita a seguinte instrução `SELECT`:

```sql
SELECT * FROM tbl_name
  WHERE col1=val1 AND col2=val2;
```

Se existir um índice de múltiplas colunas em `col1` e `col2`, as linhas apropriadas podem ser recuperadas diretamente. Se existirem índices separados de uma única coluna em `col1` e `col2`, o otimizador tenta usar a otimização de junção de índices (consulte a Seção 8.2.1.3, “Otimização de Junção de Índices”) ou tenta encontrar o índice mais restritivo, decidindo qual índice exclui mais linhas e usando esse índice para recuperar as linhas.

Se a tabela tiver um índice de múltiplas colunas, qualquer prefixo da esquerda do índice pode ser usado pelo otimizador para pesquisar linhas. Por exemplo, se você tiver um índice de três colunas em `(col1, col2, col3)`, você terá capacidades de pesquisa indexadas em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`.

O MySQL não pode usar o índice para realizar consultas se as colunas não formarem um prefixo da esquerda do índice. Suponha que você tenha as instruções `SELECT` mostradas aqui:

```sql
SELECT * FROM tbl_name WHERE col1=val1;
SELECT * FROM tbl_name WHERE col1=val1 AND col2=val2;

SELECT * FROM tbl_name WHERE col2=val2;
SELECT * FROM tbl_name WHERE col2=val2 AND col3=val3;
```

Se um índice existir em `(col1, col2, col3)`, apenas as duas primeiras consultas usam o índice. As terceira e quarta consultas envolvem colunas indexadas, mas não usam um índice para realizar consultas porque `(col2)` e `(col2, col3)` não são prefixos da esquerda mais à esquerda de `(col1, col2, col3)`.
