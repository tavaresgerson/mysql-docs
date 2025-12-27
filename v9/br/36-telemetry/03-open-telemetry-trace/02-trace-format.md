### 35.3.2 Formato de Span

Uma span representa uma operação dentro de um trace. Para mais informações, consulte [OpenTelemetry Span](https://github.com/open-telemetry/opentelemetry-specification/blob/main/specification/trace/api.md#span). O seguinte tipo de span é emitido pelo componente de telemetry:

* Span de Controle
* Span de Sessão
* Span de Declaração

#### Span de Controle

Emitido quando a configuração de telemetry é alterada, notificando o sistema downstream sobre qual coleta de sinal foi habilitada ou desabilitada.

Este tipo de span tem os seguintes atributos:

* `Name: Control`
* `trace_enabled`: Booleano.
* `metrics_enabled`: Booleano.
* `logs_enabled`: Booleano
* `details`:

#### Span de Sessão

Emitido quando uma sessão do cliente termina, registrando dados relevantes para essa sessão desde a conexão inicial até o fechamento da sessão.

Este tipo de span tem os seguintes atributos:

* `Name: Session`
* `mysql.processlist_id`
* `mysql.thread_id`
* `mysql.user`
* `mysql.host`
* `mysql.group`

Este span também contém atributos dinâmicos gerados com o formato `mysql.session_attr.xxx`, onde `xxx` é o nome do atributo de conexão da sessão. Veja `session_connect_attrs`.

Por exemplo, após a seguinte sessão se desconectar:

```
mysql> select * from session_connect_attrs;
+----------------+-----------------+------------+------------------+
| PROCESSLIST_ID | ATTR_NAME       | ATTR_VALUE | ORDINAL_POSITION |
+----------------+-----------------+------------+------------------+
|             10 | _pid            | 14488      |                0 |
|             10 | _platform       | x86_64     |                1 |
|             10 | _os             | Linux      |                2 |
|             10 | _client_name    | libmysql   |                3 |
|             10 | os_user         | malff      |                4 |
|             10 | _client_version | 8.4.0-tr   |                5 |
|             10 | program_name    | mysql      |                6 |
+----------------+-----------------+------------+------------------+
7 rows in set (0.00 sec)
```

O span de sessão emitido é:

```
Span #
    Trace ID       : 4137db42febad2d00a4123286076ba18
    Parent ID      :
    ID             : b7ff26660b9fcb35
    Name           : session
    Kind           : Internal
    Start time     : 2023-01-11 10:58:24.79557649 +0000 UTC
    End time       : 2023-01-11 11:00:50.46695685 +0000 UTC
    Status code    : Unset
    Status message :
Attributes:
     -> mysql.processlist_id: Int(10)
     -> mysql.thread_id: Int(50)
     -> mysql.user: Str(root)
     -> mysql.host: Str(localhost)
     -> mysql.group: Str(USR_default)
     -> mysql.session_attr._pid: Str(14488)
     -> mysql.session_attr._platform: Str(x86_64)
     -> mysql.session_attr._os: Str(Linux)
     -> mysql.session_attr._client_name: Str(libmysql)
     -> mysql.session_attr.os_user: Str(malff)
     -> mysql.session_attr._client_version: Str(8.4.0-tr)
     -> mysql.session_attr.program_name: Str(mysql)
```

#### Span de Declaração

Emitido quando a execução de uma declaração termina no servidor, registrando todas as informações relevantes da declaração desde o início da execução até sua conclusão.

Este tipo de span tem os seguintes atributos:



* `Nome: stmt`
* `mysql.event_name`
* `mysql.lock_time`
* `mysql.sql_text`
* `mysql.digest_text`
* `mysql.current_schema`
* `mysql.object_type`
* `mysql.object_schema`
* `mysql.object_name`
* `mysql.sql_errno`
* `mysql.sqlstate`
* `mysql.message_text`
* `mysql.error_count`
* `mysql.warning_count`
* `mysql.rows_affected`
* `mysql.rows_sent`
* `mysql.rows_examined`
* `mysql.created_tmp_disk_tables`
* `mysql.created_tmp_tables`
* `mysql.select_full_join`
* `mysql.select_full_range_join`
* `mysql.select_range`
* `mysql.select_range_check`
* `mysql.select_scan`
* `mysql.sort_merge_passes`
* `mysql.sort_range`
* `mysql.sort_rows`
* `mysql.sort_scan`
* `mysql.no_index_used`
* `mysql.no_good_index_used`
* `mysql.max_controlled_memory`
* `mysql.max_total_memory`
* `mysql.cpu_time`