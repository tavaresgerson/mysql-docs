#### 1.6.2.2 ATUALIZAÇÕES Diferenças

Se você acessar uma coluna da tabela que será atualizada em uma expressão, `UPDATE` usa o valor atual da coluna. A segunda atribuição na seguinte declaração define `col2` para o valor atual (atualizado) de `col1`, e não o valor original de `col1`. O resultado é que `col1` e `col2` têm o mesmo valor. Esse comportamento difere do SQL padrão.

```
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```
