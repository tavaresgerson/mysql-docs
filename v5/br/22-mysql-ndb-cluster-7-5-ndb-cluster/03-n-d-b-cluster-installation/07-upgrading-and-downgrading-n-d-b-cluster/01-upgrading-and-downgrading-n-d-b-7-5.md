#### 21.3.7.1 Atualizando e Rebaixando NDB 7.5

Esta seção fornece informações sobre a compatibilidade entre diferentes releases do NDB Cluster 7.5 em relação à execução de upgrades e downgrades, bem como matrizes de compatibilidade e notas. Informações adicionais também podem ser encontradas aqui sobre downgrades do NDB 7.5 para séries de releases NDB anteriores. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar um upgrade ou downgrade. Consulte [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster").

A tabela mostrada aqui fornece informações sobre a compatibilidade de upgrade e downgrade do NDB Cluster entre diferentes releases do NDB 7.5. Notas adicionais sobre upgrades e downgrades para, de, ou dentro da série de releases NDB Cluster 7.5 podem ser encontradas após a tabela.

**Figura 21.5 Compatibilidade de Upgrade e Downgrade do NDB Cluster, MySQL NDB Cluster 7.5**

![Representação gráfica da matriz de upgrade/downgrade contida no arquivo storage/ndb/src/common/util/version.cpp da árvore de código-fonte do NDB 7.5.](images/mysql-cluster-upgrade-downgrade-7-5.png)

**Suporte a Versionamento.** As seguintes versões do NDB Cluster são suportadas para upgrades para releases GA (General Availability) do NDB Cluster 7.5 (7.5.4 e posterior):

* Releases GA do NDB Cluster 7.4 (7.4.4 e posterior)
* Releases GA do NDB Cluster 7.3 (7.3.2 e posterior)

**Problemas Conhecidos ao Fazer Upgrade ou Downgrade do NDB Cluster 7.5.** Os seguintes problemas são conhecidos por ocorrerem ao fazer upgrade para ou entre releases do NDB 7.5:

* Quando executado com `--initialize`, o server não requer suporte [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"); ter o `NDB` habilitado neste momento pode causar problemas com as tabelas [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database"). Para evitar que isso aconteça, a opção `--initialize` agora faz com que o [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") ignore a opção `--ndbcluster` se esta também for especificada.

  Um workaround para um upgrade que falhou por esses motivos pode ser realizado da seguinte forma:

  1. Realize um *rolling restart* de todo o cluster
  2. Exclua todos os arquivos `.frm` no diretório `data/ndbinfo`

  3. Execute [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

  (Bug #81689, Bug #82724, Bug #24521927, Bug #23518923)

* Durante um online upgrade de um release NDB Cluster 7.3 para um release NDB 7.4 (ou posterior), as falhas de vários data nodes executando a versão anterior durante local checkpoints (LCPs), e pouco antes de fazer o upgrade desses nodes, levaram a falhas adicionais de node após o upgrade. Isso ocorreu devido a elementos persistentes do protocolo `EMPTY_LCP` iniciado pelos nodes mais antigos como parte de uma sequência LCP-plus-restart, e que não é mais usado no NDB 7.4 e posterior devido a otimizações de LCP implementadas nessas versões. Este problema foi corrigido no NDB 7.5.4. (Bug
  #23129433)

* No NDB 7.5 (e posterior), a tabela `ndb_binlog_index` usa o storage engine [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"). O uso do storage engine [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") para esta tabela continua a ser suportado para compatibilidade retroativa.

  Ao fazer upgrade de um release anterior para o NDB 7.5 (ou posterior), você pode usar as opções [`--force`](mysql-upgrade.html#option_mysql_upgrade_force) e [`--upgrade-system-tables`](mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables) com o [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") para que ele execute [`ALTER TABLE ... ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") na tabela `ndb_binlog_index`.

  Para mais informações, consulte [Section 21.7.4, “NDB Cluster Replication Schema and Tables”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables").