## 22.5 X Plugin

Esta seção explica como usar, configurar e monitorar o X Plugin.

### 22.5.1 Verificar a instalação do plugin X

O X Plugin é ativado por padrão no MySQL 8, portanto, instalar ou atualizar para o MySQL 8 torna o plugin disponível. Você pode verificar se o X Plugin está instalado em uma instância do servidor MySQL usando a declaração `SHOW plugins` para visualizar a lista de plugins.

Para usar o MySQL Shell para verificar se o X Plugin está instalado, execute:

```
$> mysqlsh -u user --sqlc -P 3306 -e "SHOW plugins"
```

Para usar o MySQL Client para verificar se o X Plugin está instalado, execute:

```
$> mysql -u user -p -e "SHOW plugins"
```

Um exemplo de resultado se o X Plugin estiver instalado é destacado aqui:

```
+----------------------------+----------+--------------------+---------+---------+
| Name                       | Status   | Type               | Library | License |
+----------------------------+----------+--------------------+---------+---------+

...


| mysqlx                     | ACTIVE   | DAEMON             | NULL    | GPL     |

...

+----------------------------+----------+--------------------+---------+---------+
```

### 22.5.2 Desativando o Plugin X

O Plugin X pode ser desativado na inicialização, definindo `mysqlx=0` no arquivo de configuração do MySQL, ou passando `--mysqlx=0` ou `--skip-mysqlx` ao iniciar o servidor MySQL.

Como alternativa, use a opção `-DWITH_MYSQLX=OFF` do CMake para compilar o MySQL Server sem o Plugin X.

### 22.5.3 Usando conexões criptografadas com o plugin X

Esta seção explica como configurar o X Plugin para usar conexões criptografadas. Para obter mais informações de fundo, consulte a Seção 8.3, “Usando Conexões Criptografadas”.

Para habilitar a configuração do suporte para conexões criptografadas, o X Plugin tem as variáveis de sistema `mysqlx_ssl_xxx` que podem ter valores diferentes das variáveis de sistema `ssl_xxx` usadas com o MySQL Server. Por exemplo, o X Plugin pode ter chaves SSL, certificados e arquivos de autoridade de certificado que diferem daqueles usados para o MySQL Server. Essas variáveis são descritas na Seção 22.5.6.2, “Opções e Variáveis de Sistema do X Plugin”. Da mesma forma, o X Plugin tem suas próprias variáveis de status `Mysqlx_ssl_xxx` que correspondem às variáveis de status de conexão criptografada do MySQL Server `Ssl_xxx`. Veja a Seção 22.5.6.3, “Variáveis de Status do X Plugin”.

Na inicialização, o X Plugin determina seu contexto TLS para conexões criptografadas da seguinte forma:

* Se todas as variáveis de sistema do sistema `mysqlx_ssl_xxx` tiverem seus valores padrão, o X Plugin usa o mesmo contexto TLS que a interface principal de conexão do servidor MySQL, que é determinado pelos valores das variáveis de sistema `ssl_xxx`.

* Se qualquer variável `mysqlx_ssl_xxx` tiver um valor não padrão, o X Plugin usa o contexto TLS definido pelos valores das suas próprias variáveis do sistema. (Este é o caso se qualquer variável do sistema `mysqlx_ssl_xxx` estiver definida com um valor diferente do seu padrão.)

Isso significa que, em um servidor com o X Plugin habilitado, você pode optar por ter conexões do Protocolo MySQL e do X compartilhando a mesma configuração de criptografia, definindo apenas as variáveis `ssl_xxx`, ou ter configurações de criptografia separadas para conexões do Protocolo MySQL e do X, configurando as variáveis `ssl_xxx` e `mysqlx_ssl_xxx` separadamente.

Para ter conexões com o MySQL Protocol e o X Protocol, use a mesma configuração de criptografia, configure apenas as variáveis de sistema `ssl_xxx` em `my.cnf`:

```
[mysqld]
ssl_ca=ca.pem
ssl_cert=server-cert.pem
ssl_key=server-key.pem
```

Para configurar a criptografia separadamente para conexões com o Protocolo MySQL e o Protocolo X, defina as variáveis de sistema `ssl_xxx` e `mysqlx_ssl_xxx` em `my.cnf`:

```
[mysqld]
ssl_ca=ca1.pem
ssl_cert=server-cert1.pem
ssl_key=server-key1.pem

mysqlx_ssl_ca=ca2.pem
mysqlx_ssl_cert=server-cert2.pem
mysqlx_ssl_key=server-key2.pem
```

Para obter informações gerais sobre a configuração do suporte à encriptação de conexão, consulte a Seção 8.3.1, “Configurando o MySQL para usar conexões encriptadas”. Essa discussão é escrita para o MySQL Server, mas os nomes dos parâmetros são semelhantes para o X Plugin. (As variáveis de sistema `mysqlx_ssl_xxx` do X Plugin correspondem às variáveis de sistema `ssl_xxx` do MySQL Server.)

A variável de sistema `tls_version` que determina as versões TLS permitidas para conexões com o Protocolo MySQL também se aplica às conexões com o X Protocol. Portanto, as versões TLS permitidas para ambos os tipos de conexões são as mesmas.

A criptografia por conexão é opcional, mas pode ser exigido que um usuário específico use criptografia para conexões do Protocolo X e do Protocolo MySQL, incluindo uma cláusula apropriada `REQUIRE` na declaração `CREATE USER` que cria o usuário. Para obter detalhes, consulte a Seção 15.7.1.3, “Declaração CREATE USER”. Alternativamente, para exigir que todos os usuários usem criptografia para conexões do Protocolo X e do Protocolo MySQL, habilite a variável de sistema `require_secure_transport`. Para obter informações adicionais, consulte Configurando Conexões Criptografadas como Obrigatórias.

### 22.5.4 Usando o X Plugin com o Plugin de Autenticação de Caching SHA-2

O X Plugin suporta contas de usuário do MySQL criadas com o plugin de autenticação `caching_sha2_password`. Para mais informações sobre este plugin, consulte a Seção 8.4.1.2, “Cacheamento de Autenticação Pluggable SHA-2”. Você pode usar o X Plugin para autenticar contra tais contas usando conexões não SSL com autenticação `SHA256_MEMORY` e conexões SSL com autenticação `PLAIN`.

Embora o plugin de autenticação `caching_sha2_password` mantenha um cache de autenticação, este cache não é compartilhado com o X Plugin, portanto, o X Plugin usa seu próprio cache de autenticação para a autenticação `SHA256_MEMORY`. O cache de autenticação do X Plugin armazena hashes das senhas das contas de usuário e não pode ser acessado usando SQL. Se uma conta de usuário for modificada ou removida, as entradas relevantes são removidas do cache. O cache de autenticação do X Plugin é mantido pelo plugin `mysqlx_cache_cleaner`, que é ativado por padrão, e não tem variáveis de sistema ou variáveis de status relacionadas.

