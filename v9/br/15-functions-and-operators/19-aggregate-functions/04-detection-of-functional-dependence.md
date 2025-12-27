### 14.19.4 Detecção de Dependência Funcional

A discussão a seguir fornece vários exemplos das maneiras pelas quais o MySQL detecta dependências funcionais. Os exemplos usam esta notação:

```
{X} -> {Y}
```

Entenda isso como “*`X`* determina de forma única *`Y`*”, o que também significa que *`Y`* é funcionalmente dependente de *`X`*.

Os exemplos usam o banco de dados `world`, que pode ser baixado de https://dev.mysql.com/doc/index-other.html. Você pode encontrar detalhes sobre como instalar o banco de dados na mesma página.

* Dependências Funcionais Derivadas de Chaves
* Dependências Funcionais Derivadas de Chaves Múltiplas e de Igualdades

* Casos Especiais de Dependência Funcional
* Dependências Funcionais e Visualizações
* Combinações de Dependências Funcionais

#### Dependências Funcionais Derivadas de Chaves

A seguinte consulta seleciona, para cada país, um número de idiomas falados:

```
SELECT co.Name, COUNT(*)
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY co.Code;
```

`co.Code` é uma chave primária de `co`, então todas as colunas de `co` são funcionalmente dependentes dela, conforme expresso usando esta notação:

```
{co.Code} -> {co.*}
```

Assim, `co.name` é funcionalmente dependente das colunas de `GROUP BY` e a consulta é válida.

Um índice `UNIQUE` sobre uma coluna `NOT NULL` poderia ser usado em vez de uma chave primária e a mesma dependência funcional se aplicaria. (Isso não é verdade para um índice `UNIQUE` que permite valores `NULL`, pois permite múltiplos valores `NULL` e, nesse caso, a unicidade é perdida.)

#### Dependências Funcionais Derivadas de Chaves Múltiplas e de Igualdades

Esta consulta seleciona, para cada país, uma lista de todos os idiomas falados e quantos pessoas os falam:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population / 100.0 AS SpokenBy
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

O par (`cl.CountryCode`, `cl.Language`) é uma chave primária composta de duas colunas de `cl`, de modo que esse par de colunas determina de forma única todas as colunas de `cl`:

```
{cl.CountryCode, cl.Language} -> {cl.*}
```

Além disso, devido à igualdade na cláusula `WHERE`:

```
{cl.CountryCode} -> {co.Code}
```

E, porque `co.Code` é a chave primária de `co`:

```
{co.Code} -> {co.*}
```

As relações de "determinação única" são transitivas, portanto:

```
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

Assim como no exemplo anterior, uma chave `UNIQUE` sobre colunas `NOT NULL` poderia ser usada em vez de uma chave primária.

Uma condição de `INNER JOIN` pode ser usada em vez de `WHERE`. As mesmas dependências funcionais se aplicam:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl INNER JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

#### Casos Especiais de Dependência Funcional

Enquanto um teste de igualdade em uma condição `WHERE` ou `INNER JOIN` é simétrico, um teste de igualdade em uma condição de junção externa não é, porque as tabelas desempenham papéis diferentes.

Suponha que a integridade referencial tenha sido acidentalmente quebrada e exista uma linha de `countrylanguage` sem uma linha correspondente em `country`. Considere a mesma consulta do exemplo anterior, mas com uma `LEFT JOIN`:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl LEFT JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Para um valor dado de `cl.CountryCode`, o valor de `co.Code` no resultado da junção é encontrado em uma linha correspondente (determinada por `cl.CountryCode`) ou é complementado com `NULL` se não houver correspondência (também determinado por `cl.CountryCode`). Em cada caso, essa relação se aplica:

```
{cl.CountryCode} -> {co.Code}
```

`cl.CountryCode` é ele mesmo funcionalmente dependente de {`cl.CountryCode`, `cl.Language}`, que é uma chave primária.

Se, no resultado da junção, `co.Code` for complementado com `NULL`, `co.Name` também o será. Se `co.Code` não for complementado com `NULL`, então, como `co.Code` é uma chave primária, ele determina `co.Name`. Portanto, em todos os casos:

```
{co.Code} -> {co.Name}
```

O que resulta em:

```
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

No entanto, suponha que as tabelas sejam trocadas, como nesta consulta:

```
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM country co LEFT JOIN countrylanguage cl
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Agora, essa relação *não* se aplica:

```
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

De fato, todas as linhas `NULL` complementadas para `cl` são colocadas em um único grupo (elas têm as colunas `GROUP BY` iguais a `NULL`), e dentro deste grupo, o valor de `co.Name` pode variar. A consulta é inválida e o MySQL a rejeita.

A dependência funcional em junções externas está, portanto, ligada à questão de se as colunas determinantes pertencem ao lado esquerdo ou direito da `LEFT JOIN`. A determinação da dependência funcional se torna mais complexa se houver junções externas aninhadas ou se a condição de junção não consistir inteiramente em comparações de igualdade.

#### Dependências Funcionais e Visualizações

Suponha que uma visualização sobre os países produza seu código, seu nome em maiúsculas e quantos idiomas oficiais diferentes eles têm:

```
CREATE VIEW country2 AS
SELECT co.Code, UPPER(co.Name) AS UpperName,
COUNT(cl.Language) AS OfficialLanguages
FROM country AS co JOIN countrylanguage AS cl
ON cl.CountryCode = co.Code
WHERE cl.isOfficial = 'T'
GROUP BY co.Code;
```

Esta definição é válida porque:

```
{co.Code} -> {co.*}
```

No resultado da visualização, a primeira coluna selecionada é `co.Code`, que também é a coluna de grupo e, portanto, determina todas as outras expressões selecionadas:

```
{country2.Code} -> {country2.*}
```

O MySQL entende isso e usa essa informação, conforme descrito a seguir.

Esta consulta exibe os países, quantos idiomas oficiais diferentes eles têm e quantos municípios eles têm, realizando a junção da visualização com a tabela `city`:

```
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM country2 AS co2 JOIN city ci
ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

Esta consulta é válida porque, como visto anteriormente:

```
{co2.Code} -> {co2.*}
```

O MySQL é capaz de descobrir uma dependência funcional no resultado de uma visualização e usar isso para validar uma consulta que usa a visualização. O mesmo seria verdadeiro se `country2` fosse uma tabela derivada (ou expressão de tabela comum), como:

```
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM
(
 SELECT co.Code, UPPER(co.Name) AS UpperName,
 COUNT(cl.Language) AS OfficialLanguages
 FROM country AS co JOIN countrylanguage AS cl
 ON cl.CountryCode=co.Code
 WHERE cl.isOfficial='T'
 GROUP BY co.Code
) AS co2
JOIN city ci ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

#### Combinações de Dependências Funcionais

O MySQL é capaz de combinar todos os tipos de dependências funcionais anteriores (baseadas em chave, baseadas em igualdade, baseadas em visualização) para validar consultas mais complexas.