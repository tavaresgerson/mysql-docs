#### 6.1.2.4 Hash de senha no MySQL

Nota

As informações nesta seção se aplicam apenas antes do MySQL 5.7.5 e apenas para contas que utilizam os plugins de autenticação `mysql_native_password` ou `mysql_old_password`. O suporte para hashes de senhas anteriores a 4.1 foi removido no MySQL 5.7.5. Isso inclui a remoção do plugin de autenticação `mysql_old_password` e da função `OLD_PASSWORD()`. Além disso, `secure_auth` não pode ser desativado e `old_passwords` não pode ser definido como 1.

A partir do MySQL 5.7.5, apenas as informações sobre os hashes de senha 4.1 e o plugin de autenticação `mysql_native_password` permanecem relevantes.

O MySQL lista as contas de usuário na tabela `user` do banco de dados `mysql`. Cada conta do MySQL pode ser atribuída uma senha, embora a tabela `user` não armazene a versão em texto claro da senha, mas sim um valor de hash calculado a partir dela.

O MySQL utiliza senhas em duas fases da comunicação cliente/servidor:

- Quando um cliente tenta se conectar ao servidor, há uma etapa de autenticação inicial na qual o cliente deve apresentar uma senha que tenha um valor de hash correspondente ao valor de hash armazenado na tabela `user` para a conta que o cliente deseja usar.

- Após a conexão do cliente, ele pode (se tiver privilégios suficientes) definir ou alterar o hash da senha para as contas listadas na tabela `user`. O cliente pode fazer isso usando a função `PASSWORD()` para gerar um hash de senha ou usando uma declaração de geração de senha (`CREATE USER`, `GRANT` ou `SET PASSWORD`).

Em outras palavras, o servidor *verifica* os valores de hash durante a autenticação quando um cliente tenta se conectar pela primeira vez. O servidor *gera* valores de hash se um cliente conectado invoca a função `PASSWORD()` ou usa uma declaração de geração de senha para definir ou alterar uma senha.

Os métodos de hashing de senhas no MySQL têm a história descrita a seguir. Essas mudanças são ilustradas pelas alterações no resultado da função `PASSWORD()`, que calcula os valores de hash de senhas, e na estrutura da tabela `user`, onde as senhas são armazenadas.

##### O Método de Hashing Original (Pré-4.1)

O método de hashing original produziu uma string de 16 bytes. Esses hashes têm a seguinte aparência:

```sql
mysql> SELECT PASSWORD('mypass');
+--------------------+
| PASSWORD('mypass') |
+--------------------+
| 6f8c114b58f2ce9e   |
+--------------------+
```

Para armazenar senhas de contas, a coluna `Password` da tabela `user` tinha, nesse momento, 16 bytes de comprimento.

##### O Método de Hashing 4.1

O MySQL 4.1 introduziu a criptografia de senhas, que proporcionou uma melhor segurança e reduziu o risco de senhas serem interceptadas. Houve vários aspectos dessa mudança:

