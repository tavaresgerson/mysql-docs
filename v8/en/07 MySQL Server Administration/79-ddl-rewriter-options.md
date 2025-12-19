#### 7.6.5.2 `ddl_rewriter` Plugin Options

This section describes the command options that control operation of the `ddl_rewriter` plugin. If values specified at startup time are incorrect, the `ddl_rewriter` plugin may fail to initialize properly and the server does not load it.

To control activation of the `ddl_rewriter` plugin, use this option:

*  `--ddl-rewriter[=value]`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ddl-rewriter[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the `ddl_rewriter` plugin at startup. It is available only if the plugin has been previously registered with  `INSTALL PLUGIN` or is loaded with  `--plugin-load` or `--plugin-load-add`. See Section 7.6.5.1, “Installing or Uninstalling ddl\_rewriter”.

  The option value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”. For example, `--ddl-rewriter=OFF` disables the plugin at server startup.
