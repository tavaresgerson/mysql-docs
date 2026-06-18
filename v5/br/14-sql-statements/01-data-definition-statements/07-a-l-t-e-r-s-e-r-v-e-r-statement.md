### 13.1.7 ALTER SERVER Statement

```sql
ALTER SERVER  server_name
    OPTIONS (option [, option] ...)
```

Altera a informação do server para `server_name`, ajustando quaisquer das opções permitidas na instrução `CREATE SERVER`. Os campos correspondentes na tabela `mysql.servers` são atualizados de acordo. Esta instrução requer o privilégio `SUPER`.

Por exemplo, para atualizar a opção `USER`:

```sql
ALTER SERVER s OPTIONS (USER 'sally');
```

`ALTER SERVER` causa um commit implícito. Consulte Seção 13.3.3, “Instruções Que Causam um Commit Implícito”.

`ALTER SERVER` não é escrito no `binary log`, independentemente do formato de logging que esteja em uso.