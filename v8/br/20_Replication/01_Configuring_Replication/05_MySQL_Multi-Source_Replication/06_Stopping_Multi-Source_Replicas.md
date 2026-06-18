#### 19.1.5.6 Parar as réplicas de múltiplas fontes

A declaração `STOP REPLICA` pode ser usada para interromper uma replica de múltiplas fontes. Por padrão, se você usar a declaração `STOP REPLICA` em uma replica de múltiplas fontes, todos os canais são interrompidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para interromper apenas um canal específico.

- Para parar todos os canais de replicação configurados atualmente:

  ```
  mysql> STOP SLAVE;
  Or from MySQL 8.0.22:
  mysql> STOP REPLICA;
  ```

- Para interromper apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```
  mysql> STOP SLAVE FOR CHANNEL "source_1";
  Or from MySQL 8.0.22:
  mysql> STOP REPLICA FOR CHANNEL "source_1";
  ```

Para a sintaxe completa do comando `STOP REPLICA` e outras opções disponíveis, consulte a Seção 15.4.2.8, “Instrução STOP REPLICA”.
