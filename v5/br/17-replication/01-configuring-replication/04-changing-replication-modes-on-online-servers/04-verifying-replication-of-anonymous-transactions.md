#### 16.1.4.4 Verificando a Replicação de Anonymous Transactions

Esta seção explica como monitorar uma topology de replication e verificar que todas as anonymous transactions foram replicadas. Isso é útil ao alterar o modo de replication online, pois você pode verificar que é seguro mudar para GTID transactions.

Existem várias maneiras possíveis de aguardar que as transactions sejam replicadas:

O método mais simples, que funciona independentemente da sua topology, mas depende do tempo, é o seguinte: se você tem certeza de que a replica nunca atrasa mais do que N segundos, basta esperar um pouco mais do que N segundos. Ou espere um dia, ou o período de tempo que você considerar seguro para seu deployment.

Um método mais seguro no sentido de que não depende de tempo: se você tiver apenas um source com uma ou mais replicas, faça o seguinte:

1. No source, execute:

   ```sql
   SHOW MASTER STATUS;
   ```

   Anote os valores nas colunas `File` e `Position`.

2. Em cada replica, use as informações de file e position do source para executar:

   ```sql
   SELECT MASTER_POS_WAIT(file, position);
   ```

Se você tem um source e múltiplos níveis de replicas, ou em outras palavras, você tem replicas de replicas, repita o passo 2 em cada nível, começando pelo source, depois em todas as replicas diretas, depois em todas as replicas de replicas, e assim por diante.

Se você usa uma topology de replication circular onde múltiplos servers podem ter write clients, execute o passo 2 para cada conexão source-replica, até completar o ciclo completo. Repita o processo inteiro para que você faça o ciclo completo *duas vezes*.

Por exemplo, suponha que você tenha três servers A, B e C, replicando em círculo de forma que A -> B -> C -> A. O procedimento é então:

* Faça o passo 1 em A e o passo 2 em B.
* Faça o passo 1 em B e o passo 2 em C.
* Faça o passo 1 em C e o passo 2 em A.
* Faça o passo 1 em A e o passo 2 em B.
* Faça o passo 1 em B e o passo 2 em C.
* Faça o passo 1 em C e o passo 2 em A.