#### 19.1.5.5 Começando Replicas de Múltiplos Fontes

Depois de adicionar canais para todas as fontes de replicação, execute uma declaração `START REPLICA` para iniciar a replicação. Quando você habilitar vários canais em uma replica, pode optar por iniciar todos os canais ou selecionar um canal específico para iniciar. Por exemplo, para iniciar os dois canais separadamente, use o cliente **mysql** para emitir as seguintes declarações:

```
mysql> START REPLICA FOR CHANNEL "source_1";
mysql> START REPLICA FOR CHANNEL "source_2";
```

Para ver a sintaxe completa da declaração `START REPLICA` e outras opções disponíveis, consulte a Seção 15.4.2.4, “Declaração START REPLICA”.

Para verificar se ambos os canais iniciaram e estão funcionando corretamente, você pode emitir declarações `SHOW REPLICA STATUS` na replica, por exemplo:

```
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_1"\G
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_2"\G
```