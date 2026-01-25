### 6.4.3 O Plugin de Validação de Senha

[6.4.3.1 Instalação do Plugin de Validação de Senha](validate-password-installation.html)

[6.4.3.2 Opções e Variáveis do Plugin de Validação de Senha](validate-password-options-variables.html)

O plugin `validate_password` serve para melhorar a segurança exigindo senhas de contas e permitindo o teste de força de senhas potenciais. Este plugin expõe um conjunto de System Variables que permitem configurar a política de senha.

O plugin `validate_password` implementa estas capacidades:

* Para instruções SQL que atribuem uma senha fornecida como um valor em *cleartext*, o `validate_password` verifica a senha em relação à política de senha atual e rejeita a senha se ela for fraca (a instrução retorna um erro [`ER_NOT_VALID_PASSWORD`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_not_valid_password)). Isso se aplica às instruções [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), e [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), e senhas fornecidas como argumentos para a função [`PASSWORD()`](encryption-functions.html#function_password).

* Para instruções [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), o `validate_password` exige que uma senha seja fornecida, e que ela satisfaça a política de senha. Isso é verdade mesmo que uma conta seja inicialmente bloqueada, pois, caso contrário, o desbloqueio posterior da conta faria com que ela se tornasse acessível sem uma senha que satisfaça a política.

* O `validate_password` implementa uma função SQL [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) que avalia a força de senhas potenciais. Esta função recebe um argumento de senha e retorna um inteiro de 0 (fraca) a 100 (forte).

Note

Para instruções que atribuem, modificam ou geram senhas de contas ([`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), e [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"); instruções que usam [`PASSWORD()`](encryption-functions.html#function_password)), as capacidades do `validate_password` descritas aqui aplicam-se apenas a contas que usam um Authentication Plugin que armazena credenciais internamente no MySQL. Para contas que usam Plugins que realizam autenticação em relação a um sistema de credenciais externo ao MySQL, o gerenciamento de senhas também deve ser tratado externamente contra esse sistema. Para obter mais informações sobre o armazenamento interno de credenciais, consulte [Section 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management").

A restrição anterior não se aplica ao uso da função [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) porque ela não afeta as contas diretamente.

Exemplos:

* O `validate_password` verifica a senha em *cleartext* na instrução a seguir. Sob a política de senha padrão, que exige que as senhas tenham pelo menos 8 caracteres, a senha é fraca e a instrução produz um erro:

  ```sql
  mysql> ALTER USER USER() IDENTIFIED BY 'abc';
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Senhas especificadas como valores *hashed* (com *hash*) não são verificadas porque o valor original da senha não está disponível para verificação:

  ```sql
  mysql> ALTER USER 'jeffrey'@'localhost'
         IDENTIFIED WITH mysql_native_password
         AS '*0D3CED9BEC10A777AEC23CCC353A8C08A633045E';
  Query OK, 0 rows affected (0.01 sec)
  ```

* Esta instrução de criação de conta falha, embora a conta seja inicialmente bloqueada, porque não inclui uma senha que satisfaça a política de senha atual:

  ```sql
  mysql> CREATE USER 'juanita'@'localhost' ACCOUNT LOCK;
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Para verificar uma senha, use a função [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength):

  ```sql
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

Para configurar a verificação de senha, modifique as System Variables que possuem nomes no formato `validate_password_xxx`; estes são os parâmetros que controlam a política de senha. Consulte [Section 6.4.3.2, “Password Validation Plugin Options and Variables”](validate-password-options-variables.html "6.4.3.2 Password Validation Plugin Options and Variables").

Se o `validate_password` não estiver instalado, as System Variables `validate_password_xxx` não estarão disponíveis, as senhas nas instruções não serão verificadas e a função [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) sempre retornará 0. Por exemplo, sem o Plugin instalado, as contas podem ter senhas atribuídas com menos de 8 caracteres, ou nenhuma senha.

Assumindo que o `validate_password` esteja instalado, ele implementa três níveis de verificação de senha: `LOW`, `MEDIUM` e `STRONG`. O padrão é `MEDIUM`; para alterar isso, modifique o valor de [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy). As políticas implementam testes de senha progressivamente mais rigorosos. As seguintes descrições referem-se aos valores padrão dos parâmetros, que podem ser modificados alterando as System Variables apropriadas.

* A política `LOW` testa apenas o comprimento da senha (*length*). As senhas devem ter pelo menos 8 caracteres de comprimento. Para alterar esse comprimento, modifique [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length).

* A política `MEDIUM` adiciona as condições de que as senhas devem conter pelo menos 1 caractere numérico, 1 caractere minúsculo (*lowercase*), 1 caractere maiúsculo (*uppercase*) e 1 caractere especial (não alfanumérico). Para alterar esses valores, modifique [`validate_password_number_count`](validate-password-options-variables.html#sysvar_validate_password_number_count), [`validate_password_mixed_case_count`](validate-password-options-variables.html#sysvar_validate_password_mixed_case_count) e [`validate_password_special_char_count`](validate-password-options-variables.html#sysvar_validate_password_special_char_count).

* A política `STRONG` adiciona a condição de que substrings de senha de 4 ou mais caracteres não devem corresponder a palavras no arquivo de dicionário, se um tiver sido especificado. Para especificar o arquivo de dicionário, modifique [`validate_password_dictionary_file`](validate-password-options-variables.html#sysvar_validate_password_dictionary_file).

Além disso, a partir do MySQL 5.7.15, o `validate_password` suporta a capacidade de rejeitar senhas que correspondam à parte do nome de usuário (*user name*) da conta de usuário efetiva para a sessão atual, seja de frente ou invertida. Para fornecer controle sobre essa capacidade, o `validate_password` expõe uma System Variable [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name), que está habilitada por padrão.
