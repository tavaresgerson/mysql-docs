#### 16.4.1.5 Replicação de Instruções CREATE ... IF NOT EXISTS

O MySQL aplica as seguintes regras quando várias instruções `CREATE ... IF NOT EXISTS` são replicadas:

* Toda instrução [`CREATE DATABASE IF NOT EXISTS`](create-database.html "13.1.11 CREATE DATABASE Statement") é replicada, independentemente de o Database já existir no Source.

* De forma similar, toda instrução [`CREATE TABLE IF NOT EXISTS`](create-table.html "13.1.18 CREATE TABLE Statement") sem um [`SELECT`](select.html "13.2.9 SELECT Statement") é replicada, independentemente de a Table já existir no Source. Isso inclui [`CREATE TABLE IF NOT EXISTS ... LIKE`](create-table-like.html "13.1.18.3 CREATE TABLE ... LIKE Statement"). A replicação de [`CREATE TABLE IF NOT EXISTS ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") segue regras ligeiramente diferentes; consulte [Seção 16.4.1.6, “Replicação de Instruções CREATE TABLE ... SELECT”](replication-features-create-select.html "16.4.1.6 Replication of CREATE TABLE ... SELECT Statements"), para mais informações.

* [`CREATE EVENT IF NOT EXISTS`](create-event.html "13.1.12 CREATE EVENT Statement") é sempre replicado, independentemente de o Event nomeado na instrução já existir no Source.