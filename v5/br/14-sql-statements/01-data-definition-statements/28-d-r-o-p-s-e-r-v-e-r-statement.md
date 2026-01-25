### 13.1.28 Instrução DROP SERVER

```sql
DROP SERVER [ IF EXISTS ] server_name
```

Remove a definição do Server para o Server nomeado `server_name`. A linha correspondente na tabela `mysql.servers` é excluída. Esta instrução requer o Privilege [`SUPER`](privileges-provided.html#priv_super).

Remover um Server para uma tabela não afeta nenhuma tabela `FEDERATED` que usou essa informação de conexão quando foi criada. Consulte [Seção 13.1.17, “Instrução CREATE SERVER”](create-server.html "13.1.17 Instrução CREATE SERVER").

`DROP SERVER` causa um Commit implícito. Consulte [Seção 13.3.3, “Instruções Que Causam um Commit Implícito”](implicit-commit.html "13.3.3 Instruções Que Causam um Commit Implícito").

`DROP SERVER` não é escrita no Binary Log, independentemente do formato de logging que está em uso.