## 8.8 Suporte FIPS

O MySQL suporta o modo FIPS quando uma biblioteca OpenSSL compatível e o Módulo de Objeto FIPS estão disponíveis no sistema hospedeiro.

O modo FIPS no lado do servidor aplica-se às operações criptográficas realizadas pelo servidor. Isso inclui a replicação (fonte/replica e replicação por grupo) e o X Plugin, que são executados dentro do servidor. O modo FIPS também se aplica às tentativas dos clientes de se conectarem ao servidor.

As seções a seguir descrevem o modo FIPS e como aproveitar ao máximo esse recurso no MySQL:

- Visão geral do FIPS
- Requisitos do sistema para o modo FIPS no MySQL
- Habilitar o Modo FIPS no MySQL

### Visão geral do FIPS

Os Padrões de Processamento de Informações Federais 140-2 (FIPS 140-2) descrevem um padrão de segurança que pode ser exigido por agências federais (governo dos EUA) para módulos criptográficos usados para proteger informações sensíveis ou valiosas. Para ser considerado aceitável para uso federal, um módulo criptográfico deve ser certificado para o FIPS 140-2. Se um sistema destinado a proteger dados sensíveis não tiver o certificado adequado do FIPS 140-2, as agências federais não poderão comprá-lo.

Produtos como o OpenSSL podem ser usados no modo FIPS, embora a própria biblioteca OpenSSL não seja validada para FIPS. Em vez disso, a biblioteca OpenSSL é usada com o Módulo de Objeto FIPS do OpenSSL para permitir que aplicativos baseados no OpenSSL funcionem no modo FIPS.

Para obter informações gerais sobre o FIPS e sua implementação no OpenSSL, essas referências podem ser úteis:

- Instituto Nacional de Padrões e Tecnologia FIPS PUB 140-2

- Política de Segurança OpenSSL FIPS 140-2

- página de manual do módulo fips

Importante

O modo FIPS impõe condições às operações criptográficas, como restrições a algoritmos de criptografia aceitáveis ou requisitos para comprimentos de chave mais longos. Para o OpenSSL, o comportamento exato do FIPS depende da versão do OpenSSL.

### Requisitos do sistema para o modo FIPS no MySQL

Para que o MySQL suporte o modo FIPS, esses requisitos de sistema devem ser atendidos:

1. O MySQL deve ser compilado com uma versão do OpenSSL certificada para uso com FIPS. O OpenSSL 1.0.2 e o OpenSSL 3.0 são certificados, mas o OpenSSL 1.1.1 não o é. As distribuições binárias para versões recentes do MySQL são compiladas usando o OpenSSL 3.0 em algumas plataformas, o que significa que não são certificadas para FIPS. Isso significa que você tem as seguintes opções, dependendo da configuração do sistema e do MySQL:

   - Use um sistema que tenha o OpenSSL 3.0 e o módulo de objeto FIPS necessário. Nesse caso, você pode habilitar o modo FIPS para o MySQL se usar uma distribuição binária compilada com o OpenSSL 3.0, ou compilar o MySQL a partir da fonte usando o OpenSSL 3.0.

     Para obter informações gerais sobre a atualização para o OpenSSL 3.0, consulte o Guia de Migração do OpenSSL 3.0.

   - Use um sistema que tenha o OpenSSL 1.1.1 ou superior. Nesse caso, você pode instalar o MySQL usando pacotes binários e pode usar o protocolo TLS v1.3 e as suítes de cifra, além de outros protocolos TLS já suportados. No entanto, você não pode habilitar o modo FIPS para o MySQL.

   - Use um sistema que tenha o OpenSSL 1.0.2 e o módulo de objeto FIPS necessário. Nesse caso, você pode habilitar o modo FIPS para o MySQL se usar uma distribuição binária compilada com o OpenSSL 1.0.2, ou compilar o MySQL a partir da fonte com o OpenSSL 1.0.2. Nesse caso, você não pode usar o protocolo TLS v1.3 ou as suítes de cifra, que exigem o OpenSSL 1.1.1 ou 3.0. Além disso, você deve estar ciente de que o OpenSSL 1.0.2 alcançou o status de fim de vida em 2019, e que todas as plataformas operacionais que integram o OpenSSL 1.1.1 alcançam seu fim de vida em 2024.

