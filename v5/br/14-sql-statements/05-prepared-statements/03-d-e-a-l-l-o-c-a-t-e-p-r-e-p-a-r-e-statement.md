### 13.5.3 Declaração de DESALOQUE PREPARAR

```sql
{DEALLOCATE | DROP} PREPARE stmt_name
```

Para desalojar uma declaração preparada criada com `PREPARE`, use uma declaração `DEALLOCATE PREPARE` que faça referência ao nome da declaração preparada. Tentar executar uma declaração preparada após desalojá-la resulta em um erro. Se forem criadas muitas declarações preparadas e não forem desalojadas pela declaração `DEALLOCATE PREPARE` ou ao final da sessão, você pode encontrar o limite superior imposto pela variável de sistema `max_prepared_stmt_count`.

Para exemplos, veja Seção 13.5, "Declarações Preparadas".
