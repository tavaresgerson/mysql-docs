#### 16.1.5.5 Iniciando Réplicas Multi-Source

Assim que você adicionar channels para todas as sources, execute uma instrução `START SLAVE` para iniciar a replicação. Quando você habilita múltiplos channels em uma réplica, você pode escolher iniciar todos os channels ou selecionar um channel específico para iniciar. Por exemplo, para iniciar os dois channels separadamente, use o **mysql** client para executar as seguintes instruções:

```sql
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
```

Para a sintaxe completa do comando `START SLAVE` e outras opções disponíveis, veja Section 13.4.2.5, “START SLAVE Statement”.

Para verificar se ambos os channels foram iniciados e estão operando corretamente, você pode executar instruções `SHOW SLAVE STATUS` na réplica, por exemplo:

```sql
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
```