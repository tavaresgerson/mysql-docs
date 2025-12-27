#### 15.1.24.8 Criação de Colunas Geradas

O comando `CREATE TABLE` suporta a especificação de colunas geradas. Os valores de uma coluna gerada são calculados a partir de uma expressão incluída na definição da coluna.

Colunas geradas também são suportadas pelo mecanismo de armazenamento `NDB`.

O exemplo simples a seguir mostra uma tabela que armazena as medidas dos lados de triângulos retângulos nas colunas `sidea` e `sideb`, e calcula a medida da hipotenusa na `sidec` (a raiz quadrada da soma dos quadrados dos outros lados):

```
CREATE TABLE triangle (
  sidea DOUBLE,
  sideb DOUBLE,
  sidec DOUBLE AS (SQRT(sidea * sidea + sideb * sideb))
);
INSERT INTO triangle (sidea, sideb) VALUES(1,1),(3,4),(6,8);
```

A seleção da tabela produz este resultado:

```
mysql> SELECT * FROM triangle;
+-------+-------+--------------------+
| sidea | sideb | sidec              |
+-------+-------+--------------------+
|     1 |     1 | 1.4142135623730951 |
|     3 |     4 |                  5 |
|     6 |     8 |                 10 |
+-------+-------+--------------------+
```

Qualquer aplicação que use a tabela `triangle` tem acesso aos valores da hipotenusa sem precisar especificar a expressão que os calcula.

As definições de colunas geradas têm esta sintaxe:

```
col_name data_type [GENERATED ALWAYS] AS (expr)
  [VIRTUAL | STORED] [NOT NULL | NULL]
  [UNIQUE [KEY]] [[PRIMARY] KEY]
  [COMMENT 'string']
```

`AS (expr)` indica que a coluna é gerada e define a expressão usada para calcular os valores da coluna. `AS` pode ser precedido por `GENERATED ALWAYS` para tornar a natureza gerada da coluna mais explícita. Os construtos permitidos ou proibidos na expressão são discutidos mais adiante.

As palavras-chave `VIRTUAL` ou `STORED` indicam como os valores da coluna são armazenados, o que tem implicações para o uso da coluna:

* `VIRTUAL`: Os valores da coluna não são armazenados, mas são avaliados quando as linhas são lidas, imediatamente após quaisquer gatilhos `BEFORE`. Uma coluna virtual não ocupa espaço de armazenamento.

  O `InnoDB` suporta índices secundários em colunas virtuais. Veja a Seção 15.1.24.9, “Indizes Secundários e Colunas Geradas”.

* `STORED`: Os valores da coluna são avaliados e armazenados quando as linhas são inseridas ou atualizadas. Uma coluna armazenada requer espaço de armazenamento e pode ser indexada.

A opção padrão é `VIRTUAL` se nenhuma palavra-chave for especificada.

É permitido misturar colunas `VIRTUAL` e `STORED` dentro de uma tabela.

Outros atributos podem ser fornecidos para indicar se a coluna está indexada ou pode ser `NULL`, ou para fornecer um comentário.

As expressões de coluna geradas devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Literais, funções embutidas determinísticas e operadores são permitidos. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocatórias produzem o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Funções armazenadas e funções carregáveis não são permitidas.
* Procedimentos armazenados e parâmetros de funções não são permitidos.
* Variáveis (variáveis de sistema, variáveis definidas pelo usuário e variáveis locais de programas armazenados) não são permitidas.

* Subconsultas não são permitidas.
* Uma definição de coluna gerada pode referenciar outras colunas geradas, mas apenas aquelas que ocorrem anteriormente na definição da tabela. Uma definição de coluna gerada pode referenciar qualquer coluna base (não gerada) na tabela, independentemente de sua definição ocorrer anteriormente ou posteriormente.

* O atributo `AUTO_INCREMENT` não pode ser usado em uma definição de coluna gerada.

* Uma coluna `AUTO_INCREMENT` não pode ser usada como coluna base em uma definição de coluna gerada.

* Se a avaliação da expressão causar truncação ou fornecer entrada incorreta para uma função, a instrução `CREATE TABLE` termina com um erro e a operação DDL é rejeitada.

Se a expressão avaliar a um tipo de dado que difere do tipo de coluna declarado, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipo na Avaliação da Expressão”.

