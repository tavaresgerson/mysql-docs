#### 6.6.4.2 Verificar opções do myisamchk

O **myisamchk** suporta as seguintes opções para operações de verificação de tabelas:

* `--check`, `-c`

  <table frame="box" rules="all" summary="Propriedades para verificação"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--check</code></td> </tr></tbody></table>

  Verifique a tabela em busca de erros. Esta é a operação padrão se você especificar nenhuma opção que selecione explicitamente um tipo de operação.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Propriedades para verificação-only-changed"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--check-only-changed</code></td> </tr></tbody></table>

  Verifique apenas tabelas que tenham sido alteradas desde a última verificação.

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Propriedades para extend-check"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--extend-check</code></td> </tr></tbody></table>

  Verifique a tabela de forma muito detalhada. Isso é bastante lento se a tabela tiver muitos índices. Esta opção deve ser usada apenas em casos extremos. Normalmente, **myisamchk** ou **myisamchk --medium-check** devem ser capazes de determinar se há algum erro na tabela.

  Se você estiver usando `--extend-check` e tiver muita memória, definir a variável `key_buffer_size` para um valor grande ajuda a operação de reparo a funcionar mais rápido.

  Veja também a descrição desta opção nas opções de reparo de tabela.

  Para uma descrição do formato de saída, consulte a Seção 6.6.4.5, “Obter informações da tabela com myisamchk”.

* `--fast`, `-F`

<table frame="box" rules="all" summary="Propriedades para velocidade">
  <tr><th>Formato de linha de comando</th> <td><code class="literal">--velocidade</code></td> </tr>
</table>

  Verifique apenas as tabelas que não foram fechadas corretamente.

* `--forçar`, `-f`

  <table frame="box" rules="all" summary="Propriedades para forçar">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--forçar</code></td> </tr>
  </table>

  Realize uma operação de reparo automaticamente se o `myisamchk` encontrar erros na tabela. O tipo de reparo é o mesmo especificado com a opção `--recuperar` ou `-r`.

* `--informação`, `-i`

  <table frame="box" rules="all" summary="Propriedades para informação">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--informação</code></td> </tr>
  </table>

  Imprima estatísticas informativas sobre a tabela verificada.

* `--verificação-média`, `-m`

  <table frame="box" rules="all" summary="Propriedades para verificação-média">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--verificação-média</code></td> </tr>
  </table>

  Realize uma verificação mais rápida do que uma operação de `--extensão-verificação`. Isso encontra apenas 99,99% de todos os erros, o que deve ser suficiente na maioria dos casos.

* `--somente-leitura`, `-T`

  <table frame="box" rules="all" summary="Propriedades para apenas-leitura">
    <tr><th>Formato de linha de comando</th> <td><code class="literal">--somente-leitura</code></td> </tr>
  </table>


Não marque a tabela como verificada. Isso é útil se você usar **myisamchk** para verificar uma tabela que está sendo usada por outro aplicativo que não usa bloqueio, como **mysqld** quando executado com o bloqueio externo desativado.

* `--update-state`, `-U`

  <table frame="box" rules="all" summary="Propriedades para update-state"><tbody><tr><th>Formato de linha de comando</th> <td><code class="literal">--update-state</code></td> </tr></tbody></table>

  Armazene informações no arquivo `.MYI` para indicar quando a tabela foi verificada e se a tabela falhou. Isso deve ser usado para obter o máximo benefício da opção `--check-only-changed`, mas você não deve usar essa opção se o servidor **mysqld** estiver usando a tabela e você estiver executando-o com o bloqueio externo desativado.