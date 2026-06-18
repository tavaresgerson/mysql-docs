#### 15.7.1.8 Declaração de REVOGAÇÃO

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

A declaração `REVOKE` permite que os administradores do sistema revirem privilégios e papéis, que podem ser revogados das contas e papéis dos usuários.

Para obter detalhes sobre os níveis em que os privilégios existem, os valores permitidos `priv_type`, `priv_level` e `object_type` e a sintaxe para especificar usuários e senhas, consulte a Seção 15.7.1.6, “Instrução GRANT”.

Para obter informações sobre os papéis, consulte a Seção 8.2.10, “Usando papéis”.

Quando a variável de sistema `read_only` estiver habilitada, o `REVOKE` requer o `CONNECTION_ADMIN` ou privilégio (ou o privilégio desatualizado `SUPER`), além de quaisquer outros privilégios necessários descritos na discussão a seguir.

A partir do MySQL 8.0.30, todos os formulários mostrados para `REVOKE` suportam uma opção `IF EXISTS` e uma opção `IGNORE UNKNOWN USER`. Sem nenhuma dessas modificações, `REVOKE` ou tem sucesso para todos os usuários e papéis nomeados, ou é revertido e não tem efeito se ocorrer algum erro; a declaração é escrita no log binário apenas se tiver sucesso para todos os usuários e papéis nomeados. Os efeitos precisos de `IF EXISTS` e `IGNORE UNKNOWN USER` são discutidos mais adiante nesta seção.

Cada nome de conta usa o formato descrito na Seção 8.2.4, “Especificando Nomes de Conta”. Cada nome de função usa o formato descrito na Seção 8.2.5, “Especificando Nomes de Função”. Por exemplo:

```
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
REVOKE 'role1', 'role2' FROM 'user1'@'localhost', 'user2'@'localhost';
REVOKE SELECT ON world.* FROM 'role3';
```

A parte do nome do host da conta ou do nome do papel, se omitida, tem como padrão `'%'`.

Para usar a sintaxe do primeiro `REVOKE` você deve ter o privilégio `GRANT OPTION` e você deve ter os privilégios que você está revogando.

Para revogar todos os privilégios de um usuário, use uma das seguintes declarações; qualquer uma dessas declarações remove todos os privilégios globais, de banco de dados, de tabela, de coluna e de rotina para os usuários ou papéis nomeados:

```
REVOKE ALL PRIVILEGES, GRANT OPTION
  FROM user_or_role [, user_or_role] ...

REVOKE ALL ON *.*
  FROM user_or_role [, user_or_role] ...
```

Nenhuma das duas declarações mostradas acima revoga nenhum papel.

Para usar essas declarações `REVOKE` você deve ter o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o esquema de sistema `mysql`.

A sintaxe para a qual a palavra-chave `REVOKE` é seguida por um ou mais nomes de papéis inclui uma cláusula `FROM` que indica um ou mais usuários ou papéis a partir dos quais os papéis serão revogados.

As opções `IF EXISTS` e `IGNORE UNKNOWN USER` (MySQL 8.0.30 e versões posteriores) têm os efeitos listados aqui:

- `IF EXISTS` significa que, se o usuário ou o papel alvo existir, mas nenhum privilégio ou papel desse tipo for encontrado atribuído ao alvo por qualquer motivo, um aviso é gerado, em vez de um erro; se nenhum privilégio ou papel nomeado pela declaração for atribuído ao alvo, a declaração não terá (outro) efeito. Caso contrário, `REVOKE` é executado normalmente; se o usuário não existir, a declaração gera um erro.

  *Exemplo*: Dado a tabela `t1` no banco de dados `test`, executamos as seguintes instruções, com os resultados mostrados.

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

  `IF EXISTS` faz com que um erro seja rebaixado para um aviso, mesmo que o privilégio ou o nome do papel não existam ou se a declaração tente atribuí-los ao nível errado.

- Se a declaração `REVOKE` incluir `IGNORE UNKNOWN USER`, a declaração emite uma mensagem de alerta para qualquer usuário ou função de destino mencionados na declaração, mas não encontrados; se não existir nenhum usuário mencionado pela declaração, `REVOKE` é executado, mas não tem efeito real. Caso contrário, a declaração é executada normalmente, e tentar revogar um privilégio que não foi atribuído ao usuário de destino, por qualquer motivo, gera um erro, conforme esperado.

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

- A combinação de `IF EXISTS` e `IGNORE UNKNOWN USER` significa que `REVOKE` nunca gera um erro para um usuário ou papel desconhecido ou para um privilégio não atribuído ou indisponível, e a declaração como um todo, nesses casos, é bem-sucedida; os papéis ou privilégios são removidos dos usuários ou papéis existentes sempre que possível, e qualquer revogação que não seja possível gera uma mensagem de alerta e é executada como um `NOOP`.

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

Os papéis nomeados na variável de sistema `mandatory_roles` não podem ser revogados. Quando `IF EXISTS` e `IGNORE UNKNOWN USER` são usados juntos em uma declaração que tenta remover um privilégio obrigatório, o erro normalmente gerado ao tentar fazer isso é reduzido a um aviso; a declaração é executada com sucesso, mas não faz nenhuma alteração.

Um papel revogado afeta imediatamente qualquer conta de usuário da qual foi revogado, de modo que, dentro de qualquer sessão atual da conta, seus privilégios são ajustados para a próxima declaração executada.

Revocar um papel revoga o próprio papel, não os privilégios que ele representa. Suponha que uma conta receba um papel que inclua um privilégio específico e também receba o privilégio explicitamente ou outro papel que inclua o privilégio. Nesse caso, a conta ainda possui esse privilégio se o primeiro papel for revogado. Por exemplo, se uma conta receber dois papéis que cada um inclua `SELECT`, a conta ainda pode selecionar após o primeiro papel ser revogado.

`REVOKE ALL ON *.*` (a nível global) revoga todos os privilégios estáticos globais concedidos e todos os privilégios dinâmicos concedidos.

Um privilégio revogado que é concedido, mas não conhecido pelo servidor, é revogado com um aviso. Essa situação pode ocorrer para privilégios dinâmicos. Por exemplo, um privilégio dinâmico pode ser concedido enquanto o componente que o registra está instalado, mas se esse componente for posteriormente desinstalado, o privilégio se torna não registrado, embora as contas que possuem o privilégio ainda o possuam e podem ser revogadas delas.

`REVOKE` remove privilégios, mas não remove linhas da tabela de sistema `mysql.user`. Para remover uma conta de usuário completamente, use `DROP USER`. Veja a Seção 15.7.1.5, “Instrução DROP USER”.

Se as tabelas de concessão contiverem linhas de privilégio que contenham nomes de banco de dados ou tabelas com nomes em maiúsculas e minúsculas misturados e a variável de sistema `lower_case_table_names` estiver definida para um valor diferente de zero, o `REVOKE` não pode ser usado para revogar esses privilégios. Nesses casos, é necessário manipular as tabelas de concessão diretamente. (O `GRANT` não cria essas linhas quando o `lower_case_table_names` estiver definido, mas essas linhas podem ter sido criadas antes de definir a variável. A configuração do `lower_case_table_names` só pode ser configurada ao inicializar o servidor.)

Quando executado com sucesso a partir do programa **mysql**, `REVOKE` responde com `Query OK, 0 rows affected`. Para determinar quais privilégios permanecem após a operação, use `SHOW GRANTS`. Veja a Seção 15.7.7.21, “Instrução SHOW GRANTS”.
