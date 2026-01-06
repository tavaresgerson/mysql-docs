#### 5.4.2.5 Formato de Saída do Log de Erros

O ID incluído nas mensagens do log de erro é o do tópico dentro de **mysqld** responsável por escrever a mensagem. Isso indica qual parte do servidor produziu a mensagem e é consistente com as mensagens gerais do log de consulta e do log de consulta lenta, que incluem o ID do tópico de conexão.

A variável de sistema `log_timestamps` controla o fuso horário dos timestamps nas mensagens escritas no log de erros (assim como nos arquivos de log de consultas gerais e log de consultas lentas).

Os valores permitidos de `log_timestamps` são `UTC` (o padrão) e `SYSTEM` (o fuso horário do sistema local). Os timestamps são escritos no formato ISO 8601 / RFC 3339: `YYYY-MM-DDThh:mm:ss.uuuuuu` mais um valor de cauda de `Z` que indica a hora Zulu (UTC) ou `±hh:mm` (um deslocamento que indica o ajuste do fuso horário do sistema local em relação ao UTC). Por exemplo:

```sql
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```