Antes de poder usar conexões do Protocolo X sem SSL para autenticar uma conta que usa o plugin de autenticação `caching_sha2_password`, a conta deve ter sido autenticada pelo menos uma vez através de uma conexão do Protocolo X com SSL, para fornecer a senha ao cache de autenticação do Plugin X. Uma vez que essa autenticação inicial com SSL tenha sido bem-sucedida, conexões do Protocolo X sem SSL podem ser usadas.

É possível desativar o plugin `mysqlx_cache_cleaner` iniciando o servidor MySQL com a opção `--mysqlx_cache_cleaner=0`. Se você fizer isso, o cache de autenticação do X Plugin será desativado, e, portanto, o SSL deve ser sempre usado para conexões com o protocolo X ao se autenticar com a autenticação `SHA256_MEMORY`.

### 22.5.5 Compressão de conexão com o plugin X

A partir do MySQL 8.0.19, o X Plugin suporta a compressão de mensagens enviadas por meio de conexões do X Protocol. As conexões podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente compatível. A ativação da compressão reduz o número de bytes enviados pela rede, mas adiciona ao servidor e ao cliente um custo adicional de CPU para operações de compressão e descomprição. Os benefícios da compressão, portanto, ocorrem principalmente quando há baixa largura de banda de rede, o tempo de transferência de rede domina o custo das operações de compressão e descomprição, e os conjuntos de resultados são grandes.

Nota

Diferentes clientes do MySQL implementam o suporte para compressão de conexão de maneira diferente; consulte a documentação do seu cliente para obter detalhes. Por exemplo, para conexões com protocolo MySQL clássico, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

* Configurar compressão de conexão para o X Plugin
* Características de conexão comprimida para o X Plugin
* Monitorar compressão de conexão para o X Plugin

#### Configurando a Compressão de Conexão para o Plugin X

Por padrão, o X Plugin suporta os algoritmos de compressão zstd, LZ4 e Deflate. A compressão com o algoritmo Deflate é realizada usando a biblioteca de software zlib, portanto, a configuração do algoritmo de compressão `deflate_stream` para conexões do X Protocol é equivalente à configuração `zlib` para conexões clássicas do protocolo MySQL.

No lado do servidor, você pode impedir qualquer um dos algoritmos de compressão definindo a variável de sistema `mysqlx_compression_algorithms` para incluir apenas os permitidos. Os nomes dos algoritmos `zstd_stream`, `lz4_message` e `deflate_stream` podem ser especificados em qualquer combinação, e a ordem e a letra maiúscula não são importantes. Se o valor da variável de sistema for a string vazia, nenhum algoritmo de compressão é permitido e as conexões não são comprimidas.

A tabela a seguir compara as características dos diferentes algoritmos de compressão e mostra suas prioridades atribuídas. Por padrão, o servidor escolhe o algoritmo de maior prioridade permitido em comum pelo servidor e pelo cliente; os clientes podem alterar as prioridades conforme descrito mais adiante. O alias de forma curta para os algoritmos pode ser usado pelos clientes ao especificá-los.

**Tabela 22.1 Características do algoritmo de compressão X do protocolo**

<table frame="void"><col align="center" style="width: 18%"/><col align="center" style="width: 14%"/><col align="center" style="width: 18%"/><col align="center" style="width: 17%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th scope="col">Algorithm</th> <th scope="col">Alias</th> <th scope="col">Compression Ratio</th> <th scope="col">Throughput</th> <th scope="col">CPU Cost</th> <th scope="col">Default Priority</th> </tr></thead><tbody><tr> <th scope="row"><code>zsth_stream</code></th> <td><code>zstd</code></td> <td>High</td> <td>High</td> <td>Medium</td> <td>First</td> </tr><tr> <th scope="row"><code>lz4_message</code></th> <td><code>lz4</code></td> <td>Low</td> <td>High</td> <td>Lowest</td> <td>Second</td> </tr><tr> <th scope="row"><code>deflate_stream</code></th> <td><code>deflate</code></td> <td>High</td> <td>Low</td> <td>Highest</td> <td>Third</td> </tr></tbody></table>

O conjunto de protocolos X de algoritmos de compressão permitidos (se especificados pelo usuário ou padrão) é independente do conjunto de algoritmos de compressão permitidos pelo MySQL Server para conexões clássicas do protocolo MySQL, que é especificado pela variável de sistema `protocol_compression_algorithms`. Se você não especificar a variável de sistema `mysqlx_compression_algorithms`, o X Plugin não recorrerá ao uso de configurações de compressão para conexões clássicas do protocolo MySQL. Em vez disso, seu padrão é permitir todos os algoritmos mostrados na Tabela 22.1, “Características do Algoritmo de Compressão do Protocolo X”. Isso é diferente da situação para o contexto TLS, onde as configurações do MySQL Server são usadas se as variáveis de sistema do X Plugin não forem definidas, conforme descrito na Seção 22.5.3, “Usando Conexões Encriptadas com X Plugin”. Para informações sobre compressão para conexões clássicas do protocolo MySQL, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Do lado do cliente, um pedido de conexão do protocolo X pode especificar vários parâmetros para controle de compressão:

* O modo de compressão. * O nível de compressão (a partir do MySQL 8.0.20). * A lista de algoritmos de compressão permitidos em ordem de prioridade (a partir do MySQL 8.0.22).

Nota

Alguns clientes ou Conectadores podem não suportar uma determinada característica de controle de compressão. Por exemplo, especificar o nível de compressão para conexões do Protocolo X é suportado apenas pelo MySQL Shell, não por outros clientes ou Conectadores MySQL. Consulte a documentação dos produtos específicos para obter detalhes sobre as características suportadas e como usá-las.

O modo de conexão tem esses valores permitidos:

* `disabled`: A conexão não está compactada.
* `preferred`: O servidor e o cliente negociam para encontrar um algoritmo de compactação que ambos permitam. Se nenhum algoritmo comum estiver disponível, a conexão não está compactada. Este é o modo padrão, a menos que seja especificado explicitamente.

* `required`: A negociação do algoritmo de compressão ocorre como no modo `preferred`, mas se nenhum algoritmo comum estiver disponível, o pedido de conexão é encerrado com um erro.

Além de concordar com um algoritmo de compressão para cada conexão, o servidor e o cliente podem concordar em um nível de compressão da faixa numérica que se aplica ao algoritmo acordado. À medida que o nível de compressão de um algoritmo aumenta, a taxa de compressão de dados aumenta, o que reduz a largura de banda da rede e o tempo de transferência necessário para enviar a mensagem ao cliente. No entanto, o esforço necessário para a compressão de dados também aumenta, ocupando tempo e recursos de CPU e memória no servidor. Os aumentos no esforço de compressão não têm uma relação linear com os aumentos na taxa de compressão.

No MySQL 8.0.19, o X Plugin sempre usa o nível de compressão padrão da biblioteca para cada algoritmo (3 para zstd, 0 para LZ4 e 6 para Deflate), e o cliente não pode negociar isso. A partir do MySQL 8.0.20, o cliente pode solicitar um nível de compressão específico durante as negociações de capacidade com o servidor para uma conexão com o X Protocol.

