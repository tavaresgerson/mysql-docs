#### 19.1.2.1 Configuração da fonte de replicação

Para configurar uma fonte para usar a replicação com base na posição do arquivo de log binário, você deve garantir que o registro binário esteja habilitado e estabelecer um ID de servidor único.

Cada servidor dentro de uma topologia de replicação deve ser configurado com um ID de servidor único, que você pode especificar usando a variável de sistema `server_id`. Esse ID de servidor é usado para identificar servidores individuais dentro da topologia de replicação e deve ser um inteiro positivo entre 1 e (232) - 1. O valor padrão `server_id` do MySQL 8.0 é 1. Você pode alterar o valor `server_id` dinamicamente emitindo uma declaração como esta:

```
SET GLOBAL server_id = 2;
```

A forma como você organiza e seleciona os IDs dos servidores é sua escolha, desde que cada ID de servidor seja diferente de todos os outros IDs de servidor em uso por qualquer outro servidor na topologia de replicação. Observe que, se um valor de 0 (que era o padrão em versões anteriores) foi definido anteriormente para o ID do servidor, você deve reiniciar o servidor para inicializar a fonte com seu novo ID de servidor não nulo. Caso contrário, um reinício do servidor não é necessário quando você altera o ID do servidor, a menos que você faça outras alterações de configuração que o exijam.

O registro binário é necessário na fonte porque o log binário é a base para a replicação das alterações da fonte para suas réplicas. O registro binário é ativado por padrão (a variável de sistema `log_bin` é definida como ABERTO). A opção `--log-bin` informa ao servidor qual nome de base usar para os arquivos de log binário. É recomendável especificar essa opção para dar aos arquivos de log binário um nome de base não padrão, para que, se o nome do host mudar, você possa continuar a usar facilmente os mesmos nomes de arquivos de log binário (consulte a Seção B.3.7, “Problemas Conhecidos no MySQL”). Se o registro binário foi desativado anteriormente na fonte usando a opção `--skip-log-bin`, você deve reiniciar o servidor sem essa opção para ativá-lo.

Nota

As seguintes opções também têm um impacto na fonte:

- Para a maior durabilidade e consistência possível em uma configuração de replicação usando `InnoDB` com transações, você deve usar `innodb_flush_log_at_trx_commit=1` e `sync_binlog=1` no arquivo `my.cnf` da fonte.

- Certifique-se de que a variável de sistema `skip_networking` não esteja habilitada na fonte. Se a rede estiver desativada, a replica não poderá se comunicar com a fonte e a replicação falhará.