Se uma coluna gerada usar o tipo de dados `TIMESTAMP`, o ajuste para `explicit_defaults_for_timestamp` é ignorado. Nesses casos, se essa variável for desativada, `NULL` não será convertido para `CURRENT_TIMESTAMP`. Se a coluna também for declarada como `NOT NULL`, a tentativa de inserir `NULL` será explicitamente rejeitada com `ER_BAD_NULL_ERROR`.

Nota

A avaliação da expressão usa o modo SQL em vigor no momento da avaliação. Se qualquer componente da expressão depender do modo SQL, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o modo SQL seja o mesmo durante todos os usos.

Para `CREATE TABLE ... LIKE`, a tabela de destino preserva as informações da coluna gerada da tabela original.

Para `CREATE TABLE ... SELECT`, a tabela de destino não preserva informações sobre se as colunas da tabela selecionada são colunas geradas. A parte `SELECT` da declaração não pode atribuir valores a colunas geradas na tabela de destino.

A partição por colunas geradas é permitida. Veja Partição de Tabela.

Uma restrição de chave estrangeira em uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE`, nem pode usar `SET NULL` ou `SET DEFAULT` como ações referenciais `ON DELETE`.

Uma restrição de chave estrangeira na coluna base de uma coluna gerada armazenada não pode usar `CASCADE`, `SET NULL` ou `SET DEFAULT` como ações referenciais `ON UPDATE` ou `ON DELETE`.

Uma restrição de chave estrangeira não pode referenciar uma coluna gerada virtual.

Os gatilhos não podem usar `NEW.col_name` ou usar `OLD.col_name` para referenciar colunas geradas.

Para `INSERT`, `REPLACE` e `UPDATE`, se uma coluna gerada é inserida, substituída ou atualizada explicitamente, o único valor permitido é `DEFAULT`.

Uma coluna gerada em uma visualização é considerada atualizável porque é possível atribuir a ela. No entanto, se tal coluna for atualizada explicitamente, o único valor permitido é `DEFAULT`.

Colunas geradas têm vários casos de uso, como estes:

* Colunas geradas virtuais podem ser usadas como uma maneira de simplificar e unificar consultas. Uma condição complicada pode ser definida como uma coluna gerada e referenciada de múltiplas consultas na tabela para garantir que todas elas usem exatamente a mesma condição.

* Colunas geradas armazenadas podem ser usadas como um cache materializado para condições complicadas que são custosas de calcular em tempo real.

* Colunas geradas podem simular índices funcionais: Use uma coluna gerada para definir uma expressão funcional e indexá-la. Isso pode ser útil para trabalhar com colunas de tipos que não podem ser indexados diretamente, como colunas `JSON`; veja Indexando uma Coluna Gerada para Fornecer um Índice de Coluna JSON, para um exemplo detalhado.

Para colunas geradas armazenadas, a desvantagem dessa abordagem é que os valores são armazenados duas vezes; uma vez como o valor da coluna gerada e uma vez no índice.

* Se uma coluna gerada for indexada, o otimizador reconhece expressões de consulta que correspondem à definição da coluna e usa índices da coluna conforme apropriado durante a execução da consulta, mesmo que uma consulta não refira a coluna diretamente pelo nome. Para detalhes, consulte a Seção 10.3.11, “Uso do Otimizador de Índices de Colunas Geradas”.

Exemplo:

Suponha que uma tabela `t1` contenha as colunas `first_name` e `last_name` e que as aplicações frequentemente construam o nome completo usando uma expressão como esta:

```
SELECT CONCAT(first_name,' ',last_name) AS full_name FROM t1;
```

Uma maneira de evitar a escrita da expressão é criar uma visão `v1` em `t1`, o que simplifica as aplicações, permitindo que elas selecionem `full_name` diretamente, sem a necessidade de usar uma expressão:

```
CREATE VIEW v1 AS
SELECT *, CONCAT(first_name,' ',last_name) AS full_name FROM t1;

SELECT full_name FROM v1;
```

Uma coluna gerada também permite que as aplicações selecionem `full_name` diretamente, sem a necessidade de definir uma visão:

```
CREATE TABLE t1 (
  first_name VARCHAR(10),
  last_name VARCHAR(10),
  full_name VARCHAR(255) AS (CONCAT(first_name,' ',last_name))
);

SELECT full_name FROM t1;
```