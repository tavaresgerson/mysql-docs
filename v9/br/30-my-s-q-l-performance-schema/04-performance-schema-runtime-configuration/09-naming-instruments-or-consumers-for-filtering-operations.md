### 29.4.9 Nomeação de Instrumentos ou Consumidores para Operações de Filtragem

Os nomes dados para operações de filtragem podem ser tão específicos ou genéricos quanto necessário. Para indicar um único instrumento ou consumidor, especifique seu nome completo:

```
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME = 'wait/synch/mutex/myisammrg/MYRG_INFO::mutex';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME = 'events_waits_current';
```

Para especificar um grupo de instrumentos ou consumidores, use um padrão que corresponda aos membros do grupo:

```
UPDATE performance_schema.setup_instruments
SET ENABLED = 'NO'
WHERE NAME LIKE 'wait/synch/mutex/%';

UPDATE performance_schema.setup_consumers
SET ENABLED = 'NO'
WHERE NAME LIKE '%history%';
```

Se você usar um padrão, ele deve ser escolhido de forma que corresponda a todos os itens de interesse e não a outros. Por exemplo, para selecionar todos os instrumentos de E/S de arquivos, é melhor usar um padrão que inclua todo o prefixo do nome do instrumento:

```
... WHERE NAME LIKE 'wait/io/file/%';
```

Um padrão de `'%/file/%'` corresponde a outros instrumentos que têm um elemento de `'/file/'` em qualquer lugar do nome. Ainda menos adequado é o padrão `'%file%'`, pois ele corresponde a instrumentos com `'file'` em qualquer lugar do nome, como `wait/synch/mutex/innodb/file_open_mutex`.

Para verificar quais nomes de instrumentos ou consumidores um padrão corresponde, realize um teste simples:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE 'pattern';

SELECT NAME FROM performance_schema.setup_consumers
WHERE NAME LIKE 'pattern';
```

Para obter informações sobre os tipos de nomes suportados, consulte a Seção 29.6, “Convenções de Nomenclatura de Instrumentos do Schema de Desempenho”.