### 8.2.15 Gerenciamento de Senhas

O MySQL suporta essas capacidades de gerenciamento de senhas:

- Expiração da senha, para exigir que as senhas sejam alteradas periodicamente.

- Restrições de reutilização de senha, para evitar que senhas antigas sejam escolhidas novamente.

- Verificação da senha: para exigir que as alterações de senha também especifiquem a senha atual a ser substituída.

- Senhas duplas, para permitir que os clientes se conectem usando uma senha primária ou secundária.

- Avaliação da força da senha, para exigir senhas fortes.

- A geração aleatória de senhas, como alternativa à exigência de senhas literais especificadas explicitamente pelo administrador.

- Rastreamento de falhas de senha, para permitir o bloqueio temporário da conta após várias tentativas consecutivas de login com senha incorreta.

As seções a seguir descrevem essas capacidades, exceto a avaliação da força da senha, que é implementada usando o componente `validate_password` e é descrita na Seção 8.4.3, “O Componente de Validação de Senhas”.

- Armazenamento de credenciais internas versus externas
- Política de Expiração da Senha
- Política de Reutilização de Senhas
- Política de Verificação de Senha Requerida
- Suporte a senha dupla
- Geração aleatória de senha
- Rastreamento de tentativas de login malsucedidas e bloqueio temporário de contas

Importante

O MySQL implementa capacidades de gerenciamento de senhas usando tabelas no banco de dados do sistema `mysql`. Se você atualizar o MySQL a partir de uma versão anterior, suas tabelas do sistema podem não estar atualizadas. Nesse caso, o servidor escreve mensagens semelhantes a essas no log de erro durante o processo de inicialização (os números exatos podem variar):

```
[ERROR] Column count of mysql.user is wrong. Expected
49, found 47. The table is probably corrupted
[Warning] ACL table mysql.password_history missing.
Some operations may fail.
```

Para corrigir o problema, execute o procedimento de atualização do MySQL. Veja o Capítulo 3, *Atualizando o MySQL*. Até que isso seja feito, as alterações de *senha não são possíveis.*

#### Armazenamento de credenciais internas versus externas

Alguns plugins de autenticação armazenam as credenciais da conta internamente no MySQL, na tabela `mysql.user` do sistema:

- `caching_sha2_password`
- `mysql_native_password` (desatualizado)
- `sha256_password` (desatualizado)

A maioria das discussões nesta seção se aplica a esses plugins de autenticação, pois a maioria das capacidades de gerenciamento de senhas descritas aqui é baseada no armazenamento interno de credenciais gerenciado pelo próprio MySQL. Outros plugins de autenticação armazenam as credenciais da conta externamente ao MySQL. Para contas que usam plugins que realizam autenticação contra um sistema de credenciais externo, o gerenciamento de senhas deve ser realizado externamente contra esse sistema também.

A exceção é que as opções de rastreamento de logins falhos e bloqueio temporário de contas se aplicam a todas as contas, não apenas às contas que usam armazenamento de credenciais interno, porque o MySQL é capaz de avaliar o status das tentativas de login para qualquer conta, independentemente de ela usar armazenamento de credenciais interno ou externo.

Para obter informações sobre os plugins de autenticação individual, consulte a Seção 8.4.1, “Plugins de Autenticação”.

#### Política de Expiração da Senha

O MySQL permite que os administradores de banco de dados expiram manualmente as senhas das contas e estabeleçam uma política para a expiração automática das senhas. A política de expiração pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para adiar a aplicação da política global ou ignorar a política global com comportamentos específicos por conta.

Para expirar uma senha de conta manualmente, use a declaração `ALTER USER`:

