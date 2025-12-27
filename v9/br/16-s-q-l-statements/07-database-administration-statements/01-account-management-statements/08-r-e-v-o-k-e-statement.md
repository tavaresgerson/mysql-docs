#### 15.7.1.8 Declaração de REVOKE

```
REVOKE [IF EXISTS]
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    FROM user_or_role [, user_or_role] ...
    [IGNORE UNKNOWN USER]

REVOKE [IF EXISTS] ALL [PRIVILEGES], GRANT OPTION
    FROM user_or_role [, user_or_role] ...
    [IGNORE UNKNOWN USER]

REVOKE [IF EXISTS] PROXY ON user_or_role
    FROM user_or_role [, user_or_role] ...
    [IGNORE UNKNOWN USER]

REVOKE [IF EXISTS] role [, role ] ...
    FROM user_or_role [, user_or_role ] ...
    [IGNORE UNKNOWN USER]

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”
}
```

A declaração `REVOKE` permite que os administradores do sistema revoguem privilégios e papéis, que podem ser revogados das contas e papéis de usuários.

Para obter detalhes sobre os níveis em que os privilégios existem, os valores permitidos de *`priv_type`*, *`priv_level`* e *`object_type`* e a sintaxe para especificar usuários e senhas, consulte a Seção 15.7.1.6, “Declaração GRANT”.

Para informações sobre papéis, consulte a Seção 8.2.10, “Uso de Papéis”.

Quando a variável de sistema `read_only` é habilitada, a `REVOKE` requer o privilégio `CONNECTION_ADMIN` ou (o privilégio desatualizado `SUPER`), além de quaisquer outros privilégios necessários descritos na discussão a seguir.

Todos os formulários mostrados para `REVOKE` suportam uma opção `IF EXISTS` e uma opção `IGNORE UNKNOWN USER`. Sem nenhuma dessas modificações, a `REVOKE` ou tem sucesso para todos os usuários e papéis nomeados, ou é revertida e não tem efeito se ocorrer algum erro; a declaração é escrita no log binário apenas se tiver sucesso para todos os usuários e papéis nomeados. Os efeitos precisos de `IF EXISTS` e `IGNORE UNKNOWN USER` são discutidos mais adiante nesta seção.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Cada nome de papel usa o formato descrito na Seção 8.2.5, “Especificação de Nomes de Papel”. Por exemplo:

```
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
REVOKE 'role1', 'role2' FROM 'user1'@'localhost', 'user2'@'localhost';
REVOKE SELECT ON world.* FROM 'role3';
```

A parte do nome de conta ou papel que é o nome do host, se omitida, tem como padrão `'%'`.

Para usar a primeira sintaxe de `REVOKE`, você deve ter o privilégio `GRANT OPTION` e deve ter os privilégios que você está revogando.

Para revogar todos os privilégios de um usuário, use uma das seguintes declarações; qualquer uma dessas declarações elimina todos os privilégios globais, de banco de dados, de tabela, de coluna e de rotina para os usuários ou papéis nomeados:

```
REVOKE ALL PRIVILEGES, GRANT OPTION
  FROM user_or_role [, user_or_role] ...

REVOKE ALL ON *.*
  FROM user_or_role [, user_or_role] ...
```

Nenhuma das duas declarações mostradas acima revoga nenhum papel.

Para usar essas declarações `REVOKE`, você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o esquema de sistema `mysql`.

A sintaxe para a qual a palavra-chave `REVOKE` é seguida por um ou mais nomes de papel inclui uma cláusula `FROM` que indica um ou mais usuários ou papéis a partir dos quais os papéis serão revogados.

As opções `IF EXISTS` e `IGNORE UNKNOWN USER` têm os efeitos listados aqui:

* `IF EXISTS` significa que, se o usuário ou papel alvo existir, mas nenhum privilégio ou papel for encontrado atribuído ao alvo por qualquer motivo, um aviso é gerado, em vez de um erro; se nenhum privilégio ou papel nomeado pela declaração for atribuído ao alvo, a declaração não tem (outros) efeitos. Caso contrário, `REVOKE` é executado normalmente; se o usuário não existir, a declaração gera um erro.

  *Exemplo*: Considerando a tabela `t1` na base de dados `test`, executamos as seguintes declarações, com os resultados mostrados.

  ```
  mysql> CREATE USER jerry@localhost;
  Query OK, 0 rows affected (0.01 sec)

  mysql> REVOKE SELECT ON test.t1 FROM jerry@localhost;
  ERROR 1147 (42000): There is no such grant defined for user 'jerry' on host
  'localhost' on table 't1'
  mysql> REVOKE IF EXISTS SELECT ON test.t1 FROM jerry@localhost;
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1147
  Message: There is no such grant defined for user 'jerry' on host 'localhost' on
  table 't1'
  1 row in set (0.00 sec)
  ```

  `IF EXISTS` faz com que um erro seja degradado para um aviso mesmo que o privilégio ou papel nomeado não exista, ou a declaração tente atribuí-lo ao nível errado.

* Se a declaração `REVOKE` incluir `IGNORE UNKNOWN USER`, a declaração gera um aviso para qualquer usuário ou papel alvo nomeado na declaração, mas não encontrado; se nenhum alvo nomeado pela declaração existir, `REVOKE` tem sucesso, mas não tem efeito real. Caso contrário, a declaração é executada normalmente, e tentar revogar um privilégio não atribuído ao alvo por qualquer motivo gera um erro, conforme esperado.

  *Exemplo* (continuação do exemplo anterior):

  ```
  mysql> DROP USER IF EXISTS jerry@localhost;
  Query OK, 0 rows affected (0.01 sec)

  mysql> REVOKE SELECT ON test.t1 FROM jerry@localhost;
  ERROR 1147 (42000): There is no such grant defined for user 'jerry' on host
  'localhost' on table 't1'
  mysql> REVOKE SELECT ON test.t1 FROM jerry@localhost IGNORE UNKNOWN USER;
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 3162
  Message: Authorization ID jerry does not exist.
  1 row in set (0.00 sec)
  ```

