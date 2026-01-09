### 8.1.4 Opções e variáveis de segurança do mysqld

A tabela a seguir mostra as opções e variáveis de sistema do **mysqld** que afetam a segurança. Para descrições de cada uma delas, consulte a Seção 7.1.7, “Opções de comando do servidor”, e a Seção 7.1.8, “Variáveis de sistema do servidor”.

**Tabela 8.1 Resumo de opções e variáveis de segurança**

<table frame="box" rules="all" summary="Opções de linha de comando relacionadas à segurança e variáveis do sistema.">
<col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/>
<thead><tr>
<th>Nome</th>
<th>Linha de Comando</th>
<th>Arquivo de Opções</th>
<th>Var System</th>
<th>Var Status</th>
<th>Alcance da Var</th>
<th>Dinâmico</th>
</tr></thead>
<tbody>
<tr>
<th>allow-suspicious-udfs</th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>automatic_sp_privileges</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>local_infile</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Sim</td>
</tr>
<tr>
<th>safe-user-create</th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>secure_file_priv</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>skip-grant-tables</th>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr>
<th>skip_name_resolve</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>skip_networking</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
<tr>
<th>skip_show_database</th>
<td>Sim</td>
<td>Sim</td>
<td>Sim</td>
<td></td>
<td>Global</td>
<td>Não</td>
</tr>
</tbody></table>