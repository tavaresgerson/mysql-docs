### 25.5.28 ndb_sign_keys — Crie, assine e gerencie chaves e certificados TLS para o NDB Cluster

A gestão de chaves e certificados TLS no NDB Cluster é realizada pelo programa de utilitário executável **ndb_sign_keys**, que normalmente pode ser encontrado no diretório `bin` do MySQL. O programa realiza funções como criar, assinar e aposentar chaves e certificados, e normalmente funciona da seguinte forma:

1. **ndb_sign_keys** se conecta ao **ndb_mgmd** e recupera a configuração do cluster.

2. Para cada nó do cluster que está configurado para rodar na máquina local, **ndb_sign_keys** encontra a chave privada do nó e a assina, criando um certificado ativo do nó.

Algumas tarefas adicionais que podem ser realizadas pelo **ndb_sign_keys** estão listadas aqui:

* Obter informações de configuração de um arquivo config.ini em vez de um **ndb_mgmd** em execução

* Criar a autoridade de certificação (CA) do cluster se ela ainda não existir

* Criar chaves privadas
* Salvar chaves e certificados como pendentes em vez de ativos
* Assinar a chave para um único nó conforme especificado usando as opções de linha de comando descritas mais adiante nesta seção

* Solicitar que uma CA localizada em um host remoto assine uma chave local

As opções que podem ser usadas com o **ndb_sign_keys** são mostradas na tabela a seguir. Descrições adicionais seguem a tabela.

* `--bind-host`

  <table frame="box" rules="all" summary="Propriedades para bind-host"><tbody><tr><th>Formato de Linha de Comando</th> <td><code>--bind-host=host</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor Padrão</th> <td><code>mgmd, api</code></td> </tr></tbody></table>

Crie um certificado vinculado a uma lista de endereços de host de tipos de nó que devem ter vinculações de endereços de host de certificado, do conjunto `(mgmd, db, api)`.

* `--bound-hostname`

  <table frame="box" rules="all" summary="Propriedades para bound-hostname"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bound-hostname=hostname</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Crie um certificado vinculado ao endereço de host passado para esta opção.

* `--CA-cert`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

  Use o nome passado para esta opção como nome do arquivo do certificado CA.

* `--CA-key`

  <table frame="box" rules="all" summary="Propriedades para CA-key"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-key=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-private-key</code></td> </tr></tbody></table>

  Use o nome passado para esta opção como nome do arquivo da chave privada CA.

* `--CA-ordinal`

<table frame="box" rules="all" summary="Propriedades para CA-ordinal">
  <tr><th>Formato de Linha de Comando</th> <td><code>--CA-ordinal=nome</code></td> </tr>
  <tr><th>Tipo</th> <td>String</td> </tr>
  <tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr>
  <tr><th>Valores Válidos</th> <td><p><code>Primeiro</code></p><p><code>Segundo</code></p></td> </tr>
  </table>

  Defina o nome ordinal da CA; o valor padrão é `Primeiro` para `--create-CA` e `Segundo` para `--rotate-CA`. O Nome Comum no certificado da CA é “Certificado do MySQL NDB Cluster *`ordinal`*”, onde *`ordinal`* é o nome ordinal passado para esta opção.

* `--CA-search-path`

  <table frame="box" rules="all" summary="Propriedades para CA-search-path">
    <tr><th>Formato de Linha de Comando</th> <td><code>--CA-search-path=nome</code></td> </tr>
    <tr><th>Tipo</th> <td>Nome do arquivo</td> </tr>
    <tr><th>Valor Padrão</th> <td><code>[nenhum]</code></td> </tr>
  </table>

  Especifique uma lista de diretórios para pesquisar um arquivo de CA. Em plataformas Unix, os nomes dos diretórios são separados por colchetes (`:`); em sistemas Windows, o caractere ponto e vírgula (`;`) é usado como separador. Uma referência de diretório pode ser relativa ou absoluta; pode conter uma ou mais variáveis de ambiente, cada uma denotada por um sinal de dólar prefixado (`$`), e expandida antes de ser usada.