```
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

Esta operação marca a senha expirada na linha correspondente na tabela do sistema `mysql.user`.

A expiração da senha de acordo com a política é automática e baseia-se na idade da senha, que, para uma conta específica, é avaliada a partir da data e hora da última alteração da senha. A tabela do sistema `mysql.user` indica para cada conta quando sua senha foi alterada pela última vez, e o servidor trata automaticamente a senha como expirada no momento da conexão do cliente se sua idade for maior que sua vida útil permitida. Isso funciona sem expiração explícita manual da senha.

Para estabelecer uma política de expiração automática de senha globalmente, use a variável de sistema `default_password_lifetime`. Seu valor padrão é 0, que desativa a expiração automática da senha. Se o valor de `default_password_lifetime` for um inteiro positivo `N`, isso indica a vida útil da senha permitida, de modo que as senhas devem ser alteradas a cada `N` dias.

Exemplos:

- Para estabelecer uma política global de que as senhas tenham uma duração de aproximadamente seis meses, inicie o servidor com essas linhas em um arquivo de servidor `my.cnf`:

  ```
  [mysqld]
  default_password_lifetime=180
  ```

- Para estabelecer uma política global de forma que as senhas nunca expirem, defina `default_password_lifetime` para 0:

  ```
  [mysqld]
  default_password_lifetime=0
  ```

- `default_password_lifetime` também pode ser definido e persistido em tempo de execução:

  ```
  SET PERSIST default_password_lifetime = 180;
  SET PERSIST default_password_lifetime = 0;
  ```

  `SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor para ser carregado em reinicializações subsequentes do servidor; consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. Para alterar o valor da instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.

A política global de expiração de senhas aplica-se a todas as contas que não tenham sido configuradas para ignorá-la. Para definir a política para contas individuais, use a opção `PASSWORD EXPIRE` das instruções `CREATE USER` e `ALTER USER`. Consulte a Seção 15.7.1.3, “Instrução CREATE USER”, e a Seção 15.7.1.1, “Instrução ALTER USER”.

Exemplos de declarações específicas para contas:

- Exigir que a senha seja alterada a cada 90 dias:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ```

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

- Desativar a expiração da senha:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  Essa opção de expiração substitui a política global para todas as contas nomeadas pelo extrato.

- Aplique a política de expiração global para todas as contas nomeadas na declaração:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

Quando um cliente se conecta com sucesso, o servidor determina se a senha da conta expirou:

- O servidor verifica se a senha expirou manualmente.

- Caso contrário, o servidor verifica se a idade da senha é maior que sua vida útil permitida de acordo com a política automática de expiração da senha. Se for o caso, o servidor considera que a senha expirou.

Se a senha expirar (seja manualmente ou automaticamente), o servidor desconecta o cliente ou restringe as operações permitidas a ele (consulte a Seção 8.2.16, “Tratamento do servidor de senhas expiradas”). As operações realizadas por um cliente restrito resultam em um erro até que o usuário estabeleça uma nova senha da conta:

```
mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> ALTER USER USER() IDENTIFIED BY 'password';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```

Depois que o cliente redefini a senha, o servidor restaura o acesso normal para a sessão, bem como para as conexões subsequentes que utilizam a conta. Também é possível que um usuário administrativo redefina a senha da conta, mas quaisquer sessões restritas existentes para essa conta permanecem restritas. Um cliente que utiliza a conta deve se desconectar e se reconectar antes que as declarações possam ser executadas com sucesso.

Nota

Embora seja possível "redefinir" uma senha expirada, definindo-a para seu valor atual, é preferível, por questão de boa prática, escolher uma senha diferente. Os administradores de banco de dados podem impor a não reutilização estabelecendo uma política apropriada de reutilização de senhas. Veja a Política de Reutilização de Senhas.

#### Política de Reutilização de Senhas

O MySQL permite que restrições sejam definidas para a reutilização de senhas anteriores. As restrições de reutilização podem ser estabelecidas com base no número de alterações de senha, no tempo decorrido ou em ambos. A política de reutilização pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para adiar a aplicação da política global ou ignorar a política global com um comportamento específico por conta.

O histórico de senhas de uma conta consiste nas senhas que foram atribuídas anteriormente. O MySQL pode restringir a escolha de novas senhas desse histórico:

- Se uma conta for restringida com base no número de alterações de senha, uma nova senha não pode ser escolhida a partir de um número especificado das senhas mais recentes. Por exemplo, se o número mínimo de alterações de senha for definido em 3, uma nova senha não pode ser a mesma de nenhuma das 3 senhas mais recentes.

- Se uma conta for restringida com base no tempo decorrido, uma nova senha não pode ser escolhida entre as senhas do histórico que são mais recentes que um número especificado de dias. Por exemplo, se o intervalo de reutilização de senha for definido para 60, uma nova senha não pode estar entre as escolhidas anteriormente nos últimos 60 dias.

Nota

A senha vazia não é contabilizada no histórico de senhas e pode ser reutilizada a qualquer momento.

Para estabelecer uma política de reutilização de senha globalmente, use as variáveis de sistema `password_history` e `password_reuse_interval`.

Exemplos:

- Para proibir o reuso de qualquer uma das últimas 6 senhas ou senhas mais recentes que 365 dias, coloque essas linhas no arquivo do servidor `my.cnf`:

  ```
  [mysqld]
  password_history=6
  password_reuse_interval=365
  ```

- Para definir e manter as variáveis em tempo de execução, use instruções como esta:

  ```
  SET PERSIST password_history = 6;
  SET PERSIST password_reuse_interval = 365;
  ```

  `SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor para ser carregado em reinicializações subsequentes do servidor; consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. Para alterar o valor da instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.

