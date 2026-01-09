#### 8.4.4.2 Opções e Variáveis de Validação de Senha

Esta seção descreve as variáveis de sistema e de status que o `validate_password` fornece para permitir que sua operação seja configurada e monitorada.

* Variáveis de Componentes de Validação de Senha
* Variáveis de Status de Componentes de Validação de Senha
* Opções de Plugin de Validação de Senha
* Variáveis de Sistema de Plugin de Validação de Senha
* Variáveis de Status de Plugin de Validação de Senha

##### Variáveis de Sistema de Componentes de Validação de Senha

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

Para alterar a forma como as senhas são verificadas, você pode definir essas variáveis de sistema no início ou durante a execução. A lista a seguir descreve o significado de cada variável.

* `validate_password.changed_characters_percentage`

<table frame="box" rules="all" summary="Propriedades para validate_password.changed_characters_percentage">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--validate-password.changed-characters-percentage[=value]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.changed_characters_percentage">validate_password.changed_characters_percentage</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
  <tr>
    <th>Valor Máximo</th>
    <td><code>100</code></td>
  </tr>
</table>

  Indica o número mínimo de caracteres, como uma porcentagem de todos os caracteres, em uma senha que um usuário deve alterar antes que o `validate_password` aceite uma nova senha para a conta do usuário. Isso se aplica apenas ao alterar uma senha existente e não tem efeito ao definir a senha inicial de uma conta de usuário.

  Esta variável não está disponível a menos que o `validate_password` esteja instalado.

