## Perguntas do Schema de Desempenho

O prefiltro limita as informações dos eventos coletadas e é independente de qualquer usuário específico. Em contraste, o pós-filtro é realizado por usuários individuais por meio do uso de consultas com cláusulas `WHERE` apropriadas que restringem quais informações dos eventos devem ser selecionadas dos eventos disponíveis após a aplicação do prefiltro.

Na Seção 29.4.3, “Prefiltro de Eventos”, um exemplo mostrou como prefiltrar para instrumentos de arquivo. Se as tabelas de eventos contiverem informações de arquivo e não de arquivo, o pós-filtro é outra maneira de ver informações apenas para eventos de arquivo. Adicione uma cláusula `WHERE` às consultas para restringir a seleção de eventos de forma apropriada:

```
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

A maioria das tabelas do Schema de Desempenho tem índices, o que dá ao otimizador acesso a planos de execução diferentes de varreduras completas da tabela. Esses índices também melhoram o desempenho para objetos relacionados, como as visualizações do esquema `sys` que usam essas tabelas. Para mais informações, consulte a Seção 10.2.4, “Otimizando Consultas do Schema de Desempenho”.