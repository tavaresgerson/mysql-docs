### 28.3.51 A Tabela INFORMATION_SCHEMA USER_ATTRIBUTES

A tabela `USER_ATTRIBUTES` fornece informações sobre comentários de usuários e atributos de usuário. Ela obtém seus valores da tabela `mysql.user` do sistema.

A tabela `USER_ATTRIBUTES` tem as seguintes colunas:

* `USER`

  A parte do nome do usuário da conta para a qual o valor da coluna `ATTRIBUTE` se aplica.

* `HOST`

  A parte do nome do host da conta para a qual o valor da coluna `ATTRIBUTE` se aplica.

* `ATTRIBUTE`

  O comentário do usuário, o atributo de usuário ou ambos pertencentes à conta especificada pelas colunas `USER` e `HOST`. O valor está em notação de objeto JSON. Os atributos são mostrados exatamente como definidos usando as instruções `CREATE USER` e `ALTER USER` com as opções `ATTRIBUTE` ou `COMMENT`. Um comentário é mostrado como um par chave-valor com `comment` como a chave. Para informações adicionais e exemplos, consulte Opções de Comentário e Atributo de CREATE USER.

#### Notas

* `USER_ATTRIBUTES` é uma tabela `INFORMATION_SCHEMA` não padrão.

* Para obter apenas o comentário do usuário para um usuário dado como uma string não citada, você pode usar uma consulta como esta:

  ```
  mysql> SELECT ATTRIBUTE->>"$.comment" AS Comment
      ->     FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
      ->     WHERE USER='bill' AND HOST='localhost';
  +-----------+
  | Comment   |
  +-----------+
  | A comment |
  +-----------+
  ```

* Da mesma forma, você pode obter o valor não citado para um atributo de usuário dado usando sua chave.

* O conteúdo de `USER_ATTRIBUTES` é acessível da seguinte forma:

  + Todas as linhas são acessíveis se:

    - O thread atual é um thread replica.
    - O sistema de controle de acesso não foi inicializado (por exemplo, o servidor foi iniciado com a opção `--skip-grant-tables`).

    - A conta atualmente autenticada tem o privilégio `UPDATE` ou `SELECT` para a tabela `mysql.user`.

    - A conta atualmente autenticada tem os privilégios `CREATE USER` e `SYSTEM_USER`.

+ Caso contrário, a conta atualmente autenticada pode ver a linha dessa conta. Além disso, se a conta tiver o privilégio `CREATE USER`, mas não o privilégio `SYSTEM_USER`, ela pode ver linhas de todas as outras contas que não têm o privilégio `SYSTEM_USER`.

Para obter mais informações sobre a especificação de comentários e atributos de contas, consulte a Seção 15.7.1.3, "Instrução CREATE USER".