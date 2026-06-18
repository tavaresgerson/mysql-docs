#### 19.1.5.5 Começar réplicas de múltiplas fontes

Depois de adicionar canais para todas as fontes de replicação, execute uma declaração `START REPLICA` (ou, antes do MySQL 8.0.22, `START SLAVE`) para iniciar a replicação. Quando você habilitar vários canais em uma replica, pode optar por iniciar todos os canais ou selecionar um canal específico para iniciar. Por exemplo, para iniciar os dois canais separadamente, use o cliente **mysql** para emitir as seguintes declarações:

```
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
Or from MySQL 8.0.22:
mysql> START REPLICA FOR CHANNEL "source_1";
mysql> START REPLICA FOR CHANNEL "source_2";
```

Para a sintaxe completa do comando `START REPLICA` e outras opções disponíveis, consulte a Seção 15.4.2.6, “Instrução START REPLICA”.

Para verificar se ambos os canais foram iniciados e estão funcionando corretamente, você pode emitir declarações `SHOW REPLICA STATUS` na replica, por exemplo:

```
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
Or from MySQL 8.0.22:
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_1"\G
mysql> SHOW REPLICA STATUS FOR CHANNEL "source_2"\G
```
