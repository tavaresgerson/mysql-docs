#### 5.4.2.5 Formato de Saída do Error Log

O ID incluído nas mensagens do error log é o do thread dentro do [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") responsável por escrever a mensagem. Isso indica qual parte do server produziu a mensagem, e é consistente com as mensagens do general query log e slow query log, que incluem o ID do thread de conexão.

A system variable [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) controla o fuso horário dos timestamps nas mensagens escritas no error log (bem como nos arquivos do general query log e slow query log).

Valores permitidos para [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local). Os timestamps são escritos usando o formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor final de `Z` significando hora Zulu (UTC) ou `±hh:mm` (um offset que indica o ajuste do fuso horário do sistema local em relação ao UTC). Por exemplo:

```sql
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```