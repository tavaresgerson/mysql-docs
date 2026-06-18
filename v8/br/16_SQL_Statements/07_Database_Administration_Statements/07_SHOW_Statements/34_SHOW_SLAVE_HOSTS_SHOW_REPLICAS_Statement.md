#### 15.7.7.34 MOSTRE ANfitriões de SLAVE | MOSTRE REPLICAS Declaração

```
{SHOW SLAVE HOSTS | SHOW REPLICAS}
```

Exibe uma lista de réplicas atualmente registradas com a fonte. A partir do MySQL 8.0.22, `SHOW SLAVE HOSTS` é desatualizado e o alias `SHOW REPLICAS` deve ser usado em vez disso. A instrução funciona da mesma maneira que antes, apenas a terminologia usada para a instrução e sua saída mudou. Ambas as versões da instrução atualizam as mesmas variáveis de status quando usadas. Consulte a documentação para `SHOW REPLICAS` para uma descrição da instrução.
