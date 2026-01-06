## 25.21 Restrições ao Schema de Desempenho

O Schema de Desempenho evita o uso de mútues para coletar ou produzir dados, portanto, não há garantias de consistência e os resultados podem ser incorretos às vezes. Os valores de evento nas tabelas do `performance_schema` são não determinísticos e não repetitivos.

Se você salvar as informações dos eventos em outra tabela, não deve assumir que os eventos originais ainda estarão disponíveis posteriormente. Por exemplo, se você selecionar eventos de uma tabela `performance_schema` em uma tabela temporária, com a intenção de juntá-la à tabela original mais tarde, pode não haver correspondências.

**mysqldump** e `BACKUP DATABASE` ignoram as tabelas no banco de dados `performance_schema`.

As tabelas no banco de dados `performance_schema` não podem ser bloqueadas com `LOCK TABLES`, exceto as tabelas `setup_xxx`.

As tabelas no banco de dados `performance_schema` não podem ser indexadas.

Os resultados de consultas que se referem a tabelas no banco de dados `performance_schema` não são salvos no cache de consultas.

As tabelas no banco de dados `performance_schema` não são replicadas.

O esquema de desempenho não está disponível no `libmysqld`, o servidor integrado.

Os tipos de temporizadores podem variar de acordo com a plataforma. A tabela `performance_timers` mostra quais temporizadores de evento estão disponíveis. Se os valores nesta tabela para um nome de temporizador específico forem `NULL`, esse temporizador não é suportado na sua plataforma.

Os instrumentos que se aplicam a motores de armazenamento podem não ser implementados para todos os motores de armazenamento. A instrumentação de cada motor de terceiros é responsabilidade do mantenedor do motor.
