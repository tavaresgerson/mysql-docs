#### 15.7.7.19 Declaração `SHOW ERRORS`

```
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW COUNT(*) ERRORS
```

`SHOW ERRORS` é uma declaração de diagnóstico que é semelhante à `SHOW WARNINGS`, exceto que exibe informações apenas para erros, em vez de para erros, avisos e notas.

A cláusula `LIMIT` tem a mesma sintaxe que para a declaração `SELECT`. Veja a Seção 15.2.13, “Declaração `SELECT`”.

A declaração `SHOW COUNT(*) ERRORS` exibe o número de erros. Você também pode recuperar esse número a partir da variável `error_count`:

```
SHOW COUNT(*) ERRORS;
SELECT @@error_count;
```

`SHOW ERRORS` e `error_count` se aplicam apenas a erros, não a avisos ou notas. Em outros aspectos, eles são semelhantes a `SHOW WARNINGS` e `warning_count`. Em particular, `SHOW ERRORS` não pode exibir informações para mais de `max_error_count` mensagens, e `error_count` pode exceder o valor de `max_error_count` se o número de erros exceder `max_error_count`.

Para mais informações, consulte a Seção 15.7.7.43, “Declaração `SHOW WARNINGS`”.