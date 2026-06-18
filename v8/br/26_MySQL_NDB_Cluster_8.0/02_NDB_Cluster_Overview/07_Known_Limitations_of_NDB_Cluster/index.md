### 25.2.7 Limitações conhecidas do NDB Cluster

25.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster

25.2.7.2 Limites e Diferenças do NDB Cluster em relação aos Limites Padrão do MySQL

25.2.7.3 Limites relacionados ao processamento de transações no NDB Cluster

25.2.7.4 Gerenciamento de Erros do NDB Cluster

25.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster

25.2.7.6 Recursos não suportados ou ausentes no NDB Cluster

25.2.7.7 Limitações relacionadas ao desempenho no cluster NDB

25.2.7.8 Problemas exclusivos do NDB Cluster

25.2.7.9 Limitações relacionadas ao armazenamento de dados do disco do cluster NDB

25.2.7.10 Limitações relacionadas a múltiplos nós do cluster NDB

25.2.7.11 Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0

Nas seções a seguir, discutimos as limitações conhecidas das versões atuais do NDB Cluster em comparação com os recursos disponíveis ao usar os motores de armazenamento `MyISAM` e `InnoDB`. Se você verificar a categoria “Cluster” no banco de bugs do MySQL em <http://bugs.mysql.com>, você pode encontrar bugs conhecidos nas seguintes categorias sob “MySQL Server:” no banco de bugs do MySQL em <http://bugs.mysql.com>, que pretendemos corrigir nas próximas versões do NDB Cluster:

- Cluster NDB
- API Cluster Direct (NDBAPI)
- Dados do disco em cluster
- Replicação em cluster
- ClusterJ

Essas informações visam ser completas em relação às condições estabelecidas. Você pode relatar quaisquer discrepâncias que encontrar no banco de bugs do MySQL usando as instruções fornecidas na Seção 1.5, “Como relatar bugs ou problemas”. Qualquer problema que não planejamos corrigir no NDB Cluster 8.0 é adicionado à lista.

Consulte a Seção 25.2.7.11, “Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0”, para obter uma lista de problemas em versões anteriores que foram resolvidos no NDB Cluster 8.0.

Nota

As limitações e outros problemas específicos da replicação em NDB Cluster são descritos na Seção 25.7.3, “Problemas Conhecidos na Replicação em NDB Cluster”.
