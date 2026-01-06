### 13.1.28 Declaração DROP SERVER

```sql
DROP SERVER [ IF EXISTS ] server_name
```

Exclui a definição do servidor para o servidor com o nome `server_name`. A linha correspondente na tabela `mysql.servers` é excluída. Esta declaração requer o privilégio `SUPER`.

A remoção de um servidor de uma tabela não afeta as tabelas `FEDERATED` que utilizaram essas informações de conexão quando foram criadas. Consulte Seção 13.1.17, "Instrução CREATE SERVER".

`DROP SERVER` causa um commit implícito. Veja Seção 13.3.3, “Instruções que causam um commit implícito”.

O comando `DROP SERVER` não é registrado no log binário, independentemente do formato de registro que estiver sendo usado.
