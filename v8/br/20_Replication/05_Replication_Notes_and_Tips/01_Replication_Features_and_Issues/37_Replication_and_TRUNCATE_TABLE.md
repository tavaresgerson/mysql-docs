#### 19.5.1.37 Replicação e TRUNCATE TABLE

Normalmente, `TRUNCATE TABLE` é considerado uma instrução DML, e, portanto, deve ser registrada e replicada usando o formato baseado em linhas quando o modo de registro binário é `ROW` ou `MIXED`. No entanto, isso causou problemas ao registrar ou replicar, no modo `STATEMENT` ou `MIXED`, tabelas que usavam motores de armazenamento transacional, como `InnoDB`, quando o nível de isolamento de transação era `READ COMMITTED` ou `READ UNCOMMITTED`, o que exclui o registro baseado em instruções.

`TRUNCATE TABLE` é tratado para fins de registro e replicação como DDL em vez de DML, para que possa ser registrado e replicado como uma declaração. No entanto, os efeitos da declaração, conforme aplicável a `InnoDB` e outras tabelas transacionais em réplicas, ainda seguem as regras descritas na Seção 15.1.37, “Declaração TRUNCATE TABLE” que regem tais tabelas. (Bug
\#36763)
