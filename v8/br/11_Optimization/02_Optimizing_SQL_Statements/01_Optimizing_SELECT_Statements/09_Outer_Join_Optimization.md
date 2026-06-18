#### 10.2.1.9 Otimização de Conexão Externa

As junções externas incluem `LEFT JOIN` e `RIGHT JOIN`.

O MySQL implementa um `A LEFT JOIN B join_specification` da seguinte forma:

- A tabela `B` está definida para depender da tabela `A` e de todas as tabelas nas quais `A` depende.

- A tabela `A` está configurada para depender de todas as tabelas (exceto `B`) que são usadas na condição `LEFT JOIN`.

- A condição `LEFT JOIN` é usada para decidir como recuperar linhas da tabela `B`. (Em outras palavras, nenhuma condição na cláusula `WHERE` é usada.)

- Todas as otimizações de junção padrão são realizadas, com a exceção de que uma tabela é sempre lida após todas as tabelas nas quais ela depende. Se houver uma dependência circular, ocorrerá um erro.

- Todas as otimizações padrão `WHERE` são realizadas.

- Se houver uma linha em `A` que corresponda à cláusula `WHERE`, mas não houver nenhuma linha em `B` que corresponda à condição `ON`, uma linha extra `B` será gerada com todas as colunas definidas como `NULL`.

- Se você usar `LEFT JOIN` para encontrar linhas que não existem em alguma tabela e tiver o seguinte teste: `col_name IS NULL` na parte `WHERE`, onde `col_name` é uma coluna declarada como `NOT NULL`, o MySQL para de procurar mais linhas (para uma combinação de chave específica) depois de encontrar uma linha que corresponda à condição `LEFT JOIN`.

A implementação do `RIGHT JOIN` é análoga à do `LEFT JOIN`, com os papéis das tabelas invertidos. As uniões direitas são convertidas em uniões equivalentes à esquerda, conforme descrito na Seção 10.2.1.10, “Simplificação da Unidade Externa”.

Para um `LEFT JOIN`, se a condição `WHERE` for sempre falsa para a linha gerada `NULL`, o `LEFT JOIN` é alterado para uma junção interna. Por exemplo, a cláusula `WHERE` seria falsa na seguinte consulta se `t2.column1` fosse `NULL`:

```
SELECT * FROM t1 LEFT JOIN t2 ON (column1) WHERE t2.column2=5;
```

Portanto, é seguro converter a consulta em uma junção interna:

```
SELECT * FROM t1, t2 WHERE t2.column2=5 AND t1.column1=t2.column1;
```

No MySQL 8.0.14 e versões posteriores, as condições triviais `WHERE` que surgem de expressões literais constantes são removidas durante a preparação, em vez de em uma etapa posterior na otimização, quando as junções já haviam sido simplificadas. A remoção anterior das condições triviais permite que o otimizador converta junções externas em junções internas; isso pode resultar em planos aprimorados para consultas com junções externas contendo condições triviais na cláusula `WHERE`, como esta:

```
SELECT * FROM t1 LEFT JOIN t2 ON condition_1 WHERE condition_2 OR 0 = 1
```

O otimizador agora percebe durante a preparação que 0 = 1 é sempre falso, tornando `OR 0 = 1` redundante e removendo-o, deixando assim:

```
SELECT * FROM t1 LEFT JOIN t2 ON condition_1 where condition_2
```

Agora, o otimizador pode reescrever a consulta como uma junção interna, assim:

```
SELECT * FROM t1 JOIN t2 WHERE condition_1 AND condition_2
```

Agora, o otimizador pode usar a tabela `t2` antes da tabela `t1` se isso resultar em um plano de consulta melhor. Para fornecer uma dica sobre a ordem de junção da tabela, use dicas do otimizador; veja a Seção 10.9.3, “Dicas do Otimizador”. Alternativamente, use `STRAIGHT_JOIN`; veja a Seção 15.2.13, “Instrução SELECT”. No entanto, `STRAIGHT_JOIN` pode impedir que índices sejam usados porque desabilita as transformações de semijoin; veja a Seção 10.2.2.1, “Otimizando Predicados de Subconsultas IN e EXISTS com Transformações de Semijoin”.
