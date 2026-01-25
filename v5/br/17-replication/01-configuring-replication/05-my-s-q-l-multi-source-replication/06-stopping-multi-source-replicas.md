#### 16.1.5.6 Parando Multi-Source Replicas

A instrução [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") pode ser usada para parar uma multi-source replica. Por padrão, se você usar a instrução [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") em uma multi-source replica, todos os channels são parados. Opcionalmente, use a cláusula `FOR CHANNEL channel` para parar apenas um channel específico.

* Para parar todos os replication channels configurados atualmente:

  ```sql
  STOP SLAVE;
  ```

* Para parar apenas um channel nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```sql
  STOP SLAVE FOR CHANNEL "source_1";
  ```

Para a sintaxe completa do comando [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") e outras opções disponíveis, consulte [Section 13.4.2.6, “STOP SLAVE Statement”](stop-slave.html "13.4.2.6 STOP SLAVE Statement").