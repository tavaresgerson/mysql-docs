#### 7.6.5.2 ddl\_rewriter Plugin Options

This section describes the command options that control
operation of the `ddl_rewriter` plugin. If
values specified at startup time are incorrect, the
`ddl_rewriter` plugin may fail to initialize
properly and the server does not load it.

To control activation of the `ddl_rewriter`
plugin, use this option:

* [`--ddl-rewriter[=value]`](ddl-rewriter-options.html#option_mysqld_ddl-rewriter)

  <table frame="box" rules="all" summary="Properties for ddl-rewriter"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--ddl-rewriter[=value]</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.16</td>
</tr><tr><th>Type</th>
<td>Enumeration</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">ON</code></td>
</tr><tr><th>Valid Values</th>
<td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td>
</tr></tbody></table>

  This option controls how the server loads the
  `ddl_rewriter` plugin at startup. It is
  available only if the plugin has been previously registered
  with [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") or is
  loaded with [`--plugin-load`](server-options.html#option_mysqld_plugin-load) or
  [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add). See
  [Section 7.6.5.1, “Installing or Uninstalling ddl\_rewriter”](ddl-rewriter-installation.html "7.6.5.1 Installing or Uninstalling ddl_rewriter").

  The option value should be one of those available for
  plugin-loading options, as described in
  [Section 7.6.1, “Installing and Uninstalling Plugins”](plugin-loading.html "7.6.1 Installing and Uninstalling Plugins"). For example,
  [`--ddl-rewriter=OFF`](ddl-rewriter-options.html#option_mysqld_ddl-rewriter) disables
  the plugin at server startup.