2. Durante a execução, a biblioteca OpenSSL e o módulo de objeto OpenSSL FIPS devem estar disponíveis como objetos compartilhados (ligados dinamicamente).

### Habilitar o Modo FIPS no MySQL

Nota

No MySQL 8.0.34 e versões posteriores, a configuração no lado do servidor e no lado do cliente descrita no final desta seção não é mais necessária.

Para determinar se o MySQL está em execução em um sistema com o modo FIPS habilitado, verifique o valor da variável de sistema do servidor `ssl_fips_mode` usando uma instrução SQL como `SHOW VARIABLES LIKE '%fips%'` ou `SELECT @@ssl_fips_mode`. Se o valor dessa variável for 1 (`ON`) ou 2 (`STRICT`), o modo FIPS está habilitado para o OpenSSL; se for 0 (`OFF`), o modo FIPS não está disponível.

Importante

Em geral, `STRICT` impõe mais restrições do que `ON`, mas o próprio MySQL não possui um código específico para FIPS, exceto para especificar o valor do modo FIPS para o OpenSSL. O comportamento exato do modo FIPS para `ON` ou `STRICT` depende da versão do OpenSSL. Para obter detalhes, consulte a página de manual `fips_module` (veja a Visão Geral de FIPS).

O modo FIPS no lado do servidor aplica-se às operações criptográficas realizadas pelo servidor, incluindo aquelas realizadas pela Replicação do MySQL (incluindo a Replicação por Grupo) e pelo Plugin X, que são executadas dentro do servidor.

O modo FIPS também se aplica às tentativas dos clientes de se conectarem ao servidor. Quando ativado, seja no lado do cliente ou do servidor, ele restringe quais dos criptogramas de criptografia suportados podem ser escolhidos. No entanto, a ativação do modo FIPS não exige que uma conexão criptografada seja usada ou que as credenciais do usuário sejam criptografadas. Por exemplo, se o modo FIPS estiver ativado, algoritmos criptográficos mais fortes são necessários. Em particular, o MD5 é restrito, então tentar estabelecer uma conexão criptografada usando um criptograma de criptografia como `RC4-MD5` não funciona. Mas não há nada sobre o modo FIPS que impeça o estabelecimento de uma conexão não criptografada. (Para fazer isso, você pode usar a cláusula `REQUIRE` para `CREATE USER` ou `ALTER USER` para contas de usuário específicas, ou definir a variável de sistema `require_secure_transport` para afetar todas as contas.)

Se o modo FIPS for necessário, é recomendável usar uma plataforma operacional que o inclua; se ela o incluir, você pode (e deve) usá-lo. Se sua plataforma não incluir o FIPS, você tem duas opções:

- Mude para uma plataforma que tenha suporte FIPS OpenSSL.
- Construa a biblioteca OpenSSL e o módulo de objeto FIPS a partir do código-fonte, seguindo as instruções da página de manual `fips_module` (consulte a Visão Geral do FIPS).

**MySQL 8.0.34 e versões anteriores**: O controle do modo FIPS no lado do servidor e no lado do cliente foi realizado usando as variáveis de sistema listadas aqui:

- A variável de sistema `ssl_fips_mode` controla se o servidor opera no modo FIPS.

- A opção de cliente `--ssl-fips-mode` controla se um cliente MySQL específico opera no modo FIPS.

A variável de sistema `ssl_fips_mode` e a opção de cliente `--ssl-fips-mode` permitem esses valores:

- `OFF`: Desative o modo FIPS.
- `ON`: Habilitar o modo FIPS.
- `STRICT`: Habilitar o modo FIPS "estricto".

Nota

Se o Módulo de Objeto FIPS OpenSSL não estiver disponível, o único valor permitido para `ssl_fips_mode` e `--ssl-fips-mode` é `OFF`. Um erro ocorre para tentativas de definir o modo FIPS para um valor diferente.
