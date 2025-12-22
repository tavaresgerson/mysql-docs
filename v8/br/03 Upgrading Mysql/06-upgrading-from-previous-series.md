## 3.5 Alterações no MySQL 8.4

Antes de atualizar para o MySQL 8.4, revise as alterações descritas nas seções seguintes para identificar as que se aplicam à sua instalação e aplicações MySQL atuais.

- Alterações incompatíveis no MySQL 8.4
- Alteração dos padrões do servidor

Além disso, pode consultar os recursos que se encontram aqui:

- Seção 1.4, "O que há de novo no MySQL 8.4 desde o MySQL 8.0"
- Notas de lançamento do MySQL 8.4

### Alterações incompatíveis no MySQL 8.4

Esta secção contém informações sobre alterações incompatíveis no MySQL 8.4.

- \*\* Índices espaciais. \*\* Ao atualizar para o MySQL 8.4.4 ou posterior, recomenda-se que você deixe de lado quaisquer índices espaciais de antemão, e depois recriá-los após a atualização ser concluída. Alternativamente, você pode deixar de lado e recriar tais índices imediatamente após a atualização, mas antes de usar qualquer uma das tabelas em que eles ocorrem.

  Para mais informações, ver Secção 13.4.10, "Criar índices espaciais".
- \*\* A função `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` do SQL, depreciada no MySQL 8.0 foi removida; tentar invocá-la agora causa um erro de sintaxe. Use `WAIT_FOR_EXECUTED_GTID_SET()` em vez disso.
- \*\* Devido à atualização da biblioteca libfido2 incluída com o servidor para a versão 1.13.0, que requer OpenSSL 1.1.1 ou superior, os plugins de autenticação `authentication_fido` e `authentication_fido_client` não estão mais disponíveis no Enterprise Linux 6, Enterprise Linux 7, Solaris 11 ou SUSE Enterprise Linux 12.
- \*\* NULL não é permitido para opções de linha de comando. \*\* A definição de variáveis do servidor iguais a SQL `NULL` na linha de comando não é suportada. No MySQL 8.4, a definição de qualquer uma delas para `NULL` é especificamente desautorizada, e a tentativa de fazer isso é rejeitada com um erro.

  As seguintes variáveis são excluídas desta restrição: `admin_ssl_ca`, `admin_ssl_capath`, `admin_ssl_cert`, `admin_ssl_cipher`, `admin_tls_ciphersuites`, `admin_ssl_key`, `admin_ssl_crl`, `admin_ssl_crlpath`, `basedir`, `character_sets_dir`, `ft_stopword_file`, `group_replication_recovery_tls_ciphersuites`, `init_file`, `lc_messages_dir`, `plugin_dir`, `relay_log`, `relay_log_info_file`, `replica_load_tmpdir`, `ssl_ca`, `ssl_capath`, `ssl_cert`, `ssl_cipher`, `ssl_crl`, `ssl_crlpath`, `ssl_key`, `socket`, `tmpdir` e `tls_ciphersuites`.

  Ver também a secção 7.1.8, "Variaveis do sistema do servidor".

Para informações adicionais sobre as mudanças no MySQL 8.4, consulte a Seção 1.4, "O que há de novo no MySQL 8.4 desde o MySQL 8.0".

### Alteração dos padrões do servidor

Esta secção contém informações sobre variáveis do sistema do servidor MySQL cujos valores padrão foram alterados no MySQL 8.4 em comparação com o MySQL 8.0.