Os níveis de compressão padrão usados pelo X Plugin do MySQL 8.0.20 foram selecionados por meio de testes de desempenho como um bom equilíbrio entre o tempo de compressão e o tempo de trânsito na rede. Esses padrões não são necessariamente os mesmos que o padrão da biblioteca para cada algoritmo. Eles se aplicam se o cliente não solicitar um nível de compressão para o algoritmo. Os níveis de compressão padrão são inicialmente definidos em 3 para zstd, 2 para LZ4 e 3 para Deflate. Você pode ajustar essas configurações usando as variáveis de sistema `mysqlx_zstd_default_compression_level`, `mysqlx_lz4_default_compression_level` e `mysqlx_deflate_default_compression_level`.

Para evitar o consumo excessivo de recursos no servidor, o X Plugin define um nível máximo de compressão que o servidor permite para cada algoritmo. Se um cliente solicitar um nível de compressão que exceda esse ajuste, o servidor usa seu nível máximo de compressão permitido (os pedidos de nível de compressão de um cliente são suportados apenas pelo MySQL Shell). Os níveis máximos de compressão são inicialmente definidos em 11 para zstd, 8 para LZ4 e 5 para Deflate. Você pode ajustar esses ajustes usando as variáveis de sistema `mysqlx_zstd_max_client_compression_level`, `mysqlx_lz4_max_client_compression_level` e `mysqlx_deflate_max_client_compression_level`.

Se o servidor e o cliente permitirem mais de um algoritmo em comum, a ordem de prioridade padrão para a escolha de um algoritmo durante a negociação é mostrada na Tabela 22.1, “Características do Algoritmo de Compressão do Protocolo X”. A partir do MySQL 8.0.22, para clientes que suportam especificar algoritmos de compressão, a solicitação de conexão pode incluir uma lista de algoritmos permitidos pelo cliente, especificada usando o nome do algoritmo ou seu alias. A ordem desses algoritmos na lista é considerada como uma ordem de prioridade pelo servidor. O algoritmo usado neste caso é o primeiro desses na lista do cliente que também é permitido no lado do servidor. No entanto, a opção para algoritmos de compressão está sujeita ao modo de compressão:

* Se o modo de compressão for `disabled`, a opção de algoritmo de compressão é ignorada.

* Se o modo de compressão é `preferred` mas nenhum algoritmo permitido no lado do cliente é permitido no lado do servidor, a conexão não é comprimida.

* Se o modo de compressão for `required`, mas nenhum algoritmo permitido no lado do cliente é permitido no lado do servidor, ocorre um erro.

Para monitorar os efeitos da compressão de mensagens, use as variáveis de status do Plugin X descritas em Monitoramento da compressão de conexão para o Plugin X. Você pode usar essas variáveis de status para calcular o benefício da compressão de mensagens com suas configurações atuais e usar essas informações para ajustar suas configurações.

#### Características de Conexão Compressa para o Plugin X

A compressão da conexão do protocolo X opera com os seguintes comportamentos e limites:

* Os sufixos `_stream` e `_message` nos nomes dos algoritmos referem-se a dois modos operacionais diferentes: no modo em fluxo, todas as mensagens do Protocolo X em uma única conexão são comprimidas em um fluxo contínuo e devem ser descomprimidas da mesma maneira — seguindo a ordem em que foram comprimidas e sem pular nenhuma mensagem. No modo de mensagem, cada mensagem é comprimida individualmente e independentemente, e não precisa ser descomprimida na ordem em que foi comprimida. Além disso, o modo de mensagem não exige que todas as mensagens comprimidas sejam descomprimidas.

* A compressão não é aplicada em quaisquer mensagens enviadas antes de a autenticação ser bem-sucedida.

* A compressão não é aplicada para controlar mensagens de fluxo, como as mensagens `Mysqlx.Ok`, `Mysqlx.Error` e `Mysqlx.Sql.StmtExecuteOk`.

* Todas as outras mensagens do Protocolo X podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente permitido durante a negociação de capacidades. Se o cliente não solicitar compressão naquela etapa, nem o cliente nem o servidor aplicarão compressão às mensagens.

* Quando as mensagens enviadas através de conexões do protocolo X são comprimidas, o limite especificado pela variável de sistema `mysqlx_max_allowed_packet` ainda se aplica. O pacote de rede deve ser menor que esse limite após o carregamento da mensagem ter sido descomprimido. Se o limite for excedido, o X Plugin retorna um erro de descomprimento e fecha a conexão.

* Os seguintes pontos se referem aos pedidos de nível de compressão por clientes, que é suportado apenas pelo MySQL Shell:

+ Os níveis de compressão devem ser especificados pelo cliente como um número inteiro. Se qualquer outro tipo de valor for fornecido, a conexão será fechada com um erro.

+ Se um cliente especificar um algoritmo, mas não um nível de compressão, o servidor usa o nível de compressão padrão para o algoritmo.

+ Se um cliente solicitar um nível de compressão de algoritmo que exceda o nível máximo permitido pelo servidor, o servidor utiliza o nível máximo permitido.

+ Se um cliente solicitar um nível de compressão de algoritmo que é menor que o nível mínimo permitido pelo servidor, o servidor usa o nível mínimo permitido.

#### Monitoramento da compressão da conexão para o X Plugin

Você pode monitorar os efeitos da compressão de mensagens usando as variáveis de status do Plugin X. Quando a compressão de mensagens está em uso, a variável de status `Mysqlx_compression_algorithm` da sessão mostra qual algoritmo de compressão está sendo usado para a conexão atual do Protocolo X, e `Mysqlx_compression_level` mostra o nível de compressão que foi selecionado. Essas variáveis de status de sessão estão disponíveis a partir do MySQL 8.0.20.

A partir do MySQL 8.0.19, as variáveis de status do X Plugin podem ser usadas para calcular a eficiência dos algoritmos de compressão selecionados (a proporção de compressão de dados) e o efeito geral do uso da compressão de mensagens. Use o valor da sessão das variáveis de status nos cálculos a seguir para ver qual foi o benefício da compressão de mensagens para uma sessão específica com um algoritmo de compressão conhecido. Ou use o valor global das variáveis de status para verificar o benefício geral da compressão de mensagens para o seu servidor em todas as sessões usando conexões do X Protocol, incluindo todos os algoritmos de compressão que foram usados nessas sessões e todas as sessões que não usaram compressão de mensagens. Em seguida, você pode ajustar a compressão de mensagens ajustando os algoritmos de compressão permitidos, o nível máximo de compressão e o nível de compressão padrão, conforme descrito na Configuração da Compressão de Conexão para X Plugin.

