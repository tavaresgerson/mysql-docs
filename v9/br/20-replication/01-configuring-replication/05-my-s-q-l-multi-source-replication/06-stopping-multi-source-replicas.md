#### 19.1.5.6 Parando Replicação de Múltiplos Fontes

A instrução `STOP REPLICA` pode ser usada para parar uma replicação de múltiplas fontes. Por padrão, se você usar a instrução `STOP REPLICA` em uma replicação de múltiplas fontes, todos os canais são interrompidos. Opcionalmente, use a cláusula `FOR CHANNEL channel` para interromper apenas um canal específico.

* Para interromper todos os canais de replicação configurados atualmente:

  ```
  mysql> STOP REPLICA;
  ```

* Para interromper apenas um canal nomeado, use a cláusula `FOR CHANNEL channel`:

  ```
  mysql> STOP REPLICA FOR CHANNEL "source_1";
  ```

Para obter a sintaxe completa da instrução `STOP REPLICA` e outras opções disponíveis, consulte a Seção 15.4.2.5, “Instrução `STOP REPLICA`”.