## 3.5 Alterações no MySQL 8.4

Antes de fazer a atualização para o MySQL 8.4, revise as alterações descritas nas seções a seguir para identificar aquelas que se aplicam à sua instalação e aplicativos MySQL atuais.

* Alterações Incompatíveis no MySQL 8.4
* Alterações nos Padrões de Servidor

Além disso, você pode consultar os recursos listados aqui:

* Seção 1.4, “O que há de Novo no MySQL 8.4 desde o MySQL 8.0”
* Notas de Lançamento do MySQL 8.4

### Alterações Incompatíveis no MySQL 8.4

Esta seção contém informações sobre as alterações incompatíveis no MySQL 8.4.

**Índices espaciais.**
Ao fazer a atualização para o MySQL 8.4.4 ou posterior, recomenda-se que você exclua quaisquer índices espaciais previamente, e os recrie após a conclusão da atualização. Alternativamente, você pode excluir e recriar esses índices imediatamente após a atualização, mas antes de usar qualquer uma das tabelas nas quais ocorrem.

Para mais informações, consulte a Seção 13.4.10, “Criando Índices Espaciais”.

**A função `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()` foi removida.**
A função SQL `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, desatualizada no MySQL 8.0, foi removida; tentar invocá-la agora causa um erro de sintaxe. Use `WAIT_FOR_EXECUTED_GTID_SET()` em vez disso.

**Os plugins de autenticação `authentication_fido` e `authentication_fido_client` não estão mais disponíveis em algumas plataformas.**
Devido à atualização da biblioteca libfido2 incluída no servidor para a versão 1.13.0, que requer OpenSSL 1.1.1 ou superior, os plugins de autenticação `authentication_fido` e `authentication_fido_client` não estão mais disponíveis no Enterprise Linux 6, Enterprise Linux 7, Solaris 11 ou SUSE Enterprise Linux 12.

**`NULL` não permitido para opções de linha de comando.**
Definir variáveis do servidor iguais a `SQL NULL` na linha de comando não é suportado. No MySQL 8.4, definir qualquer um desses para `NULL` é especificamente desaconselhado, e tentar fazer isso é rejeitado com um erro.

As seguintes variáveis são exceções a essa restrição: `admin_ssl_ca`, `admin_ssl_capath`, `admin_ssl_cert`, `admin_ssl_cipher`, `admin_tls_ciphersuites`, `admin_ssl_key`, `admin_ssl_crl`, `admin_ssl_crlpath`, `basedir`, `character_sets_dir`, `ft_stopword_file`, `group_replication_recovery_tls_ciphersuites`, `init_file`, `lc_messages_dir`, `plugin_dir`, `relay_log`, `relay_log_info_file`, `replica_load_tmpdir`, `ssl_ca`, `ssl_capath`, `ssl_cert`, `ssl_cipher`, `ssl_crl`, `ssl_crlpath`, `ssl_key`, `socket`, `tls_ciphersuites` e `tmpdir`.

Veja também a Seção 7.1.8, “Variáveis do Sistema do Servidor”.

Para obter informações adicionais sobre as alterações no MySQL 8.4, consulte a Seção 1.4, “O que há de novo no MySQL 8.4 desde o MySQL 8.0”.

### Padrões de servidor alterados

Esta seção contém informações sobre as variáveis do sistema do servidor MySQL cujos valores padrão foram alterados no MySQL 8.4 em comparação com o MySQL 8.0.

<table><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Variável do Sistema</th> <th>Definição Antiga</th> <th>Definição Nova</th> </tr></thead><tbody><tr> <td><span><em>Mudanças no InnoDB</em></span></td> <td></td> <td></td> </tr><tr> <td><code>innodb_adaptive_hash_index</code></td> <td><code>ON</code></td> <td><code>OFF</code></td> </tr><tr> <td><code>innodb_buffer_pool_in_core_file</code></td> <td><code>ON</code></td> <td><code>OFF</code></td> </tr><tr> <td><code>innodb_buffer_pool_instances</code></td> <td>Se <code>innodb_buffer_pool_size</code> &lt; 1GB: 1; caso contrário: 8</td> <td>Se <code>innodb_buffer_pool_size</code> &lt;= 1GB: 1; caso contrário: <code>MIN( 0.5 * (</code><code>innodb_buffer_pool_size</code><code> / </code><code>innodb_buffer_pool_chunk_size</code><code>), 0.25 * <em><code>number_of_cpus</code></em>)</code></td> </tr><tr> <td><code>innodb_change_buffering</code></td> <td><code>all</code></td> <td><code>none</code></td> </tr><tr> <td><code>innodb_doublewrite_files</code></td> <td><code>innodb_buffer_pool_instances</code><code> * 2</code></td> <td>2</td> </tr><tr> <td><code>innodb_doublewrite_pages</code></td> <td>Valor de <code>innodb_write_io_threads</code></td> <td>128</td> </tr><tr> <td><code>innodb_flush_method</code></td> <td><code>fsync</code></td> <td><code>O_DIRECT</code> se suportado, caso contrário <code>fsync</code></td> </tr><tr> <td><code>innodb_io_capacity</code></td> <td>200</td> <td>10000</td> </tr><tr> <td><code>innodb_io_capacity_max</code></td> <td><code>MIN(2 * </code><code>innodb_io_capacity</code><code>, 2000)</code></td> <td><code>2 * innodb_io_capacity</code></td> </tr><tr> <td><code>innodb_log_buffer_size</code></td> <td>16777216</td> <td>67108864</td> </tr><tr> <td><code>innodb_numa_interleave</code></td> <td><code>OFF</code></td> <td><code>ON</code></td> </tr><tr> <td><code>innodb_page_cleaners</code></td> <td>4</td> <td>Valor de <code>innodb_buffer_pool_instances</code></td> </tr><tr> <td><code>innodb_parallel_read_threads</code></td> <td>4</td> <td><code>MIN(<em><code>number_of_cpus</code></em> / 8, 4)</code></td> </tr><tr> <td><code>innodb_purge_threads</code></td> <td>4</td> <td>Se <code>number_of_cpus</code> &lt;= 16: 1; caso contrário: 4</td> </tr><tr> <td><code>innodb_use_fdatasync</code></td> <td><code>OFF</code></td> <td><code>ON</code></td> </tr><tr> <td><span><em>Mudanças no Replicação de Grupo</em></span></td> <td></td> <td></td> </tr><tr> <td><code>group_replication_consistency</code></td> <td><code>EVENTUAL</code></td> <td><code>BEFORE_ON_PRIMARY_FAILOVER</code></td> </tr><tr> <td><code>group_replication_exit_state_action</code></td> <td><code>READ_ONLY</code></td> <td><code>OFFLINE_MODE</code></td> </tr><tr> <td><span><em>Mudanças em Tabelas Temporárias</em></span></td> <td></td> <td></td> </tr><tr> <td><code>temptable_max_mmap</code></td> <td>1073741824</td> <td>0</td> </tr><tr> <td><code>temptable_max_ram</code></td> <td>1073741824</td> <td>3% do total de memória dentro de um intervalo de 1-4 (GB)</td> </tr><tr> <td><code>temptable_use_mmap</code></td> <td><code>ON</code></td> <td><code>OFF</code></td> </tr></tbody></table>

Para obter mais informações sobre as opções ou variáveis que foram adicionadas, consulte as alterações de opções e variáveis para o MySQL 8.4, no *Referência da Versão do Servidor MySQL*.

Embora os novos padrões de configuração sejam as melhores escolhas para a maioria dos casos de uso, existem casos especiais, bem como razões legadas para usar as opções de configuração existentes. Por exemplo, algumas pessoas preferem atualizar para o MySQL 8.4 com o menor número possível de alterações em seus aplicativos ou ambientes operacionais. Recomendamos avaliar todos os novos padrões de configuração e usar quantos puderem.

A tabela `variables_info` do Schema de Desempenho mostra, para cada variável do sistema, a fonte de onde ela foi definida mais recentemente, bem como sua faixa de valores. Isso fornece acesso SQL a tudo o que há para saber sobre uma variável do sistema e seus valores.