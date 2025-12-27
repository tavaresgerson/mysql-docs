#### 8.4.3.2 Opções e Variáveis de Validação de Senha

Esta seção descreve as variáveis de sistema e de status que o `validate_password` fornece para permitir que sua operação seja configurada e monitorada.

*  Variáveis de Sistema do Componente de Validação de Senha
*  Variáveis de Status do Componente de Validação de Senha
*  Opções do Plugin de Validação de Senha
*  Variáveis de Sistema do Plugin de Validação de Senha
*  Variáveis de Status do Plugin de Validação de Senha

##### Variáveis de Sistema do Componente de Validação de Senha

Se o componente `validate_password` estiver habilitado, ele expõe várias variáveis de sistema que permitem a configuração da verificação de senhas:

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

Para alterar como as senhas são verificadas, você pode definir essas variáveis de sistema no início do servidor ou em tempo de execução. A lista a seguir descreve o significado de cada variável.

*  `validate_password.changed_characters_percentage`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.changed-characters-percentage[=value]</code></td> </tr><tr><th>Variável de Sistema</th> <td>`validate_password.changed_characters_percentage`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>100</code></td> </tr></tbody></table>

  Indica o número mínimo de caracteres, como uma porcentagem de todos os caracteres, em uma senha que um usuário deve alterar antes que o `validate_password` aceite uma nova senha para a conta do usuário. Isso se aplica apenas ao alterar uma senha existente e não tem efeito ao definir a senha inicial de uma conta de usuário.

  Esta variável não está disponível a menos que o `validate_password` esteja instalado.

Por padrão, `validate_password.changed_characters_percentage` permite que todos os caracteres da senha atual sejam reutilizados na nova senha. A faixa de porcentagens válidas é de 0 a 100. Se definida para 100%, todos os caracteres da senha atual são rejeitados, independentemente da formatação. Os caracteres `'`abc`'` e `'`ABC`'` são considerados como os mesmos caracteres. Se `validate_password` rejeitar a nova senha, ele relata um erro indicando o número mínimo de caracteres que devem diferir.

Se a  declaração `ALTER USER` não fornecer a senha existente em uma cláusula `REPLACE`, essa variável não é aplicada. Se a cláusula `REPLACE` é necessária, isso está sujeito à política de verificação de senha, conforme ela se aplica a uma conta específica. Para uma visão geral da política, consulte  Política de Verificação de Senha-Requerida.
*  `validate_password.check_user_name`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td>`validate_password.check_user_name`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tbody></table>

  Se `validate_password` compara as senhas com a parte do nome do usuário da conta efetiva do usuário para a sessão atual e as rejeita se elas corresponderem. Essa variável não está disponível a menos que `validate_password` esteja instalado.

  Por padrão, `validate_password.check_user_name` está habilitado. Essa variável controla a correspondência de nomes de usuário independentemente do valor de `validate_password.policy`.

  Quando `validate_password.check_user_name` está habilitado, ele tem esses efeitos:

+ A verificação ocorre em todos os contextos para os quais o `validate_password` é invocado, o que inclui o uso de instruções como `ALTER USER` ou `SET PASSWORD` para alterar a senha do usuário atual, e a invocação de funções como `VALIDATE_PASSWORD_STRENGTH()`.
  + Os nomes de usuário usados para comparação são tirados dos valores das funções `USER()` e `CURRENT_USER()` para a sessão atual. Isso implica que um usuário que tenha privilégios suficientes para definir a senha de outro usuário pode definir a senha para o nome do usuário, e não pode definir a senha desse usuário para o nome do usuário que está executando a instrução. Por exemplo, `'root'@'localhost'` pode definir a senha para `'jeffrey'@'localhost'` para `'jeffrey'`, mas não pode definir a senha para `'root`.
  + Apenas a parte do nome de usuário das funções `USER()` e `CURRENT_USER()` é usada, não a parte do nome do host. Se um nome de usuário estiver vazio, nenhuma comparação ocorre.
  + Se uma senha for igual ao nome do usuário ou ao seu reverso, ocorre uma correspondência e a senha é rejeitada.
  + A correspondência de nome de usuário é case-sensitive. Os valores das senhas e nomes de usuário são comparados como strings binárias, caracter a caractere.
  + Se uma senha corresponder ao nome do usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como as outras variáveis de sistema `validate_password` são definidas.
