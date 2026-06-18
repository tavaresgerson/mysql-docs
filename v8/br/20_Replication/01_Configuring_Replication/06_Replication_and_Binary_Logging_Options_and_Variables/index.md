### 19.1.6 Opções e variáveis de replicação e registro binário

19.1.6.1 Opção de Registro Binário e de Replicação e Referência de Variáveis

19.1.6.2 Opções e variáveis de fonte de replicação

19.1.6.3 Opções e variáveis do servidor de replicação

19.1.6.4 Opções e variáveis de registro binário

19.1.6.5 Variáveis do Sistema de ID de Transação Global

As seções a seguir contêm informações sobre as opções do **mysqld** e as variáveis do servidor que são usadas na replicação e para controlar o log binário. As opções e variáveis para uso em fontes e réplicas são abordadas separadamente, assim como as opções e variáveis relacionadas ao registro binário e aos identificadores de transações globais (GTIDs). Um conjunto de tabelas de referência rápida que fornecem informações básicas sobre essas opções e variáveis também está incluído.

De particular importância é a variável de sistema `server_id`.

<table summary="Propriedades para server_id"><tbody><tr><th>Formato de linha de comando</th> <td>[[<code>--server-id=#</code>]]</td> </tr><tr><th>Variável do sistema</th> <td>[[<code>server_id</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor padrão</th> <td>[[<code>1</code>]]</td> </tr><tr><th>Valor mínimo</th> <td>[[<code>0</code>]]</td> </tr><tr><th>Valor máximo</th> <td>[[<code>4294967295</code>]]</td> </tr></tbody></table>

Esta variável especifica o ID do servidor. `server_id` é definido como 1 por padrão. O servidor pode ser iniciado com este ID padrão, mas quando o registro binário está habilitado, uma mensagem informativa é emitida se você não definir explicitamente `server_id` para especificar um ID de servidor.

Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único para cada servidor de replicação, no intervalo de 1 a 232 − 1. “Único” significa que cada ID deve ser diferente de todas as outras IDs em uso por qualquer outra fonte ou réplica na topologia de replicação. Para obter informações adicionais, consulte a Seção 19.1.6.2, “Opções e variáveis de fonte de replicação”, e a Seção 19.1.6.3, “Opções e variáveis de servidor de réplica”.

Se o ID do servidor estiver definido como 0, o registro binário ocorrerá, mas uma fonte com um ID de servidor de 0 recusa quaisquer conexões de réplicas, e uma réplica com um ID de servidor de 0 se recusa a se conectar a uma fonte. Observe que, embora você possa alterar dinamicamente o ID do servidor para um valor não nulo, isso não permite que a replicação comece imediatamente. Você deve alterar o ID do servidor e, em seguida, reiniciar o servidor para inicializar a réplica.

Para obter mais informações, consulte a Seção 19.1.2.2, “Definindo a configuração de replicação”.

`server_uuid`

O servidor MySQL gera um UUID verdadeiro, além do ID do servidor padrão ou fornecido pelo usuário definido na variável de sistema `server_id`. Isso está disponível como a variável global, de leitura somente `server_uuid`.

Nota

A presença da variável de sistema `server_uuid` não altera a exigência de definir um valor único `server_id` para cada servidor MySQL como parte da preparação e execução da replicação do MySQL, conforme descrito anteriormente nesta seção.

<table summary="Propriedades para server_uuid"><tbody><tr><th>Variável do sistema</th> <td>[[<code>server_uuid</code>]]</td> </tr><tr><th>Âmbito</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Não</td> </tr><tr><th>[[<code>SET_VAR</code>]] Sugestão Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Ferramenta de cordas</td> </tr></tbody></table>

Ao iniciar, o servidor MySQL obtém automaticamente um UUID da seguinte forma:

1. Tente ler e usar o UUID escrito no arquivo `data_dir/auto.cnf` (onde `data_dir` é o diretório de dados do servidor).

2. Se `data_dir/auto.cnf` não for encontrado, gere um novo UUID e salve-o neste arquivo, criando o arquivo se necessário.

O arquivo `auto.cnf` tem um formato semelhante ao utilizado para os arquivos `my.cnf` ou `my.ini`. O arquivo `auto.cnf` tem apenas uma única seção `[auto]` contendo um único ajuste e valor `server_uuid`; o conteúdo do arquivo parece semelhante ao mostrado aqui:

```
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Importante

O arquivo `auto.cnf` é gerado automaticamente; não tente escrever ou modificar este arquivo.

Ao usar a replicação do MySQL, as fontes e réplicas conhecem os UUIDs uns dos outros. O valor do UUID de uma réplica pode ser visto na saída do `SHOW REPLICAS` (ou antes do MySQL 8.0.22, `SHOW SLAVE HOSTS`). Uma vez que o `START REPLICA` tenha sido executado, o valor do UUID da fonte estará disponível na réplica na saída do `SHOW REPLICA STATUS`. (No MySQL 8.0.22, a palavra-chave `SLAVE` foi substituída por `REPLICA`.)

Nota

Emitir uma declaração `STOP REPLICA` ou `RESET REPLICA` *não* redefiniria o UUID da fonte, conforme utilizado na replica.

O `server_uuid` de um servidor também é usado em GTIDs para transações que têm origem nesse servidor. Para obter mais informações, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transação”.

Ao iniciar, o fio de I/O de replicação (receptor) gera um erro e é interrompido se o UUID da fonte for igual ao seu próprio, a menos que a opção `--replicate-same-server-id` tenha sido definida. Além disso, o fio de receptor de replicação gera uma mensagem de aviso se qualquer um dos seguintes estiver verdadeiro:

- Não existe nenhuma fonte com o código esperado `server_uuid`.

- O `server_uuid` da fonte mudou, embora nenhuma declaração `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` tenha sido executada.
