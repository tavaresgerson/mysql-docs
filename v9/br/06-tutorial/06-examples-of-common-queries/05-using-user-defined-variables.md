### 5.6.5 Usando Variáveis Definidas pelo Usuário

Você pode utilizar variáveis de usuário do MySQL para lembrar resultados sem precisar armazená-los em variáveis temporárias no cliente. (Veja a Seção 11.4, “Variáveis Definidas pelo Usuário”.)

Por exemplo, para encontrar os artigos com o preço mais alto e mais baixo, você pode fazer isso:

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

Observação

Também é possível armazenar o nome de um objeto de banco de dados, como uma tabela ou uma coluna, em uma variável de usuário e, em seguida, usar essa variável em uma instrução SQL; no entanto, isso requer o uso de uma instrução preparada. Consulte a Seção 15.5, “Instruções Preparadas”, para obter mais informações.