#### 8.2.1.8 Otimização de OUTER JOIN

As junções externas incluem `LEFT JOIN` e `RIGHT JOIN`.

O MySQL implementa uma especificação de `A LEFT JOIN B` da seguinte forma:

- A tabela *`B`* está definida para depender da tabela *`A`* e de todas as tabelas nas quais *`A`* depende.

- A tabela *`A`* está configurada para depender de todas as tabelas (exceto *`B`*) que são usadas na condição de *`JOIN LEFT`*.

- A condição `LEFT JOIN` é usada para decidir como recuperar as linhas da tabela *`B`*. (Em outras palavras, nenhuma condição na cláusula `WHERE` é usada.)

- Todas as otimizações de junção padrão são realizadas, com a exceção de que uma tabela é sempre lida após todas as tabelas nas quais ela depende. Se houver uma dependência circular, ocorrerá um erro.

- Todas as otimizações padrão de `WHERE` são realizadas.

- Se houver uma linha em *`A`* que corresponda à cláusula `WHERE`, mas não houver nenhuma linha em *`B`* que corresponda à condição `ON`, uma linha extra de *`B`* será gerada com todas as colunas definidas como `NULL`.

- Se você usar a cláusula `LEFT JOIN` para encontrar linhas que não existem em alguma tabela e tiver o seguinte teste: `col_name IS NULL` na parte `WHERE`, onde *`col_name`* é uma coluna declarada como `NOT NULL`, o MySQL para de procurar mais linhas (para uma combinação de chave específica) depois de encontrar uma linha que corresponda à condição da `LEFT JOIN`.

A implementação do `JOIN DIREITO` é análoga à do `JOIN ESQUERDA`, com a tabela de papéis invertida. Os junções direitas são convertidas em junções equivalentes à esquerda, conforme descrito na Seção 8.2.1.9, “Simplificação de Junções Externas”.

Para uma `JOIN LEFT`, se a condição `WHERE` for sempre falsa para a linha `NULL` gerada, a `JOIN LEFT` é alterada para uma junção interna. Por exemplo, a cláusula `WHERE` seria falsa na seguinte consulta se `t2.column1` fosse `NULL`:

```sql
SELECT * FROM t1 LEFT JOIN t2 ON (column1) WHERE t2.column2=5;
```

Portanto, é seguro converter a consulta em uma junção interna:

```sql
SELECT * FROM t1, t2 WHERE t2.column2=5 AND t1.column1=t2.column1;
```

Agora, o otimizador pode usar a tabela `t2` antes da tabela `t1` se isso resultar em um plano de consulta melhor. Para fornecer uma dica sobre a ordem de junção da tabela, use `STRAIGHT_JOIN`; veja a Seção 13.2.9, “Instrução SELECT”. No entanto, `STRAIGHT_JOIN` pode impedir que os índices sejam usados porque desabilita as transformações de junção parcial; veja a Seção 8.2.2.1, “Otimizando subconsultas, tabelas derivadas e referências de visualizações com transformações de junção parcial”.