Por padrão, `validate_password.changed_characters_percentage` permite que todos os caracteres da senha atual sejam reutilizados na nova senha. A faixa de porcentagens válidas é de 0 a 100. Se definida para 100%, todos os caracteres da senha atual são rejeitados, independentemente da caixa. Os caracteres `'`abc'`` e `'`ABC'`` são considerados como os mesmos caracteres. Se `validate_password` rejeitar a nova senha, ele relata um erro indicando o número mínimo de caracteres que devem diferir.

Se a instrução `ALTER USER` não fornecer a senha existente em uma cláusula `REPLACE`, essa variável não é aplicada. Se a cláusula `REPLACE` é necessária, isso depende da política de verificação de senha, conforme ela se aplica a uma conta específica. Para uma visão geral da política, consulte a Política de Verificação de Senha Requerida.

* `validate_password.check_user_name`

  <table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variável"><code>SET_VAR</a></code> Hint Aplica</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Se `validate_password` compara senhas com a parte do nome de usuário da conta de usuário efetiva para a sessão atual e as rejeita se elas corresponderem. Essa variável não está disponível, a menos que `validate_password` esteja instalado.

Por padrão, `validate_password.check_user_name` está habilitado. Essa variável controla a correspondência de nomes de usuário independentemente do valor de `validate_password.policy`.

Quando `validate_password.check_user_name` está habilitado, ele tem esses efeitos:

+ A verificação ocorre em todos os contextos para os quais `validate_password` é invocado, o que inclui o uso de instruções como `ALTER USER` ou `SET PASSWORD` para alterar a senha do usuário atual, e a invocação de funções como `VALIDATE_PASSWORD_STRENGTH()`.

+ Os nomes de usuário usados para comparação são tirados dos valores das funções `USER()` e `CURRENT_USER()` para a sessão atual. Uma implicação é que um usuário que tem privilégios suficientes para definir a senha de outro usuário pode definir a senha para o nome do usuário, e não pode definir a senha desse usuário para o nome do usuário que está executando a instrução. Por exemplo, `'root'@'localhost'` pode definir a senha para `'jeffrey'@'localhost'` para `'jeffrey'`, mas não pode definir a senha para `'root'`.

+ Apenas a parte do nome de usuário das funções `USER()` e `CURRENT_USER()` é usada, não a parte do nome do host. Se um nome de usuário estiver vazio, nenhuma comparação ocorre.

+ Se uma senha for igual ao nome de usuário ou ao seu reverso, ocorre uma correspondência e a senha é rejeitada.

+ A correspondência de nomes de usuário é case-sensitive. Os valores das senhas e nomes de usuário são comparados como strings binárias em uma base byte a byte.

+ Se uma senha corresponder ao nome de usuário, `VALIDATE_PASSWORD_STRENGTH()` retorna 0, independentemente de como outras variáveis de sistema `validate_password` são definidas.

* `validate_password.dictionary_file`

  <table frame="box" rules="all" summary="Propriedades para `validate_password.dictionary_file`"><tr><th>Formato de linha de comando</th> <td><code>--validate-password.dictionary-file=file_name</code></td> </tr><tr><th>Variável do sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.dictionary_file">validate_password.dictionary_file</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de configuração de variáveis"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr></table>

  O nome do caminho do arquivo de dicionário que o `validate_password` usa para verificar senhas. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

  Por padrão, este valor da variável tem um valor vazio e as verificações de dicionário não são realizadas. Para que as verificações de dicionário ocorram, o valor da variável deve ser não vazio. Se o arquivo estiver nomeado como um caminho relativo, ele é interpretado em relação ao diretório de dados do servidor. O conteúdo do arquivo deve ser em minúsculas, uma palavra por linha. O conteúdo é tratado como tendo um conjunto de caracteres de `utf8mb3`. O tamanho máximo permitido do arquivo é de 1MB.

Para que o arquivo de dicionário seja usado durante a verificação da senha, a política de senha deve ser definida como 2 (`STRONG`); veja a descrição da variável de sistema `validate_password.policy`. Supondo que isso seja verdade, cada subcadeia da senha de comprimento de 4 a 100 caracteres é comparada com as palavras no arquivo de dicionário. Qualquer correspondência faz com que a senha seja rejeitada. As comparações não são case-sensitive.

Para `VALIDATE_PASSWORD_STRENGTH()`, a senha é verificada contra todas as políticas, incluindo `STRONG`, então a avaliação da força inclui a verificação do dicionário, independentemente do valor da variável `validate_password.policy`.

`validate_password.dictionary_file` pode ser definido em tempo de execução e atribuir um valor faz com que o arquivo nomeado seja lido sem reinicialização do servidor.

* `validate_password.length`

  <table frame="box" rules="all" summary="Propriedades para validate_password.length"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.length=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.length">validate_password.length</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>8</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr></tbody></table>

O número mínimo de caracteres que `validate_password` exige que as senhas tenham. Essa variável não está disponível, a menos que `validate_password` esteja instalado.

O valor mínimo de `validate_password.length` é uma função de várias outras variáveis de sistema relacionadas. O valor não pode ser definido como menor que o valor desta expressão:

```
  validate_password.number_count
  + validate_password.special_char_count
  + (2 * validate_password.mixed_case_count)
  ```

Se `validate_password` ajustar o valor de `validate_password.length` devido à restrição anterior, ele escreve uma mensagem no log de erro.

* `validate_password.mixed_case_count`

  <table frame="box" rules="all" summary="Propriedades para validate_password.mixed_case_count">
    
    <tbody>
      <tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.mixed-case-count=#</code></td> </tr>
      <tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.mixed_case_count">validate_password.mixed_case_count</a></code></td> </tr>
      <tr><th>Alcance</th> <td>Global</td> </tr>
      <tr><th>Dinâmico</th> <td>Sim</td> </tr>
      <tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica</th> <td>Não</td> </tr>
      <tr><th>Tipo</th> <td>Inteiro</td> </tr>
      <tr><th>Valor Padrão</th> <td><code>1</code></td> </tr>
      <tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr>
    </tbody>
  </table>

  O número mínimo de caracteres minúsculas e maiúsculas que `validate_password` exige que as senhas tenham se a política de senha for `MÉDIA` ou mais forte. Essa variável não está disponível, a menos que `validate_password` esteja instalado.

Para um valor dado de `validate_password.mixed_case_count`, a senha deve ter esse número de caracteres minúsculos e esse número de caracteres maiúsculos.

* `validate_password.number_count`

  <table frame="box" rules="all" summary="Propriedades para validate_password.number_count"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.number-count=#</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.number_count">validate_password.number_count</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hint de Configuração de Variável"><code>SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr></tbody></table>

  O número mínimo de caracteres numéricos (dígitos) que o `validate_password` exige que as senhas tenham se a política de senha for `MÉDIO` ou mais forte. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

* `validate_password.policy`

<table frame="box" rules="all" summary="Propriedades para validate_password.policy"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.policy=valor</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.policy">validate_password.policy</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>1</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  A política de senha aplicada por `validate_password`. Esta variável não está disponível a menos que `validate_password` esteja instalado.

  `validate_password.policy` afeta como `validate_password` usa suas outras variáveis de sistema de configuração de políticas, exceto para verificar senhas contra nomes de usuário, que é controlado de forma independente por `validate_password.check_user_name`.

O valor `validate_password.policy` pode ser especificado usando valores numéricos 0, 1, 2 ou os valores simbólicos correspondentes `LOW`, `MEDIUM`, `STRONG`. A tabela a seguir descreve os testes realizados para cada política. Para o teste de comprimento, o comprimento necessário é o valor da variável de sistema `validate_password.length`. Da mesma forma, os valores necessários para os outros testes são fornecidos por outras variáveis `validate_password.xxx`.

<table summary="Políticas de senha aplicadas pelo componente validate_password e os testes realizados para cada política."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Política</th> <th>Testes Realizados</th> </tr></thead><tbody><tr> <td><code>0</code> ou <code>LOW</code></td> <td>Comprimento</td> </tr><tr> <td><code>1</code> ou <code>MEDIUM</code></td> <td>Comprimento; numérico, minúsculas/maiúsculas e caracteres especiais</td> </tr><tr> <td><code>2</code> ou <code>STRONG</code></td> <td>Comprimento; numérico, minúsculas/maiúsculas e caracteres especiais; arquivo de dicionário</td> </tr></tbody></table>

* `validate_password.special_char_count`

<table frame="box" rules="all" summary="Propriedades para validate_password.special_char_count">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--validate-password.special-char-count=#</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.special_char_count">validate_password.special_char_count</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></th></td>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Inteiro</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>1</code></td>
  </tr>
  <tr>
    <th>Valor Mínimo</th>
    <td><code>0</code></td>
  </tr>
</table>

O número mínimo de caracteres não alfanuméricos que o `validate_password` exige que as senhas tenham se a política de senha for `MÉDIA` ou mais forte. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

##### Variáveis de Status de Componentes de Validação de Senhas

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

* `validate_password.dictionary_file_last_parsed`

  Quando o arquivo de dicionário foi analisado pela última vez. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

* `validate_password.dictionary_file_words_count`

  O número de palavras lidas do arquivo de dicionário. Esta variável não está disponível a menos que o `validate_password` esteja instalado.

##### Opções do Plugin de Validação de Senha

Nota

No MySQL 9.5, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere-se que ele seja removido em uma versão futura do MySQL. Consequentemente, suas opções também estão desatualizadas, e você deve esperar que elas também sejam removidas. Instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.4.3, “Transição para o Componente de Validação de Senha”.

Para controlar a ativação do plugin `validate_password`, use esta opção:

* `--validate-password[=value]`

  <table frame="box" rules="all" summary="Propriedades para validate-password"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `validate_password` desatualizado no início. O valor deve ser um desses disponíveis para opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--validate-password=FORCE_PLUS_PERMANENT` indica ao servidor que carregue o plugin no início e impeça sua remoção enquanto o servidor estiver em execução.