A busca começa com o diretório nomeado mais à esquerda e prossegue de esquerda para direita até que um arquivo seja encontrado. Uma string vazia indica um caminho de busca vazio, o que faz com que todas as buscas falhem. Uma string composta por um único ponto (`.`) indica que o caminho de busca é limitado ao diretório de trabalho atual.

Se não for fornecido um caminho de busca, o valor padrão integrado é usado. Esse valor depende da plataforma usada: no Windows, é `$HOMEPATH\ndb-tls`; em outras plataformas (incluindo Linux), é `$HOME/ndb-tls`. Esse padrão pode ser substituído compilando o NDB Cluster usando `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--CA-tool`

  <table frame="box" rules="all" summary="Propriedades para CA-tool"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-tool=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

  Designe uma ferramenta auxiliar executável, incluindo o caminho.

* `--check`

  <table frame="box" rules="all" summary="Propriedades para check"><tbody><tr><th>Formato de linha de comando</th> <td><code>--check</code></td> </tr></tbody></table>

  Verifique as datas de validade dos certificados.

* `--config-file`

  <table frame="box" rules="all" summary="Propriedades para config-file"><tbody><tr><th>Formato de linha de comando</th> <td><code>--config-file=arquivo</code></td> </tr><tr><th>Desabilitado por</th> <td><code>no-config</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></tbody></table>

Forneça o caminho para o arquivo de configuração do cluster (geralmente `config.ini`).

* `--connect-retries`

  <table frame="box" rules="all" summary="Propriedades para connect-retries">
    
    <tbody>
      <tr><th>Formato de linha de comando</th> <td><code>--connect-retries=#</code></td> </tr>
      <tr><th>Tipo</th> <td>Inteiro</td> </tr>
      <tr><th>Valor padrão</th> <td><code>12</code></td> </tr>
      <tr><th>Valor mínimo</th> <td><code>-1</code></td> </tr>
      <tr><th>Valor máximo</th> <td><code>12</code></td> </tr>
    </tbody>
  </table>

  Defina o número de vezes que o **ndb_sign_keys** tenta se conectar ao cluster. Se você usar `-1`, o programa continua tentando se conectar até conseguir ou ser forçado a parar.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Propriedades para bound-hostname">
    
    <tbody>
      <tr><th>Formato de linha de comando</th> <td><code>--bound-hostname=hostname</code></td> </tr>
      <tr><th>Tipo</th> <td>String</td> </tr>
      <tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr>
    </tbody>
  </table>

  Defina o número de segundos após uma tentativa de conexão falhada que o **ndb_sign_keys** aguarda antes de tentar novamente, até o número de vezes determinado por `--connect-retries`.

* `--create-CA`

  <table frame="box" rules="all" summary="Propriedades para bound-hostname">
    
    <tbody>
      <tr><th>Formato de linha de comando</th> <td><code>--bound-hostname=hostname</code></td> </tr>
      <tr><th>Tipo</th> <td>String</td> </tr>
      <tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr>
    </tbody>
  </table>

  Crie a chave e o certificado da CA.

* `--CA-days`

<table frame="box" rules="all" summary="Propriedades para hostname_associado"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--hostname_associado=hostname</code></td></tr><tr><th style="width: 70%">Tipo</th><td>String</td></tr><tr><th style="width: 70%">Valor padrão</th><td><code>[nenhum]</code></td></tr></table>

Defina a duração do certificado para quantos dias. O valor padrão é equivalente a 4 anos e 1 dia. `-1` significa que o certificado nunca expira.

Esta opção foi adicionada no NDB 8.4.1.

* `--criar-chave`

