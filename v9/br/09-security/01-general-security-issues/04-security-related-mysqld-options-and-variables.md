### 8.1.4 Opções e variáveis de segurança do mysqld

A tabela a seguir mostra as opções e variáveis de sistema do **mysqld** que afetam a segurança. Para descrições de cada uma delas, consulte a Seção 7.1.7, “Opções de comando do servidor”, e a Seção 7.1.8, “Variáveis de sistema do servidor”.

**Tabela 8.1 Resumo de opções e variáveis de segurança**

<table frame="box" rules="all" summary="Opções de linha de comando relacionadas à segurança e variáveis do sistema.">
<col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/>
<thead><tr>
<th scope="col">Nome</th>
<th scope="col">Linha de Comando</th>
<th scope="col">Arquivo de Opções</th>
<th scope="col">Var System</th>
<th scope="col">Var Status</th>
<th scope="col">Alcance da Var</th>
<th scope="col">Dinâmico</th>
</tr></thead>
<tbody>
<tr>
<th scope="row"><a class="link" href="server-options.html#option_mysqld_allow-suspicious-udfs">allow-suspicious-udfs</a></th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-system-variables.html#sysvar_local_infile">local_infile</a></th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-options.html#option_mysqld_safe-user-create">safe-user-create</a></th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-system-variables.html#sysvar_secure_file_priv">secure_file_priv</a></th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-options.html#option_mysqld_skip-grant-tables">skip-grant-tables</a></th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-system-variables.html#sysvar_skip_name_resolve">skip_name_resolve</a></th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-system-variables.html#sysvar_skip_networking">skip_networking</a></th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th scope="row"><a class="link" href="server-system-variables.html#sysvar_skip_show_database">skip_show_database</a></th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
</tbody></table>