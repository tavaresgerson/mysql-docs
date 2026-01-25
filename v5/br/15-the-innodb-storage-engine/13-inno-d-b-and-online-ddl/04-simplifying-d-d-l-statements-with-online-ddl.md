### 14.13.4 Simplificando Instruções DDL com DDL Online

Antes da introdução do DDL online, era prática comum combinar muitas operações DDL em uma única instrução `ALTER TABLE`. Como cada instrução `ALTER TABLE` envolvia copiar e reconstruir a tabela, era mais eficiente fazer diversas alterações na mesma tabela de uma só vez, visto que essas alterações poderiam ser feitas com uma única operação de rebuild (reconstrução) para a tabela. A desvantagem era que o código SQL que envolvia operações DDL era mais difícil de manter e de reutilizar em scripts diferentes. Se as alterações específicas fossem diferentes a cada vez, você poderia ter que construir um novo `ALTER TABLE` complexo para cada cenário ligeiramente diferente.

Para operações DDL que podem ser feitas *in place* (no local), você pode separá-las em instruções `ALTER TABLE` individuais para facilitar a criação de scripts e a manutenção, sem sacrificar a eficiência. Por exemplo, você pode pegar uma instrução complicada como:

```sql
ALTER TABLE t1 ADD INDEX i1(c1), ADD UNIQUE INDEX i2(c2),
  CHANGE c4_old_name c4_new_name INTEGER UNSIGNED;
```

e decompô-la em partes mais simples que podem ser testadas e executadas independentemente, como:

```sql
ALTER TABLE t1 ADD INDEX i1(c1);
ALTER TABLE t1 ADD UNIQUE INDEX i2(c2);
ALTER TABLE t1 CHANGE c4_old_name c4_new_name INTEGER UNSIGNED NOT NULL;
```

Você ainda pode usar instruções `ALTER TABLE` de múltiplas partes para:

*   Operações que devem ser executadas em uma sequência específica, como criar um Index seguido por uma Foreign Key constraint que utiliza esse Index.

*   Operações que utilizam a mesma cláusula `LOCK` específica, e que você deseja que sejam bem-sucedidas ou falhem como um grupo.

*   Operações que não podem ser executadas *in place*, ou seja, que ainda utilizam o método de cópia da tabela (*table-copy* method).

*   Operações para as quais você especifica `ALGORITHM=COPY` ou `old_alter_table=1`, para forçar o comportamento de cópia da tabela (*table-copying behavior*) se necessário para uma compatibilidade retroativa (*backward-compatibility*) precisa em cenários especializados.