Quando a compressão de mensagens está em uso, a variável de status `Mysqlx_bytes_sent` mostra o número total de bytes enviados pelo servidor, incluindo os payloads de mensagens comprimidas medidos após a compressão, quaisquer itens em mensagens comprimidas que não foram comprimidas, como cabeçalhos do Protocolo X, e quaisquer mensagens não comprimidas. A variável de status `Mysqlx_bytes_sent_compressed_payload` mostra o número total de bytes enviados como payloads de mensagens comprimidas, medidos após a compressão, e a variável de status `Mysqlx_bytes_sent_uncompressed_frame` mostra o número total de bytes para os mesmos payloads de mensagens, mas medidos antes da compressão. A taxa de compressão, que mostra a eficiência do algoritmo de compressão, pode, portanto, ser calculada usando a seguinte expressão:

```
mysqlx_bytes_sent_uncompressed_frame / mysqlx_bytes_sent_compressed_payload
```

A eficácia da compressão para mensagens do protocolo X enviadas pelo servidor pode ser calculada usando a seguinte expressão:

```
(mysqlx_bytes_sent - mysqlx_bytes_sent_compressed_payload + mysqlx_bytes_sent_uncompressed_frame) / mysqlx_bytes_sent
```

Para as mensagens recebidas pelo servidor pelos clientes, a variável de status `Mysqlx_bytes_received_compressed_payload` mostra o número total de bytes recebidos como cargas úteis de mensagens comprimidas, medido antes da descomprimagem, e a variável de status `Mysqlx_bytes_received_uncompressed_frame` mostra o número total de bytes para essas mesmas cargas úteis de mensagens, mas medido após a descomprimagem. A variável de status `Mysqlx_bytes_received` inclui cargas úteis de mensagens comprimidas medidas antes da descomprimagem, quaisquer itens não comprimidos em mensagens comprimidas e quaisquer mensagens não comprimidas.

### 22.5.6 Opções e variáveis do plugin X

Esta seção descreve as opções de comando e as variáveis do sistema que configuram o X Plugin, bem como as variáveis de status disponíveis para fins de monitoramento. Se os valores de configuração especificados no momento do início forem incorretos, o X Plugin pode não ser iniciado corretamente e o servidor não o carregará. Nesse caso, o servidor também pode produzir mensagens de erro para outras configurações do X Plugin, pois não consegue reconhecê-las.

#### 22.5.6.1 Opção de Plugin e Referência de Variável

Esta tabela fornece uma visão geral das opções de comando, variáveis do sistema e variáveis de status fornecidas pelo X Plugin.

**Tabela 22.2 Opção de Plugin e Referência de Variável**

<table frame="box" rules="all" summary="Reference for X Plugin command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">mysqlx</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">Mysqlx_aborted_clients</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_address</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_bind_address</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_received</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_received_compressed_payload</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_received_uncompressed_frame</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_sent_compressed_payload</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_bytes_sent_uncompressed_frame</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_compression_algorithm</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Session</td> <td>No</td> </tr><tr><th scope="row">mysqlx_compression_algorithms</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_compression_level</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Session</td> <td>No</td> </tr><tr><th scope="row">mysqlx_connect_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_connection_accept_errors</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connection_errors</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connections_accepted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connections_closed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_connections_rejected</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_create_view</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_delete</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_drop_view</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_find</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_insert</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_modify_view</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_crud_update</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_deflate_default_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_deflate_max_client_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_document_id_unique_prefix</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_enable_hello_notice</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_errors_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_errors_unknown_message_type</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_expect_close</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_expect_open</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_idle_worker_thread_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_init_error</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_interactive_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_lz4_default_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_lz4_max_client_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_max_allowed_packet</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_max_connections</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_messages_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_min_worker_threads</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_notice_global_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_notice_other_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_notice_warning_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_notified_by_group_replication</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_port</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_port</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_port_open_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_read_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_rows_sent</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_accepted</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_closed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_fatal_error</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_killed</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_sessions_rejected</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_socket</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_socket</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_accept_renegotiates</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_accepts</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_active</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_ca</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_capath</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_cert</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_cipher</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_cipher</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_cipher_list</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_crl</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_crlpath</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_ctx_verify_depth</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_ctx_verify_mode</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_finished_accepts</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_ssl_key</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_server_not_after</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_server_not_before</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_verify_depth</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_verify_mode</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_ssl_version</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_create_collection</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_create_collection_index</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_disable_notices</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_drop_collection</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_drop_collection_index</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_enable_notices</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_ensure_collection</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_execute_mysqlx</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_execute_sql</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_execute_xplugin</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_get_collection_options</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_kill_client</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_list_clients</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_list_notices</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_list_objects</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_modify_collection_options</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_stmt_ping</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">mysqlx_wait_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">Mysqlx_worker_threads</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Mysqlx_worker_threads_active</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">mysqlx_write_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Session</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_zstd_default_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">mysqlx_zstd_max_client_compression_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr></tbody></table>

#### 22.5.6.2 Opções do Plugin e Variáveis do Sistema

Para controlar a ativação do X Plugin, use esta opção:

* `--mysqlx[=value]`

  <table frame="box" rules="all" summary="Properties for mysqlx"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

Esta opção controla como o servidor carrega o X Plugin no início. No MySQL 8.0, o X Plugin é ativado por padrão, mas esta opção pode ser usada para controlar seu estado de ativação.

O valor da opção deve ser um dos disponíveis para opções de carregamento de plugins, conforme descrito na Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Se o X Plugin estiver habilitado, ele expõe várias variáveis do sistema que permitem o controle sobre sua operação:

* `mysqlx_bind_address`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>

O endereço de rede no qual o X Plugin escuta conexões TCP/IP. Essa variável não é dinâmica e pode ser configurada apenas na inicialização. Esse é o equivalente do X Plugin à variável de sistema `bind_address`; consulte a descrição dessa variável para obter mais informações.

Por padrão, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Se `mysqlx_bind_address` for especificado, seu valor deve atender a esses requisitos:

+ Antes do MySQL 8.0.21, `mysqlx_bind_address` aceita um único valor de endereço, que pode especificar um único endereço IP não comodal (seja IPv4 ou IPv6), ou um nome de host, ou um dos formatos de endereço comodal que permitem ouvir em múltiplas interfaces de rede (`*`, `0.0.0.0` ou `::`).

+ A partir do MySQL 8.0.21, `mysqlx_bind_address` aceita um único valor, conforme descrito acima, ou uma lista de valores separados por vírgula. Quando a variável lista vários valores, cada valor deve especificar um único endereço IP não protegido por asterisco (IPv4 ou IPv6) ou um nome de host. Formatos de endereço com asterisco (`*`, `0.0.0.0` ou `::`) não são permitidos em uma lista de valores.

+ a partir do MySQL 8.0.22, o valor pode incluir um especificador de espaço de rede.

Os endereços IP podem ser especificados como endereços IPv4 ou IPv6. Para qualquer valor que seja um nome de host, o X Plugin resolve o nome para um endereço IP e se vincula a esse endereço. Se um nome de host resolver para múltiplos endereços IP, o X Plugin usa o primeiro endereço IPv4, se houver algum, ou o primeiro endereço IPv6, caso contrário.

O X Plugin trata diferentes tipos de endereços da seguinte forma:

+ Se o endereço for `*`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor e, se o host do servidor suportar IPv6, em todas as interfaces IPv6. Use este endereço para permitir conexões tanto de IPv4 quanto de IPv6 para o X Plugin. Este valor é o padrão. Se a variável especificar uma lista de vários valores, este valor não é permitido.

+ Se o endereço for `0.0.0.0`, o X Plugin aceita conexões TCP/IP em todas as interfaces IPv4 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for `::`, o X Plugin aceita conexões TCP/IP em todas as interfaces de IPv4 e IPv6 do host do servidor. Se a variável especificar uma lista de múltiplos valores, este valor não é permitido.

+ Se o endereço for um endereço mapeado IPv4, o X Plugin aceita conexões TCP/IP para esse endereço, no formato IPv4 ou IPv6. Por exemplo, se o X Plugin estiver vinculado a `::ffff:127.0.0.1`, um cliente como o MySQL Shell pode se conectar usando `--host=127.0.0.1` ou `--host=::ffff:127.0.0.1`.

+ Se o endereço for um endereço IPv4 ou IPv6 "regular" (como `127.0.0.1` ou `::1`), o X Plugin aceita conexões TCP/IP apenas para esse endereço IPv4 ou IPv6.

Essas regras se aplicam à especificação de um espaço de rede para um endereço:

+ Uma faixa de rede pode ser especificada para um endereço IP ou um nome de host.

+ Não é possível especificar uma área de rede para um endereço IP wildcard.

+ Para um endereço específico, o espaço de nomes de rede é opcional. Se for fornecido, deve ser especificado como um sufixo `/ns` imediatamente após o endereço.

+ Um endereço sem o sufixo `/ns` usa o espaço de nomes global do sistema host. Portanto, o espaço de nomes global é o padrão.

+ Um endereço com o sufixo `/ns` usa o namespace chamado *`ns`*.

+ O sistema de hospedagem deve suportar namespaces de rede e cada namespace nomeado deve ter sido configurado previamente. Nomear um namespace inexistente produz um erro.

+ Se o valor da variável especificar vários endereços, pode incluir endereços no espaço de nomes global, em namespaces nomeados ou uma mistura.

Para obter informações adicionais sobre namespaces de rede, consulte a Seção 7.1.14, “Suporte a namespaces de rede”.

Importante

Como o X Plugin não é um plugin obrigatório, ele não impede o início do servidor se houver um erro no endereço especificado ou na lista de endereços (como o MySQL Server faz para os erros do `bind_address`). Com o X Plugin, se um dos endereços listados não puder ser analisado ou se o X Plugin não puder se conectar a ele, o endereço é ignorado, uma mensagem de erro é registrada e o X Plugin tenta se conectar a cada um dos endereços restantes. A variável de status `Mysqlx_address` do X Plugin exibe apenas os endereços da lista para os quais a conexão foi bem-sucedida. Se nenhum dos endereços listados resultar em uma conexão bem-sucedida ou se um único endereço especificado falhar, o X Plugin registra a mensagem de erro `ER_XPLUGIN_FAILED_TO_PREPARE_IO_INTERFACES`, afirmando que o X Protocol não pode ser usado. O `mysqlx_bind_address` não é dinâmico, então para corrigir quaisquer problemas, você deve parar o servidor, corrigir o valor da variável do sistema e reiniciar o servidor.

* `mysqlx_compression_algorithms`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>

Os algoritmos de compressão que são permitidos para uso em conexões do X Protocol. Por padrão, os algoritmos Deflate, LZ4 e zstd são permitidos. Para não permitir nenhum dos algoritmos, defina `mysqlx_compression_algorithms` para incluir apenas os que você permite. Os nomes dos algoritmos `deflate_stream`, `lz4_message` e `zstd_stream` podem ser especificados em qualquer combinação, e a ordem e o caso não são importantes. Se você definir a variável do sistema para a string vazia, nenhum algoritmo de compressão é permitido e apenas conexões não comprimidas são usadas. Use as variáveis de sistema específicas para o algoritmo para ajustar o nível de compressão padrão e máximo para cada algoritmo permitido. Para mais detalhes e informações sobre como a compressão de conexão do X Protocol se relaciona com as configurações equivalentes do MySQL Server, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

* `mysqlx_connect_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_connect_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-connect-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_connect_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>30</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>1000000000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

O número de segundos que o X Plugin espera para receber o primeiro pacote de clientes recém-conectados. Este é o equivalente do X Plugin a `connect_timeout`; consulte a descrição dessa variável para obter mais informações.

* `mysqlx_deflate_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_deflate_default_compression_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx_deflate_default_compression_level=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.20</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_deflate_default_compression_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>9</code></td> </tr></tbody></table>

O nível de compressão padrão que o servidor utiliza para o algoritmo Deflate em conexões do X Protocol. Especifique o nível como um número inteiro de 1 (o menor esforço de compressão) a 9 (o maior esforço). Este nível é utilizado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar esta variável do sistema, o servidor utiliza o nível 3 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

* `mysqlx_deflate_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_deflate_max_client_compression_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx_deflate_max_client_compression_level=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.20</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_deflate_max_client_compression_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>9</code></td> </tr></tbody></table>

O nível máximo de compressão que o servidor permite para o algoritmo Deflate em conexões do X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usa o nível que você define aqui. Se você não especificar esta variável do sistema, o servidor define um nível máximo de compressão de 5.

* `mysqlx_document_id_unique_prefix`

  <table frame="box" rules="all" summary="Properties for mysqlx_document_id_unique_prefix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-document-id-unique-prefix=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_document_id_unique_prefix</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

Define os primeiros 4 bytes dos IDs de documento gerados pelo servidor quando os documentos são adicionados a uma coleção. Ao definir essa variável para um valor único por instância, você pode garantir que os IDs de documento sejam únicos em todas as instâncias. Veja Entendendo IDs de documento.

* `mysqlx_enable_hello_notice`

  <table frame="box" rules="all" summary="Properties for mysqlx_enable_hello_notice"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-enable-hello-notice[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_enable_hello_notice</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

Controla mensagens enviadas para clientes clássicos do protocolo MySQL que tentam se conectar através do protocolo X. Quando ativado, os clientes que não suportam o protocolo X que tentam se conectar à porta do protocolo X recebem um erro explicando que estão usando o protocolo errado.

* `mysqlx_idle_worker_thread_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_idle_worker_thread_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-idle-worker-thread-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_idle_worker_thread_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>60</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

O número de segundos após o qual os threads de trabalhadores ociosos são terminados.

* `mysqlx_interactive_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_interactive_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-interactive-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_interactive_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>28800</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

O valor padrão da variável de sessão `mysqlx_wait_timeout` para clientes interativos. (O número de segundos para esperar que os clientes interativos expirem.)

* `mysqlx_lz4_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>0

O nível de compressão padrão que o servidor utiliza para o algoritmo LZ4 nas conexões do X Protocol. Especifique o nível como um número inteiro de 0 (menor esforço de compressão) a 16 (maior esforço). Este nível é utilizado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar esta variável do sistema, o servidor utiliza o nível 2 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com X Plugin”.