- Diferentes formatos de valores de senha produzidos pela função [`PASSWORD()`](https://docs.python.org/3/library/functions.html#function_password)

- Ampliação da coluna `Senha`

- Controle do método de hashing padrão

- Controle dos métodos de hashing permitidos para clientes que tentam se conectar ao servidor

As mudanças no MySQL 4.1 ocorreram em duas etapas:

- O MySQL 4.1.0 utilizava uma versão preliminar do método de hashing 4.1. Esse método teve curta duração e a discussão a seguir não diz mais nada a respeito.

- No MySQL 4.1.1, o método de hashing foi modificado para gerar um valor de hash mais longo de 41 bytes:

  ```sql
  mysql> SELECT PASSWORD('mypass');
  +-------------------------------------------+
  | PASSWORD('mypass')                        |
  +-------------------------------------------+
  | *6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4 |
  +-------------------------------------------+
  ```

  O formato de hash de senha mais longo tem melhores propriedades criptográficas, e a autenticação do cliente baseada em hashes longos é mais segura do que a baseada nos hashes mais antigos e curtos.

  Para acomodar hashes de senhas mais longos, a coluna `Password` na tabela `user` foi alterada para ter 41 bytes, seu comprimento atual.

  Uma coluna "Senha" ampliada pode armazenar hashes de senhas nos formatos pré-4.1 e 4.1. O formato de qualquer valor de hash dado pode ser determinado de duas maneiras:

  - O comprimento: os hashes pré-4.1 são de 41 e 16 bytes, respectivamente.

  - Os hashes de senha no formato 4.1 sempre começam com o caractere `*`, enquanto as senhas no formato anterior ao 4.1 nunca o fazem.

  Para permitir a geração explícita de hashes de senhas anteriores à versão 4.1, foram feitas duas alterações adicionais:

  - A função `OLD_PASSWORD()` foi adicionada, que retorna valores de hash no formato de 16 bytes.

  - Para fins de compatibilidade, a variável de sistema `old_passwords` foi adicionada, para permitir que DBA e aplicativos controlem o método de hashing. O valor padrão de `old_passwords` de 0 faz com que o hashing use o método 4.1 (valores de hash de 41 bytes), mas definir `old_passwords=1` faz com que o hashing use o método pré-4.1. Neste caso, `PASSWORD()` produz valores de 16 bytes e é equivalente a `OLD_PASSWORD()`

  Para permitir que os administradores de banco de dados controlem como os clientes podem se conectar, a variável de sistema `secure_auth` foi adicionada. Iniciar o servidor com essa variável desabilitada ou habilitada permite ou proíbe que os clientes se conectem usando o método de hashing de senha anterior à versão 4.1. Antes do MySQL 5.6.5, `secure_auth` está desabilitado por padrão. A partir do 5.6.5, `secure_auth` está habilitado por padrão para promover uma configuração padrão mais segura. Os administradores de banco de dados podem desabilitá-lo a seu critério, mas isso não é recomendado, e os hashes de senha anteriores à versão 4.1 estão desatualizados e devem ser evitados. (Para instruções de atualização de conta, consulte Seção 6.4.1.3, “Migrando para fora do hashing de senha anterior à versão 4.1 e do plugin mysql\_old\_password”.)

  Além disso, o cliente **mysql** suporta a opção `--secure-auth` (mysql-command-options.html#option\_mysql\_secure-auth), que é análoga a `secure_auth` (server-system-variables.html#sysvar\_secure\_auth), mas do lado do cliente. Pode ser usada para impedir conexões a contas menos seguras que utilizam hashing de senhas anterior a 4.1. Esta opção está desativada por padrão antes do MySQL 5.6.7, mas é ativada posteriormente.

##### Problemas de compatibilidade relacionados aos métodos de hashing

O aumento da coluna `Password` no MySQL 4.1 de 16 bytes para 41 bytes afeta as operações de instalação ou atualização da seguinte forma:

- Se você realizar uma nova instalação do MySQL, a coluna `Password` será automaticamente feita com 41 bytes de comprimento.

- As atualizações de MySQL 4.1 ou versões posteriores para as versões atuais do MySQL não devem causar problemas em relação à coluna `Password`, pois ambas as versões usam o mesmo comprimento da coluna e o mesmo método de hashing de senha.

- Para atualizações de uma versão anterior à 4.1 para a 4.1 ou versões posteriores, você deve atualizar as tabelas do sistema após a atualização. (Consulte Seção 4.4.7, “mysql\_upgrade — Verificar e atualizar tabelas do MySQL”).

O método de hashing 4.1 é entendido apenas pelos servidores e clientes do MySQL 4.1 (e superiores) e pode resultar em alguns problemas de compatibilidade. Um cliente 4.1 ou superior pode se conectar a um servidor pré-4.1, porque o cliente entende tanto o método de hashing de senha pré-4.1 quanto o 4.1. No entanto, um cliente pré-4.1 que tente se conectar a um servidor 4.1 ou superior pode encontrar dificuldades. Por exemplo, um cliente **mysql** 4.0 pode falhar com a seguinte mensagem de erro:

```sql
$> mysql -h localhost -u root
Client does not support authentication protocol requested
by server; consider upgrading MySQL client
```

A discussão a seguir descreve as diferenças entre os métodos de hashing pré-4.1 e 4.1, e o que você deve fazer se atualizar seu servidor, mas precisar manter a compatibilidade reversa com clientes pré-4.1. (No entanto, permitir conexões por clientes antigos não é recomendado e deve ser evitado, se possível.) Esta informação é de particular importância para programadores PHP que migram bancos de dados MySQL de versões anteriores a 4.1 para 4.1 ou superior.

As diferenças entre os hashes de senhas curtos e longos são relevantes tanto para a forma como o servidor usa as senhas durante a autenticação quanto para a forma como ele gera hashes de senhas para clientes conectados que realizam operações de alteração de senhas.

A forma como o servidor usa os hashes de senha durante a autenticação é afetada pela largura da coluna `Password`:

- Se a coluna for curta, será usada apenas a autenticação de hash curto.

- Se a coluna for longa, ela pode armazenar hashes curtos ou longos, e o servidor pode usar qualquer um desses formatos:

  - Os clientes anteriores à versão 4.1 podem se conectar, mas, como eles conhecem apenas o método de hashing anterior à versão 4.1, eles podem autenticar apenas usando contas que têm hashes curtos.

  - Clientes da versão 4.1 e posteriores podem autenticar-se usando contas que tenham hashes curtos ou longos.

Mesmo para contas de curto hash, o processo de autenticação é, na verdade, um pouco mais seguro para clientes da versão 4.1 e versões posteriores do que para clientes mais antigos. Em termos de segurança, o gradiente de menos para mais seguro é:

- Cliente pré-4.1 autenticado com hash de senha curta
- 4.1 ou versão posterior do cliente autenticado com hash de senha curta
- 4.1 ou versão posterior do cliente autenticado com senha longa

A forma como o servidor gera hashes de senhas para clientes conectados é afetada pela largura da coluna `Password` e pela variável de sistema `old_passwords`. Um servidor da versão 4.1 ou posterior gera hashes longos apenas se certas condições forem atendidas: a coluna `Password` deve ser suficientemente larga para armazenar valores longos e `old_passwords` não deve ser definido como 1.

Essas condições se aplicam da seguinte forma:

- A coluna `Senha` deve ser suficientemente larga para armazenar hashes longos (41 bytes). Se a coluna não tiver sido atualizada e ainda tiver o tamanho pré-4.1 de 16 bytes, o servidor percebe que os hashes longos não cabem nela e gera apenas hashes curtos quando um cliente executa operações de alteração de senha usando a função `PASSWORD()` ou uma instrução de geração de senha. Esse é o comportamento que ocorre se você tiver atualizado uma versão do MySQL anterior a 4.1 para 4.1 ou posterior, mas ainda não tiver executado o programa **mysql\_upgrade** para ampliar a coluna `Password`.

- Se a coluna `Senha` for larga, ela pode armazenar hashes de senhas curtos ou longos. Nesse caso, a função [`PASSWORD()`](https://docs.djangoproject.com/en/3.2/ref/functions/encryption/password/) e as declarações de geração de senha geram hashes longos, a menos que o servidor tenha sido iniciado com a variável de sistema [`old_passwords`](https://docs.djangoproject.com/en/3.2/ref/server-system-variables/#sysvar_old_passwords) definida como 1 para forçar o servidor a gerar hashes de senha curtos.

O propósito da variável de sistema `old_passwords` é permitir a compatibilidade reversa com clientes anteriores à versão 4.1 em circunstâncias em que o servidor, de outra forma, geraria hashes de senhas longos. A opção não afeta a autenticação (clientes da versão 4.1 e posteriores ainda podem usar contas que possuem hashes de senhas longos), mas impede a criação de um hash de senha longo na tabela `user` como resultado de uma operação de alteração de senha. Se isso fosse permitido, a conta não poderia mais ser usada por clientes anteriores à versão 4.1. Com `old_passwords` desativado, o seguinte cenário indesejável é possível:

- Um cliente antigo anterior à versão 4.1 se conecta a uma conta que tem um hash de senha curto.

- O cliente altera sua própria senha. Com `old_passwords` desativado, isso resulta na conta ter um hash de senha longo.

- Na próxima vez que o antigo cliente tentar se conectar à conta, ele não conseguirá, porque a conta tem um hash de senha longo que exige o método de hashing 4.1 durante a autenticação. (Uma vez que uma conta tenha um hash de senha longo na tabela de usuários, apenas clientes 4.1 e versões posteriores podem autenticá-la, porque os clientes anteriores a 4.1 não entendem hashes longos.)

Esse cenário ilustra que, se você precisa suportar clientes mais antigos anteriores à versão 4.1, é problemático rodar um servidor da versão 4.1 ou superior sem que `old_passwords` esteja definido como 1. Ao rodar o servidor com `old_passwords=1`, as operações de alteração de senha não geram hashes de senha longos e, portanto, não fazem com que as contas se tornem inacessíveis para clientes mais antigos. (Esses clientes não podem inadvertidamente se bloquear ao alterar sua senha e acabar com um hash de senha longo.)

A desvantagem de `old_passwords=1` é que quaisquer senhas criadas ou alteradas usam hashes curtos, mesmo para clientes a partir da versão 4.1. Assim, você perde a segurança adicional fornecida pelos hashes de senhas longas. Para criar uma conta que tenha um hash longo (por exemplo, para uso por clientes da versão 4.1) ou para alterar uma conta existente para usar um hash de senha longo, um administrador pode definir o valor da sessão de `old_passwords` para 0, mantendo o valor global definido como 1:

```sql
mysql> SET @@SESSION.old_passwords = 0;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@SESSION.old_passwords, @@GLOBAL.old_passwords;
+-------------------------+------------------------+
| @@SESSION.old_passwords | @@GLOBAL.old_passwords |
+-------------------------+------------------------+
|                       0 |                      1 |
+-------------------------+------------------------+
1 row in set (0.00 sec)

mysql> CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'newpass';
Query OK, 0 rows affected (0.03 sec)

mysql> SET PASSWORD FOR 'existinguser'@'localhost' = PASSWORD('existingpass');
Query OK, 0 rows affected (0.00 sec)
```

Os seguintes cenários são possíveis no MySQL 4.1 ou posterior. Os fatores são se a coluna `Password` é curta ou longa e, se for longa, se o servidor foi iniciado com o `old_passwords` habilitado ou desabilitado.

**Cenário 1:** Coluna `Senha` curta na tabela de usuários:

- Apenas hashes curtos podem ser armazenados na coluna "Senha".

- O servidor usa apenas hashes curtos durante a autenticação do cliente.

- Para clientes conectados, as operações de geração de hashes de senha que envolvem a função [`PASSWORD()`](https://docs.djangoproject.com/en/3.2/ref/cryptography/functions/password/) ou declarações de geração de senha usam hashes curtos exclusivamente. Qualquer alteração na senha de uma conta resulta em um hash de senha curto nessa conta.

- O valor de `old_passwords` é irrelevante, pois, com uma coluna `Password` curta, o servidor gera apenas hashes de senha curtos de qualquer forma.

Esse cenário ocorre quando uma instalação pré-4.1 do MySQL é atualizada para 4.1 ou uma versão posterior, mas o **mysql\_upgrade** não é executado para atualizar as tabelas do sistema no banco de dados `mysql`. (Essa não é uma configuração recomendada, pois não permite o uso de hashing de senha mais seguro do 4.1.)

**Cenário 2:** Coluna `Senha` longa; o servidor foi iniciado com `old_passwords=1`:

- Códigos de hash curtos ou longos podem ser armazenados na coluna "Senha".

- Clientes da versão 4.1 e posteriores podem autenticar contas que tenham hashes curtos ou longos.

- Os clientes anteriores à versão 4.1 podem autenticar apenas para contas que possuem hashes curtos.

- Para clientes conectados, as operações de geração de hashes de senha que envolvem a função [`PASSWORD()`](https://docs.djangoproject.com/en/3.2/ref/cryptography/functions/password/) ou declarações de geração de senha usam hashes curtos exclusivamente. Qualquer alteração na senha de uma conta resulta em um hash de senha curto nessa conta.

Nesse cenário, as contas recém-criadas têm hashes de senhas curtos porque `old_passwords=1` impede a geração de hashes longos. Além disso, se você criar uma conta com um hash longo antes de definir `old_passwords` para 1, alterar a senha da conta enquanto `old_passwords=1` resulta na conta receber uma senha curta, fazendo com que ela perca os benefícios de segurança de um hash mais longo.

Para criar uma nova conta com um hash de senha longo ou para alterar a senha de qualquer conta existente para usar um hash longo, primeiro defina o valor da sessão de `old_passwords` para 0, mantendo o valor global definido para 1, conforme descrito anteriormente.

Nesse cenário, o servidor tem uma coluna `Password` atualizada, mas está rodando com o método padrão de hashing de senha definido para gerar valores de hash anteriores ao 4.1. Essa não é uma configuração recomendada, mas pode ser útil durante um período de transição em que clientes e senhas anteriores ao 4.1 sejam atualizados para o 4.1 ou versões posteriores. Quando isso for feito, é preferível rodar o servidor com `old_passwords=0` e `secure_auth=1`.

**Cenário 3:** Coluna `Senha` longa; o servidor foi iniciado com `old_passwords=0`:

- Códigos de hash curtos ou longos podem ser armazenados na coluna "Senha".

- Clientes da versão 4.1 e posteriores podem autenticar-se usando contas que tenham hashes curtos ou longos.

- Os clientes anteriores à versão 4.1 podem autenticar apenas usando contas que tenham hashes curtos.

- Para clientes conectados, as operações de geração de hashes de senha que envolvem a função [`PASSWORD()`](https://docs.djangoproject.com/en/3.2/ref/cryptography/functions/password/) ou declarações de geração de senha usam hashes longos exclusivamente. Uma alteração na senha de uma conta resulta naquela conta ter um hash de senha longo.

Como mencionado anteriormente, um perigo nesse cenário é que contas com um hash de senha curto podem se tornar inacessíveis para clientes anteriores à versão 4.1. Uma alteração na senha de uma conta feita usando a função `PASSWORD()` ou uma declaração de geração de senha resulta na conta receber um hash de senha longo. A partir desse momento, nenhum cliente anterior à versão 4.1 pode se conectar ao servidor usando essa conta. O cliente deve ser atualizado para a versão 4.1 ou posterior.

Se esse for um problema, você pode alterar uma senha de uma maneira especial. Por exemplo, normalmente você usa `SET PASSWORD` da seguinte forma para alterar a senha de uma conta:

```sql
SET PASSWORD FOR 'some_user'@'some_host' = PASSWORD('password');
```

Para alterar a senha, mas criar um hash curto, use a função `OLD_PASSWORD()`:

```sql
SET PASSWORD FOR 'some_user'@'some_host' = OLD_PASSWORD('password');
```

`OLD_PASSWORD()` é útil para situações em que você deseja gerar explicitamente um hash curto.

As desvantagens para cada um dos cenários anteriores podem ser resumidas da seguinte forma:

No cenário 1, você não pode aproveitar hashes mais longos que oferecem uma autenticação mais segura.

No cenário 2, `old_passwords=1` impede que contas com hashes curtos se tornem inacessíveis, mas as operações de alteração de senha fazem com que contas com hashes longos retornem a hashes curtos, a menos que você tome cuidado para alterar o valor da sessão de `old_passwords` para 0 primeiro.

No cenário 3, as contas com hashes curtos tornam-se inacessíveis para clientes anteriores à versão 4.1 se você alterar suas senhas sem usar explicitamente `OLD_PASSWORD()`.

A melhor maneira de evitar problemas de compatibilidade relacionados a hashes de senhas curtos é não usá-los:

- Atualize todos os programas do cliente para o MySQL 4.1 ou posterior.

- Execute o servidor com `old_passwords=0`.

- Reinicie a senha de qualquer conta com um hash de senha curto para usar um hash de senha longo.

- Para maior segurança, execute o servidor com `secure_auth=1`.
