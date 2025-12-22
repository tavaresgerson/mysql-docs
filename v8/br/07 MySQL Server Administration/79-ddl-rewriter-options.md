#### 7.6.5.2 Opções do Plugin \[`ddl_rewriter`]

Esta seção descreve as opções de comando que controlam a operação do plug-in `ddl_rewriter`. Se os valores especificados no momento da inicialização estiverem incorretos, o plug-in `ddl_rewriter` pode falhar na inicialização correta e o servidor não o carregar.

Para controlar a ativação do plug-in `ddl_rewriter`, use esta opção:

- `--ddl-rewriter[=value]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato da linha de comando</th> <td>[[<code>--ddl-rewriter[=valu<code>ON</code></code>]]</td> </tr><tr><th>Tipo do produto</th> <td>Enumeração</td> </tr><tr><th>Valor por defeito</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

Esta opção controla como o servidor carrega o plug-in `ddl_rewriter` na inicialização. Ele está disponível apenas se o plug-in tiver sido previamente registrado com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load` ou `--plugin-load-add`.

O valor da opção deve ser um dos disponíveis para opções de carregamento de plugins, como descrito na Seção 7.6.1, Instalar e Desinstalar Plugins. Por exemplo, `--ddl-rewriter=OFF` desativa o plugin na inicialização do servidor.
