### 8.3.5 Índices de Múltiplas Colunas

O MySQL pode criar índices compostos (isto é, Indexes em múltiplas colunas). Um Index pode consistir em até 16 colunas. Para certos tipos de dados, você pode indexar um prefixo da coluna (veja Seção 8.3.4, “Índices de Coluna”).

O MySQL pode usar Indexes de múltiplas colunas para Queries que testam todas as colunas no Index, ou Queries que testam apenas a primeira coluna, as duas primeiras colunas, as três primeiras colunas, e assim por diante. Se você especificar as colunas na ordem correta na definição do Index, um único índice composto pode acelerar vários tipos de Queries na mesma tabela.

Um índice de múltiplas colunas pode ser considerado um *array* ordenado, cujas linhas contêm valores criados pela concatenação dos valores das colunas indexadas.

Nota

Como alternativa a um índice composto, você pode introduzir uma coluna que é “hasheada” com base em informações de outras colunas. Se esta coluna for curta, razoavelmente única e indexada, ela pode ser mais rápida do que um Index “amplo” em muitas colunas. No MySQL, é muito fácil usar esta coluna extra:

```sql
SELECT * FROM tbl_name
  WHERE hash_col=MD5(CONCAT(val1,val2))
  AND col1=val1 AND col2=val2;
```

Suponha que uma tabela tenha a seguinte especificação:

```sql
CREATE TABLE test (
    id         INT NOT NULL,
    last_name  CHAR(30) NOT NULL,
    first_name CHAR(30) NOT NULL,
    PRIMARY KEY (id),
    INDEX name (last_name,first_name)
);
```

O Index `name` é um Index sobre as colunas `last_name` e `first_name`. O Index pode ser usado para *lookups* em Queries que especificam valores em um intervalo conhecido para combinações de valores de `last_name` e `first_name`. Ele também pode ser usado para Queries que especificam apenas um valor de `last_name` porque essa coluna é um prefixo mais à esquerda do Index (conforme descrito mais adiante nesta seção). Portanto, o Index `name` é usado para *lookups* nas seguintes Queries:

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

No entanto, o Index `name` *não* é usado para *lookups* nas seguintes Queries:

```sql
SELECT * FROM test WHERE first_name='John';

SELECT * FROM test
  WHERE last_name='Jones' OR first_name='John';
```

Suponha que você execute a seguinte instrução `SELECT`:

```sql
SELECT * FROM tbl_name
  WHERE col1=val1 AND col2=val2;
```

Se um Index de múltiplas colunas existir em `col1` e `col2`, as linhas apropriadas podem ser buscadas diretamente. Se Indexes separados de coluna única existirem em `col1` e `col2`, o otimizador tenta usar a otimização Index Merge (veja Seção 8.2.1.3, “Index Merge Optimization”), ou tenta encontrar o Index mais restritivo decidindo qual Index exclui mais linhas e usando esse Index para buscar as linhas.

Se a tabela tiver um Index de múltiplas colunas, qualquer prefixo mais à esquerda do Index pode ser usado pelo otimizador para realizar *lookups* de linhas. Por exemplo, se você tiver um Index de três colunas em `(col1, col2, col3)`, você tem capacidades de busca indexada em `(col1)`, `(col1, col2)` e `(col1, col2, col3)`.

O MySQL não pode usar o Index para realizar *lookups* se as colunas não formarem um prefixo mais à esquerda do Index. Suponha que você tenha as instruções `SELECT` mostradas aqui:

```sql
SELECT * FROM tbl_name WHERE col1=val1;
SELECT * FROM tbl_name WHERE col1=val1 AND col2=val2;

SELECT * FROM tbl_name WHERE col2=val2;
SELECT * FROM tbl_name WHERE col2=val2 AND col3=val3;
```

Se um Index existir em `(col1, col2, col3)`, apenas as duas primeiras Queries usam o Index. A terceira e a quarta Queries envolvem colunas indexadas, mas não usam um Index para realizar *lookups* porque `(col2)` e `(col2, col3)` não são prefixos mais à esquerda de `(col1, col2, col3)`.