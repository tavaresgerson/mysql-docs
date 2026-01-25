### 16.1.6 Opções e Variáveis de Replication e Binary Logging

[16.1.6.1 Referência de Opções e Variáveis de Replication e Binary Logging](replication-options-reference.html)

[16.1.6.2 Opções e Variáveis da Fonte de Replication](replication-options-source.html)

[16.1.6.3 Opções e Variáveis do Servidor Replica](replication-options-replica.html)

[16.1.6.4 Opções e Variáveis de Binary Logging](replication-options-binary-log.html)

[16.1.6.5 Variáveis de Sistema de Global Transaction ID](replication-options-gtids.html)

As seções a seguir contêm informações sobre as opções do [**mysqld**](mysqld.html "4.3.1 mysqld — O Servidor MySQL") e variáveis de servidor que são usadas na Replication e para controlar o Binary Log. Opções e variáveis para uso em sources e replicas são abordadas separadamente, assim como opções e variáveis relacionadas a Binary Logging e Global Transaction Identifiers (GTIDs). Um conjunto de tabelas de referência rápida fornecendo informações básicas sobre estas opções e variáveis também está incluído.

De particular importância é a variável de sistema [`server_id`](replication-options.html#sysvar_server_id).

<table frame="box" rules="all" summary="Propriedades para server_id"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--server-id=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code>server_id</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Integer</td> </tr><tr><th>Valor Padrão</th> <td><code>0</code></td> </tr><tr><th>Valor Mínimo</th> <td><code>0</code></td> </tr><tr><th>Valor Máximo</th> <td><code>4294967295</code></td> </tr></tbody></table>

Esta variável especifica o Server ID. No MySQL 5.7, [`server_id`](replication-options.html#sysvar_server_id) deve ser especificada se o Binary Logging estiver habilitado, caso contrário, o servidor não tem permissão para iniciar.

[`server_id`](replication-options.html#sysvar_server_id) é definido como 0 por padrão. Em um servidor source de Replication e em cada replica, você *deve* especificar [`server_id`](replication-options.html#sysvar_server_id) para estabelecer um ID de Replication único no intervalo de 1 a 232 − 1. "Único" significa que cada ID deve ser diferente de qualquer outro ID em uso por qualquer outro source ou replica na topologia de Replication. Para informações adicionais, consulte [Seção 16.1.6.2, “Opções e Variáveis da Fonte de Replication”](replication-options-source.html "16.1.6.2 Opções e Variáveis da Fonte de Replication"), e [Seção 16.1.6.3, “Opções e Variáveis do Servidor Replica”](replication-options-replica.html "16.1.6.3 Opções e Variáveis do Servidor Replica").

Se o Server ID for definido como 0, o Binary Logging ocorre, mas um source com um Server ID de 0 recusa quaisquer conexões de replicas, e uma replica com um Server ID de 0 recusa conectar-se a um source. Observe que, embora você possa alterar o Server ID dinamicamente para um valor diferente de zero, isso não permite que a Replication comece imediatamente. Você deve alterar o Server ID e, em seguida, reiniciar o servidor para inicializar a replica.

Para mais informações, consulte [Seção 16.1.2.5.1, “Configurando a Configuração da Replica”](replication-setup-replicas.html#replication-howto-slavebaseconfig "16.1.2.5.1 Configurando a Configuração da Replica").

[`server_uuid`](replication-options.html#sysvar_server_uuid)

No MySQL 5.7, o servidor gera um UUID verdadeiro além do valor de [`server_id`](replication-options.html#sysvar_server_id) fornecido pelo usuário. Isso está disponível como a variável de sistema global e somente leitura [`server_uuid`](replication-options.html#sysvar_server_uuid).

Nota

A presença da variável de sistema [`server_uuid`](replication-options.html#sysvar_server_uuid) no MySQL 5.7 não altera a exigência de definir um valor de [`server_id`](replication-options.html#sysvar_server_id) exclusivo para cada servidor MySQL como parte da preparação e execução da Replication MySQL, conforme descrito anteriormente nesta seção.

<table frame="box" rules="all" summary="Propriedades para server_uuid"><tbody><tr><th>Variável de Sistema</th> <td><code>server_uuid</code></td> </tr><tr><th>Escopo</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>String</td> </tr></tbody></table>

Ao iniciar, o servidor MySQL obtém um UUID automaticamente da seguinte forma:

1. Tenta ler e usar o UUID escrito no arquivo `data_dir/auto.cnf` (onde *`data_dir`* é o diretório de dados do servidor).

2. Se `data_dir/auto.cnf` não for encontrado, gera um novo UUID e o salva neste arquivo, criando o arquivo se necessário.

O arquivo `auto.cnf` possui um formato semelhante ao usado para os arquivos `my.cnf` ou `my.ini`. No MySQL 5.7, `auto.cnf` tem apenas uma única seção `[auto]` contendo uma única configuração e valor de [`server_uuid`](replication-options.html#sysvar_server_uuid); o conteúdo do arquivo se parece com o que é mostrado aqui:

```sql
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Importante

O arquivo `auto.cnf` é gerado automaticamente; não tente escrever ou modificar este arquivo.

Ao usar a Replication MySQL, sources e replicas conhecem os UUIDs uns dos outros. O valor do UUID de uma replica pode ser visto na saída do [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement"). Uma vez que [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") tenha sido executado, o valor do UUID do source fica disponível na replica na saída do [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

Nota

A emissão de uma instrução [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") ou [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") *não* redefine o UUID do source conforme usado na replica.

O `server_uuid` de um servidor também é usado em GTIDs para transações originadas nesse servidor. Para mais informações, consulte [Seção 16.1.3, “Replication com Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication com Global Transaction Identifiers").

Ao iniciar, a I/O Thread de Replication gera um erro e aborta se o UUID do seu source for igual ao seu próprio, a menos que a opção [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id) tenha sido definida. Além disso, a I/O Thread de Replication gera um aviso se qualquer um dos seguintes for verdadeiro:

* Nenhum source com o [`server_uuid`](replication-options.html#sysvar_server_uuid) esperado existe.

* O [`server_uuid`](replication-options.html#sysvar_server_uuid) do source foi alterado, embora nenhuma instrução [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") tenha sido executada.