#### 15.1.24.6 Restrições `CHECK`

`CREATE TABLE` permite as principais funcionalidades das restrições `CHECK` de tabelas e colunas, para todos os motores de armazenamento. `CREATE TABLE` permite a sintaxe da restrição `CHECK` a seguir, tanto para restrições de tabela quanto para restrições de coluna:

```
[CONSTRAINT [symbol]] CHECK (expr) [[NOT] ENFORCED]
```

O *símbolo opcional* especifica um nome para a restrição. Se omitido, o MySQL gera um nome a partir do nome da tabela, um literal `_chk_` e um número ordinal (1, 2, 3, ...). Os nomes das restrições têm um comprimento máximo de 64 caracteres. Eles são sensíveis a maiúsculas e minúsculas, mas não a acentos.

*`expr`* especifica a condição da restrição como uma expressão booleana que deve avaliar como `TRUE` ou `UNKNOWN` (para valores `NULL`) para cada linha da tabela. Se a condição avaliar como `FALSE`, ela falha e uma violação de restrição ocorre. O efeito de uma violação depende da instrução sendo executada, conforme descrito mais adiante nesta seção.

A cláusula de aplicação opcional indica se a restrição é aplicada:

* Se omitida ou especificada como `ENFORCED`, a restrição é criada e aplicada.

* Se especificada como `NOT ENFORCED`, a restrição é criada, mas não aplicada.

Uma restrição `CHECK` é especificada como uma restrição de tabela ou coluna:

* Uma restrição de tabela não aparece dentro de uma definição de coluna e pode referir-se a qualquer coluna ou colunas da tabela. Referências para frente são permitidas para colunas que aparecem mais tarde na definição da tabela.

* Uma restrição de coluna aparece dentro de uma definição de coluna e pode referir-se apenas a essa coluna.

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

A definição inclui restrições de tabela e restrições de coluna, nos formatos nomeado e não nomeado:

* A primeira restrição é uma restrição de tabela: ocorre fora de qualquer definição de coluna, portanto, pode (e faz) referir-se a múltiplas colunas da tabela. Esta restrição contém referências para frente para colunas não definidas ainda. Não é especificado um nome de restrição, então o MySQL gera um nome.

* As três próximas restrições são restrições de coluna: cada uma ocorre dentro de uma definição de coluna, e, portanto, pode referir-se apenas à coluna que está sendo definida. Uma das restrições é nomeada explicitamente. O MySQL gera um nome para cada uma das outras duas.

* As duas últimas restrições são restrições de tabela. Uma delas é nomeada explicitamente. O MySQL gera um nome para a outra.

Como mencionado, o MySQL gera um nome para qualquer restrição `CHECK` especificada sem um. Para ver os nomes gerados para a definição de tabela anterior, use `SHOW CREATE TABLE`:

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

O padrão SQL especifica que todos os tipos de restrições (chave primária, índice único, chave estrangeira, verificação) pertencem ao mesmo namespace. No MySQL, cada tipo de restrição tem seu próprio namespace por esquema (banco de dados). Consequentemente, os nomes das restrições `CHECK` devem ser únicos por esquema; nenhuma tabela no mesmo esquema pode compartilhar um nome de restrição `CHECK`. (Exceção: Uma tabela `TEMPORARY` oculta uma tabela não `TEMPORARY` com o mesmo nome, então ela pode ter os mesmos nomes de restrições `CHECK` também.)

Começar a gerar nomes de restrições com o nome da tabela ajuda a garantir a unicidade do esquema porque os nomes das tabelas também devem ser únicos dentro do esquema.

As expressões de condição `CHECK` devem aderir às seguintes regras. Um erro ocorre se uma expressão contiver construções não permitidas.

* Colunas não geradas e geradas são permitidas, exceto colunas com o atributo `AUTO_INCREMENT` e colunas em outras tabelas.

* Literais, funções embutidas determinísticas e operadores são permitidos. Uma função é determinística se, dados os mesmos dados nas tabelas, múltiplas invocatórias produzem o mesmo resultado, independentemente do usuário conectado. Exemplos de funções que não são determinísticas e não atendem a essa definição: `CONNECTION_ID()`, `CURRENT_USER()`, `NOW()`.

* Funções armazenadas e funções carregáveis não são permitidas.
* Parâmetros de procedimentos armazenados e funções não são permitidos.
* Variáveis (variáveis de sistema, variáveis definidas pelo usuário e variáveis locais de programas armazenados) não são permitidas.

* Subconsultas não são permitidas.

Ações referenciais de chave estrangeira (`ON UPDATE`, `ON DELETE`) são proibidas em colunas usadas em restrições `CHECK`. Da mesma forma, restrições `CHECK` são proibidas em colunas usadas em ações referenciais de chave estrangeira.

Restrições `CHECK` são avaliadas para as instruções `INSERT`, `UPDATE`, `REPLACE`, `LOAD DATA` e `LOAD XML` e um erro ocorre se uma restrição avaliar a `FALSE`. Se ocorrer um erro, o tratamento de alterações já aplicadas difere para motores de armazenamento transacionais e não transacionais, e também depende se o modo SQL rigoroso está em vigor, conforme descrito no Modo SQL Rigoroso.

Restrições `CHECK` são avaliadas para as instruções `INSERT IGNORE`, `UPDATE IGNORE`, `LOAD DATA ... IGNORE` e `LOAD XML ... IGNORE` e um aviso ocorre se uma restrição avaliar a `FALSE`. A inserção ou atualização para qualquer linha ofender é ignorada.

Se a expressão da restrição avaliar a um tipo de dado que difere do tipo de coluna declarado, ocorre uma coerção implícita para o tipo declarado de acordo com as regras usuais de conversão de tipos MySQL. Veja a Seção 14.3, “Conversão de Tipos na Avaliação da Expressão”. Se a conversão de tipos falhar ou resultar em perda de precisão, ocorre um erro.

Nota

A avaliação de expressões de restrição usa o modo SQL em vigor no momento da avaliação. Se qualquer componente da expressão depender do modo SQL, resultados diferentes podem ocorrer para diferentes usos da tabela, a menos que o modo SQL seja o mesmo em todos os usos.

A tabela do esquema de informações `CHECK_CONSTRAINTS` fornece informações sobre as restrições `CHECK` definidas em tabelas. Veja a Seção 28.3.5, “O esquema de informações CHECK_CONSTRAINTS”.