### 15.1.30 Declaração DROP SERVER

```
DROP SERVER [ IF EXISTS ] server_name
```

Exclui a definição do servidor para o servidor denominado \[\[`server_name`]. A linha correspondente na tabela `mysql.servers` é excluída. Esta declaração requer o privilégio `SUPER`.

A remoção de um servidor de uma tabela não afeta as tabelas `FEDERATED` que utilizaram essas informações de conexão quando foram criadas. Consulte a Seção 15.1.18, “Instrução CREATE SERVER”.

`DROP SERVER` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

`DROP SERVER` não é escrito no log binário, independentemente do formato de registro que está em uso.
