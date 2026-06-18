#### 15.7.7.2 Mostrar eventos do BINLOG Statement

```
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Mostra os eventos no log binário. Se você não especificar `'log_name'`, o primeiro log binário será exibido. `SHOW BINLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe que a cláusula `SELECT`. Veja a Seção 15.2.13, “Instrução SELECT”.

Nota

Emitir um `SHOW BINLOG EVENTS` sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do log binário (que inclui todas as instruções executadas pelo servidor que modificam dados). Como alternativa ao `SHOW BINLOG EVENTS`, use o utilitário **mysqlbinlog** para salvar o log binário em um arquivo de texto para posterior exame e análise. Veja a Seção 6.6.9, “mysqlbinlog — Utilitário para Processamento de Arquivos de Log Binário”.

`SHOW BINLOG EVENTS` exibe os seguintes campos para cada evento no log binário:

- `Log_name`

  O nome do arquivo que está sendo listado.

- `Pos`

  A posição em que o evento ocorre.

- `Event_type`

  Um identificador que descreve o tipo de evento.

- `Server_id`

  O ID do servidor do servidor em que o evento se originou.

- `End_log_pos`

  A posição em que o próximo evento começa, que é igual a `Pos` mais o tamanho do evento.

- `Info`

  Informações mais detalhadas sobre o tipo de evento. O formato dessas informações depende do tipo de evento.

Para cargas de transações compactadas, o `Transaction_payload_event` é impresso primeiro como uma única unidade, depois é descompactado e cada evento dentro dele é impresso.

Alguns eventos relacionados à definição de variáveis de usuário e sistema não estão incluídos na saída do `SHOW BINLOG EVENTS`. Para obter uma cobertura completa dos eventos em um log binário, use **mysqlbinlog**.

`SHOW BINLOG EVENTS` *não* funciona com arquivos de registro de relé. Você pode usar `SHOW RELAYLOG EVENTS` para esse propósito.
