## 3.3 Práticas de Melhoria

O MySQL suporta a atualização entre versões menores (dentro de uma série LTS) e para a próxima versão principal (dentro de uma série LTS). A atualização oferece as últimas funcionalidades, desempenho e correções de segurança.

Para preparar e ajudar a garantir que sua atualização para a versão mais recente do MySQL seja bem-sucedida, recomendamos as seguintes melhores práticas:

* Decida sobre a Versão Principal ou Secundária para Atualização
* Decida sobre o Tipo de Atualização
* Revise as Plataformas Suportadas
* Entenda as Alterações no Servidor MySQL
* Execute o Verificador de Atualização e Corrija Incompatibilidades
* Execute Aplicações em um Ambiente de Teste
* Compruebe o Desempenho das Aplicações e do Carregamento de Trabalho
* Execute Ambas as Versões do MySQL em Paralelo
* Execute a Atualização Final de Teste
* Verifique o Backup do MySQL
* Atualize o Servidor de Produção
* Suporte Empresarial

### Decida sobre a versão principal ou secundária para a atualização

O Modelo de Lançamento do MySQL faz uma distinção entre Releases LTS (Suporte de Longo Prazo) e Releases de Inovação. As versões LTS têm mais de 8 anos de suporte e são destinadas ao uso em produção. As Releases de Inovação fornecem aos usuários as últimas funcionalidades e capacidades. Saiba mais sobre o [Modelo de Lançamento do MySQL][(https://blogs.oracle.com/mysql/post/introducing-mysql-innovation-and-longterm-support-lts-versions)].

Realizar uma atualização de versão menor é simples, enquanto as atualizações de versão maior exigem planejamento estratégico e testes adicionais antes da atualização. Este guia é especialmente útil para atualizações de versão maior.

### Decida sobre o tipo de atualização

Existem três maneiras principais de atualizar o MySQL, leia a documentação associada para determinar qual tipo de atualização é mais adequado para sua situação.

* Atualização in-place (upgrade-binary-package.html#upgrade-procedure-inplace "In-Place Upgrade"): Substituindo os pacotes do MySQL Server.

* [Um upgrade lógico][(upgrade-binary-package.html#upgrade-procedure-logical "Logical Upgrade")]: exportar SQL da antiga instância MySQL para a nova.

* [Atualização da topologia de replicação](replication-upgrade.html "19.5.3 Upgrading a Replication Topology"): considere o papel da topologia de cada servidor.

### Revisão de Plataformas Suporteadas

Se o seu sistema operacional atual não for suportado pela nova versão do MySQL, planeje fazer uma atualização do sistema operacional, pois, caso contrário, uma atualização local não será suportada.

Para uma lista atualizada das plataformas suportadas, consulte: <https://www.mysql.com/support/supportedplatforms/database.html>

### Entenda as mudanças no MySQL Server

Cada versão principal vem com novos recursos, mudanças de comportamento, deprecações e remoções. É importante entender o impacto de cada um desses em aplicativos existentes.

Veja: Seção 3.5, “Alterações no MySQL 8.0”.

### Execute o Verificador de Atualização e corrija as incompatibilidades

A Ferramenta de verificação de atualização do MySQL Shell detecta incompatibilidades entre as versões do banco de dados que devem ser resolvidas antes de realizar a atualização. A função **util.checkForServerUpgrade()** verifica se as instâncias do servidor MySQL estão prontas para atualização. Conecte-se ao servidor MySQL existente e selecione a versão do MySQL Server que você planeja atualizar para que a ferramenta informe problemas a serem resolvidos antes da atualização. Esses incluem incompatibilidades em tipos de dados, motores de armazenamento, etc.

Você está pronto para fazer a atualização quando o utilitário de verificação de atualização não reportar mais quaisquer problemas.

### Executar aplicativos em um ambiente de teste

Após completar os requisitos do verificador de atualização, teste suas aplicações no novo servidor MySQL de destino. Verifique erros e avisos no log de erro do MySQL e nos logs da aplicação.

### Aplicativos de referência e desempenho de carga de trabalho

Recomendamos que você faça uma comparação entre suas próprias aplicações e cargas de trabalho, comparando como elas se comportam usando as versões anteriores e as novas do MySQL. Geralmente, as versões mais recentes do MySQL adicionam recursos e melhoram o desempenho, mas há casos em que uma atualização pode ser mais lenta para consultas específicas. Possíveis problemas que resultam em regressão de desempenho:

* A configuração do servidor anterior não é ótima para a versão mais recente
* Alterações nos tipos de dados
* Armazenamento adicional necessário para suporte a conjunto de caracteres multiletra
* Armazenamento adicional necessário para suporte a conjunto de caracteres multiletra

* Alterações nos motores de armazenamento
* Índices descartados ou alterados
* Criptografia mais forte
* Autenticação mais forte
* Alterações no otimizador SQL
* Versão mais nova do MySQL requer memória adicional
* O hardware físico ou virtual é mais lento - computação ou armazenamento

Para informações relacionadas e técnicas de mitigação potenciais, consulte Regressões de desempenho válidas.

### Execute ambas as versões do MySQL em paralelo

Para minimizar o risco, é melhor manter o sistema atual funcionando enquanto o sistema atualizado é executado em paralelo.

### Realize a atualização do teste final

Pratique e faça um teste antes de atualizar seu servidor de produção. Teste minuciosamente os procedimentos de atualização antes de atualizar um sistema de produção.

### Verificar o backup do MySQL

Verifique se o backup completo existe e é viável antes de realizar a atualização.

### Atualize o servidor de produção

Você está pronto para completar a atualização.

### Suporte Empresarial

Se você é um cliente da Edição Empresarial do MySQL, também pode entrar em contato com os especialistas da equipe de suporte do MySQL para qualquer dúvida que possa ter.