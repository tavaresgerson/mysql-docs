### 35.3.2 Formato de Span

Uma span representa uma operação dentro de um trace. Para mais informações, consulte  Span OpenTelemetry. Os seguintes tipos de span são emitidos pelo componente de telemetria:

* Span de Controle
* Span de Sessão
* Span de Declaração

#### Span de Controle

Emitido quando a configuração de telemetria é alterada, notificando o sistema descendente sobre qual coleta de sinais foi habilitada ou desabilitada.

Este tipo de span tem os seguintes atributos:

* `Nome: Controle`
* `trace_enabled`: Booleano.
* `metrics_enabled`: Booleano.
* `logs_enabled`: Booleano
* `details`:

#### Span de Sessão

Emitido quando uma sessão do cliente termina, registrando dados relevantes para essa sessão desde a conexão inicial até o fechamento da sessão.

Este tipo de span tem os seguintes atributos:

* `Nome: Sessão`
* `mysql.processlist_id`
* `mysql.thread_id`
* `mysql.user`
* `mysql.host`
* `mysql.group`

Este span também contém atributos dinâmicos gerados com o formato `mysql.session_attr.xxx`, onde `xxx` é o nome do atributo de conexão da sessão. Consulte  `session_connect_attrs`.

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

Emitido quando uma execução de declaração termina no servidor, registrando todas as informações relevantes da declaração desde o início da execução até sua conclusão.

Este tipo de span tem os seguintes atributos:



* `Nome: stmt`
* `mysql.nome_evento`
* `mysql.tempo_bloqueio`
* `mysql.texto_sql`
* `mysql.texto_digest`
* `mysql.esquema_atual`
* `mysql.tipo_objeto`
* `mysql.esquema_objeto`
* `mysql.nome_objeto`
* `mysql.erro_sql`
* `mysql.estado_sql`
* `mysql.texto_mensagem`
* `mysql.contagem_erros`
* `mysql.contagem_alertas`
* `mysql.contagem_linhas_afetadas`
* `mysql.contagem_linhas_enviadas`
* `mysql.contagem_linhas_examinadas`
* `mysql.criadas_tabuas_temporárias_de_disco`
* `mysql.criadas_tabuas_temporárias`
* `mysql.join_full_total`
* `mysql.join_full_range`
* `mysql.join_range`
* `mysql.join_range_check`
* `mysql.join_scan`
* `mysql.passes_merge_ordenado`
* `mysql.ordenado_range`
* `mysql.ordenar_linhas`
* `mysql.join_scan`
* `mysql.usado_sem_indicação`
* `mysql.usado_sem_índice_bom`
* `mysql.memória_controlada_max`
* `mysql.memória_total_max`
* `mysql.tempo_cpu`