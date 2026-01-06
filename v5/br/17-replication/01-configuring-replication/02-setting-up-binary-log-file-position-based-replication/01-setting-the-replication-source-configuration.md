#### 16.1.2.1 Configuração da fonte de replicação

Para configurar uma fonte para usar a replicação com base na posição do arquivo de log binário, você deve garantir que o registro binário esteja habilitado e estabelecer um ID de servidor único.

Cada servidor dentro de uma topologia de replicação deve ser configurado com um ID de servidor único, que você pode especificar usando a variável de sistema `server_id`. Esse ID de servidor é usado para identificar servidores individuais dentro da topologia de replicação e deve ser um número inteiro positivo entre 1 e (232) - 1. Você pode alterar o valor da variável de sistema `server_id` dinamicamente, emitindo uma declaração como esta:

```sql
SET GLOBAL server_id = 2;
```

Com o ID de servidor padrão de 0, uma fonte recusa quaisquer conexões de réplicas, e uma réplica se recusa a se conectar a uma fonte, portanto, esse valor não pode ser usado em uma topologia de replicação. Além disso, a forma como você organiza e seleciona os IDs de servidor é sua escolha, desde que cada ID de servidor seja diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação. Observe que, se um valor de 0 foi definido anteriormente para o ID de servidor, você deve reiniciar o servidor para inicializar a fonte com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário, a menos que você precise habilitar o registro binário ou fazer outras alterações de configuração que exijam um reinício.

O registro binário *deve* ser habilitado na fonte porque o log binário é a base para a replicação das alterações da fonte para suas réplicas. Se o registro binário não estiver habilitado na fonte usando a opção `log-bin`, a replicação não será possível. Para habilitar o registro binário em um servidor onde ele ainda não está habilitado, você deve reiniciar o servidor. Nesse caso, desligue o servidor MySQL e edite o arquivo `my.cnf` ou `my.ini`. Na seção `[mysqld]` do arquivo de configuração, adicione as opções `log-bin` e `server-id`. Se essas opções já existirem, mas estiverem comentadas, descomente as opções e altere-as de acordo com suas necessidades. Por exemplo, para habilitar o registro binário usando um prefixo de nome de arquivo de log `mysql-bin` e configurar um ID de servidor de 1, use essas linhas:

```sql
[mysqld]
log-bin=mysql-bin
server-id=1
```

Após fazer as alterações, reinicie o servidor.

Nota

As seguintes opções têm impacto sobre este procedimento:

- Para obter a maior durabilidade e consistência possível em uma configuração de replicação usando o `InnoDB` com transações, você deve usar `innodb_flush_log_at_trx_commit=1` e `sync_binlog=1` no arquivo `my.cnf` da fonte.

- Certifique-se de que a variável de sistema `skip_networking` não esteja habilitada em sua fonte. Se a rede estiver desativada, a replica não poderá se comunicar com a fonte e a replicação falhará.
