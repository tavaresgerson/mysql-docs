#### 16.1.5.6 Parando Multi-Source Replicas

A instrução `STOP SLAVE` pode ser usada para parar uma multi-source replica. Por padrão, se você usar a instrução `STOP SLAVE` em uma multi-source replica, todos os channels são parados. Opcionalmente, use a cláusula `FOR CHANNEL channel` para parar apenas um channel específico.

* Para parar todos os replication channels configurados atualmente:

  ```sql
  STOP SLAVE;
  ```

* Para parar apenas um channel nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```sql
  STOP SLAVE FOR CHANNEL "source_1";
  ```

Para a sintaxe completa do comando `STOP SLAVE` e outras opções disponíveis, consulte Section 13.4.2.6, “STOP SLAVE Statement”.