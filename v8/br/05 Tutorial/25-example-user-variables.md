### 5.6.5 Utilização de variáveis definidas pelo utilizador

Você pode empregar variáveis de usuário do MySQL para lembrar resultados sem ter que armazená-los em variáveis temporárias no cliente (Veja Seção 11.4, "Variáveis Definidas pelo Usuário").

Por exemplo, para encontrar os artigos com o preço mais alto e mais baixo, você pode fazer o seguinte:

```
mysql> SELECT @min_price:=MIN(price),@max_price:=MAX(price) FROM shop;
mysql> SELECT * FROM shop WHERE price=@min_price OR price=@max_price;
+---------+--------+-------+
| article | dealer | price |
+---------+--------+-------+
|    0003 | D      |  1.25 |
|    0004 | D      | 19.95 |
+---------+--------+-------+
```

::: info Note

Também é possível armazenar o nome de um objeto de banco de dados, como uma tabela ou uma coluna, em uma variável de usuário e, em seguida, usar essa variável em uma instrução SQL; no entanto, isso requer o uso de uma instrução preparada.

:::
