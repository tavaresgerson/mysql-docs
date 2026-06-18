#### 8.4.3.2 Opções e variáveis de validação de senha

Esta seção descreve as variáveis de sistema e status que o `validate_password` fornece para permitir que sua operação seja configurada e monitorada.

- Sistema de Componentes de Validação de Senhas Variáveis de Sistema
- Status das variáveis do componente de validação de senha
- Opções do Plugin de Validação de Senha
- Plugin de validação de senha Variáveis do sistema
- Variáveis de status do plugin de validação de senha

##### Sistema de Componentes de Validação de Senhas Variáveis de Sistema

Se o componente `validate_password` estiver habilitado, ele expõe várias variáveis de sistema que permitem a configuração da verificação de senha:

```
mysql> SHOW VARIABLES LIKE 'validate_password.%';
+-------------------------------------------------+--------+
| Variable_name                                   | Value  |
+-------------------------------------------------+--------+
| validate_password.changed_characters_percentage | 0      |
| validate_password.check_user_name               | ON     |
| validate_password.dictionary_file               |        |
| validate_password.length                        | 8      |
| validate_password.mixed_case_count              | 1      |
| validate_password.number_count                  | 1      |
| validate_password.policy                        | MEDIUM |
| validate_password.special_char_count            | 1      |
+-------------------------------------------------+--------+
```

Para alterar a forma como as senhas são verificadas, você pode definir essas variáveis de sistema no início ou durante o funcionamento do servidor. A lista a seguir descreve o significado de cada variável.

- `validate_password.changed_characters_percentage`

  <table summary="Propriedades para validate_password.changed_characters_percentage"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.changed-characters-percentage[=valu<code>validate_password.changed_characters_percentage</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.34</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.changed_characters_percentage</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>100</code>]]</td> </tr></tbody></table>

  Indica o número mínimo de caracteres, como porcentagem de todos os caracteres, em uma senha que um usuário deve alterar antes que o `validate_password` aceite uma nova senha para a conta do usuário. Isso se aplica apenas ao alterar uma senha existente e não tem efeito ao definir a senha inicial de uma conta de usuário.

  Esta variável não está disponível, a menos que `validate_password` esteja instalado.

  Por padrão, `validate_password.changed_characters_percentage` permite que todos os caracteres da senha atual sejam reutilizados na nova senha. A faixa de porcentagens válidas é de 0 a 100. Se configurada para 100%, todos os caracteres da senha atual são rejeitados, independentemente da formatação. Os caracteres '`abc`' e '`ABC`' são considerados como caracteres iguais. Se `validate_password` rejeitar a nova senha, ele relata um erro indicando o número mínimo de caracteres que devem diferir.

  Se a declaração `ALTER USER` não fornecer a senha existente em uma cláusula `REPLACE`, essa variável não será aplicada. Se a cláusula `REPLACE` é necessária, isso depende da política de verificação de senha, conforme aplicável a uma conta específica. Para obter uma visão geral da política, consulte a Política de Verificação de Senha Requerida.

- `validate_password.check_user_name`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>

  Se `validate_password` comparar as senhas com a parte do nome do usuário da conta de usuário efetiva para a sessão atual e rejeitar-as se elas corresponderem. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

  Por padrão, `validate_password.check_user_name` está habilitado. Essa variável controla a correspondência do nome do usuário independentemente do valor de `validate_password.policy`.

  Quando o `validate_password.check_user_name` está ativado, ele tem esses efeitos:

  - A verificação ocorre em todos os contextos para os quais o `validate_password` é invocado, o que inclui o uso de instruções como `ALTER USER` ou `SET PASSWORD` para alterar a senha do usuário atual e a invocação de funções como `VALIDATE_PASSWORD_STRENGTH()`.

  - Os nomes de usuário usados para comparação são obtidos a partir dos valores das funções `USER()` e `CURRENT_USER()` para a sessão atual. Isso implica que um usuário que tenha privilégios suficientes para definir a senha de outro usuário pode definir a senha para o nome desse usuário e não pode definir a senha desse usuário para o nome do usuário que está executando a instrução. Por exemplo, `'root'@'localhost'` pode definir a senha para `'jeffrey'@'localhost'` para `'jeffrey'`, mas não pode definir a senha para `'root`.

  - Apenas a parte do nome do usuário das funções `USER()` e `CURRENT_USER()` é usada, não a parte do nome do host. Se o nome do usuário estiver vazio, nenhuma comparação será realizada.

  - Se uma senha for igual ao nome do usuário ou ao seu inverso, ocorre uma correspondência e a senha é rejeitada.

  - A correspondência de nomes de usuário é case-sensitive. Os valores de senha e nome de usuário são comparados como strings binárias, caracter a caractere.

  - Se uma senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como as outras variáveis de sistema `validate_password` forem configuradas.

