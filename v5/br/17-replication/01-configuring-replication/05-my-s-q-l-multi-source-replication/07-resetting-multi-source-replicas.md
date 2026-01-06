#### 16.1.5.7 Redefinir réplicas de múltiplas fontes

A instrução `RESET SLAVE` pode ser usada para reiniciar uma replica de múltiplas fontes. Por padrão, se você usar a instrução `RESET SLAVE` em uma replica de múltiplas fontes, todos os canais são reiniciados. Opcionalmente, use a cláusula `FOR CHANNEL channel` para reiniciar apenas um canal específico.

- Para redefinir todos os canais de replicação configurados atualmente:

  ```sql
  RESET SLAVE;
  ```

- Para redefinir apenas um canal nomeado, use uma cláusula `FOR CHANNEL channel`:

  ```sql
  RESET SLAVE FOR CHANNEL "source_1";
  ```

Para a replicação baseada em GTID, observe que `RESET SLAVE` não tem efeito no histórico de execução do GTID da replica. Se você quiser limpar isso, execute `RESET MASTER` na replica.

O comando `RESET SLAVE` faz com que a réplica esqueça sua posição de replicação e limpe o log do relé, mas não altera nenhum parâmetro de conexão de replicação, como o nome do host da fonte. Se você quiser remover esses parâmetros para um canal, execute `RESET SLAVE ALL`.

Para a sintaxe completa do comando `RESET SLAVE` e outras opções disponíveis, consulte Seção 13.4.2.3, “Instrução RESET SLAVE”.
