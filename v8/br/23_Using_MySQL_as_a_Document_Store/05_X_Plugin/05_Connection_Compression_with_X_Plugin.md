### 22.5.5 Compressão de conexão com o plugin X

A partir do MySQL 8.0.19, o X Plugin suporta a compressão de mensagens enviadas por conexões do protocolo X. As conexões podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente compatível. A ativação da compressão reduz o número de bytes enviados pela rede, mas adiciona um custo adicional de CPU ao servidor e ao cliente para operações de compressão e descompactação. Portanto, os benefícios da compressão ocorrem principalmente quando há baixa largura de banda da rede, o tempo de transferência da rede domina o custo das operações de compressão e descompactação, e os conjuntos de resultados são grandes.

Nota

Diferentes clientes do MySQL implementam o suporte para compressão de conexão de maneira diferente; consulte a documentação do seu cliente para obter detalhes. Por exemplo, para conexões com o protocolo MySQL clássico, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

- Configurando a Compressão de Conexão para o Plugin X
- Características de Conexão Compressa para o Plugin X
- Monitoramento da compressão da conexão para o plugin X

#### Configurando a Compressão de Conexão para o Plugin X

Por padrão, o X Plugin suporta os algoritmos de compressão zstd, LZ4 e Deflate. A compressão com o algoritmo Deflate é realizada usando a biblioteca de software zlib, portanto, a configuração do algoritmo de compressão `deflate_stream` para conexões do X Protocol é equivalente à configuração `zlib` para conexões clássicas do protocolo MySQL.

No lado do servidor, você pode impedir qualquer algoritmo de compressão definindo a variável de sistema `mysqlx_compression_algorithms` para incluir apenas os permitidos. Os nomes dos algoritmos `zstd_stream`, `lz4_message` e `deflate_stream` podem ser especificados em qualquer combinação, e a ordem e a maiúscula não são importantes. Se o valor da variável de sistema for a string vazia, nenhum algoritmo de compressão é permitido e as conexões não são comprimidas.

A tabela a seguir compara as características dos diferentes algoritmos de compressão e mostra suas prioridades atribuídas. Por padrão, o servidor escolhe o algoritmo de maior prioridade permitido em comum pelo servidor e pelo cliente; os clientes podem alterar as prioridades conforme descrito mais adiante. O alias de forma abreviada dos algoritmos pode ser usado pelos clientes ao especificá-los.

**Tabela 22.1 Características do Algoritmo de Compressão de Protocolo X**

<table frame="void"><thead><tr> <th scope="col">Algoritmo</th> <th scope="col">Alias</th> <th scope="col">Taxa de compressão</th> <th scope="col">Capacidade de processamento</th> <th scope="col">Custo da CPU</th> <th scope="col">Prioridade padrão</th> </tr></thead><tbody><tr> <th>[[<code>zsth_stream</code>]]</th> <td>[[<code>zstd</code>]]</td> <td>Alto</td> <td>Alto</td> <td>Médio</td> <td>Primeiro</td> </tr><tr> <th>[[<code>lz4_message</code>]]</th> <td>[[<code>lz4</code>]]</td> <td>Baixo</td> <td>Alto</td> <td>Menor</td> <td>Segundo</td> </tr><tr> <th>[[<code>deflate_stream</code>]]</th> <td>[[<code>deflate</code>]]</td> <td>Alto</td> <td>Baixo</td> <td>Maior</td> <td>Terceiro</td> </tr></tbody></table>

O conjunto de protocolos X de algoritmos de compressão permitidos (se especificados pelo usuário ou padrão) é independente do conjunto de algoritmos de compressão permitidos pelo MySQL Server para conexões de protocolo MySQL clássico, que é especificado pela variável de sistema `protocol_compression_algorithms`. Se você não especificar a variável de sistema `mysqlx_compression_algorithms`, o X Plugin não recorrerá ao uso de configurações de compressão para conexões de protocolo MySQL clássico. Em vez disso, seu padrão é permitir todos os algoritmos mostrados na Tabela 22.1, “Características dos Algoritmos de Compressão do Protocolo X”. Isso é diferente da situação para o contexto TLS, onde as configurações do MySQL Server são usadas se as variáveis de sistema do X Plugin não forem definidas, conforme descrito na Seção 22.5.3, “Uso de Conexões Encriptadas com o X Plugin”. Para informações sobre compressão para conexões de protocolo MySQL clássico, consulte a Seção 6.2.8, “Controle de Compressão de Conexão”.

Do lado do cliente, um pedido de conexão do Protocolo X pode especificar vários parâmetros para o controle de compressão:

- O modo de compressão.
- O nível de compressão (a partir do MySQL 8.0.20).
- A lista de algoritmos de compressão permitidos em ordem de prioridade (a partir do MySQL 8.0.22).

Nota

Alguns clientes ou Conectores podem não suportar uma determinada funcionalidade de controle de compressão. Por exemplo, especificar o nível de compressão para conexões com o Protocolo X é suportado apenas pelo MySQL Shell, e não por outros clientes ou Conectores do MySQL. Consulte a documentação dos produtos específicos para obter detalhes sobre as funcionalidades suportadas e como usá-las.

