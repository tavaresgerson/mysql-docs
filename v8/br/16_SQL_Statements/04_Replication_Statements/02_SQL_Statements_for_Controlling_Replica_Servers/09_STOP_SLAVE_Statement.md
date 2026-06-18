#### 15.4.2.9 Declaração de PARAR SLAVE

```
STOP {SLAVE | REPLICA} [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Para de replicar os threads. A partir do MySQL 8.0.22, `STOP SLAVE` é desatualizado e o alias `STOP REPLICA` deve ser usado em vez disso. A instrução funciona da mesma maneira que antes, apenas a terminologia usada para a instrução e sua saída mudou. Ambas as versões da instrução atualizam as mesmas variáveis de status quando usadas. Consulte a documentação para `STOP REPLICA` para uma descrição da instrução.
