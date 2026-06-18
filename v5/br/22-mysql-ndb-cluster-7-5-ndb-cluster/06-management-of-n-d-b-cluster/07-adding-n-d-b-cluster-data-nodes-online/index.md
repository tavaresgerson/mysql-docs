### 21.6.7 Adicionando NDB Cluster Data Nodes Online

21.6.7.1 Adicionando NDB Cluster Data Nodes Online: Questões Gerais

21.6.7.2 Adicionando NDB Cluster Data Nodes Online: Procedimento Básico

21.6.7.3 Adicionando NDB Cluster Data Nodes Online: Exemplo Detalhado

Esta seção descreve como adicionar *NDB Cluster Data Nodes* "online"—ou seja, sem a necessidade de desligar o cluster completamente e reiniciá-lo como parte do processo.

**Importante**

Atualmente, você deve adicionar novos *Data Nodes* a um *NDB Cluster* como parte de um novo *Node Group*. Além disso, não é possível alterar o número de réplicas de fragmentos (ou o número de *Nodes* por *Node Group*) online.