Esta opção está disponível apenas se o plugin `validate_password` tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`. Veja a Seção 8.4.4.1, “Instalação e Desinstalação do Componente de Validação de Senhas”.

##### Variáveis de Sistema do Plugin de Validação de Senhas

Observação

No MySQL 9.5, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere-o ser removido em uma versão futura do MySQL. Consequentemente, suas variáveis de sistema também estão desatualizadas e você deve esperar que elas também sejam removidas. Use as variáveis de sistema correspondentes do componente `validate_password`; veja Variáveis de Sistema do Componente de Validação de Senhas. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.4.3, “Transição para o Componente de Validação de Senhas”.

* `validate_password_check_user_name`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name">
  <tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Este sistema de variável plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável correspondente `validate_password.check_user_name` do componente `validate_password` em vez disso.

* `validate_password_dictionary_file`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td>
  </tr>
  <tr>
    <th>Variável do Sistema</th>
    <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmico</th>
    <td>Sim</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável"><code>SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Booleano</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>ON</code></td>
  </tr>
</table>

Este sistema de variável do plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.dictionary_file` do componente `validate_password` em vez disso.

* `validate_password_length`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name">
  <tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code>SET_VAR</a></code> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Este sistema de variável plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.length` do componente `validate_password` em vez disso.

* `validate_password_mixed_case_count`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name">
  <tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Este sistema de variável de plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.mixed_case_count` do componente `validate_password` em vez disso.

* `validate_password_number_count`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name">
  <tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Este sistema de variável de plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.number_count` do componente `validate_password` em vez disso.

* `validate_password_policy`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name">
  <tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr>
  <tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr>
  <tr><th>Alcance</th> <td>Global</td> </tr>
  <tr><th>Dinâmico</th> <td>Sim</td> </tr>
  <tr><th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Hinta de Configuração de Variável">SET_VAR</a> Aplica-se</th> <td>Não</td> </tr>
  <tr><th>Tipo</th> <td>Booleano</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr>
</table>

Este sistema de variável de plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.policy` do componente `validate_password` em vez disso.

* `validate_password_special_char_count`

<table frame="box" rules="all" summary="Propriedades para validate_password.check_user_name"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Variável do Sistema</th> <td><code><a class="link" href="validate-password-options-variables.html#sysvar_validate_password.check_user_name">validate_password.check_user_name</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Dicas de Configuração de Variáveis"><code>SET_VAR</code></a></code> Dicas Aplicam-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Booleano</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr></tbody></table>

Este sistema de variável do plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Use a variável de sistema correspondente `validate_password.special_char_count` do componente `validate_password` em vez disso.

##### Variáveis de Status do Plugin de Validação de Senha

Nota

No MySQL 9.5, o plugin `validate_password` foi reimplementado como o componente `validate_password`. O plugin `validate_password` está desatualizado; espere-se que seja removido em uma versão futura do MySQL. Consequentemente, suas variáveis de status também estão desatualizadas; espere-se que sejam removidas. Use as variáveis de status correspondentes do componente `validate_password`; veja Variáveis de Status do Componente de Validação de Senha. As instalações do MySQL que usam o plugin devem fazer a transição para usar o componente em vez disso. Veja a Seção 8.4.4.3, “Transição para o Componente de Validação de Senha”.

* `validate_password_dictionary_file_last_parsed`

  Esta variável de status do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_last_parsed` do componente `validate_password` em vez disso.

* `validate_password_dictionary_file_words_count`

  Esta variável de status do plugin `validate_password` está desatualizada; espere-se que seja removida em uma versão futura do MySQL. Use a variável de status correspondente `validate_password.dictionary_file_words_count` do componente `validate_password` em vez disso.