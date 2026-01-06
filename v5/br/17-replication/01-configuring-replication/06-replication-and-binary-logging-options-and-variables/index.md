### 16.1.6 Opções e variáveis de replicação e registro binário

16.1.6.1 Opção de Registro Binário e Registro de Replicação e Referência de Variáveis

16.1.6.2 Opções e variáveis de fonte de replicação

16.1.6.3 Opções e variáveis do servidor de replicação

16.1.6.4 Opções e variáveis de registro binário

16.1.6.5 Variáveis do Sistema de ID de Transação Global

As seções a seguir contêm informações sobre as opções do **mysqld** e as variáveis do servidor que são usadas na replicação e para controlar o log binário. As opções e variáveis para uso em fontes e réplicas são abordadas separadamente, assim como as opções e variáveis relacionadas ao registro binário e aos identificadores globais de transações (GTIDs). Um conjunto de tabelas de referência rápida que fornecem informações básicas sobre essas opções e variáveis também está incluído.

De particular importância é a variável de sistema `server_id`.

<table frame="box" rules="all" summary="Propriedades para server_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Formato de linha de comando</th> <td>[[<code class="literal">--server-id=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="replication-options.html#sysvar_server_id">server_id</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code class="literal">0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code class="literal">4294967295</code>]]</td> </tr></tbody></table>

Esta variável especifica o ID do servidor. No MySQL 5.7, `server_id` deve ser especificado se o registro binário estiver habilitado, caso contrário, o servidor não poderá ser iniciado.

O `server_id` é definido como 0 por padrão. Em um servidor de origem de replicação e em cada réplica, você *deve* especificar `server_id` para estabelecer um ID de replicação único no intervalo de 1 a 232 − 1. "Único" significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra origem ou réplica na topologia de replicação. Para obter informações adicionais, consulte Seção 16.1.6.2, "Opções e variáveis de origem de replicação" e Seção 16.1.6.3, "Opções e variáveis de servidor de réplica".

Se o ID do servidor estiver definido como 0, o registro binário ocorrerá, mas uma fonte com um ID de servidor de 0 recusa quaisquer conexões de réplicas, e uma réplica com um ID de servidor de 0 se recusa a se conectar a uma fonte. Observe que, embora você possa alterar dinamicamente o ID do servidor para um valor não nulo, isso não permite que a replicação comece imediatamente. Você deve alterar o ID do servidor e, em seguida, reiniciar o servidor para inicializar a réplica.

Para obter mais informações, consulte Seção 16.1.2.5.1, “Definindo a configuração de replicação”.

[`server_uuid`](https://replication-options.html#sysvar_server_uuid)

No MySQL 5.7, o servidor gera um UUID verdadeiro, além do valor do `server_id` fornecido pelo usuário. Isso está disponível como a variável de sistema global, de leitura apenas `server_uuid`.

Nota

A presença da variável de sistema `server_uuid` no MySQL 5.7 não altera a exigência de definir um valor único para o `server_id` para cada servidor MySQL como parte da preparação e execução da replicação do MySQL, conforme descrito anteriormente nesta seção.

<table frame="box" rules="all" summary="Propriedades para server_uuid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Variável do sistema</th> <td>[[<code class="literal"><a class="link" href="replication-options.html#sysvar_server_uuid">server_uuid</a></code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

Ao iniciar, o servidor MySQL obtém automaticamente um UUID da seguinte forma:

1. Tente ler e usar o UUID escrito no arquivo `data_dir/auto.cnf` (onde *`data_dir`* é o diretório de dados do servidor).

2. Se o `data_dir/auto.cnf` não for encontrado, gere um novo UUID e salve-o neste arquivo, criando o arquivo se necessário.

O arquivo `auto.cnf` tem um formato semelhante ao utilizado para os arquivos `my.cnf` ou `my.ini`. No MySQL 5.7, o `auto.cnf` possui apenas uma única seção `[auto]` contendo uma única configuração e valor de `server_uuid` (opções de replicação.html#sysvar\_server\_uuid); o conteúdo do arquivo parece semelhante ao mostrado aqui:

```sql
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Importante

O arquivo `auto.cnf` é gerado automaticamente; não tente escrever ou modificar este arquivo.

Ao usar a replicação do MySQL, as fontes e réplicas conhecem os UUIDs uns dos outros. O valor do UUID de uma réplica pode ser visto na saída de `SHOW SLAVE HOSTS`. Uma vez que `START SLAVE` tenha sido executado, o valor do UUID da fonte estará disponível na réplica na saída de `SHOW SLAVE STATUS`.

Nota

Emitir uma declaração de `STOP SLAVE` ou `RESET SLAVE` *não* redefiniria o UUID da fonte, conforme usado na replica.

O `server_uuid` de um servidor também é usado em GTIDs para transações que têm origem nesse servidor. Para obter mais informações, consulte Seção 16.1.3, “Replicação com Identificadores Globais de Transações”.

Ao iniciar, o fio de I/O de replicação gera um erro e é interrompido se o UUID da fonte for igual ao seu próprio, a menos que a opção `--replicate-same-server-id` tenha sido definida. Além disso, o fio de I/O de replicação gera uma mensagem de aviso se qualquer um dos seguintes for verdadeiro:

- Não existe nenhuma fonte com o `server_uuid` esperado (replication-options.html#sysvar\_server\_uuid).

- O `server_uuid` da fonte mudou, embora nenhuma declaração `CHANGE MASTER TO` tenha sido executada.
