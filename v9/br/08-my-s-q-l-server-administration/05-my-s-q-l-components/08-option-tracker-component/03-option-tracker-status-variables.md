#### 7.5.8.3 Variáveis de Status do Rastreador de Opções

O componente Rastreador de Opções fornece uma série de variáveis de status, que são descritas nesta seção.

**Tabela 7.9 Resumo das Variáveis de Status do Rastreador de Opções**

<table frame="box" rules="all" summary="Referência para variáveis de status fornecidas pelo Rastreador de Opções.">
<tr>
<th>Nome da Variável</th>
<th>Tipo da Variável</th>
<th>Alcance da Variável</th>
</tr>
<tr>
<th>option_tracker_usage:AWS keyring plugin</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Binary Log</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Connection control component</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Connection DoS control</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Encrypted File keyring</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Enterprise AUDIT</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Enterprise Data Masking</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Enterprise Encryption</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Enterprise Firewall</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Enterprise Thread Pool</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:File keyring</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Group Replication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Hashicorp keyring</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Hypergraph Optimizer</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:HyperLogLog</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:JavaScript Library</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:JavaScript Stored Program</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:JSON Duality View</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Kerberos authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:LDAP Simple authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Server</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Shell</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Shell _ Copy</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Shell _ Dump</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Shell _ Dump _ Load</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Shell for VS Code</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Shell _ MRS</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:MySQL Telemetry</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:OCI Authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Oracle Key Vault keyring</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:PAM authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Password validation</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Replication Replica</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:SASL LDAP Authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Scheduler</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Traditional MySQL Optimizer</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Vector</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:WebAssembly Library</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:WebauthN authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker_usage:Windows authentication</th>
<th>Integer</th>
<th>Global</th>
</tr>
<tr>
<th>option_tracker.gr_complete_table

* `option_tracker_usage:AWS keyring plugin`

  Número de vezes que uma função de chave de registro de propósito geral foi chamada usando o plugin AWS keyring.

* `option_tracker_usage:Binary Log`

  Incrementado a cada 600 segundos (10 minutos) enquanto o registro binário estiver ativado.

* `option_tracker_usage:Connection control component`

  Número de vezes que uma tentativa de conexão falhou foi adiada.

* `option_tracker_usage:Connection DoS control`

  Número de vezes que uma tentativa de conexão falhou foi adiada.

* `option_tracker_usage:Encrypted File keyring`

  Número de vezes que qualquer uma das funções de chave de registro de propósito geral (veja a Seção 8.4.5.15, “Funções de Gerenciamento de Chave de Registro de Propósito Geral”) foi chamada.

* `option_tracker_usage:Enterprise AUDIT`

  Este contador é incrementado quando qualquer função do plugin de registro de auditoria é chamada, ou quando um novo arquivo de saída de auditoria é aberto para escrita. Consulte a Seção 8.4.6, “Auditoria do MySQL Enterprise”, para mais informações.

* `option_tracker_usage:Enterprise Data Masking`

  Este valor é incrementado cada vez que uma função de Máscara de Dados do MySQL Enterprise é usada. Consulte a Seção 8.5, “Máscara de Dados do MySQL Enterprise”.

* `option_tracker_usage:Enterprise Encryption`

  Este valor é incrementado cada vez que uma função de Encriptação do MySQL Enterprise é chamada. Consulte a Seção 8.6, “Encriptação do MySQL Enterprise”, para mais informações.

* `option_tracker_usage:Enterprise Firewall`

  Esta variável de status é incrementada cada vez que uma função administrativa do MySQL Enterprise Firewall é chamada, ou uma declaração é adicionada, marcada ou rejeitada. Consulte a Seção 8.4.8, “MySQL Enterprise Firewall”.

* `option_tracker_usage:Enterprise Thread Pool`

O número de vezes que o plugin do Pool de Fios do MySQL Enterprise foi inicializado ou uma nova conexão foi adicionada. Consulte a Seção 7.6.3, “MySQL Enterprise Thread Pool”, para obter mais informações.

* `option_tracker_usage:File keyring`

  Esta variável é incrementada cada vez que qualquer função do bloco de chaves de propósito geral (consulte a Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Bloco de Chaves de Propósito Geral”) é chamada.

* `option_tracker_usage:Group Replication`

  Esta variável de status é incrementada a cada 600 segundos (10 minutos) sempre que o plugin de Replicação de Grupo do MySQL estiver em execução. Consulte o Capítulo 20, *Replicação de Grupo*.

* `option_tracker_usage:Hashicorp keyring`

  O número de vezes que qualquer uma das funções do bloco de chaves de propósito geral (consulte a Seção 8.4.5.15, “Funções de Gerenciamento de Chaves de Bloco de Chaves de Propósito Geral”) foi chamada usando o componente de bloco de chaves Hashicorp.

* `option_tracker_usage:Hypergraph Optimizer`

  Número de vezes que uma consulta foi otimizada usando o Hypergraph Optimizer. Apenas MySQL HeatWave.

* `option_tracker_usage:HyperLogLog`

  Incrementada sempre que a função agregada `HLL()` é chamada. Apenas MySQL HeatWave.

* `option_tracker_usage:JavaScript Library`

  Número de vezes que uma biblioteca JavaScript foi criada ou usada. Consulte a Seção 27.3.8, “Usando Bibliotecas JavaScript”.

* `option_tracker_usage:JavaScript Stored Program`

  Incrementada cada vez que um programa JavaScript é invocado. Consulte a Seção 27.3, “Programas Armazenados JavaScript”.

* `option_tracker_usage:JSON Duality View`

  Número de vezes que uma visualização de dualidade JSON foi aberta. Consulte a Seção 27.7, “Visualizações de Dualidade JSON”.

