#### 13.7.5.2. Mostrar eventos do BINLOG Statement

```sql
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Mostra os eventos no log binário. Se você não especificar `'log_name'`, o primeiro log binário será exibido. `SHOW BINLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe que a cláusula `SELECT`. Consulte Seção 13.2.9, “Instrução SELECT”.

Nota

Emitir um `SHOW BINLOG EVENTS` sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do log binário (que inclui todas as instruções executadas pelo servidor que modificam dados). Como alternativa ao `SHOW BINLOG EVENTS`, use o **mysqlbinlog** para salvar o log binário em um arquivo de texto para exame e análise posteriores. Veja Seção 4.6.7, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.

`SHOW BINLOG EVENTS` exibe os seguintes campos para cada evento no log binário:

- `Log_name`

  O nome do arquivo que está sendo listado.

- `Pos`

  A posição em que o evento ocorre.

- `Tipo de evento`

  Um identificador que descreve o tipo de evento.

- `Server_id`

  O ID do servidor do servidor em que o evento se originou.

- `End_log_pos`

  A posição em que o próximo evento começa, que é igual a `Pos` mais o tamanho do evento.

- `Info`

  Informações mais detalhadas sobre o tipo de evento. O formato dessas informações depende do tipo de evento.

Nota

Alguns eventos relacionados à definição de variáveis de usuário e sistema não estão incluídos na saída do `SHOW BINLOG EVENTS`. Para obter uma cobertura completa dos eventos dentro de um log binário, use **mysqlbinlog**.

Nota

O comando `SHOW BINLOG EVENTS` *não* funciona com arquivos de log de retransmissão. Você pode usar o comando `SHOW RELAYLOG EVENTS` para esse propósito.