O modo de conexão tem esses valores permitidos:

- `disabled`: A conexão não está compactada.

- `preferred`: O servidor e o cliente negociam para encontrar um algoritmo de compressão que ambos permitam. Se nenhum algoritmo comum estiver disponível, a conexão permanece não comprimida. Este é o modo padrão, a menos que seja especificado explicitamente.

- `required`: A negociação do algoritmo de compressão ocorre como no modo `preferred`, mas se nenhum algoritmo comum estiver disponível, o pedido de conexão será encerrado com um erro.

Além de concordar com um algoritmo de compressão para cada conexão, o servidor e o cliente podem concordar com um nível de compressão da faixa numérica que se aplica ao algoritmo acordado. À medida que o nível de compressão de um algoritmo aumenta, a taxa de compressão de dados aumenta, o que reduz a largura de banda da rede e o tempo de transferência necessário para enviar a mensagem ao cliente. No entanto, o esforço necessário para a compressão de dados também aumenta, ocupando tempo e recursos de CPU e memória no servidor. Aumentos no esforço de compressão não têm uma relação linear com aumentos na taxa de compressão.

No MySQL 8.0.19, o X Plugin sempre usa o nível de compressão padrão da biblioteca para cada algoritmo (3 para zstd, 0 para LZ4 e 6 para Deflate), e o cliente não pode negociar isso. A partir do MySQL 8.0.20, o cliente pode solicitar um nível de compressão específico durante as negociações de capacidade com o servidor para uma conexão com o X Protocol.

Os níveis de compressão padrão usados pelo X Plugin do MySQL 8.0.20 foram selecionados por meio de testes de desempenho como um bom equilíbrio entre o tempo de compressão e o tempo de trânsito na rede. Esses padrões não são necessariamente os mesmos que o padrão da biblioteca para cada algoritmo. Eles se aplicam se o cliente não solicitar um nível de compressão para o algoritmo. Os níveis de compressão padrão são inicialmente definidos para 3 para zstd, 2 para LZ4 e 3 para Deflate. Você pode ajustar essas configurações usando as variáveis de sistema `mysqlx_zstd_default_compression_level`, `mysqlx_lz4_default_compression_level` e `mysqlx_deflate_default_compression_level`.

Para evitar o consumo excessivo de recursos no servidor, o X Plugin define um nível máximo de compressão que o servidor permite para cada algoritmo. Se um cliente solicitar um nível de compressão que exceda essa configuração, o servidor usará seu nível máximo de compressão permitido (os pedidos de nível de compressão de um cliente são suportados apenas pelo MySQL Shell). Os níveis máximos de compressão são definidos inicialmente em 11 para zstd, 8 para LZ4 e 5 para Deflate. Você pode ajustar essas configurações usando as variáveis de sistema `mysqlx_zstd_max_client_compression_level`, `mysqlx_lz4_max_client_compression_level` e `mysqlx_deflate_max_client_compression_level`.

Se o servidor e o cliente permitirem mais de um algoritmo em comum, a ordem de prioridade padrão para a escolha de um algoritmo durante a negociação é mostrada na Tabela 22.1, “Características do Algoritmo de Compressão do Protocolo X”. A partir do MySQL 8.0.22, para clientes que suportam a especificação de algoritmos de compressão, o pedido de conexão pode incluir uma lista de algoritmos permitidos pelo cliente, especificados usando o nome do algoritmo ou seu alias. A ordem desses algoritmos na lista é considerada como ordem de prioridade pelo servidor. O algoritmo usado neste caso é o primeiro da lista do cliente que também é permitido no lado do servidor. No entanto, a opção para algoritmos de compressão está sujeita ao modo de compressão:

- Se o modo de compressão for `disabled`, a opção de algoritmo de compressão é ignorada.

- Se o modo de compressão for `preferred`, mas nenhum algoritmo permitido no lado do cliente for permitido no lado do servidor, a conexão não será comprimida.

- Se o modo de compressão for `required`, mas nenhum algoritmo permitido no lado do cliente for permitido no lado do servidor, ocorrerá um erro.

Para monitorar os efeitos da compressão de mensagens, use as variáveis de status do Plugin X descritas em Monitoramento da compressão de conexão para o Plugin X. Você pode usar essas variáveis de status para calcular o benefício da compressão de mensagens com suas configurações atuais e usar essas informações para ajustar suas configurações.

#### Características de Conexão Compressa para o Plugin X

A compressão da conexão do Protocolo X opera com os seguintes comportamentos e limites:

- Os sufixos `_stream` e `_message` nos nomes dos algoritmos referem-se a dois modos operacionais diferentes: no modo de fluxo, todas as mensagens do Protocolo X em uma única conexão são comprimidas em um fluxo contínuo e devem ser descomprimidos da mesma maneira — seguindo a ordem em que foram comprimidas e sem pular nenhuma mensagem. No modo de mensagem, cada mensagem é comprimida individualmente e de forma independente, e não precisa ser descomprimidos na ordem em que foram comprimidas. Além disso, o modo de mensagem não exige que todas as mensagens comprimidas sejam descomprimidos.

