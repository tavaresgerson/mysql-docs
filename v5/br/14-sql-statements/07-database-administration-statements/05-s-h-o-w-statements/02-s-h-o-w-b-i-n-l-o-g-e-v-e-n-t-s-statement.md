#### 13.7.5.2 Instrução SHOW BINLOG EVENTS

```sql
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Mostra os eventos no binary log. Se você não especificar `'log_name'`, o primeiro binary log é exibido. A instrução [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") exige o privilégio [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave).

A cláusula `LIMIT` possui a mesma sintaxe que a instrução [`SELECT`](select.html "13.2.9 SELECT Statement"). Veja [Seção 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

Nota

Emitir um [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o server retorna ao cliente o conteúdo completo do binary log (o que inclui todas as instruções executadas pelo server que modificam dados). Como alternativa a [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement"), use o utilitário [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") para salvar o binary log em um arquivo de texto para posterior exame e análise. Veja [Seção 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").

[`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") exibe os seguintes campos para cada evento no binary log:

* `Log_name`

  O nome do arquivo que está sendo listado.

* `Pos`

  A posição na qual o evento ocorre.

* `Event_type`

  Um identificador que descreve o tipo de evento.

* `Server_id`

  O Server ID do server onde o evento se originou.

* `End_log_pos`

  A posição na qual o próximo evento começa, que é igual a `Pos` mais o tamanho do evento.

* `Info`

  Informações mais detalhadas sobre o tipo de evento. O formato dessa informação depende do tipo de evento.

Nota

Alguns eventos relacionados à configuração de variáveis de usuário e de sistema não são incluídos na saída de [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement"). Para obter cobertura completa dos eventos dentro de um binary log, use [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").

Nota

[`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") *não* funciona com arquivos de relay log. Você pode usar [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") para essa finalidade.