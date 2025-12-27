#### 19.5.1.6 Replicação de declarações CREATE ... IF NOT EXISTS

O MySQL aplica essas regras quando várias declarações `CREATE ... IF NOT EXISTS` são replicadas:

* Toda declaração `CREATE DATABASE IF NOT EXISTS` é replicada, independentemente de a base de dados já existir na origem.

* Da mesma forma, toda declaração `CREATE TABLE IF NOT EXISTS` sem um `SELECT` é replicada, independentemente de a tabela já existir na origem. Isso inclui `CREATE TABLE IF NOT EXISTS ... LIKE`. A replicação de `CREATE TABLE IF NOT EXISTS ... SELECT` segue regras um pouco diferentes; consulte a Seção 19.5.1.7, “Replicação de declarações CREATE TABLE ... SELECT”, para obter mais informações.

* `CREATE EVENT IF NOT EXISTS` é sempre replicada, independentemente de o evento nomeado na declaração já existir na origem.

* `CREATE USER` é escrito no log binário apenas se for bem-sucedido. Se a declaração incluir `IF NOT EXISTS`, ela é considerada bem-sucedida e é registrada, desde que pelo menos um usuário nomeado na declaração seja criado; nesses casos, a declaração é registrada como escrita; isso inclui referências a usuários existentes que não foram criados. Consulte Registro de Log Binário de CREATE USER, para obter mais informações.

* `CREATE PROCEDURE IF NOT EXISTS`, `CREATE FUNCTION IF NOT EXISTS` ou `CREATE TRIGGER IF NOT EXISTS`, se bem-sucedidos, são escritos na íntegra no log binário (incluindo a cláusula `IF NOT EXISTS`), independentemente de a declaração ter gerado uma mensagem de alerta porque o objeto (procedimento, função ou gatilho) já existia.