- A compressão não é aplicada a quaisquer mensagens enviadas antes que a autenticação seja bem-sucedida.

- A compressão não é aplicada para controlar mensagens de fluxo, como as mensagens `Mysqlx.Ok`, `Mysqlx.Error` e `Mysqlx.Sql.StmtExecuteOk`.

- Todas as outras mensagens do Protocolo X podem ser comprimidas se o servidor e o cliente concordarem em um algoritmo de compressão mutuamente permitido durante a negociação de capacidades. Se o cliente não solicitar compressão nessa etapa, nem o cliente nem o servidor aplicarão compressão às mensagens.

- Quando as mensagens enviadas por conexões do protocolo X são comprimidas, o limite especificado pela variável de sistema `mysqlx_max_allowed_packet` ainda se aplica. O pacote de rede deve ser menor que esse limite após o carregamento da mensagem ter sido descomprimido. Se o limite for excedido, o X Plugin retorna um erro de descomprimagem e fecha a conexão.

- Os seguintes pontos dizem respeito às solicitações de nível de compressão por clientes, que é suportado apenas pelo MySQL Shell:

  - Os níveis de compressão devem ser especificados pelo cliente como um inteiro. Se for fornecido qualquer outro tipo de valor, a conexão será fechada com um erro.

  - Se um cliente especificar um algoritmo, mas não um nível de compressão, o servidor usará o nível de compressão padrão para o algoritmo.

  - Se um cliente solicitar um nível de compressão de algoritmo que exceda o nível máximo permitido pelo servidor, o servidor usará o nível máximo permitido.

  - Se um cliente solicitar um nível de compressão de algoritmo inferior ao nível mínimo permitido pelo servidor, o servidor usará o nível mínimo permitido.

#### Monitoramento da compressão da conexão para o plugin X

Você pode monitorar os efeitos da compressão de mensagens usando as variáveis de status do Plugin X. Quando a compressão de mensagens está em uso, a variável de status `Mysqlx_compression_algorithm` da sessão mostra qual algoritmo de compressão está sendo usado para a conexão atual do Protocolo X, e `Mysqlx_compression_level` mostra o nível de compressão selecionado. Essas variáveis de status de sessão estão disponíveis a partir do MySQL 8.0.20.

A partir do MySQL 8.0.19, as variáveis de status do X Plugin podem ser usadas para calcular a eficiência dos algoritmos de compressão selecionados (a proporção de compressão de dados) e o efeito geral do uso da compressão de mensagens. Use o valor da sessão das variáveis de status nos seguintes cálculos para ver qual foi o benefício da compressão de mensagens para uma sessão específica com um algoritmo de compressão conhecido. Ou use o valor global das variáveis de status para verificar o benefício geral da compressão de mensagens para o seu servidor em todas as sessões usando conexões com o X Protocol, incluindo todos os algoritmos de compressão que foram usados para essas sessões e todas as sessões que não usaram compressão de mensagens. Em seguida, você pode ajustar a compressão de mensagens ajustando os algoritmos de compressão permitidos, o nível máximo de compressão e o nível de compressão padrão, conforme descrito na Configuração da Compressão de Conexão para X Plugin.

Quando a compressão de mensagens está em uso, a variável de status `Mysqlx_bytes_sent` mostra o número total de bytes enviados pelo servidor, incluindo os payloads de mensagens comprimidas medidos após a compressão, quaisquer itens em mensagens comprimidas que não foram comprimidas, como cabeçalhos do Protocolo X, e quaisquer mensagens não comprimidas. A variável de status `Mysqlx_bytes_sent_compressed_payload` mostra o número total de bytes enviados como payloads de mensagens comprimidas, medidos após a compressão, e a variável de status `Mysqlx_bytes_sent_uncompressed_frame` mostra o número total de bytes para esses mesmos payloads de mensagens, mas medidos antes da compressão. A taxa de compressão, que mostra a eficiência do algoritmo de compressão, pode, portanto, ser calculada usando a seguinte expressão:

```
mysqlx_bytes_sent_uncompressed_frame / mysqlx_bytes_sent_compressed_payload
```

A eficácia da compressão para mensagens do Protocolo X enviadas pelo servidor pode ser calculada usando a seguinte expressão:

```
(mysqlx_bytes_sent - mysqlx_bytes_sent_compressed_payload + mysqlx_bytes_sent_uncompressed_frame) / mysqlx_bytes_sent
```

Para as mensagens recebidas pelo servidor pelos clientes, a variável de status `Mysqlx_bytes_received_compressed_payload` mostra o número total de bytes recebidos como cargas úteis de mensagens comprimidas, medidos antes da descompactação, e a variável de status `Mysqlx_bytes_received_uncompressed_frame` mostra o número total de bytes para essas mesmas cargas úteis de mensagens, mas medidos após a descompactação. A variável de status `Mysqlx_bytes_received` inclui cargas úteis de mensagens comprimidas medidas antes da descompactação, quaisquer itens não comprimidos em mensagens comprimidas e quaisquer mensagens não comprimidas.
