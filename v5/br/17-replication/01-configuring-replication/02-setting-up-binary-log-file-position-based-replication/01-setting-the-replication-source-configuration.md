#### 16.1.2.1 Configurando o Source de Replication

Para configurar um source para usar a Replication baseada na posição do arquivo de Binary Log, você deve garantir que o Binary Logging esteja habilitado e estabelecer um Server ID exclusivo.

Cada servidor em uma topologia de Replication deve ser configurado com um Server ID exclusivo, que você pode especificar usando a variável de sistema [\`server_id\`](replication-options.html#sysvar_server_id). Este Server ID é usado para identificar servidores individuais dentro da topologia de Replication e deve ser um inteiro positivo entre 1 e (2^32)−1. Você pode alterar o valor de [\`server_id\`](replication-options.html#sysvar_server_id) dinamicamente emitindo uma instrução como esta:

```sql
SET GLOBAL server_id = 2;
```

Com o Server ID padrão de 0, um source recusa qualquer conexão de replicas, e uma replica recusa conectar-se a um source, portanto, este valor não pode ser usado em uma topologia de Replication. Fora isso, a forma como você organiza e seleciona os Server IDs é uma escolha sua, desde que cada Server ID seja diferente de todos os outros Server IDs em uso por qualquer outro servidor na topologia de Replication. Observe que se um valor de 0 foi definido anteriormente para o Server ID, você deve reiniciar o servidor para inicializar o source com seu novo Server ID diferente de zero. Caso contrário, a reinicialização do servidor não é necessária, a menos que você precise habilitar o Binary Logging ou fazer outras alterações de configuração que exijam uma reinicialização.

O Binary Logging *deve* estar habilitado no source porque o Binary Log é a base para replicar alterações do source para suas replicas. Se o Binary Logging não estiver habilitado no source usando a opção `log-bin`, a Replication não é possível. Para habilitar o Binary Logging em um servidor onde ele ainda não está habilitado, você deve reiniciar o servidor. Neste caso, desligue o servidor MySQL e edite o arquivo `my.cnf` ou `my.ini`. Na seção `[mysqld]` do arquivo de configuração, adicione as opções `log-bin` e `server-id`. Se essas opções já existirem, mas estiverem comentadas, descomente as opções e altere-as de acordo com suas necessidades. Por exemplo, para habilitar o Binary Logging usando um prefixo de nome de arquivo de Log de `mysql-bin`, e configurar um Server ID de 1, use estas linhas:

```sql
[mysqld]
log-bin=mysql-bin
server-id=1
```

Após fazer as alterações, reinicie o servidor.

Nota

As seguintes opções impactam este procedimento:

* Para obter a maior durabilidade e consistência possível em uma configuração de Replication que usa [\`InnoDB\`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") com transactions, você deve usar `innodb_flush_log_at_trx_commit=1` e `sync_binlog=1` no arquivo `my.cnf` do source.

* Certifique-se de que a variável de sistema [\`skip_networking\`](server-system-variables.html#sysvar_skip_networking) não esteja habilitada no seu source. Se a rede tiver sido desabilitada, a replica não pode se comunicar com o source e a Replication falha.