* `mysqlx_lz4_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>1

O nível máximo de compressão que o servidor permite para o algoritmo LZ4 nas conexões do X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usa o nível que você define aqui. Se você não especificar esta variável do sistema, o servidor define um nível máximo de compressão de 8.

* `mysqlx_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>2

O tamanho máximo dos pacotes de rede que podem ser recebidos pelo X Plugin. Esse limite também se aplica quando a compressão é usada para a conexão, portanto, o pacote de rede deve ser menor que esse tamanho após a mensagem ter sido descomprimida. Esse é o equivalente do X Plugin ao `max_allowed_packet`; veja a descrição daquela variável para mais informações.

* `mysqlx_max_connections`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>3

O número máximo de conexões de clientes concorrentes que o X Plugin pode aceitar. Este é o equivalente do `max_connections` do X Plugin; consulte a descrição dessa variável para obter mais informações.

Para modificações nesta variável, se o novo valor for menor que o número atual de conexões, o novo limite é considerado apenas para novas conexões.

* `mysqlx_min_worker_threads`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>4

O número mínimo de threads de trabalho usadas pelo X Plugin para lidar com solicitações de clientes.

* `mysqlx_port`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>5

O porta de rede no qual o X Plugin escuta conexões TCP/IP. Este é o equivalente do X Plugin ao `port`; consulte a descrição dessa variável para mais informações.

* `mysqlx_port_open_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>6

O número de segundos que o X Plugin espera para uma porta TCP/IP ficar livre.

* `mysqlx_read_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>7

O número de segundos que o X Plugin espera para bloquear operações de leitura a serem concluídas. Após esse tempo, se a operação de leitura não for bem-sucedida, o X Plugin fecha a conexão e retorna um aviso com o código de erro ER_IO_READ_ERROR para o aplicativo do cliente.

* `mysqlx_socket`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>8

O caminho para um arquivo de soquete Unix que o Plugin X usa para conexões. Esta configuração é usada apenas pelo MySQL Server quando executado em sistemas operacionais Unix. Os clientes podem usar este soquete para se conectar ao MySQL Server usando o Plugin X.

O caminho padrão `mysqlx_socket` e o nome do arquivo são baseados no caminho padrão e no nome do arquivo do arquivo de soquete principal do MySQL Server, com a adição de um `x` anexado ao nome do arquivo. O caminho padrão e o nome do arquivo do arquivo de soquete principal é `/tmp/mysql.sock`, portanto, o caminho padrão e o nome do arquivo do arquivo de soquete do Plugin X é `/tmp/mysqlx.sock`.

Se você especificar um caminho alternativo e um nome de arquivo para o arquivo de soquete principal na inicialização do servidor usando a variável de sistema `socket`, isso não afeta o padrão do arquivo de soquete do Plugin X. Nesta situação, se você quiser armazenar ambos os soquetes em um único caminho, você deve definir a variável de sistema `mysqlx_socket` também. Por exemplo, em um arquivo de configuração:

  ```
  socket=/home/sockets/mysqld/mysql.sock
  mysqlx_socket=/home/sockets/xplugin/xplugin.sock
  ```

Se você alterar o caminho padrão e o nome do arquivo do socket principal no momento da compilação usando a opção de compilação `MYSQL_UNIX_ADDR`, isso afeta o padrão do arquivo de socket do Plugin X, que é formado adicionando um `x` ao nome do arquivo `MYSQL_UNIX_ADDR`. Se você deseja definir um padrão diferente para o arquivo de socket do Plugin X no momento da compilação, use a opção de compilação `MYSQLX_UNIX_ADDR`.

A variável de ambiente `MYSQLX_UNIX_PORT` também pode ser usada para definir um padrão para o arquivo de soquete do Plugin X no início da inicialização do servidor (consulte Seção 6.9, “Variáveis de Ambiente”). Se você definir essa variável de ambiente, ela substituirá o valor compilado `MYSQLX_UNIX_ADDR`, mas será substituída pelo valor `mysqlx_socket`.

* `mysqlx_ssl_ca`

  <table frame="box" rules="all" summary="Properties for mysqlx_bind_address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-bind-address=addr</code></td> </tr><tr><th>System Variable</th> <td><code>mysqlx_bind_address</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>*</code></td> </tr></tbody></table>9

A variável de sistema `mysqlx_ssl_ca` é semelhante à `ssl_ca`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_ssl_capath`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>0

A variável de sistema `mysqlx_ssl_capath` é semelhante a `ssl_capath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_ssl_cert`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>1

A variável de sistema `mysqlx_ssl_cert` é semelhante a `ssl_cert`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_ssl_cipher`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>2

A variável de sistema `mysqlx_ssl_cipher` é semelhante a `ssl_cipher`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_ssl_crl`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>3

A variável de sistema `mysqlx_ssl_crl` é semelhante à `ssl_crl`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_ssl_crlpath`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>4

A variável de sistema `mysqlx_ssl_crlpath` é semelhante a `ssl_crlpath`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do servidor MySQL. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_ssl_key`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>5

A variável de sistema `mysqlx_ssl_key` é semelhante à `ssl_key`, exceto que ela se aplica ao X Plugin em vez da interface principal de conexão do MySQL Server. Para obter informações sobre a configuração do suporte de criptografia para o X Plugin, consulte a Seção 22.5.3, “Usando conexões criptografadas com o X Plugin”.

* `mysqlx_wait_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>6

O número de segundos que o X Plugin espera por atividade em uma conexão. Após esse tempo, se a operação de leitura não for bem-sucedida, o X Plugin fecha a conexão. Se o cliente não for interativo, o valor inicial da variável de sessão é copiado da variável global `mysqlx_wait_timeout`. Para clientes interativos, o valor inicial é copiado da sessão `mysqlx_interactive_timeout`.

* `mysqlx_write_timeout`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>7

O número de segundos que o X Plugin espera para bloquear operações de escrita para serem concluídas. Após esse tempo, se a operação de escrita não for bem-sucedida, o X Plugin fecha a conexão.

