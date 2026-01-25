#### 6.4.3.2 Opções e Variáveis do Plugin de Validação de Senha

Esta seção descreve as opções, variáveis de sistema e variáveis de status que `validate_password` oferece para permitir que sua operação seja configurada e monitorada.

* [Opções do Plugin de Validação de Senha](validate-password-options-variables.html#validate-password-options "Opções do Plugin de Validação de Senha")
* [Variáveis de Sistema do Plugin de Validação de Senha](validate-password-options-variables.html#validate-password-system-variables "Variáveis de Sistema do Plugin de Validação de Senha")
* [Variáveis de Status do Plugin de Validação de Senha](validate-password-options-variables.html#validate-password-status-variables "Variáveis de Status do Plugin de Validação de Senha")

##### Opções do Plugin de Validação de Senha

Para controlar a ativação do plugin `validate_password`, use esta opção:

* [`--validate-password[=value]`](validate-password-options-variables.html#option_mysqld_validate-password)

  <table frame="box" rules="all" summary="Propriedades para validate-password"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `validate_password` na inicialização. O valor deve ser um dos disponíveis para opções de carregamento de plugin, conforme descrito na [Seção 5.5.1, “Instalando e Desinstalando Plugins”](plugin-loading.html "5.5.1 Instalando e Desinstalando Plugins"). Por exemplo, [`--validate-password=FORCE_PLUS_PERMANENT`](validate-password-options-variables.html#option_mysqld_validate-password) instrui o servidor a carregar o plugin na inicialização e impede que ele seja removido enquanto o servidor estiver em execução.

  Esta opção está disponível somente se o plugin `validate_password` tiver sido previamente registrado com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 Comando INSTALL PLUGIN") ou for carregado com [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add). Consulte a [Seção 6.4.3.1, “Instalação do Plugin de Validação de Senha”](validate-password-installation.html "6.4.3.1 Instalação do Plugin de Validação de Senha").

##### Variáveis de Sistema do Plugin de Validação de Senha

Se o plugin `validate_password` estiver habilitado, ele expõe várias variáveis de sistema que permitem a configuração da verificação de senhas:

```sql
mysql> SHOW VARIABLES LIKE 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password_check_user_name    | OFF    |
| validate_password_dictionary_file    |        |
| validate_password_length             | 8      |
| validate_password_mixed_case_count   | 1      |
| validate_password_number_count       | 1      |
| validate_password_policy             | MEDIUM |
| validate_password_special_char_count | 1      |
+--------------------------------------+--------+
```

Para alterar como as senhas são verificadas, você pode definir essas variáveis de sistema na inicialização do servidor ou em tempo de execução. A lista a seguir descreve o significado de cada variável.

* [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name)

  <table frame="box" rules="all" summary="Propriedades para validate_password_check_user_name"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Introduzido</th> <td>5.7.15</td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_check_user_name</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>OFF</code></td> </tr></tbody></table>

  Define se `validate_password` compara senhas com a parte do user name da conta de usuário efetiva para a sessão atual e as rejeita se houver correspondência. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  Por padrão, [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name) está desabilitado. Esta variável controla a correspondência do user name independentemente do valor de [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy).

  Quando [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name) está habilitado, ele tem os seguintes efeitos:

  + A verificação ocorre em todos os contextos para os quais `validate_password` é invocado, o que inclui o uso de comandos como [`ALTER USER`](alter-user.html "13.7.1.1 Comando ALTER USER") ou [`SET PASSWORD`](set-password.html "13.7.1.7 Comando SET PASSWORD") para alterar a senha do usuário atual, e a invocação de funções como [`PASSWORD()`](encryption-functions.html#function_password) e [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength).

  + Os user names usados para comparação são obtidos dos valores das funções [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) para a sessão atual. Uma implicação é que um usuário que tem privilégios suficientes para definir a senha de outro usuário pode definir a senha para o nome desse usuário, mas não pode definir a senha desse usuário para o nome do usuário que está executando o comando. Por exemplo, `'root'@'localhost'` pode definir a senha para `'jeffrey'@'localhost'` como `'jeffrey'`, mas não pode definir a senha como `'root'`.

  + Apenas a parte do user name dos valores das funções [`USER()`](information-functions.html#function_user) e [`CURRENT_USER()`](information-functions.html#function_current-user) é usada, não a parte do nome do host. Se um user name estiver vazio, nenhuma comparação ocorre.

  + Se uma senha for igual ao user name ou ao seu inverso, ocorre uma correspondência e a senha é rejeitada.

  + A correspondência do user name diferencia maiúsculas de minúsculas (case-sensitive). A senha e os valores do user name são comparados como strings binárias byte a byte.

  + Se uma senha corresponder ao user name, [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength) retorna 0, independentemente de como as outras variáveis de sistema `validate_password` estão definidas.

* [`validate_password_dictionary_file`](validate-password-options-variables.html#sysvar_validate_password_dictionary_file)

  <table frame="box" rules="all" summary="Propriedades para validate_password_dictionary_file"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-dictionary-file=file_name</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_dictionary_file</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O caminho do arquivo de dicionário que `validate_password` usa para verificar senhas. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  Por padrão, esta variável tem um valor vazio e as verificações de dicionário não são realizadas. Para que as verificações de dicionário ocorram, o valor da variável deve ser não vazio. Se o arquivo for nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O conteúdo do arquivo deve estar em letras minúsculas, uma palavra por linha. O conteúdo é tratado como tendo o conjunto de caracteres `utf8`. O tamanho máximo permitido do arquivo é 1MB.

  Para que o arquivo de dicionário seja usado durante a verificação de senha, a política de senha deve ser definida como 2 (`STRONG`); consulte a descrição da variável de sistema [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy). Assumindo que isso seja verdade, cada substring da senha de comprimento 4 a 100 é comparada com as palavras no arquivo de dicionário. Qualquer correspondência faz com que a senha seja rejeitada. As comparações não diferenciam maiúsculas de minúsculas.

  Para [`VALIDATE_PASSWORD_STRENGTH()`](encryption-functions.html#function_validate-password-strength), a senha é verificada contra todas as políticas, incluindo `STRONG`, portanto, a avaliação de força inclui a verificação de dicionário, independentemente do valor de [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy).

  [`validate_password_dictionary_file`](validate-password-options-variables.html#sysvar_validate_password_dictionary_file) pode ser definido em tempo de execução e a atribuição de um valor faz com que o arquivo nomeado seja lido sem a necessidade de reiniciar o servidor.

* [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length)

  <table frame="box" rules="all" summary="Propriedades para validate_password_length"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-length=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_length</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>8</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr></tbody></table>

  O número mínimo de caracteres que `validate_password` exige que as senhas tenham. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  O valor mínimo de [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length) é uma função de várias outras variáveis de sistema relacionadas. O valor não pode ser definido como menor do que o valor desta expressão:

  ```sql
  validate_password_number_count
  + validate_password_special_char_count
  + (2 * validate_password_mixed_case_count)
  ```

  Se `validate_password` ajustar o valor de [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length) devido à restrição precedente, ele gravará uma mensagem no error log.

* [`validate_password_mixed_case_count`](validate-password-options-variables.html#sysvar_validate_password_mixed_case_count)

  <table frame="box" rules="all" summary="Propriedades para validate_password_mixed_case_count"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-mixed-case-count=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_mixed_case_count</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr></tbody></table>

  O número mínimo de caracteres minúsculos e maiúsculos que `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  Para um determinado valor de [`validate_password_mixed_case_count`](validate-password-options-variables.html#sysvar_validate_password_mixed_case_count), a senha deve ter esse número de caracteres minúsculos e esse número de caracteres maiúsculos.

* [`validate_password_number_count`](validate-password-options-variables.html#sysvar_validate_password_number_count)

  <table frame="box" rules="all" summary="Propriedades para validate_password_number_count"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-number-count=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_number_count</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr></tbody></table>

  O número mínimo de caracteres numéricos (dígitos) que `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível a menos que `validate_password` esteja instalado.

* [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy)

  <table frame="box" rules="all" summary="Propriedades para validate_password_policy"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-policy=value</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_policy</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>0</code></p><p><code>1</code></p><p><code>2</code></p></td> </tr></tbody></table>

  A política de senha imposta por `validate_password`. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy) afeta como `validate_password` usa suas outras variáveis de sistema de definição de política, exceto para a verificação de senhas contra user names, que é controlada independentemente por [`validate_password_check_user_name`](validate-password-options-variables.html#sysvar_validate_password_check_user_name).

  O valor de [`validate_password_policy`](validate-password-options-variables.html#sysvar_validate_password_policy) pode ser especificado usando os valores numéricos 0, 1, 2, ou os valores simbólicos correspondentes `LOW`, `MEDIUM`, `STRONG`. A tabela a seguir descreve os testes realizados para cada política. Para o teste de comprimento, o comprimento exigido é o valor da variável de sistema [`validate_password_length`](validate-password-options-variables.html#sysvar_validate_password_length). Da mesma forma, os valores exigidos para os outros testes são dados por outras variáveis `validate_password_xxx`.

  <table summary="Políticas de senha impostas pelo plugin validate_password e os testes realizados para cada política."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Política</th> <th>Testes Realizados</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>LOW</code></td> <td>Comprimento</td> </tr><tr> <td><code>1</code> ou <code>MEDIUM</code></td> <td>Comprimento; caracteres numéricos, minúsculos/maiúsculos e especiais</td> </tr><tr> <td><code>2</code> ou <code>STRONG</code></td> <td>Comprimento; caracteres numéricos, minúsculos/maiúsculos e especiais; arquivo de dicionário</td> </tr></tbody></table>

* [`validate_password_special_char_count`](validate-password-options-variables.html#sysvar_validate_password_special_char_count)

  <table frame="box" rules="all" summary="Propriedades para validate_password_special_char_count"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-special-char-count=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password_special_char_count</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr></tbody></table>

  O número mínimo de caracteres não alfanuméricos que `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível a menos que `validate_password` esteja instalado.

##### Variáveis de Status do Plugin de Validação de Senha

Se o plugin `validate_password` estiver habilitado, ele expõe variáveis de status que fornecem informações operacionais:

```sql
mysql> SHOW STATUS LIKE 'validate_password%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password_dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

A lista a seguir descreve o significado de cada variável de status.

* [`validate_password_dictionary_file_last_parsed`](validate-password-options-variables.html#statvar_validate_password_dictionary_file_last_parsed)

  Quando o arquivo de dicionário foi analisado pela última vez (last parsed).

* [`validate_password_dictionary_file_words_count`](validate-password-options-variables.html#statvar_validate_password_dictionary_file_words_count)

  O número de palavras lidas do arquivo de dicionário.