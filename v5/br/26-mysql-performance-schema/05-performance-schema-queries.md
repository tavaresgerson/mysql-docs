## 25.5 Consultas do Schema de Desempenho

O pré-filtro limita as informações dos eventos que são coletadas e é independente de qualquer usuário específico. Em contraste, o pós-filtro é realizado por usuários individuais por meio do uso de consultas com cláusulas `WHERE` apropriadas que restringem quais informações dos eventos devem ser selecionadas dos eventos disponíveis após o pré-filtro ter sido aplicado.

Na Seção 25.4.3, “Pré-filtragem de Eventos”, um exemplo mostrou como pré-filtrar para instrumentos de arquivo. Se as tabelas de eventos contiverem informações tanto de arquivos quanto de arquivos não-arquivos, a pós-filtragem é outra maneira de ver informações apenas para eventos de arquivo. Adicione uma cláusula `WHERE` às consultas para restringir a seleção de eventos de forma apropriada:

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
