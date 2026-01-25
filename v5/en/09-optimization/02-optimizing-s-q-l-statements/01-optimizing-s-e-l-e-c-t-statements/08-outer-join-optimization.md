#### 8.2.1.8 Otimização de Outer Join

Outer joins incluem `LEFT JOIN` e `RIGHT JOIN`.

O MySQL implementa um `A LEFT JOIN B join_specification` da seguinte forma:

* A tabela *`B`* é configurada para depender da tabela *`A`* e de todas as tabelas das quais *`A`* depende.

* A tabela *`A`* é configurada para depender de todas as tabelas (exceto *`B`*) que são usadas na condição do `LEFT JOIN`.

* A condição do `LEFT JOIN` é usada para decidir como recuperar linhas da tabela *`B`*. (Em outras palavras, nenhuma condição na cláusula `WHERE` é utilizada.)

* Todas as otimizações de JOIN padrão são realizadas, com a exceção de que uma tabela é sempre lida após todas as tabelas das quais ela depende. Se houver uma dependência circular, ocorre um erro.

* Todas as otimizações `WHERE` padrão são realizadas.

* Se houver uma linha em *`A`* que corresponda à cláusula `WHERE`, mas não houver uma linha em *`B`* que corresponda à condição `ON`, uma linha extra de *`B`* é gerada com todas as colunas definidas como `NULL`.

* Se você usa `LEFT JOIN` para encontrar linhas que não existem em alguma tabela e tem o seguinte teste: `col_name IS NULL` na parte `WHERE`, onde *`col_name`* é uma coluna declarada como `NOT NULL`, o MySQL para de procurar por mais linhas (para uma combinação de chave específica) depois de encontrar uma linha que corresponda à condição do `LEFT JOIN`.

A implementação do `RIGHT JOIN` é análoga à do `LEFT JOIN` com os papéis das tabelas invertidos. Right joins são convertidos em left joins equivalentes, conforme descrito na Seção 8.2.1.9, “Simplificação de Outer Join”.

Para um `LEFT JOIN`, se a condição `WHERE` for sempre falsa para a linha `NULL` gerada, o `LEFT JOIN` é alterado para um inner join. Por exemplo, a cláusula `WHERE` seria falsa na seguinte Query se `t2.column1` fosse `NULL`:

```sql
SELECT * FROM t1 LEFT JOIN t2 ON (column1) WHERE t2.column2=5;
```

Portanto, é seguro converter a Query para um inner join:

```sql
SELECT * FROM t1, t2 WHERE t2.column2=5 AND t1.column1=t2.column1;
```

Agora o otimizador pode usar a tabela `t2` antes da tabela `t1` se isso resultar em um plano de Query melhor. Para fornecer uma dica sobre a ordem de JOIN das tabelas, use `STRAIGHT_JOIN`; veja a Seção 13.2.9, “SELECT Statement”. No entanto, `STRAIGHT_JOIN` pode impedir que Indexes sejam usados porque desabilita transformações de semijoin; veja a Seção 8.2.2.1, “Otimizando Subqueries, Derived Tables e Referências de View com Transformações de Semijoin”.