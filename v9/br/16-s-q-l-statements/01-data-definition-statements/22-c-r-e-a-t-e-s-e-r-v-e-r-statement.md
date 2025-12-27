### 15.1.22 Declaração `CREATE SERVER`

```
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

Esta declaração cria a definição de um servidor para uso com o mecanismo de armazenamento `FEDERATED`. A declaração `CREATE SERVER` cria uma nova linha na tabela `servers` no banco de dados `mysql`. Esta declaração requer o privilégio `SUPER`.

O `server_name` deve ser uma referência única para o servidor. As definições de servidor são globais dentro do escopo do servidor, não é possível qualificar a definição do servidor para um banco de dados específico. `server_name` tem um comprimento máximo de 64 caracteres (nomes mais longos que 64 caracteres são truncados silenciosamente), e é case-insensitive. Você pode especificar o nome como uma string entre aspas.

O `wrapper_name` é um identificador e pode ser entre aspas simples.

Para cada `option`, você deve especificar um literal de caractere ou um literal numérico. Os literais de caractere são UTF-8, suportam um comprimento máximo de 64 caracteres e têm como padrão uma string vazia (vazia). As strings literais são truncadas silenciosamente para 64 caracteres. Os literais numéricos devem ser um número entre 0 e 9999, o valor padrão é 0.

Nota

A opção `OWNER` atualmente não é aplicada e não tem efeito na propriedade ou operação da conexão do servidor que é criada.

A declaração `CREATE SERVER` cria uma entrada na tabela `mysql.servers` que pode ser usada mais tarde com a declaração `CREATE TABLE` ao criar uma tabela `FEDERATED`. As opções que você especifica são usadas para preencher as colunas na tabela `mysql.servers`. As colunas da tabela são `Server_name`, `Host`, `Db`, `Username`, `Password`, `Port` e `Socket`.

Por exemplo:

```
CREATE SERVER s
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'Remote', HOST '198.51.100.106', DATABASE 'test');
```

Certifique-se de especificar todas as opções necessárias para estabelecer uma conexão com o servidor. O nome de usuário, o nome do host e o nome do banco de dados são obrigatórios. Pode ser necessário incluir outras opções, como a senha.

Os dados armazenados na tabela podem ser usados ao criar uma conexão com uma tabela `FEDERATED`:

```
CREATE TABLE t (s1 INT) ENGINE=FEDERATED CONNECTION='s';
```

Para obter mais informações, consulte a Seção 18.8, “O mecanismo de armazenamento FEDERATED”.

O `CREATE SERVER` causa um commit implícito. Consulte a Seção 15.3.3, “Instruções que causam um commit implícito”.

O `CREATE SERVER` não é escrito no log binário, independentemente do formato de registro que está sendo usado.