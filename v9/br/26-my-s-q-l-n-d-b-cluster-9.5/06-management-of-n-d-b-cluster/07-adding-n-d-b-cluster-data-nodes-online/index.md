### 25.6.7 Adicionando Nodos de Dados do NDB Cluster Online

25.6.7.1 Adicionando Nodos de Dados do NDB Cluster Online: Problemas Gerais

25.6.7.2 Adicionando Nodos de Dados do NDB Cluster Online: Procedimento Básico

25.6.7.3 Adicionando Nodos de Dados do NDB Cluster Online: Exemplo Detalhado

Esta seção descreve como adicionar os nós de dados do NDB Cluster "online" — ou seja, sem precisar desligar completamente o cluster e reiniciá-lo como parte do processo.

Importante

Atualmente, você deve adicionar novos nós de dados a um NDB Cluster como parte de um novo grupo de nós. Além disso, não é possível alterar o número de réplicas de fragmentação (ou o número de nós por grupo de nós) online.