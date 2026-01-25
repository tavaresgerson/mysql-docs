### 13.1.17 Declaração CREATE SERVER

```sql
CREATE SERVER server_name
    FOREIGN DATA WRAPPER wrapper_name
    OPTIONS (option [, option] ...)

option: {
    HOST character-literal
  | DATABASE character-literal
  | USER character-literal
  | PASSWORD character-literal
  | SOCKET character-literal
  | OWNER character-literal
  | PORT numeric-literal
}
```

Esta declaração cria a definição de um `SERVER` para uso com a `Storage Engine` `FEDERATED`. A declaração `CREATE SERVER` cria uma nova linha na tabela `servers` no `Database` `mysql`. Esta declaração requer o privilégio [`SUPER`](privileges-provided.html#priv_super).

O `server_name` deve ser uma referência única ao `SERVER`. As definições de `SERVER` são globais dentro do escopo do `SERVER`; não é possível qualificar a definição de `SERVER` para um `Database` específico. `server_name` tem um comprimento máximo de 64 caracteres (nomes com mais de 64 caracteres são truncados silenciosamente) e não diferencia maiúsculas de minúsculas (`case-insensitive`). Você pode especificar o nome como uma string entre aspas.

O `wrapper_name` é um identificador e pode ser citado com aspas simples.

Para cada `option`, você deve especificar um literal de caractere ou um literal numérico. Literais de caractere são UTF-8, suportam um comprimento máximo de 64 caracteres e o padrão é uma string em branco (vazia). Literais de string são truncados silenciosamente para 64 caracteres. Literais numéricos devem ser um número entre 0 e 9999, e o valor padrão é 0.

Nota

A `option` `OWNER` não é aplicada atualmente e não tem efeito sobre a propriedade ou operação da conexão de `SERVER` que é criada.

A declaração `CREATE SERVER` cria uma entrada na tabela `mysql.servers` que pode ser usada posteriormente com a declaração [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") ao criar uma tabela `FEDERATED`. As `options` que você especifica são usadas para preencher as colunas na tabela `mysql.servers`. As colunas da tabela são `Server_name`, `Host`, `Db`, `Username`, `Password`, `Port` e `Socket`.

Por exemplo:

```sql
CREATE SERVER s
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'Remote', HOST '198.51.100.106', DATABASE 'test');
```

Certifique-se de especificar todas as `options` necessárias para estabelecer uma conexão com o `SERVER`. O nome de usuário (`username`), nome do host (`hostname`) e nome do `Database` são obrigatórios. Outras `options` também podem ser necessárias, como a senha.

Os dados armazenados na tabela podem ser usados ao criar uma conexão com uma tabela `FEDERATED`:

```sql
CREATE TABLE t (s1 INT) ENGINE=FEDERATED CONNECTION='s';
```

Para mais informações, consulte [Seção 15.8, “The FEDERATED Storage Engine”](federated-storage-engine.html "15.8 The FEDERATED Storage Engine").

`CREATE SERVER` causa um `COMMIT` implícito. Consulte [Seção 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

`CREATE SERVER` não é escrita no `Binary Log`, independentemente do formato de log em uso.