### 19.1.6 Opções e Variáveis de Registro Binário e Replicação

19.1.6.1 Referência de Opções e Variáveis de Registro Binário e Replicação

19.1.6.2 Opções e Variáveis de Fonte de Replicação

19.1.6.3 Opções e Variáveis de Servidor de Replicação

19.1.6.4 Opções e Variáveis de Registro Binário

19.1.6.5 Variáveis do Sistema de ID de Transação Global

As seções a seguir contêm informações sobre as opções e variáveis do **mysqld** que são usadas na replicação e para controlar o log binário. As opções e variáveis para uso em fontes e réplicas são abordadas separadamente, assim como as opções e variáveis relacionadas ao registro binário e aos identificadores de transações globais (GTIDs). Um conjunto de tabelas de referência rápida que fornecem informações básicas sobre essas opções e variáveis também está incluído.

Uma variável de sistema particularmente importante é a `server_id`.

<table frame="box" rules="all" summary="Propriedades para server_id"><tbody><tr><th>Formato de Linha de Comando</th> <td><code class="literal">--server-id=#</code></td> </tr><tr><th>Variável de Sistema</th> <td><code class="literal"><a class="link" href="replication-options.html#sysvar_server_id">server_id</a></code></td> </tr><tr><th>Alcance</th> <td>Global</td> </tr><tr><th>Dinâmico</th> <td>Sim</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de Configuração de Variáveis"><code class="literal">SET_VAR</code></a> Hint Aplica-se</th> <td>Não</td> </tr><tr><th>Tipo</th> <td>Inteiro</td> </tr><tr><th>Valor Padrão</th> <td><code class="literal">1</code></td> </tr><tr><th>Valor Mínimo</th> <td><code class="literal">0</code></td> </tr><tr><th>Valor Máximo</th> <td><code class="literal">4294967295</code></td> </tr></tbody></table>

Esta variável especifica o ID do servidor. `server_id` é definido como 1 por padrão. O servidor pode ser iniciado com este ID padrão, mas quando o registro binário é habilitado, uma mensagem informativa é emitida se você não definir explicitamente `server_id` para especificar um ID de servidor.

Para servidores que são usados em uma topologia de replicação, você deve especificar um ID de servidor único para cada servidor de replicação, no intervalo de 1 a 232 − 1. “Único” significa que cada ID deve ser diferente de todos os outros IDs em uso por qualquer outra fonte ou replica na topologia de replicação. Para informações adicionais, consulte a Seção 19.1.6.2, “Opções e Variáveis de Fonte de Replicação” e a Seção 19.1.6.3, “Opções e Variáveis de Servidor de Replicação”.

Se o ID do servidor for definido como 0, o registro binário ocorre, mas uma fonte com um ID de servidor 0 recusa quaisquer conexões de réplicas, e uma replica com um ID de servidor 0 recusa se conectar a uma fonte. Note que, embora você possa alterar o ID do servidor dinamicamente para um valor não nulo, isso não habilita a replicação para começar imediatamente. Você deve alterar o ID do servidor e, em seguida, reiniciar o servidor para inicializar a replica.

Para mais informações, consulte a Seção 19.1.2.2, “Definindo a Configuração da Replicação”.

`server_uuid`

O servidor MySQL gera um UUID verdadeiro além do ID de servidor padrão ou fornecido pelo usuário definido na variável de sistema `server_id`. Isso está disponível como a variável global, de leitura somente `server_uuid`.

Observação

A presença da variável de sistema `server_uuid` não altera a exigência de definir um valor de `server_id` único para cada servidor MySQL como parte da preparação e execução da replicação MySQL, conforme descrito anteriormente nesta seção.

<table frame="box" rules="all" summary="Propriedades para server_uuid">
  <tr>
    <th>Variável do Sistema</th>
    <td><code class="literal"><a class="link" href="replication-options.html#sysvar_server_uuid">server_uuid</a></code></td>
  </tr>
  <tr>
    <th>Alcance</th>
    <td>Global</td>
  </tr>
  <tr>
    <th>Dinâmica</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Hinta de <a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Sintaxe de dica de configuração de variável"><code class="literal">SET_VAR</a></code> Aplica-se</th>
    <td>Não</td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  </tbody>
</table>

Ao iniciar, o servidor MySQL obtém automaticamente um UUID da seguinte forma:

1. Tente ler e usar o UUID escrito no arquivo `data_dir/auto.cnf` (onde *`data_dir`* é o diretório de dados do servidor).

2. Se o `data_dir/auto.cnf` não for encontrado, gere um novo UUID e salve-o neste arquivo, criando o arquivo se necessário.

O arquivo `auto.cnf` tem um formato semelhante ao usado para os arquivos `my.cnf` ou `my.ini`. O `auto.cnf` tem apenas uma seção `[auto]` contendo uma única configuração e valor de `server_uuid`; o conteúdo do arquivo parece semelhante ao mostrado aqui:

```
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Importante

O arquivo `auto.cnf` é gerado automaticamente; não tente escrever ou modificar este arquivo.

Ao usar a replicação do MySQL, as fontes e réplicas conhecem os UUIDs uns dos outros. O valor do UUID de uma réplica pode ser visto na saída de `SHOW REPLICAS`. Uma vez que `START REPLICA` tenha sido executado, o valor do UUID da fonte estará disponível na réplica na saída de `SHOW REPLICA STATUS`.

Nota

Emitir uma declaração `STOP REPLICA` ou `RESET REPLICA` *não* redefinirá o UUID da fonte usado na réplica.

O `server_uuid` de um servidor também é usado em GTIDs para transações que têm origem nesse servidor. Para obter mais informações, consulte a Seção 19.1.3, “Replicação com Identificadores Globais de Transações”.

Ao iniciar, o thread de I/O de replicação (receptor) gera um erro e é interrompido se o UUID da fonte for igual ao seu próprio, a menos que a opção `--replicate-same-server-id` tenha sido definida. Além disso, o thread de receptor de replicação gera uma mensagem de aviso se uma das seguintes condições for verdadeira:

* Não existir nenhuma fonte com o `server_uuid` esperado.

* O `server_uuid` da fonte tiver sido alterado, embora nunca tenha sido executada uma declaração `CHANGE REPLICATION SOURCE TO`.