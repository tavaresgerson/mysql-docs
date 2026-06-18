#### 15.1.20.6 Restrições de verificação

Antes do MySQL 8.0.16, `CREATE TABLE` permite apenas a seguinte versão limitada da sintaxe de restrição da tabela `CHECK`, que é analisada e ignorada:

```
CHECK (expr)
```

A partir do MySQL 8.0.16, `CREATE TABLE` permite as funcionalidades principais das restrições de tabela e coluna `CHECK`, para todos os motores de armazenamento. `CREATE TABLE` permite a sintaxe da restrição `CHECK` a seguir, tanto para restrições de tabela quanto para restrições de coluna:

```
[CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
```

O \*`symbol` opcional especifica um nome para a restrição. Se omitido, o MySQL gera um nome a partir do nome da tabela, um literal `_chk_` e um número ordinal (1, 2, 3, ...). Os nomes das restrições têm um comprimento máximo de 64 caracteres. Eles são sensíveis a maiúsculas, mas não a acentos.

`expr` especifica a condição de restrição como uma expressão booleana que deve avaliar-se a `TRUE` ou `UNKNOWN` (para valores de `NULL`) para cada linha da tabela. Se a condição avaliar-se a `FALSE`, ela falha e uma violação de restrição ocorre. O efeito de uma violação depende da declaração sendo executada, conforme descrito mais adiante nesta seção.

A cláusula de execução opcional indica se a restrição é executada:

- Se omitido ou especificado como `ENFORCED`, a restrição é criada e aplicada.

- Se especificado como `NOT ENFORCED`, a restrição é criada, mas não aplicada.

Uma restrição `CHECK` é especificada como uma restrição de tabela ou coluna:

- Uma restrição de tabela não aparece dentro de uma definição de coluna e pode se referir a qualquer coluna ou colunas de tabela. Referências para frente são permitidas para colunas que aparecem mais tarde na definição da tabela.

- Uma restrição de coluna aparece dentro da definição de uma coluna e pode se referir apenas a essa coluna.

Considere esta definição de tabela:

```
CREATE TABLE t1
(
  CHECK (c1 <> c2),
  c1 INT CHECK (c1 > 10),
  c2 INT CONSTRAINT c2_positive CHECK (c2 > 0),
  c3 INT CHECK (c3 < 100),
  CONSTRAINT c1_nonzero CHECK (c1 <> 0),
  CHECK (c1 > c3)
);
```

A definição inclui restrições de tabela e restrições de coluna, nos formatos nomeados e não nomeados:

- A primeira restrição é uma restrição de tabela: ela ocorre fora de qualquer definição de coluna, portanto, pode (e faz) se referir a múltiplas colunas de tabela. Essa restrição contém referências para frente para colunas que ainda não foram definidas. Nenhum nome de restrição é especificado, então o MySQL gera um nome.

- As três restrições seguintes são restrições de coluna: Cada uma ocorre dentro de uma definição de coluna e, portanto, pode se referir apenas à coluna que está sendo definida. Uma das restrições é nomeada explicitamente. O MySQL gera um nome para cada uma das outras duas.

- As duas últimas restrições são restrições de tabela. Uma delas tem um nome explícito. O MySQL gera um nome para a outra.

Como mencionado, o MySQL gera um nome para qualquer restrição `CHECK` especificada sem uma. Para ver os nomes gerados para a definição da tabela anterior, use `SHOW CREATE TABLE`:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int(11) DEFAULT NULL,
  `c2` int(11) DEFAULT NULL,
  `c3` int(11) DEFAULT NULL,
  CONSTRAINT `c1_nonzero` CHECK ((`c1` <> 0)),
  CONSTRAINT `c2_positive` CHECK ((`c2` > 0)),
  CONSTRAINT `t1_chk_1` CHECK ((`c1` <> `c2`)),
  CONSTRAINT `t1_chk_2` CHECK ((`c1` > 10)),
  CONSTRAINT `t1_chk_3` CHECK ((`c3` < 100)),
  CONSTRAINT `t1_chk_4` CHECK ((`c1` > `c3`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema (banco de dados). Consequentemente, os nomes das restrições `CHECK` devem ser únicos por esquema; nenhuma tabela no mesmo esquema pode compartilhar o nome de uma restrição `CHECK`. (Exceção: uma tabela `TEMPORARY` oculta uma tabela não `TEMPORARY` do mesmo nome, portanto, pode ter os mesmos nomes de restrições `CHECK` também.)

Começar a gerar nomes de restrições com o nome da tabela ajuda a garantir a unicidade do esquema, pois os nomes das tabelas também devem ser únicos dentro do esquema.

As expressões de condição `CHECK` devem seguir as seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

- Colunas não geradas e geradas são permitidas, exceto colunas com o atributo `AUTO_INCREMENT` e colunas em outras tabelas.

- São permitidos literais, funções internas determinísticas e operadores. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocá-las produzir o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

- As funções armazenadas e as funções carregáveis não são permitidas.

- Os parâmetros de procedimentos e funções armazenados não são permitidos.

- As variáveis (variáveis do sistema, variáveis definidas pelo usuário e variáveis locais de programas armazenados) não são permitidas.

- Subconsultas não são permitidas.

As ações referenciais de chave estrangeira (`ON UPDATE`, `ON DELETE`) são proibidas em colunas usadas nas restrições de `CHECK`. Da mesma forma, as restrições de `CHECK` são proibidas em colunas usadas em ações referenciais de chave estrangeira.

As restrições `CHECK` são avaliadas para as instruções `INSERT`, `UPDATE`, `REPLACE`, `LOAD DATA` e `LOAD XML` e um erro ocorre se uma restrição for avaliada como `FALSE`. Se ocorrer um erro, o tratamento das alterações já aplicadas difere para motores de armazenamento transacionais e não transacionais, e também depende se o modo SQL estrito está em vigor, conforme descrito no Modo SQL Estrito.

As restrições `CHECK` são avaliadas para as instruções `INSERT IGNORE`, `UPDATE IGNORE`, `LOAD DATA ... IGNORE` e `LOAD XML ... IGNORE` e um aviso ocorre se uma restrição for avaliada como `FALSE`. O inserimento ou atualização para qualquer linha que viole a regra é ignorado.

Se a expressão de restrição avaliar um tipo de dado diferente do tipo declarado da coluna, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos do MySQL. Veja a Seção 14.3, “Conversão de Tipos na Avaliação da Expressão”. Se a conversão de tipos falhar ou resultar em perda de precisão, ocorre um erro.

Nota

A avaliação da expressão de restrição usa o modo SQL em vigor no momento da avaliação. Se qualquer componente da expressão depender do modo SQL, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

A tabela do esquema de informações `CHECK_CONSTRAINTS` fornece informações sobre as restrições `CHECK` definidas em tabelas. Veja a Seção 28.3.5, “A tabela INFORMATION\_SCHEMA CHECK\_CONSTRAINTS”.