<table><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Variável do sistema</th> <th>Antigo padrão</th> <th>Novo padrão</th> </tr></thead><tbody><tr> <td><span><em>Alterações do InnoDB</em></span></td> <td></td> <td></td> </tr><tr> <td>[[PH_HTML_CODE_<code>( 0.5 * (</code>]</td> <td>[[PH_HTML_CODE_<code>( 0.5 * (</code>]</td> <td>[[PH_HTML_CODE_<code> / </code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>innodb_buffer_pool_chunk_size</code>]</td> <td>[[PH_HTML_CODE_<code>), 0.25 * <em><code>number_of_cpus</code>]</td> <td>[[PH_HTML_CODE_<code>innodb_change_buffering</code>]</td> </tr><tr> <td>[[PH_HTML_CODE_<code>all</code>]</td> <td>[[PH_HTML_CODE_<code>none</code>] &lt; 1GB: 1; caso contrário: 8</td> <td>[[PH_HTML_CODE_<code>innodb_doublewrite_files</code>] &lt;= 1GB: 1; caso contrário: [[PH_HTML_CODE_<code>innodb_buffer_pool_instances</code>][[<code>( 0.5 * (</code>]][[<code>ON</code><code>( 0.5 * (</code>][[<code> / </code>]][[<code>innodb_buffer_pool_chunk_size</code>]][[<code>), 0.25 * <em><code>number_of_cpus</code>]]</em>)</code></td> </tr><tr> <td>[[<code>innodb_change_buffering</code>]]</td> <td>[[<code>all</code>]]</td> <td>[[<code>none</code>]]</td> </tr><tr> <td>[[<code>innodb_doublewrite_files</code>]]</td> <td>[[<code>innodb_buffer_pool_instances</code>]][[<code>OFF</code><code>( 0.5 * (</code>]</td> <td>2 .</td> </tr><tr> <td>[[<code>OFF</code><code>( 0.5 * (</code>]</td> <td>Valor de [[<code>OFF</code><code> / </code>]</td> <td>128, com a seguinte redacção</td> </tr><tr> <td>[[<code>OFF</code><code>innodb_buffer_pool_chunk_size</code>]</td> <td>[[<code>OFF</code><code>), 0.25 * <em><code>number_of_cpus</code>]</td> <td>[[<code>OFF</code><code>innodb_change_buffering</code>] se suportado, caso contrário [[<code>OFF</code><code>all</code>]</td> </tr><tr> <td>[[<code>OFF</code><code>none</code>]</td> <td>200 milhões de</td> <td>10 000 milhões</td> </tr><tr> <td>[[<code>OFF</code><code>innodb_doublewrite_files</code>]</td> <td>[[<code>OFF</code><code>innodb_buffer_pool_instances</code>][[<code>innodb_buffer_pool_in_core_file</code><code>( 0.5 * (</code>][[<code>innodb_buffer_pool_in_core_file</code><code>( 0.5 * (</code>]</td> <td>[[<code>innodb_buffer_pool_in_core_file</code><code> / </code>]</td> </tr><tr> <td>[[<code>innodb_buffer_pool_in_core_file</code><code>innodb_buffer_pool_chunk_size</code>]</td> <td>16777216</td> <td>67108864</td> </tr><tr> <td>[[<code>innodb_buffer_pool_in_core_file</code><code>), 0.25 * <em><code>number_of_cpus</code>]</td> <td>[[<code>innodb_buffer_pool_in_core_file</code><code>innodb_change_buffering</code>]</td> <td>[[<code>innodb_buffer_pool_in_core_file</code><code>all</code>]</td> </tr><tr> <td>[[<code>innodb_buffer_pool_in_core_file</code><code>none</code>]</td> <td>Quatro</td> <td>Valor de [[<code>innodb_buffer_pool_in_core_file</code><code>innodb_doublewrite_files</code>]</td> </tr><tr> <td>[[<code>innodb_buffer_pool_in_core_file</code><code>innodb_buffer_pool_instances</code>]</td> <td>Quatro</td> <td>[[<code>ON</code><code>( 0.5 * (</code>]</em>/ 8, 4)</code></td> </tr><tr> <td>[[<code>ON</code><code>( 0.5 * (</code>]</td> <td>Quatro</td> <td>Se número_de_cpus &lt;= 16: 1; caso contrário: 4</td> </tr><tr> <td>[[<code>ON</code><code> / </code>]</td> <td>[[<code>ON</code><code>innodb_buffer_pool_chunk_size</code>]</td> <td>[[<code>ON</code><code>), 0.25 * <em><code>number_of_cpus</code>]</td> </tr><tr> <td><span><em>Alterações de replicação de grupo</em></span></td> <td></td> <td></td> </tr><tr> <td>[[<code>ON</code><code>innodb_change_buffering</code>]</td> <td>[[<code>ON</code><code>all</code>]</td> <td>[[<code>ON</code><code>none</code>]</td> </tr><tr> <td>[[<code>ON</code><code>innodb_doublewrite_files</code>]</td> <td>[[<code>ON</code><code>innodb_buffer_pool_instances</code>]</td> <td>[[<code>OFF</code><code>( 0.5 * (</code>]</td> </tr><tr> <td><span><em>Alterações temporárias da tabela</em></span></td> <td></td> <td></td> </tr><tr> <td>[[<code>OFF</code><code>( 0.5 * (</code>]</td> <td>1073741824</td> <td>0 0</td> </tr><tr> <td>[[<code>OFF</code><code> / </code>]</td> <td>1073741824</td> <td>3% da memória total num intervalo de 1-4 (GB)</td> </tr><tr> <td>[[<code>OFF</code><code>innodb_buffer_pool_chunk_size</code>]</td> <td>[[<code>OFF</code><code>), 0.25 * <em><code>number_of_cpus</code>]</td> <td>[[<code>OFF</code><code>innodb_change_buffering</code>]</td> </tr></tbody></table>

Para mais informações sobre as opções ou variáveis que foram adicionadas, consulte Option and Variable Changes for MySQL 8.4, no *MySQL Server Version Reference*.

Embora os novos padrões sejam as melhores opções de configuração para a maioria dos casos de uso, existem casos especiais, bem como razões legadas para o uso de opções de configuração existentes.

A tabela de Performance Schema `variables_info` mostra, para cada variável do sistema, a fonte a partir da qual ela foi definida mais recentemente, bem como seu intervalo de valores.
