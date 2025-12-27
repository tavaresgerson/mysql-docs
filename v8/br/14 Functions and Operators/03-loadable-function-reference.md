## 14.2 Referência de Funções Carregáveis

A tabela a seguir lista cada função que pode ser carregada dinamicamente e fornece uma breve descrição de cada uma. Para uma tabela que lista funções e operadores integrados, consulte a Seção 14.1, “Referência de Funções e Operadores Integrados”.

Para informações gerais sobre funções carregáveis, consulte a Seção 7.7, “Funções e Operadores Carregáveis do MySQL Server”.

**Tabela 14.2 Funções Carregáveis**

<table>
   <thead>
      <tr>
         <th>Nome</th>
         <th>Descrição</th>
         <th>Deprecated</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>asymmetric_decrypt()</code></th>
         <td> Decrypt ciphertext using private or public key </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asymmetric_derive()</code></th>
         <td> Derive symmetric key from asymmetric keys </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asymmetric_encrypt()</code></th>
         <td> Encrypt cleartext using private or public key </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asymmetric_sign()</code></th>
         <td> Generate signature from digest </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asymmetric_verify()</code></th>
         <td> Verify that signature matches digest </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_add_managed()</code></th>
         <td> Add a replication source server in a managed group to the source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_add_source()</code></th>
         <td> Add a replication source server to the source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_delete_managed()</code></th>
         <td> Remove managed group of replication source servers from the source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>asynchronous_connection_failover_delete_source()</code></th>
         <td> Remove a replication source server from the source list </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_api_message_emit_udf()</code></th>
         <td> Add message event to audit log </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_encryption_password_get()</code></th>
         <td> Fetch audit log encryption password </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_encryption_password_set()</code></th>
         <td> Set audit log encryption password </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_filter_flush()</code></th>
         <td> Flush audit log filter tables </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_filter_remove_filter()</code></th>
         <td> Remove audit log filter </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_filter_remove_user()</code></th>
         <td> Unassign audit log filter from user </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_filter_set_filter()</code></th>
         <td> Define audit log filter </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_filter_set_user()</code></th>
         <td> Assign audit log filter to user </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_read()</code></th>
         <td> Return audit log records </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_read_bookmark()</code></th>
         <td> Bookmark for most recent audit log event </td>
         <td></td>
      </tr>
      <tr>
         <th><code>audit_log_rotate()</code></th>
         <td> Rotate audit log file </td>
         <td></td>
      </tr>
      <tr>
         <th><code>create_asymmetric_priv_key()</code></th>
         <td> Create private key </td>
         <td></td>
      </tr>
      <tr>
         <th><code>create_asymmetric_pub_key()</code></th>
         <td> Create public key </td>
         <td></td>
      </tr>
      <tr>
         <th><code>create_dh_parameters()</code></th>
         <td> Generate shared DH secret </td>
         <td></td>
      </tr>
      <tr>
         <th><code>create_digest()</code></th>
         <td> Generate digest from string </td>
         <td></td>
      </tr>
      <tr>
         <th><code>firewall_group_delist()</code></th>
         <td> Remove account from firewall group profile </td>
         <td></td>
      </tr>
      <tr>
         <th><code>firewall_group_enlist()</code></th>
         <td> Add account to firewall group profile </td>
         <td></td>
      </tr>
      <tr>
         <th><code>flush_rewrite_rules()</code></th>
         <td> Load rewrite_rules table into Rewriter cache </td>
         <td></td>
      </tr>
      <tr>
         <th><code>gen_blacklist()</code></th>
         <td> Perform dictionary term replacement </td>
         <td>Yes</td>
      </tr>
      <tr>
         <th><code>gen_blocklist