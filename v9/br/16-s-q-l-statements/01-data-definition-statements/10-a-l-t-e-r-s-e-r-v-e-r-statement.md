### 15.1.10 Declaração ALTER SERVER

```
ALTER SERVER  server_name
    OPTIONS (option[, option] ...)
```

Altera as informações do servidor para `server_name`, ajustando qualquer uma das opções permitidas na declaração `CREATE SERVER`. Os campos correspondentes na tabela `mysql.servers` são atualizados conforme necessário. Esta declaração requer o privilégio `SUPER`.

Por exemplo, para atualizar a opção `USER`:

```
ALTER SERVER s OPTIONS (USER 'sally');
```

`ALTER SERVER` causa um commit implícito. Veja a Seção 15.3.3, “Declarações que causam um commit implícito”.

`ALTER SERVER` não é escrito no log binário, independentemente do formato de registro que está em uso.