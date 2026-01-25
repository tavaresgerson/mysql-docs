#### 1.6.2.2 Diferenças do UPDATE

Se você acessar uma coluna da tabela a ser atualizada em uma expressão, o `UPDATE` usa o valor atual da coluna. A segunda atribuição na instrução a seguir define `col2` para o valor atual (atualizado) de `col1`, e não para o valor original de `col1`. O resultado é que `col1` e `col2` têm o mesmo valor. Este comportamento difere do SQL padrão.

```sql
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```