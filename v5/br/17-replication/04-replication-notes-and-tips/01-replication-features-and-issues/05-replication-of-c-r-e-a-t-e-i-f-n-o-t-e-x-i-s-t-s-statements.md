#### 16.4.1.5 Replicação de declarações CREATE ... IF NOT EXISTS

O MySQL aplica essas regras quando várias instruções `CREATE ... IF NOT EXISTS` são replicadas:

- Cada instrução `CREATE DATABASE IF NOT EXISTS` é replicada, independentemente de a base de dados já existir na origem ou

- Da mesma forma, cada instrução `CREATE TABLE IF NOT EXISTS` sem uma instrução `SELECT` é replicada, independentemente de a tabela já existir na origem. Isso inclui `CREATE TABLE IF NOT EXISTS ... LIKE`. A replicação de `CREATE TABLE IF NOT EXISTS ... SELECT` segue regras um pouco diferentes; consulte Seção 16.4.1.6, “Replicação de Instruções CREATE TABLE ... SELECT”, para mais informações.

- `CREATE EVENT IF NOT EXISTS` é sempre replicado, independentemente de o evento nomeado na declaração já existir na fonte ou
