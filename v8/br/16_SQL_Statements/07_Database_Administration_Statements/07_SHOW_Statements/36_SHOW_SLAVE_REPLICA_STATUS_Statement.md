#### 15.7.7.36 MOSTRE SLAVE | REPLICA STATUS Statement

```
SHOW {SLAVE | REPLICA} STATUS [FOR CHANNEL channel]
```

Esta declaração fornece informações de status sobre os parâmetros essenciais dos fios replicados. A partir do MySQL 8.0.22, `SHOW SLAVE STATUS` é desatualizado e o alias `SHOW REPLICA STATUS` deve ser usado em vez disso. A declaração funciona da mesma maneira que antes, apenas a terminologia usada para a declaração e sua saída mudou. Ambas as versões da declaração atualizam as mesmas variáveis de status quando usadas. Consulte a documentação para `SHOW REPLICA STATUS` para uma descrição da declaração.
