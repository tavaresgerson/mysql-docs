## 29.5 Perguntas do Schema de Desempenho

Os limites de pré-filtragem definem quais informações sobre eventos são coletadas e são independentes de qualquer usuário específico. Em contraste, o pós-filtragem é realizado por usuários individuais por meio do uso de consultas com cláusulas apropriadas `WHERE` que restringem quais informações sobre eventos devem ser selecionadas dos eventos disponíveis após a aplicação da pré-filtragem.

Na Seção 29.4.3, “Pré-filtragem de Eventos”, um exemplo mostrou como pré-filtrar para instrumentos de arquivo. Se as tabelas de eventos contiverem informações tanto de arquivo quanto não de arquivo, o pós-filtragem é outra maneira de ver informações apenas para eventos de arquivo. Adicione uma cláusula `WHERE` às consultas para restringir a seleção de eventos de forma apropriada:

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

A maioria das tabelas do Schema de Desempenho tem índices, o que dá ao otimizador acesso a planos de execução diferentes de varreduras completas da tabela. Esses índices também melhoram o desempenho para objetos relacionados, como as vistas do esquema `sys` que utilizam essas tabelas. Para mais informações, consulte a Seção 10.2.4, “Otimizando consultas do Schema de Desempenho”.