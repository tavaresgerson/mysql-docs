#### 13.7.5.32 Mostrar eventos do RELAYLOG Declaração

```sql
SHOW RELAYLOG EVENTS
    [IN 'log_name']
    [FROM pos]
    [LIMIT [offset,] row_count]
    [channel_option]

channel_option:
    FOR CHANNEL channel
```

Mostra os eventos no log de retransmissão de uma réplica. Se você não especificar `'log_name'`, o primeiro log de retransmissão será exibido. Esta declaração não tem efeito na fonte. `SHOW RELAYLOG EVENTS` requer o privilégio `REPLICATION SLAVE`.

A cláusula `LIMIT` tem a mesma sintaxe que a cláusula `SELECT`. Consulte Seção 13.2.9, “Instrução SELECT”.

Nota

Emitir um `SHOW RELAYLOG EVENTS` sem a cláusula `LIMIT` pode iniciar um processo que consome muito tempo e recursos, pois o servidor retorna ao cliente o conteúdo completo do log de retransmissão (incluindo todas as declarações que modificam dados recebidos pela replica).

A cláusula `FOR CHANNEL channel` opcional permite que você nomeie qual canal de replicação a declaração se aplica. Ao fornecer uma cláusula `FOR CHANNEL channel`, a declaração é aplicada a um canal de replicação específico. Se nenhum canal estiver nomeado e não houver canais extras, a declaração será aplicada ao canal padrão.

Ao usar múltiplos canais de replicação, se uma declaração `SHOW RELAYLOG EVENTS` não tiver um canal definido usando uma cláusula `FOR CHANNEL channel`, um erro será gerado. Consulte Seção 16.2.2, “Canais de Replicação” para obter mais informações.

`SHOW RELAYLOG EVENTS` exibe os seguintes campos para cada evento no log de retransmissão:

- `Log_name`

  O nome do arquivo que está sendo listado.

- `Pos`

  A posição em que o evento ocorre.

- `Tipo de evento`

  Um identificador que descreve o tipo de evento.

- `Server_id`

  O ID do servidor do servidor em que o evento se originou.

- `End_log_pos`

  O valor de `End_log_pos` para este evento no log binário da fonte.

- `Info`

  Informações mais detalhadas sobre o tipo de evento. O formato dessas informações depende do tipo de evento.

Nota

Alguns eventos relacionados à definição de variáveis de usuário e sistema não estão incluídos na saída do `SHOW RELAYLOG EVENTS`. Para obter uma cobertura completa dos eventos dentro de um log de retransmissão, use **mysqlbinlog**.
