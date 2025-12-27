#### 8.4.2.3 Migrando para o Componente de Controle de Conexão

A migração dos plugins de Controle de Conexão para o componente de Controle de Conexão consiste nas seguintes etapas:

1. Remova todas as referências aos plugins nos arquivos de configuração, incluindo as referências feitas por `--plugin-load-add` ou `--early-plugin-load` ou variáveis do sistema de plugins.

   Como parte desta etapa, copie os valores para quaisquer variáveis de sistema de plugins de Controle de Conexão que você deseja manter. Além disso, remova quaisquer variáveis de plugin persistentes usando `RESET PERSIST`.

2. Desinstale os plugins, usando as seguintes duas declarações:

   ```
   UNINSTALL PLUGIN CONNECTION_CONTROL;
   UNINSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS;
   ```

3. Instale o componente conforme descrito na Seção 8.4.2.1, “Instalação do Componente de Controle de Conexão”.

4. Se você copiou quaisquer valores de variáveis de sistema de plugins, atribua-os no arquivo de configuração do servidor às variáveis equivalentes fornecidas pelo componente, conforme mostrado nesta tabela:

<table><col width="50%"/><col width="50%"/><thead><tr> <th>Variável do Plugin</th> <th>Variável do Componente</th> </tr></thead><tbody><tr> <td><a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_failed_connections_threshold"><code class="literal">connection_control_failed_connections_threshold</code></a></td> <td><a class="link" href="server-system-variables.html#sysvar_component_connection_control.failed_connections_threshold"><code class="literal">component_connection_control.failed_connections_threshold</code></a></td> </tr><tr> <td><a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_max_connection_delay"><code class="literal">connection_control_max_connection_delay</code></a></td> <td><a class="link" href="server-system-variables.html#sysvar_component_connection_control.max_connection_delay"><code class="literal">component_connection_control.max_connection_delay</code></a></td> </tr><tr> <td><a class="link" href="connection-control-plugin-variables.html#sysvar_connection_control_min_connection_delay"><code class="literal">connection_control_min_connection_delay</code></a></td> <td><a class="link" href="server-system-variables.html#sysvar_component_connection_control.min_connection_delay"><code class="literal">component_connection_control.min_connection_delay</code></a></td> </tr></tbody></table>

   Use `SET PERSIST` para persistir quaisquer valores de variáveis de componentes que foram persistidos anteriormente para seus equivalentes de plugins.

5. Reinicie o servidor para que ele use a configuração atualizada.