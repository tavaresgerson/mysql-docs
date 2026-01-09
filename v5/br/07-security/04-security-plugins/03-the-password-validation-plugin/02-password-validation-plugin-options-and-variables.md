#### 6.4.3.2 Opções e variáveis do plugin de validação de senha

Esta seção descreve as opções, variáveis de sistema e variáveis de status que o `validate_password` oferece para permitir que sua operação seja configurada e monitorada.

- Opções do Plugin de Validação de Senha
- Variáveis do sistema do plugin de validação de senha
- Variáveis de status do plugin de validação de senha

##### Opções do Plugin de Validação de Senha

Para controlar a ativação do plugin `validate_password`, use esta opção:

- `--validate-password[=valor]`

  <table frame="box" rules="all" summary="Propriedades para validar senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `validate_password` ao iniciar. O valor deve ser um dos disponíveis para as opções de carregamento de plugins, conforme descrito em Seção 5.5.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--validate-password=FORCE_PLUS_PERMANENT` indica ao servidor que carregue o plugin ao iniciar e impede que ele seja removido enquanto o servidor estiver em execução.

  Esta opção está disponível apenas se o plugin `validate_password` tiver sido registrado anteriormente com `INSTALE PLUGIN` ou estiver carregado com \`--plugin-load-add]\(server-options.html#option\_mysqld\_plugin-load-add). Veja Seção 6.4.3.1, “Instalação do Plugin de Validação de Senhas”.

##### Plugin de validação de senha Variáveis do sistema

Se o plugin `validate_password` estiver ativado, ele exibe várias variáveis de sistema que permitem a configuração da verificação de senha:

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

Para alterar a forma como as senhas são verificadas, você pode definir essas variáveis de sistema no início ou durante o funcionamento do servidor. A lista a seguir descreve o significado de cada variável.

- `validate_password_check_user_name`

  <table frame="box" rules="all" summary="Propriedades para validate_password_check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Introduzido</th> <td>5.7.15</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_check_user_name">validate_password_check_user_name</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>OFF</code>]]</td> </tr></tbody></table>

  Se `validate_password` compara as senhas com a parte do nome do usuário da conta de usuário efetiva da sessão atual e rejeita-as se elas corresponderem. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

  Por padrão, `validate_password_check_user_name` está desativado. Essa variável controla a correspondência do nome do usuário independentemente do valor de `validate_password_policy`.

  Quando `validate_password_check_user_name` está habilitado, ele tem esses efeitos:

  - A verificação ocorre em todos os contextos para os quais o `validate_password` é invocado, o que inclui o uso de instruções como `ALTER USER` ou `SET PASSWORD` para alterar a senha do usuário atual, e a invocação de funções como `PASSWORD()` e `VALIDATE_PASSWORD_STRENGTH()`.

  - Os nomes de usuário usados para comparação são obtidos a partir dos valores das funções `USER()` e `CURRENT_USER()` para a sessão atual. Isso implica que um usuário que tenha privilégios suficientes para definir a senha de outro usuário pode definir a senha para o nome desse usuário, mas não pode definir a senha desse usuário para o nome do usuário que está executando a instrução. Por exemplo, `'root'@'localhost'` pode definir a senha para `'jeffrey'@'localhost'` para `'jeffrey'`, mas não pode definir a senha para `'root`.

  - Apenas a parte do nome do usuário das funções `USER()` e `CURRENT_USER()` é usada, não a parte do nome do host. Se o nome do usuário estiver vazio, nenhuma comparação ocorrerá.

  - Se uma senha for igual ao nome do usuário ou ao seu inverso, ocorre uma correspondência e a senha é rejeitada.

  - A correspondência de nomes de usuário é case-sensitive. Os valores de senha e nome de usuário são comparados como strings binárias, caracter a caractere.

  - Se uma senha corresponder ao nome do usuário, [`VALIDATE_PASSWORD_STRENGTH()`](https://docs.djangoproject.com/en/3.2/ref/cryptography/functions/validate-password-strength/) retorna 0, independentemente de como as outras variáveis de sistema `validate_password` estejam configuradas.

- `validate_password_dictionary_file`

  <table frame="box" rules="all" summary="Propriedades para validate_password_dictionary_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-dictionary-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_dictionary_file">validate_password_dictionary_file</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de dicionário que o `validate_password` usa para verificar as senhas. Essa variável não está disponível, a menos que o `validate_password` esteja instalado.

  Por padrão, essa variável tem um valor vazio e as verificações de dicionário não são realizadas. Para que as verificações de dicionário ocorram, o valor da variável deve ser não vazio. Se o arquivo for nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O conteúdo do arquivo deve ser em minúsculas, uma palavra por linha. O conteúdo é tratado como tendo um conjunto de caracteres de `utf8`. O tamanho máximo permitido do arquivo é de 1 MB.

  Para que o arquivo de dicionário seja usado durante a verificação da senha, a política de senha deve ser definida como 2 (`STRONG`); veja a descrição da variável de sistema `validate_password_policy`. Supondo que isso seja verdade, cada subcadeia da senha de comprimento de 4 a 100 caracteres é comparada com as palavras no arquivo de dicionário. Qualquer correspondência faz com que a senha seja rejeitada. As comparações não são case-sensitive.

  Para `VALIDATE_PASSWORD_STRENGTH()`, a senha é verificada contra todas as políticas, incluindo `STRONG`, portanto, a avaliação da força inclui a verificação de dicionário, independentemente do valor da variável `validate_password_policy` (validate-password-options-variables.html#sysvar\_validate\_password\_policy).

  `validate_password_dictionary_file` pode ser definido em tempo de execução e, ao atribuir um valor, o arquivo nomeado é lido sem a necessidade de reiniciar o servidor.

- [`validate_password_length`](https://options-variables.html#sysvar_validate_password_length)

  <table frame="box" rules="all" summary="Propriedades para validate_password_length"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-length=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_length">validate_password_length</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>8</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres que `validate_password` exige para que as senhas tenham. Essa variável não está disponível, a menos que `validate_password` esteja instalado.

  O valor mínimo de `validate_password_length` é uma função de várias outras variáveis relacionadas ao sistema. O valor não pode ser definido como menor que o valor desta expressão:

  ```sql
  validate_password_number_count
  + validate_password_special_char_count
  + (2 * validate_password_mixed_case_count)
  ```

  Se `validate_password` ajustar o valor de `validate_password_length` devido à restrição anterior, ele escreve uma mensagem no log de erro.

- `validate_password_mixed_case_count`

  <table frame="box" rules="all" summary="Propriedades para validate_password_mixed_case_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-mixed-case-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_mixed_case_count">validate_password_mixed_case_count</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres minúsculos e maiúsculos que o `validate_password` exige para que as senhas tenham se a política de senha for `MÉDIA` ou mais forte. Esta variável não está disponível, a menos que o `validate_password` esteja instalado.

  Para um valor específico de `validate_password_mixed_case_count`, a senha deve ter tantos caracteres minúsculos quanto caracteres maiúsculos.

- `validate_password_number_count`

  <table frame="box" rules="all" summary="Propriedades para validate_password_number_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-number-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_number_count">validate_password_number_count</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres numéricos (dígitos) que o `validate_password` exige para que as senhas tenham se a política de senha for `MÉDIA` ou mais forte. Esta variável não está disponível, a menos que o `validate_password` esteja instalado.

- [`validate_password_policy`](https://options-variables.html#sysvar_validate_password_policy)

  <table frame="box" rules="all" summary="Propriedades para validate_password_policy"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-policy=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_policy">validate_password_policy</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>0</code>]]</p><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

  A política de senha aplicada por `validate_password`. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

  `validate_password_policy` afeta a forma como `validate_password` usa suas outras variáveis de sistema de configuração de políticas, exceto ao verificar senhas contra nomes de usuário, que é controlado de forma independente por `validate_password_check_user_name`.

  O valor de `validate_password_policy` pode ser especificado usando valores numéricos 0, 1, 2 ou os valores simbólicos correspondentes `LOW`, `MEDIUM`, `STRONG`. A tabela a seguir descreve os testes realizados para cada política. Para o teste de comprimento, o comprimento necessário é o valor da variável de sistema `validate_password_length`. Da mesma forma, os valores necessários para os outros testes são fornecidos por outras variáveis `validate_password_xxx`.

  <table summary="Políticas de senha aplicadas pelo plugin validate_password e os testes realizados para cada política."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Política</th> <th>Testes realizados</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>0</code>] ou [[PH_HTML_CÓDIGO_<code>LOW</code>]</td> <td>Comprimento</td> </tr><tr> <td>[[PH_HTML_CÓDIGO_<code>1</code>] ou [[PH_HTML_CÓDIGO_<code>MEDIUM</code>]</td> <td>Comprimento; caracteres numéricos, minúsculos/maiores, e caracteres especiais</td> </tr><tr> <td>[[<code>2</code>]] ou [[<code>STRONG</code>]]</td> <td>Comprimento; caracteres numéricos, minúsculos/maiores, e caracteres especiais; arquivo de dicionário</td> </tr></tbody></table>

- `validate_password_special_char_count`

  <table frame="box" rules="all" summary="Propriedades para validate_password_special_char_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password-special-char-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password_special_char_count">validate_password_special_char_count</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres não alfanuméricos que `validate_password` exige para que as senhas tenham se a política de senha for `MÉDIA` ou mais forte. Essa variável não está disponível, a menos que `validate_password` esteja instalado.

##### Variáveis de status do plugin de validação de senha

Se o plugin `validate_password` estiver ativado, ele exibe variáveis de status que fornecem informações operacionais:

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

- `validate_password_dictionary_file_last_parsed`

  Quando o arquivo do dicionário foi analisado pela última vez.

- `validate_password_dictionary_file_words_count`

  O número de palavras lidas do arquivo do dicionário.
