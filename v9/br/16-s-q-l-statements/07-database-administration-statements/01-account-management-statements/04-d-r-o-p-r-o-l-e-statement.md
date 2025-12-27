#### 15.7.1.4 Declaração de Remoção de Papel

```
DROP ROLE [IF EXISTS] role [, role ] ...
```

`DROP ROLE` remove um ou mais papéis (coleções nomeadas de privilégios). Para usar essa declaração, você deve ter o privilégio global `DROP ROLE` ou `CREATE USER`. Quando a variável de sistema `read_only` está habilitada, `DROP ROLE` também requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`).

Usuários que têm o privilégio `CREATE USER` podem usar essa declaração para remover contas que estão bloqueadas ou desbloqueadas. Usuários que têm o privilégio `DROP ROLE` podem usar essa declaração apenas para remover contas que estão bloqueadas (contas desbloqueadas presumivelmente são contas de usuário usadas para fazer login no servidor e não apenas como papéis).

Papéis nomeados no valor da variável de sistema `mandatory_roles` não podem ser removidos.

`DROP ROLE` ou tem sucesso para todos os papéis nomeados ou retorna e não tem efeito se ocorrer algum erro. Por padrão, um erro ocorre se você tentar remover um papel que não existe. Se a cláusula `IF EXISTS` for fornecida, a declaração produz um aviso para cada papel nomeado que não existe, em vez de um erro.

A declaração é escrita no log binário se for bem-sucedida, mas não se falhar; nesse caso, ocorre um rollback e nenhuma alteração é feita. Uma declaração escrita no log binário inclui todos os papéis nomeados. Se a cláusula `IF EXISTS` for fornecida, isso inclui até papéis que não existem e não foram removidos.

Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papéis”. Por exemplo:

```
DROP ROLE 'admin', 'developer';
DROP ROLE 'webapp'@'localhost';
```

A parte do nome de papel que contém o nome do host, se omitida, tem como padrão `'%'`.

Um papel removido é automaticamente revogado de qualquer conta de usuário (ou papel) para a qual o papel foi concedido. Dentro de qualquer sessão atual para tal conta, seus privilégios ajustados se aplicam a partir da próxima declaração executada.

Para exemplos de uso de papéis, consulte a Seção 8.2.10, “Usando papéis”.