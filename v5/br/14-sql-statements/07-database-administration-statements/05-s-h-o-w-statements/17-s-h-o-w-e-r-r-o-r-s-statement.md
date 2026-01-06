#### 13.7.5.17 Declaração de exibição de erros

```sql
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW COUNT(*) ERRORS
```

`SHOW ERRORS` é uma declaração de diagnóstico que é semelhante a `SHOW WARNINGS`, exceto que exibe informações apenas para erros, em vez de erros, avisos e notas.

A cláusula `LIMIT` tem a mesma sintaxe que a cláusula `SELECT`. Consulte Seção 13.2.9, “Instrução SELECT”.

A instrução `SHOW COUNT(*) ERRORS` exibe o número de erros. Você também pode recuperar esse número a partir da variável `error_count`:

```sql
SHOW COUNT(*) ERRORS;
SELECT @@error_count;
```

`SHOW ERRORS` e `error_count` aplicam-se apenas a erros, não a avisos ou notas. Em outros aspectos, eles são semelhantes a `SHOW WARNINGS` e `warning_count`. Em particular, `SHOW ERRORS` não pode exibir informações para mais de `max_error_count` mensagens, e `error_count` pode exceder o valor de `max_error_count` se o número de erros exceder `max_error_count`.

Para mais informações, consulte Seção 13.7.5.40, “Declaração SHOW WARNINGS”.
