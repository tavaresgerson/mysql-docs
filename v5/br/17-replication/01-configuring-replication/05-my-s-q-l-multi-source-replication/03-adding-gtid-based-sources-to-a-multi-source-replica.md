#### 16.1.5.3 Adicionando fontes baseadas em GTID a uma réplica de múltiplas fontes

Esses passos pressupõem que você tenha habilitado GTIDs para transações nos servidores da fonte de replicação usando `gtid_mode=ON`, criado um usuário de replicação, garantido que a replica esteja usando repositórios de metadados de replicação baseados em `TABLE` e, se apropriado, provisionado a replica com dados das fontes.

Use a declaração `CHANGE MASTER TO` para configurar um canal de replicação para cada fonte na replica (consulte Seção 16.2.2, “Canais de Replicação”). A cláusula `FOR CHANNEL` é usada para especificar o canal. Para a replicação baseada em GTID, o autoposicionamento do GTID é usado para sincronizar com a fonte (consulte Seção 16.1.3.3, “Autoposicionamento do GTID”). A opção `MASTER_AUTO_POSITION` é definida para especificar o uso do autoposicionamento.

Por exemplo, para adicionar `source1` e `source2` como fontes na replica, use o cliente **mysql** para emitir a declaração `CHANGE MASTER TO` duas vezes na replica, assim:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

Para a sintaxe completa da declaração `CHANGE MASTER TO` e outras opções disponíveis, consulte Seção 13.4.2.1, “Declaração CHANGE MASTER TO”.
