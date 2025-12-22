## 3.3 Reforçar as melhores práticas

O MySQL suporta a atualização entre versões menores (dentro de uma série LTS) e para a próxima versão principal (em uma série LTS).

Para se preparar e ajudar a garantir que sua atualização para a versão mais recente do MySQL seja bem-sucedida, recomendamos as seguintes melhores práticas:

- Decidir sobre a versão maior ou menor para atualização
- Decidir sobre o tipo de atualização
- Revisão das plataformas suportadas
- Compreender alterações no servidor MySQL
- Executar o verificador de atualização e corrigir incompatibilidades
- Executar aplicações num ambiente de teste
- Aplicações de referência e desempenho da carga de trabalho
- Executar ambas as versões do MySQL em paralelo
- Executar a actualização de teste final
- Verifique o backup do MySQL
- Atualizar o servidor de produção
- Apoio às empresas

### Decidir sobre a versão maior ou menor para atualização

O modelo de lançamento do MySQL faz uma distinção entre LTS (Suporte a Longo Prazo) e lançamentos de inovação.

A realização de uma atualização de versão menor é direta, enquanto as atualizações de versão principal exigem planejamento estratégico e testes adicionais antes da atualização.

### Decidir sobre o tipo de atualização

Existem três maneiras principais de atualizar o MySQL; leia a documentação associada para determinar qual tipo de atualização é mais adequado para sua situação.

- Uma atualização local: substituição dos pacotes do MySQL Server.
- Uma atualização lógica: exportando SQL da antiga instância do MySQL para o novo.
- Uma atualização de topologia de replicação: contabiliza a função de topologia de cada servidor.

### Revisão das plataformas suportadas

Se o seu sistema operacional atual não for suportado pela nova versão do MySQL, planeje atualizar o sistema operacional, pois de outra forma uma atualização no local não será suportada.

Para uma lista atual de plataformas suportadas, consulte: \[<https://www.mysql.com/support/supportedplatforms/database.html>]

### Compreender alterações no servidor MySQL

Cada versão principal vem com novos recursos, mudanças de comportamento, deprecações e remoções. É importante entender o impacto de cada um deles em aplicativos existentes.

Ver: Secção 3.5, "Mudanças no MySQL 8.4".

### Executar o verificador de atualização e corrigir incompatibilidades

O Utilitário de Verificador de Atualização do MySQL Shell detecta incompatibilidades entre versões de banco de dados que devem ser resolvidas antes de executar a atualização. A função \*\*util.checkForServerUpgrade) verifica se as instâncias do servidor MySQL estão prontas para atualização. Conecte-se ao servidor MySQL existente e selecione a versão do MySQL Server para a qual você planeja atualizar para que o utilitário informe problemas a serem resolvidos antes de uma atualização. Estes incluem incompatibilidades em tipos de dados, motores de armazenamento e assim por diante.

Você está pronto para atualizar quando o utilitário de verificação de atualização não mais relata quaisquer problemas.

### Executar aplicações num ambiente de teste

Depois de completar os requisitos do verificador de atualização, teste seus aplicativos no novo servidor MySQL de destino. Verifique se há erros e avisos no registro de erros e aplicativos do MySQL.

### Aplicações de referência e desempenho da carga de trabalho

Recomendamos comparar seus próprios aplicativos e cargas de trabalho comparando como eles executam usando as versões anteriores e novas do MySQL. Geralmente, versões mais recentes do MySQL adicionam recursos e melhoram o desempenho, mas há casos em que uma atualização pode ser mais lenta para consultas específicas.

- Configuração anterior do servidor não é otimizada para versões mais recentes
- Alterações dos tipos de dados
- Armazenamento adicional exigido pelo suporte a conjuntos de caracteres de vários bytes
- Alterações nos motores de armazenamento
- Índices descartados ou alterados
- Encriptação mais forte
- Autenticação mais forte
- Alterações do optimizador SQL
- Versão mais recente do MySQL requer memória adicional
- Hardware físico ou virtual é mais lento - computação ou armazenamento

Para obter informações relacionadas e técnicas potenciais de mitigação, ver Regressões de Desempenho Validas.

### Executar ambas as versões do MySQL em paralelo

Para minimizar o risco, é melhor manter o sistema atual funcionando enquanto o sistema atualizado é executado em paralelo.

### Executar a actualização de teste final

Pratique e faça uma corrida antes de atualizar seu servidor de produção. Teste completamente os procedimentos de atualização antes de atualizar um sistema de produção.

### Verifique o backup do MySQL

Verifique se o backup completo existe e é viável antes de executar a atualização.

### Atualizar o servidor de produção

Está pronto para completar a atualização.

### Apoio às empresas

Se você é um cliente do MySQL Enterprise Edition, você também pode entrar em contato com os especialistas da equipe de suporte do MySQL com quaisquer perguntas que você possa ter.
