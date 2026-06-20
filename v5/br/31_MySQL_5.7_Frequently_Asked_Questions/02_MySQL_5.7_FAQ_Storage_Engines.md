## A.2 Perguntas frequentes sobre o MySQL 5.7: Motores de armazenamento

A.2.1. Onde posso obter documentação completa para os motores de armazenamento do MySQL?

A.2.2. Há algum novo mecanismo de armazenamento no MySQL 5.7?

A.2.3. Algumas engines de armazenamento foram removidas no MySQL 5.7?

A.2.4. Posso impedir o uso de um motor de armazenamento específico?

A.2.5. Há uma vantagem em usar exclusivamente o mecanismo de armazenamento InnoDB, em oposição a uma combinação de InnoDB e mecanismos de armazenamento não InnoDB?

A.2.6. Quais são os benefícios exclusivos do motor de armazenamento ARCHIVE?

<table border="0" style="width: 100%;">
<colgroup>
<col align="left" width="1%"/>
<col/>
</colgroup>
<tbody>
<tr class="question">
<td align="left" valign="top"><b>A.2.1.</b></td>
<td align="left" valign="top">
<p>Onde posso obter documentação completa para os motores de armazenamento do MySQL?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Veja o Capítulo 15.<i>Motores de Armazenamento Alternativos</i>Esse capítulo contém informações sobre todos os motores de armazenamento do MySQL, exceto o<code>InnoDB</code>motor de armazenamento e o<code>NDB</code>motor de armazenamento (usado para MySQL Cluster).<code>InnoDB</code>está coberto no Capítulo 14,<i>O motor de armazenamento InnoDB</i>. <code>NDB</code>está coberto no Capítulo 21,<i>MySQL NDB Cluster 7.5 e NDB Cluster 7.6</i>. </p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.2.2.</b></td>
<td align="left" valign="top">
<p>Existem novos motores de armazenamento no MySQL 5.7?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p> No. <code>InnoDB</code>é o mecanismo de armazenamento padrão para novas tabelas. Consulte a Seção 14.1, “Introdução ao InnoDB”, para obter detalhes.</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.2.3.</b></td>
<td align="left" valign="top">
<p>Algumas das engines de armazenamento foram removidas no MySQL 5.7?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p> No. </p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.2.4.</b></td>
<td align="left" valign="top">
<p>Posso impedir o uso de um motor de armazenamento específico?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Sim. O<code>disabled_storage_engines</code>A opção de configuração define quais motores de armazenamento não podem ser usados para criar tabelas ou espaços de tabela. Por padrão,<code>disabled_storage_engines</code>está vazio (sem motores desativados), mas pode ser configurado como uma lista de um ou mais motores separados por vírgulas.</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.2.5.</b></td>
<td align="left" valign="top">
<p>Há uma vantagem em usar o<code>InnoDB</code>motor de armazenamento exclusivamente, em oposição a uma combinação de<code>InnoDB</code>e não<code>InnoDB</code>motores de armazenamento?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>Sim. Usando<code>InnoDB</code>As tabelas exclusivamente podem simplificar as operações de backup e recuperação. O MySQL Enterprise Backup faz um backup quente de todas as tabelas que utilizam o<code>InnoDB</code>motor de armazenamento. Para tabelas que utilizam<code>MyISAM</code>ou outros não<code>InnoDB</code>para motores de armazenamento, ele realiza um backup "quente", onde o banco de dados continua em execução, mas essas tabelas não podem ser modificadas enquanto estão sendo respaldadas. Veja a Seção 28.1, "Visão Geral do Backup Empresarial do MySQL".</p>
</td>
</tr>
<tr class="question">
<td align="left" valign="top"><b>A.2.6.</b></td>
<td align="left" valign="top">
<p>Quais são os benefícios únicos do<code>ARCHIVE</code>motor de armazenamento?</p>
</td>
</tr>
<tr class="answer">
<td align="left" valign="top"></td>
<td align="left" valign="top">
<p>O<code>ARCHIVE</code>O mecanismo de armazenamento armazena grandes quantidades de dados sem índices; ele tem uma pequena pegada e realiza seleções usando varreduras de tabela. Consulte a Seção 15.5, “O mecanismo de armazenamento ARCHIVE”, para obter detalhes.</p>
</td>
</tr>
</tbody>
</table>