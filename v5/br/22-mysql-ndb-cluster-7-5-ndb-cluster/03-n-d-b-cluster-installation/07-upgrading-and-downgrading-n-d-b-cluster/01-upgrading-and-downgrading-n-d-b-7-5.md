#### 21.3.7.1 Atualizando e Rebaixando NDB 7.5

Esta seção fornece informações sobre a compatibilidade entre diferentes releases do NDB Cluster 7.5 em relação à execução de upgrades e downgrades, bem como matrizes de compatibilidade e notas. Informações adicionais também podem ser encontradas aqui sobre downgrades do NDB 7.5 para séries de releases NDB anteriores. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar um upgrade ou downgrade. Consulte Section 21.4, “Configuration of NDB Cluster”.

A tabela mostrada aqui fornece informações sobre a compatibilidade de upgrade e downgrade do NDB Cluster entre diferentes releases do NDB 7.5. Notas adicionais sobre upgrades e downgrades para, de, ou dentro da série de releases NDB Cluster 7.5 podem ser encontradas após a tabela.

**Figura 21.5 Compatibilidade de Upgrade e Downgrade do NDB Cluster, MySQL NDB Cluster 7.5**

![Representação gráfica da matriz de upgrade/downgrade contida no arquivo storage/ndb/src/common/util/version.cpp da árvore de código-fonte do NDB 7.5.](/images/mysql-cluster-upgrade-downgrade-7-5.png)

**Suporte a Versionamento.** As seguintes versões do NDB Cluster são suportadas para upgrades para releases GA (General Availability) do NDB Cluster 7.5 (7.5.4 e posterior):

* Releases GA do NDB Cluster 7.4 (7.4.4 e posterior)
* Releases GA do NDB Cluster 7.3 (7.3.2 e posterior)

**Problemas Conhecidos ao Fazer Upgrade ou Downgrade do NDB Cluster 7.5.** Os seguintes problemas são conhecidos por ocorrerem ao fazer upgrade para ou entre releases do NDB 7.5:

* Quando executado com `--initialize`, o server não requer suporte `NDB`; ter o `NDB` habilitado neste momento pode causar problemas com as tabelas `ndbinfo`. Para evitar que isso aconteça, a opção `--initialize` agora faz com que o **mysqld** ignore a opção `--ndbcluster` se esta também for especificada.

  Um workaround para um upgrade que falhou por esses motivos pode ser realizado da seguinte forma:

  1. Realize um *rolling restart* de todo o cluster
  2. Exclua todos os arquivos `.frm` no diretório `data/ndbinfo`

  3. Execute **mysql_upgrade**.

  (Bug #81689, Bug #82724, Bug #24521927, Bug #23518923)

* Durante um online upgrade de um release NDB Cluster 7.3 para um release NDB 7.4 (ou posterior), as falhas de vários data nodes executando a versão anterior durante local checkpoints (LCPs), e pouco antes de fazer o upgrade desses nodes, levaram a falhas adicionais de node após o upgrade. Isso ocorreu devido a elementos persistentes do protocolo `EMPTY_LCP` iniciado pelos nodes mais antigos como parte de uma sequência LCP-plus-restart, e que não é mais usado no NDB 7.4 e posterior devido a otimizações de LCP implementadas nessas versões. Este problema foi corrigido no NDB 7.5.4. (Bug
  #23129433)

* No NDB 7.5 (e posterior), a tabela `ndb_binlog_index` usa o storage engine `InnoDB`. O uso do storage engine `MyISAM` para esta tabela continua a ser suportado para compatibilidade retroativa.

  Ao fazer upgrade de um release anterior para o NDB 7.5 (ou posterior), você pode usar as opções `--force` e `--upgrade-system-tables` com o **mysql_upgrade** para que ele execute `ALTER TABLE ... ENGINE=INNODB` na tabela `ndb_binlog_index`.

  Para mais informações, consulte Section 21.7.4, “NDB Cluster Replication Schema and Tables”.