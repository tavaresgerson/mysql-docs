### 17.12.6 Simplificando declarações DDL com DDL online

Antes da introdução do DDL online, era prática comum combinar muitas operações DDL em uma única declaração `ALTER TABLE`. Como cada declaração `ALTER TABLE` envolvia a cópia e a reconstrução da tabela, era mais eficiente fazer várias alterações na mesma tabela de uma vez, pois essas alterações poderiam ser todas feitas com uma única operação de reconstrução da tabela. A desvantagem era que o código SQL envolvendo operações DDL era mais difícil de manter e reutilizar em diferentes scripts. Se as alterações específicas fossem diferentes a cada vez, você poderia ter que construir uma nova declaração complexa `ALTER TABLE` para cada cenário ligeiramente diferente.

Para operações DDL que podem ser feitas online, você pode separá-las em declarações `ALTER TABLE` individuais para facilitar a programação e a manutenção, sem sacrificar a eficiência. Por exemplo, você pode tomar uma declaração complicada como:

```
ALTER TABLE t1 ADD INDEX i1(c1), ADD UNIQUE INDEX i2(c2),
  CHANGE c4_old_name c4_new_name INTEGER UNSIGNED;
```

e dividi-la em partes mais simples que podem ser testadas e executadas de forma independente, como:

```
ALTER TABLE t1 ADD INDEX i1(c1);
ALTER TABLE t1 ADD UNIQUE INDEX i2(c2);
ALTER TABLE t1 CHANGE c4_old_name c4_new_name INTEGER UNSIGNED NOT NULL;
```

Você ainda pode usar declarações `ALTER TABLE` de várias partes para:

* Operações que devem ser realizadas em uma sequência específica, como criar um índice seguido de uma restrição de chave estrangeira que usa esse índice.

* Operações que usam todas as mesmas restrições específicas `LOCK`, que você deseja que sejam bem-sucedidas ou falhas como um grupo.

* Operações que não podem ser realizadas online, ou seja, que ainda usam o método de cópia da tabela.

* Operações para as quais você especifica `ALGORITHM=COPY` ou `old_alter_table=1`, para forçar o comportamento de cópia da tabela, se necessário, para compatibilidade reversa precisa em cenários especializados.