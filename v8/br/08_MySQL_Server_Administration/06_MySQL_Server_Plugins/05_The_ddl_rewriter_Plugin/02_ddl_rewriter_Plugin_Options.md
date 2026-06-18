#### 7.6.5.2 Opções do Plugin ddl\_rewriter

Esta seção descreve as opções de comando que controlam o funcionamento do plugin `ddl_rewriter`. Se os valores especificados no momento do início estiverem incorretos, o plugin `ddl_rewriter` pode não ser inicializado corretamente e o servidor não o carregará.

Para controlar a ativação do plugin `ddl_rewriter`, use esta opção:

- `--ddl-rewriter[=value]`

  <table summary="Propriedades para ddl-rewriter"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--ddl-rewriter[=valu<code>ON</code></code>]]</td> </tr><tr><th>Introduzido</th> <td>8.0.16</td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor padrão</th> <td>[[<code>ON</code>]]</td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value">[[<code>ON</code>]]</p><p class="valid-value">[[<code>OFF</code>]]</p><p class="valid-value">[[<code>FORCE</code>]]</p><p class="valid-value">[[<code>FORCE_PLUS_PERMANENT</code>]]</p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `ddl_rewriter` ao iniciar. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load` ou `--plugin-load-add`. Consulte a Seção 7.6.5.1, “Instalando ou Desinstalando ddl\_rewriter”.

  O valor da opção deve ser uma das disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--ddl-rewriter=OFF` desabilita o plugin ao iniciar o servidor.
