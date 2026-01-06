#### 16.1.5.5 Começando as Replicas de Múltiplos Fontes

Depois de adicionar canais para todas as fontes, emita uma declaração `START SLAVE` para iniciar a replicação. Quando você habilitar vários canais em uma replica, pode optar por iniciar todos os canais ou selecionar um canal específico para iniciar. Por exemplo, para iniciar os dois canais separadamente, use o cliente **mysql** para emitir as seguintes declarações:

```sql
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
```

Para a sintaxe completa do comando `START SLAVE` e outras opções disponíveis, consulte Seção 13.4.2.5, “Instrução START SLAVE”.

Para verificar se ambos os canais foram iniciados e estão funcionando corretamente, você pode emitir as instruções `SHOW SLAVE STATUS` na replica, por exemplo:

```sql
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
```
