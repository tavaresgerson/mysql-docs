#### 25.12.2.5 A tabela setup_timers

A tabela `setup_timers` mostra os temporizadores de evento atualmente selecionados:

```sql
mysql> SELECT * FROM performance_schema.setup_timers;
+-------------+-------------+
| NAME        | TIMER_NAME  |
+-------------+-------------+
| idle        | MICROSECOND |
| wait        | CYCLE       |
| stage       | NANOSECOND  |
| statement   | NANOSECOND  |
| transaction | NANOSECOND  |
+-------------+-------------+
```

Nota

A partir do MySQL 5.7.21, a tabela do Schema de Desempenho `setup_timers` está desatualizada e será removida no MySQL 8.0, assim como a linha `TICKS` na tabela `performance_timers`.

O valor `setup_timers.TIMER_NAME` pode ser alterado para selecionar um temporizador diferente. O valor pode ser qualquer um dos valores na coluna `performance_timers.TIMER_NAME`. Para uma explicação sobre como o temporização de eventos ocorre, consulte Seção 25.4.1, “Temporização de Eventos do Schema de Desempenho”.

As modificações na tabela `setup_timers` afetam o monitoramento imediatamente. Eventos já em andamento podem usar o temporizador original para a hora de início e o novo temporizador para a hora de término. Para evitar resultados imprevisíveis após fazer alterações nos temporizadores, use `TRUNCATE TABLE` para redefinir as estatísticas do Schema de Desempenho.

A tabela `setup_timers` tem as seguintes colunas:

- `NOME`

  O tipo de instrumento para o qual o temporizador é utilizado.

- `TIMER_NAME`

  O temporizador que se aplica ao tipo de instrumento. Esta coluna pode ser modificada.

A operação `TRUNCATE TABLE` não é permitida para a tabela `setup_timers`.
