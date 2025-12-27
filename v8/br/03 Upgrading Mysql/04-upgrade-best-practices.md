## 3.3 Práticas de Atualização

O MySQL suporta a atualização entre versões menores (dentro de uma série LTS) e para a próxima versão principal (através de uma série LTS). A atualização fornece os recursos mais recentes, desempenho e correções de segurança.

Para preparar e ajudar a garantir que sua atualização para a versão mais recente do MySQL seja bem-sucedida, recomendamos as seguintes melhores práticas:

*  Decida sobre a Versão Principal ou Menor para a Atualização
*  Decida sobre o Tipo de Atualização
*  Revise as Plataformas Suportadas
*  Entenda as Mudanças no Servidor MySQL
*  Execute o Verificador de Atualização e Corrija Incompatibilidades
*  Execute as Aplicações em um Ambiente de Teste
*  Avalie o Desempenho das Aplicações e do Carregamento de Trabalho
*  Execute Ambas as Versões do MySQL Paralelamente
*  Execute a Atualização de Teste Final
*  Verifique o Backup do MySQL
*  Atualize o Servidor de Produção
*  Suporte Empresarial

### Decida sobre a Versão Principal ou Menor para a Atualização

O Modelo de Lançamento do MySQL faz uma distinção entre as versões LTS (Suporte de Longo Prazo) e as versões de Inovação. As versões LTS têm suporte por mais de 8 anos e são destinadas ao uso em produção. As versões de Inovação fornecem aos usuários os recursos e capacidades mais recentes. Saiba mais sobre o Modelo de Lançamento do MySQL.

Realizar uma atualização de versão menor é simples, enquanto as atualizações de versão principal requerem planejamento estratégico e testes adicionais antes da atualização. Este guia é especialmente útil para atualizações de versão principal.

### Decida sobre o Tipo de Atualização

Existem três maneiras principais de atualizar o MySQL; leia a documentação associada para determinar qual tipo de atualização é mais adequado para sua situação.

* Uma atualização in-place: substituindo os pacotes do Servidor MySQL.
* Uma atualização lógica: exportando o SQL da antiga instância do MySQL para a nova.
* Uma atualização de topologia de replicação: considere o papel de topologia de cada servidor.

### Revise as Plataformas Suportadas

Se o seu sistema operacional atual não for suportado pela nova versão do MySQL, planeje atualizar o sistema operacional, pois, caso contrário, uma atualização in-place não é suportada.

Para uma lista atualizada das plataformas suportadas, consulte: <https://www.mysql.com/support/supportedplatforms/database.html>

### Entenda as Mudanças no MySQL Server

Cada versão principal vem com novos recursos, mudanças no comportamento, descontinuidades e remoções. É importante entender o impacto de cada uma dessas mudanças nos aplicativos existentes.

Veja: Seção 3.5, “Mudanças no MySQL 8.4”.

### Execute o Verificador de Atualização e Corrija Incompatibilidades

A Ferramenta de Verificador de Atualização do MySQL Shell detecta incompatibilidades entre as versões do banco de dados que devem ser resolvidas antes de realizar a atualização. A função `util.checkForServerUpgrade()` verifica se as instâncias do servidor MySQL estão prontas para a atualização. Conecte-se ao servidor MySQL existente e selecione a versão do MySQL Server que você planeja atualizar para que a ferramenta informe os problemas a serem resolvidos antes da atualização. Esses incluem incompatibilidades em tipos de dados, motores de armazenamento e assim por diante.

Você está pronto para atualizar quando a ferramenta de verificação de atualização não mais relatar quaisquer problemas.

### Execute Aplicações em um Ambiente de Teste

Após completar os requisitos do verificador de atualização, teste suas aplicações no novo servidor MySQL de destino. Verifique erros e avisos no log de erro do MySQL e nos logs das aplicações.

### Benchmark de Aplicações e Desempenho de Carga de Trabalho

Recomendamos que você faça o benchmarking de suas próprias aplicações e cargas de trabalho, comparando como elas se comportam usando as versões anteriores e novas do MySQL. Geralmente, versões mais recentes do MySQL adicionam recursos e melhoram o desempenho, mas há casos em que uma atualização pode ser mais lenta para consultas específicas. Possíveis problemas resultando em regressão de desempenho:

* A configuração do servidor anterior não é ideal para a versão mais recente
* Alterações nos tipos de dados
* Armazenamento adicional necessário para o suporte ao conjunto de caracteres multi-byte
* Alterações nos motores de armazenamento
* Índices eliminados ou alterados
* Criptografia mais forte
* Autenticação mais forte
* Alterações no otimizador SQL
* A versão mais recente do MySQL requer mais memória
* O hardware físico ou virtual é mais lento - computação ou armazenamento

Para informações relacionadas e técnicas de mitigação potenciais, consulte Regressões de Desempenho Válidas.

### Execute Ambas as Versões do MySQL Paralelamente

Para minimizar o risco, é melhor manter o sistema atual em funcionamento enquanto executa o sistema atualizado em paralelo.

### Execute a Atualização de Teste Final

Pratique e execute antes de atualizar seu servidor de produção. Teste minuciosamente os procedimentos de atualização antes de atualizar um sistema de produção.

### Verifique o Backup do MySQL

Verifique se o backup completo existe e é viável antes de realizar a atualização.

### Atualize o Servidor de Produção

Você está pronto para concluir a atualização.

### Suporte Empresarial

Se você é cliente da Edição Empresarial do MySQL, também pode entrar em contato com os especialistas da equipe de suporte do MySQL com quaisquer perguntas que possa ter.