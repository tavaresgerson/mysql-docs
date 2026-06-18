#### 16.4.1.9 Replicação de Declarações DROP ... IF EXISTS

As declarações `DROP DATABASE IF EXISTS`, `DROP TABLE IF EXISTS` e `DROP VIEW IF EXISTS` são sempre replicadas, mesmo que o Database, Table ou View a ser descartado não exista no Source. Isso serve para garantir que o objeto a ser descartado não exista mais nem no Source nem na Replica, assim que a Replica tiver alcançado o Source.

Declarações `DROP ... IF EXISTS` para programas armazenados (stored procedures e functions, triggers e events) também são replicadas, mesmo que o programa armazenado a ser descartado não exista no Source.
