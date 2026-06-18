#### 15.7.1.10 Declaração de definir senha

```
SET PASSWORD [FOR user] auth_option
    [REPLACE 'current_auth_string']
    [RETAIN CURRENT PASSWORD]

auth_option: {
    = 'auth_string'
  | TO RANDOM
}
```

A declaração `SET PASSWORD` atribui uma senha a uma conta de usuário do MySQL. A senha pode ser especificada explicitamente na declaração ou gerada aleatoriamente pelo MySQL. A declaração também pode incluir uma cláusula de verificação de senha que especifica a senha atual da conta a ser substituída e uma cláusula que gerencia se uma conta tem uma senha secundária. `'auth_string'` e `'current_auth_string'` representam cada uma uma senha em texto claro (não criptografada).

Nota

Em vez de usar `SET PASSWORD` para atribuir senhas, `ALTER USER` é a declaração preferida para alterações de contas, incluindo a atribuição de senhas. Por exemplo:

```
ALTER USER user IDENTIFIED BY 'auth_string';
```

Nota

As cláusulas para geração de senha aleatória, verificação de senha e senhas secundárias aplicam-se apenas às contas que utilizam um plugin de autenticação que armazena as credenciais internamente no MySQL. Para contas que utilizam um plugin que realiza autenticação contra um sistema de credenciais externo ao MySQL, o gerenciamento de senhas também deve ser realizado externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

A cláusula `REPLACE 'current_auth_string'` realiza a verificação da senha e está disponível a partir do MySQL 8.0.13. Se fornecida:

- `REPLACE` especifica a senha atual da conta a ser substituída, como uma string em texto claro (não criptografada).

- A cláusula deve ser fornecida se as alterações de senha para a conta forem necessárias para especificar a senha atual, como uma verificação de que o usuário que está tentando fazer a alteração realmente conhece a senha atual.

- A cláusula é opcional, pois a mudança da senha da conta pode, mas não precisa, especificar a senha atual.

- A declaração falha se a cláusula for fornecida, mas não corresponder à senha atual, mesmo que a cláusula seja opcional.

- `REPLACE` pode ser especificado apenas ao alterar a senha da conta do usuário atual.

Para obter mais informações sobre a verificação da senha, especificando a senha atual, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

A cláusula `RETAIN CURRENT PASSWORD` implementa a capacidade de senha dupla e está disponível a partir do MySQL 8.0.14. Se fornecida:

- `RETAIN CURRENT PASSWORD` mantém a senha atual da conta como sua senha secundária, substituindo qualquer senha secundária existente. A nova senha se torna a senha primária, mas os clientes podem usar a conta para se conectar ao servidor usando a senha primária ou secundária. (Exceção: Se a nova senha especificada pela declaração `SET PASSWORD` for vazia, a senha secundária também ficará vazia, mesmo que `RETAIN CURRENT PASSWORD` seja fornecida.)

- Se você especificar `RETAIN CURRENT PASSWORD` para uma conta que tem uma senha primária vazia, a declaração falha.

- Se uma conta tiver uma senha secundária e você alterar sua senha primária sem especificar `RETAIN CURRENT PASSWORD`, a senha secundária permanecerá inalterada.

Para obter mais informações sobre o uso de senhas duplas, consulte a Seção 8.2.15, “Gerenciamento de Senhas”.

`SET PASSWORD` permite essas sintáticas `auth_option`:

- `= 'auth_string'`

  Atribui à conta a senha literal fornecida.

- `TO RANDOM`

  Atribui à conta uma senha gerada aleatoriamente pelo MySQL. A instrução também retorna a senha em texto claro em um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a instrução.

  Para obter detalhes sobre o conjunto de resultados e as características das senhas geradas aleatoriamente, consulte Geração de Senhas Aleatórias.

  A geração aleatória de senhas está disponível a partir do MySQL 8.0.18.

Importante

Em algumas circunstâncias, `SET PASSWORD` pode ser registrado em logs do servidor ou no lado do cliente em um arquivo de histórico, como `~/.mysql_history`, o que significa que senhas em texto claro podem ser lidas por qualquer pessoa que tenha acesso de leitura a essas informações. Para obter informações sobre as condições sob as quais isso ocorre para os logs do servidor e como controlá-lo, consulte a Seção 8.1.2.3, “Senhas e Registro”. Para informações semelhantes sobre o registro no lado do cliente, consulte a Seção 6.5.1.3, “Registro do Cliente do MySQL”.

O `SET PASSWORD` pode ser usado com ou sem uma cláusula `FOR` que nomeia explicitamente uma conta de usuário:

- Com uma cláusula `FOR user`, a declaração define a senha para a conta nomeada, que deve existir:

  ```
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'auth_string';
  ```

- Sem a cláusula `FOR user`, a declaração define a senha para o usuário atual:

  ```
  SET PASSWORD = 'auth_string';
  ```

  Qualquer cliente que se conecte ao servidor usando uma conta não anônima pode alterar a senha dessa conta. (Em particular, você pode alterar sua própria senha.) Para ver qual conta o servidor autenticou você, invocando a função `CURRENT_USER()`:

  ```
  SELECT CURRENT_USER();
  ```

Se uma cláusula `FOR user` for fornecida, o nome da conta usa o formato descrito na Seção 8.2.4, “Especificação de Nomes de Conta”. Por exemplo:

```
SET PASSWORD FOR 'bob'@'%.example.org' = 'auth_string';
```

A parte do nome do host do nome da conta, se omitida, tem como padrão `'%'`.

`SET PASSWORD` interpreta a string como uma string em texto claro, passa-a para o plugin de autenticação associado à conta e armazena o resultado retornado pelo plugin na linha da conta na tabela do sistema `mysql.user`. (O plugin recebe a oportunidade de hashar o valor no formato de criptografia que ele espera. O plugin pode usar o valor conforme especificado, nesse caso, não ocorre hash.)

Definir a senha para uma conta nomeada (com uma cláusula `FOR`) requer o privilégio `UPDATE` para o esquema de sistema `mysql`. Definir a senha para si mesmo (para uma conta não anônima sem a cláusula `FOR`) não requer privilégios especiais.

Para fazer declarações que modifiquem senhas secundárias, são necessários esses privilégios:

- O privilégio `APPLICATION_PASSWORD_ADMIN` é necessário para usar a cláusula `RETAIN CURRENT PASSWORD` para instruções `SET PASSWORD` que se aplicam à sua própria conta. O privilégio é necessário para manipular sua própria senha secundária, pois a maioria dos usuários exige apenas uma senha.

- Se uma conta deve ser autorizada a manipular senhas secundárias para todas as contas, ela deve receber o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

Quando a variável de sistema `read_only` está habilitada, `SET PASSWORD` requer o privilégio `CONNECTION_ADMIN` (ou o privilégio desatualizado `SUPER`), além de quaisquer outros privilégios necessários.

Para obter informações adicionais sobre a definição de senhas e plugins de autenticação, consulte a Seção 8.2.14, “Atribuição de Senhas de Conta”, e a Seção 8.2.17, “Autenticação Personalizável”.
