### 14.13.4 Simplificando declarações DDL com DDL online

Antes da introdução do DDL online, era comum combinar várias operações de DDL em uma única instrução `ALTER TABLE`. Como cada instrução `ALTER TABLE` envolvia a cópia e a reconstrução da tabela, era mais eficiente fazer várias alterações na mesma tabela de uma vez, pois essas alterações poderiam ser todas feitas com uma única operação de reconstrução da tabela. O inconveniente era que o código SQL envolvendo operações de DDL era mais difícil de manter e reutilizar em diferentes scripts. Se as alterações específicas fossem diferentes a cada vez, você poderia ter que construir uma nova e complexa instrução `ALTER TABLE` para cada cenário ligeiramente diferente.

Para operações DDL que podem ser realizadas in situ, você pode separá-las em declarações individuais de `ALTER TABLE` para facilitar o script e a manutenção, sem sacrificar a eficiência. Por exemplo, você pode tomar uma declaração complicada como:

```sql
ALTER TABLE t1 ADD INDEX i1(c1), ADD UNIQUE INDEX i2(c2),
  CHANGE c4_old_name c4_new_name INTEGER UNSIGNED;
```

e divida-o em partes mais simples que possam ser testadas e executadas de forma independente, como:

```sql
ALTER TABLE t1 ADD INDEX i1(c1);
ALTER TABLE t1 ADD UNIQUE INDEX i2(c2);
ALTER TABLE t1 CHANGE c4_old_name c4_new_name INTEGER UNSIGNED NOT NULL;
```

Você ainda pode usar declarações `ALTER TABLE` de várias partes para:

- Operações que devem ser realizadas em uma sequência específica, como criar um índice seguido de uma restrição de chave estrangeira que utilize esse índice.

- As operações utilizam a mesma cláusula `LOCK` específica, que você deseja que seja bem-sucedida ou falha como um grupo.

- Operações que não podem ser realizadas no local, ou seja, que ainda utilizam o método de cópia de tabela.

- Operações para as quais você especificar `ALGORITHM=COPY` ou `old_alter_table=1`, para forçar o comportamento de cópia da tabela, se necessário, para compatibilidade reversa precisa em cenários especializados.