<table frame="box" rules="all" summary="Propriedades para hostname_associado"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--hostname_associado=hostname</code></td></tr><tr><th style="width: 70%">Tipo</th><td>String</td></tr><tr><th style="width: 70%">Valor padrão</th><td><code>[nenhum]</code></td></tr></table>

Crie ou substitua chaves privadas.

* `--curva`

<table frame="box" rules="all" summary="Propriedades para hostname_associado"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--hostname_associado=hostname</code></td></tr><tr><th style="width: 70%">Tipo</th><td>String</td></tr><tr><th style="width: 70%">Valor padrão</th><td><code>[nenhum]</code></td></tr></table>

Use a curva nomeada para criptografar as chaves do nó.

* `--arquivo_de_configurações_extra`

<table frame="box" rules="all" summary="Propriedades para hostname_associado"><tr><th style="width: 30%">Formato de linha de comando</th><td><code>--hostname_associado=hostname</code></td></tr><tr><th style="width: 70%">Tipo</th><td>String</td></tr><tr><th style="width: 70%">Valor padrão</th><td><code>[nenhum]</code></td></tr></table>

Leia este arquivo de opções após a leitura dos arquivos globais.

* `--defaults-file`

  <table frame="box" rules="all" summary="Propriedades para hostname vinculado"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bound-hostname=hostname</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia este arquivo de opções apenas.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Propriedades para hostname vinculado"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bound-hostname=hostname</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Leia não apenas os grupos de opções usuais, mas também grupos com os nomes usuais e um sufixo de *`string`*.

* `--duration`

  <table frame="box" rules="all" summary="Propriedades para hostname vinculado"><tbody><tr><th>Formato de linha de comando</th> <td><code>--bound-hostname=hostname</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[none]</code></td> </tr></tbody></table>

  Defina a vida útil dos certificados ou solicitações de assinatura, em segundos.

* `--help`

<table frame="box" rules="all" summary="Propriedades para hostname_conectado"><tr><th>Formato de linha de comando</th> <td><code>--hostname_conectado=hostname</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr></table>

Imprimir texto de ajuda e sair.

* `--keys-para-diretorio`

<table frame="box" rules="all" summary="Propriedades para CA-cert"><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></table>

Especificar o diretório de saída para as chaves privadas (apenas); para isso, ele substitui qualquer valor definido para `--para-diretório`.

* `--caminho_de_login`

<table frame="box" rules="all" summary="Propriedades para CA-cert"><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></table>

Ler este caminho a partir do arquivo de login.

* `--string_de_conexão_ndb`

<table frame="box" rules="all" summary="Propriedades para CA-cert"><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></table>

Defina a cadeia de conexão a ser usada para se conectar ao **ndb_mgmd**, usando a sintaxe `[nodeid=id;][host=]hostname[:port]`. Se esta opção for definida, ela substitui o valor definido para `NDB_CONNECTSTRING` (se houver), bem como qualquer valor definido em um arquivo `my.cnf`.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

  Define o nível de suporte TLS necessário para o cliente **ndb_mgm**, um de `relaxado` ou `estricto`. `relaxado` (o padrão) significa que uma conexão TLS é tentada, mas o sucesso não é necessário; `estricto` significa que TLS é necessário para se conectar.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

  Especifique uma lista de diretórios que contêm chaves e certificados TLS.

  Para a sintaxe, consulte a descrição da opção `--CA-search-path`.

* `--no-config`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

Não obtenha a configuração do cluster; crie um único certificado com base nas opções fornecidas (incluindo os valores padrão para aqueles não especificados).

* `--no-defaults`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

  Não leia opções padrão de qualquer arquivo de opção, exceto o arquivo de login.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

  Não leia caminhos de login do arquivo de caminho de login.

* `--passphrase`

  <table frame="box" rules="all" summary="Propriedades para CA-cert"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-cert=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>NDB-Cluster-cert</code></td> </tr></tbody></table>

  Especifique uma senha da chave CA.