* `mysqlx_zstd_default_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>8

O nível de compressão padrão que o servidor utiliza para o algoritmo zstd nas conexões do protocolo X. Para versões da biblioteca zstd a partir de 1.4.0, você pode definir valores positivos de 1 a 22 (o maior esforço de compressão), ou valores negativos que representam um esforço progressivamente menor. Um valor de 0 é convertido em um valor de 1. Para versões anteriores da biblioteca zstd, você só pode especificar o valor 3. Esse nível é usado se o cliente não solicitar um nível de compressão durante a negociação de capacidades. Se você não especificar essa variável do sistema, o servidor utiliza o nível 3 como padrão. Para mais informações, consulte a Seção 22.5.5, “Compressão de Conexão com Plugin X”.

* `mysqlx_zstd_max_client_compression_level`

  <table frame="box" rules="all" summary="Properties for mysqlx_compression_algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysqlx-compression-algorithms=value</code></td> </tr><tr><th>Introduced</th> <td>8.0.19</td> </tr><tr><th>System Variable</th> <td><code>mysqlx_compression_algorithms</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Set</td> </tr><tr><th>Default Value</th> <td><code>deflate_stream,lz4_message,zstd_stream</code></td> </tr><tr><th>Valores válidos</th> <td><p class="valid-value"><code>deflate_stream</code></p><p class="valid-value"><code>lz4_message</code></p><p class="valid-value"><code>zstd_stream</code></p></td> </tr></tbody></table>9

O nível máximo de compressão que o servidor permite para o algoritmo zstd nas conexões do X Protocol. A faixa é a mesma que para o nível de compressão padrão para este algoritmo. Se o cliente solicitar um nível de compressão mais alto que este, o servidor usa o nível que você definiu aqui. Se você não especificar esta variável do sistema, o servidor define um nível máximo de compressão de 11.

#### 22.5.6.3 Variáveis de status do plugin X

As variáveis de status do X Plugin têm os seguintes significados.

* `Mysqlx_aborted_clients`

O número de clientes que foram desconectados devido a um erro de entrada ou saída.

* `Mysqlx_address`

O endereço ou endereços da rede para os quais o X Plugin aceita conexões TCP/IP. Se vários endereços foram especificados usando a variável de sistema `mysqlx_bind_address`, `Mysqlx_address` exibe apenas aqueles endereços para os quais o vínculo teve sucesso. Se o vínculo falhou para todos os endereços de rede especificados por `mysqlx_bind_address`, ou se a opção `skip_networking` foi usada, o valor de `Mysqlx_address` é `UNDEFINED`. Se o início do X Plugin ainda não estiver completo, o valor de `Mysqlx_address` é vazio.

* `Mysqlx_bytes_received`

O número total de bytes recebidos através da rede. Se a compressão for usada para a conexão, esse número inclui os payloads de mensagens comprimidas medidos antes da descomprimagem (`Mysqlx_bytes_received_compressed_payload`), quaisquer itens em mensagens comprimidas que não foram comprimidas, como os cabeçalhos do Protocolo X, e quaisquer mensagens não comprimidas.

* `Mysqlx_bytes_received_compressed_payload`

O número de bytes recebidos como cargas úteis de mensagens comprimidas, medido antes da descomprimagem.

* `Mysqlx_bytes_received_uncompressed_frame`

O número de bytes recebidos como cargas úteis de mensagens comprimidas, medido após a descomprimagem.

* `Mysqlx_bytes_sent`

O número total de bytes enviados através da rede. Se a compressão for usada para a conexão, esse número inclui os payloads de mensagens comprimidas medidos após a compressão (`Mysqlx_bytes_sent_compressed_payload`), quaisquer itens em mensagens comprimidas que não foram comprimidas, como os cabeçalhos do Protocolo X, e quaisquer mensagens não comprimidas.

* `Mysqlx_bytes_sent_compressed_payload`

O número de bytes enviados como cargas úteis de mensagens comprimidas, medido após a compressão.

* `Mysqlx_bytes_sent_uncompressed_frame`

O número de bytes enviados como cargas úteis de mensagens comprimidas, medido antes da compressão.

* `Mysqlx_compression_algorithm`

(Âmbito da sessão) O algoritmo de compressão utilizado para a conexão do Protocolo X para esta sessão. Os algoritmos de compressão permitidos estão listados na variável de sistema `mysqlx_compression_algorithms`.

* `Mysqlx_compression_level`

(Âmbito da sessão) O nível de compressão utilizado para a conexão do protocolo X para esta sessão.

* `Mysqlx_connection_accept_errors`

O número de conexões que causaram erros de aceitação.

* `Mysqlx_connection_errors`

O número de conexões que causaram erros.

* `Mysqlx_connections_accepted`

O número de conexões que foram aceitas.

* `Mysqlx_connections_closed`

O número de conexões que foram fechadas.

* `Mysqlx_connections_rejected`

O número de conexões que foram rejeitadas.

* `Mysqlx_crud_create_view`

O número de solicitações de visualização criadas recebidas.

* `Mysqlx_crud_delete`

O número de solicitações de exclusão recebidas.

* `Mysqlx_crud_drop_view`

O número de solicitações de visualização em queda recebidas.

* `Mysqlx_crud_find`

O número de solicitações de pesquisa recebidas.

* `Mysqlx_crud_insert`

O número de pedidos de inserção recebidos.

* `Mysqlx_crud_modify_view`

O número de solicitações de modificação de visualização recebidas.

* `Mysqlx_crud_update`

O número de solicitações de atualização recebidas.

* `Mysqlx_cursor_close`

O número de mensagens de fechamento do cursor recebidas

* `Mysqlx_cursor_fetch`

O número de mensagens de cursor-fetch recebidas

* `Mysqlx_cursor_open`

O número de mensagens recebidas com cursor aberto

* `Mysqlx_errors_sent`

O número de erros enviados aos clientes.

* `Mysqlx_errors_unknown_message_type`

O número de tipos de mensagens desconhecidas que foram recebidos.

* `Mysqlx_expect_close`

O número de blocos de expectativa fechados.

* `Mysqlx_expect_open`

Número de blocos de expectativa abertos.

* `Mysqlx_init_error`

O número de erros durante a inicialização.

* `Mysqlx_messages_sent`

O número total de mensagens de todos os tipos enviadas aos clientes.

* `Mysqlx_notice_global_sent`

O número de notificações globais enviadas aos clientes.

* `Mysqlx_notice_other_sent`

O número de outros tipos de notificações enviadas de volta aos clientes.

* `Mysqlx_notice_warning_sent`

O número de avisos enviados de volta aos clientes.

* `Mysqlx_notified_by_group_replication`

Número de notificações de replicação de grupo enviadas aos clientes.

* `Mysqlx_port`

O porto TCP ao qual o X Plugin está ouvindo. Se uma ligação de rede falhou, ou se a variável de sistema `skip_networking` estiver habilitada, o valor mostra `UNDEFINED`.

* `Mysqlx_prep_deallocate`

Número de mensagens de alocação de recursos de declaração preparada recebidas

* `Mysqlx_prep_execute`

O número de mensagens de execução de declaração preparada recebidas

* `Mysqlx_prep_prepare`

O número de mensagens de declaração preparada recebidas

* `Mysqlx_rows_sent`

O número de linhas enviadas de volta aos clientes.

* `Mysqlx_sessions`

O número de sessões que foram abertas.

* `Mysqlx_sessions_accepted`

O número de tentativas de sessão que foram aceitas.

* `Mysqlx_sessions_closed`

O número de sessões que foram fechadas.

* `Mysqlx_sessions_fatal_error`

O número de sessões que foram encerradas com um erro fatal.

* `Mysqlx_sessions_killed`

O número de sessões que foram eliminadas.

* `Mysqlx_sessions_rejected`

O número de tentativas de sessão que foram rejeitadas.

* `Mysqlx_socket`

O socket Unix ao qual o X Plugin está ouvindo.

* `Mysqlx_ssl_accept_renegotiates`

O número de negociações necessárias para estabelecer a conexão.

* `Mysqlx_ssl_accepts`

O número de conexões SSL aceitas.

* `Mysqlx_ssl_active`

Se o SSL estiver ativo.

* `Mysqlx_ssl_cipher`

O cifrador SSL atual (vazio para conexões sem SSL).

* `Mysqlx_ssl_cipher_list`

Uma lista de possíveis cifradores SSL (vazia para conexões sem SSL).

* `Mysqlx_ssl_ctx_verify_depth`

O limite de profundidade de verificação de certificado atualmente definido em ctx.

* `Mysqlx_ssl_ctx_verify_mode`

O modo de verificação de certificado atualmente definido em ctx.

* `Mysqlx_ssl_finished_accepts`

O número de conexões SSL bem-sucedidas ao servidor.

* `Mysqlx_ssl_server_not_after`

A última data em que o certificado SSL é válido.

* `Mysqlx_ssl_server_not_before`

A primeira data em que o certificado SSL é válido.

* `Mysqlx_ssl_verify_depth`

A profundidade de verificação de certificado para conexões SSL.

* `Mysqlx_ssl_verify_mode`

O modo de verificação de certificado para conexões SSL.

* `Mysqlx_ssl_version`

O nome do protocolo utilizado para conexões SSL.

* `Mysqlx_stmt_create_collection`

Número de declarações de criação de coleção recebidas.

* `Mysqlx_stmt_create_collection_index`

Número de declarações de índice de coleção criadas recebidas.

* `Mysqlx_stmt_disable_notices`

O número de declarações de aviso de invalidez recebidas.

* `Mysqlx_stmt_drop_collection`

O número de declarações de coleta de gotas recebidas.

* `Mysqlx_stmt_drop_collection_index`

O número de declarações de índices de coleta de gotas recebidas.

* `Mysqlx_stmt_enable_notices`

O número de declarações de notificação de ativação recebidas.

* `Mysqlx_stmt_ensure_collection`

O número de declarações de cobrança recebidas.

* `Mysqlx_stmt_execute_mysqlx`

O número de mensagens StmtExecute recebidas com o namespace definido como `mysqlx`.

* `Mysqlx_stmt_execute_sql`

O número de solicitações StmtExecute recebidas para o espaço de nome SQL.

* `Mysqlx_stmt_execute_xplugin`

O número de solicitações StmtExecute recebidas para o namespace `xplugin`. A partir do MySQL 8.0.19, o namespace `xplugin` foi removido, portanto, essa variável de status não é mais usada.

* `Mysqlx_stmt_get_collection_options`

O número de declarações de objeto de coleta de get recebidas.

* `Mysqlx_stmt_kill_client`

Número de declarações de clientes que receberam um pedido de morte.

* `Mysqlx_stmt_list_clients`

Número de declarações recebidas de clientes da lista.

* `Mysqlx_stmt_list_notices`

O número de declarações de notificação de lista recebidas.

* `Mysqlx_stmt_list_objects`

Número de declarações de objetos de lista recebidas.

* `Mysqlx_stmt_modify_collection_options`

O número de declarações recebidas sobre as opções de coleta de modificação.

* `Mysqlx_stmt_ping`

O número de declarações de ping recebidas.

* `Mysqlx_worker_threads`

O número de fios de trabalho disponíveis.

* `Mysqlx_worker_threads_active`

O número de fios de trabalho atualmente utilizados.

### 22.5.7 Monitoramento do Plugin X

Para monitoramento geral do X Plugin, use as variáveis de status que ele expõe. Consulte a Seção 22.5.6.3, “Variáveis de Status do X Plugin”. Para informações específicas sobre o monitoramento dos efeitos da compressão de mensagens, consulte Compressão da Conexão de Monitoramento para X Plugin.

#### Monitoramento SQL Gerado pelo Plugin X

Esta seção descreve como monitorar as declarações SQL que o X Plugin gera quando você executa operações do X DevAPI. Quando você executa uma declaração CRUD, ela é traduzida em SQL e executada no servidor. Para poder monitorar o SQL gerado, as tabelas do Schema do Performance Schema devem ser habilitadas. O SQL é registrado nas tabelas `performance_schema.events_statements_current`, `performance_schema.events_statements_history` e `performance_schema.events_statements_history_long`. O exemplo a seguir usa o esquema `world_x`, importado como parte dos tutoriais de quickstart nesta seção. Usamos o MySQL Shell no modo Python, e o comando `\sql` que permite emitir declarações SQL sem mudar para o modo SQL. Isso é importante, porque, se você tentar mudar para o modo SQL, o procedimento mostrará o resultado dessa operação em vez da operação do X DevAPI. O comando `\sql` é usado da mesma maneira se você estiver usando o MySQL Shell no modo JavaScript.

1. Verifique se o consumidor `events_statements_history` está habilitado. Questão:

   ```
   mysql-py> \sql SELECT enabled FROM performance_schema.setup_consumers WHERE NAME = 'events_statements_history'
   +---------+
   | enabled |
   +---------+
   | YES     |
   +---------+
   ```

2. Verifique se todos os instrumentos reportam dados ao consumidor. Questão:

   ```
   mysql-py> \sql SELECT NAME, ENABLED, TIMED FROM performance_schema.setup_instruments WHERE NAME LIKE 'statement/%' AND NOT (ENABLED and TIMED)
   ```

Se esta declaração indicar pelo menos uma linha, você precisa habilitar os instrumentos. Veja a Seção 29.4, “Configuração do Runtime do Schema de Desempenho”.

3. Obtenha o ID do fio da conexão atual. Questão:

   ```
   mysql-py> \sql SELECT thread_id INTO @id FROM performance_schema.threads WHERE processlist_id=connection_id()
   ```

4. Execute a operação CRUD da X DevAPI para a qual você deseja ver o SQL gerado. Por exemplo, emita:

   ```
   mysql-py> db.CountryInfo.find("Name = :country").bind("country", "Italy")
   ```

Você não deve emitir mais operações para o próximo passo para mostrar o resultado correto.

5. Mostre a última consulta SQL feita por este ID de thread. Problema:

   ```
   mysql-py> \sql SELECT THREAD_ID, MYSQL_ERRNO,SQL_TEXT FROM performance_schema.events_statements_history WHERE THREAD_ID=@id ORDER BY TIMER_START DESC LIMIT 1;
   +-----------+-------------+--------------------------------------------------------------------------------------+
   | THREAD_ID | MYSQL_ERRNO | SQL_TEXT                                                                             |
   +-----------+-------------+--------------------------------------------------------------------------------------+
   |        29 |           0 | SELECT doc FROM `world_x`.`CountryInfo` WHERE (JSON_EXTRACT(doc,'$.Name') = 'Italy') |
   +-----------+-------------+--------------------------------------------------------------------------------------+
   ```

O resultado mostra o SQL gerado pelo X Plugin com base na declaração mais recente, neste caso, a operação CRUD do X DevAPI do passo anterior.