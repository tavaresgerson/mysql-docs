## 27.3 Programas Armazenados em JavaScript

27.3.1 Criação e Gerenciamento de Programas Armazenados em JavaScript

27.3.2 Obtenção de Informações sobre Programas Armazenados em JavaScript

27.3.3 Suporte à Linguagem de Programas Armazenados em JavaScript

27.3.4 Tipos de Dados e Manipulação de Argumentos em Programas Armazenados em JavaScript

27.3.5 Programas Armazenados em JavaScript — Informações e Opções de Sessão

27.3.6 API SQL em JavaScript

27.3.7 Uso da API SQL em JavaScript

27.3.8 Uso de Bibliotecas em JavaScript

27.3.9 Uso de Bibliotecas WebAssembly

27.3.10 API GenAI em JavaScript

27.3.11 Limitações e Restrições de Programas Armazenados em JavaScript

27.3.12 Exemplos de Programas Armazenados em JavaScript

O MySQL 9.5 suporta rotinas armazenadas escritas em JavaScript, como no exemplo simples mostrado aqui:

```
mysql> CREATE FUNCTION add_nos(arg1 INT, arg2 INT)
    ->   RETURNS INT LANGUAGE JAVASCRIPT AS
    ->   $$
    $>     return arg1 + arg2
    $>   $$
    ->   ;
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT add_nos(12,52);
+----------------+
| add_nos(12,52) |
+----------------+
|             64 |
+----------------+
1 row in set (0.00 sec)
```

Observação

O suporte para rotinas armazenadas em JavaScript requer a instalação do componente Multilingual Engine (MLE). Para obter informações sobre a instalação e configuração do componente MLE, consulte a Seção 7.5.7, “Componente Multilingual Engine (MLE”)”).

Os programas armazenados em JavaScript podem ser usados juntamente com outros programas armazenados criados pelo usuário e nativos do MySQL (sujeitos às limitações descritas em outras partes desta seção), bem como com variáveis do sistema e do usuário do MySQL. Podemos ver alguns exemplos disso aqui, usando a função `add_nos()` criada no exemplo anterior:

```
mysql> SET @x = 2;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @x;
+------+
| @x   |
+------+
|    2 |
+------+
1 row in set (0.00 sec)

mysql> SELECT @@server_id;
+-------------+
| @@server_id |
+-------------+
|           1 |
+-------------+
1 row in set (0.00 sec)

mysql> SELECT add_nos(POW(2,@x), 1);
+-----------------------+
| add_nos(POW(2,@x), 1) |
+-----------------------+
|                     5 |
+-----------------------+
1 row in set (0.01 sec)

mysql> SELECT POW(add_nos(@x, @@server_id), add_nos(@x, 1));
+-----------------------------------------------+
| POW(add_nos(@x, @@server_id), add_nos(@x, 1)) |
+-----------------------------------------------+
|                                            27 |
+-----------------------------------------------+
1 row in set (0.01 sec)
```

Os procedimentos armazenados em JavaScript podem ser invocados usando `CALL`, como com os procedimentos armazenados em SQL.

Os programas armazenados em JavaScript também podem receber valores de coluna como argumentos. As funções armazenadas em JavaScript podem ser chamadas em qualquer lugar de uma expressão SQL, onde é legal usar qualquer outra função, como nas cláusulas `WHERE`, `HAVING`, `ORDER BY` e `JOIN`. Elas também podem ser chamadas no corpo de uma definição de gatilho ou evento, embora as definições em si devam ser escritas em SQL. Exemplos de algumas dessas funcionalidades podem ser encontrados mais adiante nesta seção (veja a Seção 27.3.12, “Exemplos de Programas Armazenados em JavaScript”).