* `--node-id`

<table frame="box" rules="all" summary="Propriedades para CA-cert">
  <tr>
    <th>Formato de linha de comando</th>
    <td><code>--CA-cert=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>Nome do arquivo</td>
  </tr>
  <tr>
    <th>Valor padrão</th>
    <td><code>NDB-Cluster-cert</code></td>
  </tr>
</table>

  Crie ou assine uma chave para o nó com o ID de nó especificado.

* `--node-type`

  <table frame="box" rules="all" summary="Propriedades para CA-key">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--CA-key=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>NDB-Cluster-private-key</code></td>
    </tr>
  </table>

  Crie ou assine chaves para o(s) tipo(s) especificado(s) do conjunto `(mgmd, db, api)`.

* `--pending`

  <table frame="box" rules="all" summary="Propriedades para CA-key">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--CA-key=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>NDB-Cluster-private-key</code></td>
    </tr>
  </table>

  Salve as chaves e certificados como pendentes, em vez de ativos.

* `--print-defaults`

  <table frame="box" rules="all" summary="Propriedades para CA-key">
    <tr>
      <th>Formato de linha de comando</th>
      <td><code>--CA-key=nome</code></td>
    </tr>
    <tr>
      <th>Tipo</th>
      <td>Nome do arquivo</td>
    </tr>
    <tr>
      <th>Valor padrão</th>
      <td><code>NDB-Cluster-private-key</code></td>
    </tr>
  </table>

  Imprima a lista de argumentos do programa e, em seguida, saia.

* `--promote`

Promova os arquivos pendentes para ativos, depois saia.

* `--CA-remoto`

  <table frame="box" rules="all" summary="Propriedades para CA-chave"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-chave=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave-privada-do-cluster-NDB</code></td> </tr></tbody></table>

  Promova arquivos pendentes para ativos, depois saia.

* `--CA-remoto`

  <table frame="box" rules="all" summary="Propriedades para CA-chave"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-chave=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave-privada-do-cluster-NDB</code></td> </tr></tbody></table>

  Especifique o endereço ou o nome do host de um CA remoto.

* `--caminho-executável-remoto`

  <table frame="box" rules="all" summary="Propriedades para CA-chave"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-chave=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave-privada-do-cluster-NDB</code></td> </tr></tbody></table>

  Forneça o caminho completo para um executável no host CA remoto especificado com `--CA-remoto`.

* `--openssl-remoto`

  <table frame="box" rules="all" summary="Propriedades para CA-chave"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-chave=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave-privada-do-cluster-NDB</code></td> </tr></tbody></table>

Use o OpenSSL para assinar chaves no host CA remoto especificado com `--remote-CA-host`.

* `--replace-by`

  <table frame="box" rules="all" summary="Propriedades para CA-key"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-key=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave_privada_do_cluster_NDB</code></td> </tr></tbody></table>

  Sugira uma data de substituição de certificado para verificações periódicas, como um número de dias após a data de expiração do CA. Use um número negativo para indicar dias antes da expiração.

* `--rotate-CA`

  <table frame="box" rules="all" summary="Propriedades para CA-key"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-key=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave_privada_do_cluster_NDB</code></td> </tr></tbody></table>

  Substitua um CA mais antigo por um mais novo. O novo CA pode ser criado usando o OpenSSL, ou você pode permitir que o **ndb_sign_keys** crie o novo, caso em que o novo CA é criado com um certificado de CA intermediário, assinado pelo CA antigo.

* `--schedule`

  <table frame="box" rules="all" summary="Propriedades para CA-key"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-key=nome</code></td> </tr><tr><th>Tipo</th> <td>Nome do arquivo</td> </tr><tr><th>Valor padrão</th> <td><code>chave_privada_do_cluster_NDB</code></td> </tr></tbody></table>

