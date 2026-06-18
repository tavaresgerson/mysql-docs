#### 15.4.2.5 Declaração de RESET SLAVE

```
RESET {SLAVE | REPLICA} [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

Faz com que a replica esqueça sua posição no log binário da fonte. A partir do MySQL 8.0.22, `RESET SLAVE` é desatualizado e o alias `RESET REPLICA` deve ser usado em vez disso. Em versões anteriores ao MySQL 8.0.22, use `RESET SLAVE`. A instrução funciona da mesma maneira que antes, apenas a terminologia usada para a instrução e sua saída mudou. Ambas as versões da instrução atualizam as mesmas variáveis de status quando usadas. Consulte a documentação para `RESET REPLICA` para uma descrição da instrução.
