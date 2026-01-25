#### 16.1.5.7 Resetando Réplicas de Múltiplas Fontes

A instrução [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") pode ser usada para resetar uma multi-source replica. Por padrão, se você usar a instrução [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") em uma multi-source replica, todos os channels são resetados. Opcionalmente, use a cláusula `FOR CHANNEL channel` para resetar apenas um channel específico.

* Para resetar todos os channels de replication configurados atualmente:

  ```sql
  RESET SLAVE;
  ```

* Para resetar apenas um channel nomeado, use a cláusula `FOR CHANNEL channel`:

  ```sql
  RESET SLAVE FOR CHANNEL "source_1";
  ```

Para replication baseada em GTID, observe que o [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") não tem efeito no histórico de execução de GTID da replica. Se você deseja limpar isso, execute [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") na replica.

O [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") faz com que a replica esqueça sua replication position e limpa o relay log, mas ele não altera nenhum parâmetro de conexão de replication, como o host name da source. Se você deseja remover esses parâmetros para um channel, execute `RESET SLAVE ALL`.

Para a sintaxe completa do comando [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") e outras opções disponíveis, veja [Seção 13.4.2.3, “RESET SLAVE Statement”](reset-slave.html "13.4.2.3 RESET SLAVE Statement").