#### 16.4.1.5 Replicação de Instruções CREATE ... IF NOT EXISTS

O MySQL aplica as seguintes regras quando várias instruções `CREATE ... IF NOT EXISTS` são replicadas:

* Toda instrução `CREATE DATABASE IF NOT EXISTS` é replicada, independentemente de o Database já existir no Source.

* De forma similar, toda instrução `CREATE TABLE IF NOT EXISTS` sem um `SELECT` é replicada, independentemente de a Table já existir no Source. Isso inclui `CREATE TABLE IF NOT EXISTS ... LIKE`. A replicação de `CREATE TABLE IF NOT EXISTS ... SELECT` segue regras ligeiramente diferentes; consulte Seção 16.4.1.6, “Replicação de Instruções CREATE TABLE ... SELECT”, para mais informações.

* `CREATE EVENT IF NOT EXISTS` é sempre replicado, independentemente de o Event nomeado na instrução já existir no Source.