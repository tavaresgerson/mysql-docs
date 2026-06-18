#### 15.2.15.9 Tabelas Derivadas Laterais

Uma tabela derivada normalmente não pode se referir (depender) a colunas de tabelas anteriores na mesma cláusula `FROM`. A partir do MySQL 8.0.14, uma tabela derivada pode ser definida como uma tabela derivada lateral para especificar que tais referências são permitidas.

As tabelas derivadas não laterais são especificadas usando a sintaxe discutida na Seção 15.2.15.8, “Tabelas Derivadas”. A sintaxe para uma tabela derivada lateral é a mesma que para uma tabela derivada não lateral, exceto que a palavra-chave `LATERAL` é especificada antes da especificação da tabela derivada. A palavra-chave `LATERAL` deve preceder cada tabela a ser usada como uma tabela derivada lateral.

As tabelas derivadas laterais estão sujeitas a essas restrições:

- Uma tabela derivada lateral só pode ocorrer em uma cláusula `FROM`, seja em uma lista de tabelas separadas por vírgulas ou em uma especificação de junção (`JOIN`, `INNER JOIN`, `CROSS JOIN`, `LEFT [OUTER] JOIN` ou `RIGHT [OUTER] JOIN`).

- Se uma tabela derivada lateral estiver no operando direito de uma cláusula de junção e contiver uma referência ao operando esquerdo, a operação de junção deve ser uma `INNER JOIN`, `CROSS JOIN` ou `LEFT [OUTER] JOIN`.

  Se a tabela estiver no operando esquerdo e contiver uma referência ao operando direito, a operação de junção deve ser `INNER JOIN`, `CROSS JOIN` ou `RIGHT [OUTER] JOIN`.

- Se uma tabela derivada lateral fizer referência a uma função agregada, a consulta de agregação da função não pode ser a mesma que possui a cláusula `FROM` na qual a tabela derivada lateral ocorre.

- De acordo com o padrão SQL, o MySQL sempre trata uma junção com uma função de tabela como `JSON_TABLE()` como se tivesse sido usada `LATERAL`. Isso é verdade, independentemente da versão da versão do MySQL, e é por isso que é possível realizar uma junção com essa função mesmo em versões do MySQL anteriores a 8.0.14. No MySQL 8.0.14 e versões posteriores, a palavra-chave `LATERAL` é implícita e não é permitida antes de `JSON_TABLE()`. Isso também está de acordo com o padrão SQL.

A discussão a seguir mostra como as tabelas derivadas laterais tornam possíveis certas operações SQL que não podem ser realizadas com tabelas derivadas não laterais ou que exigem soluções alternativas menos eficientes.

Suponha que queremos resolver este problema: Dado uma tabela de pessoas em uma força de vendas (onde cada linha descreve um membro da força de vendas) e uma tabela de todas as vendas (onde cada linha descreve uma venda: vendedor, cliente, valor, data), determine o tamanho e o cliente da maior venda para cada vendedor. Este problema pode ser abordado de duas maneiras.

Primeira abordagem para resolver o problema: para cada vendedor, calcule o tamanho máximo da venda e também encontre o cliente que forneceu esse valor máximo. No MySQL, isso pode ser feito da seguinte maneira:

```
SELECT
  salesperson.name,
  -- find maximum sale size for this salesperson
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS amount,
  -- find customer for this maximum size
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
         -- find maximum size, again
         (SELECT MAX(amount) AS amount
           FROM all_sales
           WHERE all_sales.salesperson_id = salesperson.id))
  AS customer_name
FROM
  salesperson;
```

Essa consulta é ineficiente porque calcula o tamanho máximo duas vezes por vendedor (uma vez na primeira subconsulta e uma vez na segunda).

Podemos tentar obter um ganho de eficiência calculando o máximo uma vez por vendedor e "armazenando" em uma tabela derivada, conforme mostrado por esta consulta modificada:

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale_customer.customer_name
FROM
  salesperson,
  -- calculate maximum size, cache it in transient derived table max_sale
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS max_sale,
  -- find customer, reusing cached maximum size
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
        -- the cached maximum size
        max_sale.amount)
  AS max_sale_customer;
```

No entanto, a consulta é ilegal no SQL-92 porque as tabelas derivadas não podem depender de outras tabelas na mesma cláusula `FROM`. As tabelas derivadas devem ser constantes ao longo da duração da consulta, não podem conter referências a colunas de outras tabelas na cláusula `FROM`. Como está escrito, a consulta produz esse erro:

```
ERROR 1054 (42S22): Unknown column 'salesperson.id' in 'where clause'
```

No SQL:1999, a consulta se torna válida se as tabelas derivadas forem precedidas pela palavra-chave `LATERAL` (o que significa “esta tabela derivada depende das tabelas anteriores do seu lado esquerdo”):

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale_customer.customer_name
FROM
  salesperson,
  -- calculate maximum size, cache it in transient derived table max_sale
  LATERAL
  (SELECT MAX(amount) AS amount
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id)
  AS max_sale,
  -- find customer, reusing cached maximum size
  LATERAL
  (SELECT customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    AND all_sales.amount =
        -- the cached maximum size
        max_sale.amount)
  AS max_sale_customer;
```

Uma tabela derivada lateral não precisa ser constante e é atualizada sempre que uma nova linha de uma tabela anterior da qual depende é processada pela consulta principal.

Segunda abordagem para resolver o problema: Uma solução diferente pode ser usada se uma subconsulta na lista `SELECT` pudesse retornar várias colunas:

```
SELECT
  salesperson.name,
  -- find maximum size and customer at same time
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
FROM
  salesperson;
```

Isso é eficiente, mas ilegal. Não funciona porque essas subconsultas podem retornar apenas uma única coluna:

```
ERROR 1241 (21000): Operand should contain 1 column(s)
```

Uma tentativa de reescrever a consulta é selecionar várias colunas de uma tabela derivada:

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale.customer_name
FROM
  salesperson,
  -- find maximum size and customer at same time
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
  AS max_sale;
```

No entanto, isso também não funciona. A tabela derivada depende da tabela `salesperson` e, portanto, falha sem `LATERAL`:

```
ERROR 1054 (42S22): Unknown column 'salesperson.id' in 'where clause'
```

A adição da palavra-chave `LATERAL` torna a consulta legal:

```
SELECT
  salesperson.name,
  max_sale.amount,
  max_sale.customer_name
FROM
  salesperson,
  -- find maximum size and customer at same time
  LATERAL
  (SELECT amount, customer_name
    FROM all_sales
    WHERE all_sales.salesperson_id = salesperson.id
    ORDER BY amount DESC LIMIT 1)
  AS max_sale;
```

Em resumo, `LATERAL` é a solução eficiente para todos os problemas das duas abordagens discutidas anteriormente.