Atribua um cronograma de datas de validade para os certificados. O cronograma é definido como uma lista de seis inteiros separados por vírgula, no formato mostrado aqui:

  ```
  api_valid,api_extra,dn_valid,dn_extra,mgm_valid,mgm_extra
  ```

  Esses valores são definidos da seguinte forma:

  + `api_valid`: Um número fixo de dias de validade para certificados de clientes.

    `api_extra`: Um número de dias extras para certificados de clientes.

    `dn_valid`: Um número fixo de dias de validade para certificados de clientes para certificados de nós de dados.

    `dn_extra`: Um número de dias extras para certificados de nós de dados.

    `mgm_valid`: Um número fixo de dias de validade para certificados de servidores de gerenciamento.

    `mgm_extra`: Um número de dias extras para certificados de servidores de gerenciamento.

  Em outras palavras, para cada tipo de nó (nó API, nó de dados, nó de gerenciamento), os certificados são criados com uma vida útil igual a um número fixo de dias inteiros, mais algum tempo aleatório menor ou igual ao número de dias extras. O cronograma padrão é mostrado aqui:

  ```
  --schedule=120,10,130,10,150,0
  ```

  Seguindo o cronograma padrão, os certificados de clientes começam a expirar no 120º dia e expirarão em intervalos aleatórios nos próximos 10 dias; os certificados de nós de dados expirarão em horários aleatórios entre o 130º e o 140º dia; e os certificados de nós de gerenciamento expirarão no 150º dia (sem intervalo aleatório após isso).

* `--sign`

Crie certificados assinados; habilitados por padrão. Use `--skip-sign` para criar solicitações de assinatura de certificados em vez disso.

* `--skip-sign`

  <table frame="box" rules="all" summary="Propriedades para CA-ordinal"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-ordinal=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>Primeiro</code></p><p><code>Segundo</code></p></td> </tr></tbody></table>

  Crie solicitações de assinatura de certificados em vez de certificados assinados.

* `--stdio`

  <table frame="box" rules="all" summary="Propriedades para CA-ordinal"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-ordinal=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>Primeiro</code></p><p><code>Segundo</code></p></td> </tr></tbody></table>

  Crie solicitações de assinatura de certificados em vez de certificados assinados.

* `--stdio`

Leia solicitações de assinatura de certificados a partir do `stdin` e escreva X.509 no `stdout`.

* `--to-dir`

  <table frame="box" rules="all" summary="Propriedades para CA-ordinal"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-ordinal=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>Primeiro</code></p><p><code>Segundo</code></p></td> </tr></tbody></table>

  Especifique o diretório de saída para os arquivos criados. Para arquivos de chave privada, isso pode ser sobrescrito usando `--keys-to-dir`.

* `--usage`

  <table frame="box" rules="all" summary="Propriedades para CA-ordinal"><tbody><tr><th>Formato de linha de comando</th> <td><code>--CA-ordinal=nome</code></td> </tr><tr><th>Tipo</th> <td>String</td> </tr><tr><th>Valor padrão</th> <td><code>[nenhum]</code></td> </tr><tr><th>Valores válidos</th> <td><p><code>Primeiro</code></p><p><code>Segundo</code></p></td> </tr></tbody></table>

  Imprima o texto de ajuda e, em seguida, saia (alias para `--help`).

* `--version`

<table frame="box" rules="all" summary="Propriedades para CA-ordinal">
  <tr>
    <th>Formato de Linha de Comando</th>
    <td><code>--CA-ordinal=nome</code></td>
  </tr>
  <tr>
    <th>Tipo</th>
    <td>String</td>
  </tr>
  <tr>
    <th>Valor Padrão</th>
    <td><code>[nenhum]</code></td>
  </tr>
  <tr>
    <th>Valores Válidos</th>
    <td><p><code>Primeiro</code></p><p><code>Segundo</code></p></td>
  </tr>
</table>
5. Imprima as informações da versão, e então saia.