*  `validate_password.dictionary_file`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.dictionary-file=file_name</code></td> </tr><tr><th>Variável do Sistema</th> <td>`validate_password.dictionary_file`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

  O nome do caminho do arquivo de dicionário que o `validate_password` usa para verificar senhas. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

Por padrão, essa variável tem um valor vazio e as verificações de dicionário não são realizadas. Para que as verificações de dicionário ocorram, o valor da variável deve ser não vazio. Se o arquivo for nomeado como um caminho relativo, ele será interpretado em relação ao diretório de dados do servidor. O conteúdo do arquivo deve ser em maiúsculas minúsculas, uma palavra por linha. O conteúdo é tratado como tendo um conjunto de caracteres de `utf8mb3`. O tamanho máximo permitido do arquivo é de 1 MB.

Para que o arquivo de dicionário seja usado durante a verificação da senha, a política de senha deve ser definida como 2 (`STRONG`); consulte a descrição da variável de sistema `validate_password.policy`. Supondo que isso seja verdade, cada subcadeia da senha de comprimento de 4 a 100 caracteres é comparada com as palavras no arquivo de dicionário. Qualquer correspondência faz com que a senha seja rejeitada. As comparações não são case-sensitive.

Para `VALIDATE_PASSWORD_STRENGTH()`, a senha é verificada contra todas as políticas, incluindo `STRONG`, então a avaliação da força inclui a verificação de dicionário, independentemente do valor de `validate_password.policy`.

`validate_password.dictionary_file` pode ser definido em tempo de execução e atribuir um valor faz com que o arquivo nomeado seja lido sem reinício do servidor.
*  `validate_password.length`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.length=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password.length</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>8</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tbody></table>

  O número mínimo de caracteres que `validate_password` exige que as senhas tenham. Essa variável não está disponível a menos que `validate_password` esteja instalado.

O valor mínimo de `validate_password.length` é uma função de várias outras variáveis de sistema relacionadas. O valor não pode ser definido como menor que o valor desta expressão:

  ```
  validate_password.number_count
  + validate_password.special_char_count
  + (2 * validate_password.mixed_case_count)
  ```

  Se `validate_password` ajustar o valor de `validate_password.length` devido à restrição anterior, ele escreve uma mensagem no log de erro.
*  `validate_password.mixed_case_count`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.mixed-case-count=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>validate_password.mixed_case_count</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tbody></table>

  O número mínimo de caracteres minúsculos e maiúsculos que `validate_password` exige que as senhas tenham se a política de senha for `MÉDIO` ou mais forte. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  Para um valor dado de `validate_password.mixed_case_count`, a senha deve ter tantos caracteres minúsculos quanto caracteres maiúsculos.

O número mínimo de caracteres numéricos (dígitos) que `validate_password` exige que as senhas tenham se a política de senha for `MÉDIA` ou mais forte. Esta variável não está disponível a menos que `validate_password` esteja instalado.
*  `validate_password.policy`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.policy=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td>`validate_password.policy`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Dica de `SET_VAR` Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  A política de senha aplicada pelo `validate_password`. Esta variável não está disponível a menos que `validate_password` esteja instalado.

   O valor de `validate_password.policy` pode ser especificado usando valores numéricos 0, 1, 2 ou os valores simbólicos correspondentes `LOW`, `MEDIUM`, `STRONG`. A tabela a seguir descreve os testes realizados para cada política. Para o teste de comprimento, o comprimento necessário é o valor da variável de sistema `validate_password.length`. Da mesma forma, os valores necessários para os outros testes são fornecidos por outras variáveis `validate_password.xxx`.

<table><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Política</th> <th>Testes Realizados</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>BAIXO</code></td> <td>Comprimento</td> </tr><tr> <td><code>1</code> ou <code>MÉDIO</code></td> <td>Comprimento; caracteres numéricos, minúsculas/maiusculas e caracteres especiais</td> </tr><tr> <td><code>2</code> ou <code>FORTE</code></td> <td>Comprimento; caracteres numéricos, minúsculas/maiusculas e caracteres especiais; arquivo de dicionário</td> </tr></tbody></table>
*  `validate_password.special_char_count`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.special-char-count=#</code></td> </tr><tr><th>Variável do Sistema</th> <td>`validate_password.special_char_count`</td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de `SET_VAR`</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tbody></table>

  O número mínimo de caracteres não alfanuméricos que o `validate_password` exige que as senhas tenham se a política de senha for `MÉDIO` ou mais forte. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