- `validate_password.dictionary_file`

  <table summary="Propriedades para validate_password.dictionary_file"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.dictionary-file=file_name</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.dictionary_file</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de dicionário que o `validate_password` usa para verificar senhas. Essa variável não está disponível, a menos que o `validate_password` esteja instalado.

  Por padrão, essa variável tem um valor vazio e as verificações de dicionário não são realizadas. Para que as verificações de dicionário ocorram, o valor da variável deve ser não vazio. Se o arquivo for nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O conteúdo do arquivo deve ser em letra minúscula, uma palavra por linha. O conteúdo é tratado como tendo um conjunto de caracteres de `utf8mb3`. O tamanho máximo permitido do arquivo é de 1 MB.

  Para que o arquivo de dicionário seja usado durante a verificação da senha, a política de senha deve ser definida como 2 (`STRONG`); veja a descrição da variável de sistema `validate_password.policy`. Supondo que isso seja verdade, cada subcadeia da senha de comprimento de 4 a 100 caracteres é comparada com as palavras no arquivo de dicionário. Qualquer correspondência faz com que a senha seja rejeitada. As comparações não são case-sensitive.

  Para `VALIDATE_PASSWORD_STRENGTH()`, a senha é verificada contra todas as políticas, incluindo `STRONG`, portanto, a avaliação de força inclui a verificação de dicionário, independentemente do valor de `validate_password.policy`.

  `validate_password.dictionary_file` pode ser definido em tempo de execução e, ao atribuir um valor, o arquivo nomeado é lido sem a necessidade de reiniciar o servidor.

- `validate_password.length`

  <table summary="Propriedades para validate_password.length"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.length=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.length</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>8</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres que `validate_password` exige para que as senhas tenham. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

  O valor mínimo `validate_password.length` é uma função de várias outras variáveis de sistema relacionadas. O valor não pode ser definido como menor que o valor desta expressão:

  ```
  validate_password.number_count
  + validate_password.special_char_count
  + (2 * validate_password.mixed_case_count)
  ```

  Se `validate_password` ajusta o valor de `validate_password.length` devido à restrição anterior, ele escreve uma mensagem no log de erro.

- `validate_password.mixed_case_count`

  <table summary="Propriedades para validate_password.mixed_case_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.mixed-case-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.mixed_case_count</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres minúsculos e maiúsculos que o `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível, a menos que o `validate_password` esteja instalado.

  Para um valor específico de `validate_password.mixed_case_count`, a senha deve ter tantos caracteres minúsculos quanto caracteres maiúsculos.

- `validate_password.number_count`

  <table summary="Propriedades para validate_password.number_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.number-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.number_count</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres numéricos (dígitos) que o `validate_password` exige que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível, a menos que o `validate_password` esteja instalado.