* A combinação de `IF EXISTS` e `IGNORE UNKNOWN USER` significa que `REVOKE` nunca gera um erro para um usuário ou papel desconhecido, ou para um privilégio não atribuído ou indisponível, e a declaração como um todo, nesses casos, é bem-sucedida; os papéis ou privilégios são removidos dos usuários ou papéis existentes sempre que possível, e qualquer revogação que não seja possível gera uma mensagem de aviso e é executada como `NOOP`.

  *Exemplo* (novamente continuando a partir do exemplo no item anterior):

  ```
  # No such user, no such role
  mysql> DROP ROLE IF EXISTS Bogus;
  Query OK, 0 rows affected, 1 warning (0.02 sec)

  mysql> SHOW WARNINGS;
  +-------+------+----------------------------------------------+
  | Level | Code | Message                                      |
  +-------+------+----------------------------------------------+
  | Note  | 3162 | Authorization ID 'Bogus'@'%' does not exist. |
  +-------+------+----------------------------------------------+
  1 row in set (0.00 sec)

  # This statement attempts to revoke a nonexistent role from a nonexistent user
  mysql> REVOKE Bogus ON test FROM jerry@localhost;
  ERROR 3619 (HY000): Illegal privilege level specified for test

  # The same, with IF EXISTS
  mysql> REVOKE IF EXISTS Bogus ON test FROM jerry@localhost;
  ERROR 1147 (42000): There is no such grant defined for user 'jerry' on host
  'localhost' on table 'test'

  # The same, with IGNORE UNKNOWN USER
  mysql> REVOKE Bogus ON test FROM jerry@localhost IGNORE UNKNOWN USER;
  ERROR 3619 (HY000): Illegal privilege level specified for test

  # The same, with both options
  mysql> REVOKE IF EXISTS Bogus ON test FROM jerry@localhost IGNORE UNKNOWN USER;
  Query OK, 0 rows affected, 2 warnings (0.01 sec)

  mysql> SHOW WARNINGS;
  +---------+------+--------------------------------------------+
  | Level   | Code | Message                                    |
  +---------+------+--------------------------------------------+
  | Warning | 3619 | Illegal privilege level specified for test |
  | Warning | 3162 | Authorization ID jerry does not exist.     |
  +---------+------+--------------------------------------------+
  2 rows in set (0.00 sec)
  ```

Papéis nomeados no valor da variável de sistema `mandatory_roles` não podem ser revogados. Quando `IF EXISTS` e `IGNORE UNKNOWN USER` são usados juntos em uma declaração que tenta remover um privilégio obrigatório, o erro normalmente gerado ao tentar fazer isso é rebaixado para um aviso; a declaração é executada com sucesso, mas não faz nenhuma alteração.

Uma função revogada afeta imediatamente qualquer conta de usuário da qual foi revogada, de modo que, dentro de qualquer sessão atual para a conta, seus privilégios são ajustados para a próxima declaração executada.

Revocar uma função revoga a própria função, não os privilégios que ela representa. Suponha que uma conta seja concedida uma função que inclui um determinado privilégio, e também seja concedido o privilégio explicitamente ou outra função que inclua o privilégio. Nesse caso, a conta ainda possui esse privilégio se a primeira função for revogada. Por exemplo, se uma conta é concedida duas funções que cada uma inclui `SELECT`, a conta ainda pode selecionar após qualquer função ser revogada.

`REVOKE ALL ON *.*` (no nível global) revoga todos os privilégios globais estáticos concedidos e todos os privilégios dinâmicos concedidos.

Um privilégio revogado que é concedido, mas não conhecido pelo servidor, é revogado com um aviso. Essa situação pode ocorrer para privilégios dinâmicos. Por exemplo, um privilégio dinâmico pode ser concedido enquanto o componente que o registra está instalado, mas se esse componente for posteriormente desinstalado, o privilégio se torna não registrado, embora as contas que possuem o privilégio ainda o possuam e possam ser revogadas delas.

`REVOKE` remove privilégios, mas não remove linhas da tabela `mysql.user` do sistema. Para remover uma conta de usuário inteiramente, use `DROP USER`. Veja a Seção 15.7.1.5, “Instrução DROP USER”.

Se as tabelas de concessão contiverem linhas de privilégio que contêm nomes de banco de dados ou tabelas em maiúsculas e minúsculas misturados e a variável de sistema `lower_case_table_names` estiver definida para um valor não nulo, `REVOKE` não pode ser usado para revogar esses privilégios. É necessário, nesses casos, manipular diretamente as tabelas de concessão. (`GRANT` não cria tais linhas quando `lower_case_table_names` é definido, mas tais linhas podem ter sido criadas antes de configurar a variável. A configuração de `lower_case_table_names` só pode ser configurada ao inicializar o servidor.)

Quando executado com sucesso a partir do programa **mysql**, `REVOKE` responde com `Query OK, 0 rows affected`. Para determinar quais privilégios permanecem após a operação, use `SHOW GRANTS`. Veja a Seção 15.7.7.23, “Instrução SHOW GRANTS”.