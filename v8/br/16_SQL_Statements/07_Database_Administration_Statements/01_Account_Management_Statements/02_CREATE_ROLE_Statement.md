#### 15.7.1.2 Declaração de Criação de Papel

```
CREATE ROLE [IF NOT EXISTS] role [, role ] ...
```

`CREATE ROLE` cria um ou mais papéis, que são coleções nomeadas de privilégios. Para usar essa declaração, você deve ter o privilégio global `CREATE ROLE` ou `CREATE USER`. Quando a variável de sistema `read_only` é habilitada, `CREATE ROLE` requer adicionalmente o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

Quando um papel é criado, ele é bloqueado, não tem senha e é atribuído o plugin de autenticação padrão. (Esses atributos do papel podem ser alterados posteriormente com a declaração `ALTER USER`, por usuários que possuem o privilégio global `CREATE USER`.)

`CREATE ROLE` ou tem sucesso para todos os papéis nomeados ou desfaz e não tem efeito se ocorrer algum erro. Por padrão, um erro ocorre se você tentar criar um papel que já existe. Se a cláusula `IF NOT EXISTS` for fornecida, a instrução produz um aviso para cada papel nomeado que já existe, em vez de um erro.

A declaração é escrita no log binário se ela for bem-sucedida, mas não se ela falhar; nesse caso, ocorre um rollback e nenhuma alteração é feita. Uma declaração escrita no log binário inclui todos os papéis nomeados. Se a cláusula `IF NOT EXISTS` for fornecida, isso inclui até mesmo papéis que já existem e não foram criados.

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
CREATE ROLE 'admin', 'developer';
CREATE ROLE 'webapp'@'localhost';
```

A parte do nome do host do nome do papel, se omitida, tem como padrão `'%'`.

Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando papéis”.
