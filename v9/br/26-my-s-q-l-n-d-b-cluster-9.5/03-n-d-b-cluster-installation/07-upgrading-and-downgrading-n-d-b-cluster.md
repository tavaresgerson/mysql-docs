### 25.3.7 Atualização e Desatualização do NDB Cluster

* Versões suportadas para atualização para o NDB 9.5
* Problemas conhecidos ao atualizar ou desatualizar o NDB Cluster

Esta seção fornece informações sobre o software NDB Cluster e a compatibilidade entre diferentes versões do NDB Cluster em relação à realização de atualizações e desatualizações. Você já deve estar familiarizado com a instalação e configuração do NDB Cluster antes de tentar uma atualização ou desatualização. Consulte a Seção 25.4, “Configuração do NDB Cluster”.

Para informações sobre atualizações para o NDB 9.5 a partir de versões anteriores, consulte Versões suportadas para atualização para o NDB 9.5.

Para informações sobre problemas conhecidos e problemas encontrados ao atualizar ou desatualizar o NDB 9.5, consulte Problemas conhecidos ao atualizar ou desatualizar o NDB Cluster.

#### Versões suportadas para atualização para o NDB 9.5

As seguintes versões do NDB Cluster são suportadas para atualizações para o NDB Cluster 9.5:

* NDB Cluster 8.0: NDB 8.0.19 e versões posteriores
* NDB Cluster 8.1 (8.1.0)
* NDB Cluster 8.2 (8.2.0)
* NDB Cluster 8.3 (8.3.0)

#### Problemas conhecidos ao atualizar ou desatualizar o NDB Cluster

Nesta seção, forneça informações sobre problemas conhecidos que ocorrem ao atualizar ou desatualizar para ou a partir do NDB 9.5.

Recomendamos que você não tente realizar alterações no esquema durante qualquer atualização ou desatualização do software NDB Cluster. Algumas das razões para isso estão listadas aqui:

* As instruções DDL nas tabelas `NDB` não são possíveis durante algumas fases do inicialização do nó de dados.

* As instruções DDL nas tabelas `NDB` podem ser rejeitadas se algum nó de dados for parado durante a execução; é necessário parar cada binário do nó de dados (para que possa ser substituído por um binário da versão alvo) como parte do processo de atualização ou desatualização.

* As declarações DDL sobre as tabelas `NDB` não são permitidas enquanto houver nós de dados no mesmo clúster executando diferentes versões de lançamento do software do NDB Cluster.

Para obter informações adicionais sobre o procedimento de reinício contínuo usado para realizar uma atualização ou atualização para uma versão diferente dos nós de dados do NDB Cluster online, consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”.