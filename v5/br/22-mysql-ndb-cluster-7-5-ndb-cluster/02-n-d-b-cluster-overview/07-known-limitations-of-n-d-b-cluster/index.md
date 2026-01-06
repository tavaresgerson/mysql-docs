### 21.2.7 Limitações conhecidas do NDB Cluster

21.2.7.1 Não conformidade com a sintaxe SQL no NDB Cluster

21.2.7.2 Limitações e Diferenças do NDB Cluster em Relação às Limitações Padrão do MySQL

21.2.7.3 Limitações relacionadas ao processamento de transações no NDB Cluster

21.2.7.4 Gerenciamento de Erros de NDB Cluster

21.2.7.5 Limites associados a objetos de banco de dados no NDB Cluster

21.2.7.6 Recursos não suportados ou ausentes no NDB Cluster

21.2.7.7 Limitações relacionadas ao desempenho no cluster NDB

21.2.7.8 Problemas Exclusivos do NDB Cluster

21.2.7.9 Limitações relacionadas ao armazenamento de dados do disco do cluster NDB

21.2.7.10 Limitações relacionadas a múltiplos nós do cluster NDB

Nas seções a seguir, discutimos as limitações conhecidas das versões atuais do NDB Cluster em comparação com as funcionalidades disponíveis ao usar os motores de armazenamento `MyISAM` e `InnoDB`. Se você verificar a categoria “Cluster” no banco de bugs do MySQL em <http://bugs.mysql.com>, você pode encontrar bugs conhecidos nas seguintes categorias sob “MySQL Server:” no banco de bugs do MySQL em <http://bugs.mysql.com>, que pretendemos corrigir nas próximas versões do NDB Cluster:

- Cluster NDB
- API Cluster Direct (NDBAPI)
- Dados do disco em cluster
- Replicação em cluster
- ClusterJ

Essas informações visam ser completas em relação às condições estabelecidas. Você pode relatar quaisquer discrepâncias que encontrar no banco de dados de erros do MySQL usando as instruções fornecidas em Seção 1.5, “Como relatar erros ou problemas”. Qualquer problema que não planejamos corrigir no NDB Cluster 7.5 é adicionado à lista.

Consulte Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0 para obter uma lista de problemas em versões anteriores que foram resolvidos no NDB Cluster 7.5.

Nota

As limitações e outros problemas específicos da replicação em cluster do NDB são descritos em Seção 21.7.3, “Problemas conhecidos na replicação em cluster do NDB”.
