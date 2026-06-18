### 12.19.4 Detecção de Dependência Funcional

A discussão a seguir fornece vários exemplos das maneiras pelas quais o MySQL detecta dependências funcionais. Os exemplos usam esta notação:

```sql
{X} -> {Y}
```

Entenda isso como “*`X`* determina unicamente *`Y`*,” o que também significa que *`Y`* é funcionalmente dependente de *`X`*.

Os exemplos usam o Database `world`, que pode ser baixado em https://dev.mysql.com/doc/index-other.html. Você pode encontrar detalhes sobre como instalar o Database na mesma página.

* Dependências Funcionais Derivadas de Chaves
* Dependências Funcionais Derivadas de Chaves de Múltiplas Colunas e de Igualdades

* Casos Especiais de Dependência Funcional
* Dependências Funcionais e Views
* Combinações de Dependências Funcionais

#### Dependências Funcionais Derivadas de Chaves

A Query a seguir seleciona, para cada país, uma contagem de idiomas falados:

```sql
SELECT co.Name, COUNT(*)
FROM countrylanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY co.Code;
```

`co.Code` é uma Primary Key de `co`, então todas as colunas de `co` são funcionalmente dependentes dela, conforme expresso usando esta notação:

```sql
{co.Code} -> {co.*}
```

Dessa forma, `co.name` é funcionalmente dependente das colunas `GROUP BY` e a Query é válida.

Um Index `UNIQUE` em uma coluna `NOT NULL` poderia ser usado no lugar de uma Primary Key e a mesma dependência funcional se aplicaria. (Isso não é verdade para um Index `UNIQUE` que permite valores `NULL` porque ele permite múltiplos valores `NULL` e, nesse caso, a unicidade é perdida.)

#### Dependências Funcionais Derivadas de Chaves de Múltiplas Colunas e de Igualdades

Esta Query seleciona, para cada país, uma lista de todos os idiomas falados e quantas pessoas os falam:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population / 100.0 AS SpokenBy
FROM countryLanguage cl, country co
WHERE cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

O par (`cl.CountryCode`, `cl.Language`) é uma Primary Key composta de duas colunas de `cl`, de modo que o par de colunas determina unicamente todas as colunas de `cl`:

```sql
{cl.CountryCode, cl.Language} -> {cl.*}
```

Além disso, por causa da igualdade na cláusula `WHERE`:

```sql
{cl.CountryCode} -> {co.Code}
```

E, como `co.Code` é Primary Key de `co`:

```sql
{co.Code} -> {co.*}
```

As relações de “determinação única” são transitivas, portanto:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a Query é válida.

Assim como no exemplo anterior, uma chave `UNIQUE` em colunas `NOT NULL` poderia ser usada no lugar de uma Primary Key.

Uma condição `INNER JOIN` pode ser usada no lugar de `WHERE`. As mesmas dependências funcionais se aplicam:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl INNER JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

#### Casos Especiais de Dependência Funcional

Embora um teste de igualdade em uma condição `WHERE` ou condição `INNER JOIN` seja simétrico, um teste de igualdade em uma condição de join externo (outer join) não é, pois as tabelas desempenham papéis diferentes.

Suponha que a integridade referencial tenha sido acidentalmente quebrada e exista uma linha de `countrylanguage` sem uma linha correspondente em `country`. Considere a mesma Query que no exemplo anterior, mas com um `LEFT JOIN`:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM countrylanguage cl LEFT JOIN country co
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Para um dado valor de `cl.CountryCode`, o valor de `co.Code` no resultado do JOIN é encontrado em uma linha correspondente (determinado por `cl.CountryCode`) ou é complementado com `NULL` se não houver correspondência (também determinado por `cl.CountryCode`). Em cada caso, esta relação se aplica:

```sql
{cl.CountryCode} -> {co.Code}
```

`cl.CountryCode` é, por si só, funcionalmente dependente de {`cl.CountryCode`, `cl.Language`}, que é uma Primary Key.

Se no resultado do JOIN `co.Code` for complementado com `NULL`, `co.Name` também será. Se `co.Code` não for complementado com `NULL`, então, como `co.Code` é uma Primary Key, ele determina `co.Name`. Portanto, em todos os casos:

```sql
{co.Code} -> {co.Name}
```

O que resulta em:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Como resultado, a Query é válida.

No entanto, suponha que as tabelas sejam invertidas, como nesta Query:

```sql
SELECT co.Name, cl.Language,
cl.Percentage * co.Population/100.0 AS SpokenBy
FROM country co LEFT JOIN countrylanguage cl
ON cl.CountryCode = co.Code
GROUP BY cl.CountryCode, cl.Language;
```

Agora, esta relação *não* se aplica:

```sql
{cl.CountryCode, cl.Language} -> {cl.*,co.*}
```

Todas as linhas complementadas com `NULL` criadas para `cl` são colocadas em um único grupo (ambas as colunas `GROUP BY` são iguais a `NULL`) e, dentro deste grupo, o valor de `co.Name` pode variar. A Query é inválida e o MySQL a rejeita.

A dependência funcional em joins externos está, portanto, ligada ao fato de as colunas determinantes pertencerem ao lado esquerdo ou direito do `LEFT JOIN`. A determinação da dependência funcional se torna mais complexa se houver joins externos aninhados ou se a condição de JOIN não consistir inteiramente em comparações de igualdade.

#### Dependências Funcionais e Views

Suponha que uma View sobre países produza seu código, seu nome em letras maiúsculas e quantos idiomas oficiais diferentes eles têm:

```sql
CREATE VIEW country2 AS
SELECT co.Code, UPPER(co.Name) AS UpperName,
COUNT(cl.Language) AS OfficialLanguages
FROM country AS co JOIN countrylanguage AS cl
ON cl.CountryCode = co.Code
WHERE cl.isOfficial = 'T'
GROUP BY co.Code;
```

Esta definição é válida porque:

```sql
{co.Code} -> {co.*}
```

No resultado da View, a primeira coluna selecionada é `co.Code`, que também é a coluna de agrupamento e, portanto, determina todas as outras expressões selecionadas:

```sql
{country2.Code} -> {country2.*}
```

O MySQL entende isso e usa essa informação, conforme descrito a seguir.

Esta Query exibe os países, quantos idiomas oficiais diferentes eles têm e quantas cidades eles têm, unindo a View com a tabela `city`:

```sql
SELECT co2.Code, co2.UpperName, co2.OfficialLanguages,
COUNT(*) AS Cities
FROM country2 AS co2 JOIN city ci
ON ci.CountryCode = co2.Code
GROUP BY co2.Code;
```

Esta Query é válida porque, como visto anteriormente:

```sql
{co2.Code} -> {co2.*}
```

O MySQL é capaz de descobrir uma dependência funcional no resultado de uma View e usá-la para validar uma Query que utiliza a View. O mesmo seria verdadeiro se `country2` fosse uma tabela derivada (derived table), como em:

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

O MySQL é capaz de combinar todos os tipos de dependências funcionais precedentes (baseadas em chave, baseadas em igualdade, baseadas em View) para validar Queries mais complexas.
