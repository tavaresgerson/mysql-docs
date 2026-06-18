#### 19.1.5.7 Redefinir réplicas de múltiplas fontes

A declaração `RESET REPLICA` pode ser usada para reiniciar uma replica de múltiplas fontes. Por padrão, se você usar a declaração `RESET REPLICA` em uma replica de múltiplas fontes, todos os canais são reiniciados. Opcionalmente, use a cláusula `FOR CHANNEL channel` para reiniciar apenas um canal específico.

- Para redefinir todos os canais de replicação configurados atualmente:

  ```
  mysql> RESET SLAVE;
  Or from MySQL 8.0.22:
  mysql> RESET REPLICA;
  ```

- Para redefinir apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```
  mysql> RESET SLAVE FOR CHANNEL "source_1";
  Or from MySQL 8.0.22:
  mysql> RESET REPLICA FOR CHANNEL "source_1";
  ```

Para a replicação baseada em GTID, observe que `RESET REPLICA` não afeta o histórico de execução do GTID da replica. Se você quiser limpar isso, execute `RESET MASTER` na replica.

`RESET REPLICA` faz com que a replica esqueça sua posição de replicação e limpe o log do retransmissor, mas não altera nenhum parâmetro de conexão de replicação (como o nome do host de origem) ou filtros de replicação. Se você quiser removê-los para um canal, execute `RESET REPLICA ALL`.

Para a sintaxe completa do comando `RESET REPLICA` e outras opções disponíveis, consulte a Seção 15.4.2.4, “Instrução RESET REPLICA”.
