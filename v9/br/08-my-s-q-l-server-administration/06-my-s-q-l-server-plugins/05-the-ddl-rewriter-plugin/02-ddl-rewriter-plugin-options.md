#### 7.6.5.2 Opções do Plugin `ddl_rewriter`

Esta seção descreve as opções de comando que controlam o funcionamento do plugin `ddl_rewriter`. Se os valores especificados no momento do início forem incorretos, o plugin `ddl_rewriter` pode não ser inicializado corretamente e o servidor não o carregará.

Para controlar a ativação do plugin `ddl_rewriter`, use esta opção:

* `--ddl-rewriter[=valor]`

  <table frame="box" rules="all" summary="Propriedades para ddl-rewriter"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--ddl-rewriter[=valor]</code></td> </tr><tr><th>Tipo</th> <td>Enumeração</td> </tr><tr><th>Valor Padrão</th> <td><code>ON</code></td> </tr><tr><th>Valores Válidos</th> <td><p><code>ON</code></p><p><code>OFF</code></p><p><code>FORCE</code></p><p><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Esta opção controla como o servidor carrega o plugin `ddl_rewriter` no início. Está disponível apenas se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou tiver sido carregado com `--plugin-load` ou `--plugin-load-add`. Veja a Seção 7.6.5.1, “Instalando ou Desinstalando ddl_rewriter”.

  O valor da opção deve ser um dos disponíveis para as opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”. Por exemplo, `--ddl-rewriter=OFF` desativa o plugin no início do servidor.