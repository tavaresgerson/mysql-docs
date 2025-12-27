### 15.5.3 Declaração de DESALOQUE PREPARADO

```
{DEALLOCATE | DROP} PREPARE stmt_name
```

Para desaloquear uma declaração preparada gerada com `PREPARE`, use uma declaração `DEALLOCATE PREPARE` que faça referência ao nome da declaração preparada. Tentar executar uma declaração preparada após desaloca-la resulta em um erro. Se forem criadas muitas declarações preparadas e não forem desalocadas pela declaração `DEALLOCATE PREPARE` ou pelo final da sessão, você pode encontrar o limite superior imposto pela variável de sistema `max_prepared_stmt_count`.

Para exemplos, consulte a Seção 15.5, “Declarações Preparadas”.