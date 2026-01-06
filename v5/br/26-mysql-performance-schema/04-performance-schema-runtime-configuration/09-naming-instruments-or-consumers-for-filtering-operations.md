### 25.4.9 Nomeação de Instrumentos ou Consumidores para Operações de Filtragem

Os nomes utilizados para operações de filtragem podem ser tão específicos ou genéricos quanto necessário. Para indicar um único instrumento ou consumidor, especifique seu nome completo:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME = 'wait/synch/mutex/myisammrg/MYRG_INFO::mutex';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME = 'events_waits_current';
```

Para especificar um grupo de instrumentos ou consumidores, use um padrão que corresponda aos membros do grupo:

```sql
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME LIKE 'wait/synch/mutex/%';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

Se você usar um padrão, ele deve ser escolhido para corresponder a todos os itens de interesse e nenhum outro. Por exemplo, para selecionar todos os instrumentos de E/S de arquivos, é melhor usar um padrão que inclua todo o prefixo do nome do instrumento:

```sql
... WHERE NAME LIKE 'wait/io/file/%';
```

O padrão `'%/file/%'` corresponde a outros instrumentos que têm um elemento de `'/file/'` em qualquer lugar do nome. Ainda menos adequado é o padrão `'%file%'`, pois ele corresponde a instrumentos com `'file'` em qualquer lugar do nome, como `wait/synch/mutex/innodb/file_open_mutex`.

Para verificar qual instrumento ou nome de consumidor um padrão corresponde, realize um teste simples:

```sql
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE 'pattern';

SELECT NAME FROM performance_schema.setup_consumers
WHERE NAME LIKE 'pattern';
```

Para obter informações sobre os tipos de nomes suportados, consulte Seção 25.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.
