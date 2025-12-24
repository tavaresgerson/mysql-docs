#### 1.7.2.2 Diferenças

Se você acessar uma coluna da tabela para ser atualizada em uma expressão, `UPDATE` usa o valor atual da coluna. A segunda atribuição na seguinte instrução define `col2` para o valor atual (atualizado) `col1`, não o valor original `col1`. O resultado é que `col1` e `col2` têm o mesmo valor. Este comportamento difere do SQL padrão.

```sql
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```
