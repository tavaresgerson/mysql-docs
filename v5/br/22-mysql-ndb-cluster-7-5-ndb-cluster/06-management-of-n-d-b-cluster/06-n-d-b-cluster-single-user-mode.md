### 21.6.6 Modo de usuário único do cluster NDB

O modo de usuário único permite que o administrador do banco de dados restrinja o acesso ao sistema do banco de dados a um único nó da API, como um servidor MySQL (nó SQL) ou uma instância de **ndb_restore**. Ao entrar no modo de usuário único, as conexões a todos os outros nós da API são fechadas de forma suave e todas as transações em execução são abortadas. Nenhuma nova transação é permitida para começar.

Depois que o cluster entrar no modo de usuário único, apenas o nó da API designado terá acesso ao banco de dados.

Você pode usar o comando `ALL STATUS` no cliente **ndb_mgm** para ver quando o clúster entrou no modo de usuário único. Você também pode verificar a coluna `status` da tabela `ndbinfo.nodes` (consulte Seção 21.6.15.28, “A tabela ndbinfo nodes”, para mais informações).

Exemplo:

```sql
ndb_mgm> ENTER SINGLE USER MODE 5
```

Após a execução deste comando e a entrada do clúster no modo de usuário único, o nó da API cujo ID de nó é `5` se torna o único usuário permitido no clúster.

O nó especificado no comando anterior deve ser um nó de API; tentar especificar qualquer outro tipo de nó é rejeitado.

Nota

Quando o comando anterior for executado, todas as transações em execução no nó designado serão abortadas, a conexão será fechada e o servidor precisará ser reiniciado.

O comando `EXIT SINGLE USER MODE` altera o estado dos nós de dados do cluster do modo de usuário único para o modo normal. Os nós da API, como os Servidores MySQL, que estão aguardando uma conexão (ou seja, aguardando que o cluster esteja pronto e disponível), podem se conectar novamente. O nó da API denominado como o nó de usuário único continua em execução (se ainda estiver conectado) durante e após a mudança de estado.

Exemplo:

```sql
ndb_mgm> EXIT SINGLE USER MODE
```

Existem duas maneiras recomendadas de lidar com a falha de um nó quando executado no modo de usuário único:

- Método 1:

  1. Finalizar todas as transações no modo de usuário único
  2. Emita o comando `SAIR DO MODO ÚNICO USUÁRIO`
  3. Reinicie os nós de dados do cluster
- Método 2:

  Reinicie os nós de armazenamento antes de entrar no modo de usuário único.