A política global de reutilização de senhas aplica-se a todas as contas que não tenham sido configuradas para ignorá-la. Para estabelecer uma política para contas individuais, use as opções `PASSWORD HISTORY` e `PASSWORD REUSE INTERVAL` das instruções `CREATE USER` e `ALTER USER`. Consulte a Seção 15.7.1.3, “Instrução CREATE USER”, e a Seção 15.7.1.1, “Instrução ALTER USER”.

Exemplos de declarações específicas para contas:

- Exija pelo menos 5 mudanças de senha antes de permitir a reutilização:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY 5;
  ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY 5;
  ```

  Esta opção de comprimento de histórico substitui a política global para todas as contas nomeadas pelo relatório.

- Exija que pelo menos 365 dias tenham se passado antes de permitir a reutilização:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 365 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 365 DAY;
  ```

  Esta opção de tempo transcorrido substitui a política global para todas as contas nomeadas pelo extrato.

- Para combinar ambos os tipos de restrições de reutilização, use `PASSWORD HISTORY` e `PASSWORD REUSE INTERVAL` juntos:

  ```
  CREATE USER 'jeffrey'@'localhost'
    PASSWORD HISTORY 5
    PASSWORD REUSE INTERVAL 365 DAY;
  ALTER USER 'jeffrey'@'localhost'
    PASSWORD HISTORY 5
    PASSWORD REUSE INTERVAL 365 DAY;
  ```

  Essas opções substituem as restrições de reutilização de políticas globais para todas as contas nomeadas pelo relatório.

- Aplique a política global para ambos os tipos de restrições de reutilização:

  ```
  CREATE USER 'jeffrey'@'localhost'
    PASSWORD HISTORY DEFAULT
    PASSWORD REUSE INTERVAL DEFAULT;
  ALTER USER 'jeffrey'@'localhost'
    PASSWORD HISTORY DEFAULT
    PASSWORD REUSE INTERVAL DEFAULT;
  ```

#### Política de Verificação de Senha Requerida

A partir do MySQL 8.0.13, é possível exigir que as tentativas de alterar a senha de uma conta sejam verificadas, especificando a senha atual a ser substituída. Isso permite que os administradores de banco de dados impeçam que os usuários mudem uma senha sem comprovar que conhecem a senha atual. Tais alterações poderiam ocorrer, por exemplo, se um usuário sair temporariamente de uma sessão de terminal sem fazer logout e um usuário mal-intencionado usar a sessão para alterar a senha do usuário original no MySQL. Isso pode ter consequências indesejadas:

- O usuário original fica incapaz de acessar o MySQL até que a senha da conta seja redefinida por um administrador.

- Até que o reajuste da senha ocorra, o usuário malicioso pode acessar o MySQL com as credenciais alteradas do usuário benigno.

A política de verificação de senha pode ser estabelecida globalmente, e as contas individuais podem ser configuradas para deferir à política global ou para substituir a política global com comportamentos específicos por conta.

Para cada conta, sua linha `mysql.user` indica se há uma configuração específica da conta que exige a verificação da senha atual para tentativas de alteração de senha. A configuração é estabelecida pela opção `PASSWORD REQUIRE` das declarações `CREATE USER` e `ALTER USER`:

- Se a configuração da conta for `PASSWORD REQUIRE CURRENT`, as alterações de senha devem especificar a senha atual.

- Se a configuração da conta for `PASSWORD REQUIRE CURRENT OPTIONAL`, as alterações de senha podem, mas não precisam, especificar a senha atual.

- Se a configuração da conta for `PASSWORD REQUIRE CURRENT DEFAULT`, a variável de sistema `password_require_current` determina a política de verificação necessária para a conta:

  - Se `password_require_current` estiver ativado, as alterações de senha devem especificar a senha atual.

  - Se `password_require_current` estiver desativado, as alterações de senha podem, mas não precisam, especificar a senha atual.

