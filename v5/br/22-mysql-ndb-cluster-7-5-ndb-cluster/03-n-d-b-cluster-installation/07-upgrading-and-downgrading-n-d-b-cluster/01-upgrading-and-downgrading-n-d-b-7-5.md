#### 21.3.7.1 Atualização e Downgrade do NDB 7.5

Esta seção fornece informações sobre a compatibilidade entre diferentes versões do NDB Cluster 7.5 em relação à realização de atualizações e reduções, bem como matrizes de compatibilidade e notas. Informações adicionais também podem ser encontradas aqui sobre reduções do NDB 7.5 para séries anteriores de versões do NDB. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou redução. Consulte Seção 21.4, “Configuração do NDB Cluster”.

A tabela mostrada aqui fornece informações sobre a compatibilidade de atualização e downgrade do NDB Cluster entre diferentes versões do NDB 7.5. Notas adicionais sobre atualizações e downgrades para, a partir de ou dentro da série de versões do NDB Cluster 7.5 podem ser encontradas após a tabela.

**Figura 21.5 Compatibilidade de Atualização e Downgrade do NDB Cluster, MySQL NDB Cluster 7.5**

![Representação gráfica da matriz de atualização/desatualização contida no arquivo storage/ndb/src/common/util/version.cpp da árvore de código-fonte do NDB 7.5](images/mysql-cluster-upgrade-downgrade-7-5.png)

**Suporte de versão.** As seguintes versões do NDB Cluster são suportadas para atualizações para versões GA do NDB Cluster 7.5 (7.5.4 e versões posteriores):

- Lançamento do NDB Cluster 7.4 GA (7.4.4 e versões posteriores)
- Lançamento do NDB Cluster 7.3 GA (7.3.2 e versões posteriores)

**Problemas Conhecidos Durante a Atualização ou Downgrade do NDB Cluster 7.5.** Os seguintes problemas são conhecidos para ocorrer durante a atualização para ou entre as versões do NDB 7.5:

- Quando executado com `--initialize`, o servidor não requer suporte ao `NDB`; ter o `NDB` ativado neste momento pode causar problemas com as tabelas do `ndbinfo`. Para evitar isso, a opção `--initialize` agora faz com que o **mysqld** ignore a opção `--ndbcluster` se esta também for especificada.

  Uma solução para uma atualização que falhou por essas razões pode ser realizada da seguinte forma:

  1. Realize um reinício em rolagem de todo o clúster

  2. Exclua todos os arquivos `.frm` no diretório `data/ndbinfo`

  3. Execute **mysql\_upgrade**.

  (Bug #81689, Bug #82724, Bug #24521927, Bug #23518923)

- Durante uma atualização online de uma versão do NDB Cluster 7.3 para uma versão do NDB 7.4 (ou posterior), os falhos de vários nós de dados que executavam a versão mais antiga durante os pontos de verificação locais (LCPs) e logo antes da atualização desses nós levaram a falhas adicionais de nós após a atualização. Isso ocorreu devido a elementos persistentes do protocolo `EMPTY_LCP` iniciado pelos nós mais antigos como parte de uma sequência LCP-plus-restart, que não é mais usada no NDB 7.4 e versões posteriores devido às otimizações LCP implementadas nessas versões. Esse problema foi corrigido no NDB 7.5.4. (Bug
  \#23129433)

- No NDB 7.5 (e versões posteriores), a tabela `ndb_binlog_index` utiliza o mecanismo de armazenamento `InnoDB` (innodb-storage-engine.html). O uso do mecanismo de armazenamento `MyISAM` (myisam-storage-engine.html) para esta tabela continua sendo suportado para compatibilidade reversa.

  Ao atualizar uma versão anterior para o NDB 7.5 (ou posterior), você pode usar as opções `--force` e `--upgrade-system-tables` com o **mysql\_upgrade** para que ele execute a alteração `ALTER TABLE ... ENGINE=INNODB` na tabela `ndb_binlog_index`.

  Para obter mais informações, consulte Seção 21.7.4, “Esquema e tabelas de replicação de cluster NDB”.
