#### 19.5.1.6 Replicação de declarações CREATE ... IF NOT EXISTS

O MySQL aplica essas regras quando várias instruções `CREATE ... IF NOT EXISTS` são replicadas:

- Cada declaração `CREATE DATABASE IF NOT EXISTS` é replicada, independentemente de o banco de dados já existir na fonte ou

- Da mesma forma, cada declaração `CREATE TABLE IF NOT EXISTS` sem um `SELECT` é replicada, independentemente de a tabela já existir na fonte. Isso inclui `CREATE TABLE IF NOT EXISTS ... LIKE`. A replicação de `CREATE TABLE IF NOT EXISTS ... SELECT` segue regras um pouco diferentes; consulte a Seção 19.5.1.7, “Replicação de Declarações CREATE TABLE ... SELECT”, para obter mais informações.

- `CREATE EVENT IF NOT EXISTS` é sempre replicado, independentemente de o evento mencionado na declaração já existir na fonte ou

- `CREATE USER` é escrito no log binário apenas se for bem-sucedido. Se a declaração incluir `IF NOT EXISTS`, ela é considerada bem-sucedida e é registrada, desde que pelo menos um usuário mencionado na declaração seja criado; nesses casos, a declaração é registrada como escrita; isso inclui referências a usuários existentes que não foram criados. Consulte Registro de Log Binário de CREATE USER para obter mais informações.

- (*MySQL 8.0.29 e versões posteriores*:) `CREATE PROCEDURE IF NOT EXISTS`, `CREATE FUNCTION IF NOT EXISTS` ou `CREATE TRIGGER IF NOT EXISTS` são escritos, se forem bem-sucedidos, na íntegra no log binário (incluindo a cláusula `IF NOT EXISTS`), independentemente de a instrução ter gerado uma mensagem de alerta ou não, porque o objeto (procedimento, função ou gatilho) já existia.
