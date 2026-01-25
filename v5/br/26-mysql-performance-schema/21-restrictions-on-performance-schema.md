## 25.21 Restrições no Performance Schema

O Performance Schema evita usar *mutexes* para coletar ou produzir dados, portanto, não há garantias de consistência e os resultados podem, por vezes, estar incorretos. Os valores de eventos nas tabelas do `performance_schema` são não determinísticos e não repetíveis.

Se você salvar informações de evento em outra tabela, não deve presumir que os eventos originais ainda estarão disponíveis posteriormente. Por exemplo, se você selecionar eventos de uma tabela do `performance_schema` para uma tabela temporária, com a intenção de fazer um *JOIN* dessa tabela com a tabela original mais tarde, pode ser que não haja correspondências.

[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e `BACKUP DATABASE` ignoram tabelas no *Database* `performance_schema`.

Tabelas no *Database* `performance_schema` não podem ser bloqueadas com `LOCK TABLES`, exceto as tabelas `setup_xxx`.

Tabelas no *Database* `performance_schema` não podem ser indexadas.

Resultados de *Queries* que se referem a tabelas no *Database* `performance_schema` não são salvos no *query cache*.

Tabelas no *Database* `performance_schema` não são replicadas.

O Performance Schema não está disponível no `libmysqld`, o servidor embutido (*embedded server*).

Os tipos de *timers* podem variar por plataforma. A tabela [`performance_timers`](performance-schema-performance-timers-table.html "25.12.16.2 The performance_timers Table") mostra quais *event timers* estão disponíveis. Se os valores nesta tabela para um determinado nome de *timer* forem `NULL`, esse *timer* não é suportado na sua plataforma.

Instrumentos que se aplicam a *storage engines* podem não estar implementados para todos os *storage engines*. A instrumentação de cada *engine* de terceiros é responsabilidade do mantenedor do *engine*.