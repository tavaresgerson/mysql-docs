### 12.19.4 Detecção de Dependência Funcional

A discussão a seguir apresenta vários exemplos das maneiras pelas quais o MySQL detecta dependências funcionais. Os exemplos utilizam essa notação:

```sql
{X} -> {Y}
```

Entenda isso como “*`X`* determina *`Y`* de forma única”, o que também significa que *`Y`* depende funcionalmente de *`X`*.

Os exemplos utilizam o banco de dados `world`, que pode ser baixado em <https://dev.mysql.com/doc/index-other.html>. Você pode encontrar detalhes sobre como instalar o banco de dados na mesma página.

- Dependências Funcionais Derivadas de Chaves

- Dependências Funcionais Derivadas de Chaves de Múltiplos Colunas e de Igualdades

- Dependência Funcional Casos Especiais

- Dependências Funcionais e Visualizações

- Combinações de Dependências Funcionais

#### Dependências Funcionais Derivadas de Chaves

A consulta a seguir seleciona, para cada país, um número de idiomas falados:

```sql
SELECT co.Name, COUNT(*)
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY co.Code;
```

`co.Code` é uma chave primária de `co`, portanto, todas as colunas de `co` dependem funcionalmente dela, conforme expresso usando essa notação:

```sql
{co.Code} -> {co.*}
```

Assim, `co.name` é funcionalmente dependente das colunas `GROUP BY` e a consulta é válida.

Um índice `UNIQUE` sobre uma coluna `NOT NULL` poderia ser usado em vez de uma chave primária e a mesma dependência funcional se aplicaria. (Isso não é verdade para um índice `UNIQUE` que permite valores `NULL`, pois permite múltiplos valores `NULL` e, nesse caso, a singularidade é perdida.)

#### Dependências Funcionais Derivadas de Chaves de Múltiplos Colunas e de Igualdades

Essa consulta seleciona, para cada país, uma lista de todas as línguas faladas e quantas pessoas as falam:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population / 100.0 AS SpokenBy
FROM countryLanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

O par (`cl.CountryCode`, `cl.Language`) é uma chave primária composta de duas colunas de `cl`, de modo que esse par de colunas determina de forma única todas as colunas de `cl`:

```sql
{cl.CountryCode, cl.Language} -> {cl.*}
```

Além disso, devido à igualdade na cláusula `WHERE`:

```sql
{cl.CountryCode} -> {co.Code}
```

E, como `co.Code` é a chave primária de `co`:

```sql
{co.Code} -> {co.*}
```

As relações que são “determinadas de forma única” são transitivas, portanto:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

Assim como no exemplo anterior, uma chave `UNIQUE` sobre colunas `NOT NULL` poderia ser usada em vez de uma chave primária.

Uma condição de `INNER JOIN` pode ser usada em vez de `WHERE`. As mesmas dependências funcionais se aplicam:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl INNER JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

#### Dependência Funcional Casos Especiais

Enquanto um teste de igualdade em uma condição `WHERE` ou em uma condição `INNER JOIN` é simétrico, um teste de igualdade em uma condição de junção externa não é, porque as tabelas desempenham papéis diferentes.

Suponha que a integridade referencial tenha sido acidentalmente quebrada e exista uma linha de `countrylanguage` sem uma linha correspondente em `country`. Considere a mesma consulta do exemplo anterior, mas com uma `LEFT JOIN`:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl LEFT JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Para um valor dado de `cl.CountryCode`, o valor de `co.Code` no resultado da junção é encontrado em uma linha correspondente (determinado por `cl.CountryCode`) ou é complementado com `NULL` se não houver correspondência (também determinado por `cl.CountryCode`). Em cada caso, essa relação se aplica:

```sql
{cl.CountryCode} -> {co.Code}
```

`cl.CountryCode` é funcionalmente dependente de {`cl.CountryCode`, `cl.Language`}, que é uma chave primária.

Se, no resultado da junção, `co.Code` for `NULL`, `co.Name` também será. Se `co.Code` não for complementado com `NULL`, então, como `co.Code` é uma chave primária, ele determina `co.Name`. Portanto, em todos os casos:

```sql
{co.Code} -> {co.Name}
```

O que gera:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a consulta é válida.

No entanto, suponha que as tabelas sejam trocadas, como nesta consulta:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM country co LEFT JOIN countrylanguage cl
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Agora, essa relação *não* se aplica:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Todas as linhas `NULL` complementadas para `cl` são colocadas em um único grupo (elas têm ambas as colunas `GROUP BY` iguais a `NULL`), e dentro deste grupo, o valor de `co.Name` pode variar. A consulta é inválida e o MySQL a rejeita.

A dependência funcional em junções externas está, portanto, ligada à questão de se as colunas determinantes pertencem ao lado esquerdo ou direito da `LEFT JOIN`. A determinação da dependência funcional se torna mais complexa se houver junções externas aninhadas ou se a condição de junção não consistir inteiramente em comparações de igualdade.

#### Dependências Funcionais e Visualizações

Suponha que uma visão sobre os países produza seu código, seu nome em maiúsculas e quantas línguas oficiais diferentes eles têm:

```sql
CREATE VIEW country2 AS
SELECT co.Code, UPPER(co.Name) AS UpperName,
COUNT(cl.Language) AS OfficialLanguages
FROM country AS co JOIN countrylanguage AS cl
ON cl.CountryCode = co.Code
WHERE cl.isOfficial = 'T'
GROUP BY co.Code;
```

Essa definição é válida porque:

```sql
{co.Code} -> {co.*}
```

No resultado da visualização, a primeira coluna selecionada é `co.Code`, que também é a coluna de grupo e, portanto, determina todas as outras expressões selecionadas:

```sql
{country2.Code} -> {country2.*}
```

O MySQL entende isso e usa essas informações, conforme descrito a seguir.

Essa consulta exibe os países, quantas línguas oficiais diferentes eles têm e quantas cidades eles têm, ao unir a visualização com a tabela `cidade`:

```sql
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM country2 AS co2 JOIN city ci
ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

Essa consulta é válida porque, como visto anteriormente:

```sql
{co2.Code} -> {co2.*}
```

O MySQL consegue descobrir uma dependência funcional no resultado de uma visualização e usá-la para validar uma consulta que utiliza a visualização. O mesmo aconteceria se `country2` fosse uma tabela derivada, como:

```sql
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

O MySQL é capaz de combinar todos os tipos de dependências funcionais anteriores (baseadas em chave, baseadas em igualdade e baseadas em visualização) para validar consultas mais complexas.
