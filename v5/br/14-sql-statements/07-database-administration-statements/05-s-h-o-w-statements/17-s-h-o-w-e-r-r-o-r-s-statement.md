#### 13.7.5.17 Instrução SHOW ERRORS

```sql
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW COUNT(*) ERRORS
```

O `SHOW ERRORS` é uma instrução de diagnóstico que é semelhante ao `SHOW WARNINGS`, exceto que ele exibe informações apenas sobre erros, em vez de erros, warnings e notes.

A `LIMIT` clause possui a mesma sintaxe que para a instrução `SELECT`. Veja [Seção 13.2.9, “Instrução SELECT”](select.html "13.2.9 SELECT Statement").

A instrução `SHOW COUNT(*) ERRORS` exibe o número de erros. Você também pode recuperar este número a partir da variável `error_count`:

```sql
SHOW COUNT(*) ERRORS;
SELECT @@error_count;
```

O `SHOW ERRORS` e o `error_count` se aplicam apenas a erros, e não a warnings ou notes. Em outros aspectos, eles são semelhantes ao `SHOW WARNINGS` e ao `warning_count`. Em particular, o `SHOW ERRORS` não pode exibir informações para mais de `max_error_count` mensagens, e o `error_count` pode exceder o valor de `max_error_count` se o número de erros exceder `max_error_count`.

Para mais informações, veja [Seção 13.7.5.40, “Instrução SHOW WARNINGS”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").