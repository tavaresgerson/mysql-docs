### 21.7.1 Replicação de NDB Cluster: Abreviaturas e Símbolos

Ao longo desta seção, usamos as seguintes abreviaturas ou símbolos para nos referirmos aos clusters source e replica, e aos processos e comandos executados nos clusters ou nós do cluster:

**Tabela 21.63 Abreviaturas usadas ao longo desta seção referentes aos clusters source e replica, e aos processos e comandos executados em nós do cluster**

| Símbolo ou Abreviatura | Descrição (Refere-se a...) |
| :--- | :--- |
| *`S`* | O cluster que serve como o source (primário) de Replication |
| *`R`* | O cluster que atua como o replica (primário) |
| `shellS&gt;` | Comando Shell a ser emitido no cluster source |
| `mysqlS&gt;` | Comando do MySQL client emitido em um único MySQL server rodando como um SQL node no cluster source |
| `mysqlS*&gt;` | Comando do MySQL client a ser emitido em todos os SQL nodes que participam do cluster source de Replication |
| `shellR&gt;` | Comando Shell a ser emitido no cluster replica |
| `mysqlR&gt;` | Comando do MySQL client emitido em um único MySQL server rodando como um SQL node no cluster replica |
| `mysqlR*&gt;` | Comando do MySQL client a ser emitido em todos os SQL nodes que participam do cluster replica |
| *`C`* | Primary replication channel |
| *`C'`* | Secondary replication channel |
| *`S'`* | Secondary replication source |
| *`R'`* | Secondary replica |
