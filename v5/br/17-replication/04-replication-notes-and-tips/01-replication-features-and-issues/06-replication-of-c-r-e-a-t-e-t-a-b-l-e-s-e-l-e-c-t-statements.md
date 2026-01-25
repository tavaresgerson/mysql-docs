#### 16.4.1.6 Replicação de Comandos CREATE TABLE ... SELECT

Esta seção discute como o MySQL replica comandos [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement").

O MySQL 5.7 não permite que um comando [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") faça alterações em tabelas diferentes daquela que está sendo criada pelo comando. Algumas versões mais antigas do MySQL permitiam que esses comandos fizessem isso; isso significa que, ao usar Replication entre uma Replica MySQL 5.6 ou posterior e uma Source executando uma versão anterior do MySQL, um comando [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") que cause alterações em outras tabelas na Source falhará na Replica, fazendo com que a Replication seja interrompida. Para evitar que isso aconteça, você deve usar *row-based replication* (replicação baseada em linha), reescrever o comando problemático antes de executá-lo na Source, ou fazer upgrade da Source para o MySQL 5.7. (Se você optar por fazer upgrade da Source, lembre-se de que tal comando [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") falhará após o upgrade, a menos que seja reescrito para remover quaisquer efeitos colaterais em outras tabelas.)

Estes comportamentos não dependem da versão do MySQL:

* [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") sempre executa um *implicit commit* (commit implícito) ([Seção 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit")).

* Se a tabela de destino não existir, o log ocorre da seguinte forma. Não importa se `IF NOT EXISTS` está presente.

  + Formato `STATEMENT` ou `MIXED`: O comando é registrado no log conforme escrito.

  + Formato `ROW`: O comando é registrado no log como um comando [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") seguido por uma série de eventos *insert-row*.

* Se o comando falhar, nada é registrado no log. Isso inclui o caso em que a tabela de destino existe e `IF NOT EXISTS` não é fornecido.

Quando a tabela de destino existe e `IF NOT EXISTS` é fornecido, o MySQL 5.7 ignora o comando completamente; nada é inserido ou registrado no log.