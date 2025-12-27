#### 27.3.7.1 Declarações Simples

Uma declaração simples retorna um conjunto de resultados que pode ser usado para acessar dados (linhas), metadados e informações de diagnóstico.

Uma declaração simples é estática e não pode ser modificada após a criação; em outras palavras, não pode ser parametrizada. Uma declaração simples que contém um ou mais marcadores de parâmetro `?` gera um erro. Consulte a Seção 27.3.7.2, “Declarações Preparadas”, para obter informações sobre declarações preparadas, que permitem especificar valores arbitrários para os parâmetros no momento da execução.

A maioria das declarações SQL que são válidas no MySQL pode ser usada como declarações simples; para exceções, consulte Declarações SQL Não Permitidas em Rotinas Armazenadas. Um exemplo mínimo de uma rotina armazenada usando a API de declaração simples em JavaScript é mostrado aqui:

```
CREATE PROCEDURE jssp_vsimple(IN query VARCHAR(250))
LANGUAGE JAVASCRIPT AS $$

  let stmt = session.sql(query)
  let result = stmt.execute()

  console.log(result.getColumnNames())

  let row = result.fetchOne()

  while(row) {
    console.log(row.toArray())
    row = result.fetchOne()
  }

$$;
```

Esta rotina armazenada aceita um único parâmetro de entrada: o texto de uma declaração SQL. Obtemos uma instância de `SqlExecute` passando esse texto para o método `sql()` do objeto global `Session`. Chamar o método `execute()` dessa instância gera um `SqlResult`; podemos obter os nomes das colunas neste conjunto de resultados usando `getColumnNames()`, e iterar por todas as suas linhas chamando `fetchOne()` até que ele falhe em retornar outra linha (ou seja, até que o método retorne `false`). Os nomes das colunas e os conteúdos das linhas são escritos em `stdout` usando `console.log()`.

Podemos testar essa rotina usando uma simples junção em duas tabelas no banco de dados **`world`** e, em seguida, verificar o **`stdout`** depois, assim:

```
mysql> CALL jssp_vsimple("
    ">   SELECT c.Name, c.LocalName, c.Population, l.Language
    ">   FROM country c
    ">   JOIN countrylanguage l
    ">   ON c.Code=l.CountryCode
    ">   WHERE l.Language='Swedish'
    "> ");
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT mle_session_state('stdout')\G
*************************** 1. row ***************************
mle_session_state('stdout'): Name,LocalName,Population,Language
Denmark,Danmark,5330000,Swedish
Finland,Suomi,5171300,Swedish
Norway,Norge,4478500,Swedish
Sweden,Sverige,8861400,Swedish

1 row in set (0.00 sec)
```

O conjunto de resultados retornado por uma única declaração simples não pode ser maior que 1 MB.