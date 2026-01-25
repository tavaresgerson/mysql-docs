### 25.4.9 Nomeando Instruments ou Consumers para Operações de Filtragem

Nomes fornecidos para operações de filtragem podem ser tão específicos ou gerais quanto necessário. Para indicar um único instrument ou consumer, especifique seu nome por completo:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME = 'wait/synch/mutex/myisammrg/MYRG_INFO::mutex';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME = 'events_waits_current';
```

Para especificar um grupo de instruments ou consumers, use um pattern que corresponda aos membros do grupo:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME LIKE 'wait/synch/mutex/%';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

Se você usar um pattern, ele deve ser escolhido de forma que corresponda a todos os itens de interesse e a nenhum outro. Por exemplo, para selecionar todos os instruments de I/O de arquivo (file I/O), é melhor usar um pattern que inclua todo o prefixo do nome do instrument:

```sql
... WHERE NAME LIKE 'wait/io/file/%';
```

O pattern `'%/file/%'` corresponde a outros instruments que têm um elemento de `'/file/'` em qualquer lugar do nome. O pattern `'%file%'` é ainda menos adequado, pois corresponde a instruments com `'file'` em qualquer lugar do nome, como `wait/synch/mutex/innodb/file_open_mutex`.

Para verificar a quais nomes de instrument ou consumer um pattern corresponde, realize um teste simples:

```sql
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE 'pattern';

SELECT NAME FROM performance_schema.setup_consumers
WHERE NAME LIKE 'pattern';
```

Para obter informações sobre os tipos de nomes suportados, consulte [Seção 25.6, “Convenções de Nomenclatura de Instruments do Performance Schema”](performance-schema-instrument-naming.html "25.6 Performance Schema Instrument Naming Conventions").