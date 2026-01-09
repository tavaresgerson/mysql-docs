### 6.1.4 Opções e variáveis relacionadas à segurança do mysqld

A tabela a seguir mostra as opções do **mysqld** e as variáveis do sistema que afetam a segurança. Para descrições de cada uma delas, consulte Seção 5.1.6, “Opções de Comando do Servidor” e Seção 5.1.7, “Variáveis do Sistema do Servidor”.

**Tabela 6.1 Resumo das Opções de Segurança e Variáveis**

<table frame="box" rules="all" summary="Opções de linha de comando relacionadas à segurança e variáveis do sistema.">
   <thead>
      <tr>
         <th>Nome</th>
         <th>Linha de comando</th>
         <th>Arquivo de Opções</th>
         <th>Sistema Var</th>
         <th>Status Var</th>
         <th>Var Scope</th>
         <th>Dinâmico</th>
      </tr>
   </thead>
   <tbody>
      <tr>
         <th>permitir-udfs-suspeito</th>
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
         <th>chroot</th>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
      </tr>
      <tr>
         <th>des-chave-arquivo</th>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td></td>
         <td></td>
         <td></td>
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
         <th>senhas antigas</th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Ambos</td>
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
         <th>secure_auth</th>
         <td>Sim</td>
         <td>Sim</td>
         <td>Sim</td>
         <td></td>
         <td>Global</td>
         <td>Sim</td>
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
         <th>mesas-de-refeição-gratuitas</th>
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
   </tbody>
</table>
