### 21.6.6 Modo de Usuário Único do NDB Cluster

O Single User Mode permite que o administrador do Database restrinja o acesso ao sistema de Database a um único API node, como um servidor MySQL (SQL node) ou uma instância de [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restauração de um Backup do NDB Cluster"). Ao entrar no Single User Mode, as conexões para todos os outros API nodes são fechadas de forma controlada (gracefully) e todas as Transactions em execução são abortadas. Nenhuma nova Transaction é permitida iniciar.

Uma vez que o Cluster tenha entrado no Single User Mode, apenas o API node designado recebe acesso ao Database.

Você pode usar o comando `ALL STATUS` no cliente [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — O Cliente de Gerenciamento do NDB Cluster") para ver quando o Cluster entrou no Single User Mode. Você também pode verificar a coluna `status` da tabela [`ndbinfo.nodes`](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 A Tabela ndbinfo nodes") (consulte [Seção 21.6.15.28, “A Tabela ndbinfo nodes”](mysql-cluster-ndbinfo-nodes.html "21.6.15.28 A Tabela ndbinfo nodes"), para mais informações).

Exemplo:

```sql
ndb_mgm> ENTER SINGLE USER MODE 5
```

Após a execução deste comando e a entrada do Cluster no Single User Mode, o API node cujo ID de node é `5` se torna o único usuário permitido do Cluster.

O node especificado no comando anterior deve ser um API node; a tentativa de especificar qualquer outro tipo de node é rejeitada.

Nota

Quando o comando anterior é invocado, todas as Transactions em execução no node designado são abortadas, a conexão é fechada e o servidor deve ser reiniciado.

O comando `EXIT SINGLE USER MODE` altera o estado dos data nodes do Cluster de Single User Mode para modo normal. Os API nodes—como Servidores MySQL—que estão esperando por uma conexão (ou seja, esperando que o Cluster se torne pronto e disponível), são novamente permitidos a conectar. O API node designado como o node de usuário único continua em execução (se ainda estiver conectado) durante e após a mudança de estado.

Exemplo:

```sql
ndb_mgm> EXIT SINGLE USER MODE
```

Existem duas formas recomendadas de lidar com uma falha de node ao executar no Single User Mode:

*   Método 1:

    1.  Finalizar todas as Transactions do Single User Mode
    2.  Emitir o comando `EXIT SINGLE USER MODE`
    3.  Reiniciar os data nodes do Cluster
*   Método 2:

    Reiniciar os storage nodes antes de entrar no Single User Mode.