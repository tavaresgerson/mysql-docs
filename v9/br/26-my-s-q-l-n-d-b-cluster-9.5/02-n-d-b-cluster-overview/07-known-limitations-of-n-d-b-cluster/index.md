### 25.2.7 Limitações Conhecidas do NDB Cluster

25.2.7.1 Não Conformidade com a Sintaxe SQL no NDB Cluster

25.2.7.2 Limitações e Diferenças do NDB Cluster em Relação aos Limites Padrão do MySQL

25.2.7.3 Limitações Relacionadas ao Tratamento de Transações no NDB Cluster

25.2.7.4 Gerenciamento de Erros no NDB Cluster

25.2.7.5 Limitações Associadas aos Objetos de Banco de Dados no NDB Cluster

25.2.7.6 Recursos Não Suportadores ou Ausentes no NDB Cluster

25.2.7.7 Limitações Relacionadas ao Desempenho no NDB Cluster

25.2.7.8 Problemas Exclusivos do NDB Cluster

25.2.7.9 Limitações Relacionadas ao Armazenamento de Dados de Disco no NDB Cluster

25.2.7.10 Limitações Relacionadas a Nodos Múltiplos do NDB Cluster

Nas seções a seguir, discutimos as limitações conhecidas nas versões atuais do NDB Cluster em comparação com os recursos disponíveis ao usar os motores de armazenamento `MyISAM` e `InnoDB`. Se você verificar a categoria “Cluster” no banco de bugs do MySQL em <http://bugs.mysql.com>, você pode encontrar bugs conhecidos nas seguintes categorias sob “MySQL Server:” no banco de bugs do MySQL em <http://bugs.mysql.com>, que pretendemos corrigir nas próximas versões do NDB Cluster:

* NDB Cluster
* API Direta do Cluster (NDBAPI)
* Dados de Disco do Cluster
* Replicação do Cluster
* ClusterJ

Esta informação é destinada a ser completa em relação às condições estabelecidas. Você pode relatar quaisquer discrepâncias que encontrar no banco de bugs do MySQL usando as instruções fornecidas na Seção 1.6, “Como Relatar Bugs ou Problemas”. Qualquer problema que não planejamos corrigir no NDB Cluster 9.5 é adicionado à lista.

Nota

As limitações e outros problemas específicos à Replicação do NDB Cluster são descritos na Seção 25.7.3, “Problemas Conhecidos na Replicação do NDB Cluster”.