### 28.3.46 A tabela INFORMATION\_SCHEMA USER\_ATTRIBUTES

A tabela `USER_ATTRIBUTES` (disponível a partir do MySQL 8.0.21) fornece informações sobre comentários de usuários e atributos de usuários. Ela obtém seus valores da tabela de sistema `mysql.user`.

A tabela `USER_ATTRIBUTES` tem essas colunas:

- `USER`

  A parte do nome de usuário da conta para a qual o valor da coluna `ATTRIBUTE` se aplica.

- `HOST`

  A parte do nome do host da conta para a qual o valor da coluna `ATTRIBUTE` se aplica.

- `ATTRIBUTE`

  O comentário do usuário, o atributo do usuário ou ambos pertencentes à conta especificada pelas colunas `USER` e `HOST`. O valor está em notação de objeto JSON. Os atributos são exibidos exatamente como definidos usando as instruções `CREATE USER` e `ALTER USER` com as opções `ATTRIBUTE` ou `COMMENT`. Um comentário é exibido como um par chave-valor com `comment` como a chave. Para obter informações adicionais e exemplos, consulte Opções de Comentário e Atributo de CREATE USER.

#### Notas

- `USER_ATTRIBUTES` é uma tabela não padrão `INFORMATION_SCHEMA`.

- Para obter apenas o comentário do usuário para um usuário específico como uma string não citada, você pode usar uma consulta como esta:

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

  Da mesma forma, você pode obter o valor não cotado para um atributo de usuário específico usando sua chave.

- Antes do MySQL 8.0.22, o conteúdo do `USER_ATTRIBUTES` era acessível por qualquer pessoa. A partir do MySQL 8.0.22, o conteúdo do `USER_ATTRIBUTES` é acessível da seguinte forma:

  - Todas as linhas são acessíveis se:

    - O fio atual é um fio de réplica.

    - O sistema de controle de acesso não foi inicializado (por exemplo, o servidor foi iniciado com a opção `--skip-grant-tables`).

    - A conta autenticada atualmente possui o privilégio `UPDATE` ou `SELECT` para a tabela de sistema `mysql.user`.

    - A conta autenticada atualmente possui os privilégios `CREATE USER` e `SYSTEM_USER`.

  - Caso contrário, a conta atualmente autenticada pode ver a linha dessa conta. Além disso, se a conta tiver o privilégio `CREATE USER`, mas não o privilégio `SYSTEM_USER`, ela pode ver linhas de todas as outras contas que não têm o privilégio `SYSTEM_USER`.

Para obter mais informações sobre a especificação de comentários e atributos de contas, consulte a Seção 15.7.1.3, “Instrução CREATE USER”.
