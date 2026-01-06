#### 16.1.5.4 Adicionando uma Fonte de Registro Binário à Replica de Múltiplas Fontes

Esses passos pressupõem que você habilitou o registro binário no servidor de origem da replicação usando `--log-bin`, que a replica está usando repositórios de metadados de replicação baseados em `TABLE` e que você habilitou um usuário de replicação e anotou a posição atual do log binário. Você precisa saber a `MASTER_LOG_FILE` e a `MASTER_LOG_POSITION` atuais.

Use a declaração `CHANGE MASTER TO` para configurar um canal de replicação para cada fonte na replica (consulte Seção 16.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Por exemplo, para adicionar `source1` e `source2` como fontes na replica, use o cliente **mysql** para emitir a declaração `CHANGE MASTER TO` duas vezes na replica, da seguinte forma:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";
```

Para a sintaxe completa da declaração `CHANGE MASTER TO` e outras opções disponíveis, consulte Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.
