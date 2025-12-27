### 8.4.3 O Componente de Validação de Senhas

O componente `validate_password` serve para melhorar a segurança, exigindo senhas de contas e permitindo o teste de força de senhas potenciais. Este componente expõe variáveis de sistema que permitem configurar a política de senha e variáveis de status para monitoramento do componente.

O componente `validate_password` implementa essas capacidades:

* Para instruções SQL que atribuem uma senha fornecida como valor em texto claro, `validate_password` verifica a senha contra a política de senha atual e rejeita a senha se ela for fraca (a instrução retorna um erro `ER_NOT_VALID_PASSWORD`). Isso se aplica às instruções `ALTER USER`, `CREATE USER` e `SET PASSWORD`.
* Para as instruções `CREATE USER`, `validate_password` exige que uma senha seja fornecida e que ela satisfaça a política de senha. Isso é verdadeiro mesmo que uma conta seja bloqueada inicialmente, pois caso contrário, desbloquear a conta mais tarde faria com que ela se tornasse acessível sem uma senha que satisfaça a política.
* `validate_password` implementa uma função SQL `VALIDATE_PASSWORD_STRENGTH()` que avalia a força de senhas potenciais. Esta função recebe um argumento de senha e retorna um inteiro de 0 (fraco) a 100 (forte).

::: info Nota

Para instruções que atribuem ou modificam senhas de contas ( `ALTER USER`, `CREATE USER` e `SET PASSWORD`), as capacidades de `validate_password` descritas aqui se aplicam apenas a contas que usam um plugin de autenticação que armazena credenciais internamente no MySQL. Para contas que usam plugins que realizam autenticação contra um sistema de credenciais externo ao MySQL, a gestão de senhas deve ser realizada externamente contra esse sistema também. Para mais informações sobre armazenamento de credenciais internas, consulte a Seção 8.2.15, “Gestão de Senhas”.

A restrição anterior não se aplica ao uso da função `VALIDATE_PASSWORD_STRENGTH()` porque ela não afeta diretamente as contas.

:::

Exemplos:

* `validate_password` verifica a senha em texto claro na seguinte declaração. De acordo com a política de senha padrão, que exige que as senhas tenham pelo menos 8 caracteres, a senha é fraca e a declaração produz um erro:

  ```
  mysql> ALTER USER USER() IDENTIFIED BY 'abc';
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```
* Senhas especificadas como valores hash não são verificadas porque o valor original da senha não está disponível para verificação:

  ```
  mysql> ALTER USER 'jeffrey'@'localhost'
         IDENTIFIED WITH mysql_native_password
         AS '*0D3CED9BEC10A777AEC23CCC353A8C08A633045E';
  Query OK, 0 rows affected (0.01 sec)
  ```
* Esta declaração de criação de conta falha, mesmo que a conta seja bloqueada inicialmente, porque não inclui uma senha que satisfaça a política de senha atual:

  ```
  mysql> CREATE USER 'juanita'@'localhost' ACCOUNT LOCK;
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```
* Para verificar uma senha, use a função `VALIDATE_PASSWORD_STRENGTH()`:

  ```
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('weak');
  +------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('weak') |
  +------------------------------------+
  |                                 25 |
  +------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('lessweak$_@123');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('lessweak$_@123') |
  +----------------------------------------------+
  |                                           50 |
  +----------------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!') |
  +----------------------------------------------+
  |                                          100 |
  +----------------------------------------------+
  ```

Para configurar a verificação de senha, modifique as variáveis de sistema com nomes na forma `validate_password.xxx`; esses são os parâmetros que controlam a política de senha. Veja a Seção 8.4.3.2, “Opções e Variáveis de Validação de Senhas”.

Se `validate_password` não estiver instalado, as variáveis de sistema `validate_password.xxx` não estão disponíveis, as senhas nas declarações não são verificadas e a função `VALIDATE_PASSWORD_STRENGTH()` sempre retorna 0. Por exemplo, sem o plugin instalado, contas podem ser atribuídas senhas com menos de 8 caracteres ou sem senha nenhuma.

Supondo que `validate_password` esteja instalado, ele implementa três níveis de verificação de senha: `LOW`, `MEDIUM` e `STRONG`. O padrão é `MEDIUM`; para alterar isso, modifique o valor de `validate_password.policy`. As políticas implementam testes de senha cada vez mais rigorosos. As seguintes descrições referem-se aos valores padrão dos parâmetros, que podem ser modificados alterando as variáveis de sistema apropriadas.

* A política `LOW` testa apenas o comprimento da senha. As senhas devem ter pelo menos 8 caracteres. Para alterar esse comprimento, modifique `validate_password.length`.
* A política `MEDIUM` adiciona as condições de que as senhas devem conter pelo menos 1 caractere numérico, 1 caractere minúsculo, 1 caractere maiúsculo e 1 caractere especial (não alfanumérico). Para alterar esses valores, modifique `validate_password.number_count`, `validate_password.mixed_case_count` e `validate_password.special_char_count`.
* A política `STRONG` adiciona a condição de que subdivisões de senha de comprimento igual ou superior a 4 caracteres não devem corresponder a palavras no arquivo de dicionário, se um tiver sido especificado. Para especificar o arquivo de dicionário, modifique `validate_password.dictionary_file`.

Além disso, `validate_password` suporta a capacidade de rejeitar senhas que correspondem à parte do nome de usuário da conta de usuário efetiva para a sessão atual, seja para frente ou para trás. Para fornecer controle sobre essa capacidade, `validate_password` expõe uma variável de sistema `validate_password.check_user_name`, que está habilitada por padrão.