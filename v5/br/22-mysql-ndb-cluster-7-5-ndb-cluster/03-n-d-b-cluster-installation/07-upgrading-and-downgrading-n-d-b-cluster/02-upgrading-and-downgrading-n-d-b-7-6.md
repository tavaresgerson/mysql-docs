#### 21.3.7.2 Upgrade e Downgrade do NDB 7.6

Esta seção fornece informações sobre a compatibilidade entre diferentes releases do NDB Cluster 7.6 em relação à realização de upgrades e downgrades, bem como matrizes e notas de compatibilidade. Informações adicionais também podem ser encontradas aqui sobre downgrades do NDB 7.6 para séries de releases NDB anteriores. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar um upgrade ou downgrade. Consulte [Seção 21.4, “Configuração do NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuração do NDB Cluster").

A tabela mostrada aqui fornece informações sobre a compatibilidade de upgrade e downgrade do NDB Cluster entre diferentes releases do NDB 7.6. Notas adicionais sobre upgrades e downgrades para, a partir de, ou dentro da série de releases NDB Cluster 7.6 podem ser encontradas após a tabela.

**Figura 21.6 Compatibilidade de Upgrade e Downgrade do NDB Cluster, MySQL NDB Cluster 7.6**

![Representação gráfica da matriz de upgrade/downgrade contida no arquivo storage/ndb/src/common/util/version.cpp da árvore de código-fonte NDB 7.6.](images/mysql-cluster-upgrade-downgrade-7-6.png)

**Suporte a versões.** As seguintes versões do NDB Cluster são suportadas para upgrades para releases GA (General Availability) do NDB Cluster 7.6 (7.6.6 e posteriores):

* Releases GA do NDB Cluster 7.5 (7.5.4 e posteriores)
* Releases GA do NDB Cluster 7.4 (7.4.4 e posteriores)
* Releases GA do NDB Cluster 7.3 (7.3.2 e posteriores)

**Problemas Conhecidos ao Fazer Upgrade ou Downgrade do NDB Cluster 7.6.** Os seguintes problemas são conhecidos por ocorrerem ao fazer upgrade para, downgrade de, ou entre releases do NDB 7.6:

**Alterações no formato de arquivo Disk Data.** Devido a alterações no formato de disco, fazer upgrade para ou downgrade de qualquer uma das versões listadas aqui requer um `initial node restart` de cada `data node`:

* NDB 7.6.2
* NDB 7.6.4

Para evitar problemas relacionados ao formato antigo, você deve recriar quaisquer `tablespaces` e grupos de arquivos de `undo log` existentes ao fazer upgrade. Você pode fazer isso executando um `initial restart` de cada `data node` (ou seja, usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial)) como parte do processo de upgrade.

Se você estiver usando tabelas Disk Data, um downgrade de *qualquer* release NDB 7.6 para qualquer release NDB 7.5 ou anterior exige que você reinicie todos os `data nodes` com [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) como parte do processo de downgrade. Isso ocorre porque o NDB 7.5 e as séries de releases anteriores não conseguem ler o novo formato de arquivo Disk Data.

**Alterações no IndexMemory.** Se você estiver fazendo downgrade do NDB 7.6 para o NDB 7.5 (ou anterior), você deve definir um valor explícito para [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) no arquivo de configuração do Cluster, caso nenhum esteja presente. Isso ocorre porque o NDB 7.6 não usa este parâmetro e o define como 0 por padrão, enquanto ele é obrigatório no NDB 7.5 e em releases anteriores, nos quais o Cluster se recusa a iniciar com `Invalid configuration received from Management Server...` se `IndexMemory` não estiver definido para um valor diferente de zero.

Importante

Fazer upgrade para o NDB 7.6 a partir de um release anterior, ou downgrade do NDB 7.6 para um release anterior, requer a limpeza e a recriação do sistema de arquivos do `data node` do `NDB`, o que significa que cada `data node` deve ser reiniciado usando a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) como parte do `rolling restart` ou `system restart` normalmente exigido. (Iniciar um `data node` sem um sistema de arquivos já é equivalente a um `initial restart`; nesses casos, o `--initial` está implícito e não é obrigatório. Isso não foi alterado em relação aos releases anteriores do NDB Cluster.)

Quando tal `restart` é realizado como parte de um upgrade para o NDB 7.6, quaisquer arquivos LCP existentes são verificados quanto à presença do `Sysfile` LCP, indicando que o sistema de arquivos do `data node` existente foi gravado usando o NDB 7.6. Se tal sistema de arquivos de `node` existir, mas não contiver o `Sysfile`, e se quaisquer `data nodes` forem reiniciados sem a opção [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial), o `NDB` fará com que o `restart` falhe com uma mensagem de erro apropriada.

Você também deve estar ciente de que tal proteção não é possível ao fazer downgrade do NDB 7.6 para um release anterior ao NDB 7.6.