#### 15.7.7.3 Mostrar eventos do log binário

```
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Mostra os eventos no log binário. Se você não especificar `'log_name'`, o primeiro log binário é exibido. O comando `SHOW BINLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe que o comando `SELECT`. Consulte a Seção 15.2.13, “Comando SELECT”.

Observação

Executar um `SHOW BINLOG EVENTS` sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do log binário (que inclui todas as instruções executadas pelo servidor que modificam dados). Como alternativa ao `SHOW BINLOG EVENTS`, use o utilitário **mysqlbinlog** para salvar o log binário em um arquivo de texto para posterior exame e análise. Consulte a Seção 6.6.9, “mysqlbinlog — Utilitário para processamento de arquivos de log binário”.

O `SHOW BINLOG EVENTS` exibe os seguintes campos para cada evento no log binário:

* `Log_name`

  O nome do arquivo que está sendo listado.

* `Pos`

  A posição em que o evento ocorre.

* `Event_type`

  Um identificador que descreve o tipo de evento.

* `Server_id`

  O ID do servidor do servidor em que o evento se originou.

* `End_log_pos`

  A posição em que o próximo evento começa, que é igual a `Pos` mais o tamanho do evento.

* `Info`

  Informações mais detalhadas sobre o tipo de evento. O formato dessas informações depende do tipo de evento.

Para payloads de transações compactados, o `Transaction_payload_event` é primeiro impresso como uma única unidade, depois é descompactado e cada evento dentro dele é impresso.

Alguns eventos relacionados à configuração de variáveis de usuário e sistema não são incluídos na saída do `SHOW BINLOG EVENTS`. Para obter uma cobertura completa dos eventos dentro de um log binário, use **mysqlbinlog**.

A opção `SHOW BINLOG EVENTS` *não* funciona com arquivos de log de retransmissão. Você pode usar `SHOW RELAYLOG EVENTS` para esse propósito.