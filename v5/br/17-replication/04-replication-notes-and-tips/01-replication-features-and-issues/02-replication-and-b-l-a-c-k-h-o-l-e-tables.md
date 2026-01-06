#### 16.4.1.2 Replicação e tabelas BLACKHOLE

O mecanismo de armazenamento `BLACKHOLE` aceita dados, mas os descarta e não os armazena. Ao realizar o registro binário, todas as inserções nessas tabelas são sempre registradas, independentemente do formato de registro em uso. As atualizações e exclusões são tratadas de maneira diferente, dependendo se o registro baseado em instruções ou em linhas está em uso. Com o formato de registro baseado em instruções, todas as instruções que afetam as tabelas `BLACKHOLE` são registradas, mas seus efeitos são ignorados. Ao usar o registro baseado em linhas, as atualizações e exclusões nessas tabelas são simplesmente ignoradas — elas não são escritas no log binário. Um aviso é registrado sempre que isso ocorre (Bug #13004581).

Por isso, recomendamos que, ao replicar para tabelas usando o mecanismo de armazenamento `BLACKHOLE`, você defina a variável de servidor `binlog_format` para `STATEMENT`, e não para `ROW` ou `MIXED`.
