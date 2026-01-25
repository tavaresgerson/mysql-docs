### 8.13.1 Medindo a Velocidade de Expressões e Functions

Para medir a velocidade de uma expressão ou function específica do MySQL, invoque a function `BENCHMARK()` utilizando o **mysql** client program. Sua sintaxe é `BENCHMARK(loop_count,expr)`. O valor de retorno é sempre zero, mas o **mysql** imprime uma linha exibindo aproximadamente quanto tempo a instrução levou para executar. Por exemplo:

```sql
mysql> SELECT BENCHMARK(1000000,1+1);
+------------------------+
| BENCHMARK(1000000,1+1) |
+------------------------+
|                      0 |
+------------------------+
1 row in set (0.32 sec)
```

Este resultado foi obtido em um sistema Pentium II de 400MHz. Ele mostra que o MySQL pode executar 1.000.000 de expressões de adição simples em 0,32 segundos nesse sistema.

As functions built-in do MySQL são tipicamente altamente otimizadas, mas pode haver algumas exceções. `BENCHMARK()` é uma excelente ferramenta para descobrir se alguma function está causando problemas para suas Queries.