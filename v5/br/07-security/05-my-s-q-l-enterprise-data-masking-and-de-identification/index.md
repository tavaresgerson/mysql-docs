## 6.5 Mascagem e desidentificação de dados da MySQL Enterprise

Nota

O MySQL Enterprise Data Masking and De-Identification é uma extensão incluída na MySQL Enterprise Edition, um produto comercial. Para saber mais sobre produtos comerciais, <https://www.mysql.com/products/>.

A partir do MySQL 5.7.24, a Edição Empresarial do MySQL oferece capacidades de mascaramento e desidentificação de dados:

- Transformação dos dados existentes para mascará-los e remover características identificáveis, como alterar todos os dígitos de um número de cartão de crédito, mas os últimos quatro para caracteres `'X'`.

- Geração de dados aleatórios, como endereços de e-mail e números de cartões de pagamento.

A forma como as aplicações utilizam essas capacidades depende do propósito para o qual os dados são usados e de quem os acessa:

- Aplicações que utilizam dados sensíveis podem protegê-los realizando o mascaramento de dados e permitindo o uso de dados parcialmente mascarados para identificação do cliente. Exemplo: um centro de atendimento ao cliente pode solicitar que os clientes forneçam os últimos quatro dígitos do número do Seguro Social.

- Aplicações que exigem dados formatados corretamente, mas não necessariamente os dados originais, podem sintetizar dados de amostra. Exemplo: um desenvolvedor de aplicativos que está testando validadores de dados, mas não tem acesso aos dados originais, pode sintetizar dados aleatórios com o mesmo formato.

Exemplo 1:

As instalações de pesquisa médica podem armazenar dados de pacientes que incluem uma mistura de dados pessoais e médicos. Isso pode incluir sequências genéticas (longas cadeias de caracteres), resultados de testes armazenados no formato JSON e outros tipos de dados. Embora os dados possam ser usados principalmente por softwares de análise automatizados, o acesso a dados genômicos ou resultados de testes de pacientes específicos ainda é possível. Nesses casos, o mascaramento de dados deve ser usado para tornar essas informações não identificáveis pessoalmente.

Exemplo 2:

Uma empresa de processamento de cartões de crédito oferece um conjunto de serviços que utilizam dados sensíveis, como:

- Processar um grande número de transações financeiras por segundo.

- Armazenar uma grande quantidade de dados relacionados a transações.

- Proteger os dados relacionados às transações com requisitos rigorosos para os dados pessoais.

- Lidar com reclamações dos clientes sobre transações usando dados reversíveis ou parcialmente mascarados.

Uma transação típica pode incluir muitos tipos de informações sensíveis, incluindo:

- Número do cartão de crédito.
- Tipo e valor da transação.
- Tipo de comerciante.
- Criptograma da transação (para confirmar a legitimidade da transação).
- Geolocalização do terminal equipado com GPS (para detecção de fraudes).

Esses tipos de informações podem então ser agregados a dados pessoais do cliente de uma instituição financeira, como:

- Nome completo do cliente (pessoa ou empresa).
- Endereço.
- Data de nascimento.
- Número do Seguro Social.
- Endereço de e-mail.
- Número de telefone.

Vários papéis de funcionários, tanto na empresa de processamento de cartões quanto na instituição financeira, exigem acesso a esses dados. Alguns desses papéis podem exigir acesso apenas a dados mascarados. Outros papéis podem exigir acesso aos dados originais caso a caso, o que é registrado em logs de auditoria.

O mascaramento e a desidentificação são fundamentais para a conformidade regulatória, portanto, o MySQL Enterprise Data Masking and De-Identification pode ajudar os desenvolvedores de aplicativos a atender aos requisitos de privacidade:

- PCI – DSS: Dados de Cartões de Pagamento.

- HIPAA: Privacidade de Dados de Saúde, Lei de Tecnologia de Informação em Saúde Econômica e Clínica (HITECH).

- Diretiva Geral de Proteção de Dados da UE (GDPR): Proteção de Dados Pessoais.

- Lei de Proteção de Dados (Reino Unido): Proteção de Dados Pessoais.

- Sarbanes Oxley, GLBA, A Lei Patriota dos EUA, Lei de Proteção contra o Roubo de Identidade e Lei de Disuasão à Assunção de 1998.

- FERPA – Dados de estudantes, NASD, CA SB1386 e AB 1950, leis estaduais de proteção de dados, Basel II.

As seções a seguir descrevem os elementos da Máscara de Dados e Desidentificação Empresarial do MySQL, discutem como instalá-los e usá-los, e fornecem informações de referência sobre seus elementos.
