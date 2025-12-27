## 29.20 Restrições do Schema de Desempenho

O Schema de Desempenho evita o uso de mútues para coletar ou produzir dados, portanto, não há garantias de consistência e os resultados podem ser incorretos às vezes. Os valores dos eventos nas tabelas do `performance_schema` são não determinísticos e não repetitivos.

Se você salvar informações de eventos em outra tabela, não deve assumir que os eventos originais permanecem disponíveis mais tarde. Por exemplo, se você selecionar eventos de uma tabela do `performance_schema` para uma tabela temporária, com a intenção de fazer uma junção com a tabela original mais tarde, pode não haver correspondências.

O **mysqldump** e o `BACKUP DATABASE` ignoram tabelas no banco de dados `performance_schema`.

As tabelas no banco de dados `performance_schema` não podem ser bloqueadas com `LOCK TABLES`, exceto as tabelas `setup_xxx`.

As tabelas no banco de dados `performance_schema` não podem ser indexadas.

As tabelas no banco de dados `performance_schema` não são replicadas.

Os tipos de temporizadores podem variar de acordo com a plataforma. A tabela `performance_timers` mostra quais temporizadores de eventos estão disponíveis. Se os valores nesta tabela para um nome de temporizador dado forem `NULL`, esse temporizador não é suportado na sua plataforma.

Os instrumentos que se aplicam aos motores de armazenamento podem não ser implementados para todos os motores de armazenamento. A instrumentação de cada motor de terceiros é responsabilidade do mantenedor do motor.