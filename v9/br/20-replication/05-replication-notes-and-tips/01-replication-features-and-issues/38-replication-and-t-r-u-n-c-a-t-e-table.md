#### 19.5.1.38 Replicação e TRUNCATE TABLE

O `TRUNCATE TABLE` é normalmente considerado uma instrução DML, e, portanto, seria esperado que fosse registrado e replicado usando o formato baseado em linha quando o modo de registro binário for `ROW` ou `MIXED`. No entanto, isso causou problemas ao registrar ou replicar, no modo `STATEMENT` ou `MIXED`, tabelas que usavam motores de armazenamento transacionais, como `InnoDB`, quando o nível de isolamento de transação era `READ COMMITTED` ou `READ UNCOMMITTED`, o que exclui o registro baseado em declarações.

O `TRUNCATE TABLE` é tratado para fins de registro e replicação como DDL em vez de DML, para que possa ser registrado e replicado como uma declaração. No entanto, os efeitos da declaração, aplicáveis a `InnoDB` e outras tabelas transacionais em réplicas, ainda seguem as regras descritas na Seção 15.1.42, “Declaração TRUNCATE TABLE” que regem tais tabelas. (Bug
#36763)