### 15.1.35 Declaração `DROP SERVER`

```
DROP SERVER [ IF EXISTS ] server_name
```

Remove a definição do servidor para o servidor com o nome `server_name`. A linha correspondente na tabela `mysql.servers` é excluída. Esta declaração requer o privilégio `SUPER`.

A remoção de um servidor de uma tabela não afeta as tabelas `FEDERATED` que utilizaram essas informações de conexão quando foram criadas. Consulte a Seção 15.1.22, “Declaração `CREATE SERVER`”.

A declaração `DROP SERVER` causa um commit implícito. Consulte a Seção 15.3.3, “Declarações que causam um commit implícito”.

A declaração `DROP SERVER` não é escrita no log binário, independentemente do formato de registro que está em uso.