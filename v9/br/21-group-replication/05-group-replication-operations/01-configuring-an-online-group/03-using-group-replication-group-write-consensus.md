#### 20.5.1.3 Usando o Consenso de Escrita de Grupo

Esta seção explica como inspecionar e configurar o número máximo de instâncias de consenso em qualquer momento para um grupo. Esse número máximo é referido como o horizonte de eventos de um grupo e é o número máximo de instâncias de consenso que o grupo pode executar em paralelo. Isso permite que você ajuste o desempenho da implantação do Grupo de Replicação. Por exemplo, o valor padrão de 10 é adequado para um grupo que está em uma LAN, mas para grupos que operam em uma rede mais lenta, como uma WAN, aumente esse número para melhorar o desempenho.

##### Inspeção da Concorrência de Escrita de um Grupo

Use a função `group_replication_get_write_concurrency()` para inspecionar o valor do horizonte de eventos de um grupo em tempo de execução, emitindo:

```
SELECT group_replication_get_write_concurrency();
```

##### Configuração da Concorrência de Escrita de um Grupo

Use a função `group_replication_set_write_concurrency()` para definir o número máximo de instâncias de consenso que o sistema pode executar em paralelo, emitindo:

```
SELECT group_replication_set_write_concurrency(instances);
```

onde *`instances`* é o novo número máximo de instâncias de consenso. O privilégio `GROUP_REPLICATION_ADMIN` é necessário para usar essa função.