##### Variáveis de Status do Componente de Validação de Senhas

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

*  `validate_password.dictionary_file_last_parsed`

  Quando o arquivo de dicionário foi analisado pela última vez. Esta variável não está disponível a menos que o `validate_password` esteja instalado.
*  `validate_password.dictionary_file_words_count`

  O número de palavras lidas do arquivo de dicionário. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

##### Opções do Plugin de Validação de Senhas

::: info Nota
Português (Brasil):

No MySQL 8.4, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas opções também estão desatualizadas, e você deve esperar que elas também sejam removidas. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

:::

Para controlar a ativação do plugin `validate_password`, use esta opção:

*  `--validate-password[=value]`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `validate_password` desatualizado no início. O valor deve ser um desses disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--validate-password=FORCE_PLUS_PERMANENT` indica ao servidor que carregue o plugin no início e impeça sua remoção enquanto o servidor estiver em execução.

  Esta opção está disponível apenas se o plugin `validate_password` tiver sido registrado anteriormente com `INSTALL PLUGIN` ou tiver sido carregado com `--plugin-load-add`. Veja a Seção 8.4.3.1, “Instalação e Desinstalação do Componente de Validação de Senhas”.

##### Variáveis de Sistema do Plugin de Validação de Senhas

::: info Nota
Português (Brasil):

No MySQL 8.4, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere que ele seja removido em uma versão futura do MySQL. Consequentemente, suas variáveis de sistema também estão desatualizadas e você deve esperar que elas também sejam removidas. Use as variáveis de sistema correspondentes do componente `validate_password` em vez disso; veja Variáveis de sistema do componente de validação de senha. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o componente de validação de senha”.

:::

* `validate_password_check_user_name`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--validate-password-check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Variável de sistema</th> <td><code>validate_password_check_user_name</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor padrão</th> <td><code>ON</code></td> </tr></tbody></table>

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere que ela seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.check_user_name` do componente `validate_password` em vez disso.
* `validate_password_dictionary_file`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--validate-password-dictionary-file=file_name</code></td> </tr><tr><th>Variável de sistema</th> <td><code>validate_password_dictionary_file</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da dica de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></tbody></table>

Esta variável de sistema `validate_password` do plugin está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.dictionary_file` do componente `validate_password` em vez disso.
*  `validate_password_length`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--validate-password-length=#</code></td> </tr><tr><th>Variável de sistema</th> <td><code>validate_password_length</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>8</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tbody></table>

  Esta variável de sistema `validate_password` do plugin está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.length` do componente `validate_password` em vez disso.
*  `validate_password_mixed_case_count`

  <table><tbody><tr><th>Formato de linha de comando</th> <td><code>--validate-password-mixed-case-count=#</code></td> </tr><tr><th>Variável de sistema</th> <td><code>validate_password_mixed_case_count</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td><code>1</code></td> </tr><tr><th>Valor mínimo</th> <td><code>0</code></td> </tbody></table>

  Esta variável de sistema `validate_password` do plugin está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.mixed_case_count` do componente `validate_password` em vez disso.
*  `validate_password_number_count`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-number-count=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>validate_password_number_count</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tbody></table>

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.number_count` do componente `validate_password` em vez disso.
*  `validate_password_policy`

  <table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-policy=value</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>validate_password_policy</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><code>SET_VAR</code> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.policy` do componente `validate_password` em vez disso.
*  `validate_password_special_char_count`

<table><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password-special-char-count=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code>validate_password_special_char_count</code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Aplicação da Dicas de <code>SET_VAR</code></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tbody></table>

  Esta variável de sistema do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.special_char_count` do componente `validate_password` em vez disso.

##### Variáveis de Status do Plugin de Validação de Senhas

::: info Nota

No MySQL 8.4, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Consequentemente, suas variáveis de status também estão desatualizadas; espere-se que sejam removidas. Use as variáveis de status correspondentes do componente `validate_password`; veja Variáveis de Status do Componente de Validação de Senhas. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.3.3, “Transição para o Componente de Validação de Senhas”.

:::

*  `validate_password_dictionary_file_last_parsed`

  Esta variável de status do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_last_parsed` do componente `validate_password` em vez disso.
*  `validate_password_dictionary_file_words_count`

Esta variável de status do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_words_count` do componente `validate_password` em vez disso.