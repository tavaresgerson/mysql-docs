#### 19.1.5.7 Reinicialização de Replicas de Múltiplos Fontes

A instrução `RESET REPLICA` pode ser usada para reinicializar uma replica de múltiplos fontes. Por padrão, se você usar a instrução `RESET REPLICA` em uma replica de múltiplos fontes, todos os canais são reiniciados. Opcionalmente, use a cláusula `FOR CHANNEL channel` para reiniciar apenas um canal específico.

* Para reiniciar todos os canais de replicação configurados atualmente:

  ```
  mysql> RESET REPLICA;
  ```

* Para reiniciar apenas um canal nomeado, use a cláusula `FOR CHANNEL channel`:

  ```
  mysql> RESET REPLICA FOR CHANNEL "source_1";
  ```

Para a replicação baseada em GTID, note que `RESET REPLICA` não tem efeito no histórico de execução do GTID da replica. Se você quiser limpar isso, execute `RESET BINARY LOGS AND GTIDS` na replica.

`RESET REPLICA` faz com que a replica esqueça sua posição de replicação e limpe o log de retransmissão, mas não altera nenhum parâmetro de conexão de replicação (como o nome do host de origem) ou filtros de replicação. Se você quiser remover esses parâmetros para um canal, execute `RESET REPLICA ALL`.