#### 13.1.18.7 Criar uma tabela e colunas geradas

`CREATE TABLE` suporta a especificação de colunas geradas. Os valores de uma coluna gerada são calculados a partir de uma expressão incluída na definição da coluna.

As colunas geradas são suportadas pelo mecanismo de armazenamento `NDB` a partir do MySQL NDB Cluster 7.5.3.

O exemplo simples a seguir mostra uma tabela que armazena as medidas dos lados dos triângulos retângulos nas colunas `sidea` e `sideb`, e calcula o comprimento da hipotenusa na coluna `sidec` (a raiz quadrada das somas dos quadrados dos outros lados):

```sql
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

A seleção da tabela produz este resultado:

```sql
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Qualquer aplicativo que utilize a tabela `triângulo` tem acesso aos valores da hipotenusa sem precisar especificar a expressão que os calcula.

As definições de colunas geradas têm essa sintaxe:

```sql
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indica que a coluna é gerada e define a expressão usada para calcular os valores da coluna. O `AS` pode ser precedido por `GENERATED ALWAYS` para tornar a natureza gerada da coluna mais explícita. Os construtos permitidos ou proibidos na expressão são discutidos mais adiante.

A palavra-chave `VIRTUAL` ou `STORED` indica como os valores das colunas são armazenados, o que tem implicações para o uso da coluna:

- `VIRTUAL`: Os valores das colunas não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna virtual não ocupa espaço de armazenamento.

  O `InnoDB` suporta índices secundários em colunas virtuais. Veja Seção 13.1.18.8, “Índices Secundários e Colunas Geradas”.

- `STORED`: Os valores das colunas são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna armazenada requer espaço de armazenamento e pode ser indexada.

O padrão é `VIRTUAL` se nenhuma palavra-chave for especificada.

É permitido misturar as colunas `VIRTUAL` e `STORED` dentro de uma tabela.

Outros atributos podem ser fornecidos para indicar se a coluna está indexada ou pode ser `NULL`, ou para fornecer um comentário.

As expressões de coluna geradas devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

- São permitidos literais, funções internas determinísticas e operadores. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocá-las produzir o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

- As funções armazenadas e as funções carregáveis não são permitidas.

- Os parâmetros de procedimentos e funções armazenados não são permitidos.

- As variáveis (variáveis do sistema, variáveis definidas pelo usuário e variáveis locais de programas armazenados) não são permitidas.

- Subconsultas não são permitidas.

- Uma definição de coluna gerada pode se referir a outras colunas geradas, mas apenas aquelas que ocorrem anteriormente na definição da tabela. Uma definição de coluna gerada pode se referir a qualquer coluna base (não gerada) na tabela, independentemente de sua definição ocorrer anteriormente ou posteriormente.

- O atributo `AUTO_INCREMENT` não pode ser usado em uma definição de coluna gerada.

- Uma coluna `AUTO_INCREMENT` não pode ser usada como uma coluna base em uma definição de coluna gerada.

- A partir do MySQL 5.7.10, se a avaliação da expressão causar truncação ou fornecer uma entrada incorreta para uma função, a instrução `CREATE TABLE` termina com um erro e a operação DDL é rejeitada.

Se a expressão avaliar um tipo de dado diferente do tipo declarado da coluna, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos do MySQL. Veja Seção 12.3, “Conversão de Tipos na Avaliação da Expressão”.

Nota

Se algum componente da expressão depender do modo SQL, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações de coluna geradas da tabela original.

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada são colunas geradas. A parte `SELECT` da instrução não pode atribuir valores às colunas geradas na tabela de destino.

A partição por colunas geradas é permitida. Consulte Partição de tabela.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtualmente.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para referenciar colunas geradas.

Para `INSERT`, `REPLACE` e `UPDATE`, se uma coluna gerada for inserida, substituída ou atualizada explicitamente, o único valor permitido é `DEFAULT`.

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuir a ela. No entanto, se essa coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`.

As colunas geradas têm vários casos de uso, como estes:

- As colunas geradas virtualmente podem ser usadas como uma maneira de simplificar e unificar as consultas. Uma condição complicada pode ser definida como uma coluna gerada e referenciada em várias consultas na tabela para garantir que todas elas usem exatamente a mesma condição.

- As colunas geradas armazenadas podem ser usadas como um cache materializado para condições complicadas que são caras de calcular em tempo real.

- Colunas geradas podem simular índices funcionais: Use uma coluna gerada para definir uma expressão funcional e indexá-la. Isso pode ser útil para trabalhar com colunas de tipos que não podem ser indexados diretamente, como colunas de tipo `JSON`; veja Indexação de uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

  Para colunas geradas armazenadas, a desvantagem dessa abordagem é que os valores são armazenados duas vezes: uma vez como o valor da coluna gerada e outra no índice.

- Se uma coluna gerada estiver indexada, o otimizador reconhece expressões de consulta que correspondem à definição da coluna e usa os índices da coluna conforme apropriado durante a execução da consulta, mesmo que uma consulta não faça referência direta à coluna pelo nome. Para obter detalhes, consulte Seção 8.3.10, “Uso do Otimizador de Índices de Colunas Geradas”.

Exemplo:

Suponha que uma tabela `t1` contenha as colunas `primeiro_nome` e `sobrenome` e que as aplicações frequentemente construam o nome completo usando uma expressão como esta:

```sql
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

Uma maneira de evitar a escrita da expressão é criar uma visualização `v1` em `t1`, o que simplifica as aplicações, permitindo que elas selecionem `full_name` diretamente, sem a necessidade de usar uma expressão:

```sql
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

Uma coluna gerada também permite que as aplicações selecionem `full_name` diretamente, sem a necessidade de definir uma visualização:

```sql
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```
