### 8.5.1 Componentes de Máscara de Dados vs. Plugin de Desidentificação de Dados

Anteriormente, o MySQL habilitava as capacidades de mascaramento e desidentificação de dados usando um plugin do lado do servidor, mas passou a usar a infraestrutura de componentes como uma implementação alternativa. A tabela a seguir compara brevemente os componentes de Máscara de Dados e Desidentificação de Dados do MySQL Enterprise e a biblioteca de plugins para fornecer uma visão geral de suas diferenças. Isso pode ajudá-lo a fazer a transição do plugin para os componentes.

::: info Nota

Só os componentes de Máscara de Dados ou o plugin devem ser habilitados de cada vez. Habilitar ambos os componentes e o plugin não é suportado e os resultados podem não ser os esperados.

:::

**Tabela 8.45 Comparação entre Componentes de Máscara de Dados e Elementos do Plugin**

<table><col width="50%"/><col width="25%"/><col width="25%"/><thead><tr> <th>Categoria</th> <th>Componentes</th> <th>Plugin</th> </tr></thead><tbody><tr> <th>Interface</th> <td>Funções de serviço, funções carregáveis</td> <td>Funções carregáveis</td> </tr><tr> <th>Suporte a conjuntos de caracteres multibyte</th> <td>Sim, para funções de mascaramento de propósito geral</td> <td>Não</td> </tr><tr> <th>Funções de mascaramento de propósito geral</th> <td><code>mask_inner()</code>, <code>mask_outer()</code></td> <td><code>mask_inner()</code>, <code>mask_outer()</code></td> </tr><tr> <th>Mascagem de tipos específicos</th> <td>PAN, SSN, IBAN, UUID, Canada SIN, UK NIN</td> <td>PAN, SSN</td> </tr><tr> <th>Geração aleatória de tipos específicos</th> <td>email, telefone dos EUA, PAN, SSN, IBAN, UUID, Canada SIN, UK NIN</td> <td>email, telefone dos EUA, PAN, SSN</td> </tr><tr> <th>Geração aleatória de inteiros dentro de um intervalo dado</th> <td>Sim</td> <td>Sim</td> </tr><tr> <th>Substituição de dicionários persistentes</th> <td>Banco de dados</td> <td>Arquivo</td> </tr><tr> <th>Privilégio para gerenciar dicionários</th> <td>Privilégio dedicado</td> <td>FILE</td> </tr><tr> <th>Registro/desregistro automático de funções carregáveis durante a instalação/desinstalação</th> <td>Sim</td> <td>Não</td> </tr><tr> <th>Melhorias em funções existentes</th> <td>Mais argumentos adicionados à função <code>gen_rnd_email()</code></td> <td>N/A</td> </tr></tbody></table>