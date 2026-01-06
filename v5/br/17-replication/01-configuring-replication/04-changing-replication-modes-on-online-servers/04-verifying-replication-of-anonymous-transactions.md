#### 16.1.4.4 Verificar a replicação de transações anônimas

Esta seção explica como monitorar uma topologia de replicação e verificar se todas as transações anônimas foram replicadas. Isso é útil quando você muda o modo de replicação online, pois você pode verificar se é seguro mudar para transações GTID.

Existem várias maneiras possíveis de esperar que as transações sejam replicadas:

O método mais simples, que funciona independentemente da sua topologia, mas depende do tempo, é o seguinte: se você tem certeza de que a replica nunca fica atrasada por mais de N segundos, basta esperar um pouco mais de N segundos. Ou espere por um dia, ou qualquer período de tempo que você considere seguro para sua implantação.

Um método mais seguro, no sentido de que não depende do momento: se você tiver apenas uma fonte com uma ou mais réplicas, faça o seguinte:

1. Na fonte, execute:

   ```sql
   SHOW MASTER STATUS;
   ```

   Anote os valores nas colunas `Arquivo` e `Posição`.

2. Em cada réplica, use as informações de arquivo e posição da fonte para executar:

   ```sql
   SELECT MASTER_POS_WAIT(file, position);
   ```

Se você tiver uma fonte e múltiplos níveis de réplicas, ou, em outras palavras, tiver réplicas de réplicas, repita o passo 2 em cada nível, começando pela fonte, depois todas as réplicas diretas, depois todas as réplicas de réplicas, e assim por diante.

Se você estiver usando uma topologia de replicação circular, onde vários servidores podem ter clientes de escrita, realize o passo 2 para cada conexão fonte-replica, até completar o círculo completo. Repita todo o processo para que você faça o círculo completo *duas vezes*.

Por exemplo, suponha que você tenha três servidores A, B e C, replicando em um círculo, de modo que A -> B -> C -> A. O procedimento é então:

- Faça o passo 1 na A e o passo 2 na B.
- Faça o passo 1 na B e o passo 2 na C.
- Faça o passo 1 na C e o passo 2 na A.
- Faça o passo 1 na A e o passo 2 na B.
- Faça o passo 1 na B e o passo 2 na C.
- Faça o passo 1 na C e o passo 2 na A.
