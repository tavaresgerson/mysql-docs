## 8.5 Mascagem e Desidentificação de Dados do MySQL Enterprise

::: info Nota

A Mascagem e Desidentificação de Dados do MySQL Enterprise é uma extensão incluída na Edição Empresarial do MySQL, um produto comercial. Para saber mais sobre produtos comerciais, consulte <https://www.mysql.com/products/>.

:::

A Edição Empresarial do MySQL oferece capacidades de mascagem e desidentificação de dados:

* Transformação de dados existentes para mascará-los e remover características identificadoras, como alterar todos os dígitos de um número de cartão de crédito, mas os últimos quatro para caracteres `'X'`.
* Geração de dados aleatórios, como endereços de e-mail e números de cartões de pagamento.
* Substituição de dados por dados de dicionários armazenados no banco de dados. Os dicionários são facilmente replicados de maneira padrão. A administração é restrita a usuários autorizados que recebem privilégios especiais para que apenas eles possam criar e modificar os dicionários.

::: info Nota

A Mascagem e Desidentificação de Dados do MySQL Enterprise foi implementada originalmente no MySQL como uma biblioteca de plugins. A partir do MySQL 8.4, a Edição Empresarial do MySQL também fornece componentes para acessar as capacidades de mascagem e desidentificação de dados. Para informações sobre as semelhanças e diferenças, consulte a Tabela 8.45, “Comparação entre Componentes de Mascagem de Dados e Elementos de Plugin”.

Se você estiver usando a Mascagem e Desidentificação de Dados do MySQL Enterprise pela primeira vez, considere instalar os componentes para acessar as melhorias contínuas disponíveis apenas com a infraestrutura de componentes.

:::

A maneira como as aplicações usam essas capacidades depende do propósito para o qual os dados são usados e quem os acessa:

* Aplicações que utilizam dados sensíveis podem protegê-los realizando mascaramento de dados e permitindo o uso de dados parcialmente mascarados para identificação do cliente. Exemplo: um centro de atendimento pode solicitar que os clientes forneçam os últimos quatro dígitos do Número de Seguridade Social.
* Aplicações que exigem dados formatados corretamente, mas não necessariamente os dados originais, podem sintetizar dados de amostra. Exemplo: um desenvolvedor de aplicativos que está testando validadores de dados, mas não tem acesso aos dados originais, pode sintetizar dados aleatórios com o mesmo formato.
* Aplicações que devem substituir um nome real por um termo do dicionário para proteger informações sensíveis, mas ainda fornecer conteúdo realista aos usuários do aplicativo. Exemplo: um usuário em treinamento que está restrito a visualizar endereços recebe um termo aleatório da lista `nomes de cidades` em vez do nome real da cidade. Uma variante deste cenário pode ser que o nome real da cidade seja substituído apenas se ele existir em `usa_city_names`.

Exemplo 1:

As instalações de pesquisa médica podem conter dados de pacientes que compreendem uma mistura de dados pessoais e médicos. Isso pode incluir sequências genéticas (strings longas), resultados de testes armazenados no formato JSON e outros tipos de dados. Embora os dados possam ser usados principalmente por software de análise automatizada, o acesso a dados genômicos ou resultados de testes de pacientes específicos ainda é possível. Nesses casos, o mascaramento de dados deve ser usado para tornar essa informação não identificável pessoalmente.

Exemplo 2:

Uma empresa de processamento de cartões de crédito fornece um conjunto de serviços que utilizam dados sensíveis, como:

* Processar um grande número de transações financeiras por segundo.
* Armazenar uma grande quantidade de dados relacionados às transações.
* Proteger os dados relacionados às transações com requisitos rigorosos para dados pessoais.
* Lidar com reclamações de clientes sobre transações usando dados reversíveis ou parcialmente mascarados.

Uma transação típica pode incluir muitos tipos de informações sensíveis, incluindo:

* Número do cartão de crédito.
* Tipo e valor da transação.
* Tipo de comerciante.
* Criptograma da transação (para confirmar a legitimidade da transação).
* Geolocalização do terminal equipado com GPS (para detecção de fraudes).

Esses tipos de informações podem ser combinados dentro de um banco ou outra instituição financeira que emite cartões com os dados pessoais do cliente, como:

* Nome completo do cliente (pessoa ou empresa).
* Endereço.
* Data de nascimento.
* Número do CPF.
* Endereço de e-mail.
* Número de telefone.

Vários papéis de funcionários dentro da empresa de processamento de cartões e da instituição financeira que emite os cartões exigem acesso a esses dados. Alguns desses papéis podem exigir acesso apenas a dados mascarados. Outros papéis podem exigir acesso aos dados originais caso a caso, que são registrados em logs de auditoria.

A mascagem e a desidentificação são essenciais para a conformidade regulatória, então o MySQL Enterprise Data Masking and De-Identification pode ajudar os desenvolvedores de aplicativos a atender aos requisitos de privacidade:

* PCI – DSS: Dados de Cartões de Pagamento.
* HIPAA: Privacidade de Dados de Saúde, Lei de Tecnologia de Informação para Saúde Econômica e Clínica (HITECH Act).
* Diretiva Geral de Proteção de Dados da UE (GDPR): Proteção de Dados Pessoais.
* Lei de Proteção de Dados (Reino Unido): Proteção de Dados Pessoais.
* Sarbanes Oxley, GLBA, The USA Patriot Act, Identity Theft and Assumption Deterrence Act of 1998.
* FERPA – Dados de Estudantes, NASD, CA SB1386 e AB 1950, Leis Estaduais de Proteção de Dados, Basel II.

As seções a seguir descrevem os elementos da MySQL Enterprise Data Masking and De-Identification, discutem como instalá-la e usá-la, e fornecem informações de referência para seus elementos.