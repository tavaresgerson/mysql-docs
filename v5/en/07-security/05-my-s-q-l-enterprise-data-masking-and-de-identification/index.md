## 6.5 MySQL Enterprise Data Masking e De-Identification

[6.5.1 Elementos do MySQL Enterprise Data Masking e De-Identification](data-masking-elements.html)

[6.5.2 Instalação ou Desinstalação do MySQL Enterprise Data Masking e De-Identification](data-masking-installation.html)

[6.5.3 Usando o MySQL Enterprise Data Masking e De-Identification](data-masking-usage.html)

[6.5.4 Referência de Funções do MySQL Enterprise Data Masking e De-Identification](data-masking-function-reference.html)

[6.5.5 Descrições das Funções do MySQL Enterprise Data Masking e De-Identification](data-masking-functions.html)

Nota

MySQL Enterprise Data Masking e De-Identification é uma extensão incluída no MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, acesse <https://www.mysql.com/products/>.

A partir do MySQL 5.7.24, o MySQL Enterprise Edition oferece recursos de Data Masking e De-Identification:

*   Transformação de dados existentes para mascará-los e remover características de identificação, como alterar todos os dígitos de um número de cartão de crédito, exceto os últimos quatro, para caracteres `'X'`.

*   Geração de dados aleatórios, como endereços de e-mail e números de cartões de pagamento.

A forma como as aplicações utilizam esses recursos depende da finalidade para a qual os dados são usados e de quem os acessa:

*   Aplicações que usam dados sensíveis podem protegê-los realizando o Data Masking e permitindo o uso de dados parcialmente mascarados para identificação do cliente. Exemplo: Um call center pode solicitar aos clientes que forneçam os últimos quatro dígitos do seu Social Security number.

*   Aplicações que exigem dados formatados corretamente, mas não necessariamente os dados originais, podem sintetizar dados de amostra. Exemplo: Um desenvolvedor de aplicações que está testando validadores de dados, mas não tem acesso aos dados originais, pode sintetizar dados aleatórios com o mesmo formato.

Exemplo 1:

Instalações de pesquisa médica podem armazenar dados de pacientes que compreendem uma mistura de dados pessoais e médicos. Isso pode incluir sequências genéticas (longas strings), resultados de testes armazenados em formato JSON, e outros tipos de dados. Embora os dados possam ser usados principalmente por software de análise automatizada, o acesso a dados de genoma ou resultados de testes de pacientes específicos ainda é possível. Nesses casos, o Data Masking deve ser usado para tornar essas informações não identificáveis pessoalmente.

Exemplo 2:

Uma empresa processadora de cartões de crédito fornece um conjunto de serviços usando dados sensíveis, tais como:

*   Processar um grande número de transações financeiras por segundo.
*   Armazenar uma grande quantidade de dados relacionados à transação.
*   Proteger dados relacionados à transação com requisitos rigorosos para dados pessoais.

*   Lidar com reclamações de clientes sobre transações usando dados reversíveis ou parcialmente mascarados.

Uma transação típica pode incluir muitos tipos de informações sensíveis, incluindo:

*   Número do cartão de crédito.
*   Tipo e valor da transação.
*   Tipo de comerciante.
*   Criptograma da transação (para confirmar a legitimidade da transação).
*   Geolocalização do terminal equipado com GPS (para detecção de fraude).

Esses tipos de informação podem então ser unidos (joined) dentro de um banco ou outra instituição financeira emissora de cartão com dados pessoais do cliente, tais como:

*   Nome completo do cliente (pessoa ou empresa).
*   Endereço.
*   Data de nascimento.
*   Social Security number.
*   Endereço de e-mail.
*   Número de telefone.

Várias funções de funcionários, tanto na empresa processadora de cartões quanto na instituição financeira, exigem acesso a esses dados. Algumas dessas funções podem exigir acesso apenas a dados mascarados. Outras funções podem exigir acesso aos dados originais, caso a caso, o que é registrado em logs de auditoria.

O Masking e o De-Identification são centrais para a conformidade regulatória, portanto, o MySQL Enterprise Data Masking e De-Identification pode ajudar desenvolvedores de aplicações a satisfazer os requisitos de privacidade:

*   PCI – DSS: Dados de Cartões de Pagamento.
*   HIPAA: Privacidade de Dados de Saúde, Health Information Technology for Economic and Clinical Health Act (HITECH Act).

*   EU General Data Protection Directive (GDPR): Proteção de Dados Pessoais.

*   Data Protection Act (Reino Unido): Proteção de Dados Pessoais.
*   Sarbanes Oxley, GLBA, The USA Patriot Act, Identity Theft and Assumption Deterrence Act of 1998.

*   FERPA – Student Data, NASD, CA SB1386 e AB 1950, State Data Protection Laws, Basel II.

As seções a seguir descrevem os elementos do MySQL Enterprise Data Masking e De-Identification, discutem como instalá-lo e usá-lo, e fornecem informações de referência para seus elementos.