* `option_tracker_usage:Kerberos authentication`

Quando qualquer uma das funções do bloco de chave de propósito geral (ver Seção 8.4.5.15, “Funções de Gerenciamento de Chave de Bloco de Chave de Propósito Geral”) é chamada usando o componente de autenticação Kerberos.

* `option_tracker_usage:LDAP Autenticação Simples`

  Incrementada sempre que qualquer uma das funções do bloco de chave de propósito geral (ver Seção 8.4.5.15, “Funções de Gerenciamento de Chave de Bloco de Chave de Propósito Geral”) é chamada usando o plugin `authentication_ldap_simple`.

* `option_tracker_usage:MySQL Server`

  Esta variável de status é resetada para 0 sempre que o servidor MySQL é reiniciado. Posteriormente, ela é incrementada a cada 600 segundos (10 minutos) enquanto o servidor estiver em execução.

* `option_tracker_usage-MySQL_Shell_VSC_HeatWave_Chat`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_VSC_Natural_Language_to_SQL`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_VSC_Lakehouse_Navigator`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_for_VS_Code`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_Dump`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_VSC_Dump`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_Dump_Load`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_VSC_Dump_Load`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_MRS`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_VSC_MRS`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_Copy`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage-MySQL_Shell_Upgrade_Checker`

  Reservado para desenvolvimento futuro.

* `option_tracker_usage:MySQL Telemetria`

  Este valor é incrementado a cada 1000ª vez que traços, registros ou métricas são exportados.

* `option_tracker_usage:Autenticação OCI`

  Incrementado a cada vez que qualquer função do plugin de autenticação OCI é chamada.

* `option_tracker_usage:Chave do Oracle Key Vault`

  O número de vezes que qualquer uma das funções de gerenciamento de chave do bloco de chave de propósito geral (consulte a Seção 8.4.5.15, “Funções de Gerenciamento de Chave do Bloco de Chave de Propósito Geral”) foi chamada usando o plugin de chave do Oracle Key Vault.

* `option_tracker_usage:Autenticação PAM`

  O número de vezes que qualquer uma das funções de gerenciamento de chave do bloco de chave de propósito geral (consulte a Seção 8.4.5.15, “Funções de Gerenciamento de Chave do Bloco de Chave de Propósito Geral”) foi chamada usando o plugin de autenticação PAM. Para mais informações, consulte a Seção 8.4.1.4, “Autenticação Plugável PAM”.

* `option_tracker_usage:Validação de senha`

  O número de vezes que as senhas foram avaliadas quanto à força, validadas ou alteradas usando `component_validate_password`. Consulte a Seção 8.4.4, “O Componente de Validação de Senha”.

* `option_tracker_usage:Replica de replicação`

  A cada 600 segundos (10 minutos) sempre que a replicação estiver habilitada e este servidor estiver atuando como uma replica; reinicialize cada vez que um secundário for reiniciado ou o primário for alterado.

* `option_tracker_usage:Autenticação LDAP SASL`

  O número de vezes que uma senha foi avaliada quanto à força, validadas ou alteradas usando o plugin `authentication_ldap_sasl`. Consulte a Seção 8.4.1.6, “Autenticação Plugável LDAP”, para mais informações.

* `option_tracker_usage:Cronograma`

  O número de vezes que uma tarefa agendada foi criada, executada ou excluída usando o componente Cronograma. Consulte a Seção 7.5.5, “Componente Cronograma”.

* `option_tracker_usage:Otimizador MySQL tradicional`

Este é o número de vezes que as consultas foram executadas usando o otimizador tradicional do MySQL.

* `option_tracker_usage:Vector`

  Incrementado sempre que a função `DISTANCE()` ou seu alias `VECTOR_DISTANCE()` for chamada (apenas MySQL HeatWave)

* `option_tracker_usage:WebAssembly Library`

  O número de vezes que as bibliotecas WebAssembly foram criadas ou usadas. Veja a Seção 27.3.9, “Usando Bibliotecas WebAssembly”, para mais informações.

* `option_tracker_usage:WebauthN authentication`

  O número de vezes que qualquer uma das funções gerais do chaveiro (veja a Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Chaveiro de Propósito Geral”) foi chamada usando o plugin de autenticação WebauthN. Para mais informações, veja a Seção 8.4.1.11, “Autenticação WebAuthn Pluggable”.

* `option_tracker_usage:Windows authentication`

  Este valor é incrementado cada vez que qualquer uma das funções gerais do chaveiro (veja a Seção 8.4.5.15, “Funções de Gerenciamento de Chaves do Chaveiro de Propósito Geral”) é chamada usando o plugin de autenticação MySQL Windows. Veja a Seção 8.4.1.5, “Autenticação Pluggable Windows”, para mais informações.

* `option_tracker.gr_complete_table_received`

  Este é o número de tabelas completas que foram recebidas através da Replicação por Grupo.

* `option_tracker.gr_complete_table_sent`

  Este é o número de tabelas completas que foram enviadas através da Replicação por Grupo.

* `option_tracker.gr_error_received`

  Este é o número de erros que foram recebidos através da Replicação por Grupo.

* `option_tracker.gr_error_sent`

  Este é o número de erros que foram enviados através da Replicação por Grupo.

* `option_tracker.gr_reset_request_received`

  Este é o número de solicitações de reinicialização que foram recebidas através da Replicação por Grupo.

* `option_tracker.gr_reset_request_sent`

  Este é o número de solicitações de reinicialização enviadas por meio da Replicação em Grupo.

* `option_tracker.gr_single_row_received`

  Este é o número de linhas únicas recebidas por meio da Replicação em Grupo.

* `option_tracker.gr_single_row_sent`

  Este é o número de linhas únicas enviadas por meio da Replicação em Grupo.