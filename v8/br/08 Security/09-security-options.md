### 8.1.4 Opções e variáveis relacionadas à segurança do `mysqld`

A tabela a seguir mostra as opções e variáveis do `mysqld` que afetam a segurança. Para descrições de cada uma delas, consulte a Seção 7.1.7, “Opções de comando do servidor”, e a Seção 7.1.8, “Variáveis do sistema do servidor”.

**Tabela 8.1 Resumo de opções e variáveis de segurança**

<table>
   <thead>
      <tr>
         <th>Nome</th>
         <th>Linha de Comando</th>
         <th>Arquivo de Opções</th>
         <th>Variável do Sistema</th>
         <th>Variável de Estado</th>
         <th>Alcance da Variável</th>
         <th>Dinâmica</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th><code>allow-suspicious-udfs</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>automatic_sp_privileges</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Sim</td>
      </tr>
      <tr>
         <th><code>chroot</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>local_infile</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Sim</td>
      </tr>
      <tr>
         <th><code>safe-user-create</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>secure_file_priv</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Não</td>
      </tr>
      <tr>
         <th><code>skip-grant-tables</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th><code>skip_name_resolve</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Não</td>
      </tr>
      <tr>
         <th><code>skip_networking</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Não</td>
      </tr>
      <tr>
         <th><code>skip_show_database</code></th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Não</td>
      </tr>
   </tbody>
</table>