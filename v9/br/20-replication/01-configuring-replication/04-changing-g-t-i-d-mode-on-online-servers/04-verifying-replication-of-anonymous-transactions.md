#### 19.1.4.4 Verificar a Replicação de Transações Anônimas

Esta seção explica como monitorar uma topologia de replicação e verificar se todas as transações anônimas foram replicadas. Isso é útil quando você muda o modo de replicação online, pois você pode verificar se é seguro mudar para transações GTID.

Existem várias maneiras possíveis de esperar que as transações sejam replicadas:

O método mais simples, que funciona independentemente da sua topologia, mas depende do tempo, é o seguinte: Se você tem certeza de que a replica nunca fica atrasada por mais de *`N`* segundos, espere qualquer período de tempo que seja maior que *`N`* segundos, que você considere seguro para sua implantação.

Um método mais seguro, no sentido de que não depende do tempo, se você tiver apenas uma fonte com uma ou mais réplicas, é realizar os dois passos a seguir:

1. Na fonte, execute esta instrução:

   ```
   SHOW BINARY LOG STATUS;
   ```

   Anote os valores exibidos nas colunas `File` e `Position` do resultado.

2. Em cada replica, use as informações de arquivo e posição da fonte para executar a instrução mostrada aqui:

   ```
   SELECT SOURCE_POS_WAIT(file, position);
   ```

Se você tiver uma fonte e múltiplos níveis de réplicas (ou seja, réplicas de réplicas), repita o segundo passo em cada nível, começando da fonte, depois em todas as suas réplicas, depois em todas as réplicas dessas réplicas, e assim por diante.

Se você usar uma topologia de replicação circular onde vários servidores podem ter clientes de escrita, realize o segundo passo para cada conexão fonte-replica, até completar o círculo completo. Repita esse processo para que você complete o círculo completo duas vezes.

Por exemplo, se houver três servidores A, B e C, replicando em um círculo, de modo que A replica para B, B replica para C e C replica para A, faça o seguinte, na ordem mostrada:

* Realize a Etapa 1 em A e a Etapa 2 em B.
* Realize a Etapa 1 em B e a Etapa 2 em C.
* Realize a Etapa 1 em C e a Etapa 2 em A.
* Realize a Etapa 1 em A e a Etapa 2 em B.
* Realize a Etapa 1 em B e a Etapa 2 em C.
* Realize a Etapa 1 em C e a Etapa 2 em A.