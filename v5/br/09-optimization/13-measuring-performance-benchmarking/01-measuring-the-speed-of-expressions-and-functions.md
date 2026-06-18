### 8.13.1 Medindo a Velocidade de Expressões e Funções

Para medir a velocidade de uma expressão ou função específica do MySQL, invocando a função `BENCHMARK()` usando o programa cliente **mysql**. Sua sintaxe é `BENCHMARK(loop_count, expr)`. O valor de retorno é sempre zero, mas **mysql** imprime uma linha mostrando aproximadamente quanto tempo a instrução levou para ser executada. Por exemplo:

```sql
mysql> SELECT BENCHMARK(1000000,1+1);
+------------------------+
| BENCHMARK(1000000,1+1) |
+------------------------+
|                      0 |
+------------------------+
1 row in set (0.32 sec)
```

Esse resultado foi obtido em um sistema Pentium II de 400 MHz. Isso mostra que o MySQL pode executar 1.000.000 de expressões de adição simples em 0,32 segundos nesse sistema.

As funções MySQL integradas são geralmente altamente otimizadas, mas podem haver algumas exceções. `BENCHMARK()` é uma excelente ferramenta para descobrir se alguma função está causando problemas nas suas consultas.
