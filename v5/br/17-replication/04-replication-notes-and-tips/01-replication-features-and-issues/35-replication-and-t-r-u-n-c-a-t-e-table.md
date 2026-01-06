#### 16.4.1.35 Replicação e TRUNCATE TABLE

`TRUNCATE TABLE` é normalmente considerada uma instrução DML, e, portanto, seria esperado que fosse registrada e replicada usando o formato baseado em linha quando o modo de registro binário é `ROW` ou `MIXED`. No entanto, isso causou problemas ao registrar ou replicar, no modo `STATEMENT` ou `MIXED`, tabelas que usavam motores de armazenamento transacional, como `InnoDB` quando o nível de isolamento de transação era `READ COMMITTED` ou `READ UNCOMMITTED`, o que exclui o registro baseado em declarações.

`TRUNCATE TABLE` é tratado para fins de registro e replicação como DDL em vez de DML, para que possa ser registrado e replicado como uma instrução. No entanto, os efeitos da instrução, conforme aplicável a `InnoDB` e outras tabelas transacionais em réplicas, seguem ainda as regras descritas em Seção 13.1.34, “Instrução `TRUNCATE TABLE`”. (Bug
\#36763)