Em outras palavras, se a configuração da conta não for `PASSWORD REQUIRE CURRENT DEFAULT`, a configuração da conta prevalece sobre a política global estabelecida pela variável de sistema `password_require_current`. Caso contrário, a conta deferirá para a configuração `password_require_current`.

Por padrão, a verificação da senha é opcional: `password_require_current` está desativado e as contas criadas sem a opção `PASSWORD REQUIRE` têm como padrão `PASSWORD REQUIRE CURRENT DEFAULT`.

A tabela a seguir mostra como as configurações por conta interagem com os valores da variável de sistema `password_require_current` para determinar a política de verificação da senha da conta.

**Tabela 8.10 Política de Verificação de Senhas**

<table summary="Interação da tabela mysql.user e da variável de sistema password_require_current para a política de verificação de senha."><thead><tr> <th scope="col">Configuração por Conta</th> <th scope="col">variável_de_sistema password_require_current</th> <th scope="col">Alterações de senha exigem senha atual?</th> </tr></thead><tbody><tr> <th>[[PH_HTML_CODE_<code>PASSWORD REQUIRE CURRENT DEFAULT</code>]</th> <td>[[PH_HTML_CODE_<code>PASSWORD REQUIRE CURRENT DEFAULT</code>]</td> <td>Sim</td> </tr><tr> <th>[[<code>PASSWORD REQUIRE CURRENT</code>]]</th> <td>[[<code>ON</code>]]</td> <td>Sim</td> </tr><tr> <th>[[<code>PASSWORD REQUIRE CURRENT OPTIONAL</code>]]</th> <td>[[<code>OFF</code>]]</td> <td>Não</td> </tr><tr> <th>[[<code>PASSWORD REQUIRE CURRENT OPTIONAL</code>]]</th> <td>[[<code>ON</code>]]</td> <td>Não</td> </tr><tr> <th>[[<code>PASSWORD REQUIRE CURRENT DEFAULT</code>]]</th> <td>[[<code>OFF</code>]]</td> <td>Não</td> </tr><tr> <th>[[<code>PASSWORD REQUIRE CURRENT DEFAULT</code>]]</th> <td>[[<code>OFF</code><code>PASSWORD REQUIRE CURRENT DEFAULT</code>]</td> <td>Sim</td> </tr></tbody></table>

Nota

Os usuários privilegiados podem alterar qualquer senha de conta sem precisar especificar a senha atual, independentemente da política que exige verificação. Um usuário privilegiado é aquele que possui o privilégio global `CREATE USER` ou o privilégio `UPDATE` para o banco de dados do sistema `mysql`.

Para estabelecer uma política de verificação de senha globalmente, use a variável de sistema `password_require_current`. Seu valor padrão é `OFF`, então não é necessário que as alterações de senha da conta especifiquem a senha atual.

Exemplos:

- Para estabelecer uma política global de que as alterações de senha devem especificar a senha atual, inicie o servidor com essas linhas em um arquivo de servidor `my.cnf`:

  ```
  [mysqld]
  password_require_current=ON
  ```

- Para definir e persistir em `password_require_current` em tempo de execução, use uma declaração como uma das seguintes:

  ```
  SET PERSIST password_require_current = ON;
  SET PERSIST password_require_current = OFF;
  ```

  `SET PERSIST` define um valor para a instância do MySQL em execução. Ele também salva o valor para ser carregado em reinicializações subsequentes do servidor; consulte a Seção 15.7.6.1, “Sintaxe SET para Atribuição de Variáveis”. Para alterar o valor da instância do MySQL em execução sem que ele seja carregado em reinicializações subsequentes, use a palavra-chave `GLOBAL` em vez de `PERSIST`.

A política global de verificação de senha exigida aplica-se a todas as contas que não tenham sido configuradas para ignorá-la. Para definir a política para contas individuais, use as opções `PASSWORD REQUIRE` das instruções `CREATE USER` e `ALTER USER`. Consulte a Seção 15.7.1.3, “Instrução CREATE USER”, e a Seção 15.7.1.1, “Instrução ALTER USER”.

Exemplos de declarações específicas para contas:

- Exija que as alterações de senha especifiquem a senha atual:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

  Essa opção de verificação substitui a política global para todas as contas nomeadas pelo extrato.

- Não é necessário que as alterações de senha especifiquem a senha atual (a senha atual pode, mas não precisa ser fornecida):

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

  Essa opção de verificação substitui a política global para todas as contas nomeadas pelo extrato.

- Aplique a política global de verificação de senha obrigatória para todas as contas mencionadas na declaração:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

A verificação da senha atual entra em jogo quando um usuário altera uma senha usando a declaração `ALTER USER` ou `SET PASSWORD`. Os exemplos usam `ALTER USER`, que é preferido em relação a `SET PASSWORD`, mas os princípios descritos aqui são os mesmos para ambas as declarações.

Em declarações de alteração de senha, uma cláusula `REPLACE` especifica a senha atual a ser substituída. Exemplos:

- Alterar a senha do usuário atual:

  ```
  ALTER USER USER() IDENTIFIED BY 'auth_string' REPLACE 'current_auth_string';
  ```

- Alterar a senha de um usuário nomeado:

  ```
  ALTER USER 'jeffrey'@'localhost'
    IDENTIFIED BY 'auth_string'
    REPLACE 'current_auth_string';
  ```

- Alterar o plugin de autenticação e a senha de um usuário nomeado:

  ```
  ALTER USER 'jeffrey'@'localhost'
    IDENTIFIED WITH caching_sha2_password BY 'auth_string'
    REPLACE 'current_auth_string';
  ```

A cláusula `REPLACE` funciona da seguinte forma:

- `REPLACE` deve ser fornecido se as alterações de senha da conta forem necessárias para especificar a senha atual, como uma verificação de que o usuário que está tentando fazer a alteração realmente conhece a senha atual.

- `REPLACE` é opcional se a senha da conta puder ser alterada, mas não é obrigatório especificar a senha atual.

- Se `REPLACE` for especificado, ele deve especificar a senha atual correta, caso contrário, ocorrerá um erro. Isso é verdadeiro mesmo que `REPLACE` seja opcional.

- `REPLACE` pode ser especificado apenas ao alterar a senha da conta do usuário atual. (Isso significa que, nos exemplos mostrados, as declarações que explicitamente nomeiam a conta para `jeffrey` falham, a menos que o usuário atual seja `jeffrey`.) Isso é verdadeiro mesmo que a alteração seja realizada por outro usuário por um usuário privilegiado; no entanto, tal usuário pode alterar qualquer senha sem especificar `REPLACE`.

- `REPLACE` é omitido do log binário para evitar a escrita de senhas em texto claro nele.

#### Suporte a senha dupla

A partir do MySQL 8.0.14, as contas de usuário podem ter senhas duplas, designadas como senha primária e secundária. A capacidade de senha dupla permite realizar alterações de credenciais de forma contínua em cenários como este:

- Um sistema tem um grande número de servidores MySQL, possivelmente envolvendo replicação.

- Várias aplicações se conectam a diferentes servidores MySQL.

- Alterações de credenciais periódicas devem ser feitas na conta ou contas usadas pelas aplicações para se conectarem aos servidores.

Considere como uma alteração de credenciais deve ser realizada no tipo anterior de cenário quando uma conta permite apenas uma senha única. Neste caso, deve haver uma cooperação estreita no momento em que a alteração da senha da conta é feita e propagada em todos os servidores, e quando todas as aplicações que usam a conta são atualizadas para usar a nova senha. Esse processo pode envolver tempo de inatividade durante o qual os servidores ou aplicações ficam indisponíveis.

Com senhas duplas, as alterações de credenciais podem ser feitas de forma mais fácil, em fases, sem exigir uma cooperação próxima e sem tempo de inatividade:

1. Para cada conta afetada, defina uma nova senha primária nos servidores, mantendo a senha atual como senha secundária. Isso permite que os servidores reconheçam a senha primária ou secundária de cada conta, enquanto as aplicações podem continuar a se conectar aos servidores usando a mesma senha que antes (que agora é a senha secundária).

2. Depois que a alteração da senha tenha sido propagada para todos os servidores, modifique as aplicações que utilizam qualquer conta afetada para se conectarem usando a senha primária da conta.

3. Depois que todas as aplicações forem migradas das senhas secundárias para as senhas primárias, as senhas secundárias não serão mais necessárias e poderão ser descartadas. Após essa mudança ser propagada para todos os servidores, apenas a senha primária de cada conta poderá ser usada para se conectar. A alteração da credencial está agora concluída.

O MySQL implementa a capacidade de senha dupla com sintaxe que salva e descarta senhas secundárias:

- A cláusula `RETAIN CURRENT PASSWORD` para as instruções `ALTER USER` e `SET PASSWORD` salva a senha atual da conta como sua senha secundária quando você atribui uma nova senha primária.

- A cláusula `DISCARD OLD PASSWORD` para `ALTER USER` descarta a senha secundária de uma conta, deixando apenas a senha primária.

Suponha que, para o cenário de alteração de credenciais descrito anteriormente, uma conta chamada `'appuser1'@'host1.example.com'` seja usada pelas aplicações para se conectarem aos servidores, e que a senha da conta seja alterada de `'password_a'` para `'password_b'`.

Para realizar essa alteração das credenciais, use `ALTER USER` da seguinte forma:

1. Em cada servidor que não é uma replica, defina `'password_b'` como a nova senha primária `appuser1`, mantendo a senha atual como a senha secundária:

   ```
   ALTER USER 'appuser1'@'host1.example.com'
     IDENTIFIED BY 'password_b'
     RETAIN CURRENT PASSWORD;
   ```

2. Aguarde a mudança da senha ser replicada em todo o sistema para todas as réplicas.

3. Modifique cada aplicativo que usa a conta `appuser1` para que ele se conecte aos servidores usando uma senha de `'password_b'` em vez de `'password_a'`.

4. Neste ponto, a senha secundária não é mais necessária. Em cada servidor que não é uma réplica, descarte a senha secundária:

   ```
   ALTER USER 'appuser1'@'host1.example.com'
     DISCARD OLD PASSWORD;
   ```

5. Depois que a alteração da senha de descarte foi replicada para todas as réplicas, a alteração da credencial está concluída.

As cláusulas `RETAIN CURRENT PASSWORD` e `DISCARD OLD PASSWORD` têm os seguintes efeitos:

- `RETAIN CURRENT PASSWORD` mantém a senha atual da conta como sua senha secundária, substituindo qualquer senha secundária existente. A nova senha se torna a senha primária, mas os clientes podem usar a conta para se conectar ao servidor usando a senha primária ou secundária. (Exceção: Se a nova senha especificada pela declaração `ALTER USER` ou `SET PASSWORD` estiver vazia, a senha secundária também ficará vazia, mesmo que `RETAIN CURRENT PASSWORD` seja fornecida.)

- Se você especificar `RETAIN CURRENT PASSWORD` para uma conta que tem uma senha primária vazia, a declaração falha.

- Se uma conta tiver uma senha secundária e você alterar sua senha primária sem especificar `RETAIN CURRENT PASSWORD`, a senha secundária permanecerá inalterada.

- Para `ALTER USER`, se você alterar o plugin de autenticação atribuído à conta, a senha secundária será descartada. Se você alterar o plugin de autenticação e também especificar `RETAIN CURRENT PASSWORD`, a declaração falhará.

- Para `ALTER USER`, `DISCARD OLD PASSWORD` descarta a senha secundária, se existir. A conta mantém apenas sua senha primária, e os clientes podem usar a conta para se conectar ao servidor apenas com a senha primária.

Para fazer declarações que modifiquem senhas secundárias, são necessários esses privilégios:

- O privilégio `APPLICATION_PASSWORD_ADMIN` é necessário para usar a cláusula `RETAIN CURRENT PASSWORD` ou `DISCARD OLD PASSWORD` para as instruções `ALTER USER` e `SET PASSWORD` que se aplicam à sua própria conta. O privilégio é necessário para manipular sua própria senha secundária, pois a maioria dos usuários precisa apenas de uma senha.

- Se uma conta deve ser autorizada a manipular senhas secundárias para todas as contas, ela deve receber o privilégio `CREATE USER` em vez de `APPLICATION_PASSWORD_ADMIN`.

#### Geração aleatória de senha

A partir do MySQL 8.0.18, as instruções `CREATE USER`, `ALTER USER` e `SET PASSWORD` têm a capacidade de gerar senhas aleatórias para contas de usuário, como alternativa à exigência de senhas literais especificadas explicitamente pelo administrador. Consulte a descrição de cada instrução para obter detalhes sobre a sintaxe. Esta seção descreve as características comuns às senhas aleatórias geradas.

Por padrão, as senhas aleatórias geradas têm 20 caracteres. Esse comprimento é controlado pela variável de sistema `generated_random_password_length`, que tem um intervalo de 5 a 255.

Para cada conta para a qual uma declaração gera uma senha aleatória, a declaração armazena a senha no sistema `mysql.user`, criptografada de forma apropriada para o plugin de autenticação de conta. A declaração também retorna a senha em texto claro em uma linha de um conjunto de resultados para torná-la disponível para o usuário ou aplicativo que executa a declaração. As colunas do conjunto de resultados são nomeadas `user`, `host`, `generated password` e `auth_factor`, indicando os valores do nome do usuário e do nome do host que identificam a linha afetada na tabela de sistema `mysql.user`, a senha gerada em texto claro e o fator de autenticação ao qual o valor da senha exibida se aplica.

```
mysql> CREATE USER
       'u1'@'localhost' IDENTIFIED BY RANDOM PASSWORD,
       'u2'@'%.example.com' IDENTIFIED BY RANDOM PASSWORD,
       'u3'@'%.org' IDENTIFIED BY RANDOM PASSWORD;
+------+---------------+----------------------+-------------+
| user | host          | generated password   | auth_factor |
+------+---------------+----------------------+-------------+
| u1   | localhost     | iOeqf>Mh9:;XD&qn(Hl} |           1 |
| u2   | %.example.com | sXTSAEvw3St-R+_-C3Vb |           1 |
| u3   | %.org         | nEVe%Ctw/U/*Md)Exc7& |           1 |
+------+---------------+----------------------+-------------+
mysql> ALTER USER
       'u1'@'localhost' IDENTIFIED BY RANDOM PASSWORD,
       'u2'@'%.example.com' IDENTIFIED BY RANDOM PASSWORD;
+------+---------------+----------------------+-------------+
| user | host          | generated password   | auth_factor |
+------+---------------+----------------------+-------------+
| u1   | localhost     | Seiei:&cw}8]@3OA64vh |           1 |
| u2   | %.example.com | j@&diTX80l8}(NiHXSae |           1 |
+------+---------------+----------------------+-------------+
mysql> SET PASSWORD FOR 'u3'@'%.org' TO RANDOM;
+------+-------+----------------------+-------------+
| user | host  | generated password   | auth_factor |
+------+-------+----------------------+-------------+
| u3   | %.org | n&cz2xF;P3!U)+]Vw52H |           1 |
+------+-------+----------------------+-------------+
```

Uma declaração `CREATE USER`, `ALTER USER` ou `SET PASSWORD` que gera uma senha aleatória para uma conta é escrita no log binário como uma declaração `CREATE USER` ou `ALTER USER` com uma cláusula `IDENTIFIED WITH auth_plugin AS 'auth_string'`, onde `auth_plugin` é o plugin de autenticação da conta e `'auth_string'` é o valor da senha criptografada da conta.

Se o componente `validate_password` estiver instalado, a política que ele implementa não tem efeito nas senhas geradas. (O objetivo da validação de senhas é ajudar os usuários a criar senhas melhores.)

#### Rastreamento de tentativas de login malsucedidas e bloqueio temporário de contas

A partir do MySQL 8.0.19, os administradores podem configurar contas de usuário de modo que falhas consecutivas de login excessivas causem bloqueio temporário da conta.

“Falha no login” neste contexto significa que o cliente não forneceu uma senha correta durante uma tentativa de conexão. Isso não inclui falhas na conexão por motivos como problemas de usuário desconhecido ou de rede. Para contas que possuem senhas duplas (veja Suporte a Senhas Duplas), qualquer senha da conta é considerada correta.

O número necessário de falhas de login e o tempo de bloqueio são configuráveis por conta, usando as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` das instruções `CREATE USER` e `ALTER USER`. Exemplos:

```
CREATE USER 'u1'@'localhost' IDENTIFIED BY 'password'
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 3;

ALTER USER 'u2'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME UNBOUNDED;
```

Quando ocorrem muitas falhas consecutivas de login, o cliente recebe um erro que parece o seguinte:

```
ERROR 3957 (HY000): Access denied for user user.
Account is blocked for D day(s) (R day(s) remaining)
due to N consecutive failed logins.
```

Use as opções da seguinte forma:

- `FAILED_LOGIN_ATTEMPTS N`

  Esta opção indica se as tentativas de login da conta que especificam uma senha incorreta devem ser rastreadas. O número `N` especifica quantas senhas incorretas consecutivas causam o bloqueio temporário da conta.

- `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

  Esta opção indica por quanto tempo a conta deve ser bloqueada após várias tentativas consecutivas de login com uma senha incorreta. O valor é um número `N` para especificar o número de dias que a conta permanece bloqueada, ou `UNBOUNDED` para especificar que, quando uma conta entra no estado temporariamente bloqueado, a duração desse estado é ilimitada e não termina até que a conta seja desbloqueada. As condições sob as quais o desbloqueio ocorre são descritas mais adiante.

Os valores permitidos de `N` para cada opção estão no intervalo de 0 a 32767. Um valor de 0 desabilita a opção.

O rastreamento de tentativas de login malsucedidas e o bloqueio temporário da conta têm essas características:

- Para que o rastreamento de login falhado e o bloqueio temporário ocorram para uma conta, as opções `FAILED_LOGIN_ATTEMPTS` e `PASSWORD_LOCK_TIME` devem ser diferentes de zero.

- Para `CREATE USER`, se `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME` não for especificado, seu valor padrão implícito é 0 para todas as contas nomeadas pela declaração. Isso significa que o rastreamento de logins falhos e o bloqueio temporário de contas são desativados. (Esses valores padrão implícitos também se aplicam a contas criadas antes da introdução do rastreamento de logins falhos.)

- Para `ALTER USER`, se `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME` não for especificado, seu valor permanece inalterado para todas as contas nomeadas pelo extrato.

- Para que o bloqueio temporário da conta ocorra, as falhas de senha devem ser consecutivas. Qualquer login bem-sucedido que ocorra antes de atingir o valor `FAILED_LOGIN_ATTEMPTS` para falhas de login causa o recálculo do número de falhas. Por exemplo, se `FAILED_LOGIN_ATTEMPTS` é 4 e três falhas consecutivas de senha ocorreram, é necessário mais uma falha para que o bloqueio comece. Mas se o próximo login for bem-sucedido, o número de falhas de login para a conta é recarregado, de modo que quatro falhas consecutivas são novamente necessárias para o bloqueio.

- Uma vez que o bloqueio temporário começar, o login não será bem-sucedido, mesmo com a senha correta, até que a duração do bloqueio tenha passado ou a conta seja desbloqueada por um dos métodos de redefinição de conta listados na discussão a seguir.

Quando o servidor lê as tabelas de concessão, ele inicializa as informações de estado para cada conta, indicando se o rastreamento de login falhado está habilitado, se a conta está temporariamente bloqueada atualmente e quando o bloqueio começou, se for o caso, e o número de falhas antes do bloqueio temporário ocorrer, se a conta não estiver bloqueada.

As informações de estado da conta podem ser redefinidas, o que significa que o contagem de tentativas de login falhas é redefinida e a conta é desbloqueada, se estiver temporariamente bloqueada. Os redefinimentos de conta podem ser globais para todas as contas ou por conta:

- Um reajuste global de todas as contas ocorre para qualquer uma dessas condições:

  - Reinício do servidor.
  - Execução de `FLUSH PRIVILEGES`. (Iniciar o servidor com `--skip-grant-tables` faz com que as tabelas de concessão não sejam lidas, o que desabilita o rastreamento de logins fracassados. Nesse caso, a primeira execução de `FLUSH PRIVILEGES` faz com que o servidor leia as tabelas de concessão e habilite o rastreamento de logins fracassados, além de reiniciar todas as contas.)

- Um reajuste por conta ocorre para qualquer uma dessas condições:

  - Login bem-sucedido para a conta.

  - A duração do bloqueio acaba. Nesse caso, o contagem de tentativas de login malsucedidas é redefinida no momento da próxima tentativa de login.

  - Execução de uma declaração `ALTER USER` para a conta que define qualquer valor para `FAILED_LOGIN_ATTEMPTS` ou `PASSWORD_LOCK_TIME` (ou ambos) (incluindo o valor atual da opção), ou execução de uma declaração `ALTER USER ... UNLOCK` para a conta.

    Outras declarações `ALTER USER` para a conta não têm efeito sobre seu número atual de tentativas de login falhas ou seu estado de bloqueio.

O rastreamento de logins falhos está vinculado à conta de login usada para verificar as credenciais. Se o encaminhamento de proxy estiver em uso, o rastreamento ocorre para o usuário do proxy, e não para o usuário encaminhado. Ou seja, o rastreamento está vinculado à conta indicada por `USER()`, e não à conta indicada por `CURRENT_USER()`. Para obter informações sobre a distinção entre usuários proxy e usuários encaminhados, consulte a Seção 8.2.19, “Usuários Proxy”.
