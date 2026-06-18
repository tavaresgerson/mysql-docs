#### 13.7.5.32 Instrução SHOW RELAYLOG EVENTS

```sql
SHOW RELAYLOG EVENTS
    [IN 'log_name']
    [FROM pos]
    [LIMIT [offset,] row_count]
    [channel_option]

channel_option:
    FOR CHANNEL channel
```

Mostra os eventos no relay log de uma réplica. Se você não especificar `'log_name'`, o primeiro relay log será exibido. Esta instrução não tem efeito na source. O `SHOW RELAYLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe da instrução `SELECT`. Consulte Seção 13.2.9, “Instrução SELECT”.

Nota

A emissão de um `SHOW RELAYLOG EVENTS` sem uma cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do relay log (incluindo todas as instruções de modificação de dados que foram recebidas pela réplica).

A cláusula opcional `FOR CHANNEL channel` permite nomear a qual replication channel a instrução se aplica. Fornecer uma cláusula `FOR CHANNEL channel` aplica a instrução a um replication channel específico. Se nenhum channel for nomeado e não existirem channels extras, a instrução se aplica ao default channel.

Ao usar múltiplos replication channels, se uma instrução `SHOW RELAYLOG EVENTS` não tiver um channel definido usando uma cláusula `FOR CHANNEL channel`, um erro é gerado. Consulte Seção 16.2.2, “Replication Channels” para mais informações.

O `SHOW RELAYLOG EVENTS` exibe os seguintes campos para cada evento no relay log:

* `Log_name`

  O nome do arquivo que está sendo listado.

* `Pos`

  A posição na qual o evento ocorre.

* `Event_type`

  Um identificador que descreve o tipo de evento.

* `Server_id`

  O ID do servidor onde o evento se originou.

* `End_log_pos`

  O valor de `End_log_pos` para este evento no binary log da source.

* `Info`

  Informações mais detalhadas sobre o tipo de evento. O formato dessa informação depende do tipo de evento.

Nota

Alguns eventos relacionados à configuração de variáveis de usuário e sistema não são incluídos na saída do `SHOW RELAYLOG EVENTS`. Para obter uma cobertura completa de eventos dentro de um relay log, use o **mysqlbinlog**.