- `validate_password.policy`

  <table summary="Propriedades para validate_password.policy"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.policy=value</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.policy</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>0</code>]]</p><p class="valid-value">[[<code>1</code>]]</p><p class="valid-value">[[<code>2</code>]]</p></td> </tr></tbody></table>

  A política de senha aplicada por `validate_password`. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

  `validate_password.policy` afeta a forma como `validate_password` utiliza suas outras variáveis de sistema de definição de políticas, exceto para verificar senhas contra nomes de usuário, que é controlada de forma independente por `validate_password.check_user_name`.

  O valor `validate_password.policy` pode ser especificado usando valores numéricos 0, 1, 2 ou os valores simbólicos correspondentes `LOW`, `MEDIUM`, `STRONG`. A tabela a seguir descreve os testes realizados para cada política. Para o teste de comprimento, o comprimento necessário é o valor da variável de sistema `validate_password.length`. Da mesma forma, os valores necessários para os outros testes são fornecidos por outras variáveis `validate_password.xxx`.

  <table summary="Políticas de senha aplicadas pelo componente validate_password e os testes realizados para cada política."><thead><tr> <th>Política</th> <th>Testes realizados</th> </tr></thead><tbody><tr> <td>[[PH_HTML_CÓDIGO_<code>0</code>] ou [[PH_HTML_CÓDIGO_<code>LOW</code>]</td> <td>Comprimento</td> </tr><tr> <td>[[PH_HTML_CÓDIGO_<code>1</code>] ou [[PH_HTML_CÓDIGO_<code>MEDIUM</code>]</td> <td>Comprimento; caracteres numéricos, minúsculos/maiores, e caracteres especiais</td> </tr><tr> <td>[[<code>2</code>]] ou [[<code>STRONG</code>]]</td> <td>Comprimento; caracteres numéricos, minúsculos/maiores, e caracteres especiais; arquivo de dicionário</td> </tr></tbody></table>

- `validate_password.special_char_count`

  <table summary="Propriedades para validate_password.special_char_count"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.special-char-count=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.special_char_count</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr></tbody></table>

  O número mínimo de caracteres não alfanuméricos que o `validate_password` exige para que as senhas tenham se a política de senha for `MEDIUM` ou mais forte. Esta variável não está disponível, a menos que o `validate_password` esteja instalado.

##### Status das variáveis do componente de validação de senha

Se o componente `validate_password` estiver habilitado, ele expõe variáveis de status que fornecem informações operacionais:

```
mysql> SHOW STATUS LIKE 'validate_password.%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password.dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

A lista a seguir descreve o significado de cada variável de status.

- `validate_password.dictionary_file_last_parsed`

  Quando o arquivo do dicionário foi analisado pela última vez. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

- `validate_password.dictionary_file_words_count`

  O número de palavras lidas do arquivo do dicionário. Esta variável não está disponível, a menos que `validate_password` esteja instalado.

##### Opções do Plugin de Validação de Senha

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas opções também estão desatualizadas, e você deve esperar que elas também sejam removidas. As instalações do MySQL que usam o plugin devem fazer a transição para o uso do componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

Para controlar a ativação do plugin `validate_password`, use esta opção:

- `--validate-password[=value]`

  <table summary="Propriedades para validar senha"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin desatualizado `validate_password` ao iniciar. O valor deve ser um dos disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--validate-password=FORCE_PLUS_PERMANENT` indica ao servidor que o plugin deve ser carregado ao iniciar e impede que ele seja removido enquanto o servidor estiver em execução.

  Esta opção está disponível apenas se o plugin `validate_password` tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`. Consulte a Seção 8.4.3.1, “Instalação e Desinstalação do Componente de Validação de Senha”.

##### Plugin de validação de senha Variáveis do sistema

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere-o ser removido em uma versão futura do MySQL. Consequentemente, suas variáveis de sistema também estão desatualizadas e você deve esperar que elas também sejam removidas. Use as variáveis de sistema correspondentes do componente `validate_password`; veja Variáveis de Sistema de Componentes de Validação de Senhas. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

- `validate_password_check_user_name`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>0

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.check_user_name` do componente `validate_password` em vez disso.

- `validate_password_dictionary_file`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>1

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.dictionary_file` do componente `validate_password` em vez disso.

- `validate_password_length`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>2

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.length` do componente `validate_password` em vez disso.

- `validate_password_mixed_case_count`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>3

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.mixed_case_count` do componente `validate_password` em vez disso.

- `validate_password_number_count`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>4

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.number_count` do componente `validate_password` em vez disso.

- `validate_password_policy`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>5

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.policy` do componente `validate_password` em vez disso.

- `validate_password_special_char_count`

  <table summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--validate-password.check-user-name[={OFF|ON}]</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>validate_password.check_user_name</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Boolean</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr></tbody></table>6

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.special_char_count` do componente `validate_password` em vez disso.

##### Variáveis de status do plugin de validação de senha

Nota

No MySQL 8.0, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas variáveis de status também estão desatualizadas; espere que elas sejam removidas. Use as variáveis de status correspondentes do componente \[\[`validate_password`]; veja Variáveis de Status do Componente de Validação de Senhas. As instalações do MySQL que usam o plugin devem fazer a transição para o uso do componente. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

- `validate_password_dictionary_file_last_parsed`

  Esta variável de status do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_last_parsed` do componente `validate_password` em vez disso.

- `validate_password_dictionary_file_words_count`

  Esta variável de status do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_words_count` do componente `validate_password` em vez disso.
