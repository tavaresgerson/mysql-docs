## 25.5 Queries do Performance Schema

O Pre-filtering limita quais informações de evento são coletadas e é independente de qualquer usuário específico. Por outro lado, o Post-filtering é realizado por usuários individuais através do uso de Queries com cláusulas `WHERE` apropriadas que restringem quais informações de evento selecionar dentre os eventos disponíveis após a aplicação do Pre-filtering.

Na [Seção 25.4.3, “Event Pre-Filtering”](performance-schema-pre-filtering.html "25.4.3 Event Pre-Filtering"), um exemplo mostrou como aplicar o Pre-filtering para *file instruments*. Se as *event tables* contiverem informações tanto de arquivo quanto não relacionadas a arquivo, o Post-filtering é outra maneira de visualizar informações apenas para *file events*. Adicione uma cláusula `WHERE` às Queries para restringir a seleção de eventos de forma apropriada:

```sql
mysql> SELECT THREAD_ID, NUMBER_OF_BYTES
       FROM performance_schema.events_waits_history
       WHERE EVENT_NAME LIKE 'wait/io/file/%'
       AND NUMBER_OF_BYTES IS NOT NULL;
+-----------+-----------------+
| THREAD_ID | NUMBER_OF_BYTES |
+-----------+-----------------+
|        11 |              66 |
|        11 |              47 |
|        11 |             139 |
|         5 |              24 |
|         5 |             834 |
+-----------+-----------------+
```