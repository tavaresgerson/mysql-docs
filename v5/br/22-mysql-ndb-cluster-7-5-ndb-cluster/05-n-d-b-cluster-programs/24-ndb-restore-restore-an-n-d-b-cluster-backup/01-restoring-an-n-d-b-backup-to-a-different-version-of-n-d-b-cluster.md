#### 21.5.24.1 Restaurando um Backup NDB para uma Versão Diferente do NDB Cluster

As duas seções a seguir fornecem informações sobre como restaurar um Backup NDB nativo para uma versão diferente do NDB Cluster daquela em que o Backup foi realizado.

Além disso, você deve consultar [Seção 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), para outras questões que você possa encontrar ao tentar restaurar um Backup NDB para um Cluster executando uma versão diferente do software NDB.

Também é recomendável revisar [O que há de Novo no NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster-what-is-new.html#mysql-cluster-what-is-new-8-0), bem como [Seção 2.10.3, “Changes in MySQL 5.7”](upgrading-from-previous-series.html "2.10.3 Changes in MySQL 5.7"), para outras mudanças entre o NDB 8.0 e versões anteriores do NDB Cluster que possam ser relevantes para suas circunstâncias específicas.

##### 21.5.24.1.1 Restaurando um Backup NDB para uma versão anterior do NDB Cluster

Você pode encontrar problemas ao restaurar um Backup realizado em uma versão posterior do NDB Cluster para uma versão anterior, devido ao uso de recursos que não existem na versão mais antiga. Alguns desses problemas estão listados aqui:

*   Tables criadas no NDB 8.0 usam por padrão o conjunto de caracteres `utf8mb4_ai_ci`, que não está disponível no NDB 7.6 e anteriores e, portanto, não podem ser lidas por um Binary [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") dessas versões anteriores. Nesses casos, é necessário alterar quaisquer Tables que utilizam `utf8mb4_ai_ci` para que usem um conjunto de caracteres suportado na versão mais antiga antes de realizar o Backup.

*   Devido a alterações na forma como o MySQL Server e o NDB lidam com Table Metadata, Tables criadas ou alteradas usando o Binary do MySQL Server incluído a partir do NDB 8.0.14 ou posterior não podem ser restauradas usando o [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") para uma versão anterior do NDB Cluster. Tais Tables usam arquivos `.sdi` que não são compreendidos por versões mais antigas do [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

    Um Backup realizado no NDB 8.0.14 ou posterior de Tables que foram criadas no NDB 8.0.13 ou anterior, e que não foram alteradas desde o Upgrade para o NDB 8.0.14 ou posterior, deve ser restaurável para versões mais antigas do NDB Cluster.

    Uma vez que é possível restaurar Metadata e Table Data separadamente, você pode, nesses casos, restaurar os Table Schemas a partir de um dump feito usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), ou executando os comandos [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") necessários manualmente e, em seguida, importar apenas o Table Data usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") com a opção [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data).

*   Backups criptografados criados no NDB 8.0.22 e posteriores não podem ser restaurados usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") a partir do NDB 8.0.21 ou anterior.

*   O privilege [`NDB_STORED_USER`](/doc/refman/8.0/en/privileges-provided.html#priv_ndb-stored-user) não é suportado antes do NDB 8.0.18.

*   O NDB Cluster 8.0.18 e posterior suporta até 144 Data Nodes, enquanto as versões anteriores suportam um máximo de apenas 48 Data Nodes. Consulte [Seção 21.5.24.2.1, “Restoring to Fewer Nodes Than the Original”](ndb-restore-different-number-nodes.html#ndb-restore-to-fewer-nodes "21.5.24.2.1 Restoring to Fewer Nodes Than the Original"), para obter informações sobre situações em que essa incompatibilidade causa um problema.

##### 21.5.24.1.2 Restaurando um Backup NDB para uma versão posterior do NDB Cluster

Em geral, deve ser possível restaurar um Backup criado usando o comando [`START BACKUP`] do client [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") em uma versão mais antiga do NDB para uma versão mais nova, desde que você use o Binary [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") que acompanha a versão mais nova. (Pode ser possível usar a versão mais antiga do [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), mas isso não é recomendado.) Questões potenciais adicionais estão listadas aqui:

*   Ao restaurar o Metadata de um Backup (opção [`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta)), o [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") normalmente tenta reproduzir o Table Schema capturado exatamente como era quando o Backup foi realizado.

    Tables criadas em versões do NDB anteriores a 8.0.14 usam arquivos `.frm` para seu Metadata. Esses arquivos podem ser lidos pelo [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") no NDB 8.0.14 e posterior, que pode usar as informações contidas neles para criar os arquivos `.sdi` utilizados pelo Data Dictionary do MySQL em versões posteriores.

*   Ao restaurar um Backup mais antigo para uma versão mais nova do NDB, pode não ser possível tirar proveito de recursos mais novos, como hashmap partitioning, maior número de hashmap buckets, read backup e diferentes layouts de partitioning. Por esse motivo, pode ser preferível restaurar Schemas mais antigos usando [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e o client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), o que permite que o NDB utilize os novos recursos de Schema.

*   Tables que usam os tipos temporais antigos que não suportavam segundos fracionários (usados antes do MySQL 5.6.4 e NDB 7.3.31) não podem ser restauradas para o NDB 8.0 usando [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"). Você pode verificar essas Tables usando [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") e, em seguida, fazer o Upgrade delas para o formato de coluna temporal mais novo, se necessário, usando [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") no client [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"); isso deve ser feito antes de realizar o Backup. Consulte [Preparando Sua Instalação para Upgrade](/doc/refman/8.0/en/upgrade-prerequisites.html), para mais informações.

    Você também pode restaurar essas Tables usando um dump criado com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

*   Distributed grant tables criadas no NDB 7.6 e anteriores não são suportadas no NDB 8.0. Essas Tables podem ser restauradas para um NDB 8.0 Cluster, mas elas não têm efeito sobre o Access Control.