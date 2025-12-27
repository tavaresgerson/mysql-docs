### 25.6.6 Modo de Usuário Único do NDB Cluster

O modo de usuário único permite que o administrador do banco de dados restrinja o acesso ao sistema de banco de dados a um único nó da API, como um servidor MySQL (nó SQL) ou uma instância do **ndb_restore**. Ao entrar no modo de usuário único, as conexões a todos os outros nós da API são fechadas de forma suave e todas as transações em execução são abortadas. Não é permitido iniciar novas transações.

Uma vez que o cluster entrou no modo de usuário único, apenas o nó da API designado é concedido acesso ao banco de dados.

Você pode usar o comando `ALL STATUS` no cliente **ndb_mgm** para ver quando o cluster entrou no modo de usuário único. Você também pode verificar a coluna `status` da tabela `ndbinfo.nodes` (consulte a Seção 25.6.15.48, “A Tabela de Nodos ndbinfo”, para obter mais informações).

Exemplo:

```
ndb_mgm> ENTER SINGLE USER MODE 5
```

Após a execução deste comando e a entrada do cluster no modo de usuário único, o nó da API cujo ID de nó é `5` torna-se o único usuário permitido do cluster.

O nó especificado no comando anterior deve ser um nó da API; tentar especificar qualquer outro tipo de nó é rejeitado.

Observação

Quando o comando anterior é invocado, todas as transações em execução no nó designado são abortadas, a conexão é fechada e o servidor deve ser reiniciado.

O comando `EXIT SINGLE USER MODE` altera o estado dos nós de dados do cluster do modo de usuário único para o modo normal. Os nós da API—como Servidores MySQL—esperando por uma conexão (ou seja, aguardando que o cluster esteja pronto e disponível) são novamente permitidos a se conectar. O nó da API denotado como o nó de usuário único continua a ser executado (se ainda estiver conectado) durante e após a mudança de estado.

Exemplo:

```
ndb_mgm> EXIT SINGLE USER MODE
```

Existem duas maneiras recomendadas de lidar com uma falha de nó ao executar no modo de usuário único:

* Método 1:
















```python
ndb.cluster.enter_single_user_mode(node_id=5)
ndb.cluster.exit_single_user_mode(node_id=5)
ndb.cluster.exit_single_user_mode(node_id=5)
ndb.cluster.exit_single_user_

1. Finalize todas as transações no modo de usuário único
2. Emita o comando `SAÍDA DO MODO DE USUÁRIO ÚNICO`
3. Reinicie os nós de dados do clúster
* Método 2:

Reinicie os nós de armazenamento antes de entrar no modo de usuário único.