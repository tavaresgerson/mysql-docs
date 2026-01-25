### 3.6.5 Usando Variáveis Definidas pelo Usuário

Você pode empregar variáveis de usuário do MySQL para memorizar resultados sem precisar armazená-los em variáveis temporárias no client. (Veja [Seção 9.4, “Variáveis Definidas pelo Usuário”](user-variables.html "9.4 User-Defined Variables").)

Por exemplo, para encontrar os artigos com o preço mais alto e o mais baixo, você pode fazer o seguinte:

```sql
mysql> SELECT @min_price:=MIN(price),@max_price:=MAX(price) FROM shop;
mysql> SELECT * FROM shop WHERE price=@min_price OR price=@max_price;
+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0003 | D      |  1.25 |
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

Nota

Também é possível armazenar o nome de um objeto do Database, como uma table ou uma column, em uma variável de usuário e, em seguida, usar essa variável em uma instrução SQL; no entanto, isso requer o uso de uma prepared statement. Consulte [Seção 13.5, “Prepared Statements”](sql-prepared-statements.html "13.5 Prepared Statements"), para mais informações.