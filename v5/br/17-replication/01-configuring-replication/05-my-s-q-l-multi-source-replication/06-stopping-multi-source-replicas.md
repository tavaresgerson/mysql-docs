#### 16.1.5.6 Parar as réplicas de múltiplas fontes

A declaração `STOP SLAVE` pode ser usada para interromper uma replica multi-fonte. Por padrão, se você usar a declaração `STOP SLAVE` em uma replica multi-fonte, todos os canais são interrompidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para interromper apenas um canal específico.

- Para parar todos os canais de replicação configurados atualmente:

  ```sql
  STOP SLAVE;
  ```

- Para interromper apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```sql
  STOP SLAVE FOR CHANNEL "source_1";
  ```

Para a sintaxe completa do comando `STOP SLAVE` e outras opções disponíveis, consulte Seção 13.4.2.6, “Instrução STOP SLAVE”.
